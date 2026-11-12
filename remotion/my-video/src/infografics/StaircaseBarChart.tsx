import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface BarData {
  label: string; // X-axis label (10, 20, ..., 100)
  value: number; // Y-axis target (1 to 10)
  color: string;
}

const DATA: BarData[] = [
  { label: '10', value: 1, color: '#6C8EBF' },  // Soft Blue
  { label: '20', value: 2, color: '#5CA6C4' },  // Teal Blue
  { label: '30', value: 3, color: '#52BEA6' },  // Cyan Green
  { label: '40', value: 4, color: '#57C07B' },  // Emerald
  { label: '50', value: 5, color: '#5DBE59' },  // Green
  { label: '60', value: 6, color: '#88C442' },  // Light Green
  { label: '70', value: 7, color: '#BCCF37' },  // Lime
  { label: '80', value: 8, color: '#E5C033' },  // Yellow Gold
  { label: '90', value: 9, color: '#E87D30' },  // Orange
  { label: '100', value: 10, color: '#EE2C2C' }, // Red
];

export const StaircaseBarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Canvas Dimensions
  const width = 1100;
  const height = 600;
  const padding = { top: 60, right: 80, bottom: 90, left: 100 };

  const xAxisY = height - padding.bottom;
  const yAxisX = padding.left;
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxValue = 10;
  const getY = (val: number) => xAxisY - (val / maxValue) * graphHeight;

  const barWidth = 62;
  const stepX = graphWidth / DATA.length;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        fontFamily: 'sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Y-Axis Scale Numbers (10 down to 1) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const val = 10 - i;
          const yPos = getY(val);
          return (
            <text
              key={val}
              x={yAxisX - 30}
              y={yPos + 8}
              fill="#222222"
              fontSize={28}
              fontWeight="600"
              textAnchor="end"
            >
              {val}
            </text>
          );
        })}

        {/* Staircase Bars */}
        {DATA.map((item, index) => {
          // Sequential delay left-to-right
          const delay = index * 3;

          const barSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 110, mass: 0.8 },
          });

          const currentHeight = interpolate(
            barSpring,
            [0, 1],
            [0, (item.value / maxValue) * graphHeight]
          );

          const centerX = yAxisX + index * stepX + stepX / 2;
          const barX = centerX - barWidth / 2;
          const barY = xAxisY - currentHeight;

          return (
            <g key={index}>
              {/* Solid Filled Bar with Subtle Dark Outline */}
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={currentHeight}
                fill={item.color}
                stroke="rgba(0, 0, 0, 0.25)"
                strokeWidth={1}
              />

              {/* X-Axis Number Label */}
              <text
                x={centerX}
                y={xAxisY + 40}
                fill="#222222"
                fontSize={24}
                fontWeight="500"
                textAnchor="middle"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* Base Floor Line */}
        <line
          x1={yAxisX - 10}
          y1={xAxisY}
          x2={width - padding.right + 20}
          y2={xAxisY}
          stroke="#333333"
          strokeWidth={2}
        />
      </svg>
    </AbsoluteFill>
  );
};