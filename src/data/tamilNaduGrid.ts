export type GridPoint = {
  name: string;
  lat: number;
  lng: number;
  co2: number;
  aqi: number;
  regulatoryLimit: number; // MtCO2e threshold
};

export const tamilNaduGrid: GridPoint[] = [
  // Major Cities (Moderate Limits)
  { name: "Chennai", lat: 13.0827, lng: 80.2707, co2: 145, aqi: 130, regulatoryLimit: 140 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558, co2: 95, aqi: 85, regulatoryLimit: 100 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198, co2: 85, aqi: 75, regulatoryLimit: 90 },
  { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, co2: 90, aqi: 80, regulatoryLimit: 100 },
  { name: "Salem", lat: 11.6643, lng: 78.1460, co2: 110, aqi: 95, regulatoryLimit: 120 },
  { name: "Tiruppur", lat: 11.1085, lng: 77.3411, co2: 120, aqi: 110, regulatoryLimit: 130 },
  { name: "Erode", lat: 11.3410, lng: 77.7172, co2: 105, aqi: 90, regulatoryLimit: 115 },
  { name: "Vellore", lat: 12.9165, lng: 79.1325, co2: 100, aqi: 85, regulatoryLimit: 110 },
  { name: "Thoothukudi", lat: 8.8053, lng: 78.1460, co2: 135, aqi: 115, regulatoryLimit: 130 },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567, co2: 80, aqi: 70, regulatoryLimit: 90 },
  
  // Industrial Zones (High Limits but High Base Emissions)
  { name: "Ennore Industrial", lat: 13.2161, lng: 80.3232, co2: 180, aqi: 165, regulatoryLimit: 160 },
  { name: "Manali Petrochem", lat: 13.1667, lng: 80.2667, co2: 170, aqi: 155, regulatoryLimit: 160 },
  { name: "Hosur Mfg Hub", lat: 12.7409, lng: 77.8253, co2: 115, aqi: 100, regulatoryLimit: 120 },
  { name: "Sriperumbudur Auto", lat: 12.9756, lng: 79.9705, co2: 125, aqi: 105, regulatoryLimit: 130 },
  { name: "Neyveli Lignite", lat: 11.6015, lng: 79.4842, co2: 160, aqi: 140, regulatoryLimit: 150 },
  { name: "Ranipet Chemical", lat: 12.9270, lng: 79.3333, co2: 130, aqi: 120, regulatoryLimit: 125 },
  
  // Coastal/Rural (Strict Limits)
  { name: "Kanyakumari Coast", lat: 8.0883, lng: 77.5385, co2: 45, aqi: 40, regulatoryLimit: 60 },
  { name: "Rameswaram", lat: 9.2876, lng: 79.3129, co2: 50, aqi: 45, regulatoryLimit: 65 },
  { name: "Nagapattinam", lat: 10.7672, lng: 79.8444, co2: 60, aqi: 55, regulatoryLimit: 75 },
  { name: "Cuddalore", lat: 11.7480, lng: 79.7714, co2: 110, aqi: 95, regulatoryLimit: 120 },
  { name: "Ooty Hills", lat: 11.4102, lng: 76.6950, co2: 35, aqi: 30, regulatoryLimit: 50 },
  { name: "Kodaikanal", lat: 10.2381, lng: 77.4892, co2: 30, aqi: 25, regulatoryLimit: 45 },
  { name: "Dharmapuri Rural", lat: 12.1211, lng: 78.1582, co2: 55, aqi: 50, regulatoryLimit: 70 },
  { name: "Namakkal Agriculture", lat: 11.2189, lng: 78.1673, co2: 65, aqi: 60, regulatoryLimit: 80 },
  { name: "Villupuram", lat: 11.9401, lng: 79.4861, co2: 75, aqi: 70, regulatoryLimit: 90 },
  { name: "Thanjavur", lat: 10.7870, lng: 79.1378, co2: 70, aqi: 65, regulatoryLimit: 85 }
];
