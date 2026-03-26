export type TreeSpecies = {
  name: string;
  suitableFor: ("coastal" | "urban" | "industrial" | "rural" | "dry" | "wetland")[];
  co2Absorption: number; // kg per year
  waterNeed: "low" | "medium" | "high";
  suitabilityScore: number; // multiplier
};

export const treeSpecies: TreeSpecies[] = [
  {
    name: "Mangrove (Avicennia)",
    suitableFor: ["coastal", "wetland"],
    co2Absorption: 25,
    waterNeed: "high",
    suitabilityScore: 1.2
  },
  {
    name: "Neem (Azadirachta indica)",
    suitableFor: ["urban", "rural", "dry"],
    co2Absorption: 20,
    waterNeed: "low",
    suitabilityScore: 1.1
  },
  {
    name: "Banyan (Ficus benghalensis)",
    suitableFor: ["rural", "urban"],
    co2Absorption: 30,
    waterNeed: "medium",
    suitabilityScore: 1.0
  },
  {
    name: "Tamarind",
    suitableFor: ["rural", "dry"],
    co2Absorption: 15,
    waterNeed: "low",
    suitabilityScore: 0.9
  },
  {
    name: "Pongamia Pinnata",
    suitableFor: ["industrial", "urban"],
    co2Absorption: 18,
    waterNeed: "medium",
    suitabilityScore: 1.15
  },
  {
    name: "Cassia Fistula",
    suitableFor: ["urban", "coastal"],
    co2Absorption: 12,
    waterNeed: "medium",
    suitabilityScore: 0.8
  },
  {
    name: "Bamboo (Dendrocalamus)",
    suitableFor: ["industrial", "rural", "wetland"],
    co2Absorption: 27,
    waterNeed: "high",
    suitabilityScore: 1.25
  },
  {
    name: "Peepal (Ficus religiosa)",
    suitableFor: ["urban", "rural"],
    co2Absorption: 28,
    waterNeed: "medium",
    suitabilityScore: 1.1
  }
];
