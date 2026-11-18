"use client";

import React from "react";
import { ShieldCheck, MessageSquare, UploadCloud, Sliders, BarChart3, Map, Database } from "lucide-react";
import type { RegionInfo } from "../lib/types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  regions: RegionInfo[];
}

export function Navbar({
  activeTab,
  setActiveTab,
  selectedRegion,
  setSelectedRegion,
  regions,
}: NavbarProps) {
  return (
    <header className="border-b border-notion-border bg-notion-bg/95 sm:sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3.5 gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-teal-400/10 border border-teal-400/30 flex items-center justify-center text-teal-300 font-bold shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-notion-text">
                  Smart Climate Engine
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-notion-sidebar text-notion-secondary border border-notion-border font-medium">
                  Decision Portal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-notion-secondary mt-0.5">
                Multi-Hazard Climate Resilience & Municipal Scenario Platform
              </p>
            </div>
          </div>

          {/* Region / Municipality Selector */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 bg-notion-sidebar border border-notion-border rounded-lg px-3 py-2 text-sm shadow-sm">
            <span className="text-notion-secondary font-medium whitespace-nowrap text-xs sm:text-sm">
              Target Municipality:
            </span>
            <select
              aria-label="Select Target Municipality"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="min-w-0 max-w-full flex-1 bg-notion-sidebar text-teal-300 font-semibold cursor-pointer text-xs sm:text-sm"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.name} className="bg-notion-bg text-notion-text">
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav aria-label="Decision portal" className="grid grid-cols-2 gap-1 sm:flex sm:flex-wrap py-2 border-t border-notion-border text-sm">
          {[
            { id: "matrix", label: "Decision Matrix", icon: BarChart3 },
            { id: "simulator", label: "Scenario Simulator", icon: Sliders },
            { id: "chat", label: "Official AI Chat", icon: MessageSquare },
            { id: "files", label: "Document Ingestion", icon: UploadCloud },
            { id: "gis", label: "Hazard Map", icon: Map },
            { id: "explorer", label: "Sensor Telemetry", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-w-0 items-center gap-1.5 px-2 py-2 text-left sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-teal-400/10 text-teal-300 border border-teal-400/30"
                    : "text-notion-secondary hover:text-notion-text hover:bg-notion-hover border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
