import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  quoteText?: string;
  authorText?: string;
}

export const LowerThird8: React.FC<Props> = ({
  quoteText = 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SED DO EIUSMOD TEMPOR INCIDIDUNT.',
  authorText = '— JOHN SMITH',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // INTRO ANIMATIONS (Frames 0 -> 30)
  // -----------------------------------------------------------
  const badgeIntro = spring({
    frame,
    fps,
    config: { stiffness: 45, damping: 18 },
  });

  const lineIntro = spring({
    frame: frame - 4,
    fps,
    config: { stiffness: 40, damping: 20 },
  });

  const textIntro = spring({
    frame: frame - 8,
    fps,
    config: { stiffness: 30, damping: 22 },
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

  const lineOutro = spring({
    frame: frame - (outroStartFrame + 4),
    fps,
    config: { stiffness: 45, damping: 20 },
  });

  const badgeOutro = spring({
    frame: frame - (outroStartFrame + 8),
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  // -----------------------------------------------------------
  // INTERPOLATED VALUES
  // -----------------------------------------------------------
  const badgeScaleIntro = interpolate(badgeIntro, [0, 1], [0, 1]);
  const badgeScaleOutro = interpolate(badgeOutro, [0, 1], [1, 0]);
  const badgeScale = frame >= outroStartFrame ? badgeScaleOutro : badgeScaleIntro;

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
          bottom: 120,
          left: 140,
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Badge + Bottom Vertical Line */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: 24,
          }}
        >
          {/* Cyan Quote Badge Box */}
          <div
            style={{
              width: 48,
              height: 48,
              backgroundColor: '#00ACC1',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${badgeScale})`,
              marginBottom: 8,
              boxShadow: '0 4px 12px rgba(0, 172, 193, 0.3)',
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                fontSize: 28,
                fontWeight: 900,
                lineHeight: 1,
                marginTop: -4,
              }}
            >
              “
            </span>
          </div>

          {/* Downward Vertical Line (Centered underneath the badge) */}
          <div
            style={{
              width: 4,
              height: 90,
              backgroundColor: '#00ACC1',
              transform: `scaleY(${lineScaleY})`,
              transformOrigin: 'top center',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Right Column: Paragraph Quote & Author Name */}
        <div
          style={{
            maxWidth: 620,
            clipPath: `polygon(0 0, ${clipPercent}% 0, ${clipPercent}% 100%, 0 100%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: 2,
          }}
        >
          {/* Quote Body */}
          <p
            style={{
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '0.8px',
              lineHeight: 1.45,
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            {quoteText}
          </p>

          {/* Author Name */}
          <p
            style={{
              color: '#00ACC1',
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '2px',
              margin: '18px 0 0 0',
              textTransform: 'uppercase',
            }}
          >
            {authorText}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};