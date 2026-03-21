"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

const strategyData = [
  { name: "EV Adoption", impact: 85 },
  { name: "Reforestation", impact: 45 },
  { name: "Grid intensity", impact: 65, status: "critical" },
  { name: "Public Transit", impact: 55 },
];

export function StrategyComparison() {
  return (
    <div className="glass-panel relative flex h-full flex-col overflow-hidden rounded-2xl p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--healthy-primary),_transparent_75%)] opacity-[0.05]" />

      <div className="mb-6 relative">
        <h3 className="text-scientific text-[12px] text-foreground font-black tracking-[0.2em]">Mitigation Efficacy Matrix</h3>
        <p className="text-[10px] text-foreground/40 font-black uppercase tracking-tight mt-1">Comparing policy impact across urban sectors.</p>
      </div>

      <div className="flex-1 min-h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={strategyData} layout="vertical" margin={{ left: -10, right: 30, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 10, fontWeight: 800, fill: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono' }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{ background: "#050a06", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
              labelStyle={{ color: "white", fontWeight: "bold" }}
            />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={24}>
              {strategyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.status === "critical" ? "#ef4444" : "#22c55e"}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
