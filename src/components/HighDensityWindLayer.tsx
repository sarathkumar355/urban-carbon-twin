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

interface HighDensityWindLayerProps {
  data: WindPoint[];
}

interface Particle {
  x: number; // lat
  y: number; // lng
  history: { x: number; y: number }[];
  age: number;
  maxAge: number;
  speed: number;
  angle: number;
}

const getWindColor = (speed: number) => {
  if (speed < 3) return "#22d3ee"; // Cyan - Light
  if (speed < 7) return "#3b82f6"; // Blue - Moderate
  if (speed < 12) return "#6366f1"; // Indigo - High
  return "#a855f7"; // Purple - Extreme
};

export function HighDensityWindLayer({ data }: HighDensityWindLayerProps) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);
  const [probeData, setProbeData] = useState<{ lat: number; lng: number; speed: number; direction: number; x: number; y: number } | null>(null);

  // Configuration
  const PARTICLE_COUNT = 180;
  const MAX_AGE = 120;
  const SPEED_SCALE = 0.000035;
  const TRAIL_LENGTH = 12;
  
  const BOUNDS = {
    minLat: 8.0,
    maxLat: 14.0,
    minLng: 76.0,
    maxLng: 80.5
  };

  const getWindAt = (lat: number, lng: number) => {
    let totalWeight = 0;
    let weightedSpeed = 0;
    let weightedAngle = 0;
    const p = 2;

    data.forEach(point => {
      const d = Math.sqrt(Math.pow(lat - point.lat, 2) + Math.pow(lng - point.lng, 2));
      if (d === 0) return point;
      const weight = 1 / Math.pow(d, p);
      totalWeight += weight;
      weightedSpeed += point.speed * weight;
      weightedAngle += point.direction * weight;
    });

    return {
      speed: totalWeight > 0 ? weightedSpeed / totalWeight : 2,
      direction: totalWeight > 0 ? weightedAngle / totalWeight : 0
    };
  };

  const spawnParticle = (): Particle => {
    const lat = BOUNDS.minLat + Math.random() * (BOUNDS.maxLat - BOUNDS.minLat);
    const lng = BOUNDS.minLng + Math.random() * (BOUNDS.maxLng - BOUNDS.minLng);
    const wind = getWindAt(lat, lng);
    
    return {
      x: lat,
      y: lng,
      history: [{ x: lat, y: lng }],
      age: Math.random() * MAX_AGE,
      maxAge: MAX_AGE + Math.random() * 60,
      speed: wind.speed,
      angle: wind.direction
    };
  };

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "400";
    
    const container = map.getPanes().overlayPane;
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const resizeCanvas = () => {
      const size = map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;
    };

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      const wind = getWindAt(e.latlng.lat, e.latlng.lng);
      const point = map.latLngToContainerPoint(e.latlng);
      setProbeData({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        speed: wind.speed,
        direction: wind.direction,
        x: point.x,
        y: point.y
      });
    };

    const handleMouseOut = () => setProbeData(null);

    map.on("viewreset movemove", resizeCanvas);
    map.on("mousemove", handleMouseMove);
    map.on("mouseout", handleMouseOut);
    
    resizeCanvas();

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, spawnParticle);

    const render = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = map.getSize();
      ctx.clearRect(0, 0, size.x, size.y);
      
      particlesRef.current.forEach((p, i) => {
        p.age++;
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > TRAIL_LENGTH) p.history.shift();

        if (p.age % 12 === 0) {
          const wind = getWindAt(p.x, p.y);
          p.speed = wind.speed;
          const diff = wind.direction - p.angle;
          p.angle += diff * 0.2; 
        }

        const rad = (p.angle - 90) * (Math.PI / 180);
        p.x -= Math.sin(rad) * p.speed * SPEED_SCALE;
        p.y += Math.cos(rad) * p.speed * SPEED_SCALE;

        if (p.age > p.maxAge || p.x < BOUNDS.minLat || p.x > BOUNDS.maxLat || p.y < BOUNDS.minLng || p.y > BOUNDS.maxLng) {
          particlesRef.current[i] = spawnParticle();
          particlesRef.current[i].age = 0;
        }

        const alpha = Math.min(0.8, (p.maxAge - p.age) / 30, p.age / 30);
        const color = getWindColor(p.speed);

        // 1. Draw Trail
        if (p.history.length > 2) {
          ctx.beginPath();
          const startPt = map.latLngToContainerPoint([p.history[0].x, p.history[0].y]);
          ctx.moveTo(startPt.x, startPt.y);
          for (let j = 1; j < p.history.length; j++) {
            const pt = map.latLngToContainerPoint([p.history[j].x, p.history[j].y]);
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.strokeStyle = color;
          ctx.globalAlpha = alpha * 0.2;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // 2. Draw Arrow
        const headPoint = map.latLngToContainerPoint([p.x, p.y]);
        const arrowLen = 8 + p.speed * 1.5;
        const headSize = 3 + p.speed * 0.5;

        ctx.save();
        ctx.translate(headPoint.x, headPoint.y);
        ctx.rotate(p.angle * (Math.PI / 180));
        
        ctx.beginPath();
        ctx.moveTo(-arrowLen, 0);
        ctx.lineTo(0, 0);
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1 + p.speed * 0.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-headSize, -headSize/2);
        ctx.lineTo(-headSize, headSize/2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        
        ctx.shadowBlur = 4;
        ctx.shadowColor = color;
        ctx.restore();
      });

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      map.off("viewreset movemove", resizeCanvas);
      map.off("mousemove", handleMouseMove);
      map.off("mouseout", handleMouseOut);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [map, data]);

  return (
    <>
      {probeData && (
        <div 
          className="fixed pointer-events-none z-[2000] bg-black/80 backdrop-blur-md border border-blue-500/30 p-2.5 rounded-xl shadow-2xl"
          style={{ left: probeData.x + 20, top: probeData.y + 20 }}
        >
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getWindColor(probeData.speed) }} />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Atmospheric Probe</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[9px] font-bold">
            <div>
              <p className="text-white/40 uppercase">Speed</p>
              <p className="text-blue-400">{probeData.speed.toFixed(1)} m/s</p>
            </div>
            <div>
              <p className="text-white/40 uppercase">Heading</p>
              <p className="text-white">{probeData.direction.toFixed(0)}°</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
