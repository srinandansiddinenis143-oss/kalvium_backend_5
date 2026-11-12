import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  numberText?: string;
  description?: string;
}

export const Callout11: React.FC<Props> = ({
  numberText = '03',
  description = 'Quis autem vel eum iure',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const intro = spring({ frame, fps, config: { stiffness: 80, damping: 14 } });
  const outro = spring({ frame: frame - (durationInFrames - 35), fps, config: { stiffness: 80, damping: 14 } });
  const scale = frame >= durationInFrames - 35 ? interpolate(outro, [0, 1], [1, 0.8]) : interpolate(intro, [0, 1], [0.8, 1]);
  const opacity = frame >= durationInFrames - 35 ? interpolate(outro, [0, 1], [1, 0]) : interpolate(intro, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 480, height: 200, opacity, transform: `scale(${scale})` }}>
        
        {/* Triangle Badge */}
        <svg style={{ position: 'absolute', left: 0, top: 10, width: 140, height: 130, overflow: 'visible', zIndex: 2 }}>
          <polygon points="15,120 125,120 70,10" fill="#0288D1" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>

        {/* Number inside Triangle */}
        <div style={{ position: 'absolute', left: 45, top: 75, zIndex: 3 }}>
          <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{numberText}</span>
        </div>

        {/* Pointer Line & Dot */}
        <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 1 }}>
          <path d="M 98 65 L 150 20 L 250 20" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
          <circle cx="250" cy="20" r="6" fill="#FFFFFF" />
        </svg>

        {/* Description Text */}
        <div style={{ position: 'absolute', left: 145, top: -12, width: 160, color: '#FFFFFF', fontSize: 13, fontWeight: 600, lineHeight: 1.3, zIndex: 2, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );
};
