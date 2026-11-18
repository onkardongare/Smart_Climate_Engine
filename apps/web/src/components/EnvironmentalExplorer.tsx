"use client";

import React, { useState } from "react";
import { CloudRain, Droplets, Thermometer, Layers } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import type { EnvironmentalDataPoint, EnvironmentalSummary } from "../lib/types";

interface EnvironmentalExplorerProps {
  dataPoints: EnvironmentalDataPoint[];
  summaries: EnvironmentalSummary[];
  selectedRegion?: string;
}

const RAINFALL_DATA = [
  { station: "Northern Station", rainfall: 145.7, normal: 65 },
  { station: "Municipal HQ", rainfall: 125.0, normal: 60 },
  { station: "Transit Hub", rainfall: 96.2, normal: 50 },
  { station: "Western Ward", rainfall: 82.5, normal: 45 },
];

const RIVER_LEVEL_DATA = [
  { time: "00:00", primary: 2.8, secondary: 2.2, danger: 4.5 },
  { time: "04:00", primary: 3.2, secondary: 2.6, danger: 4.5 },
  { time: "08:00", primary: 3.9, secondary: 3.1, danger: 4.5 },
  { time: "12:00", primary: 4.2, secondary: 3.5, danger: 4.5 },
  { time: "16:00", primary: 4.4, secondary: 3.8, danger: 4.5 },
];

export function EnvironmentalExplorer({
  dataPoints,
  summaries,
  selectedRegion = "Metropolitan Area",
}: EnvironmentalExplorerProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredPoints = selectedFilter === "all"
    ? dataPoints
    : dataPoints.filter((pt) => pt.variable === selectedFilter);

  return (
    <div className="space-y-6">
      <div className="view-intro">
        <div>
          <h1 className="page-title">Sensor telemetry</h1>
          <p className="page-deck">Sample readings and trends. The station table uses gateway data when available and sample records otherwise.</p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="observation-strip">
        <div className="observation">
          <div className="flex items-center justify-between text-notion-secondary mb-2">
            <span className="text-xs sm:text-sm font-semibold text-notion-text">Peak 24h rainfall</span>
            <CloudRain className="w-5 h-5 text-blue-500" />
          </div>
          <div className="observation-value">145.7 mm</div>
          <div className="text-xs text-rose-500 mt-1.5 font-medium">Northern Catchment Gauge, 124% above normal</div>
        </div>

        <div className="observation">
          <div className="flex items-center justify-between text-notion-secondary mb-2">
            <span className="text-xs sm:text-sm font-semibold text-notion-text">Primary river stage</span>
            <Droplets className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="observation-value">4.40 m</div>
          <div className="text-xs text-amber-500 mt-1.5 font-medium">10 cm below the 4.50 m danger mark</div>
        </div>

        <div className="observation">
          <div className="flex items-center justify-between text-notion-secondary mb-2">
            <span className="text-xs sm:text-sm font-semibold text-notion-text">Impervious surface</span>
            <Layers aria-hidden="true" className="w-5 h-5 text-rose-500" />
          </div>
          <div className="observation-value">72.0%</div>
          <div className="text-xs text-notion-secondary mt-1.5 font-medium">3.8× the runoff rate of a sponge basin</div>
        </div>

        <div className="observation">
          <div className="flex items-center justify-between text-notion-secondary mb-2">
            <span className="text-xs sm:text-sm font-semibold text-notion-text">Peak surface temperature</span>
            <Thermometer className="w-5 h-5 text-amber-500" />
          </div>
          <div className="observation-value">37.4 °C</div>
          <div className="text-xs text-notion-secondary mt-1.5 font-medium">Industrial MIDC Hub heat island</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rainfall Comparison Chart */}
        <div className="workspace-panel space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-bold text-notion-text">Rainfall by station (mm/day)</h2>
            <span className="text-xs text-blue-500 font-mono font-medium">Recorded and seasonal mean</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RAINFALL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--notion-border)" />
                <XAxis dataKey="station" stroke="var(--notion-secondary)" fontSize={12} />
                <YAxis stroke="var(--notion-secondary)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--notion-bg)", borderColor: "var(--notion-border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--notion-text)" }}
                />
                <Bar dataKey="rainfall" name="Recorded (mm)" fill="#366e78" radius={[4, 4, 0, 0]} />
                <Bar dataKey="normal" name="Seasonal Baseline (mm)" fill="#97ac8b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* River Hydrologic Stage */}
        <div className="workspace-panel space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-bold text-notion-text">River levels over time (m)</h2>
            <span className="text-xs text-amber-500 font-mono font-medium">Primary and secondary confluence</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RIVER_LEVEL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--notion-border)" />
                <XAxis dataKey="time" stroke="var(--notion-secondary)" fontSize={12} />
                <YAxis domain={[1.5, 5]} stroke="var(--notion-secondary)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--notion-bg)", borderColor: "var(--notion-border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--notion-text)" }}
                />
                <Line type="monotone" dataKey="primary" name="Primary Catchment River" stroke="#236c70" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="secondary" name="Secondary Confluence" stroke="#607d42" strokeWidth={2} />
                <Line type="monotone" dataKey="danger" name="Critical Danger Level" stroke="#a04137" strokeDasharray="4 4" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Data Points Table from Express */}
      <div className="bg-notion-sidebar border border-notion-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 bg-notion-bg border-b border-notion-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm sm:text-base font-bold text-notion-text">
            Station records ({filteredPoints.length})
            <span className="block text-xs font-normal text-notion-secondary mt-1">{selectedRegion}</span>
          </h2>
          <div className="flex items-center space-x-2 text-sm">
            <label htmlFor="telemetry-variable" className="text-notion-secondary text-xs sm:text-sm font-medium">Variable</label>
            <select id="telemetry-variable"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-notion-sidebar border border-notion-border rounded-lg px-3 py-1.5 text-xs sm:text-sm text-notion-text focus:outline-none cursor-pointer"
            >
              <option value="all">All Variables</option>
              <option value="rainfall">Rainfall</option>
              <option value="water_level">Water Level</option>
              <option value="air_quality">Air Quality</option>
              <option value="surface_temperature">Surface Temperature</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-notion-bg text-notion-secondary text-xs border-b border-notion-border font-semibold">
              <tr>
                <th className="px-5 py-3.5">Station</th>
                <th className="px-5 py-3.5">Variable</th>
                <th className="px-5 py-3.5">Value</th>
                <th className="px-5 py-3.5">Coordinates</th>
                <th className="px-5 py-3.5">Recorded at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-notion-border text-notion-text">
              {filteredPoints.map((pt) => (
                <tr key={pt.id} className="hover:bg-notion-hover/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-notion-text">{pt.source}</td>
                  <td className="px-5 py-3 font-mono text-emerald-500 capitalize">{pt.variable.replace("_", " ")}</td>
                  <td className="px-5 py-3 font-mono font-bold text-notion-text">
                    {pt.value} {pt.unit}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-notion-secondary">
                    {pt.location?.coordinates
                      ? `${pt.location.coordinates[1].toFixed(4)}°N, ${pt.location.coordinates[0].toFixed(4)}°E`
                      : "N/A"}
                  </td>
                  <td className="px-5 py-3 text-notion-secondary font-mono text-xs">
                    {new Date(pt.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
