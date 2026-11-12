import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  text?: string;
}

export const TextStyles1: React.FC<Props> = ({ text = 'CYBERPUNK' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const outroStart = durationInFrames - 30;
  const letters = text.split('');

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <div style={{ display: 'flex', gap: '4px', overflow: 'hidden' }}>
        {letters.map((letter, index) => {
          // Staggered Intro
          const delay = index * 3;
          const intro = spring({ frame: frame - delay, fps, config: { stiffness: 120, damping: 12 } });
          
          // Staggered Outro
          const outro = spring({ frame: frame - (outroStart + delay), fps, config: { stiffness: 120, damping: 12 } });

          const translateY = frame >= outroStart 
            ? interpolate(outro, [0, 1], [0, -60]) 
            : interpolate(intro, [0, 1], [60, 0]);

          const opacity = frame >= outroStart 
            ? interpolate(outro, [0, 1], [1, 0]) 
            : interpolate(intro, [0, 1], [0, 1]);

          const blur = frame >= outroStart
            ? interpolate(outro, [0, 1], [0, 8])
            : interpolate(intro, [0, 1], [8, 0]);

          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                color: '#40E0D0',
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: '2px',
                transform: `translateY(${translateY}px)`,
                opacity,
                filter: `blur(${blur}px)`,
                textShadow: '0 0 20px rgba(64, 224, 208, 0.5)',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};