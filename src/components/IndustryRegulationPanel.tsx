"use client";

import { useState, useMemo } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { Factory, ShieldAlert, Search, Filter, Hash, Fingerprint } from "lucide-react";
import { tnpcbRegulations, Regulation } from "@/data/regulationsData";
import { tamilNaduIndustries, Industry } from "@/data/industriesData";
import { motion, AnimatePresence } from "framer-motion";

export function IndustryRegulationPanel() {
  const { selectedRegion } = useSimulation();
  
  // Industry State
  const [indSearch, setIndSearch] = useState("");
  const [indType, setIndType] = useState<string>("ALL");
  
  // Regulation State
  const [regSearch, setRegSearch] = useState("");

  const filteredIndustries = useMemo(() => {
    return tamilNaduIndustries.filter(ind => {
      const matchesSearch = ind.name.toLowerCase().includes(indSearch.toLowerCase()) || 
                            ind.location.toLowerCase().includes(indSearch.toLowerCase());
      const matchesType = indType === "ALL" || ind.type === indType;
      return matchesSearch && matchesType;
    });
  }, [indSearch, indType]);

  const filteredRegulations = useMemo(() => {
    return tnpcbRegulations.filter(reg => 
      reg.title.toLowerCase().includes(regSearch.toLowerCase()) || 
      reg.description.toLowerCase().includes(regSearch.toLowerCase())
    );
  }, [regSearch]);

  const types = ["ALL", "Thermal", "Chemical", "Refinery", "Manufacturing", "Textile", "Auto"];

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full h-[600px]">
      {/* 🏭 REGIONAL INDUSTRY FOOTPRINT */}
      <div className="glass-panel w-full overflow-hidden rounded-[2.5rem] p-8 border border-white/10 relative flex flex-col bg-black/40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Factory className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-scientific text-[11px] font-black text-foreground tracking-[0.2em] uppercase">Industry Footprint</h3>
              <p className="text-[9px] text-foreground/40 font-black uppercase">Live Regional Asset Database</p>
            </div>
          </div>
          <Fingerprint className="w-4 h-4 text-white/10" />
        </div>

        {/* SEARCH & FILTER */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30" />
            <input 
              type="text" 
              placeholder="Search industries/hubs..." 
              value={indSearch}
              onChange={(e) => setIndSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-9 text-[10px] font-bold text-foreground focus:outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setIndType(t)}
                className={`px-2 py-1 rounded-md text-[8px] font-black uppercase border transition-all ${indType === t ? 'bg-blue-500 text-white border-blue-400' : 'bg-white/5 border-white/10 text-foreground/40'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredIndustries.map((ind) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={ind.id} 
                className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[11px] font-black text-foreground group-hover:text-blue-400 transition-colors uppercase tracking-tight">{ind.name}</span>
                    <p className="text-[9px] text-foreground/40 font-bold uppercase mt-0.5">{ind.location} • {ind.type}</p>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                    ind.status === 'Violation' ? 'bg-damage/10 text-damage border-damage/30' : 
                    ind.status === 'Monitoring' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 
                    'bg-healthy/10 text-healthy border-healthy/30'
                  }`}>
                    {ind.status}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-[8px] font-black uppercase tracking-widest text-foreground/20">
                  <span>Emission: {ind.emissionLevel}</span>
                  <Hash className="w-2.5 h-2.5" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 🛡️ ACTIVE REGULATIONS (TNPCB) */}
      <div className="glass-panel overflow-hidden w-full rounded-[2.5rem] p-8 border border-white/10 relative flex flex-col bg-black/40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-scientific text-[11px] font-black text-foreground tracking-[0.2em] uppercase">Active Regulations</h3>
            <p className="text-[9px] text-foreground/40 font-black uppercase">TNPCB Environment Protocols</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30" />
          <input 
            type="text" 
            placeholder="Search protocols..." 
            value={regSearch}
            onChange={(e) => setRegSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-9 text-[10px] font-bold text-foreground focus:outline-none transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredRegulations.map((reg) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={reg.id} 
                className="flex gap-4 items-start p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  reg.severity === 'High' ? 'bg-damage shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  reg.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-400'
                }`} />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[11px] font-black text-foreground uppercase tracking-tight leading-none">{reg.title}</h4>
                    <span className={`text-[7px] font-black px-1 py-0.5 rounded border uppercase ${
                      reg.severity === 'High' ? 'text-damage border-damage/20' :
                      reg.severity === 'Medium' ? 'text-amber-500 border-amber-500/20' : 'text-blue-400 border-blue-400/20'
                    }`}>
                      {reg.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-foreground/60 font-bold leading-relaxed">{reg.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
