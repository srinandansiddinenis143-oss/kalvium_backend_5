import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  topText?: string;
  bottomText?: string;
}

export const LowerThird6: React.FC<Props> = ({
  topText = 'JANE',
  bottomText = 'PUBLIC',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Intro (Frames 0 -> 30)
  const slashIntro = spring({
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

  const slashOutro = spring({
    frame: frame - (outroStartFrame + 6),
    fps,
    config: { stiffness: 45, damping: 20 },
  });

  // Interpolations
  const slashScaleYIntro = interpolate(slashIntro, [0, 1], [0, 1]);
  const slashScaleYOutro = interpolate(slashOutro, [0, 1], [1, 0]);
  const slashScaleY = frame >= outroStartFrame ? slashScaleYOutro : slashScaleYIntro;

  const clipPercentIntro = interpolate(textIntro, [0, 1], [0, 100]);
  const clipPercentOutro = interpolate(textOutro, [0, 1], [100, 0]);
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
          bottom: 130,
          left: 100,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Slanted Slash Line */}
        <div
          style={{
            width: 5,
            height: 90,
            backgroundColor: '#00ACC1',
            transform: `rotate(20deg) scaleY(${slashScaleY})`,
            transformOrigin: 'center center',
            marginRight: 24,
            boxShadow: '0 0 8px rgba(0, 172, 193, 0.4)',
          }}
        />

        {/* Text Container */}
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
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '2px',
            }}
          >
            {topText}
          </span>
          <span
            style={{
              color: '#00ACC1',
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '2px',
            }}
          >
            {bottomText}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};