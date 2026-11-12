import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  text?: string;
}

export const TextStyles2: React.FC<Props> = ({ text = 'FUTURE BUILDER' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const intro = spring({ frame, fps, config: { stiffness: 90, damping: 14 } });
  const outro = spring({ frame: frame - (durationInFrames - 30), fps, config: { stiffness: 90, damping: 14 } });

  const scale = frame >= durationInFrames - 30 
    ? interpolate(outro, [0, 1], [1, 1.2]) 
    : interpolate(intro, [0, 1], [0.8, 1]);

  const opacity = frame >= durationInFrames - 30 
    ? interpolate(outro, [0, 1], [1, 0]) 
    : interpolate(intro, [0, 1], [0, 1]);

  // Continuous background gradient shift for shimmer effect
  const gradientPosition = interpolate(frame, [0, durationInFrames], [0, 200]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <h1
        style={{
          margin: 0,
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          opacity,
          transform: `scale(${scale})`,
          backgroundImage: `linear-gradient(90deg, #40E0D0, #FF007F, #8A2BE2, #40E0D0)`,
          backgroundSize: '300% 100%',
          backgroundPosition: `${gradientPosition}% 0%`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
        }}
      >
        {text}
      </h1>
    </AbsoluteFill>
  );
};