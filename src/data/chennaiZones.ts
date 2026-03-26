export type Zone = {
  name: string;
  lat: number;
  lng: number;
  level: "high" | "medium" | "low";
  baseEmission: number;
  type: "industrial" | "commercial" | "residential";
};

export const chennaiZones: Zone[] = [
  // 🔴 HIGH (Industrial + Heavy Traffic)
  { name: "Ennore", lat: 13.2143, lng: 80.3203, level: "high", baseEmission: 160, type: "industrial" },
  { name: "Manali", lat: 13.1655, lng: 80.2580, level: "high", baseEmission: 155, type: "industrial" },
  { name: "Ambattur Industrial Estate", lat: 13.1143, lng: 80.1548, level: "high", baseEmission: 150, type: "industrial" },
  { name: "Guindy Industrial Estate", lat: 13.0067, lng: 80.2206, level: "high", baseEmission: 145, type: "industrial" },
  { name: "Koyambedu", lat: 13.0732, lng: 80.1943, level: "high", baseEmission: 140, type: "commercial" },
  { name: "Parrys Corner", lat: 13.0933, lng: 80.2931, level: "high", baseEmission: 135, type: "commercial" },
  { name: "T. Nagar", lat: 13.0418, lng: 80.2341, level: "high", baseEmission: 138, type: "commercial" },
  { name: "Mount Road (Anna Salai)", lat: 13.0610, lng: 80.2660, level: "high", baseEmission: 142, type: "commercial" },
  { name: "Central Railway Station Area", lat: 13.0827, lng: 80.2757, level: "high", baseEmission: 130, type: "commercial" },
  { name: "Perambur", lat: 13.1216, lng: 80.2326, level: "high", baseEmission: 125, type: "residential" },

  // 🟠 MEDIUM (Urban + Traffic)
  { name: "Kolathur", lat: 13.1210, lng: 80.2150, level: "medium", baseEmission: 110, type: "residential" },
  { name: "Anna Nagar", lat: 13.0850, lng: 80.2101, level: "medium", baseEmission: 105, type: "residential" },
  { name: "Velachery", lat: 12.9750, lng: 80.2209, level: "medium", baseEmission: 115, type: "residential" },
  { name: "Porur", lat: 13.0381, lng: 80.1565, level: "medium", baseEmission: 108, type: "commercial" },
  { name: "Tambaram", lat: 12.9249, lng: 80.1275, level: "medium", baseEmission: 112, type: "residential" },
  { name: "Chromepet", lat: 12.9516, lng: 80.1462, level: "medium", baseEmission: 100, type: "residential" },
  { name: "Perungudi", lat: 12.9716, lng: 80.2470, level: "medium", baseEmission: 120, type: "commercial" },
  { name: "Sholinganallur", lat: 12.9010, lng: 80.2279, level: "medium", baseEmission: 118, type: "commercial" },
  { name: "Medavakkam", lat: 12.9170, lng: 80.1920, level: "medium", baseEmission: 95, type: "residential" },
  { name: "Pallavaram", lat: 12.9675, lng: 80.1491, level: "medium", baseEmission: 102, type: "residential" },
  { name: "Madhavaram", lat: 13.1482, lng: 80.2310, level: "medium", baseEmission: 98, type: "industrial" },
  { name: "Villivakkam", lat: 13.1086, lng: 80.2065, level: "medium", baseEmission: 96, type: "residential" },
  { name: "Ashok Nagar", lat: 13.0352, lng: 80.2120, level: "medium", baseEmission: 106, type: "residential" },
  { name: "Saidapet", lat: 13.0237, lng: 80.2281, level: "medium", baseEmission: 104, type: "residential" },
  { name: "Nungambakkam", lat: 13.0604, lng: 80.2496, level: "medium", baseEmission: 110, type: "commercial" },

  // 🟢 LOW (Green + Coastal + Eco Zones)
  { name: "Adyar", lat: 13.0067, lng: 80.2575, level: "low", baseEmission: 75, type: "residential" },
  { name: "Besant Nagar", lat: 13.0003, lng: 80.2667, level: "low", baseEmission: 65, type: "residential" },
  { name: "Thiruvanmiyur", lat: 12.9830, lng: 80.2594, level: "low", baseEmission: 70, type: "residential" },
  { name: "ECR", lat: 12.9165, lng: 80.2482, level: "low", baseEmission: 50, type: "residential" },
  { name: "Guindy National Park", lat: 13.0022, lng: 80.2290, level: "low", baseEmission: 30, type: "residential" },
  { name: "IIT Madras", lat: 12.9916, lng: 80.2337, level: "low", baseEmission: 40, type: "residential" },
  { name: "Kalakshetra Area", lat: 12.9980, lng: 80.2660, level: "low", baseEmission: 55, type: "residential" },
  { name: "Neelankarai", lat: 12.9490, lng: 80.2547, level: "low", baseEmission: 60, type: "residential" },
  { name: "Injambakkam", lat: 12.9160, lng: 80.2480, level: "low", baseEmission: 58, type: "residential" },
  { name: "Palavakkam", lat: 12.9617, lng: 80.2560, level: "low", baseEmission: 62, type: "residential" },
  { name: "Thoraipakkam Marsh Area", lat: 12.9380, lng: 80.2350, level: "low", baseEmission: 45, type: "residential" },
];