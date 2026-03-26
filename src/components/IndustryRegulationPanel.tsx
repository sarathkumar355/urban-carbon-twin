"use client";

import { useSimulation } from "@/context/SimulationContext";
import { Factory, ShieldAlert, Cpu } from "lucide-react";

export function IndustryRegulationPanel() {
  const { selectedRegion } = useSimulation();

  return (
    <div className="grid md:grid-cols-2 gap-4 w-full">
      <div className="glass-panel w-full overflow-hidden rounded-2xl p-5 border border-white/10 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="flex items-center gap-3 mb-4">
          <Factory className="w-4 h-4 text-blue-400" />
          <h3 className="text-scientific text-[11px] font-black text-foreground tracking-[0.2em] uppercase">Regional Industry Footprint</h3>
        </div>
        <div className="space-y-2">
          {selectedRegion.industries.map(ind => (
            <div key={ind} className="bg-black/30 border border-white/5 rounded-lg p-2.5">
              <span className="text-[11px] font-bold text-foreground/80">{ind}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 flex-wrap">
          {selectedRegion.industryTypes.map(t => (
            <span key={t} className="px-2 py-1.5 rounded-md bg-blue-500/10 text-blue-400 text-[9px] uppercase font-black tracking-wider border border-blue-500/20">{t}</span>
          ))}
        </div>
      </div>

      <div className="glass-panel overflow-hidden w-full rounded-2xl p-5 border border-white/10 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <h3 className="text-scientific text-[11px] font-black text-foreground tracking-[0.2em] uppercase">Active Regulations (TNPCB)</h3>
        </div>
        <ul className="space-y-3">
          {selectedRegion.regulations.map((reg, i) => (
            <li key={i} className="flex gap-2.5 items-start text-[11px] text-foreground/70 font-bold leading-relaxed">
              <span className="text-amber-500 font-black mt-0.5 text-xs">■</span>
              <span>{reg}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
