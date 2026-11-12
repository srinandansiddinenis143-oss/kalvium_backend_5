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
  role?: string;
}

export const LowerThird11: React.FC<Props> = ({
  name = 'HENRY TOWER',
  role = 'MOTION DESIGNER',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // INTRO ANIMATIONS (Frames 0 -> 30)
  // -----------------------------------------------------------
  const barsIntro = spring({
    frame,
    fps,
    config: { stiffness: 45, damping: 18 },
  });

  const textIntro = spring({
    frame: frame - 6,
    fps,
    config: { stiffness: 35, damping: 20 },
  });

  // -----------------------------------------------------------
  // OUTRO ANIMATIONS (Last 30 frames)
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 30;

  const textOutro = spring({
    frame: frame - outroStartFrame,
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  const barsOutro = spring({
    frame: frame - (outroStartFrame + 6),
    fps,
    config: { stiffness: 45, damping: 20 },
  });

  // -----------------------------------------------------------
  // INTERPOLATIONS
  // -----------------------------------------------------------
  const barsScaleYIntro = interpolate(barsIntro, [0, 1], [0, 1]);
  const barsScaleYOutro = interpolate(barsOutro, [0, 1], [1, 0]);
  const barScaleY = frame >= outroStartFrame ? barsScaleYOutro : barsScaleYIntro;

  const clipPercentIntro = interpolate(textIntro, [0, 1], [0, 100]);
  const clipPercentOutro = interpolate(textOutro, [0, 1], [100, 0]);
  const clipPercent = frame >= outroStartFrame ? clipPercentOutro : clipPercentIntro;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        fontFamily: 'Montserrat, Arial, sans-serif',
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
        {/* Left Yellow Pillar */}
        <div
          style={{
            width: 8,
            height: 64,
            backgroundColor: '#D4E157',
            transform: `scaleY(${barScaleY})`,
            transformOrigin: 'top center',
            marginRight: 20,
          }}
        />

        {/* Center Text Section */}
        <div
          style={{
            clipPath: `polygon(0 0, ${clipPercent}% 0, ${clipPercent}% 100%, 0 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </span>
          <span
            style={{
              color: '#B0BEC5',
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: '3px',
              marginTop: 4,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {role}
          </span>
        </div>

        {/* Right Yellow Pillar */}
        <div
          style={{
            width: 8,
            height: 64,
            backgroundColor: '#D4E157',
            transform: `scaleY(${barScaleY})`,
            transformOrigin: 'top center',
            marginLeft: 20,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};