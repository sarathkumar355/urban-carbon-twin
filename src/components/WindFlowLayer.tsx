"use client";

import { useEffect, useRef } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";

interface WindFlowLayerProps {
  data: {
    lat: number;
    lng: number;
    speed: number;
    direction: number;
  }[];
}

export function WindFlowLayer({ data }: WindFlowLayerProps) {
  const context = useLeafletContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = context.layerContainer || context.map;
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "400";
    canvas.style.opacity = "0.7";
    
    const map = context.map;
    const pane = map.getPane("overlayPane");
    if (pane) pane.appendChild(canvas);

    const particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    const particleCount = 200;

    const createParticle = () => {
      const bounds = map.getBounds();
      const northWest = map.latLngToContainerPoint(bounds.getNorthWest());
      const southEast = map.latLngToContainerPoint(bounds.getSouthEast());
      
      return {
        x: Math.random() * (southEast.x - northWest.x) + northWest.x,
        y: Math.random() * (southEast.y - northWest.y) + northWest.y,
        vx: 0,
        vy: 0,
        life: Math.random() * 100 + 50
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      const size = map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(100, 210, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";

      particles.forEach((p, i) => {
        // Find nearest wind data point
        let nearest = data[0];
        let minDist = Infinity;
        
        const pLatLng = map.containerPointToLatLng([p.x, p.y]);
        
        data.forEach(d => {
          const dist = Math.sqrt(Math.pow(d.lat - pLatLng.lat, 2) + Math.pow(d.lng - pLatLng.lng, 2));
          if (dist < minDist) {
            minDist = dist;
            nearest = d;
          }
        });

        const angle = (nearest.direction - 90) * (Math.PI / 180);
        const speed = nearest.speed * 0.1;
        
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        p.x += p.vx;
        p.y += p.vy;
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        p.life--;
        if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          particles[i] = createParticle();
        }
      });

      requestAnimationFrame(animate);
    };

    const handleMove = () => {
      const pos = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, pos);
    };

    map.on("move", handleMove);
    animate();

    return () => {
      map.off("move", handleMove);
      if (pane) pane.removeChild(canvas);
    };
  }, [context, data]);

  return null;
}
