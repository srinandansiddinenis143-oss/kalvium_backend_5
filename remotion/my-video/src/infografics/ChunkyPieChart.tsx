import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface SliceData {
  id: string;
  label?: string;
  value: number;
  color: string;
  textColor?: string;
}

const CHART_DATA: SliceData[] = [
  { id: 'pink', label: 'Pink', value: 64, color: '#ff2a5f', textColor: '#ffffff' },
  { id: 'dark', label: 'Dark', value: 18, color: '#2a3331', textColor: '#ffffff' },
  { id: 'yellow', label: 'Yellow', value: 5, color: '#eeb03b', textColor: '#2a3331' },
  { id: 'blue', label: 'Blue', value: 3, color: '#4ac8cc', textColor: '#2a3331' },
  { id: 'white', label: 'White', value: 10, color: '#f3e9dc', textColor: '#2a3331' },
];

// --- STYLING CONSTANTS ---
const IN_RING_FONT_SIZE = 40;     // Font size for labels inside large slices
const CALLOUT_FONT_SIZE = 40;     // Font size for outer callout labels
const KNEE_OFFSET = 40;           // Distance from ring edge to the line elbow
const TAIL_LENGTH = 60;           // Length of the horizontal extension line
const TEXT_OFFSET_X = 30;          // Gap between horizontal line end and text

export const ChunkyPieChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const size = 900;
  const center = size / 2;
  const strokeWidth = 130;
  const radius = (size - strokeWidth - 140) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#e6e8e6',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
      durationInFrames={111}
    >
      <div style={{ transform: `scale(${entryProgress})`, position: 'relative' }}>
        {/* Main Chart Rings */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            transform: 'rotate(-90deg)',
            filter: 'drop-shadow(0px 12px 16px rgba(0, 0, 0, 0.15))',
            overflow: 'visible',
          }}
        >
          {CHART_DATA.map((slice, index) => {
            const startPercent = accumulatedPercent;
            const targetPercent = slice.value;
            accumulatedPercent += targetPercent;

            const delay = index * 4;
            const sliceAnimation = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 85 },
            });

            const gapShrink = 2;
            const activePercent = interpolate(
              sliceAnimation,
              [0, 1],
              [0, Math.max(0, targetPercent - gapShrink)],
              { extrapolateRight: 'clamp' }
            );

            const strokeDashOffset = circumference - (activePercent / 100) * circumference;
            const rotationOffset = (startPercent / 100) * 360;

            return (
              <circle
                key={slice.id}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashOffset}
                strokeLinecap="round"
                style={{
                  transformOrigin: 'center',
                  transform: `rotate(${rotationOffset}deg)`,
                }}
              />
            );
          })}
        </svg>

        {/* Clean Labels & Callout Lines Overlay */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            overflow: 'visible', // Fixes left-side text clipping off canvas
          }}
        >
          {(() => {
            let currentPercent = 0;
            return CHART_DATA.map((slice, index) => {
              const startPercent = currentPercent;
              const midPercent = startPercent + slice.value / 2;
              currentPercent += slice.value;

              const labelDelay = index * 4 + 8;
              const opacity = interpolate(frame - labelDelay, [0, 10], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              // Angle calculations
              const midAngleRad = ((midPercent / 100) * 360 - 90) * (Math.PI / 180);

              // Center point on the slice bar
              const barX = center + radius * Math.cos(midAngleRad);
              const barY = center + radius * Math.sin(midAngleRad);

              // Large slices (> 8%) get labels directly inside the ring
              if (slice.value > 8) {
                return (
                  <text
                    key={slice.id}
                    x={barX}
                    y={barY}
                    fill={slice.textColor || '#ffffff'}
                    fontSize={IN_RING_FONT_SIZE}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    opacity={opacity}
                  >
                    {slice.value}%
                  </text>
                );
              }

              // Small slices (<= 8%) get outer elbow callout pointers
              const isRightSide = Math.cos(midAngleRad) >= 0;
              const outerRingRadius = radius + strokeWidth / 2 + 4;

              const lineStartX = center + outerRingRadius * Math.cos(midAngleRad);
              const lineStartY = center + outerRingRadius * Math.sin(midAngleRad);

              const kneeX = center + (outerRingRadius + KNEE_OFFSET) * Math.cos(midAngleRad);
              const kneeY = center + (outerRingRadius + KNEE_OFFSET) * Math.sin(midAngleRad);

              const endX = isRightSide ? kneeX + TAIL_LENGTH : kneeX - TAIL_LENGTH;
              const sliceName = slice.label || slice.id;

              return (
                <g key={slice.id} opacity={opacity}>
                  {/* Pointer Line */}
                  <polyline
                    points={`${lineStartX},${lineStartY} ${kneeX},${kneeY} ${endX},${kneeY}`}
                    fill="none"
                    stroke="#2a3331"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Category Name & Percentage Text */}
                  <text
                    x={endX + (isRightSide ? TEXT_OFFSET_X : -TEXT_OFFSET_X)}
                    y={kneeY}
                    fill="#2a3331"
                    fontSize={CALLOUT_FONT_SIZE}
                    fontWeight="bold"
                    textAnchor={isRightSide ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {`${sliceName}: ${slice.value}%`}
                  </text>
                </g>
              );
            });
          })()}
        </svg>
      </div>
    </AbsoluteFill>
  );
};