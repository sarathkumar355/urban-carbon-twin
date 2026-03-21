"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { emissionForecast } from "@/data/emissionsData";
import { Sparkles, BarChart2 } from "lucide-react";

export function EmissionForecast() {
  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-6 h-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--healthy-primary),_transparent_75%)] opacity-[0.05]" />
      <div className="relative flex flex-col h-full space-y-6">

        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-scientific flex items-center gap-2 text-[12px] font-black text-foreground tracking-[0.2em]">
              <Sparkles className="h-4 w-4 text-healthy" />
              Satellite Intelligence Projection
            </h2>
            <p className="text-[10px] text-foreground/40 font-black uppercase tracking-tight mt-1">Multi-year planetary baseline inventory (2025-2029)</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] text-scientific font-black text-healthy shadow-sm">
            <BarChart2 className="h-4 w-4" />
            Trend Analysis
          </div>
        </div>

        <div className="relative flex-1 min-h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emissionForecast} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" tickLine={false} tickMargin={12} tick={{ fontSize: 10, fontWeight: 800, fill: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tickLine={false} tickMargin={12} tick={{ fontSize: 10, fontWeight: 800, fill: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{
                  background: "#050a06",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                  padding: 10,
                }}
                labelStyle={{ color: "white", fontWeight: "bold", fontSize: "11px" }}
                itemStyle={{ fontSize: "11px", fontWeight: "800" }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#22c55e"
                strokeWidth={4}
                dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }}
                name="Projected Index"
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
