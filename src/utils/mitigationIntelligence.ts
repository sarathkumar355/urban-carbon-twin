// Types for Afforestation
export type SoilType = "Coastal" | "Clay" | "Sandy";
export type WaterAvail = "Low" | "Medium" | "High";
export type TreeType = "Neem" | "Banyan" | "Mangroves";

export function calculateAfforestation(trees: number, treeType: TreeType, soil: SoilType, water: WaterAvail) {
  let multiplier = 1.0;
  let limitation = "";
  let recommendation = "";

  if (treeType === "Mangroves") {
    if (soil !== "Coastal") {
      multiplier *= 0.1;
      limitation = "Mangroves cannot survive in non-coastal soil types.";
      recommendation = "Switch to Neem or Banyan for inland areas.";
    } else {
      multiplier *= 1.6;
      limitation = "Restricted strictly to coastal zones.";
      recommendation = "Optimal. Coastal mangroves provide superior carbon sink capabilities.";
    }
  } else if (treeType === "Banyan") {
    if (water === "Low") {
      multiplier *= 0.4;
      limitation = "High water requirements not met. Stunted growth.";
      recommendation = "Switch to Neem for drought resistance.";
    } else {
      multiplier *= 1.4;
      limitation = "Requires significant urban space.";
      recommendation = "Excellent canopy coverage and CO₂ absorption.";
    }
  } else {
    // Neem
    multiplier *= 1.1;
    limitation = "Slower total carbon absorption compared to large canopy trees.";
    recommendation = "Highly resilient. Good for general urban planting anywhere.";
  }

  const effectiveTrees = trees * multiplier;
  const score = getScoreLetter(multiplier);

  return { effectiveTrees, score, limitation, recommendation };
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
export type CongestionZone = "T Nagar / Central" | "IT Corridor (OMR)" | "Suburbs";
export type PublicTransport = "Poor" | "Moderate" | "Extensive";

export function calculateTransitFlow(trafficReduction: number, zone: CongestionZone, transport: PublicTransport) {
  let multiplier = 1.0;
  let limitation = "";
  let recommendation = "";

  if (zone === "T Nagar / Central" && transport !== "Extensive") {
    multiplier *= 0.4;
    limitation = "Cannot reduce traffic in core commercial zones without extensive metro coverage.";
    recommendation = "Boost metro connectivity before restricting vehicle routes.";
  } else if (zone === "IT Corridor (OMR)") {
    multiplier *= 1.4;
    limitation = "Heavy peak-hour directional flow.";
    recommendation = "Signal optimization in IT Corridor yields exponential emission reductions.";
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
