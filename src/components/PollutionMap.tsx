"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { tamilNaduGrid } from "@/data/tamilNaduGrid";
import { windData } from "@/data/windData";
import { Wind, Activity } from "lucide-react";

// Custom Arrow Icon for Wind
const createWindIcon = (direction: number, speed: number) => {
  return L.divIcon({
    className: "custom-wind-icon",
    html: `<div style="transform: rotate(${direction - 90}deg); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
             <svg viewBox="0 0 24 24" width="${12 + speed/2}" height="${12 + speed/2}" fill="none" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
               <line x1="12" y1="19" x2="12" y2="5"></line>
               <polyline points="5 12 12 5 19 12"></polyline>
             </svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const getIntensityColor = (intensity: number) => {
  if (intensity < 60) return "#22c55e"; // Green
  if (intensity < 100) return "#eab308"; // Yellow
  if (intensity < 150) return "#ef4444"; // Red
  return "#a855f7"; // Purple
};

export function PollutionMap() {
  const tnCenter: [number, number] = [11.1271, 78.6569];
  const tnZoom = 7;

  const memoizedGrid = useMemo(() => tamilNaduGrid.map(p => ({
    ...p,
    intensity: (p.co2 * 0.6) + (p.aqi * 0.4)
  })), []);

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* 🔴 TOP SECTION: POLLUTION HEATMAP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-healthy/10 rounded-lg border border-healthy/20">
              <Activity className="w-5 h-5 text-healthy" />
            </div>
            <div>
              <h3 className="text-scientific text-sm font-black text-foreground tracking-[0.15em] uppercase">CO₂ + AQI Heatmap (Tamil Nadu)</h3>
              <p className="text-[9px] text-foreground/40 font-black uppercase tracking-tight">Combined carbon intensity & air quality index metrics.</p>
            </div>
          </div>
        </div>
        
        <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group/map">
          <div className="absolute top-4 right-4 z-[1000] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover/map:opacity-100 transition-opacity">
            <span className="text-[9px] font-black uppercase text-white/60 tracking-widest">Digital Twin Sensor Grid v2.4</span>
          </div>
          
          <MapContainer
            center={tnCenter}
            zoom={tnZoom}
            scrollWheelZoom={false}
            className="h-full w-full"
            style={{ backgroundColor: "#0a0a0a" }}
          >
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {memoizedGrid.map((point, i) => (
              <CircleMarker
                key={i}
                center={[point.lat, point.lng]}
                radius={20}
                pathOptions={{
                  fillColor: getIntensityColor(point.intensity),
                  fillOpacity: 0.5,
                  color: "transparent",
                  weight: 0
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="bg-neutral-900 text-white p-2 rounded-lg border border-white/10">
                    <p className="text-xs font-black uppercase mb-1">{point.name}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-bold">
                      <span className="text-white/40">CO₂:</span> <span>{point.co2} Mt</span>
                      <span className="text-white/40">AQI:</span> <span>{point.aqi}</span>
                      <span className="text-blue-400">WIND:</span> <span>~14 km/h</span>
                      <span className="text-healthy font-black">INTENSITY:</span> <span className="text-healthy font-black">{point.intensity.toFixed(1)}</span>
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* 🔵 BOTTOM SECTION: WIND MAP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Wind className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-scientific text-sm font-black text-foreground tracking-[0.15em] uppercase">Wind Flow & Direction Map</h3>
              <p className="text-[9px] text-foreground/40 font-black uppercase tracking-tight">Meso-scale atmospheric circulation vectors.</p>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group/map">
          <div className="absolute top-4 right-4 z-[1000] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover/map:opacity-100 transition-opacity">
            <span className="text-[9px] font-black uppercase text-white/60 tracking-widest">Atmospheric Flow Node v1.12</span>
          </div>

          <MapContainer
            center={tnCenter}
            zoom={tnZoom}
            scrollWheelZoom={false}
            className="h-full w-full"
            style={{ backgroundColor: "#0a0a0a" }}
          >
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {windData.map((w, i) => (
              <Marker
                key={i}
                position={[w.lat, w.lng]}
                icon={createWindIcon(w.direction, w.speed)}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  <div className="bg-neutral-900 border border-white/10 p-2 text-white">
                    <div className="text-[10px] font-black uppercase mb-1">Station Telemetry</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-bold">
                      <span className="text-white/40">SPEED:</span> <span>{w.speed} km/h</span>
                      <span className="text-white/40">DIR:</span> <span>{w.direction}°</span>
                      <span className="text-healthy">CO₂:</span> <span>~82.4 Mt</span>
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="flex justify-center flex-wrap gap-8 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#eab308]" />
          <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Hazardous</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#a855f7]" />
          <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Critical</span>
        </div>
        <div className="h-4 w-px bg-white/10 mx-2" />
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Wind Vector (Arrow)</span>
        </div>
      </div>
    </div>
  );
}