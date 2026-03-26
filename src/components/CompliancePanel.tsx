"use client";

import { useMemo, useState } from "react";
import { tamilNaduGrid } from "@/data/tamilNaduGrid";
import { calculateCompliance, getStatusColor, ComplianceResult, ComplianceStatus } from "@/utils/complianceLogic";
import { ShieldCheck, AlertCircle, Search, Filter, SortDesc, SortAsc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CompliancePanelProps {
  globalReduction: number;
}

type SortOption = "pollution" | "ratio" | "alpha";

export function CompliancePanel({ globalReduction }: CompliancePanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("ratio");

  const complianceData = useMemo(() => {
    let data = tamilNaduGrid.map(point => {
      const currentPollution = point.co2 * (1 - globalReduction / 100);
      return calculateCompliance(point.name, currentPollution, point.regulatoryLimit);
    });

    // Filtering
    if (searchTerm) {
      data = data.filter(d => d.zone.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (statusFilter !== "ALL") {
      data = data.filter(d => d.status === statusFilter);
    }

    // Sorting
    return data.sort((a, b) => {
      if (sortBy === "ratio") return b.complianceRatio - a.complianceRatio;
      if (sortBy === "pollution") return b.pollutionIndex - a.pollutionIndex;
      return a.zone.localeCompare(b.zone);
    });
  }, [globalReduction, searchTerm, statusFilter, sortBy]);

  const violations = complianceData.filter(d => d.violation);
  const averageCompliance = 100 - (complianceData.reduce((acc, curr) => acc + curr.complianceRatio, 0) / Math.max(1, complianceData.length) * 50);

  return (
    <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-8 border border-white/10 flex flex-col h-[600px] bg-black/40">
      <div className="absolute top-0 right-0 -m-8 h-48 w-48 rounded-full bg-damage/5 blur-3xl" />
      
      <div className="relative mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-scientific text-[12px] font-black text-foreground uppercase tracking-[0.2em] mb-1">Industrial Regulatory Compliance</h2>
          <p className="text-[10px] text-foreground/40 font-black uppercase tracking-tight">Real-time emission-to-limit ratio analysis</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[9px] font-black text-foreground/40 uppercase mb-1">Global Score</p>
            <p className="text-2xl font-black text-healthy">{Math.max(0, Math.min(100, averageCompliance)).toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="relative mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30" />
          <input 
            type="text" 
            placeholder="Search industrial clusters..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[11px] font-bold text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/10">
            {(["ALL", "SAFE", "HIGH", "CRITICAL"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${statusFilter === s ? 'bg-foreground text-background shadow-lg' : 'text-foreground/40 hover:text-foreground hover:bg-white/5'}`}
              >
                {s}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/10 ml-auto">
             <Filter className="w-3 h-3 text-foreground/20 ml-2" />
             {(["ratio", "pollution", "alpha"] as const).map((opt) => (
               <button
                 key={opt}
                 onClick={() => setSortBy(opt)}
                 className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${sortBy === opt ? 'text-blue-400' : 'text-foreground/40'}`}
               >
                 {opt}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {complianceData.map((data, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={data.zone}
              className={`p-4 rounded-2xl border transition-all ${data.violation ? 'bg-damage/10 border-damage/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
             <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(data.status) }} />
                  <span className="text-[11px] font-black text-foreground uppercase tracking-wider">{data.zone}</span>
               </div>
               <span className="text-[9px] font-black px-2 py-0.5 rounded-md border" style={{ borderColor: getStatusColor(data.status), color: getStatusColor(data.status) }}>
                 {data.status}
               </span>
             </div>

             <div className="grid grid-cols-3 gap-4">
               <div>
                 <p className="text-[8px] font-black text-foreground/40 uppercase mb-1">Intensity</p>
                 <p className="text-xs font-black text-foreground">{data.pollutionIndex} <span className="text-[8px] text-foreground/40">Mt</span></p>
               </div>
               <div>
                 <p className="text-[8px] font-black text-foreground/40 uppercase mb-1">Limit</p>
                 <p className="text-xs font-black text-foreground">{data.regulatoryLimit} <span className="text-[8px] text-foreground/40">Mt</span></p>
               </div>
               <div>
                 <p className="text-[8px] font-black text-foreground/40 uppercase mb-1">Ratio</p>
                 <p className="text-xs font-black text-foreground">{(data.complianceRatio * 100).toFixed(0)}%</p>
               </div>
             </div>

             {data.violation && (
               <div className="mt-3 flex items-center gap-2 text-damage animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">⚠️ Regulatory breach: {data.excessPollution} Mt overflow</span>
               </div>
             )}
            </motion.div>
          ))}
        </AnimatePresence>
        {complianceData.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-10">
             <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-foreground/20" />
             </div>
             <p className="text-xs font-black text-foreground/40 uppercase">No clusters matching criteria</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">
        <span>Planetary Integrity v5.0</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-healthy animate-pulse" />
          Live Regulatory Feed
        </div>
      </div>
    </div>
  );
}
