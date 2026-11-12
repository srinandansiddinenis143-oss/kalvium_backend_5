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

export const LowerThird7: React.FC<Props> = ({
  name = 'JOHN SMITH',
  role = 'CEO',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Intro
  const lineIntro = spring({
    frame,
    fps,
    config: { stiffness: 35, damping: 20 },
  });

  const textIntro = spring({
    frame: frame - 6,
    fps,
    config: { stiffness: 35, damping: 22 },
  });

  // Outro
  const outroStartFrame = durationInFrames - 30;

  const textOutro = spring({
    frame: frame - outroStartFrame,
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  const lineOutro = spring({
    frame: frame - (outroStartFrame + 6),
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  // Interpolations
  const lineScaleXIntro = interpolate(lineIntro, [0, 1], [0, 1]);
  const lineScaleXOutro = interpolate(lineOutro, [0, 1], [1, 0]);
  const lineScaleX = frame >= outroStartFrame ? lineScaleXOutro : lineScaleXIntro;

  const textYIntro = interpolate(textIntro, [0, 1], [50, 0]);
  const textYOutro = interpolate(textOutro, [0, 1], [0, 50]);
  const textTranslateY = frame >= outroStartFrame ? textYOutro : textYIntro;

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
          bottom: 130,
          right: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        {/* Text Area with Vertical Mask */}
        <div style={{ overflow: 'hidden', paddingBottom: 8 }}>
          <div
            style={{
              transform: `translateY(${textTranslateY}px)`,
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: '2px',
              }}
            >
              {name}
            </span>
            <span
              style={{
                color: '#00ACC1',
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: '1px',
              }}
            >
              / {role}
            </span>
          </div>
        </div>

        {/* Bottom Accent Line Expanding from Right */}
        <div
          style={{
            width: 420,
            height: 4,
            backgroundColor: '#00ACC1',
            transform: `scaleX(${lineScaleX})`,
            transformOrigin: 'right center',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};