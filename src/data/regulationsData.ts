export interface Regulation {
  id: string;
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
}

export const tnpcbRegulations: Regulation[] = [
  {
    id: "reg_001",
    title: "PM2.5/PM10 Emission Limits",
    description: "Strict enforcement of particulate matter concentration in industrial exhaust stacks.",
    severity: "High"
  },
  {
    id: "reg_002",
    title: "CEMS Mandatory Integration",
    description: "Continuous Emission Monitoring Systems must be installed and synced with TNPCB servers.",
    severity: "High"
  },
  {
    id: "reg_003",
    title: "Hazardous Waste Protocol",
    description: "Mandatory tracking and certified disposal of all industrial hazardous byproducts.",
    severity: "High"
  },
  {
    id: "reg_004",
    title: "Groundwater Protection",
    description: "Zero liquid discharge (ZLD) requirements for chemical and heavy manufacturing zones.",
    severity: "High"
  },
  {
    id: "reg_005",
    title: "Stack Height Alignment",
    description: "Industrial chimneys must meet minimum height requirements based on local topography.",
    severity: "Medium"
  },
  {
    id: "reg_006",
    title: "Waste Heat Recovery (WHR)",
    description: "Industries with high thermal output must implement heat recycling systems.",
    severity: "Medium"
  },
  {
    id: "reg_007",
    title: "Renewable Energy Mandate",
    description: "Minimum 15% of industrial energy consumption must come from renewable sources.",
    severity: "Medium"
  },
  {
    id: "reg_008",
    title: "ETP Compliance Audit",
    description: "Quarterly inspection and performance validation of Effluent Treatment Plants.",
    severity: "High"
  },
  {
    id: "reg_009",
    title: "Industrial Noise Suppression",
    description: "Standard decibel limits for daytime and nighttime factory operations.",
    severity: "Low"
  },
  {
    id: "reg_010",
    title: "Annual Environmental Audit",
    description: "submission of comprehensive environmental impact reports by certified third-parties.",
    severity: "Medium"
  }
];
