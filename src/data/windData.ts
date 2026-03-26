export type WindPoint = {
  lat: number;
  lng: number;
  speed: number;
  direction: number; // 0-360 degrees
};

export const windData: WindPoint[] = [
  { lat: 13.08, lng: 80.27, speed: 15, direction: 220 }, // Chennai
  { lat: 11.01, lng: 76.95, speed: 12, direction: 240 }, // Coimbatore
  { lat: 9.92, lng: 78.11, speed: 10, direction: 180 },  // Madurai
  { lat: 8.80, lng: 78.14, speed: 25, direction: 160 },  // Thoothukudi (High wind)
  { lat: 12.74, lng: 77.82, speed: 8, direction: 210 },  // Hosur
  { lat: 11.60, lng: 79.48, speed: 11, direction: 190 }, // Neyveli
  { lat: 13.21, lng: 80.32, speed: 18, direction: 225 }, // Ennore
  { lat: 8.08, lng: 77.53, speed: 30, direction: 170 },  // Kanyakumari (Very high wind)
  { lat: 11.41, lng: 76.69, speed: 14, direction: 260 }, // Ooty
  { lat: 10.76, lng: 79.84, speed: 20, direction: 185 }, // Nagapattinam
  { lat: 12.12, lng: 78.15, speed: 7, direction: 200 },  // Dharmapuri
  { lat: 10.78, lng: 79.13, speed: 9, direction: 195 },  // Thanjavur
  { lat: 12.91, lng: 79.13, speed: 13, direction: 215 }, // Vellore
  { lat: 11.10, lng: 77.34, speed: 11, direction: 230 }  // Tiruppur
];
