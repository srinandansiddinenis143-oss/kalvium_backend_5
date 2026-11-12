import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  firstName?: string;
  lastNameBadge?: string;
}

export const LowerThird3: React.FC<Props> = ({
  firstName = 'JOHN',
  lastNameBadge = 'DOWN',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // INTRO ANIMATIONS (Frames 0 -> 30)
  // -----------------------------------------------------------
  const badgeIntro = spring({
    frame,
    fps,
    config: { stiffness: 35, damping: 20 },
  });

  const textIntro = spring({
    frame: frame - 5,
    fps,
    config: { stiffness: 35, damping: 20 },
  });

  // -----------------------------------------------------------
  // OUTRO ANIMATIONS (Last 30 frames)
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 30;

  const badgeOutro = spring({
    frame: frame - outroStartFrame,
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  const textOutro = spring({
    frame: frame - (outroStartFrame + 4),
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  // -----------------------------------------------------------
  // INTERPOLATION VALUES
  // -----------------------------------------------------------
  // Badge horizontal expansion / collapse
  const badgeScaleIntro = interpolate(badgeIntro, [0, 1], [0, 1]);
  const badgeScaleOutro = interpolate(badgeOutro, [0, 1], [1, 0]);
  const badgeScaleX = frame >= outroStartFrame ? badgeScaleOutro : badgeScaleIntro;

  // Text horizontal reveal clip mask (0% -> 100% -> 0%)
  const clipIntro = interpolate(textIntro, [0, 1], [0, 100]);
  const clipOutro = interpolate(textOutro, [0, 1], [100, 0]);
  const clipPercent = frame >= outroStartFrame ? clipOutro : clipIntro;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        fontFamily: 'Montserrat, Arial Black, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: 100,
          display: 'flex',
          alignItems: 'center',
          clipPath: `polygon(0 0, ${clipPercent}% 0, ${clipPercent}% 100%, 0 100%)`,
        }}
      >
        {/* Outline / Light First Name Text */}
        <span
          style={{
            color: '#FFFFFF',
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: '2px',
            marginRight: 14,
            whiteSpace: 'nowrap',
          }}
        >
          {firstName}
        </span>

        {/* Solid Cyan Badge Box containing Second Name */}
        <div
          style={{
            backgroundColor: '#00ACC1', // Cyan accent
            padding: '8px 22px',
            borderRadius: 4,
            transform: `scaleX(${badgeScaleX})`,
            transformOrigin: 'left center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 56,
              fontWeight: 900,
              letterSpacing: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            {lastNameBadge}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};