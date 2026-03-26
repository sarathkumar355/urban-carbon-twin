"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function PolicyImpactChart() {
  const data = Array.from({ length: 11 }, (_, i) => {
    const year = 2025 + i;
    const base = 100 - i * 0.5;
    return {
      year,
      Baseline: base + Math.random() * 2,
      "EV Strategy": base - i * 1.2,
      "Forest Strategy": base - i * 0.8,
      "Combined AI": base - i * 2.5
    };
  });

  return (
    <div className="h-[300px] w-full bg-black/20 rounded-xl p-4 border border-white/5">
      <h4 className="text-[10px] font-black uppercase text-foreground/60 mb-4 tracking-widest">Strategic Policy Impact (2025-2035 Projection)</h4>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis dataKey="year" fontSize={10} stroke="#ffffff30" />
          <YAxis fontSize={10} stroke="#ffffff30" domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px" }}
            itemStyle={{ fontWeight: "bold" }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "9px", fontWeight: "black", textTransform: "uppercase" }} />
          <Line type="monotone" dataKey="Baseline" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="EV Strategy" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Forest Strategy" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Combined AI" stroke="#22d3ee" strokeWidth={3} dot={false} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
