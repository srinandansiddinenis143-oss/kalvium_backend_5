import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  categoryText?: string;
  headlineText?: string;
}

export const LowerThird1: React.FC<Props> = ({
  categoryText = 'TEXT SPACE GOES HERE',
  headlineText = 'HEADLINE OR SAMPLE TEXT SPACE HERE',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // INTRO ANIMATIONS (Frames 0 -> 30)
  // -----------------------------------------------------------
  const bannerIntro = spring({
    frame,
    fps,
    config: { stiffness: 30, damping: 20 },
  });

  const badgeIntro = spring({
    frame: frame - 6,
    fps,
    config: { stiffness: 40, damping: 18 },
  });

  const lineIntro = spring({
    frame: frame - 10,
    fps,
    config: { stiffness: 35, damping: 22 },
  });

  // -----------------------------------------------------------
  // OUTRO ANIMATIONS (Last 30 frames)
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 30;

  const bannerOutro = spring({
    frame: frame - outroStartFrame,
    fps,
    config: { stiffness: 35, damping: 22 },
  });

  const badgeOutro = spring({
    frame: frame - (outroStartFrame + 4),
    fps,
    config: { stiffness: 45, damping: 20 },
  });

  const lineOutro = spring({
    frame: frame - (outroStartFrame + 8),
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  // -----------------------------------------------------------
  // INTERPOLATED POSITIONS (Combine Intro + Outro)
  // -----------------------------------------------------------
  // 1. Banner X Position (-900px -> 0px -> -1100px)
  const bannerXIntro = interpolate(bannerIntro, [0, 1], [-900, 0]);
  const bannerXOutro = interpolate(bannerOutro, [0, 1], [0, -1100]);
  const bannerTranslateX = frame >= outroStartFrame ? bannerXOutro : bannerXIntro;

  // 2. Badge Y Position & Opacity
  const badgeYIntro = interpolate(badgeIntro, [0, 1], [40, 0]);
  const badgeYOutro = interpolate(badgeOutro, [0, 1], [0, 40]);
  const badgeTranslateY = frame >= outroStartFrame ? badgeYOutro : badgeYIntro;

  const badgeOpacityIntro = interpolate(badgeIntro, [0, 0.2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const badgeOpacityOutro = interpolate(badgeOutro, [0, 0.8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const badgeOpacity = frame >= outroStartFrame ? badgeOpacityOutro : badgeOpacityIntro;

  // 3. Bottom Accent Line Width Scale (0 -> 1 -> 0)
  const lineScaleIntro = interpolate(lineIntro, [0, 1], [0, 1]);
  const lineScaleOutro = interpolate(lineOutro, [0, 1], [1, 0]);
  const lineScaleX = frame >= outroStartFrame ? lineScaleOutro : lineScaleIntro;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        fontFamily: 'Impact, Arial Black, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {/* Top Category Badge */}
        <div
          style={{
            transform: `translateY(${badgeTranslateY}px)`,
            opacity: badgeOpacity,
            backgroundColor: '#E0E0E0',
            clipPath: 'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)',
            padding: '8px 30px 8px 35px',
            marginLeft: 40,
            marginBottom: -2,
            zIndex: 1,
          }}
        >
          <span
            style={{
              color: '#111111',
              fontSize: 22,
              fontWeight: 700,
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.5px',
            }}
          >
            {categoryText}
          </span>
        </div>

        {/* Main Banner */}
        <div
          style={{
            transform: `translateX(${bannerTranslateX}px)`,
            backgroundColor: '#00897B',
            clipPath: 'polygon(25px 0%, 100% 0%, calc(100% - 25px) 100%, 0% 100%)',
            padding: '16px 60px 16px 50px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 42,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginRight: 40,
              whiteSpace: 'nowrap',
            }}
          >
            {headlineText}
          </span>
          <div style={{ display: 'flex', gap: 8, height: 48, alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: '100%',
                  backgroundColor: '#FFFFFF',
                  transform: 'skewX(-25deg)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div
          style={{
            marginTop: 8,
            marginLeft: 260,
            width: 450,
            height: 6,
            backgroundColor: '#00897B',
            transform: `scaleX(${lineScaleX})`,
            transformOrigin: 'left center',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};