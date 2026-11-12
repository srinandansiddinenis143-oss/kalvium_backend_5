import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  numberText?: string;
  description?: string;
}

export const Callout12: React.FC<Props> = ({
  numberText = '04',
  description = 'dunes of time',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const intro = spring({ frame, fps, config: { stiffness: 80, damping: 14 } });
  const outro = spring({ frame: frame - (durationInFrames - 35), fps, config: { stiffness: 80, damping: 14 } });
  const scale = frame >= durationInFrames - 35 ? interpolate(outro, [0, 1], [1, 0.8]) : interpolate(intro, [0, 1], [0.8, 1]);
  const opacity = frame >= durationInFrames - 35 ? interpolate(outro, [0, 1], [1, 0]) : interpolate(intro, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 420, height: 160, opacity, transform: `scale(${scale})` }}>
        
        {/* Star Shape Badge */}
        <svg style={{ position: 'absolute', left: 0, top: 0, width: 110, height: 110, overflow: 'visible', zIndex: 2 }}>
          <polygon points="55,5 68,38 104,40 75,63 85,98 55,78 25,98 35,63 6,40 42,38" fill="#0288D1" stroke="#222" strokeWidth="2" strokeLinejoin="round" />
        </svg>

        {/* Number inside Star */}
        <div style={{ position: 'absolute', left: 35, top: 38, zIndex: 3 }}>
          <span style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 900 }}>{numberText}</span>
        </div>

        {/* Pointer Line & Dot */}
        <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 1 }}>
          <path d="M 85 75 L 140 75 L 250 75" stroke="#222" strokeWidth="2" fill="none" />
          <circle cx="250" cy="75" r="6" fill="#222" />
        </svg>

        {/* Description Text (Tightened spacing so short text stays nicely above the line) */}
        <div style={{ position: 'absolute', left: 145, top: 48, width: 160, color: '#222', fontSize: 13, fontWeight: 600, lineHeight: 1.3, zIndex: 2 }}>
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );
};