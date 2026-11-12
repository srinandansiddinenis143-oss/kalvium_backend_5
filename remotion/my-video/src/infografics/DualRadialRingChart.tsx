import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// =========================================================================
// 1. POSITION & SIZE CONTROLS
// =========================================================================
const CHART_SIZE = 500;       // Total diameter of the ring chart in pixels
const CHART_TOP = '50%';      // Vertical screen position ('50%' = centered)
const CHART_LEFT = '50%';     // Horizontal screen position ('50%' = centered)

const STROKE_WIDTH = 16;      // Ring stroke thickness
const RING_GAP = 16;          // Spacing between outer and inner ring

interface RingData {
  id: string;
  name: string;               // Category name shown in the RIGHT SIDE legend
  label: string;              // Percentage displayed OUTSIDE the bar tip
  value: number;              // Percentage value (0-100)
  color: string;
}

const RING_DATA: RingData[] = [
  { id: 'outer', name: 'TARGET A', label: '78%', value: 78, color: '#00a896' },
  { id: 'inner', name: 'TARGET B', label: '45%', value: 45, color: '#f4a261' },
];

export const DualRadialRingChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Heavy scale entrance spring animation
  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 20, mass: 2.2, stiffness: 40 },
  });

  const center = CHART_SIZE / 2;
  const outerRadius = CHART_SIZE / 2 - 40;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f4f6f8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Position Container (Radial Chart + Right Side Legend Card) */}
      <div
        style={{
          position: 'absolute',
          top: CHART_TOP,
          left: CHART_LEFT,
          transform: `translate(-50%, -50%) scale(${entryProgress})`,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 60,
        }}
      >
        {/* Concentric Radial SVG Chart Viewport */}
        <div style={{ position: 'relative', width: CHART_SIZE, height: CHART_SIZE }}>
          <svg
            width={CHART_SIZE}
            height={CHART_SIZE}
            viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
            style={{
              transform: 'rotate(-90deg)', // Start arcs at top (12 o'clock)
              overflow: 'visible',
            }}
          >
            {RING_DATA.map((ring, index) => {
              const currentRadius = outerRadius - index * (STROKE_WIDTH + RING_GAP);
              const circumference = 2 * Math.PI * currentRadius;

              // Heavy spring progress with high latency
              const ringDelay = index * 18 + 10;
              const rawProgress = spring({
                frame: frame - ringDelay,
                fps,
                config: { damping: 28, mass: 2.8, stiffness: 35 },
              });

              const easedProgress = interpolate(
                rawProgress,
                [0, 1],
                [0, 1],
                {
                  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }
              );

              const activePercent = easedProgress * ring.value;
              const strokeDashoffset =
                circumference - (activePercent / 100) * circumference;

              return (
                <g key={ring.id}>
                  {/* Background Track Ring */}
                  <circle
                    cx={center}
                    cy={center}
                    r={currentRadius}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={STROKE_WIDTH}
                  />

                  {/* Animated Color Progress Ring */}
                  <circle
                    cx={center}
                    cy={center}
                    r={currentRadius}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {/* Dynamic Percentage Labels floating OUTSIDE the tip of each bar */}
          {RING_DATA.map((ring, index) => {
            const currentRadius = outerRadius - index * (STROKE_WIDTH + RING_GAP);

            const ringDelay = index * 18 + 10;
            const rawProgress = spring({
              frame: frame - ringDelay,
              fps,
              config: { damping: 28, mass: 2.8, stiffness: 35 },
            });

            const easedProgress = interpolate(
              rawProgress,
              [0, 1],
              [0, 1],
              {
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }
            );

            const activePercent = easedProgress * ring.value;
            const angleRad = ((activePercent / 100) * 360 - 90) * (Math.PI / 180);

            // Position text OUTSIDE: Outer ring label shifts outward (+32px), inner ring shifts inward (-28px)
            const textOffsetRadius =
              index === 0 ? currentRadius + 32 : currentRadius - 28;

            const percentX = center + textOffsetRadius * Math.cos(angleRad);
            const percentY = center + textOffsetRadius * Math.sin(angleRad);

            return (
              <div
                key={`label-${ring.id}`}
                style={{
                  position: 'absolute',
                  left: percentX,
                  top: percentY,
                  transform: `translate(-50%, -50%) scale(${easedProgress})`,
                  opacity: easedProgress,
                  fontSize: 22,
                  fontWeight: 800,
                  color: ring.color,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {ring.label}
              </div>
            );
          })}

          {/* Unobstructed Open Center Core */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: '#334155',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              DOLOR SIT
            </span>
          </div>
        </div>

        {/* RIGHT SIDE COLOR LEGEND CARD */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            backgroundColor: '#ffffff',
            padding: '24px 32px',
            borderRadius: 20,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
          }}
        >
          {RING_DATA.map((ring, index) => {
            const legendAnimation = spring({
              frame: frame - index * 12 - 8,
              fps,
              config: { damping: 14, stiffness: 90 },
            });

            return (
              <div
                key={`legend-${ring.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  opacity: legendAnimation,
                  transform: `translateX(${interpolate(legendAnimation, [0, 1], [-15, 0])}px)`,
                }}
              >
                {/* Color Badge */}
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    backgroundColor: ring.color,
                  }}
                />

                {/* Category Name */}
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#334155',
                    letterSpacing: '0.5px',
                    minWidth: 120,
                  }}
                >
                  {ring.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default DualRadialRingChart;