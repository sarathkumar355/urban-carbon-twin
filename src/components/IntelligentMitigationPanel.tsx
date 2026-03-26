"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulation } from "@/context/SimulationContext";
import {
  calculateAfforestation,
  calculateEvTransition,
  calculateTransitFlow,
  calculateDAC,
  TreeType
} from "@/utils/mitigationIntelligence";
import { Leaf, Car, Navigation, Factory, AlertTriangle, CheckCircle2 } from "lucide-react";

function InsightCard({ score, recommendation, limitation }: { score: string, recommendation: string, limitation: string }) {
  const getScoreColor = () => {
    if (score.includes("A")) return "text-healthy border-healthy";
    if (score.includes("B") || score.includes("C")) return "text-blue-400 border-blue-400";
    if (score.includes("D")) return "text-amber-500 border-amber-500";
    return "text-damage border-damage";
  };

  return (
    <div className="mt-3 bg-black/40 border border-white/5 rounded-xl p-4 flex gap-4">
      <div className={`flex shrink-0 items-center justify-center font-black text-2xl w-12 h-12 rounded-lg border-2 ${getScoreColor()}`}>
        {score}
      </div>
      <div className="space-y-2 flex-1">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-healthy mt-0.5 shrink-0" />
          <p className="text-[10px] uppercase font-bold text-foreground/80 leading-snug">{recommendation}</p>
        </div>
        <div className="flex items-start gap-2 pt-1 border-t border-white/10">
          <AlertTriangle className="w-3.5 h-3.5 text-damage mt-0.5 shrink-0" />
          <p className="text-[10px] uppercase font-bold text-damage/80 leading-snug">{limitation}</p>
        </div>
      </div>
    </div>
  );
}

function RegionBadge({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex-1 min-w-[120px] bg-white/5 border border-white/10 rounded-lg p-2">
      <p className="text-[8px] tracking-widest uppercase font-black text-foreground/40 mb-1">{label}</p>
      <p className="text-[10px] font-bold text-white uppercase">{value}</p>
    </div>
  );
}

function SelectDropdown({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: any) => void }) {
  return (
    <div className="flex-1 min-w-[120px]">
      <label className="text-[8px] tracking-widest uppercase font-black text-foreground/40 mb-1 block">{label}</label>
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold px-2 py-1.5 outline-none focus:border-healthy/50 text-healthy placeholder-white"
      >
        {options.map(o => <option key={o} value={o} className="bg-neutral-900 text-white">{o}</option>)}
      </select>
    </div>
  );
}

function Slider({ label, value, onChange, suffix }: { label: string; value: number; onChange: (val: number) => void; suffix?: string }) {
  return (
    <div className="space-y-2 w-full pt-1">
      <div className="flex items-center justify-between text-[11px] font-black text-foreground/40">
        <span className="text-scientific tracking-[0.2em]">{label}</span>
        <span className="font-mono text-foreground text-sm">{value.toFixed(0)}{suffix}</span>
      </div>
      <div className="relative group/slider">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-healthy relative z-10"
        />
        <div
          className="absolute top-0 left-0 h-1.5 rounded-full bg-healthy shadow-[0_0_12px_rgba(34,197,94,0.3)] pointer-events-none"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function IntelligentMitigationPanel() {
  const { 
    setTreesPlanted, setEvAdoption, setTrafficReduction, setCarbonCapture,
    selectedRegion 
  } = useSimulation();

  const [activeTab, setActiveTab] = useState(0);

  // Raw local slider states
  const [rawTrees, setRawTrees] = useState(55);
  const [treeType, setTreeType] = useState<TreeType>("Neem");
  
  const [rawEv, setRawEv] = useState(40);
  const [rawTraffic, setRawTraffic] = useState(30);
  const [rawDac, setRawDac] = useState(20);

  // Dynamic Intelligence Lookups against region constants
  // "treeType" remains selectable so the AI can grade if the user picks the wrong tree for the region!
  const afforestIntel = calculateAfforestation(rawTrees, treeType, selectedRegion.soilType, selectedRegion.waterAvail);
  const evIntel = calculateEvTransition(rawEv, selectedRegion.chargingDensity, selectedRegion.gridCapacity);
  const transitIntel = calculateTransitFlow(rawTraffic, selectedRegion.congestionZone, selectedRegion.transitCoverage);
  const dacIntel = calculateDAC(rawDac, selectedRegion.dacBudget, selectedRegion.energySource);

  useEffect(() => { setTreesPlanted(afforestIntel.effectiveTrees); }, [afforestIntel.effectiveTrees]);
  useEffect(() => { setEvAdoption(evIntel.effectiveEv); }, [evIntel.effectiveEv]);
  useEffect(() => { setTrafficReduction(transitIntel.effectiveTraffic); }, [transitIntel.effectiveTraffic]);
  useEffect(() => { setCarbonCapture(dacIntel.effectiveCapture); }, [dacIntel.effectiveCapture]);

  const tabs = [
    { title: "Afforestation", icon: Leaf },
    { title: "Fleet EV", icon: Car },
    { title: "Transit AI", icon: Navigation },
    { title: "Capture", icon: Factory },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {tabs.map((t, i) => {
          const Icon = t.icon;
          const isActive = activeTab === i;
          return (
            <button
              key={t.title}
              onClick={() => setActiveTab(i)}
              className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                isActive ? "bg-healthy/10 border-healthy/40 text-healthy" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-black uppercase tracking-wider">{t.title}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-black/20 rounded-2xl p-4 border border-white/5 min-h-[300px]">
        <AnimatePresence mode="wait">
          
          {activeTab === 0 && (
            <motion.div key="aff" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-4">
              <Slider label="Tree Deployment Volume" value={rawTrees} onChange={setRawTrees} suffix="k units" />
              <div className="flex flex-wrap gap-2">
                <SelectDropdown label="Simulate Species" value={treeType} options={["Neem", "Banyan", "Mangroves"]} onChange={setTreeType} />
                <RegionBadge label="Region Soil" value={selectedRegion.soilType} />
                <RegionBadge label="Water Tracking" value={selectedRegion.waterAvail} />
              </div>
              <InsightCard {...afforestIntel} />
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div key="ev" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-4">
               <Slider label="EV Transition Target" value={rawEv} onChange={setRawEv} suffix="%" />
               <div className="flex flex-wrap gap-2">
                 <RegionBadge label="Infrastructure" value={selectedRegion.chargingDensity} />
                 <RegionBadge label="Power Grid Matrix" value={selectedRegion.gridCapacity} />
               </div>
               <InsightCard {...evIntel} />
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div key="transit" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-4">
               <Slider label="Traffic Optimization Matrix" value={rawTraffic} onChange={setRawTraffic} suffix="%" />
               <div className="flex flex-wrap gap-2">
                 <RegionBadge label="Core Logistics" value={selectedRegion.congestionZone} />
                 <RegionBadge label="Public Transit Flow" value={selectedRegion.transitCoverage} />
               </div>
               <InsightCard {...transitIntel} />
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div key="dac" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-4">
               <Slider label="Direct Air Capture Scale" value={rawDac} onChange={setRawDac} suffix="%" />
               <div className="flex flex-wrap gap-2">
                 <RegionBadge label="Regional Budget" value={selectedRegion.dacBudget} />
                 <RegionBadge label="Power Source Core" value={selectedRegion.energySource} />
               </div>
               <InsightCard {...dacIntel} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
