import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  badgeText?: string;
}

export const TextStyles4: React.FC<Props> = ({ badgeText = 'PROTOTYPE V1.0' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const intro = spring({ frame, fps, config: { stiffness: 100, damping: 10 } });
  const outro = spring({ frame: frame - (durationInFrames - 30), fps, config: { stiffness: 100, damping: 10 } });

  const translateY = frame >= durationInFrames - 30 
    ? interpolate(outro, [0, 1], [0, 80]) 
    : interpolate(intro, [0, 1], [80, 0]);

  const opacity = frame >= durationInFrames - 30 
    ? interpolate(outro, [0, 1], [1, 0]) 
    : interpolate(intro, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          backgroundColor: '#8A2BE2',
          border: '2px solid #40E0D0',
          padding: '16px 40px',
          borderRadius: '50px',
          boxShadow: '0 8px 32px rgba(138, 43, 226, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          {badgeText}
        </span>
      </div>
    </AbsoluteFill>
  );
};