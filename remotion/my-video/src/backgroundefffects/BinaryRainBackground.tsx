import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const BinaryRainBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate dense columns with vertical streak lines and binary data
  const columns = useMemo(() => {
    const cols = [];
    const colCount = Math.floor(width / 20); // Tight spacing for dense matrix effect

    for (let i = 0; i < colCount; i++) {
      const x = i * 20;
      const speed = 14 + (i % 7) * 4.5;
      const length = 20 + (i % 10); // Long cascading binary strings
      const delay = (i * 31) % 180;

      // Generate random 0s and 1s for this column stream
      const bits = Array.from({ length }, () => 
        Math.random() > 0.5 ? '1' : '0'
      );

      cols.push({ x, speed, length, delay, bits });
    }
    return cols;
  }, [width]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#010803', // Deep matrix green-black background
        overflow: 'hidden',
        fontFamily: 'monospace',
      }}
    >
      {/* BACKGROUND VERTICAL THREAD LINES */}
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id="threadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ff55" stopOpacity="0" />
            <stop offset="50%" stopColor="#00ff55" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00ff55" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {columns.map((col, i) => (
          <line
            key={`thread-${i}`}
            x1={col.x + 8}
            y1={0}
            x2={col.x + 8}
            y2={height}
            stroke="url(#threadGrad)"
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* TOP GLOW HEADER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 160,
          background: 'radial-gradient(ellipse at center top, rgba(0,255,85,0.5) 0%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* FALLING BINARY STREAMS */}
      {columns.map((col, index) => {
        const effectiveFrame = (frame + col.delay) % 300;
        const currentY = (effectiveFrame * col.speed) % (height + col.length * 24) - 100;

        return (
          <div
            key={`col-${index}`}
            style={{
              position: 'absolute',
              left: col.x,
              top: currentY,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            {col.bits.map((bit, bitIdx) => {
              const isHead = bitIdx === col.bits.length - 1;
              const opacity = isHead ? 1 : Math.max(0.2, bitIdx / col.bits.length);

              return (
                <span
                  key={`bit-${bitIdx}`}
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    lineHeight: '22px',
                    color: isHead ? '#ffffff' : '#00ff66',
                    textShadow: isHead
                      ? '0 0 12px #ffffff, 0 0 25px #00ff66, 0 0 40px #00ff66'
                      : '0 0 8px rgba(0, 255, 102, 0.7)',
                    opacity,
                  }}
                >
                  {bit}
                </span>
              );
            })}
          </div>
        );
      })}

      {/* VIGNETTE FRAME */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, #010803 90%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
    </AbsoluteFill>
  );
};

export default BinaryRainBackground;