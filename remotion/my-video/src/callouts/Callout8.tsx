import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  width?: number;
  height?: number;
  text?: string;
}

export const Callout8: React.FC<Props> = ({
  width = 460,
  height = 240,
  text = '',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // TIMING: Intro & Outro Springs
  // -----------------------------------------------------------
  const intro = spring({ frame, fps, config: { stiffness: 80, damping: 14 } });
  
  const outroStartFrame = durationInFrames - 35;
  const outro = spring({ frame: frame - outroStartFrame, fps, config: { stiffness: 80, damping: 14 } });

  // -----------------------------------------------------------
  // INTERPOLATIONS
  // -----------------------------------------------------------
  const scale = frame >= outroStartFrame 
    ? interpolate(outro, [0, 1], [1, 0.8]) 
    : interpolate(intro, [0, 1], [0.8, 1]);

  const opacity = frame >= outroStartFrame 
    ? interpolate(outro, [0, 1], [1, 0]) 
    : interpolate(intro, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scale: 1.943
      }}
    >
      
      {/* HUD Rectangle Frame Container */}
      <div
        style={{
          position: 'relative',
          width,
          height,
          opacity,
          transform: `scale(${scale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* SVG Sci-Fi HUD Rectangle Overlay */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 460 240"
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        >
          <defs>
            <filter id="hud-rect-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Double-Line Sci-Fi Border Group */}
          <g stroke="#40E0D0" strokeWidth="1.5" fill="none" filter="url(#hud-rect-glow)">
            {/* Outer Frame Lines (Chamfered Corners) */}
            <path d="M 60 12 L 400 12 L 448 60 L 448 180 L 400 228 L 60 228 L 12 180 L 12 60 Z" opacity="0.6" />
            
            {/* Inner Frame Lines (Main Border) */}
            <path d="M 65 20 L 395 20 L 440 65 L 440 175 L 395 220 L 65 220 L 20 175 L 20 65 Z" strokeWidth="2" />
          </g>

          {/* Top & Bottom Accent Slots */}
          <g fill="#40E0D0" filter="url(#hud-rect-glow)">
            <rect x="150" y="16" width="160" height="4" rx="2" />
            <rect x="150" y="220" width="160" height="4" rx="2" />
          </g>

          {/* Side Triangular Pointer Markers */}
          <g fill="#40E0D0" filter="url(#hud-rect-glow)">
            {/* Left Triangle */}
            <polygon points="12,112 28,120 12,128" />
            {/* Right Triangle */}
            <polygon points="448,112 432,120 448,128" />
          </g>
        </svg>

        {/* Optional Inner Content Slot */}
        {text && (
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              zIndex: 2,
            }}
          >
            {text}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};