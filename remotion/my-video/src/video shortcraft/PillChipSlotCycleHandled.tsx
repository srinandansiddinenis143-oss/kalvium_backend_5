import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';

// Glossary items with emoji and text
const SLOTS = [
  { emoji: '🎬', label: 'Shots' },
  { emoji: '📷', label: 'Camera' },
  { emoji: '🔊', label: 'Sound' },
  { emoji: '✨', label: 'Renders' },
];

// Fallback width calculations based on character length * ~13px + 74px padding
// In a full DOM environment, offsetWidth with webfont readiness is used.
const FALLBACK_WIDTHS = SLOTS.map((s) => s.label.length * 13 + 74);

export const PillChipSlotCycleHandled: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Normalized progress [0, 1] over 150 frames (5 seconds)
  const progress = frame / durationInFrames;

  // Switch points: [0.25, 0.47, 0.69] with window 0.12 (≈18f)
  // We compute the continuous position value 'pos' accumulated across segments
  const getPos = (p: number) => {
    const windows = [
      { start: 0.25, end: 0.25 + 0.12, target: 1 },
      { start: 0.47, end: 0.47 + 0.12, target: 2 },
      { start: 0.69, end: 0.69 + 0.12, target: 3 },
    ];

    let currentPos = 0;
    for (let i = 0; i < windows.length; i++) {
      const w = windows[i];
      if (p >= w.start) {
        if (p < w.end) {
          const localProgress = (p - w.start) / (w.end - w.start);
          const eased = Easing.inOut(Easing.cubic)(localProgress);
          currentPos = i + eased;
        } else {
          currentPos = i + 1;
        }
      }
    }
    return currentPos;
  };

  const pos = getPos(progress);
  const ci = Math.floor(pos);
  const frac = pos - ci;

  // Intra-frame interpolation for capsule width
  const currentCi = Math.min(ci, SLOTS.length - 1);
  const nextCi = Math.min(ci + 1, SLOTS.length - 1);
  const currentWidth = FALLBACK_WIDTHS[currentCi];
  const nextWidth = FALLBACK_WIDTHS[nextCi];
  const capsuleWidth = interpolate(frac, [0, 1], [currentWidth, nextWidth], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Inner column vertical offset (row height = 48px)
  const colInTranslateY = -pos * 48;

  // Ghost item calculations
  const near = Math.round(pos);
  const ghostParallax = (pos - near) * 48 * 0.5; // Half-speed parallax
  const settle = 1 - Math.min(1, Math.abs(pos - near) * 3);
  const ghostOpacity = 0.13 * (0.4 + settle * 0.6);

  // Neighbors for ghost items
  const topNeighborIdx = Math.max(0, currentCi - 1);
  const bottomNeighborIdx = Math.min(SLOTS.length - 1, currentCi + 1);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#fbfbfd',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        scale: 1.596
      }}
    >
      {/* Main Container Wrapper */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '0 40px',
        }}
      >
        {/* Left Sentence Part */}
        <div
          style={{
            flex: 'none',
            fontSize: '30px',
            fontWeight: 800,
            color: '#15171d',
            letterSpacing: '-0.02em',
          }}
        >
          We'll handle
        </div>

        {/* Adaptive Capsule Chip Slot */}
        <div
          style={{
            flex: 'none',
            width: `${capsuleWidth}px`,
            height: '48px',
            backgroundColor: '#1a1c24',
            borderRadius: '99px',
            boxShadow: '0 8px 24px rgba(20,22,40,0.22)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.05s linear',
          }}
        >
          {/* Top Ghost Item Preview */}
          {currentCi > 0 && (
            <div
              style={{
                position: 'absolute',
                top: `${-38 + ghostParallax}px`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: ghostOpacity,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '16px' }}>{SLOTS[topNeighborIdx].emoji}</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>
                {SLOTS[topNeighborIdx].label}
              </span>
            </div>
          )}

          {/* Scrolling Inner Column */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: `${SLOTS.length * 48}px`,
              transform: `translateY(${colInTranslateY}px)`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {SLOTS.map((slot, index) => (
              <div
                key={index}
                style={{
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '0 24px',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontSize: '18px', flex: 'none' }}>{slot.emoji}</span>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    flex: 'none',
                  }}
                >
                  {slot.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Ghost Item Preview */}
          {currentCi < SLOTS.length - 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: `${-58 - ghostParallax}px`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: ghostOpacity,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '16px' }}>{SLOTS[bottomNeighborIdx].emoji}</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>
                {SLOTS[bottomNeighborIdx].label}
              </span>
            </div>
          )}
        </div>

        {/* Right Sentence Part */}
        <div
          style={{
            flex: 'none',
            fontSize: '30px',
            fontWeight: 800,
            color: '#15171d',
            letterSpacing: '-0.02em',
          }}
        >
          for your brand video.
        </div>
      </div>
    </AbsoluteFill>
  );
};