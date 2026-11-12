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

export const LowerThird9: React.FC<Props> = ({
  name = 'PAUL DONOVAN',
  role = 'MOTION DESIGNER',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Intro (Frames 0 -> 30)
  const lineIntro = spring({
    frame,
    fps,
    config: { stiffness: 45, damping: 18 },
  });

  const textIntro = spring({
    frame: frame - 6,
    fps,
    config: { stiffness: 35, damping: 20 },
  });

  // Outro (Last 30 frames)
  const outroStartFrame = durationInFrames - 30;

  const textOutro = spring({
    frame: frame - outroStartFrame,
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  const lineOutro = spring({
    frame: frame - (outroStartFrame + 6),
    fps,
    config: { stiffness: 45, damping: 20 },
  });

  // Interpolated Values
  const lineScaleYIntro = interpolate(lineIntro, [0, 1], [0, 1]);
  const lineScaleYOutro = interpolate(lineOutro, [0, 1], [1, 0]);
  const lineScaleY = frame >= outroStartFrame ? lineScaleYOutro : lineScaleYIntro;

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
        {/* Yellow Vertical Accent Line */}
        <div
          style={{
            width: 8,
            height: 60,
            backgroundColor: '#D4E157', // Yellow accent color
            transform: `scaleY(${lineScaleY})`,
            transformOrigin: 'top center',
            marginRight: 18,
          }}
        />

        {/* Text Area */}
        <div
          style={{
            clipPath: `polygon(0 0, ${clipPercent}% 0, ${clipPercent}% 100%, 0 100%)`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            {name}
          </span>
          <span
            style={{
              color: '#D4E157',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '2px',
              marginTop: 4,
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