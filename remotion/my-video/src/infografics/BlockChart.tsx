import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface ColumnData {
  label: string;
  count: number;
  color: string;
}

const DATA: ColumnData[] = [
  { label: 'Category A', count: 8, color: '#4A4A4A' }, // Dark Grey
  { label: 'Category B', count: 6, color: '#CDDC39' }, // Lime Green
  { label: 'Category C', count: 3, color: '#00BCD4' }, // Cyan Blue
  { label: 'Category D', count: 5, color: '#4A4A4A' }, // Dark Grey
  { label: 'Category E', count: 8, color: '#00BCD4' }, // Cyan Blue
  { label: 'Category F', count: 6, color: '#CDDC39' }, // Lime Green
  { label: 'Category G', count: 6, color: '#00BCD4' }, // Cyan Blue
  { label: 'Category H', count: 3, color: '#4A4A4A' }, // Dark Grey
];

export const BlockChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dimensions & Layout Spacing
  const blockSize = 36;
  const blockGap = 5;
  const columnGap = 55; // Increased gap to prevent crowding
  const maxBlocks = 8;

  const width = 1100;
  const height = 600;
  const padding = { top: 60, right: 60, bottom: 130, left: 100 };

  const xAxisY = height - padding.bottom;
  const yAxisX = padding.left;

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
        {/* Horizontal Gridlines */}
        {Array.from({ length: maxBlocks }).map((_, i) => {
          const yPos = xAxisY - (i + 1) * (blockSize + blockGap) + blockGap / 2;
          return (
            <line
              key={i}
              x1={yAxisX - 10}
              y1={yPos}
              x2={width - padding.right}
              y2={yPos}
              stroke="#F0F0F0"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Columns of Stacked Blocks */}
        {DATA.map((col, colIndex) => {
          const colX = yAxisX + 25 + colIndex * (blockSize + columnGap);

          return (
            <g key={colIndex}>
              {/* Stacked Individual Blocks */}
              {Array.from({ length: col.count }).map((_, blockIndex) => {
                const delay = colIndex * 4 + blockIndex * 2;

                const blockSpring = spring({
                  frame: frame - delay,
                  fps,
                  config: { damping: 13, stiffness: 120, mass: 0.6 },
                });

                const scale = interpolate(blockSpring, [0, 1], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });

                const translateY = interpolate(blockSpring, [0, 1], [-40, 0]);

                const blockY =
                  xAxisY - (blockIndex + 1) * (blockSize + blockGap);

                return (
                  <rect
                    key={blockIndex}
                    x={colX}
                    y={blockY}
                    width={blockSize}
                    height={blockSize}
                    rx={5}
                    ry={5}
                    fill={col.color}
                    opacity={scale}
                    transform={`translate(0, ${translateY})`}
                    style={{
                      transformOrigin: `${colX + blockSize / 2}px ${blockY + blockSize / 2}px`,
                    }}
                  />
                );
              })}

              {/* Rotated Non-Overlapping Label */}
              <g transform={`translate(${colX + blockSize / 2}, ${xAxisY + 20})`}>
                <text
                  transform="rotate(-35)"
                  fill="#333333"
                  fontSize={14}
                  fontWeight="bold"
                  textAnchor="end"
                >
                  {col.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* Y-Axis Line */}
        <line
          x1={yAxisX}
          y1={padding.top}
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