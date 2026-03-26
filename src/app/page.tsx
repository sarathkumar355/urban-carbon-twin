"use client";

import { useState, useEffect } from "react";
import { StrategyComparison } from "@/components/StrategyComparison";
import { PollutionHotspots } from "@/components/PollutionHotspots";
import { EmissionForecast } from "@/components/EmissionForecast";
import { ReductionMeter } from "@/components/ReductionMeter";
import { IntelligentMitigationPanel } from "@/components/IntelligentMitigationPanel";
import { IndustryRegulationPanel } from "@/components/IndustryRegulationPanel";
import { PolicyImpactChart } from "@/components/PolicyImpactChart";
import { CarbonBudgetTracker } from "@/components/CarbonBudgetTracker";
import Chatbot from "@/components/Chatbot";
import { emissionsHistory } from "@/data/emissionsHistory";
import { CLAMP_LIMITS } from "@/data/simulationConstants";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useSimulation } from "@/context/SimulationContext";
import {
  LayoutDashboard,
  Map,
  SlidersHorizontal,
  BarChart3,
  MessageCircle,
  Radio,
  Activity,
  TrendingUp,
  TrendingDown,
  BrainCircuit,
  ShieldCheck
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

type SimulationResults = {
  reductionPercent: number;
  before: number;
  after: number;
};

type ActiveView = "dashboard" | "map" | "simulation" | "results" | "assistant";

const PollutionMap = dynamic(
  () => import("../components/PollutionMap").then((m) => m.PollutionMap),
  { ssr: false }
);

const navItems = [
  { id: "dashboard", label: "Intelligence Center", icon: LayoutDashboard },
  { id: "map", label: "Risk Heatmap", icon: Map },
  { id: "simulation", label: "Mitigation Simulator", icon: SlidersHorizontal },
  { id: "results", label: "Sustainability Audit", icon: BarChart3 },
  { id: "assistant", label: "Climate AI", icon: MessageCircle },
];

function StatCard({ label, value, change, index, trend }: { label: string; value: string; change: string; index: number; trend: string }) {
  const isHealthy = trend === "down";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`glass-panel group relative overflow-hidden rounded-2xl px-5 py-4 border-l-4 ${isHealthy ? 'border-l-healthy' : 'border-l-damage/50'}`}
    >
      <div className={`absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top,_var(--healthy-primary),_transparent_70%)] ${!isHealthy && 'bg-[radial-gradient(circle_at_top,_var(--damage-primary),_transparent_70%)]'}`} />
      <div className="relative space-y-2">
        <p className="text-[10px] text-scientific text-foreground/40 font-black">{label}</p>
        <p className="text-2xl font-black text-foreground tracking-tight">{value}</p>
        <div className="flex items-center gap-1.5">
          {trend === "down" ? <TrendingDown className="h-3.5 w-3.5 text-healthy" /> : <TrendingUp className="h-3.5 w-3.5 text-damage" />}
          <p className={`text-[10px] font-black uppercase tracking-tight ${isHealthy ? "text-healthy" : "text-damage"}`}>
            {change}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

const liveMessages = [
  "Atmospheric streamline sync: Active",
  "Policy effectiveness grading complete: A (Combined)",
  "Sector carbon monitoring: Industrial cluster High",
  "Planetary boundary check: 18.4% remaining",
  "Urban canopy intelligence: Best match (Neem) identified",
];

export default function DashboardPage() {
  const {
    evAdoption,
    treesPlanted,
    trafficReduction,
    carbonCapture,
    reductionPercentage,
  } = useSimulation();
  
  const [activeSection, setActiveSection] = useState<ActiveView>("dashboard");
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [direction, setDirection] = useState(1);
  const [simulationResult, setSimulationResult] = useState({
    total: 12.4,
    transport: 4.1,
    reduction: 0
  });
  const [isSimulating, setIsSimulating] = useState(false);

  // BASELINE CONSTANTS
  const BASELINE_EMISSIONS = 12.4;

  const reductionClamped = reductionPercentage || 0;
  const currentResults: SimulationResults = {
    reductionPercent: reductionClamped,
    before: BASELINE_EMISSIONS,
    after: Number(Math.max(CLAMP_LIMITS.min, Math.min(CLAMP_LIMITS.max, BASELINE_EMISSIONS * (1 - reductionClamped / 100))).toFixed(2)),
  };

  const barChartData = [
    { name: "Baseline", emissions: BASELINE_EMISSIONS },
    { name: "Scenario", emissions: currentResults.after }
  ];

  const applyResultsToDashboard = () => {
    setResults(currentResults);
    setIsWizardOpen(false);
    setActiveSection("results");
  };

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % liveMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    let active = true;
    const fetchSimulation = async () => {
      setIsSimulating(true);
      try {
        const res = await fetch("/api/simulation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trafficReduction,
            treesPlanted,
            evAdoption,
            carbonCapture
          })
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (active) {
          // Robust math fixes
          const totalVal = Number(data?.total) || 12.4;
          const transportVal = Number(data?.transport) || 4.1;
          const reductionVal = Number(data?.reduction) || 0;

          setSimulationResult({
            total: Math.max(CLAMP_LIMITS.min, Math.min(CLAMP_LIMITS.max, totalVal)),
            transport: transportVal,
            reduction: reductionVal
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setIsSimulating(false);
      }
    };

    const timeoutId = setTimeout(fetchSimulation, 300);
    return () => { active = false; clearTimeout(timeoutId); };
  }, [trafficReduction, treesPlanted, evAdoption, carbonCapture]);

  const totalSafe = simulationResult?.total ?? 12.4;
  const transportSafe = simulationResult?.transport ?? 4.1;
  const industrialSafe = totalSafe * 0.45;
  const residentialSafe = totalSafe * 0.22;

  const percentChange = ((12.4 - totalSafe) / 12.4) * 100;
  const isDown = percentChange >= 0;
  const formattedChange = `${isDown ? "↓" : "↑"} ${Math.abs(percentChange).toFixed(1)}% ${isDown ? "reduction" : "increase"}`;
  
  const statCards = [
    { label: "Total CO₂ Emissions", value: `${totalSafe.toFixed(1)} Mt`, change: formattedChange, trend: isDown ? "down" : "up" },
    { label: "Transport Sector", value: `${transportSafe.toFixed(1)} Mt`, change: `${transportSafe < 4.1 ? "↓" : "↑"} ${Math.abs(((4.1 - transportSafe) / 4.1) * 100).toFixed(1)}% vs base`, trend: transportSafe <= 4.1 ? "down" : "up" },
    { label: "Industrial Cluster", value: `${industrialSafe.toFixed(1)} Mt`, change: `High Intensity`, trend: industrialSafe <= (12.4 * 0.45) ? "down" : "up" },
    { label: "Residential Sector", value: `${residentialSafe.toFixed(1)} Mt`, change: `Sustained Load`, trend: residentialSafe <= (12.4 * 0.22) ? "down" : "up" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent px-4 py-6 text-eco-primary md:px-8 md:py-8">
      <div className="mx-auto flex max-w-[1400px] gap-6">
        {/* SIDEBAR */}
        <motion.aside
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass-panel sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col rounded-3xl p-5 md:flex"
        >
          <div className="mb-8 flex items-center gap-3">
             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-healthy via-blue-500 to-eco-accent shadow-xl">
               <BrainCircuit className="h-6 w-6 text-white" />
             </div>
             <div>
               <p className="text-xs font-black tracking-widest text-foreground uppercase">CarbonAI</p>
               <p className="text-[9px] text-healthy font-black opacity-60 tracking-wider">Planetary Twin v3.0</p>
             </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setDirection(navItems.findIndex(n => n.id === item.id) > navItems.findIndex(n => n.id === activeSection) ? 1 : -1);
                    setActiveSection(item.id as ActiveView);
                  }}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${isActive ? "bg-foreground text-background shadow-2xl" : "text-foreground/40 font-bold hover:bg-white/5"}`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-background" : "text-foreground/40"}`} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <CarbonBudgetTracker />
            <div className="p-4 rounded-2xl bg-healthy/5 border border-healthy/10">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-healthy" />
                <span className="text-[9px] font-black uppercase text-healthy tracking-tight">System Integrity</span>
              </div>
              <p className="text-[10px] text-foreground/40 font-bold leading-relaxed">All telemetry points synchronized with validated historical benchmarks.</p>
            </div>
          </div>
        </motion.aside>

        {/* CONTENT */}
        <div className="flex-1 w-full max-w-full overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSection}
              initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -40 : 40, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {activeSection === "dashboard" && (
                <div className="space-y-8 pb-12">
                  <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                      <h1 className="text-scientific text-6xl font-black tracking-[0.2em] text-foreground uppercase leading-tight">Climate<br/>Intelligence</h1>
                      <div className="flex items-center gap-3 mt-4">
                         <span className="px-3 py-1 bg-healthy/20 border border-healthy/30 text-healthy text-[9px] font-black tracking-[0.3em] rounded-full uppercase">Tamil Nadu Monitor</span>
                         <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Global Emissions Inventory v2025.1</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-black/40 p-1.5 rounded-full border border-white/5 pr-4 shadow-2xl backdrop-blur-md">
                      <div className="h-8 w-8 rounded-full bg-healthy flex items-center justify-center animate-pulse">
                        <Radio className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-48 overflow-hidden h-4 relative">
                        <AnimatePresence mode="wait">
                          <motion.p 
                            key={messageIndex} 
                            initial={{ y: 20, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            exit={{ y: -20, opacity: 0 }}
                            className="absolute inset-0 text-[10px] font-black uppercase tracking-widest text-foreground/60"
                          >
                            {liveMessages[messageIndex]}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </header>

                  <div className="grid gap-4 md:grid-cols-4">
                    {statCards.map((card, index) => <StatCard key={card.label} index={index} {...card} />)}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="glass-panel p-6 rounded-[2rem] border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Activity size={120} />
                        </div>
                        <h2 className="text-scientific text-[12px] font-black text-foreground uppercase tracking-[0.3em] mb-6 block">Atmospheric History (2014-2024 Index)</h2>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={emissionsHistory}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="year" stroke="#ffffff30" fontSize={10} tick={{ fontWeight: 'black' }} />
                              <YAxis stroke="#ffffff30" fontSize={10} domain={['dataMin - 1000', 'dataMax + 1000']} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "10px" }}
                                filterNull={false}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#22c55e" 
                                strokeWidth={4} 
                                dot={{ fill: '#22c55e', r: 3 }}
                                activeDot={{ r: 6, fill: 'white' }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <PolicyImpactChart />
                    </div>

                    <div className="space-y-6">
                      <PollutionHotspots />
                      <div className="glass-panel p-6 rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-eco-accent/5 border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                           <BrainCircuit className="w-5 h-5 text-blue-400" />
                           <h3 className="text-[11px] font-black uppercase tracking-widest">AI Strategic Insight</h3>
                        </div>
                        <p className="text-xs font-bold leading-relaxed text-foreground/70 uppercase tracking-tight italic">
                           "Current simulation data reveals that combined Fleet Electrification and Industrial Point Capture provides a 3.2x faster path to Net Zero than afforestation alone in Tamil Nadu hubs."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <IndustryRegulationPanel />
                    <EmissionForecast simulationResult={simulationResult} />
                  </div>
                </div>
              )}

              {activeSection === "map" && <PollutionMap />}

              {activeSection === "simulation" && (
                <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-10 border border-white/10">
                   <div className="absolute top-0 right-0 -m-12 h-64 w-64 rounded-full bg-healthy/10 blur-[100px]" />
                   <div className="relative">
                     <div className="flex items-center justify-between gap-4 mb-8">
                        <div>
                          <h2 className="text-scientific text-3xl font-black text-foreground tracking-[0.1em] uppercase">Policy Simulator</h2>
                          <p className="text-[10px] text-foreground/40 font-black uppercase tracking-[0.2em] mt-2">Adjust climate levers to project atmospheric outcomes.</p>
                        </div>
                        <div className="px-6 py-3 bg-healthy/10 border border-healthy/20 rounded-2xl">
                          <p className="text-[9px] font-black text-healthy uppercase tracking-widest mb-1">Projected reduction</p>
                          <p className="text-3xl font-black text-foreground">{simulationResult.reduction.toFixed(1)}%</p>
                        </div>
                     </div>
                     <IntelligentMitigationPanel />
                     <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => { setIsWizardOpen(true); setWizardStep(0); }}
                        className="mt-8 w-full py-5 bg-foreground text-background text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl transition-all"
                      >
                        Enter Planetary Scenario Wizard
                      </motion.button>
                   </div>
                </div>
              )}

              {activeSection === "results" && (
                <div className="grid gap-6">
                   <ReductionMeter percentage={simulationResult.reduction} />
                   <div className="grid gap-6 md:grid-cols-2">
                      <StrategyComparison />
                      <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-center text-center space-y-4">
                         <h3 className="text-[10px] font-black uppercase text-foreground/40 tracking-[0.3em]">Planetary Path Synthesis</h3>
                         <div className="py-6">
                            <p className="text-6xl font-black text-foreground">{currentResults.after.toFixed(1)} <span className="text-xl text-foreground/40">Mt</span></p>
                            <p className="text-[9px] font-black text-healthy uppercase tracking-widest mt-2">Simulated Emission Future</p>
                         </div>
                         <p className="text-xs font-bold leading-relaxed text-foreground/60 uppercase">
                            Your configured strategies avoid approximately {(12.4 - currentResults.after).toFixed(1)} million metric tons of carbon yearly.
                         </p>
                      </div>
                   </div>
                </div>
              )}

              {activeSection === "assistant" && (
                <div className="glass-panel h-[720px] rounded-[2.5rem] overflow-hidden border border-white/10 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                  <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                          <BrainCircuit size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <h2 className="text-scientific text-[14px] font-black text-foreground tracking-[0.1em] uppercase">Climate Strategy Assistant</h2>
                          <p className="text-[9px] text-healthy font-black uppercase tracking-[0.2em] animate-pulse">Neural Core Online</p>
                        </div>
                     </div>
                     <span className="text-[9px] font-black px-3 py-1 bg-white/5 rounded-full border border-white/10 text-white/40 uppercase tracking-widest">Model: Llama 3 - 70B</span>
                  </div>
                  <div className="h-full">
                    <Chatbot />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl px-4">
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              className="glass-panel relative flex h-[70vh] w-full max-w-4xl flex-col rounded-[3rem] p-12 shadow-2xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-scientific text-[11px] font-black text-foreground tracking-[0.3em] uppercase">Planetary Scenario Engine</h2>
                  <p className="text-[10px] text-foreground/40 mt-1 uppercase font-black">Synthesis Hub • Phase {wizardStep + 1} / 5</p>
                </div>
                <button onClick={() => setIsWizardOpen(false)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground/40 hover:text-foreground">✕</button>
              </div>

              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div key={wizardStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 flex flex-col justify-center">
                    {wizardStep === 0 && (
                      <div className="space-y-8 max-w-2xl mx-auto text-center">
                        <div className="space-y-4">
                          <h3 className="text-5xl font-black text-foreground tracking-tighter">Fleet Transition</h3>
                          <p className="text-sm text-foreground/40 font-bold leading-relaxed uppercase">Mapping electrification vectors for urban transport hubs.</p>
                        </div>
                        <div className="py-10 bg-white/5 rounded-3xl px-10 border border-white/10 shadow-inner">
                           <div className="flex justify-between text-[11px] font-black mb-4"><span className="text-foreground/40">TARGET ADOPTION</span> <span className="text-healthy">{evAdoption}%</span></div>
                           <input type="range" min="0" max="100" value={evAdoption} onChange={(e) => setEvAdoption(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none bg-white/10 accent-healthy cursor-pointer" />
                        </div>
                      </div>
                    )}
                    {wizardStep === 4 && (
                      <div className="space-y-8 text-center py-6">
                        <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-healthy/10 text-healthy border border-healthy/20 shadow-2xl shadow-healthy/10 mb-4">
                          <ShieldCheck size={48} />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-scientific text-[14px] font-black text-healthy tracking-[0.4em] uppercase">Simulation Visualized</h3>
                          <p className="text-9xl font-black text-foreground tracking-tight">
                            {reductionPercentage.toFixed(1)}<span className="text-4xl text-healthy ml-2">%</span>
                          </p>
                          <p className="text-[10px] text-scientific text-foreground/30 font-black tracking-[0.5em] uppercase mt-12">Planetary Differential Stabilized</p>
                        </div>
                      </div>
                    )}
                    {/* Simplified other steps to save space, keeping logic */}
                    {[1, 2, 3].includes(wizardStep) && (
                      <div className="text-center space-y-8">
                         <h3 className="text-4xl font-black uppercase text-foreground">Phase Integration {wizardStep + 1}</h3>
                         <p className="text-xs text-foreground/40 font-bold uppercase">Adjusting complex mitigation coefficients...</p>
                         <div className="max-w-md mx-auto py-8 px-10 bg-white/5 border border-white/10 rounded-2xl">
                            {wizardStep === 1 && <input type="range" value={treesPlanted} onChange={e => setTreesPlanted(Number(e.target.value))} className="w-full" />}
                            {wizardStep === 2 && <input type="range" value={trafficReduction} onChange={e => setTrafficReduction(Number(e.target.value))} className="w-full" />}
                            {wizardStep === 3 && <input type="range" value={carbonCapture} onChange={e => setCarbonCapture(Number(e.target.value))} className="w-full" />}
                         </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-between mt-auto pt-10 border-t border-white/5 font-black text-scientific uppercase tracking-widest text-[11px]">
                <button onClick={() => wizardStep === 0 ? setIsWizardOpen(false) : setWizardStep(w => w - 1)} className="text-foreground/30 hover:text-foreground">{wizardStep === 0 ? "Abort" : "Back"}</button>
                <button onClick={() => wizardStep === 4 ? applyResultsToDashboard() : setWizardStep(w => w + 1)} className="px-12 py-4 bg-healthy text-white rounded-2xl shadow-2xl hover:bg-healthy/90 transition-all">{wizardStep === 4 ? "Finalize" : "Next"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}