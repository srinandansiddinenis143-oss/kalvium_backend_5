import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface Props {
  headlineText?: string;
  subText?: string;
}

export const LowerThird2: React.FC<Props> = ({
  headlineText = 'HEADLINE',
  subText = 'Lorem Ipsum Dolor Sit Amet',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // INTRO ANIMATIONS (Frames 0 -> 30)
  // -----------------------------------------------------------
  const mainBarIntro = spring({
    frame,
    fps,
    config: { stiffness: 30, damping: 20 },
  });

  const headlineIntro = spring({
    frame: frame - 4,
    fps,
    config: { stiffness: 35, damping: 20 },
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

  const mainBarOutro = spring({
    frame: frame - outroStartFrame,
    fps,
    config: { stiffness: 35, damping: 22 },
  });

  const headlineOutro = spring({
    frame: frame - (outroStartFrame + 3),
    fps,
    config: { stiffness: 40, damping: 20 },
  });

  const lineOutro = spring({
    frame: frame - (outroStartFrame + 6),
    fps,
    config: { stiffness: 40, damping: 22 },
  });

  // -----------------------------------------------------------
  // INTERPOLATED POSITIONS
  // -----------------------------------------------------------
  const barXIntro = interpolate(mainBarIntro, [0, 1], [-1000, 0]);
  const barXOutro = interpolate(mainBarOutro, [0, 1], [0, -1100]);
  const barTranslateX = frame >= outroStartFrame ? barXOutro : barXIntro;

  const headXIntro = interpolate(headlineIntro, [0, 1], [-400, 0]);
  const headXOutro = interpolate(headlineOutro, [0, 1], [0, -500]);
  const headlineTranslateX = frame >= outroStartFrame ? headXOutro : headXIntro;

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
          bottom: 120,
          left: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {/* Main Graphic Layering Container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* 1. Long Grey Background Text Bar */}
          <div
            style={{
              transform: `translateX(${barTranslateX}px)`,
              backgroundColor: '#ECECEC',
              clipPath:
                'polygon(25px 0%, 100% 0%, calc(100% - 25px) 100%, 0% 100%)',
              padding: '16px 65px 16px 360px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: '#111111',
                fontSize: 32,
                fontFamily: 'Arial, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
              }}
            >
              {subText}
            </span>
          </div>

          {/* 2. Overlapping Teal Headline Block */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: -6,
              transform: `translateX(${headlineTranslateX}px)`,
              backgroundColor: '#00897B',
              clipPath:
                'polygon(25px 0%, 100% 0%, calc(100% - 25px) 100%, 0% 100%)',
              padding: '18px 35px 18px 45px',
              display: 'flex',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                fontSize: 42,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginRight: 25,
                whiteSpace: 'nowrap',
              }}
            >
              {headlineText}
            </span>

            {/* 3 Diagonal White Stripes */}
            <div
              style={{
                display: 'flex',
                gap: 7,
                height: 42,
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    transform: 'skewX(-25deg)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3. Bottom Teal Line with Clear Spacing Gap */}
        <div
          style={{
            marginTop: 10, // Increased gap below the main bar
            marginLeft: 290, // Positioned under the grey bar area
            width: 460,
            height: 6,
            backgroundColor: '#00897B',
            clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
            transform: `scaleX(${lineScaleX})`,
            transformOrigin: 'left center',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};