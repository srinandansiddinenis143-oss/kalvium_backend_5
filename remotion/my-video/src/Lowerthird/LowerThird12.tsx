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

export const LowerThird12: React.FC<Props> = ({
  name = 'RIDLEY THOMAS',
  role = 'PHOTOGRAPHER',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // INTRO ANIMATIONS (Frames 0 -> 30)
  // -----------------------------------------------------------
  const bracketIntro = spring({
    frame,
    fps,
    config: { stiffness: 40, damping: 20 },
  });

  const textIntro = spring({
    frame: frame - 6,
    fps,
    config: { stiffness: 35, damping: 22 },
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

  const bracketOutro = spring({
    frame: frame - (outroStartFrame + 6),
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  // -----------------------------------------------------------
  // INTERPOLATIONS
  // -----------------------------------------------------------
  // Bracket Draw Progress (0 -> 1 -> 0)
  const bracketProgressIntro = interpolate(bracketIntro, [0, 1], [0, 1]);
  const bracketProgressOutro = interpolate(bracketOutro, [0, 1], [1, 0]);
  const bracketProgress =
    frame >= outroStartFrame ? bracketProgressOutro : bracketProgressIntro;

  // Text Reveal Mask
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
          padding: '12px 20px',
        }}
      >
        {/* Yellow Top & Left Corner Bracket Lines */}
        {/* Top Horizontal Line Segment */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 6,
            width: 140,
            backgroundColor: '#D4E157',
            transform: `scaleX(${bracketProgress})`,
            transformOrigin: 'left center',
          }}
        />

        {/* Left Vertical Line Segment */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 6,
            height: '100%',
            backgroundColor: '#D4E157',
            transform: `scaleY(${bracketProgress})`,
            transformOrigin: 'top center',
          }}
        />

        {/* Bottom Left Extension Horizontal Line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 6,
            width: 220,
            backgroundColor: '#D4E157',
            transform: `scaleX(${bracketProgress})`,
            transformOrigin: 'left center',
          }}
        />

        {/* Text Area */}
        <div
          style={{
            clipPath: `polygon(0 0, ${clipPercent}% 0, ${clipPercent}% 100%, 0 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingLeft: 16,
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 40,
              fontWeight: 900,
              letterSpacing: '2px',
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
      </div>
    </AbsoluteFill>
  );
};