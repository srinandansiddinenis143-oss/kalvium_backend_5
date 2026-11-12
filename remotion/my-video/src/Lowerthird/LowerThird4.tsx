import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  name?: string;
  subtitle?: string;
}

export const LowerThird4: React.FC<Props> = ({
  name = 'JOHN SMITH',
  subtitle = 'CREATIVE DIRECTOR',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // INTRO ANIMATIONS (Frames 0 -> 35)
  // -----------------------------------------------------------
  // 1. Vertical Line Drop-down
  const lineDropIntro = spring({
    frame,
    fps,
    config: { stiffness: 45, damping: 20 },
  });

  // 2. Horizontal Text Reveal (Staggered after line drops)
  const textWipeIntro = spring({
    frame: frame - 8,
    fps,
    config: { stiffness: 35, damping: 22 },
  });

  // -----------------------------------------------------------
  // OUTRO ANIMATIONS (Last 30 frames)
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 30;

  const textWipeOutro = spring({
    frame: frame - outroStartFrame,
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  const lineDropOutro = spring({
    frame: frame - (outroStartFrame + 6),
    fps,
    config: { stiffness: 45, damping: 20 },
  });

  // -----------------------------------------------------------
  // INTERPOLATED POSITIONS & SCALES
  // -----------------------------------------------------------
  // Vertical Accent Line Height Scale (0 -> 1 -> 0)
  const lineScaleYIntro = interpolate(lineDropIntro, [0, 1], [0, 1]);
  const lineScaleYOutro = interpolate(lineDropOutro, [0, 1], [1, 0]);
  const lineScaleY = frame >= outroStartFrame ? lineScaleYOutro : lineScaleYIntro;

  // Text Reveal Clip Percentage (0% -> 100% -> 0%)
  const clipPercentIntro = interpolate(textWipeIntro, [0, 1], [0, 100]);
  const clipPercentOutro = interpolate(textWipeOutro, [0, 1], [100, 0]);
  const clipPercent = frame >= outroStartFrame ? clipPercentOutro : clipPercentIntro;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: 100,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Sharp Vertical Teal Accent Bar */}
        <div
          style={{
            width: 6,
            height: 64,
            backgroundColor: '#00ACC1', // Teal / Cyan accent
            borderRadius: 2,
            transform: `scaleY(${lineScaleY})`,
            transformOrigin: 'top center',
            marginRight: 20,
            boxShadow: '0 0 10px rgba(0, 172, 193, 0.4)',
          }}
        />

        {/* Text Container with Horizontal Clip Reveal */}
        <div
          style={{
            clipPath: `polygon(0 0, ${clipPercent}% 0, ${clipPercent}% 100%, 0 100%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Main Name */}
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: '2px',
              margin: 0,
              padding: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </h1>

          {/* Subtitle / Role */}
          <p
            style={{
              color: '#00ACC1',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '3px',
              margin: '4px 0 0 0',
              padding: 0,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};