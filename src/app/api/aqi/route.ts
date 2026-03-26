import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { lat: 13.0827, lng: 80.2707, aqi: 120 },
    { lat: 13.0418, lng: 80.2341, aqi: 85 },
    { lat: 13.2000, lng: 80.3200, aqi: 185 }, 
    { lat: 13.1667, lng: 80.2667, aqi: 160 }, 
    { lat: 13.0067, lng: 80.2206, aqi: 95 }, 
    { lat: 12.9808, lng: 80.2223, aqi: 85 }, 
    { lat: 13.0033, lng: 80.2555, aqi: 70 }, 
    { lat: 13.0850, lng: 80.2101, aqi: 120 }, 
    { lat: 12.9000, lng: 80.2279, aqi: 65 }, 
    { lat: 13.1091, lng: 80.2467, aqi: 130 } 
  ]);
}
