"use client";

import { motion } from "framer-motion";
import { pollutionHotspots } from "@/data/emissionsData";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

export function PollutionHotspots() {
  const getRiskColor = (intensity: number) => {
    if (intensity < 40) return "text-healthy border-healthy/20 bg-healthy/5";
    if (intensity < 60) return "text-blue-400 border-blue-500/20 bg-blue-500/5"; // Neutral transition
    if (intensity < 80) return "text-damage/70 border-damage/20 bg-damage/5";
    return "text-damage border-damage/40 bg-damage/10 shadow-[0_0_20px_rgba(239,68,68,0.1)]";
  };

  const getRiskLabel = (intensity: number) => {
    if (intensity < 40) return "Sustainable";
    if (intensity < 60) return "Transitionary";
    if (intensity < 80) return "Hazardous";
    return "Critical";
  };

  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-5 h-full">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-healthy/20 to-transparent" />
      <div className="relative space-y-4">
        <div className="space-y-1">
          <h2 className="text-scientific flex items-center gap-2 text-[11px] font-black text-foreground">
            <Activity className="h-4 w-4 text-healthy" />
            Atmospheric Risk Index
          </h2>
          <p className="text-[10px] text-foreground/40 font-black uppercase tracking-tight">Zone CO₂ intensity via planetary monitoring satellite.</p>
        </div>

        <div className="space-y-3 mt-4">
          {pollutionHotspots.map((zone, index) => {
            const riskStyles = getRiskColor(zone.intensity);
            const riskLabel = getRiskLabel(zone.intensity);

            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.02)" }}
                className={`group flex items-center justify-between rounded-xl border p-3.5 transition-all ${riskStyles}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-black font-mono border ${riskStyles}`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-xs font-black text-foreground">{zone.name}</p>
                    <p className="text-[9px] uppercase tracking-widest text-foreground/40 font-black">{riskLabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-black tracking-tight text-foreground">
                      Index {zone.intensity}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      {zone.trend === "increasing" ? <TrendingUp className="h-3 w-3 text-damage" /> : <TrendingDown className="h-3 w-3 text-healthy" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
