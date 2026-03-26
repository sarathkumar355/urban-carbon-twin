"use client";

import { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { tamilNaduGrid } from "@/data/tamilNaduGrid";
import { Wind, Activity, MapPin } from "lucide-react";
import { WindFlowLayer } from "./WindFlowLayer";
import { motion, AnimatePresence } from "framer-motion";

type WindPoint = {
  name: string;
  lat: number;
  lng: number;
  speed: number;
  direction: number;
};

type UserEnv = {
  aqi: number;
  co2Level: number;
  zone: "Low" | "Medium" | "High";
  windSpeed: number;
  windDirection: number;
  locationName: string;
};

const getIntensityColor = (intensity: number | string) => {
  const num = typeof intensity === "string" ? parseFloat(intensity) : intensity;
  if (num < 60) return "#22c55e"; // Green
  if (num < 100) return "#eab308"; // Yellow
  if (num < 150) return "#ef4444"; // Red
  return "#a855f7"; // Purple
};

const getZoneColor = (zone: string) => {
  if (zone === "Low") return "#22c55e";
  if (zone === "Medium") return "#eab308";
  return "#ef4444";
};

export function PollutionMap() {
  const tnCenter: [number, number] = [11.1271, 78.6569];
  const tnZoom = 7;

  const [windData, setWindData] = useState<WindPoint[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userEnv, setUserEnv] = useState<UserEnv | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchWindData = async () => {
    try {
      const res = await fetch("/api/wind");
      if (res.ok) {
        const data = await res.json();
        setWindData(data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch wind data", err);
    }
  };

  const fetchUserEnv = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/user-environment?lat=${lat}&lon=${lng}`);
      if (res.ok) {
        const data = await res.json();
        setUserEnv(data);
      }
    } catch (err) {
      console.error("Failed to fetch user environment", err);
    }
  };

  useEffect(() => {
    fetchWindData();
    const interval = setInterval(fetchWindData, 60000);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        fetchUserEnv(loc.lat, loc.lng);
      });
    }

    return () => clearInterval(interval);
  }, []);

  const memoizedGrid = useMemo(() => tamilNaduGrid.map(p => ({
    ...p,
    intensity: (p.co2 * 0.6) + (p.aqi * 0.4)
  })), []);

  const UserMarker = ({ pos, env }: { pos: { lat: number; lng: number }, env: UserEnv | null }) => {
    const color = env ? getZoneColor(env.zone) : "#3b82f6";
    
    const icon = L.divIcon({
      className: "custom-user-icon",
      html: `<div class="relative flex items-center justify-center">
               <div class="absolute w-8 h-8 rounded-full animate-ping opacity-20" style="background-color: ${color}"></div>
               <div class="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}"></div>
             </div>`,
      iconSize: [20, 20],
    });

    return (
      <Marker position={[pos.lat, pos.lng]} icon={icon}>
        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
          <div className="bg-neutral-900 text-white p-3 rounded-xl border border-white/10 shadow-2xl min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">You are here</span>
            </div>
            <p className="text-xs font-black uppercase mb-2 text-white/90">{env?.locationName || "Detecting..."}</p>
            {env && (
              <div className="space-y-1.5 pt-1 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-white/40 uppercase">Zone:</span>
                  <span style={{ color: getZoneColor(env.zone) }} className="font-black uppercase tracking-tighter">{env.zone} Risk</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-white/40 uppercase">AQI:</span>
                  <span>{env.aqi}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-white/40 uppercase">Estimated CO₂:</span>
                  <span>{env.co2Level} Mt</span>
                </div>
              </div>
            )}
            <div className="mt-2 text-[8px] font-medium text-white/30 text-center italic leading-tight">
               {env?.zone === "High" ? "⚠️ Immediate mitigation recommended for this sector." : "✅ Normal environmental variance detected."}
            </div>
          </div>
        </Tooltip>
      </Marker>
    );
  };

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
          <div className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-healthy animate-pulse" />
            Live Sync: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        
        <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group/map">
          <MapContainer center={tnCenter} zoom={tnZoom} scrollWheelZoom={false} className="h-full w-full" style={{ backgroundColor: "#0a0a0a" }}>
            <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            
            {memoizedGrid.map((point, i) => (
              <CircleMarker
                key={i}
                center={[point.lat, point.lng]}
                radius={20}
                pathOptions={{ fillColor: getIntensityColor(point.intensity), fillOpacity: 0.5, color: "transparent", weight: 0 }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="bg-neutral-900 text-white p-2 rounded-lg border border-white/10">
                    <p className="text-xs font-black uppercase mb-1">{point.name}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-bold text-white/90">
                      <span className="text-white/40">CO₂:</span> <span>{point.co2} Mt</span>
                      <span className="text-white/40">AQI:</span> <span>{point.aqi}</span>
                      <span className="text-healthy font-black">INTENSITY:</span> <span className="text-healthy font-black">{point.intensity.toFixed(1)}</span>
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}

            {userLocation && <UserMarker pos={userLocation} env={userEnv} />}
          </MapContainer>
          
          <div className="absolute top-4 right-4 z-[1000] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-[9px] font-black uppercase text-white/60 tracking-widest">Spatial Sensing Active</span>
          </div>
        </div>
      </div>

      {/* 🔵 BOTTOM SECTION: WIND FLOW MAP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Wind className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-scientific text-sm font-black text-foreground tracking-[0.15em] uppercase">Atmospheric Wind Flow (Meso-scale)</h3>
              <p className="text-[9px] text-foreground/40 font-black uppercase tracking-tight">Streamline visualization of real-time air currents.</p>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group/map">
          <MapContainer center={tnCenter} zoom={tnZoom} scrollWheelZoom={false} className="h-full w-full" style={{ backgroundColor: "#0a0a0a" }}>
            <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            
            {windData.length > 0 && <WindFlowLayer data={windData} />}
            {userLocation && <UserMarker pos={userLocation} env={userEnv} />}
          </MapContainer>

          <AnimatePresence>
            {userEnv && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute bottom-6 right-6 z-[1000] bg-blue-500/10 backdrop-blur-xl p-4 rounded-2xl border border-blue-500/30 shadow-2xl max-w-[240px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Local Airflow Dynamics</span>
                </div>
                <p className="text-[9px] text-white/70 leading-relaxed italic">
                  Wind at <span className="text-white font-bold">{userEnv.windSpeed.toFixed(1)} m/s</span> is currently dispersing pollution toward the <span className="text-white font-bold">{userEnv.windDirection > 180 ? 'Coastal' : 'Inland'}</span> regions.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="flex justify-center flex-wrap gap-10 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#eab308]" />
          <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">High Risk</span>
        </div>
        <div className="h-4 w-px bg-white/10 mx-2" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white animate-pulse" />
          <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">User Position</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-[2px] bg-blue-400 opacity-60" />
          <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Wind Streamline</span>
        </div>
      </div>
    </div>
  );
}