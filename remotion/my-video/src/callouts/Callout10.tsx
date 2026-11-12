import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  numberText?: string;
  description?: string;
}

export const Callout10: React.FC<Props> = ({
  numberText = '02',
  description = 'Ut enim ad minima veniamkdkf;fadksm;kdm;kdmd;kldsasio  dsalafkskj;lak  adfkk;ladk;lasfkjl ',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const intro = spring({ frame, fps, config: { stiffness: 80, damping: 14 } });
  const outro = spring({ frame: frame - (durationInFrames - 35), fps, config: { stiffness: 80, damping: 14 } });
  const scale = frame >= durationInFrames - 35 ? interpolate(outro, [0, 1], [1, 0.8]) : interpolate(intro, [0, 1], [0.8, 1]);
  const opacity = frame >= durationInFrames - 35 ? interpolate(outro, [0, 1], [1, 0]) : interpolate(intro, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 400, height: 180, opacity, transform: `scale(${scale})` }}>
        
        {/* Offset Shadow Diamond */}
        <div style={{ position: 'absolute', left: 12, top: 12, width: 100, height: 100, backgroundColor: '#0288D1', opacity: 0.3, transform: 'rotate(45deg)', borderRadius: '12px' }} />

        {/* Main Diamond Badge */}
        <div style={{ position: 'absolute', left: 4, top: 4, width: 100, height: 100, backgroundColor: '#0288D1', border: '2px solid #222', transform: 'rotate(45deg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 900, transform: 'rotate(-45deg)' }}>{numberText}</span>
        </div>

        {/* Pointer Line & Dot */}
        <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 1 }}>
          <path d="M 95 95 L 150 95 L 230 95" stroke="#222" strokeWidth="2" fill="none" />
          <circle cx="230" cy="95" r="6" fill="#222" />
        </svg>

        {/* Description Text */}
        <div style={{ position: 'absolute', left: 130, top: 65, width: 150, color: '#222', fontSize: 13, fontWeight: 600, lineHeight: 1.3, zIndex: 2 }}>
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );
};
