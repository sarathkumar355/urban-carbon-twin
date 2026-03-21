"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

type Zone = {
  name: string;
  center: LatLngExpression;
  color: string;
  intensity: string;
  source: string;
  recommendation: string;
};

const zones: Zone[] = [
  {
    name: "Industrial District",
    center: [51.5, -0.08],
    color: "#1e3d1a",
    intensity: "85",
    source: "Manufacturing",
    recommendation: "Carbon Capture",
  },
  {
    name: "Highway Corridor",
    center: [51.51, -0.1],
    color: "#bf8d5c",
    intensity: "72",
    source: "Traffic",
    recommendation: "EV Adoption",
  },
  {
    name: "Urban Center",
    center: [51.505, -0.09],
    color: "#4a6b4d",
    intensity: "64",
    source: "Residential",
    recommendation: "Urban Trees",
  },
];

const createPulsingIcon = (color: string) => {
  return L.divIcon({
    className: "custom-pulsing-icon",
    html: `
      <div class="relative flex h-8 w-8 items-center justify-center">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style="background-color: ${color}"></span>
        <span class="relative inline-flex h-4 w-4 rounded-full shadow-[0_2px_12px_rgba(30,61,26,0.4)] border-2 border-white" style="background-color: ${color}"></span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    tooltipAnchor: [16, -16],
  });
};

export function PollutionMap() {
  return (
    <div className="h-72 w-full overflow-hidden rounded-xl border border-eco-primary/10 bg-white/60 shadow-inner">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ backgroundColor: "#f0f4f1" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {zones.map((zone) => (
          <Marker
            key={zone.name}
            position={zone.center}
            icon={createPulsingIcon(zone.color)}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={0.9}
              className="!bg-white !text-[10px] !text-eco-primary !font-bold !border-eco-primary/10 !rounded-lg !shadow-xl !px-3 !py-1.5"
            >
              {zone.name}
            </Tooltip>
            <Popup
              className="dashboard-popup"
            >
              <div className="space-y-1.5 p-1 min-w-[180px]">
                <p className="font-black text-sm text-eco-primary border-b border-eco-primary/15 pb-1 uppercase tracking-tight">{zone.name}</p>
                <div className="text-[11px] font-black text-eco-primary space-y-1 pt-1">
                  <p className="flex justify-between">
                    <span className="text-eco-primary/70">CO₂ intensity:</span>{" "}
                    <span className="font-mono text-eco-primary font-black">{zone.intensity}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-eco-primary/70">Primary Source:</span>{" "}
                    <span className="text-eco-primary">{zone.source}</span>
                  </p>
                  <p className="flex flex-col mt-2 pt-1 border-t border-eco-primary/15">
                    <span className="text-eco-secondary text-[9px] uppercase tracking-widest font-black">Recommended Action:</span>{" "}
                    <span className="font-black text-eco-primary mt-0.5 underline underline-offset-2 decoration-eco-secondary/20">{zone.recommendation}</span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}




