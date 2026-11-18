"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, ChevronRight, Download, Printer } from "lucide-react";
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
    <div className="matrix-workspace">
      <div className="matrix-intro">
        <div>
          <h1 className="page-title">Intervention comparison</h1>
          <p className="page-deck">Compare benchmark scenarios for flood protection, aquifer recharge and urban cooling.</p>
        </div>
        <div className="budget-strip">
          <div><span>Benchmark budget</span><strong>₹50 <small>Cr</small></strong></div>
          <div className="budget-gauge" aria-hidden="true"><i /></div>
          <p>₹15 Cr headroom with the recommended option</p>
        </div>
      </div>

      <section className="comparison" aria-label="Intervention options">
        <div className="comparison-tools">
          <div role="group" aria-label="Sort options" className="sort-options">
            <span>Sort by</span>
            {([
              ["default", "Default"],
              ["flood", "Highest Flood Safety"],
              ["groundwater", "Best Aquifer Recharge"],
              ["cost", "Lowest Cost"],
            ] as const).map(([value, label]) => (
              <button key={value} onClick={() => setSortBy(value)} aria-pressed={sortBy === value}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={handlePrint} className="print-action" aria-label="Print / Export Decision Memo">
            <Printer aria-hidden="true" size={16} />
            Print memo
          </button>
        </div>

        <table className="option-table">
          <caption className="sr-only">Projected impacts, capital cost and implementation time by intervention</caption>
          <thead>
            <tr>
              <th scope="col">Intervention</th>
              <th scope="col">Flood risk</th>
              <th scope="col">Aquifer recharge</th>
              <th scope="col">Urban heat</th>
              <th scope="col">Capital cost</th>
              <th scope="col">Delivery</th>
            </tr>
          </thead>
          <tbody>
            {sortedScenarios.map((option) => {
              const isSelected = selectedId === option.id;
              const prefix = option.name.match(/^Option ([A-Z]):\s*/);
              const title = option.name.slice(prefix?.[0].length ?? 0);
              return (
                <tr key={option.id} className={isSelected ? "selected-option" : undefined}>
                  <th scope="row">
                    <div className="option-name">
                      {prefix && <span aria-hidden="true" className="option-letter">{prefix[1]}</span>}
                      <div>
                        <h2 aria-label={option.name}>
                          <button onClick={() => setSelectedId(option.id)}
                            aria-label={`Inspect ${option.name}`} aria-pressed={isSelected}
                            className="scenario-inspect" title={option.description}>
                            {option.is_recommended ? title.replace(/\s*\(Recommended\)$/, "") : title}
                          </button>
                        </h2>
                        {option.is_recommended && <span className="recommendation"><CheckCircle2 aria-hidden="true" size={13} /> Recommended</span>}
                      </div>
                    </div>
                  </th>
                  <td>
                    <span className="metric-label">Flood risk</span>
                    <span>−{option.flood_risk_reduction_pct}%</span>
                    <span aria-hidden="true" className="flood-bar"><i style={{ width: `${option.flood_risk_reduction_pct}%` }} /></span>
                  </td>
                  <td>
                    <span className="metric-label">Aquifer recharge</span>
                    <span className={option.groundwater_recharge_pct < 0 ? "negative-change" : undefined}>
                      {option.groundwater_recharge_pct > 0 ? "+" : ""}{option.groundwater_recharge_pct}%
                    </span>
                  </td>
                  <td><span className="metric-label">Urban heat</span>−{option.urban_heat_reduction_deg}°C</td>
                  <td><span className="metric-label">Capital cost</span>₹{option.cost_crores} Cr</td>
                  <td>
                    <span className="metric-label">Delivery</span>
                    <span className="delivery-value">{option.implementation_months} mo
                      {isSelected ? <CheckCircle2 aria-hidden="true" size={16} /> : <ChevronRight aria-hidden="true" size={16} />}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div className="strategy-spread">
        <section className="strategy-notes">
          <h2 className="section-title">{selectedScenario.name.replace(/\s*\(Recommended\)$/, "")}</h2>
          <p className="strategy-description">{selectedScenario.description}</p>
          <div className="tradeoff-note">
            <h3><AlertTriangle aria-hidden="true" size={16} /> Trade-off</h3>
            <p>{selectedScenario.tradeoff_note}</p>
          </div>
          <div className="strategy-lists">
            <div>
              <h3>Strengths</h3>
              <ul>{selectedScenario.advantages.map((adv, idx) => <li key={idx}>{adv}</li>)}</ul>
            </div>
            <div>
              <h3>Limitations</h3>
              <ul>{selectedScenario.disadvantages.map((dis, idx) => <li key={idx}>{dis}</li>)}</ul>
            </div>
          </div>
        </section>
        <section className="council-panel">
          <div>
            <h2 className="section-title">Council decision</h2>
            <p className="strategy-description">The council records the final adoption.</p>
            <dl className="council-ledger">
              <div><dt>Strategy</dt><dd>{selectedScenario.name.split(":")[0]}</dd></div>
              <div><dt>Feasibility</dt><dd>{selectedScenario.feasibility_score} / 100</dd></div>
              <div><dt>Capital outlay</dt><dd>₹{selectedScenario.cost_crores} Cr</dd></div>
              <div><dt>Fiscal reserve</dt><dd>₹{50 - selectedScenario.cost_crores} Cr</dd></div>
              <div><dt>Status</dt><dd>{adoptedOption === selectedScenario.id ? "Approved & Logged" : "Pending Official Call"}</dd></div>
            </dl>
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
        </section>
      </div>
    </div>
  );
}
