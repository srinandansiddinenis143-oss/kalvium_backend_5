import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  headlineText?: string;
  badgeText?: string;
}

export const Callout6: React.FC<Props> = ({
  headlineText = 'TUTORIAL',
  badgeText = 'ENCLUDED',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // TIMING: Sequential 3-Step Intro (Dot -> Vertical Stem -> Box)
  // -----------------------------------------------------------
  const dotIntro = spring({ frame, fps, config: { stiffness: 70, damping: 14 } });
  const vertLineIntro = spring({ frame: frame - 12, fps, config: { stiffness: 60, damping: 15 } });
  const boxIntro = spring({ frame: frame - 24, fps, config: { stiffness: 60, damping: 15 } });

  // -----------------------------------------------------------
  // TIMING: Sequential 3-Step Outro (Reverse)
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 45;
  const boxOutro = spring({ frame: frame - outroStartFrame, fps, config: { stiffness: 60, damping: 15 } });
  const vertLineOutro = spring({ frame: frame - (outroStartFrame + 10), fps, config: { stiffness: 60, damping: 15 } });
  const dotOutro = spring({ frame: frame - (outroStartFrame + 20), fps, config: { stiffness: 70, damping: 14 } });

  // -----------------------------------------------------------
  // INTERPOLATIONS
  // -----------------------------------------------------------
  const dotScale = frame >= outroStartFrame ? interpolate(dotOutro, [0, 1], [1, 0]) : interpolate(dotIntro, [0, 1], [0, 1]);
  const vertLineProgress = frame >= outroStartFrame ? interpolate(vertLineOutro, [0, 1], [1, 0]) : interpolate(vertLineIntro, [0, 1], [0, 1]);
  const boxScaleY = frame >= outroStartFrame ? interpolate(boxOutro, [0, 1], [1, 0]) : interpolate(boxIntro, [0, 1], [0, 1]);

  // -----------------------------------------------------------
  // LAYOUT COORDINATES
  // -----------------------------------------------------------
  const centerX = 960;
  const dotY = 350;
  const stemHeight = 100;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      
      {/* STEP 1: Target Circle Node with Ring Aura */}
      <div
        style={{
          position: 'absolute',
          left: centerX,
          top: dotY,
          transform: `translate(-50%, -50%) scale(${dotScale})`,
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4,
        }}
      >
        {/* Outer Ring */}
        <div
          style={{
            position: 'absolute',
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '2px solid rgba(248, 244, 251, 0.6)',
            boxShadow: '0 0 12px rgba(247, 246, 249, 0.4)',
          }}
        />
        {/* Inner Dot */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#40cbe0',
            boxShadow: '0 0 8px rgba(64, 224, 208, 0.8)',
          }}
        />
      </div>

      {/* STEP 2: Vertical Stem Line (Extending Downwards) */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 1,
          top: dotY + 18,
          width: 2,
          height: stemHeight,
          backgroundColor: '#40E0D0',
          transform: `scaleY(${vertLineProgress})`,
          transformOrigin: 'top center',
          zIndex: 3,
          boxShadow: '0 0 8px rgba(64, 224, 208, 0.6)',
        }}
      />

      {/* STEP 3: Complete Unified Rectangle Box Container */}
      <div
        style={{
          position: 'absolute',
          left: centerX,
          top: dotY + 18 + stemHeight,
          transform: `translate(-50%, 0) scaleY(${boxScaleY})`,
          transformOrigin: 'top center',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#892be200',
          border: '2px solid #40E0D0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          zIndex: 2,
        }}
      >
        {/* Top Header Section */}
        <div
          style={{
            padding: '18px 60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {headlineText}
          </span>
        </div>

        {/* Horizontal Divider Line */}
        <div
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#40E0D0',
          }}
        />

        {/* Bottom Badge Section */}
        <div
          style={{
            padding: '8px 30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle contrast for badge section
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {badgeText}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};