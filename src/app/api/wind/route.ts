import { NextResponse } from "next/server";

const CITIES = [
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
  { name: "Salem", lat: 11.6643, lng: 78.1460 },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
  { name: "Thoothukudi", lat: 8.8053, lng: 78.1460 },
  { name: "Hosur", lat: 12.7409, lng: 77.8253 },
  { name: "Ennore", lat: 13.2161, lng: 80.3232 },
  { name: "Kanyakumari", lat: 8.0883, lng: 77.5385 },
];

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.warn("OPENWEATHER_API_KEY is missing. Returning high-fidelity mock data.");
    return NextResponse.json(generateMockWindData());
  }

  try {
    const windPromises = CITIES.map(async (city) => {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lng}&appid=${apiKey}`
      );
      if (!resp.ok) throw new Error(`Weather fetch failed for ${city.name}`);
      const data = await resp.json();
      return {
        name: city.name,
        lat: city.lat,
        lng: city.lng,
        speed: data.wind.speed * 3.6, // m/s to km/h
        direction: data.wind.deg,
      };
    });

    const results = await Promise.all(windPromises);
    return NextResponse.json(results);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(generateMockWindData());
  }
}

function generateMockWindData() {
  return CITIES.map(city => ({
    ...city,
    speed: Math.floor(Math.random() * 25) + 5,
    direction: Math.floor(Math.random() * 360)
  }));
}
