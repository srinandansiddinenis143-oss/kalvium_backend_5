import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface DataPoint {
  label: string;
  value: number; // Scale 0 to 70
  color: string;
}

// 6 distinct vibrant colors for each chart bar
const DATA: DataPoint[] = [
  { label: 'Jan', value: 44, color: '#FF5722' }, // Deep Orange
  { label: 'Feb', value: 65, color: '#00BCD4' }, // Cyan
  { label: 'Mar', value: 35, color: '#8BC34A' }, // Light Green
  { label: 'Apr', value: 42, color: '#9C27B0' }, // Purple
  { label: 'May', value: 35, color: '#FFC107' }, // Amber
  { label: 'Jun', value: 23, color: '#E91E63' }, // Pink
];

export const TriangleChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Canvas Dimensions
  const width = 1000;
  const height = 550;

  // Margin spacing
  const padding = { top: 60, right: 60, bottom: 90, left: 120 };

  // Inner graph area dimensions
  const yAxisX = padding.left;
  const xAxisY = height - padding.bottom;
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxValue = 70;
  const gridTicks = [10, 20, 30, 40, 50, 60];

  const getY = (val: number) => xAxisY - (val / maxValue) * graphHeight;

  // Triangle spacing & sizing
  const triangleBaseWidth = 150;
  const startX = yAxisX + triangleBaseWidth / 2 + 10;
  const endX = width - padding.right - triangleBaseWidth / 2;
  const stepX = (endX - startX) / (DATA.length - 1);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF', // Pure White Background
        fontFamily: 'sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Horizontal Gridlines & Y-Axis Labels */}
        {gridTicks.map((tick) => {
          const yPos = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={yAxisX}
                y1={yPos}
                x2={width - padding.right}
                y2={yPos}
                stroke="#E0E0E0" // Subtle light grey line
                strokeWidth={1.5}
              />
              <text
                x={yAxisX - 18}
                y={yPos + 5}
                fill="#666666" // Dark grey numbers
                fontSize={16}
                fontWeight="600"
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Animated Distinct-Color Triangles */}
        {DATA.map((item, index) => {
          const delay = index * 5;

          const progress = spring({
            frame: frame - delay,
            fps,
            config: {
              damping: 14,
              stiffness: 100,
              mass: 0.8,
            },
          });

          const animatedValue = interpolate(progress, [0, 1], [0, item.value]);

          const centerX = startX + index * stepX;
          const topY = getY(animatedValue);
          const leftX = centerX - triangleBaseWidth / 2;
          const rightX = centerX + triangleBaseWidth / 2;

          const rounding = Math.min(16, (xAxisY - topY) * 0.2);

          const pathD = `
            M ${leftX} ${xAxisY}
            L ${centerX - rounding * 0.6} ${topY + rounding}
            Q ${centerX} ${topY} ${centerX + rounding * 0.6} ${topY + rounding}
            L ${rightX} ${xAxisY}
            Z
          `;

          return (
            <g key={index}>
              <path d={pathD} fill={item.color} opacity={0.92} />
              <text
                x={centerX}
                y={xAxisY + 35}
                fill="#222222" // Dark label text
                fontSize={16}
                fontWeight="bold"
                textAnchor="middle"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* Y-Axis Line */}
        <line
          x1={yAxisX}
          y1={padding.top - 10}
          x2={yAxisX}
          y2={xAxisY}
          stroke="#333333"
          strokeWidth={2}
        />

        {/* X-Axis Baseline */}
        <line
          x1={yAxisX}
          y1={xAxisY}
          x2={width - padding.right}
          y2={xAxisY}
          stroke="#333333"
          strokeWidth={2}
        />
      </svg>
    </AbsoluteFill>
  );
};