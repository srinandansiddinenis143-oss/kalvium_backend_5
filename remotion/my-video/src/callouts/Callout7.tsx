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
}

export const Callout7: React.FC<Props> = ({
  width = 300,
  height = 300,
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
        justifyContent: 'center'
      }}
    >
      
      {/* HUD Frame Container */}
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
        {/* SVG HUD Border Overlay */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 300"
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        >
          <defs>
            <filter id="hud-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Main Chamfered Frame Lines */}
          <g stroke="#40E0D0" strokeWidth="2" fill="none" filter="url(#hud-glow)">
            {/* Top Edge (with center gap) */}
            <path d="M 65 15 L 120 15" />
            <path d="M 180 15 L 235 15" />

            {/* Bottom Edge (with center gap) */}
            <path d="M 65 285 L 120 285" />
            <path d="M 180 285 L 235 285" />

            {/* Left Edge (with center tick slot) */}
            <path d="M 15 65 L 15 120" />
            <path d="M 15 180 L 15 235" />

            {/* Right Edge (with center tick slot) */}
            <path d="M 285 65 L 285 120" />
            <path d="M 285 180 L 285 235" />

            {/* Top-Left Diagonal Corner */}
            <path d="M 65 15 L 35 45 L 15 65" />

            {/* Top-Right Diagonal Corner */}
            <path d="M 235 15 L 265 45 L 285 65" />

            {/* Bottom-Left Diagonal Corner */}
            <path d="M 15 235 L 35 255 L 65 285" />

            {/* Bottom-Right Diagonal Corner */}
            <path d="M 285 235 L 265 255 L 235 285" />
          </g>

          {/* Side Accent Ticks (Left & Right Midpoints) */}
          <g fill="#40E0D0" filter="url(#hud-glow)">
            <rect x="11" y="130" width="8" height="40" rx="2" />
            <rect x="281" y="130" width="8" height="40" rx="2" />
          </g>

          {/* Corner Solid Triangle Markers */}
          <g fill="#40E0D0">
            {/* Top-Left Corner Triangle */}
            <polygon points="15,15 45,15 15,45" />
            {/* Top-Right Corner Triangle */}
            <polygon points="285,15 255,15 285,45" />
            {/* Bottom-Left Corner Triangle */}
            <polygon points="15,285 45,285 15,255" />
            {/* Bottom-Right Corner Triangle */}
            <polygon points="285,285 255,285 285,255" />
          </g>
        </svg>

      </div>
    </AbsoluteFill>
  );
};