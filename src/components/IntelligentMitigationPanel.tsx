"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulation } from "@/context/SimulationContext";
import {
  calculateAfforestation,
  calculateEvTransition,
  calculateTransitFlow,
  calculateDAC,
  TreeType, SoilType, WaterAvail,
  ChargingDensity, GridCapacity,
  CongestionZone, PublicTransport,
  CostBudget, EnergySource
} from "@/utils/mitigationIntelligence";
import { Activity, Leaf, Car, Navigation, Factory, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

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

function Dropdown({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: any) => void }) {
  return (
    <div className="flex-1 min-w-[120px]">
      <label className="text-[8px] tracking-widest uppercase font-black text-foreground/40 mb-1.5 block">{label}</label>
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold px-2 py-1.5 outline-none focus:border-healthy/50"
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
  const { setTreesPlanted, setEvAdoption, setTrafficReduction, setCarbonCapture } = useSimulation();

  const [activeTab, setActiveTab] = useState(0);

  // 1. Afforestation
  const [rawTrees, setRawTrees] = useState(55);
  const [treeType, setTreeType] = useState<TreeType>("Neem");
  const [soilType, setSoilType] = useState<SoilType>("Clay");
  const [waterAvail, setWaterAvail] = useState<WaterAvail>("Medium");
  const afforestIntel = calculateAfforestation(rawTrees, treeType, soilType, waterAvail);

  // 2. EV Transition
  const [rawEv, setRawEv] = useState(40);
  const [charging, setCharging] = useState<ChargingDensity>("Adequate");
  const [grid, setGrid] = useState<GridCapacity>("Stable");
  const evIntel = calculateEvTransition(rawEv, charging, grid);

  // 3. Transit Flow
  const [rawTraffic, setRawTraffic] = useState(30);
  const [zone, setZone] = useState<CongestionZone>("T Nagar / Central");
  const [transport, setTransport] = useState<PublicTransport>("Moderate");
  const transitIntel = calculateTransitFlow(rawTraffic, zone, transport);

  // 4. DAC
  const [rawDac, setRawDac] = useState(20);
  const [budget, setBudget] = useState<CostBudget>("Medium ($$)");
  const [energy, setEnergy] = useState<EnergySource>("Mixed Grid");
  const dacIntel = calculateDAC(rawDac, budget, energy);

  // Effect Sync
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
      {/* Tab Navigation */}
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

      {/* Intelligence Cards */}
      <div className="bg-black/20 rounded-2xl p-4 border border-white/5 min-h-[300px]">
        <AnimatePresence mode="wait">
          
          {activeTab === 0 && (
            <motion.div key="aff" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-5">
              <Slider label="Tree Deployment Volume" value={rawTrees} onChange={setRawTrees} suffix="k units" />
              <div className="flex flex-wrap gap-3">
                <Dropdown label="Tree Genus" value={treeType} options={["Neem", "Banyan", "Mangroves"]} onChange={setTreeType} />
                <Dropdown label="Soil Variant" value={soilType} options={["Coastal", "Clay", "Sandy"]} onChange={setSoilType} />
                <Dropdown label="Water Saturation" value={waterAvail} options={["Low", "Medium", "High"]} onChange={setWaterAvail} />
              </div>
              <InsightCard {...afforestIntel} />
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div key="ev" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-5">
               <Slider label="EV Transition Target" value={rawEv} onChange={setRawEv} suffix="%" />
               <div className="flex flex-wrap gap-3">
                 <Dropdown label="Charging Density" value={charging} options={["Poor", "Adequate", "Extensive"]} onChange={setCharging} />
                 <Dropdown label="Grid Load Capacity" value={grid} options={["Strained", "Stable", "Surplus"]} onChange={setGrid} />
               </div>
               <InsightCard {...evIntel} />
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div key="transit" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-5">
               <Slider label="Traffic Optimization Matrix" value={rawTraffic} onChange={setRawTraffic} suffix="%" />
               <div className="flex flex-wrap gap-3">
                 <Dropdown label="Congestion Zone" value={zone} options={["T Nagar / Central", "IT Corridor (OMR)", "Suburbs"]} onChange={setZone} />
                 <Dropdown label="Transit Coverage" value={transport} options={["Poor", "Moderate", "Extensive"]} onChange={setTransport} />
               </div>
               <InsightCard {...transitIntel} />
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div key="dac" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-5">
               <Slider label="Direct Air Capture Scale" value={rawDac} onChange={setRawDac} suffix="%" />
               <div className="flex flex-wrap gap-3">
                 <Dropdown label="Capital Budget" value={budget} options={["Low ($)", "Medium ($$)", "High ($$$)"]} onChange={setBudget} />
                 <Dropdown label="Energy Source Matrix" value={energy} options={["Fossil Heavy", "Mixed Grid", "100% Renewable"]} onChange={setEnergy} />
               </div>
               <InsightCard {...dacIntel} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
