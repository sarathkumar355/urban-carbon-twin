export function aqiToFactor(aqi: number) {
  if (aqi <= 50) return 0.9;
  if (aqi <= 100) return 1.0;
  if (aqi <= 150) return 1.1;
  if (aqi <= 200) return 1.25;
  return 1.4;
}
