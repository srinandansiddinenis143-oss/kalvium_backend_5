import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  numberText?: string;
  description?: string;
}

export const Callout9: React.FC<Props> = ({
  numberText = '01',
  description = 'dune part 1',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const intro = spring({ frame, fps, config: { stiffness: 80, damping: 14 } });
  const outro = spring({ frame: frame - (durationInFrames - 35), fps, config: { stiffness: 80, damping: 14 } });
  const scale = frame >= durationInFrames - 35 ? interpolate(outro, [0, 1], [1, 0.8]) : interpolate(intro, [0, 1], [0.8, 1]);
  const opacity = frame >= durationInFrames - 35 ? interpolate(outro, [0, 1], [1, 0]) : interpolate(intro, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 400, height: 160, opacity, transform: `scale(${scale})` }}>
        
        {/* Offset Shadow Layer */}
        <div style={{ position: 'absolute', left: 8, top: 8, width: 100, height: 100, borderRadius: '50%', backgroundColor: '#0288D1', opacity: 0.3 }} />

        {/* Main Circle Badge */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 100, height: 100, borderRadius: '50%', backgroundColor: '#0288D1', border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 900 }}>{numberText}</span>
        </div>

        {/* Pointer Line & Dot */}
        <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 1 }}>
          <path d="M 90 50 L 180 50 L 260 50" stroke="#222" strokeWidth="2" fill="none" />
          <circle cx="260" cy="50" r="6" fill="#222" />
        </svg>

        {/* Description Text (Centered tightly above the horizontal line y=50) */}
        <div style={{ position: 'absolute', left: 120, top: 20, width: 150, color: '#222', fontSize: 13, fontWeight: 600, lineHeight: 1.3, zIndex: 2 }}>
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );
};