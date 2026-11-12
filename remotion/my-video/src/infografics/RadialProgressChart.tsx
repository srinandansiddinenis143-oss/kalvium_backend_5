import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// =========================================================================
// 1. EASY POSITION & SIZE CONTROLS
// =========================================================================
const CHART_SIZE = 500;       // Diameter of the ring chart in pixels
const CHART_TOP = '50%';      // Screen position ('50%' = centered vertically)
const CHART_LEFT = '50%';     // Screen position ('50%' = centered horizontally)
const STROKE_WIDTH = 18;      // Thickness of each concentric ring
const RING_GAP = 10;          // Spacing between concentric rings

interface RadialItem {
  id: string;
  name: string;               // Category name shown in the side legend
  value: number;              // Percentage (0 - 100)
  color: string;
}

const RADIAL_DATA: RadialItem[] = [
  { id: 'teal', name: 'Teal Category', value: 68, color: '#00a896' },
  { id: 'pink', name: 'Pink Category', value: 45, color: '#e63956' },
  { id: 'orange', name: 'Orange Category', value: 35, color: '#f4a261' },
  { id: 'purple', name: 'Purple Category', value: 15, color: '#8e44ad' },
];

export const RadialProgressChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale pop-in animation for overall component
  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const center = CHART_SIZE / 2;
  const outerRadius = CHART_SIZE / 2 - STROKE_WIDTH;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f4f6f8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Position Container (Radial Rings + Side Legend) */}
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
        {/* Concentric Radial SVG Chart */}
        <div style={{ position: 'relative', width: CHART_SIZE, height: CHART_SIZE }}>
          <svg
            width={CHART_SIZE}
            height={CHART_SIZE}
            viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
            style={{
              transform: 'rotate(-90deg)', // Start rings at top (12 o'clock)
              overflow: 'visible',
            }}
          >
            {RADIAL_DATA.map((item, index) => {
              // Calculate radius for each concentric ring from outer to inner
              const currentRadius = outerRadius - index * (STROKE_WIDTH + RING_GAP);
              const circumference = 2 * Math.PI * currentRadius;

              // Staggered ring drawing animation
              const ringAnimation = spring({
                frame: frame - index * 5,
                fps,
                config: { damping: 16, stiffness: 85 },
              });

              const activePercent = interpolate(
                ringAnimation,
                [0, 1],
                [0, item.value],
                { extrapolateRight: 'clamp' }
              );

              const strokeDashoffset =
                circumference - (activePercent / 100) * circumference;

              return (
                <g key={item.id}>
                  {/* Background Track Ring (Faint Grey) */}
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
                    stroke={item.color}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Title / Label */}
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
                fontWeight: 900,
                color: '#334155',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              SEDDIAM
            </span>
          </div>
        </div>

        {/* Side Color Legend Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            backgroundColor: '#ffffff',
            padding: '30px 36px',
            borderRadius: 24,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
          }}
        >
          {RADIAL_DATA.map((item, index) => {
            const legendAnimation = spring({
              frame: frame - index * 5 - 6,
              fps,
              config: { damping: 14, stiffness: 90 },
            });

            return (
              <div
                key={`legend-${item.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: legendAnimation,
                  transform: `translateX(${interpolate(legendAnimation, [0, 1], [-20, 0])}px)`,
                }}
              >
                {/* Color Dot */}
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                  }}
                />

                {/* Category Name */}
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#475569',
                    minWidth: 160,
                  }}
                >
                  {item.name}
                </span>

                {/* Percentage */}
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: item.color,
                  }}
                >
                  {item.value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default RadialProgressChart;