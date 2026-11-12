import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const CHARS = '0123456789ABCDEFHIJKLMNOPQRSTUVWXYZ<>//\\*#@$_-';

export const MatrixRainBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Increased column density (tighter spacing: 24px instead of 32px)
  const columns = useMemo(() => {
    const cols = [];
    const colCount = Math.floor(width / 24);

    for (let i = 0; i < colCount; i++) {
      const x = i * 24 + (i % 2) * 3;
      const speed = 16 + (i % 8) * 4; // Faster falling speed
      const length = 16 + (i % 12);     // Longer character streams
      const delay = (i * 29) % 150;

      const chars = Array.from({ length }, () => 
        CHARS[Math.floor((i * 17 + Math.random() * 7) % CHARS.length)]
      );

      cols.push({ x, speed, length, delay, chars });
    }
    return cols;
  }, [width]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#010402', // Deep pitch-black green tint
        overflow: 'hidden',
        fontFamily: 'monospace',
      }}
    >
      {/* INTENSE TOP GLOW HEADER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 180,
          background: 'radial-gradient(ellipse at center top, rgba(0,255,100,0.6) 0%, rgba(0,255,100,0.15) 40%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* INTENSIFIED FALLING CODE STREAMS */}
      {columns.map((col, index) => {
        const effectiveFrame = (frame + col.delay) % 300;
        const currentY = (effectiveFrame * col.speed) % (height + col.length * 28) - 100;

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
            {col.chars.map((char, charIdx) => {
              const isHead = charIdx === col.chars.length - 1;
              const opacity = isHead ? 1 : Math.max(0.3, charIdx / col.chars.length);

              return (
                <span
                  key={`char-${charIdx}`}
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    lineHeight: '26px',
                    // High-intensity glowing neon green & blinding white head
                    color: isHead ? '#ffffff' : '#00ff66',
                    textShadow: isHead
                      ? '0 0 15px #ffffff, 0 0 30px #00ff66, 0 0 50px #00ff66, 0 0 80px #00ff66'
                      : '0 0 10px #00ff66, 0 0 20px rgba(0, 255, 102, 0.8)',
                    opacity,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      })}

      {/* SUBTLE VIGNETTE TO KEEP EDGES DARK */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 35%, #010402 92%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
    </AbsoluteFill>
  );
};

export default MatrixRainBackground;