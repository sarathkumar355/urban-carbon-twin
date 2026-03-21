"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Leaf } from "lucide-react";

export function ReductionMeter({ percentage }: { percentage: number }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start({
        width: `${percentage}%`,
        transition: { duration: 1.5, ease: "easeOut" },
      });
    }
  }, [percentage, isInView, controls]);

  const blockCount = 20;
  const activeBlocks = Math.round((percentage / 100) * blockCount);

  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--healthy-primary),_transparent_75%)] opacity-[0.05]" />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-scientific flex items-center gap-2 text-[11px] font-black text-foreground">
              <Leaf className="h-4 w-4 text-healthy" />
              Carbon Reduction Index
            </h3>
            <p className="text-[10px] text-foreground/40 mt-1 font-black uppercase tracking-tight">
              Tracking net-zero progress relative to 2024 baseline.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            key={percentage}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex h-12 min-w-[3.5rem] items-center justify-center rounded-xl bg-white/5 px-3 font-mono text-2xl font-black text-healthy border border-white/10 shadow-inner"
          >
            {percentage}%
          </motion.div>
        </div>

        {/* Digital Block Meter */}
        <div className="flex w-full items-center justify-between gap-1 overflow-hidden rounded-lg bg-white/5 p-1.5 border border-white/10" ref={ref}>
          {Array.from({ length: blockCount }).map((_, i) => (
            <motion.div
              key={i}
              className={`h-6 flex-1 rounded-sm transition-all duration-500 ${i < activeBlocks
                ? "bg-healthy shadow-[0_0_12px_rgba(34,197,94,0.3)] border border-white/15"
                : "bg-white/5"
                }`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </div>

        {/* Continuous Animated Bar */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-healthy via-healthy to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={controls}
          />
        </div>

        <div className="flex justify-between text-[9px] text-scientific text-foreground/20 font-black uppercase tracking-widest">
          <span>Emission Baseline</span>
          <span>Net Zero Target</span>
        </div>
      </div>
    </div>
  );
}
