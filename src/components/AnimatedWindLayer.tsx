"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface WindPoint {
  name: string;
  lat: number;
  lng: number;
  speed: number;
  direction: number;
}

interface AnimatedWindLayerProps {
  data: WindPoint[];
}

interface Particle {
  id: number;
  startLat: number;
  startLng: number;
  currentLat: number;
  currentLng: number;
  angle: number;
  speed: number;
  opacity: number;
}

export function AnimatedWindLayer({ data }: AnimatedWindLayerProps) {
  const map = useMap();
  const containerRef = useRef<L.LayerGroup | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>();
  
  // Animation factor to control speed of movement on map
  const SPEED_FACTOR = 0.00002;
  const RESET_DISTANCE = 0.5; // distance in degrees before reset

  useEffect(() => {
    containerRef.current = L.layerGroup([]).addTo(map);

    // Initialize particles from data
    particlesRef.current = data.map((d, i) => ({
      id: i,
      startLat: d.lat,
      startLng: d.lng,
      currentLat: d.lat + (Math.random() * 0.2 - 0.1), // Random start offset
      currentLng: d.lng + (Math.random() * 0.2 - 0.1),
      angle: d.direction,
      speed: d.speed,
      opacity: 0.1 + Math.random() * 0.5
    }));

    const animate = () => {
      if (!containerRef.current) return;
      
      containerRef.current.clearLayers();

      particlesRef.current.forEach(p => {
        // Calculate next position
        // In Leaflet/Map coordinates, lat is Y (up) and lng is X (right)
        // Wind direction is usually 0 = North, 90 = East
        const rad = (p.angle - 90) * (Math.PI / 180);
        p.currentLat -= Math.sin(rad) * p.speed * SPEED_FACTOR;
        p.currentLng += Math.cos(rad) * p.speed * SPEED_FACTOR;

        // Reset if too far
        const dist = Math.sqrt(Math.pow(p.currentLat - p.startLat, 2) + Math.pow(p.currentLng - p.startLng, 2));
        if (dist > RESET_DISTANCE) {
          p.currentLat = p.startLat;
          p.currentLng = p.startLng;
        }

        // Create arrow icon
        const arrowHtml = `
          <div style="transform: rotate(${p.angle}deg); opacity: ${p.opacity};">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L12 21M12 3L5 10M12 3L19 10" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 2px #22d3ee)"/>
            </svg>
          </div>
        `;

        const icon = L.divIcon({
          className: 'wind-arrow-particle',
          html: arrowHtml,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L.marker([p.currentLat, p.currentLng], { icon, interactive: false }).addTo(containerRef.current);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (containerRef.current) containerRef.current.remove();
    };
  }, [map, data]);

  return null;
}
