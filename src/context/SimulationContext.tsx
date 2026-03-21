"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

  // Use this reduction formula:
  // evAdoption * 0.25 + treesPlanted * 0.2 + trafficReduction * 0.25 + carbonCapture * 0.3
  const calculatedReduction =
    evAdoption * 0.25 +
    treesPlanted * 0.2 +
    trafficReduction * 0.25 +
    carbonCapture * 0.3;

  // Clamp the reduction between 0 and 100 for safety
  const reductionPercentage = Math.max(0, Math.min(100, calculatedReduction));

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
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
