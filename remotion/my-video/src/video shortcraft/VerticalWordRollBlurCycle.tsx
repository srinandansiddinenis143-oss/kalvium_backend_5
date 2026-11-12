import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';

// Vocabulary for the vertical word scroll wheel
const WORDS = ['Launches', 'Demos', 'Promos', 'Every Shot'];

export const VerticalWordRollBlurCycle: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Normalized progress [0, 1] over 150 frames (approx 5.0s)
  const progress = frame / durationInFrames;

  // Segment steps and window sizes
  // STEPS = [0.16, 0.36, 0.56], window segment = 0.11
  const getP = (p: number) => {
    const windows = [
      { start: 0.16, end: 0.16 + 0.11 },
      { start: 0.36, end: 0.36 + 0.11 },
      { start: 0.56, end: 0.56 + 0.11 },
    ];

    let accumulatedPos = 0;
    for (let i = 0; i < windows.length; i++) {
      const w = windows[i];
      if (p >= w.start) {
        if (p < w.end) {
          const localProgress = (p - w.start) / (w.end - w.start);
          // Blended easing: 0.7 * outQuint + 0.3 * outBack
          const quint = Easing.out(Easing.cubic)(localProgress); // approximation for outQuint or standard cubic/quint
          const back = 1 + 2.70158 * Math.pow(localProgress - 1, 3) + 1.70158 * Math.pow(localProgress - 1, 2); // outBack approximate
          const eased = 0.7 * quint + 0.3 * Math.min(1.2, Math.max(0, back));
          accumulatedPos = i + Math.min(1, Math.max(0, eased));
        } else {
          accumulatedPos = i + 1;
        }
      }
    }
    return accumulatedPos;
  };

  const p = getP(progress);
  const rowHeight = 44;

  // Fade-out of the entire sequence at the end seg(t, 0.9, 0.985)
  const fadeOut = interpolate(progress, [0.9, 0.985], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#fbfbfd',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        {/* Sentence Stem */}
        <div
          style={{
            fontSize: '30px',
            fontWeight: 800,
            color: '#15171d',
            letterSpacing: '-0.5px',
          }}
        >
          Crafted for
        </div>

        {/* Scroll Wheel Viewport / Mask (Height = rowHeight * 3 = 132px, Width = 190px) */}
        <div
          style={{
            width: '190px',
            height: `${rowHeight * 3}px`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Reel Container */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${rowHeight - p * rowHeight}px)`,
            }}
          >
            {WORDS.map((word, i) => {
              const d = Math.abs(i - p);

              // Blur calculation: 3d when d<1, else up to 5px max
              let blurVal = 0;
              if (d < 1) {
                blurVal = 3 * d;
              } else {
                blurVal = Math.min(5, 3 + 2 * (d - 1));
              }

              // Opacity calculation
              let rowOpacity = 1;
              if (d < 1) {
                rowOpacity = 1 - 0.65 * d;
              } else {
                rowOpacity = Math.max(0.1, 0.35 - 0.23 * (d - 1));
              }

              // Color calculation: accent color only appears when d is very small (settled)
              // ACCENT = #7c3aed, ACCENT_DIM = #9ca3af (gray)
              const colorMixFactor = Math.min(1, Math.max(0, 1 - 2.4 * d));
              const textColor = colorMixFactor > 0.5 ? '#7c3aed' : '#9ca3af';

              return (
                <div
                  key={i}
                  style={{
                    height: `${rowHeight}px`,
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    fontSize: '30px',
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    color: textColor,
                    opacity: rowOpacity,
                    filter: `blur(${blurVal}px)`,
                  }}
                >
                  {word}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};