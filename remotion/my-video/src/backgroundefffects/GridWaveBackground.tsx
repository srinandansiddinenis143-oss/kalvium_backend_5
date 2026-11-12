import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const GridWaveBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Grid density settings
  const cols = 28;
  const rows = 16;
  const cellWidth = width / (cols - 1);
  const cellHeight = height / (rows - 1);

  // Pre-calculate 2D matrix of nodes and height displacements
  const points: { x: number; y: number; z: number; opacity: number }[][] = [];

  for (let r = 0; r < rows; r++) {
    const rowPoints = [];
    for (let c = 0; c < cols; c++) {
      const x = (c - cols / 2) * cellWidth * 1.2 + width / 2;
      const y = (r - rows / 2) * cellHeight * 1.2 + height / 2;

      // Wave motion math linked to current frame
      const distance =
        Math.sin(c * 0.35 + frame * 0.06) *
        Math.cos(r * 0.35 + frame * 0.06);
      
      const nodeZ = distance * 60; // Wave height amplitude
      const opacity = Math.max(0.2, (distance + 1.2) * 0.6);

      rowPoints.push({ x, y: y + nodeZ, z: nodeZ, opacity });
    }
    points.push(rowPoints);
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020205',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 3D PERSPECTIVE WRAPPER */}
      <div
        style={{
          position: 'absolute',
          width: '160%',
          height: '160%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'perspective(900px) rotateX(55deg) translateY(-80px)',
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          width={width}
          height={height}
          style={{
            overflow: 'visible',
            // High intensity SVG glow filter
            filter: 'drop-shadow(0 0 12px rgba(0, 240, 255, 0.7)) drop-shadow(0 0 25px rgba(59, 130, 246, 0.5))',
          }}
        >
          <defs>
            <linearGradient id="verticalNeon" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* 1. RENDER VERTICAL LINES ONLY */}
          {points.map((row, r) =>
            row.map((point, c) => {
              if (r < rows - 1) {
                const nextRowPoint = points[r + 1][c];
                return (
                  <line
                    key={`v-line-${r}-${c}`}
                    x1={point.x}
                    y1={point.y}
                    x2={nextRowPoint.x}
                    y2={nextRowPoint.y}
                    stroke="url(#verticalNeon)"
                    strokeWidth={2.5}
                    strokeOpacity={Math.max(0.4, (point.opacity + nextRowPoint.opacity) * 0.7)}
                  />
                );
              }
              return null;
            })
          )}

          {/* 2. RENDER INTENSE GLOWING NODES */}
          {points.map((row, r) =>
            row.map((point, c) => {
              const dotSize = Math.max(2.5, (point.z / 60 + 1.5) * 2.5);
              return (
                <circle
                  key={`node-${r}-${c}`}
                  cx={point.x}
                  cy={point.y}
                  r={dotSize}
                  fill="#ffffff"
                  style={{
                    filter: 'drop-shadow(0 0 10px #00f0ff) drop-shadow(0 0 20px #3b82f6)',
                    opacity: Math.max(0.4, point.opacity * 1.2),
                  }}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* ATMOSPHERIC VIGNETTE */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, transparent 20%, #020205 85%), linear-gradient(to bottom, #020205 0%, transparent 35%, transparent 65%, #020205 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default GridWaveBackground;