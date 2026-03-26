"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import { chennaiZones } from "@/data/chennaiZones";
import { aqiToFactor } from "@/utils/aqiToCO2";
import { Layers } from "lucide-react";

// 🎯 Color based on CO₂ level
const getColor = (level: string) => {
  if (level === "high") return "#ef4444"; // 🔴 red
  if (level === "medium") return "#f59e0b"; // 🟠 orange
  return "#22c55e"; // 🟢 green
};

// 🎯 Recommendation logic
const getRecommendation = (level: string) => {
  if (level === "high") return "Carbon Capture + Traffic Control";
  if (level === "medium") return "EV Adoption + Public Transport";
  return "Maintain Green Zones";
};

type AqiNode = { lat: number; lng: number; aqi: number };
type ViewMode = "co2" | "aqi" | "combined";

const getNearestAqi = (lat: number, lng: number, aqiList: AqiNode[]) => {
  if (!aqiList.length) return null;
  return aqiList.reduce((prev, curr) => {
    const prevDist = Math.hypot(prev.lat - lat, prev.lng - lng);
    const currDist = Math.hypot(curr.lat - lat, curr.lng - lng);
    return currDist < prevDist ? curr : prev;
  });
};

export function PollutionMap({ simulationResult }: { simulationResult?: { total: number; transport: number; reduction: number } }) {
  const totalSafe = simulationResult?.total ?? 12.4;
  const ratio = totalSafe / 12.4;

  const [viewMode, setViewMode] = useState<ViewMode>("combined");
  const [aqiData, setAqiData] = useState<AqiNode[]>([]);

  useEffect(() => {
    fetch("/api/aqi")
      .then((res) => res.json())
      .then(setAqiData)
      .catch(console.error);
  }, []);

  return (
    <div className="h-72 w-full overflow-hidden rounded-xl border border-eco-primary/10 bg-white/60 shadow-inner relative">
      
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
        <div className="flex bg-black/80 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-lg">
          {(["co2", "combined", "aqi"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${
                viewMode === mode
                  ? "bg-healthy text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {viewMode === "combined" && (
          <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-lg max-w-[200px]">
            <p className="text-[9px] font-black text-white uppercase flex items-center gap-1.5 border-b border-white/10 pb-1.5 mb-1.5">
              <Layers className="w-3 h-3 text-healthy" />
              Hybrid Digital Twin
            </p>
            <p className="text-[10px] leading-relaxed text-white/80 font-medium">
              <strong className="text-white">AQI</strong> is used as an environmental proxy to adjust <strong className="text-damage">CO₂</strong> intensity globally.
            </p>
          </div>
        )}
      </div>

      <MapContainer
        center={[13.0827, 80.2707]} // 📍 Chennai
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full relative z-[1]"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* 🌫️ AQI Heatmap Layer */}
        {(viewMode === "aqi" || viewMode === "combined") &&
          aqiData.map((node, idx) => {
            let color = "#eab308"; // moderate
            if (node.aqi > 150) color = "#9333ea"; // severe/hazardous
            else if (node.aqi > 100) color = "#ef4444"; // poor

            return (
              <CircleMarker
                key={`aqi-${idx}`}
                center={[node.lat, node.lng]}
                radius={node.aqi / 2}
                pathOptions={{
                  color: "transparent",
                  fillColor: color,
                  fillOpacity: viewMode === "combined" ? 0.35 : 0.6,
                  className: "pointer-events-none blur-[24px]", // reduced blur for higher contrast
                }}
              />
            );
          })}

        {/* 🔥 Chennai CO₂ Zones Layer */}
        {(viewMode === "co2" || viewMode === "combined") &&
          chennaiZones.map((zone) => {
            let simulatedEmission = zone.baseEmission * ratio;
            if (zone.type === "industrial") simulatedEmission *= 1.3;
            else if (zone.type === "commercial") simulatedEmission *= 1.1;
            else if (zone.type === "residential") simulatedEmission *= 0.9;

            // 🧠 Hybrid Integration
            const nearestAqi = getNearestAqi(zone.lat, zone.lng, aqiData);
            const aqiVal = nearestAqi?.aqi ?? 100; // safe fallback
            const factor = viewMode === "combined" ? aqiToFactor(aqiVal) : 1; 
            const finalEmission = simulatedEmission * factor;

            let calculatedLevel = "low";
            if (finalEmission > 130) calculatedLevel = "high";
            else if (finalEmission > 80) calculatedLevel = "medium";

            const zoneColor = getColor(calculatedLevel);
            const radius = Math.max(5, finalEmission / 10);

            return (
              <CircleMarker
                key={zone.name}
                center={[zone.lat, zone.lng]}
                radius={radius}
                pathOptions={{
                  color: zoneColor,
                  fillColor: zoneColor,
                  fillOpacity: 0.6,
                  weight: 2,
                  className: "animate-pulse transition-all duration-700",
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -10]}
                  opacity={0.9}
                  className="!bg-white !text-[10px] !text-eco-primary !font-bold !border-eco-primary/10 !rounded-lg !shadow-xl !px-3 !py-1.5"
                >
                  {zone.name}
                </Tooltip>

                <Popup className="dashboard-popup">
                  <div className="space-y-1.5 p-1 min-w-[200px]">
                    <div className="flex justify-between items-end border-b border-eco-primary/15 pb-1">
                      <p className="font-black text-sm text-eco-primary uppercase tracking-tight">
                        {zone.name}
                      </p>
                      {viewMode === "combined" && (
                        <p className="text-[9px] font-mono text-eco-primary/60 font-black">
                          AQI: {aqiVal} (x{factor})
                        </p>
                      )}
                    </div>

                    <div className="text-[11px] font-black text-eco-primary space-y-1 pt-1">
                      <p className="flex justify-between">
                        <span className="text-eco-primary/70">Risk Level:</span>
                        <span className="font-mono uppercase">{calculatedLevel}</span>
                      </p>

                      <p className="flex justify-between">
                        <span className="text-eco-primary/70">Emission Load:</span>
                        <span className="font-mono uppercase">{finalEmission.toFixed(1)} Mt</span>
                      </p>

                      <p className="flex flex-col mt-2 pt-1 border-t border-eco-primary/15">
                        <span className="text-eco-secondary text-[9px] uppercase tracking-widest font-black">
                          Recommended Action
                        </span>
                        <span className="font-black text-eco-primary mt-0.5">
                          {getRecommendation(calculatedLevel)}
                        </span>
                      </p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}