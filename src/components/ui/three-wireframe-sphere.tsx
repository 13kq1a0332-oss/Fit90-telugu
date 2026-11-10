"use client";

import React, { useEffect, useRef } from "react";

interface ThreeWireframeSphereProps {
  className?: string;
  size?: number;
  score?: number;
}

/**
 * ThreeUI-inspired 3D Wireframe Sphere with rotating orbital nodes.
 * Rendered using ultra-smooth Canvas 3D mathematics without heavy external libraries.
 */
export function ThreeWireframeSphere({
  className = "",
  size = 220,
  score = 88,
}: ThreeWireframeSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angleX = 0;
    let angleY = 0;

    // Generate latitude / longitude 3D points on a sphere
    const points: { x: number; y: number; z: number }[] = [];
    const numLat = 12;
    const numLon = 18;
    const radius = size * 0.38;

    for (let i = 0; i <= numLat; i++) {
      const theta = (i * Math.PI) / numLat;
      for (let j = 0; j < numLon; j++) {
        const phi = (j * 2 * Math.PI) / numLon;
        points.push({
          x: radius * Math.sin(theta) * Math.cos(phi),
          y: radius * Math.cos(theta),
          z: radius * Math.sin(theta) * Math.sin(phi),
        });
      }
    }

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      angleX += 0.007;
      angleY += 0.011;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const centerX = size / 2;
      const centerY = size / 2;
      const fov = size * 1.2;

      // Project 3D points to 2D
      const projected = points.map((p) => {
        // Rotate Y
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const scale = fov / (fov + z2 + radius * 1.5);
        return {
          x: centerX + x1 * scale,
          y: centerY + y2 * scale,
          z: z2,
          scale,
        };
      });

      // Draw subtle orbital wireframe lines
      ctx.beginPath();
      ctx.strokeStyle = "rgba(16, 185, 129, 0.18)";
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i += numLon) {
        for (let j = 0; j < numLon; j++) {
          const p1 = projected[i + j];
          const p2 = projected[i + ((j + 1) % numLon)];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
      ctx.stroke();

      // Draw glowing 3D nodes
      for (let i = 0; i < projected.length; i += 2) {
        const p = projected[i];
        if (p.z > -radius * 0.5) {
          const alpha = Math.max(0.1, (p.z + radius) / (radius * 2));
          const nodeSize = Math.max(1, 2.4 * p.scale);

          ctx.beginPath();
          ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha * 0.9})`;
          ctx.fill();
        }
      }

      // Draw inner glowing core
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, radius * 0.75);
      coreGrad.addColorStop(0, "rgba(16, 185, 129, 0.28)");
      coreGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.14)");
      coreGrad.addColorStop(1, "rgba(16, 185, 129, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="pointer-events-none select-none"
      />
      {/* 3D Center Overlay Stat */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
          Metabolic
        </span>
        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {score}
        </span>
        <span className="text-[10px] font-bold text-slate-400">
          Optimal / 100
        </span>
      </div>
    </div>
  );
}
