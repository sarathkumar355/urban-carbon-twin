export type GridPoint = {
  name: string;
  lat: number;
  lng: number;
  co2: number;
  aqi: number;
};

export const tamilNaduGrid: GridPoint[] = [
  // Major Cities
  { name: "Chennai", lat: 13.0827, lng: 80.2707, co2: 145, aqi: 130 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558, co2: 95, aqi: 85 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198, co2: 85, aqi: 75 },
  { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, co2: 90, aqi: 80 },
  { name: "Salem", lat: 11.6643, lng: 78.1460, co2: 110, aqi: 95 },
  { name: "Tiruppur", lat: 11.1085, lng: 77.3411, co2: 120, aqi: 110 },
  { name: "Erode", lat: 11.3410, lng: 77.7172, co2: 105, aqi: 90 },
  { name: "Vellore", lat: 12.9165, lng: 79.1325, co2: 100, aqi: 85 },
  { name: "Thoothukudi", lat: 8.8053, lng: 78.1460, co2: 135, aqi: 115 },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567, co2: 80, aqi: 70 },
  
  // Industrial Zones
  { name: "Ennore Industrial", lat: 13.2161, lng: 80.3232, co2: 180, aqi: 165 },
  { name: "Manali Petrochem", lat: 13.1667, lng: 80.2667, co2: 170, aqi: 155 },
  { name: "Hosur Mfg Hub", lat: 12.7409, lng: 77.8253, co2: 115, aqi: 100 },
  { name: "Sriperumbudur Auto", lat: 12.9756, lng: 79.9705, co2: 125, aqi: 105 },
  { name: "Neyveli Lignite", lat: 11.6015, lng: 79.4842, co2: 160, aqi: 140 },
  { name: "Ranipet Chemical", lat: 12.9270, lng: 79.3333, co2: 130, aqi: 120 },
  
  // Coastal/Rural Spaced Points
  { name: "Kanyakumari Coast", lat: 8.0883, lng: 77.5385, co2: 45, aqi: 40 },
  { name: "Rameswaram", lat: 9.2876, lng: 79.3129, co2: 50, aqi: 45 },
  { name: "Nagapattinam", lat: 10.7672, lng: 79.8444, co2: 60, aqi: 55 },
  { name: "Cuddalore", lat: 11.7480, lng: 79.7714, co2: 110, aqi: 95 },
  { name: "Ooty Hills", lat: 11.4102, lng: 76.6950, co2: 35, aqi: 30 },
  { name: "Kodaikanal", lat: 10.2381, lng: 77.4892, co2: 30, aqi: 25 },
  { name: "Dharmapuri Rural", lat: 12.1211, lng: 78.1582, co2: 55, aqi: 50 },
  { name: "Namakkal Agriculture", lat: 11.2189, lng: 78.1673, co2: 65, aqi: 60 },
  { name: "Villupuram", lat: 11.9401, lng: 79.4861, co2: 75, aqi: 70 },
  { name: "Thanjavur", lat: 10.7870, lng: 79.1378, co2: 70, aqi: 65 }
];
