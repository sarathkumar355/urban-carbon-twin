import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return NextResponse.json({ error: "Coordinates required" }, { status: 400 });
  }

  try {
    // 1. Fetch Local Weather & Wind
    const weatherResp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const weatherData = await weatherResp.json();

    // 2. Fetch Local Air Pollution (AQI)
    const pollutionResp = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const pollutionData = await pollutionResp.json();

    // 3. Mock CO2 Level based on industrial proximity or random variance for demo
    const mockCo2 = 400 + Math.random() * 50; 
    
    // Determine Zone
    const aqi = pollutionData.list?.[0]?.main?.aqi || 1;
    let zone: "Low" | "Medium" | "High" = "Low";
    if (aqi > 3) zone = "High";
    else if (aqi > 1) zone = "Medium";

    return NextResponse.json({
      aqi,
      co2Level: Number(mockCo2.toFixed(1)),
      zone,
      windSpeed: weatherData.wind?.speed || 0,
      windDirection: weatherData.wind?.deg || 0,
      locationName: weatherData.name || "Unknown Station"
    });
  } catch (error) {
    return NextResponse.json({
      aqi: 2,
      co2Level: 412.5,
      zone: "Medium",
      windSpeed: 5.2,
      windDirection: 180,
      locationName: "Fallback Station"
    });
  }
}
