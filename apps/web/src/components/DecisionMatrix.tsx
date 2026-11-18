"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, ArrowRight, Download, Printer } from "lucide-react";
import type { ScenarioOption } from "../lib/types";

interface DecisionMatrixProps {
  scenarios: ScenarioOption[];
  selectedRegion: string;
  onSelectOption?: (optionId: string) => void;
  onNavigateToChat?: (query: string) => void;
}

export function DecisionMatrix({ scenarios, selectedRegion, onNavigateToChat }: DecisionMatrixProps) {
  const [selectedId, setSelectedId] = useState<string>("opt-d");
  const [adoptedOption, setAdoptedOption] = useState<string | null>("opt-d");
  const [sortBy, setSortBy] = useState<"default" | "cost" | "flood" | "groundwater">("default");

  const sortedScenarios = [...scenarios].sort((a, b) => {
    if (sortBy === "cost") return a.cost_crores - b.cost_crores;
    if (sortBy === "flood") return b.flood_risk_reduction_pct - a.flood_risk_reduction_pct;
    if (sortBy === "groundwater") return b.groundwater_recharge_pct - a.groundwater_recharge_pct;
    return 0;
  });

  const selectedScenario = scenarios.find((s) => s.id === selectedId) || scenarios[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="matrix-brief border border-notion-border rounded-xl overflow-hidden">
        <div className="matrix-brief-heading grid lg:grid-cols-[minmax(0,1fr)_auto] items-center gap-5 p-5 sm:p-7">
          <div>
            <div className="text-sm font-semibold text-teal-300 mb-2">
              Decision Matrix & Trade-Offs
            </div>
            <h1 className="matrix-title text-notion-text">
              {selectedRegion}: Climate Resilience Intervention Comparison
            </h1>
            <p className="text-sm text-notion-secondary mt-3 max-w-[72ch] leading-relaxed">
              Compare strategic options under the benchmark <strong>Rs. 50 Crore</strong> municipal capital budget envelope. The multi-objective engine calculates secondary impacts on aquifer recharge, downstream runoff, and urban heat.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
            <div className="border-l-2 border-teal-400/60 pl-3">
              <span className="text-xs text-notion-secondary block font-medium mb-1">Benchmark Budget</span>
              <span className="text-base sm:text-lg font-bold text-teal-300 font-mono">Rs. 50.0 Cr</span>
            </div>
            <div className="border-l-2 border-teal-400/60 pl-3">
              <span className="text-xs text-notion-secondary block font-medium mb-1">Optimal Headroom</span>
              <span className="text-base sm:text-lg font-bold text-cyan-300 font-mono">Rs. 15.0 Cr Saved</span>
            </div>
          </div>
        </div>

        {/* Sort & Filter Controls */}
        <div className="bg-notion-sidebar px-5 sm:px-7 py-3 border-t border-notion-border flex flex-wrap items-center justify-between gap-3 text-sm">
          <div role="group" aria-label="Sort options" className="flex flex-wrap items-center gap-1.5">
            <span className="text-notion-secondary text-xs font-medium mr-1">Sort Options:</span>
            {([
              ["default", "Default"],
              ["flood", "Highest Flood Safety"],
              ["groundwater", "Best Aquifer Recharge"],
              ["cost", "Lowest Cost"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSortBy(value)}
                aria-pressed={sortBy === value}
                className="rounded-md border border-transparent px-2.5 py-2 text-xs sm:text-sm text-notion-secondary hover:bg-notion-hover cursor-pointer aria-pressed:border-teal-400/30 aria-pressed:bg-teal-400/10 aria-pressed:!text-teal-300"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-notion-sidebar hover:bg-notion-hover text-notion-text rounded-lg border border-notion-border text-xs sm:text-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export Decision Memo</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 4-Option Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedScenarios.map((option) => {
          const isSelected = selectedId === option.id;
          const isRec = option.is_recommended;

          return (
            <div
              key={option.id}
              className={`relative rounded-xl p-5 border flex flex-col ${
                isRec
                  ? "bg-notion-sidebar border-teal-400/65"
                  : isSelected
                  ? "bg-notion-sidebar border-teal-300"
                  : "bg-notion-sidebar border-notion-border hover:border-notion-secondary"
              }`}
            >
              <div className="flex flex-1 flex-col">
                <div className="flex flex-col items-start gap-2 mb-2">
                  <h2 className="font-bold text-notion-text text-sm sm:text-base leading-snug">
                    {option.name}
                  </h2>
                  {isRec && (
                    <span className="text-teal-300 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-notion-secondary mb-4 line-clamp-2 leading-relaxed">
                  {option.description}
                </p>

                {/* Score Table */}
                <div className="mt-auto space-y-2 text-sm bg-notion-bg rounded-lg p-3.5 border border-notion-border font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-notion-secondary font-sans text-xs sm:text-sm">Flood Containment:</span>
                    <span className="font-bold text-emerald-500 text-sm sm:text-base">-{option.flood_risk_reduction_pct}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-notion-secondary font-sans text-xs sm:text-sm">Aquifer Recharge:</span>
                    <span
                      className={`font-bold text-sm sm:text-base ${
                        option.groundwater_recharge_pct > 0 ? "text-cyan-500" : "text-rose-500"
                      }`}
                    >
                      {option.groundwater_recharge_pct > 0
                        ? `+${option.groundwater_recharge_pct}%`
                        : `${option.groundwater_recharge_pct}%`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-notion-secondary font-sans text-xs sm:text-sm">Heat Mitigation:</span>
                    <span className="font-bold text-amber-500 text-sm sm:text-base">-{option.urban_heat_reduction_deg}°C</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-notion-border pt-2">
                    <span className="text-notion-secondary font-sans text-xs sm:text-sm">Estimated Cost:</span>
                    <span className="font-bold text-notion-text text-sm sm:text-base">Rs. {option.cost_crores} Cr</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-notion-border flex items-center justify-between text-xs sm:text-sm">
                <span className="text-notion-secondary">{option.implementation_months} mo timeline</span>
                <button
                  onClick={() => setSelectedId(option.id)}
                  aria-label={`Inspect ${option.name}`}
                  aria-pressed={isSelected}
                  className={`scenario-inspect cursor-pointer font-semibold flex items-center space-x-1 ${
                    isSelected ? "text-emerald-500" : "text-notion-secondary"
                  }`}
                >
                  <span>{isSelected ? "Inspecting" : "Select Option"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Scenario Deep-Dive & Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Details & Hidden Trade-off */}
        <div className="lg:col-span-2 bg-notion-sidebar border border-notion-border rounded-xl p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-notion-border pb-4">
            <div>
              <span className="text-xs text-notion-secondary uppercase tracking-wider font-semibold">
                Detailed Strategy Evaluation
              </span>
              <h2 className="text-base sm:text-lg font-bold text-notion-text mt-0.5">
                {selectedScenario.name}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="px-3 py-1 rounded-lg bg-notion-bg text-notion-text border border-notion-border font-mono font-bold">
                Rs. {selectedScenario.cost_crores} Cr
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                Feasibility: {selectedScenario.feasibility_score} / 100
              </span>
            </div>
          </div>

          {/* Hidden Trade-off Callout */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs sm:text-sm text-amber-600 dark:text-amber-200 space-y-1.5">
            <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-2 text-sm sm:text-base">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Cross-System Trade-Off Analysis</span>
            </div>
            <p className="leading-relaxed">{selectedScenario.tradeoff_note}</p>
          </div>

          {/* Advantages vs Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-notion-bg border border-notion-border rounded-xl p-4">
              <h3 className="font-bold text-emerald-500 uppercase text-xs tracking-wider mb-2.5 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Primary Operational Strengths</span>
              </h3>
              <ul className="space-y-1.5 text-notion-text">
                {selectedScenario.advantages.map((adv, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span className="leading-relaxed">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-notion-bg border border-notion-border rounded-xl p-4">
              <h3 className="font-bold text-rose-500 uppercase text-xs tracking-wider mb-2.5 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Regulatory & Implementation Limitations</span>
              </h3>
              <ul className="space-y-1.5 text-notion-text">
                {selectedScenario.disadvantages.map((dis, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span className="leading-relaxed">{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Municipal Adoption Panel */}
        <div className="bg-notion-sidebar border border-notion-border rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-sm">
          <div>
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
              Official Decision Approval
            </div>
            <h3 className="text-base sm:text-lg font-bold text-notion-text">Municipal Council Action</h3>
            <p className="text-xs sm:text-sm text-notion-secondary mt-1 leading-relaxed">
              The AI Decision Engine presents quantitative simulations and trade-off rationales. The official authority records the final adoption.
            </p>

            <div className="mt-4 space-y-2.5 bg-notion-bg rounded-xl p-4 border border-notion-border text-xs sm:text-sm font-mono">
              <div className="flex justify-between text-notion-text">
                <span className="font-sans text-notion-secondary">Strategy:</span>
                <span className="font-bold text-notion-text">{selectedScenario.name.split(":")[0]}</span>
              </div>
              <div className="flex justify-between text-notion-text">
                <span className="font-sans text-notion-secondary">Capital Outlay:</span>
                <span className="font-bold text-emerald-500">Rs. {selectedScenario.cost_crores} Cr</span>
              </div>
              <div className="flex justify-between text-notion-text">
                <span className="font-sans text-notion-secondary">Fiscal Reserve:</span>
                <span className="font-bold text-cyan-500">Rs. {50 - selectedScenario.cost_crores} Cr</span>
              </div>
              <div className="flex justify-between text-notion-text border-t border-notion-border pt-2">
                <span className="font-sans text-notion-secondary">Status:</span>
                <span
                  className={
                    adoptedOption === selectedScenario.id
                      ? "text-emerald-500 font-bold"
                      : "text-amber-500 font-semibold"
                  }
                >
                  {adoptedOption === selectedScenario.id ? "Approved & Logged" : "Pending Official Call"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => setAdoptedOption(selectedScenario.id)}
              className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {adoptedOption === selectedScenario.id
                  ? "Approved as Municipal Baseline ✓"
                  : `Adopt ${selectedScenario.name.split(":")[0]}`}
              </span>
            </button>

            {onNavigateToChat && (
              <button
                onClick={() =>
                  onNavigateToChat(
                    `Draft a formal council resolution approving ${selectedScenario.name} for ${selectedRegion} at Rs. ${selectedScenario.cost_crores} Cr.`
                  )
                }
                className="w-full py-2.5 px-4 rounded-lg bg-notion-hover hover:bg-notion-border text-notion-text text-xs sm:text-sm font-semibold border border-notion-border transition-colors cursor-pointer"
              >
                Draft Resolution Note in Chat →
              </button>
            )}

            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(selectedScenario, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `climate-decision-${selectedScenario.id}.json`;
                a.click();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-notion-bg hover:bg-notion-hover text-notion-secondary hover:text-notion-text text-xs sm:text-sm border border-notion-border transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Record (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
