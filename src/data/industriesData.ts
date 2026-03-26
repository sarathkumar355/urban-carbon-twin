export interface Industry {
  id: string;
  name: string;
  type: "Thermal" | "Chemical" | "Refinery" | "Manufacturing" | "Textile" | "Auto";
  location: string;
  emissionLevel: "High" | "Medium" | "Low";
  status: "Compliant" | "Monitoring" | "Violation";
}

export const tamilNaduIndustries: Industry[] = [
  {
    id: "ind_001",
    name: "Neyveli Lignite Corporation (NLC)",
    type: "Thermal",
    location: "Neyveli",
    emissionLevel: "High",
    status: "Monitoring"
  },
  {
    id: "ind_002",
    name: "Manali Petrochemicals Ltd",
    type: "Chemical",
    location: "Manali",
    emissionLevel: "High",
    status: "Violation"
  },
  {
    id: "ind_003",
    name: "CPCL Refinery",
    type: "Refinery",
    location: "Ennore",
    emissionLevel: "High",
    status: "Monitoring"
  },
  {
    id: "ind_004",
    name: "Hyundai Motors India",
    type: "Auto",
    location: "Sriperumbudur",
    emissionLevel: "Medium",
    status: "Compliant"
  },
  {
    id: "ind_005",
    name: "Tiruppur Textile Cluster",
    type: "Textile",
    location: "Tiruppur",
    emissionLevel: "Medium",
    status: "Monitoring"
  },
  {
    id: "ind_006",
    name: "Tuticorin Port Terminals",
    type: "Manufacturing",
    location: "Thoothukudi",
    emissionLevel: "Medium",
    status: "Compliant"
  },
  {
    id: "ind_007",
    name: "Ranipet Chemical Hub",
    type: "Chemical",
    location: "Ranipet",
    emissionLevel: "High",
    status: "Violation"
  },
  {
    id: "ind_008",
    name: "Salem Steel Plant",
    type: "Manufacturing",
    location: "Salem",
    emissionLevel: "Medium",
    status: "Compliant"
  },
  {
    id: "ind_009",
    name: "Hosur SIPCOT Complex",
    type: "Auto",
    location: "Hosur",
    emissionLevel: "Medium",
    status: "Compliant"
  },
  {
    id: "ind_010",
    name: "Ennore Coal Power Station",
    type: "Thermal",
    location: "Ennore",
    emissionLevel: "High",
    status: "Violation"
  }
];
