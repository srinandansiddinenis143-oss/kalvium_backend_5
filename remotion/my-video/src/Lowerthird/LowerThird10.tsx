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

export const LowerThird10: React.FC<Props> = ({
  name = 'DAVID DUCHOVNY',
  role = 'SCREENWRITER',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Intro (Frames 0 -> 30)
  const boxIntro = spring({
    frame,
    fps,
    config: { stiffness: 35, damping: 20 },
  });

  const subtitleIntro = spring({
    frame: frame - 8,
    fps,
    config: { stiffness: 30, damping: 20 },
  });

  // Outro (Last 30 frames)
  const outroStartFrame = durationInFrames - 30;

  const subtitleOutro = spring({
    frame: frame - outroStartFrame,
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  const boxOutro = spring({
    frame: frame - (outroStartFrame + 6),
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  // Interpolated Values
  const boxScaleXIntro = interpolate(boxIntro, [0, 1], [0, 1]);
  const boxScaleXOutro = interpolate(boxOutro, [0, 1], [1, 0]);
  const boxScaleX = frame >= outroStartFrame ? boxScaleXOutro : boxScaleXIntro;

  const opacityIntro = interpolate(subtitleIntro, [0, 1], [0, 1]);
  const opacityOutro = interpolate(subtitleOutro, [0, 1], [1, 0]);
  const subtitleOpacity = frame >= outroStartFrame ? opacityOutro : opacityIntro;

  const subtitleYIntro = interpolate(subtitleIntro, [0, 1], [-10, 0]);
  const subtitleYOutro = interpolate(subtitleOutro, [0, 1], [0, -10]);
  const subtitleY = frame >= outroStartFrame ? subtitleYOutro : subtitleYIntro;

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
          bottom: 120,
          left: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Yellow Bounding Box with Name */}
        <div
          style={{
            border: '4px solid #D4E157', // Bright yellow frame border
            padding: '12px 36px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            transform: `scaleX(${boxScaleX})`,
            transformOrigin: 'center center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </span>
        </div>

        {/* Italicized Subtitle */}
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            marginTop: 10,
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 700,
              fontStyle: 'italic',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            {role}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
