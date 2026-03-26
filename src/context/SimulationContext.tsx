"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SimulationContextProps {
  evAdoption: number;
  setEvAdoption: (val: number) => void;
  treesPlanted: number;
  setTreesPlanted: (val: number) => void;
  trafficReduction: number;
  setTrafficReduction: (val: number) => void;
  carbonCapture: number;
  setCarbonCapture: (val: number) => void;
  reductionPercentage: number;
}

const SimulationContext = createContext<SimulationContextProps | undefined>(
  undefined
);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [evAdoption, setEvAdoption] = useState(40);
  const [treesPlanted, setTreesPlanted] = useState(55);
  const [trafficReduction, setTrafficReduction] = useState(30);
  const [carbonCapture, setCarbonCapture] = useState(20);

  const [reductionPercentage, setReductionPercentage] = useState(0);

  // 🔥 BACKEND CALL
  const runSimulation = async () => {
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          traffic: trafficReduction,
          trees: treesPlanted,
          ev: evAdoption,
          capture: carbonCapture,
        }),
      });

      const data = await res.json();

      // ✅ Use backend result
      // The backend returns `reduction` in Mt. Calculate the percentage relative to 12.4
      const percent = ((data.reduction ?? 0) / 12.4) * 100;
      setReductionPercentage(percent || 0);
    } catch (err) {
      console.error("Backend failed, using fallback logic");

      // 🧠 FALLBACK (your original formula)
      const calculated =
        evAdoption * 0.25 +
        treesPlanted * 0.2 +
        trafficReduction * 0.25 +
        carbonCapture * 0.3;

      setReductionPercentage(Math.max(0, Math.min(100, calculated)));
    }
  };

  // 🔁 AUTO RUN when sliders change
  useEffect(() => {
    runSimulation();
  }, [evAdoption, treesPlanted, trafficReduction, carbonCapture]);

  return (
    <SimulationContext.Provider
      value={{
        evAdoption,
        setEvAdoption,
        treesPlanted,
        setTreesPlanted,
        trafficReduction,
        setTrafficReduction,
        carbonCapture,
        setCarbonCapture,
        reductionPercentage,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used within SimulationProvider");
  }
  return context;
}