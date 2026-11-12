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
const CHART_SIZE = 500;       // Total diameter of the ring viewport in pixels
const CHART_TOP = '50%';      // Vertical screen position ('50%' = centered)
const CHART_LEFT = '50%';     // Horizontal screen position ('50%' = centered)

const TOTAL_DOTS = 36;        // Total dots forming a full 360-degree ring
const DOT_RADIUS = 7;         // Radius of each individual dot
const RING_GAP = 28;          // Gap between outer and inner dot rings

interface DottedRingData {
  id: string;
  name: string;               // Category name shown in the right legend
  value: number;              // Percentage (0 - 100)
  color: string;
  dimColor: string;           // Color of inactive/background dots
}

const DOTTED_DATA: DottedRingData[] = [
  {
    id: 'outer',
    name: 'Teal Metric',
    value: 78,
    color: '#00e5a3',
    dimColor: '#d9e6e4',
  },
  {
    id: 'inner',
    name: 'Purple Metric',
    value: 80,
    color: '#7b52ff',
    dimColor: '#eeedf4',
  },
];

export const DottedRadialChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Heavy entrance spring animation
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
        backgroundColor: '#fdfdff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Position Container Box */}
      <div
        style={{
          position: 'absolute',
          top: CHART_TOP,
          left: CHART_LEFT,
          transform: `translate(-50%, -50%) scale(${entryProgress})`,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 70,
        }}
      >
        {/* Dotted Radial Viewport */}
        <div style={{ position: 'relative', width: CHART_SIZE, height: CHART_SIZE }}>
          <svg
            width={CHART_SIZE}
            height={CHART_SIZE}
            viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
            style={{ overflow: 'visible' }}
          >
            {DOTTED_DATA.map((ring, ringIndex) => {
              const currentRadius = outerRadius - ringIndex * RING_GAP;
              const activeDotCount = Math.round((ring.value / 100) * TOTAL_DOTS);

              // Heavy spring animation progress for high latency fill
              const ringDelay = ringIndex * 16 + 10;
              const rawProgress = spring({
                frame: frame - ringDelay,
                fps,
                config: { damping: 26, mass: 2.5, stiffness: 35 },
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

              const currentActiveDots = easedProgress * activeDotCount;

              return (
                <g key={ring.id}>
                  {Array.from({ length: TOTAL_DOTS }).map((_, dotIndex) => {
                    // Polar angle starting from top 12 o'clock (-90deg)
                    const angleDeg = (dotIndex / TOTAL_DOTS) * 360 - 90;
                    const angleRad = angleDeg * (Math.PI / 180);

                    const cx = center + currentRadius * Math.cos(angleRad);
                    const cy = center + currentRadius * Math.sin(angleRad);

                    // Check if this specific dot is currently active/lit
                    const isActive = dotIndex < currentActiveDots;
                    const dotOpacity = isActive
                      ? Math.min(1, currentActiveDots - dotIndex)
                      : 1;

                    return (
                      <circle
                        key={`dot-${ring.id}-${dotIndex}`}
                        cx={cx}
                        cy={cy}
                        r={DOT_RADIUS}
                        fill={isActive ? ring.color : ring.dimColor}
                        opacity={isActive ? dotOpacity : 0.6}
                        style={{
                          transition: 'fill 0.1s ease',
                          filter: isActive ? `drop-shadow(0px 0px 6px ${ring.color})` : 'none',
                        }}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* Centered Stacked Percentage Display */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              pointerEvents: 'none',
            }}
          >
            {DOTTED_DATA.map((ring, ringIndex) => {
              const ringDelay = ringIndex * 16 + 10;
              const rawProgress = spring({
                frame: frame - ringDelay,
                fps,
                config: { damping: 26, mass: 2.5, stiffness: 35 },
              });

              const currentVal = Math.round(
                interpolate(rawProgress, [0, 1], [0, ring.value], {
                  extrapolateRight: 'clamp',
                })
              );

              return (
                <span
                  key={`center-val-${ring.id}`}
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    color: ring.color,
                    letterSpacing: '1px',
                    textShadow: `0px 0px 12px ${ring.color}66`,
                    lineHeight: 1,
                  }}
                >
                  {currentVal}%
                </span>
              );
            })}
          </div>
        </div>

        {/* Right Side Color Legend Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            backgroundColor: '#0d1527',
            padding: '24px 32px',
            borderRadius: 20,
            border: '1px solid #1e293b',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          }}
        >
          {DOTTED_DATA.map((ring, index) => {
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
                  gap: 16,
                  opacity: legendAnimation,
                  transform: `translateX(${interpolate(legendAnimation, [0, 1], [-15, 0])}px)`,
                }}
              >
                {/* Dot Indicator */}
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: ring.color,
                    boxShadow: `0 0 8px ${ring.color}`,
                  }}
                />

                {/* Category Name */}
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#e2e8f0',
                    letterSpacing: '0.5px',
                    minWidth: 130,
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

export default DottedRadialChart;