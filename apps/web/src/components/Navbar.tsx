"use client";

import Image from "next/image";
import { MessageSquare, UploadCloud, Sliders, BarChart3, Map, Database, MapPin, ChevronDown } from "lucide-react";
import type { RegionInfo } from "../lib/types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  regions: RegionInfo[];
}

export function Navbar({ activeTab, setActiveTab, selectedRegion, setSelectedRegion, regions }: NavbarProps) {
  return (
    <header className="masthead sm:sticky top-0 z-50">
      <div className="page-width masthead-top">
        <div className="masthead-brand">
          <Image src="/smart-climate-mark.png" alt="" width={72} height={72} loading="eager" />
          <span>Smart Climate Engine</span>
        </div>
        <label className="region-picker">
          <MapPin aria-hidden="true" size={18} />
          <span>
            <span className="region-caption">Municipality</span>
            <select aria-label="Select Target Municipality" value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}>
              {regions.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </span>
          <ChevronDown aria-hidden="true" size={16} />
        </label>
      </div>
      <div className="nav-band">
        <nav aria-label="Decision portal" className="page-width civic-nav">
          {[
            { id: "matrix", label: "Decision Matrix", icon: BarChart3 },
            { id: "simulator", label: "Scenario Simulator", icon: Sliders },
            { id: "chat", label: "Official AI Chat", icon: MessageSquare },
            { id: "files", label: "Document Ingestion", icon: UploadCloud },
            { id: "gis", label: "Hazard Map", icon: Map },
            { id: "explorer", label: "Sensor Telemetry", icon: Database },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} aria-current={activeTab === id ? "page" : undefined}>
              <Icon aria-hidden="true" size={16} strokeWidth={1.7} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
