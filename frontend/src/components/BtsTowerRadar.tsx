'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Radio, Crosshair, MapPin, Zap, Compass } from 'lucide-react';

interface BtsTowerRadarProps {
  towerId?: string;
  towerName?: string;
  coordinates?: { lat: number; lng: number };
  cellId?: string;
  azimuth?: string;
  burstWindow?: string;
}

export const BtsTowerRadar: React.FC<BtsTowerRadarProps> = ({
  towerId = 'BTS-UP-VNS-71',
  towerName = 'Assi Ghat / Bhelupur Corridor',
  coordinates = { lat: 25.2985, lng: 82.9975 },
  cellId = '404-45-71',
  azimuth = '142° SE',
  burstWindow = '01:45 AM - 03:30 AM',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeScatter, setActiveScatter] = useState<number | null>(null);

  // 4 glowing scatter points inside the buffer marking midnight call pings from the suspect's burner device
  const scatterPoints = [
    { id: 1, relX: -26, relY: -18, time: '01:52:14 IST', sim: '+91-98110-23910', duration: '142s', signal: '-74 dBm' },
    { id: 2, relX: 32, relY: -28, time: '02:18:40 IST', sim: '+91-98110-23910', duration: '88s', signal: '-82 dBm' },
    { id: 3, relX: 18, relY: 34, time: '02:44:05 IST', sim: '+91-98110-23912', duration: '210s', signal: '-69 dBm' },
    { id: 4, relX: -38, relY: 22, time: '03:15:22 IST', sim: '+91-98110-23910', duration: '64s', signal: '-88 dBm' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 1. Vector Map Grid Background
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Concentric Buffer Rings (500m, 1.5km, 3km radius)
      const radii = [
        { r: 28, label: '500m' },
        { r: 54, label: '1.5km' },
        { r: 80, label: '3.0km' }
      ];

      radii.forEach((ring, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 0 ? 'rgba(6, 182, 212, 0.6)' : idx === 1 ? 'rgba(16, 185, 129, 0.45)' : 'rgba(168, 85, 247, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ring distance label
        ctx.font = '8px monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.fillText(ring.label, cx + ring.r - 16, cy - 3);
      });

      // 3. Azimuth Beam Cone (142° SE)
      const beamAngle = (142 * Math.PI) / 180;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 84, beamAngle - 0.35, beamAngle + 0.35);
      ctx.closePath();
      const beamGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 84);
      beamGrad.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
      beamGrad.addColorStop(1, 'rgba(239, 68, 68, 0.02)');
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.restore();

      // 4. Rotating Radar Sweep Line
      angle = (angle + 0.035) % (Math.PI * 2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 84, angle, angle + 0.4);
      ctx.closePath();
      const sweepGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 84);
      sweepGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      sweepGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      // 5. Four Midnight Call Scatter Points inside buffer
      scatterPoints.forEach((pt, i) => {
        const px = cx + pt.relX;
        const py = cy + pt.relY;

        // Pulsing glow halo
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#EF4444';
        ctx.shadowColor = 'rgba(239, 68, 68, 0.9)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Outer beacon ring
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label for call index
        ctx.font = '8px monospace';
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText(`P${i + 1}`, px + 6, py - 4);
      });

      // 6. Central BTS Tower Node
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#06B6D4';
      ctx.shadowColor = 'rgba(6, 182, 212, 1)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="bg-slate-50/70 dark:bg-[#0A0F1D]/70 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-2 select-none font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-1.5 text-blue-700 dark:text-blue-400 font-semibold">
          <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span>GEOSPATIAL BTS RADAR SURVEILLANCE</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 rounded font-semibold">
          LIVE LATCH
        </span>
      </div>

      {/* Radar Canvas Container (Height: 180px) */}
      <div className="relative w-full h-[180px] bg-slate-900 dark:bg-[#050711] rounded-md border border-slate-700 dark:border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
        <canvas
          ref={canvasRef}
          width={330}
          height={180}
          className="w-full h-full block"
        />

        {/* Center Tower Pin Marker */}
        <div className="absolute top-2 left-2 flex items-center space-x-1.5 bg-slate-950/80 border border-slate-700 px-2 py-0.5 rounded text-[9px] text-cyan-300 backdrop-blur-xs">
          <MapPin className="w-2.5 h-2.5 text-cyan-400" />
          <span>{coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E</span>
        </div>

        {/* Top Right Range Legend */}
        <div className="absolute top-2 right-2 flex items-center space-x-1 text-[8px] text-slate-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>500m</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
          <span>1.5km</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 ml-1"></span>
          <span>3km</span>
        </div>

        {/* Bottom Pings Snapshot */}
        <div className="absolute bottom-1.5 right-2 text-[9px] text-rose-300 bg-rose-950/90 border border-rose-800 px-2 py-0.5 rounded flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
          <span>4 Midnight Bursts Tracked</span>
        </div>
      </div>

      {/* Overlay HUD Readout Bar */}
      <div className="bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 p-2 rounded-md text-[10px] space-y-1 shadow-2xs">
        <div className="flex justify-between items-center text-slate-800 dark:text-slate-200">
          <span className="text-slate-500 dark:text-slate-400">CELL TOWER ID:</span>
          <span className="text-blue-700 dark:text-blue-400 font-bold">{towerId} ({towerName})</span>
        </div>
        <div className="flex justify-between items-center text-slate-800 dark:text-slate-200">
          <span className="text-slate-500 dark:text-slate-400">AZIMUTH / SECTOR:</span>
          <span className="text-amber-700 dark:text-amber-400 font-semibold">{azimuth} | CELL ID: {cellId}</span>
        </div>
        <div className="flex justify-between items-center text-rose-700 dark:text-rose-400">
          <span className="text-slate-500 dark:text-slate-400">BURST WINDOW:</span>
          <span className="font-semibold bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300">{burstWindow}</span>
        </div>
      </div>

      {/* Scatter Midnight Pings Breakdown Table */}
      <div className="space-y-1">
        <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
          Cell Intercept Burst Log:
        </div>
        <div className="grid grid-cols-2 gap-1 text-[9px]">
          {scatterPoints.map((pt) => (
            <div
              key={pt.id}
              className="bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 p-1.5 rounded-md flex items-center justify-between text-slate-700 dark:text-slate-300 shadow-2xs"
            >
              <div>
                <span className="text-rose-600 dark:text-rose-400 font-bold">P{pt.id}:</span> {pt.time.slice(0, 8)}
              </div>
              <div className="text-blue-700 dark:text-blue-400 font-bold">{pt.signal}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
