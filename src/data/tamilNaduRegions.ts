import { SoilType, WaterAvail, ChargingDensity, GridCapacity, CongestionZone, PublicTransport, CostBudget, EnergySource } from "../utils/mitigationIntelligence";

export type RegionZone = {
  name: string;
  lat: number;
  lng: number;
  baseEmission: number;
  type: "industrial" | "commercial" | "residential";
};

export type TamilNaduRegion = {
  id: string;
  name: string;
  centerMap: [number, number];
  zoom: number;
  
  soilType: SoilType;
  landAvailability: "Low" | "Medium" | "High";
  waterAvail: WaterAvail;
  chargingDensity: ChargingDensity;
  gridCapacity: GridCapacity;
  transitCoverage: PublicTransport;
  congestionZone: CongestionZone;
  dacBudget: CostBudget;
  energySource: EnergySource;

  industries: string[];
  industryTypes: string[];
  regulations: string[];
  
  zones: RegionZone[];
};

export const tamilNaduRegions: TamilNaduRegion[] = [
  {
    id: "chennai_coastal",
    name: "Chennai (Coastal & Industrial)",
    centerMap: [13.1667, 80.3200], // Near Ennore/Manali
    zoom: 11,
    soilType: "Coastal",
    landAvailability: "Low",
    waterAvail: "Medium",
    chargingDensity: "Adequate",
    gridCapacity: "Strained",
    transitCoverage: "Extensive",
    congestionZone: "Core Commercial",
    dacBudget: "High ($$$)",
    energySource: "Fossil Heavy",
    industries: ["NTECL Vallur Thermal", "Manali Petrochemicals", "CPCL Refinery"],
    industryTypes: ["Thermal Plant", "Chemical"],
    regulations: ["Strict SOX/NOX Caps (TNPCB 2024)", "Mandatory Zero Liquid Discharge", "Coastal Regulation Zone (CRZ) Compliance"],
    zones: [
      { name: "Ennore", lat: 13.2000, lng: 80.3200, baseEmission: 160, type: "industrial" },
      { name: "Manali", lat: 13.1667, lng: 80.2667, baseEmission: 145, type: "industrial" },
      { name: "Royapuram", lat: 13.1118, lng: 80.2954, baseEmission: 90, type: "commercial" },
    ]
  },
  {
    id: "chennai_central",
    name: "Chennai (Central & Tech)",
    centerMap: [12.9808, 80.2223],
    zoom: 12,
    soilType: "Sandy",
    landAvailability: "Low",
    waterAvail: "Medium",
    chargingDensity: "Extensive",
    gridCapacity: "Stable",
    transitCoverage: "Extensive",
    congestionZone: "Tech Corridor",
    dacBudget: "Medium ($$)",
    energySource: "Mixed Grid",
    industries: ["Tidel Park", "SIPCOT Siruseri", "Guindy Industrial Estate"],
    industryTypes: ["IT", "Manufacturing"],
    regulations: ["Tech Park Power Offset Limits", "E-Waste Disposal Directives"],
    zones: [
      { name: "T Nagar", lat: 13.0418, lng: 80.2341, baseEmission: 110, type: "commercial" },
      { name: "Guindy", lat: 13.0067, lng: 80.2206, baseEmission: 120, type: "industrial" },
      { name: "OMR IT Corridor", lat: 12.9000, lng: 80.2279, baseEmission: 95, type: "commercial" },
      { name: "Adyar", lat: 13.0033, lng: 80.2555, baseEmission: 70, type: "residential" },
      { name: "Velachery", lat: 12.9808, lng: 80.2223, baseEmission: 85, type: "residential" }
    ]
  },
  {
    id: "coimbatore",
    name: "Coimbatore (Manufacturing)",
    centerMap: [11.0168, 76.9558],
    zoom: 11,
    soilType: "Clay",
    landAvailability: "Medium",
    waterAvail: "Medium",
    chargingDensity: "Adequate",
    gridCapacity: "Stable",
    transitCoverage: "Moderate",
    congestionZone: "Core Commercial",
    dacBudget: "Medium ($$)",
    energySource: "Mixed Grid",
    industries: ["Foundry Clusters", "Pump Manufacturing", "Textile Machinery"],
    industryTypes: ["Manufacturing", "Automobile", "Textile"],
    regulations: ["Foundry Emission Scrubbing Limits", "Groundwater Extraction Bans"],
    zones: [
      { name: "Peelamedu", lat: 11.0253, lng: 77.0016, baseEmission: 130, type: "industrial" },
      { name: "Gandhipuram", lat: 11.0183, lng: 76.9663, baseEmission: 115, type: "commercial" },
      { name: "Saravanampatti", lat: 11.0827, lng: 76.9945, baseEmission: 95, type: "commercial" },
      { name: "Kurumbapalayam", lat: 11.0963, lng: 77.0184, baseEmission: 80, type: "residential" }
    ]
  },
  {
    id: "tiruppur",
    name: "Tiruppur (Textile Hub)",
    centerMap: [11.1085, 77.3411],
    zoom: 12,
    soilType: "Clay",
    landAvailability: "Medium",
    waterAvail: "Low",
    chargingDensity: "Poor",
    gridCapacity: "Strained",
    transitCoverage: "Poor",
    congestionZone: "Industrial Cluster",
    dacBudget: "Low ($)",
    energySource: "Mixed Grid",
    industries: ["Dyeing Units", "Knitwear Exports"],
    industryTypes: ["Textile"],
    regulations: ["Mandatory effluent treatment (CETP)", "Zero Liquid Discharge (Strict Enforcement)", "Noyyal River Protection Act"],
    zones: [
      { name: "Avinashi Road", lat: 11.1610, lng: 77.2667, baseEmission: 125, type: "industrial" },
      { name: "Palladam", lat: 10.9995, lng: 77.2917, baseEmission: 110, type: "industrial" },
      { name: "Tiruppur North", lat: 11.1274, lng: 77.3323, baseEmission: 140, type: "industrial" }
    ]
  },
  {
    id: "madurai",
    name: "Madurai (Heritage & Commerce)",
    centerMap: [9.9252, 78.1198],
    zoom: 12,
    soilType: "Red",
    landAvailability: "High",
    waterAvail: "Low",
    chargingDensity: "Poor",
    gridCapacity: "Stable",
    transitCoverage: "Moderate",
    congestionZone: "Core Commercial",
    dacBudget: "Low ($)",
    energySource: "100% Renewable",
    industries: ["Rubber / Tyres", "Heritage Tourism", "IT Spoke"],
    industryTypes: ["Manufacturing", "Commercial"],
    regulations: ["Heritage Zone Vehicle Restrictions", "Vaigai River Restoration Protocol", "Solar Installation Mandates"],
    zones: [
      { name: "K Pudur", lat: 9.9482, lng: 78.1408, baseEmission: 105, type: "industrial" },
      { name: "Meenakshi Amman Area", lat: 9.9195, lng: 78.1193, baseEmission: 90, type: "commercial" },
      { name: "Mattuthavani", lat: 9.9443, lng: 78.1505, baseEmission: 85, type: "commercial" }
    ]
  }
];
