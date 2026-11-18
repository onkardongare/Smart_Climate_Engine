"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { DecisionMatrix } from "../components/DecisionMatrix";
import { ScenarioSimulator } from "../components/ScenarioSimulator";
import { OfficialChat } from "../components/OfficialChat";
import { DocumentIngestion } from "../components/DocumentIngestion";
import { GeospatialMap } from "../components/GeospatialMap";
import { EnvironmentalExplorer } from "../components/EnvironmentalExplorer";
import {
  climateApi,
  DEFAULT_SCENARIOS,
  DEFAULT_DATA_POINTS,
  DEFAULT_REGIONS,
} from "../lib/api";
import type {
  ScenarioOption,
  EnvironmentalDataPoint,
  EnvironmentalSummary,
  RegionInfo,
} from "../lib/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("matrix");
  const [regions, setRegions] = useState<RegionInfo[]>(DEFAULT_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<string>("Pune & PCMC Metropolitan Area");
  const [scenarios, setScenarios] = useState<ScenarioOption[]>(DEFAULT_SCENARIOS);
  const [dataPoints, setDataPoints] = useState<EnvironmentalDataPoint[]>(DEFAULT_DATA_POINTS);
  const [summaries, setSummaries] = useState<EnvironmentalSummary[]>([]);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | null>(null);

  // Load initial data through Express backend
  useEffect(() => {
    async function loadData() {
      try {
        const [regList, pts, sums] = await Promise.all([
          climateApi.getRegions(),
          climateApi.getEnvironmentalData(),
          climateApi.getEnvironmentalSummary(),
        ]);
        if (regList && regList.length > 0) {
          setRegions(regList);
          setSelectedRegion(regList[0].name);
        }
        if (pts && pts.length > 0) setDataPoints(pts);
        if (sums && sums.length > 0) setSummaries(sums);
      } catch (err) {
        console.warn("Using offline presentation baseline:", err);
      }
    }
    loadData();
  }, []);

  const handleNavigateToChat = (query: string) => {
    setChatInitialPrompt(query);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen flex flex-col bg-notion-bg text-notion-text font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        regions={regions}
      />

      <main className="page-width workspace flex-1">
        {activeTab === "matrix" && (
          <DecisionMatrix
            scenarios={scenarios}
            selectedRegion={selectedRegion}
            onNavigateToChat={handleNavigateToChat}
          />
        )}

        {activeTab === "simulator" && (
          <ScenarioSimulator
            selectedRegion={selectedRegion}
            regions={regions}
            onNavigateToChat={handleNavigateToChat}
          />
        )}

        {activeTab === "chat" && (
          <OfficialChat
            selectedRegion={selectedRegion}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "files" && (
          <DocumentIngestion
            selectedRegion={selectedRegion}
            regions={regions}
          />
        )}

        {activeTab === "gis" && (
          <GeospatialMap
            dataPoints={dataPoints}
            selectedRegion={selectedRegion}
          />
        )}

        {activeTab === "explorer" && (
          <EnvironmentalExplorer
            dataPoints={dataPoints}
            summaries={summaries}
            selectedRegion={selectedRegion}
          />
        )}
      </main>

      <footer className="site-footer">
        <div className="page-width">
          <strong>Smart Climate Engine</strong>
          <span>Municipal climate planning</span>
        </div>
      </footer>
    </div>
  );
}
