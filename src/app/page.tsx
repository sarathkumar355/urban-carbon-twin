"use client";

import { useState, useEffect } from "react";
import { StrategyComparison } from "@/components/StrategyComparison";
import { PollutionHotspots } from "@/components/PollutionHotspots";
import { EmissionForecast } from "@/components/EmissionForecast";
import { ReductionMeter } from "@/components/ReductionMeter";
import { IntelligentMitigationPanel } from "@/components/IntelligentMitigationPanel";
import { cityEmissions, monthlyTrend } from "@/data/emissionsData";
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
  TrendingDown
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
        <p className="text-[10px] text-scientific text-foreground/40">{label}</p>
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

function SimulationSlider({ label, value, onChange, suffix }: { label: string; value: number; onChange: (val: number) => void; suffix?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-black text-foreground/40">
        <span className="text-scientific tracking-[0.2em]">{label}</span>
        <span className="font-mono text-foreground">{value}{suffix}</span>
      </div>
      <div className="relative group/slider">
        <motion.input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          whileHover={{ scale: 1.005 }}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-healthy"
        />
        <div
          className="absolute top-0 left-0 h-1 rounded-full bg-healthy shadow-[0_0_12px_rgba(34,197,94,0.3)] pointer-events-none"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

const liveMessages = [
  "CO₂ concentration decreasing in urban sector",
  "Renewable energy adoption increased 4.2%",
  "Urban tree coverage improving in North District",
  "PM2.5 levels decreased 1.4%",
  "Transport emissions reduced this week",
];

export default function DashboardPage() {
  const {
    evAdoption,
    setEvAdoption,
    treesPlanted,
    setTreesPlanted,
    trafficReduction,
    setTrafficReduction,
    carbonCapture,
    setCarbonCapture,
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

  const BASELINE_EMISSIONS = 12.4;

  const reductionClamped = reductionPercentage;
  const currentResults: SimulationResults = {
    reductionPercent: reductionClamped,
    before: BASELINE_EMISSIONS,
    after: Number((BASELINE_EMISSIONS * (1 - reductionClamped / 100)).toFixed(2)),
  };

  const barChartData = [
    { name: "Baseline", emissions: BASELINE_EMISSIONS },
    { name: "Scenario", emissions: currentResults.after }
  ];

  const levers = [
    { key: "ev", label: "Electric vehicle adoption", value: evAdoption },
    { key: "trees", label: "Urban tree planting", value: treesPlanted },
    { key: "traffic", label: "Traffic reduction", value: trafficReduction },
    { key: "capture", label: "Carbon capture deployment", value: carbonCapture },
  ];

  const dominantLever = levers.reduce((max, curr) => (curr.value > max.value ? curr : max));

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

  const [emissionData, setEmissionData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/emissions");
      const data = await res.json();
      setEmissionData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (emissionData) {
      console.log("DATA LOADED:", emissionData);
    }
  }, [emissionData]);
  
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
          setSimulationResult({
            total: data?.total ?? 12.4,
            transport: data?.transport ?? 4.1,
            reduction: data?.reduction ?? 0
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setIsSimulating(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSimulation();
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
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
    { label: "Transport Emissions", value: `${transportSafe.toFixed(1)} Mt`, change: `${transportSafe < 4.1 ? "↓" : "↑"} ${Math.abs(((4.1 - transportSafe) / 4.1) * 100).toFixed(1)}% vs baseline`, trend: transportSafe <= 4.1 ? "down" : "up" },
    { label: "Industrial Emissions", value: `${industrialSafe.toFixed(1)} Mt`, change: `High intensity zone`, trend: industrialSafe <= (12.4 * 0.45) ? "down" : "up" },
    { label: "Residential Emissions", value: `${residentialSafe.toFixed(1)} Mt`, change: `Monitored sector`, trend: residentialSafe <= (12.4 * 0.22) ? "down" : "up" },
  ];

  const estimatedNetZeroYear = Math.max(2025, Math.floor(2036 - (totalSafe - 12.4) * 2)) || 2036;

  const cityEmissionsInfo = emissionData
    ? emissionData.sectors
    : { transport: 0, industrial: 0, residential: 0 };

  const monthlyTrendData = emissionData
    ? emissionData.trend.map((t: any) => ({
        month: t.month,
        emissions: t.emissions * (totalSafe / 12.4),
      }))
    : monthlyTrend;
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent px-4 py-6 text-eco-primary md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-eco-secondary/10 blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-eco-accent/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-eco-atmosphere/10 blur-[100px]" />
        <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-eco-primary/10 to-transparent" />
      </div>

      <div className="mx-auto flex max-w-7xl gap-6">
        <motion.aside
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-panel sticky top-6 hidden h-[calc(100vh-3rem)] w-56 shrink-0 flex-col rounded-3xl p-5 md:flex"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-healthy via-healthy to-blue-500 shadow-lg shadow-healthy/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-black tracking-widest text-foreground">URBANCARBON</p>
              <p className="text-[9px] text-scientific text-healthy">SATELLITE INTEL</p>
            </div>
          </div>
          <div className="mb-4 rounded-xl bg-white/5 border border-white/10 p-4 text-[11px] shadow-inner">
            <p className="text-foreground/60 font-black">Station: Neo Metro</p>
            <p className="mt-1 font-bold text-foreground">Grid: <span className="font-mono text-healthy">312</span> gCO₂/kWh</p>
          </div>
          <nav className="mt-2 flex flex-1 flex-col gap-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const currentIndex = navItems.findIndex((nav) => nav.id === activeSection);
                    const nextIndex = navItems.findIndex((nav) => nav.id === item.id);
                    setDirection(nextIndex > currentIndex ? 1 : -1);
                    setActiveSection(item.id as ActiveView);
                  }}
                  className={`group flex items-center gap-2 rounded-2xl px-3 py-2 text-left transition-all ${isActive ? "bg-eco-primary text-white shadow-lg shadow-eco-primary/30" : "text-eco-primary font-bold hover:bg-eco-primary/10"
                    }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-xl border transition-colors ${isActive ? "border-transparent bg-white/20" : "border-eco-primary/15 bg-white shadow-sm"
                    }`}>
                    <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-eco-primary"}`} />
                  </span>
                  <span className={`text-[11px] font-black tracking-wide ${isActive ? "text-white" : "text-eco-primary"}`}>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </motion.aside>

        <div className="flex-1 w-full overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSection}
              initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -40 : 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-6"
            >
              {activeSection === "dashboard" && (
                <section className="space-y-8">
                  <header>
                    <div className="flex items-center gap-4">
                      <div className="h-[2px] w-12 bg-healthy" />
                      <h1 className="text-scientific text-5xl font-black tracking-[0.3em] text-foreground">
                        Towards Net Zero
                      </h1>
                    </div>
                    <h2 className="text-scientific text-lg font-black text-foreground/40 mt-1">for Our Planet</h2>

                    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end">
                      <p className="max-w-xl text-sm leading-relaxed text-foreground/60 font-bold uppercase tracking-tight">
                        UrbanCarbon Twin helps cities choose the sustainable path. Tracking emissions in real-time toward a balanced planetary ecosystem.
                      </p>

                      {/* Live Feed Component */}
                      <div className="flex h-10 items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 shadow-xl backdrop-blur-md">
                        <Radio className="h-4 w-4 text-healthy animate-pulse" />
                        <div className="relative h-4 w-48 flex items-center overflow-hidden">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={messageIndex}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              className="absolute inset-0 flex items-center text-[10px] font-black text-foreground/80 tracking-widest uppercase"
                            >
                              {liveMessages[messageIndex]}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </header>

                  <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {statCards.map((card, index) => (
                      <StatCard key={card.label} index={index} {...card} />
                    ))}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * statCards.length, duration: 0.5, ease: "easeOut" }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="glass-panel relative overflow-hidden rounded-2xl bg-gradient-to-br from-eco-atmosphere/10 via-white/40 to-white/60 px-5 py-4"
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_var(--atmosphere-blue),_transparent_60%)]" />
                      <div className="relative space-y-2">
                        <p className="text-[10px] text-scientific text-eco-atmosphere font-bold">Carbon Neutrality Hub</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-2xl font-bold text-eco-primary tracking-tight">
                            {estimatedNetZeroYear}
                          </p>
                          <span className="text-[10px] text-eco-primary/40 font-mono font-bold">ESTIMATED</span>
                        </div>
                        <p className="text-[10px] text-eco-primary/60 leading-relaxed font-bold">
                          Monitoring city footprint toward absolute net zero by {estimatedNetZeroYear}.
                        </p>
                      </div>
                    </motion.div>
                  </section>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="col-span-1 lg:col-span-2">
                      <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="glass-panel relative overflow-hidden rounded-2xl p-4"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--healthy-primary),_transparent_70%)] opacity-[0.05]" />
                        <div className="relative flex items-center justify-between pb-6">
                          <div>
                            <h2 className="text-scientific text-[12px] text-foreground font-black tracking-[0.2em]">Atmospheric Grid Monitor</h2>
                            <p className="text-[10px] text-foreground/40 font-black uppercase tracking-tight mt-1">Real-time emission synthesis · Global MtCO₂e</p>
                          </div>
                        </div>
                        <div className="w-full h-[260px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyTrendData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
                              <YAxis stroke="rgba(255,255,255,0.3)" />
                              <Tooltip />

                              <Line
                                type="monotone"
                                dataKey="emissions"
                                stroke="#22c55e"
                                strokeWidth={3}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>  
                      </motion.section>
                    </div>
                    <div className="col-span-1">
                      <PollutionHotspots simulationResult={simulationResult} />
                    </div>
                    <div className="col-span-1 lg:col-span-3">
                      <EmissionForecast simulationResult={simulationResult} />
                    </div>
                  </div>
                </section>
              )}

              {activeSection === "map" && (
                <section className="glass-panel relative overflow-hidden rounded-2xl p-6 h-[500px]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-healthy/20 to-transparent" />
                  <div className="flex h-full flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-scientific text-[12px] font-black text-foreground tracking-[0.2em]">Regional Emission Heatmap</h2>
                        <p className="text-[10px] text-foreground/40 font-black uppercase tracking-tight">Real-time localized satellite carbon assessment metrics.</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {isSimulating && <span className="text-[10px] text-foreground/40 font-mono animate-pulse">Loading...</span>}
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                          <Map className="h-5 w-5 text-healthy" />
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 rounded-xl overflow-hidden border border-white/5 bg-black/20">
                      <PollutionMap simulationResult={simulationResult} />
                    </div>
                  </div>
                </section>
              )}

              {activeSection === "simulation" && (
                <section className="glass-panel relative overflow-hidden rounded-2xl p-5">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-eco-accent/20 to-transparent" />
                  <div className="relative space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-scientific text-[11px] font-black text-eco-primary">Climate Mitigation Simulator</h2>
                        <p className="text-[10px] text-eco-primary font-black">AI-driven climate intelligence for predictive scenario modeling.</p>
                      </div>
                      <div className="rounded-full border border-eco-primary/20 bg-eco-primary/5 px-3 py-1 text-[10px] font-bold text-eco-primary shadow-sm flex items-center gap-2">
                        {isSimulating && <Activity className="w-3 h-3 animate-pulse" />}
                        PROJECTED: ~{(simulationResult?.reduction ?? 0).toFixed(1)}% REDUCTION
                      </div>
                    </div>
                    <div className="pt-2">
                      <IntelligentMitigationPanel />
                    </div>

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.01, boxShadow: "0 10px 40px rgba(45,90,39,0.15)" }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => { setIsWizardOpen(true); setWizardStep(0); }}
                        className="group relative w-full rounded-xl bg-gradient-to-r from-eco-primary via-eco-secondary to-eco-accent px-4 py-3.5 text-[11px] text-scientific font-black text-white shadow-xl"
                      >
                        Initialize Climate Scenario Wizard
                      </motion.button>
                      <div className="mt-3 text-center">
                        <p className="text-[9px] text-white/40 font-medium">Monitoring city carbon footprint · AI-driven climate mitigation insights</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === "results" && (
                <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 min-h-[300px]">
                  <div className="col-span-full">
                    <ReductionMeter percentage={simulationResult?.reduction ?? currentResults.reductionPercent} />
                  </div>

                  <StrategyComparison />

                  <div className="glass-panel relative overflow-hidden rounded-2xl p-6">
                    <div className="relative space-y-4">
                      <h3 className="text-scientific text-[12px] font-black text-foreground tracking-[0.2em]">Baseline vs Scenario Differential</h3>
                      <div className="w-full h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} barSize={32}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tickLine={false} tickMargin={12} tick={{ fontSize: 10, fontWeight: 800, fill: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }} />
                            <YAxis stroke="rgba(255,255,255,0.3)" tickLine={false} tickMargin={12} tick={{ fontSize: 10, fontWeight: 800, fill: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }} />
                            <Tooltip contentStyle={{ background: "#050a06", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }} />
                            <Bar dataKey="emissions" radius={[4, 4, 0, 0]}>
                              {barChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? "#ef4444" : "#22c55e"} fillOpacity={0.8} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full glass-panel relative overflow-hidden rounded-2xl p-8 bg-black/40">
                    <div className="absolute top-0 right-0 -m-8 h-48 w-48 rounded-full bg-healthy/5 blur-3xl" />
                    <div className="relative space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-healthy/10 text-healthy border border-healthy/20">
                          <Activity size={16} />
                        </div>
                        <h3 className="text-scientific text-[12px] font-black text-foreground tracking-[0.2em]">Satellite Mitigation Synthesis</h3>
                      </div>
                      <div className="mt-2 grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                          <p className="text-[9px] text-scientific text-healthy font-black mb-2">Primary Recommendation</p>
                          <p className="text-sm font-black text-foreground">Advanced Point Source Capture + Fleet Electrification</p>
                        </div>
                        <div className="rounded-xl bg-white/5 p-4 border border-white/20">
                          <p className="text-[9px] text-scientific text-foreground/40 font-black mb-2">Projected Efficiency</p>
                          <p className="text-xl font-black text-healthy">{currentResults.reductionPercent.toFixed(1)}% <span className="text-[10px] text-foreground/40 font-black">REDUCTION</span></p>
                        </div>
                        <div className="rounded-xl bg-white/5 p-4 border border-white/10 md:col-span-1">
                          <p className="text-[9px] text-scientific text-foreground/40 font-black mb-2">Technical Justification</p>
                          <p className="text-[11px] leading-relaxed text-foreground/60 font-bold">
                            Synthesized data indicates industrial sector dominates CO₂ output. Carbon capture deployment targets 85% of point emissions.
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 text-center border-t border-white/5">
                        <p className="text-[10px] text-foreground/20 font-black text-scientific tracking-widest">Two Futures Dashboard · Planetary Carbon Synthesis</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === "assistant" && (
                <section className="relative overflow-hidden rounded-2xl border border-eco-primary/10 bg-white/40 p-5 backdrop-blur-2xl shadow-sm">
                  <div className="relative space-y-2">
                    <h2 className="flex items-center gap-2 text-sm font-bold text-eco-primary">
                      <MessageCircle className="h-4 w-4 text-eco-secondary" />
                      AI Assistant
                    </h2>
                    <p className="text-sm text-eco-primary/70 font-medium leading-relaxed">
                      To access the AI integration, please open the docked Chatbot widget floating in the bottom right corner of your screen. Llama 3 is ready.
                    </p>
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl">
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              className="glass-panel relative flex h-[65vh] w-full max-w-2xl flex-col rounded-[2.5rem] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-scientific text-[11px] font-black text-foreground tracking-[0.2em]">Climate Mitigation Scenario Wizard</h2>
                  <p className="text-[10px] text-foreground/40 mt-1 uppercase font-black">Synthesis Phase {wizardStep + 1} of 5</p>
                </div>
                <button
                  onClick={() => setIsWizardOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground/40 hover:text-foreground transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wizardStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="absolute inset-0 flex flex-col"
                  >
                    {wizardStep === 0 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="h-1 w-12 bg-healthy rounded-full mb-4" />
                          <h3 className="text-3xl font-black text-foreground tracking-tight">Fleet Electrification</h3>
                          <p className="text-sm text-foreground/60 font-medium leading-relaxed max-w-lg">Targeting tailpipe combustion emissions across the urban grid. Simulating transition vectors for 2030 net-zero compatibility.</p>
                        </div>
                        <div className="py-6 bg-white/5 rounded-2xl px-6 border border-white/10 mt-4">
                          <SimulationSlider label="EV Transition Target" value={evAdoption} onChange={setEvAdoption} suffix="%" />
                        </div>
                      </div>
                    )}
                    {wizardStep === 1 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="h-1 w-12 bg-healthy rounded-full mb-4" />
                          <h3 className="text-3xl font-black text-foreground tracking-tight">Urban Afforestation</h3>
                          <p className="text-sm text-foreground/60 font-medium leading-relaxed max-w-lg">Optimizing natural carbon sequestration via photosynthetic biomass density in high-density sectors.</p>
                        </div>
                        <div className="py-6 bg-white/5 rounded-2xl px-6 border border-white/10 mt-4">
                          <SimulationSlider label="Tree Density (k units)" value={treesPlanted} onChange={setTreesPlanted} suffix="k" />
                        </div>
                      </div>
                    )}
                    {wizardStep === 2 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="h-1 w-12 bg-healthy rounded-full mb-4" />
                          <h3 className="text-3xl font-black text-foreground tracking-tight">Transit Flow Dynamics</h3>
                          <p className="text-sm text-foreground/60 font-medium leading-relaxed max-w-lg">AI-driven traffic optimization to minimize idle-state emissions and maximize urban transit efficiency.</p>
                        </div>
                        <div className="py-6 bg-white/5 rounded-2xl px-6 border border-white/10 mt-4">
                          <SimulationSlider label="Congestion Mitigation" value={trafficReduction} onChange={setTrafficReduction} suffix="%" />
                        </div>
                      </div>
                    )}
                    {wizardStep === 3 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="h-1 w-12 bg-healthy rounded-full mb-4" />
                          <h3 className="text-3xl font-black text-foreground tracking-tight">Direct Carbon Capture</h3>
                          <p className="text-sm text-foreground/60 font-medium leading-relaxed max-w-lg">Deploying point-source capture infrastructure at industrial hubs to neutralize high-intensity emission streams.</p>
                        </div>
                        <div className="py-6 bg-white/5 rounded-2xl px-6 border border-white/10 mt-4">
                          <SimulationSlider label="Capture Capacity" value={carbonCapture} onChange={setCarbonCapture} suffix="%" />
                        </div>
                      </div>
                    )}
                    {wizardStep === 4 && (
                      <div className="space-y-6 text-center py-6">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-healthy/10 text-healthy mb-2 ring-1 ring-healthy/20">
                          <Activity size={40} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-scientific text-[12px] font-black text-healthy tracking-[0.3em]">SYNTHESIS COMPLETE</h3>
                          <div className="py-8">
                            <p className="text-8xl font-black text-foreground tracking-tighter">
                              {currentResults.reductionPercent.toFixed(1)}<span className="text-3xl text-healthy ml-2">%</span>
                            </p>
                            <p className="text-[10px] text-scientific text-foreground/40 font-black mt-6 tracking-[0.3em] uppercase">Estimated Planetary Load Reduction</p>
                          </div>

                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-between mt-auto pt-8 border-t border-white/5">
                <button
                  onClick={() => wizardStep === 0 ? setIsWizardOpen(false) : setWizardStep(w => w - 1)}
                  className="px-6 py-2.5 text-[11px] text-scientific font-black text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest"
                >
                  {wizardStep === 0 ? "Abort" : "Back"}
                </button>
                <button
                  onClick={() => wizardStep === 4 ? applyResultsToDashboard() : setWizardStep(w => w + 1)}
                  className="rounded-2xl bg-healthy px-10 py-4 text-[12px] text-scientific font-black text-white hover:bg-healthy/90 transition-all shadow-2xl shadow-healthy/20 uppercase tracking-widest"
                >
                  {wizardStep === 4 ? "Initialize Planetary Path" : "Next Phase"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}