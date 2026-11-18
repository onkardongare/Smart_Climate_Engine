"use client";

import React, { useState } from "react";
import { MapPin, Droplets, Thermometer, ShieldAlert, CheckCircle, Info } from "lucide-react";
import type { EnvironmentalDataPoint } from "../lib/types";

interface GeospatialMapProps {
  dataPoints: EnvironmentalDataPoint[];
  selectedRegion?: string;
}

interface MapStation {
  id: string;
  name: string;
  type: "rainfall" | "water_level" | "air_quality" | "surface_temp" | "intervention";
  x: number;
  y: number;
  value: string;
  status: "safe" | "warning" | "alert" | "active";
  description: string;
}

const DEFAULT_STATIONS: MapStation[] = [
  { id: "s1", name: "Northern Catchment Weather Station", type: "rainfall", x: 28, y: 32, value: "145.7 mm/day", status: "alert", description: "Extreme precipitation recorded. High local runoff near primary railway culverts." },
  { id: "s2", name: "Central Municipal Weather Station", type: "rainfall", x: 38, y: 22, value: "125.0 mm/day", status: "alert", description: "Stormwater flow exceedance. Drainage capacity at 88% saturation." },
  { id: "s3", name: "River Drainage Junction Gauge", type: "water_level", x: 46, y: 44, value: "4.4 m (Danger: 4.5m)", status: "warning", description: "River cresting near critical warning threshold. Backwater pooling in low lying settlements." },
  { id: "s4", name: "Basin Confluence Telemetry Station", type: "water_level", x: 42, y: 52, value: "3.8 meters", status: "safe", description: "Elevated river stage. Upstream reservoir discharge monitoring in effect." },
  { id: "s5", name: "Commercial IT Park Corridor Sensor", type: "rainfall", x: 18, y: 56, value: "96.2 mm/day", status: "warning", description: "High impervious surface coverage (76%). Rapid sheet runoff onto arterial roads." },
  { id: "s6", name: "Urban Core Transit Hub", type: "rainfall", x: 55, y: 65, value: "82.5 mm/day", status: "safe", description: "Dense municipal drainage network. Moderate localized water accumulation." },
  { id: "s7", name: "Industrial MIDC Hub", type: "surface_temp", x: 62, y: 30, value: "37.4 °C (Urban Heat)", status: "warning", description: "Severe urban heat island effect due to heavy roofing and asphalt." },
  { id: "s8", name: "Metropolitan Green Canopy Zone", type: "surface_temp", x: 46, y: 62, value: "31.2 °C", status: "safe", description: "Vegetative cooling effect lowers ambient temperatures by ~5.6°C." },
  { id: "s9", name: "Riparian Wetland Sponge Buffer (Option D)", type: "intervention", x: 40, y: 40, value: "Restoration Active", status: "active", description: "Proposed 22-hectare wetland sponge zone to absorb 1.4 million m³ excess runoff." },
  { id: "s10", name: "Permeable Infiltration Corridor (Option D)", type: "intervention", x: 30, y: 38, value: "Pervious Bioswale", status: "active", description: "Infiltration corridor filtering runoff into deeper unconfined basalt aquifer." },
];

export function GeospatialMap({ dataPoints, selectedRegion = "Metropolitan Area" }: GeospatialMapProps) {
  const [activeLayers, setActiveLayers] = useState({
    flood: true,
    rivers: true,
    heat: true,
    interventions: true,
  });

  const [selectedStation, setSelectedStation] = useState<MapStation | null>(DEFAULT_STATIONS[0]);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="space-y-6">
      <div className="view-intro map-intro">
        <div>
          <h1 className="page-title">Hazard map</h1>
          <p className="page-deck">Illustrative stations, hazard zones and proposed sponge corridors. Pins use fixed sample readings.</p>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          <button
            onClick={() => toggleLayer("flood")}
            aria-pressed={activeLayers.flood}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeLayers.flood
                ? "bg-rose-500/15 text-rose-600 border-rose-500/40 font-semibold"
                : "bg-notion-bg text-notion-secondary border-notion-border"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Flood Zones</span>
          </button>

          <button
            onClick={() => toggleLayer("rivers")}
            aria-pressed={activeLayers.rivers}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeLayers.rivers
                ? "bg-cyan-500/15 text-cyan-600 border-cyan-500/40 font-semibold"
                : "bg-notion-bg text-notion-secondary border-notion-border"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>River Gauges</span>
          </button>

          <button
            onClick={() => toggleLayer("heat")}
            aria-pressed={activeLayers.heat}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeLayers.heat
                ? "bg-amber-500/15 text-amber-600 border-amber-500/40 font-semibold"
                : "bg-notion-bg text-notion-secondary border-notion-border"
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Urban Heat</span>
          </button>

          <button
            onClick={() => toggleLayer("interventions")}
            aria-pressed={activeLayers.interventions}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeLayers.interventions
                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/40 font-semibold"
                : "bg-notion-bg text-notion-secondary border-notion-border"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Option D Sponge Corridors</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas + Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive SVG GIS Map Canvas */}
        <div className="map-sheet lg:col-span-3 border border-notion-border rounded-lg p-4 relative min-h-[500px] overflow-hidden flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888810_1px,transparent_1px),linear-gradient(to_bottom,#88888810_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* SVG Cartographic Layer */}
          <svg className="w-full h-full min-h-[480px] absolute inset-0 pointer-events-none" viewBox="0 0 1000 650">
            <defs>
              <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#377f8e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#447683" stopOpacity="0.8" />
              </linearGradient>
              <radialGradient id="floodGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#bd6659" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#bd6659" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#cf8d39" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#cf8d39" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="wetlandZone" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#467959" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* River Drainage Paths */}
            {activeLayers.rivers && (
              <>
                <path
                  d="M 100 120 Q 250 180 380 230 T 480 320 T 560 420 T 700 500 T 920 540"
                  fill="none"
                  stroke="url(#riverGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className="opacity-80"
                />
                <path
                  d="M 300 600 Q 420 520 560 420"
                  fill="none"
                  stroke="url(#riverGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="opacity-70"
                />
              </>
            )}

            {/* Flood Inundation Hotspot Polygons */}
            {activeLayers.flood && (
              <>
                <circle cx="340" cy="240" r="80" fill="url(#floodGlow)" />
                <circle cx="470" cy="315" r="100" fill="url(#floodGlow)" />
                <circle cx="210" cy="380" r="70" fill="url(#floodGlow)" />
                <text x="350" y="215" fill="#853a34" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                  High inundation risk (drainage junction)
                </text>
              </>
            )}

            {/* Urban Heat Islands */}
            {activeLayers.heat && (
              <>
                <circle cx="680" cy="200" r="95" fill="url(#heatGlow)" />
                <circle cx="780" cy="340" r="85" fill="url(#heatGlow)" />
                <text x="660" y="190" fill="#80511a" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                  Industrial heat island (37.4°C)
                </text>
              </>
            )}

            {/* Option D Nature-Based Intervention Corridors */}
            {activeLayers.interventions && (
              <>
                <rect x="360" cy="235" width="140" height="80" rx="14" fill="url(#wetlandZone)" stroke="#467959" strokeWidth="2" strokeDasharray="6 3" />
                <text x="375" y="278" fill="#426644" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                  Riparian Wetland Sponge Buffer (Option D)
                </text>
                <line x1="260" y1="210" x2="340" y2="270" stroke="#426644" strokeWidth="3" strokeDasharray="4 4" />
              </>
            )}
          </svg>

          {/* Interactive Marker Pins */}
          {DEFAULT_STATIONS.map((station) => {
            const isSelected = selectedStation?.id === station.id;
            let pinColor = "bg-cyan-600 text-white";
            if (station.type === "rainfall") pinColor = "bg-blue-600 text-white";
            if (station.type === "surface_temp") pinColor = "bg-amber-600 text-white";
            if (station.type === "intervention") pinColor = "bg-emerald-600 text-white ring-2 ring-emerald-300";

            return (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station)}
                aria-label={station.name}
                aria-pressed={isSelected}
                style={{ left: `${station.x}%`, top: `${station.y}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto group z-20 transition-all cursor-pointer ${
                  isSelected ? "scale-125 z-30" : "hover:scale-110"
                }`}
              >
                <div className={`p-2 rounded-full shadow-md ${pinColor} flex items-center justify-center`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className={`absolute left-1/2 -translate-x-1/2 -bottom-6 px-2.5 py-1 rounded bg-notion-sidebar border border-notion-border text-xs font-semibold text-notion-text whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                  isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                  {station.name.split(" ")[0]}
                </span>
              </button>
            );
          })}

          {/* Overlay Map Badge */}
          <div className="absolute top-4 left-4 bg-notion-sidebar/90 border border-notion-border rounded-lg px-3.5 py-2 text-xs sm:text-sm pointer-events-none shadow-sm">
            <div className="font-bold text-notion-text">{selectedRegion}</div>
            <div className="text-xs text-notion-secondary mt-0.5">Illustrative station layout</div>
          </div>
        </div>

        {/* Selected Station / Zone Inspector */}
        <div className="workspace-panel flex flex-col justify-between gap-5">
          {selectedStation ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-500">
                <Info className="w-4 h-4" />
                <span>Selected station</span>
              </div>

              <div>
                <h3 className="font-bold text-notion-text text-sm sm:text-base leading-snug">{selectedStation.name}</h3>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded mt-1.5 inline-block bg-notion-bg text-notion-text border border-notion-border">
                  {selectedStation.type.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div className="bg-notion-bg rounded-xl p-4 border border-notion-border space-y-1.5 text-xs sm:text-sm">
                <span className="text-notion-secondary block text-xs">Sample reading</span>
                <div className="text-xl sm:text-2xl font-bold text-emerald-500 font-mono">{selectedStation.value}</div>
                <div className="flex items-center space-x-2 pt-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    selectedStation.status === "alert" ? "bg-rose-500" : selectedStation.status === "warning" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  <span className="text-notion-text capitalize text-xs sm:text-sm font-medium">{selectedStation.status}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-notion-text leading-relaxed bg-notion-bg rounded-xl p-4 border border-notion-border">
                {selectedStation.description}
              </p>
            </div>
          ) : (
            <div className="text-center text-notion-secondary text-sm py-12">
              Select a station to inspect its sample reading.
            </div>
          )}

          <div className="text-xs text-notion-secondary border-t border-notion-border pt-3">
            Map layers show reference conditions, independent of the station feed.
          </div>
        </div>
      </div>
    </div>
  );
}
