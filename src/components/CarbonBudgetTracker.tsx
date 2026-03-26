"use client";

import { motion } from "framer-motion";

export function CarbonBudgetTracker() {
  const remaining = 18.4; // %
  const yearsLeft = 7.2;

  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-[10px] font-black uppercase text-foreground/60 tracking-widest">Global Carbon Budget Tracker</h4>
          <p className="text-[18px] font-black text-white mt-1">{remaining}% <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">REMAINING</span></p>
        </div>
        <div className="text-right">
          <p className="text-[18px] font-black text-red-500">{yearsLeft} <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter ml-1">YEARS TO EXHAUSTION</span></p>
        </div>
      </div>

      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${remaining}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
        />
      </div>

      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-[9px] font-black text-red-400 uppercase leading-relaxed text-center">
          ⚠️ CRITICAL ALERT: Current global emission trajectory exceeds safe planetary boundaries by 2.4x. Budget exhaustion predicted by 2033.
        </p>
      </div>
    </div>
  );
}
