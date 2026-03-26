import { treeSpecies } from "@/data/treeSpecies";

// Types for Afforestation
export type AreaType = "coastal" | "urban" | "industrial" | "rural" | "dry" | "wetland";
export type WaterAvail = "Low" | "Medium" | "High";

export function calculateAfforestation(nodes: number, selectedSpecies: string, areaType: AreaType, water: WaterAvail) {
  const species = treeSpecies.find(s => s.name === selectedSpecies) || treeSpecies[0];
  let multiplier = 1.0;
  let limitation = "";
  let recommendation = "";

  const isSuitable = species.suitableFor.includes(areaType);
  
  if (!isSuitable) {
    multiplier *= 0.2;
    limitation = `⚠️ ${species.name} is not suitable for ${areaType} conditions. Growth risk: HIGH.`;
    recommendation = `Recommended: Use species native to ${areaType} ecosystems.`;
  } else {
    multiplier *= species.suitabilityScore;
    recommendation = `✅ Optimal choice. ${species.name} sequester ${species.co2Absorption}kg CO₂/year in this ecosystem.`;
  }

  // Water Sync
  if (species.waterNeed === "high" && water === "Low") {
    multiplier *= 0.5;
    limitation += " Insufficient water availability for this species.";
  }

  const effectiveTrees = nodes * multiplier;
  const score = getScoreLetter(multiplier);

  return { 
    effectiveTrees, 
    score, 
    limitation, 
    recommendation,
    bestMatch: isSuitable && multiplier > 1.0
  };
}

// Types for EV Transition
export type ChargingDensity = "Poor" | "Adequate" | "Extensive";
export type GridCapacity = "Strained" | "Stable" | "Surplus";

export function calculateEvTransition(evPercent: number, charging: ChargingDensity, grid: GridCapacity) {
  let multiplier = 1.0;
  let limitation = "";
  let recommendation = "";

  if (evPercent > 60 && charging === "Poor") {
    multiplier *= 0.3;
    limitation = "EV adoption above 60% is completely ineffective without charging infrastructure.";
    recommendation = "Halt subsidies and build charging networks immediately.";
  } else if (evPercent > 40 && grid === "Strained") {
    multiplier *= 0.5;
    limitation = "Power grid failure risk. Charging causes localized brownouts.";
    recommendation = "Invest in local substation upgrades before pushing EV sales.";
  } else if (charging === "Extensive" && grid === "Surplus") {
    multiplier *= 1.5;
    limitation = "High upfront capital expenditure required.";
    recommendation = "Optimal environment. Push maximum EV transition subsidies.";
  } else {
    multiplier *= 0.9;
    limitation = "Moderate bottleneck in deployment logistics.";
    recommendation = "Balanced growth. Monitor grid stability closely.";
  }

  const effectiveEv = evPercent * multiplier;
  return { effectiveEv, score: getScoreLetter(multiplier), limitation, recommendation };
}

// Types for Transit Flow
export type CongestionZone = "Core Commercial" | "Tech Corridor" | "Suburbs" | "Industrial Cluster";
export type PublicTransport = "Poor" | "Moderate" | "Extensive";

export function calculateTransitFlow(trafficReduction: number, zone: CongestionZone, transport: PublicTransport) {
  let multiplier = 1.0;
  let limitation = "";
  let recommendation = "";

  if (zone === "Core Commercial" && transport !== "Extensive") {
    multiplier *= 0.4;
    limitation = "Cannot reduce traffic in core commercial zones without extensive public transit coverage.";
    recommendation = "Boost transit connectivity before restricting vehicle routes.";
  } else if (zone === "Tech Corridor") {
    multiplier *= 1.4;
    limitation = "Heavy peak-hour directional flow.";
    recommendation = "Signal optimization in tech corridors yields exponential emission reductions.";
  } else if (zone === "Industrial Cluster") {
    multiplier *= 0.7;
    limitation = "Freight logistics heavily depend on road infrastructure.";
    recommendation = "Incentivize off-peak freight scheduling locally.";
  } else {
    multiplier *= 1.0;
    limitation = "Standard dispersed flow.";
    recommendation = "City-wide AI signal orchestration recommended.";
  }

  const effectiveTraffic = trafficReduction * multiplier;
  return { effectiveTraffic, score: getScoreLetter(multiplier), limitation, recommendation };
}

// Types for DAC
export type CostBudget = "Low ($)" | "Medium ($$)" | "High ($$$)";
export type EnergySource = "Fossil Heavy" | "Mixed Grid" | "100% Renewable";

export function calculateDAC(capturePercent: number, budget: CostBudget, energy: EnergySource) {
  let multiplier = 1.0;
  let limitation = "";
  let recommendation = "";

  if (energy === "Fossil Heavy") {
    multiplier *= 0.1;
    limitation = "Powering DAC with coal/gas negates the captured CO₂.";
    recommendation = "Crucial: Shift power supply to renewables before using DAC.";
  } else if (budget === "Low ($)" && capturePercent > 20) {
    multiplier *= 0.2;
    limitation = "Insufficient funding to scale large capture plants.";
    recommendation = "Focus budget on afforestation instead of high-tech DAC.";
  } else if (energy === "100% Renewable" && budget === "High ($$$)") {
    multiplier *= 1.5;
    limitation = "Enormous land/capital requirement.";
    recommendation = "Maximum throughput achieved. Deploy near industrial zones.";
  } else {
    multiplier *= 0.8;
    limitation = "Diminishing returns at scale without pure renewables.";
    recommendation = "Optimize capture plants around industrial point-sources.";
  }

  const effectiveCapture = capturePercent * multiplier;
  return { effectiveCapture, score: getScoreLetter(multiplier), limitation, recommendation };
}

function getScoreLetter(multiplier: number) {
  if (multiplier >= 1.4) return "A+";
  if (multiplier >= 1.1) return "A";
  if (multiplier >= 0.9) return "B";
  if (multiplier >= 0.6) return "C";
  if (multiplier >= 0.4) return "D";
  return "F";
}
