import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const TsunamiWaveBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Dense grid parameters
  const cols = 60;
  const rows = 32;
  const cellWidth = (width / (cols - 1)) * 1.5;
  const cellHeight = (height / (rows - 1)) * 1.1;

  // Pre-calculate particle matrix with massive tsunami-like amplitude
  const particles: { x: number; y: number; z: number; color: string; opacity: number }[][] = [];

  for (let r = 0; r < rows; r++) {
    const rowParticles = [];
    for (let c = 0; c < cols; c++) {
      const x = (c - cols / 2) * cellWidth + width / 2;
      const y = (r - rows / 2) * cellHeight + height / 2 + 180;

      // Aggressive multi-frequency wave math for towering swells
      const wave1 = Math.sin(c * 0.25 + frame * 0.08);
      const wave2 = Math.cos(r * 0.3 + frame * 0.07);
      const crossWave = Math.sin((c + r) * 0.15 + frame * 0.05);
      
      const distance = wave1 * wave2 + (crossWave * 0.4);

      // TSUNAMI AMPLITUDE: Massive height displacement (280px)
      const particleZ = distance * 280; 

      const depthFactor = r / rows;
      const opacity = Math.max(0.4, (depthFactor * 0.6) + (distance + 1.2) * 0.4);
      
      // Extreme color grading: White-hot crests, electric cyan, and deep neon green troughs
      let color = '#00ff66';
      if (particleZ > 120) color = '#ffffff'; // Crests glow blinding white
      else if (particleZ < -100) color = '#00f0ff'; // Deep troughs glow cyan

      rowParticles.push({ x, y: y + particleZ, z: particleZ, color, opacity });
    }
    particles.push(rowParticles);
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#010204',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 3D PERSPECTIVE WRAPPER WITH LOWER TILT FOR HUGE VERTICAL SCALE */}
      <div
        style={{
          position: 'absolute',
          width: '190%',
          height: '190%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'perspective(1100px) rotateX(58deg) translateY(-60px)',
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          width={width}
          height={height}
          style={{
            overflow: 'visible',
            // BLINDING TSUNAMI GLOW FILTER
            filter: 'drop-shadow(0 0 15px #00ff66) drop-shadow(0 0 35px #00f0ff) drop-shadow(0 0 60px rgba(0,255,102,0.5))',
          }}
        >
          {/* RENDER TSUNAMI PARTICLES */}
          {particles.map((row, r) =>
            row.map((p, c) => {
              // Giant variable dot sizing based on wave height
              const dotSize = Math.max(2.5, (p.z / 280 + 1.8) * 3);
              return (
                <circle
                  key={`tsunami-${r}-${c}`}
                  cx={p.x}
                  cy={p.y}
                  r={dotSize}
                  fill={p.color}
                  style={{
                    opacity: p.opacity,
                    filter: p.z > 100 ? 'drop-shadow(0 0 10px #ffffff)' : 'none',
                  }}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* DRAMATIC VIGNETTE & HORIZON FADE */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, transparent 20%, #010204 88%), linear-gradient(to bottom, #010204 0%, transparent 30%, transparent 70%, #010204 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default TsunamiWaveBackground;