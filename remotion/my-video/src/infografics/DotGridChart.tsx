import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// 10x10 matrix dot categories (100 total dots = 100%)
// Lime Green = #C0CA33, Magenta/Pink = #C2185B, Cyan/Teal = #26C6DA
const GRID_DATA: string[][] = [
  ['lime', 'lime', 'lime', 'lime', 'lime', 'lime', 'lime', 'lime', 'lime', 'lime'],
  ['lime', 'lime', 'lime', 'lime', 'pink', 'lime', 'lime', 'lime', 'pink', 'lime'],
  ['lime', 'pink', 'lime', 'pink', 'cyan', 'pink', 'lime', 'pink', 'cyan', 'pink'],
  ['pink', 'cyan', 'pink', 'cyan', 'cyan', 'cyan', 'pink', 'cyan', 'cyan', 'cyan'],
  ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'],
  ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'],
  ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'],
  ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'],
  ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'],
];

const COLOR_MAP: Record<string, string> = {
  lime: '#C0CA33',
  pink: '#C2185B',
  cyan: '#26C6DA',
};

export const DotGridChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Layout calculations
  const cols = 10;
  const rows = GRID_DATA.length;
  const dotSize = 28;
  const dotGap = 12;

  const width = 800;
  const height = 650;
  const gridWidth = cols * (dotSize + dotGap) - dotGap;
  const gridHeight = rows * (dotSize + dotGap) - dotGap;

  const startX = (width - gridWidth) / 2;
  const startY = (height - gridHeight) / 2 - 20;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFDE7', // Warm off-white background matching the image
        fontFamily: 'sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* 10x10 Matrix of Animated Dots */}
        {GRID_DATA.map((row, rowIndex) =>
          row.map((catKey, colIndex) => {
            const index = rowIndex * cols + colIndex;
            // Delay builds dot-by-dot from top to bottom
            const delay = index * 1.5;

            const dotSpring = spring({
              frame: frame - delay,
              fps,
              config: {
                stiffness: 40,
                damping: 20,
              },
            });

            const scale = interpolate(dotSpring, [0, 1], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            const cx = startX + colIndex * (dotSize + dotGap) + dotSize / 2;
            const cy = startY + rowIndex * (dotSize + dotGap) + dotSize / 2;

            return (
              <circle
                key={`${rowIndex}-${colIndex}`}
                cx={cx}
                cy={cy}
                r={(dotSize / 2) * scale}
                fill={COLOR_MAP[catKey]}
              />
            );
          })
        )}

        {/* X-Axis Numbering (1 to 10) below grid */}
        {Array.from({ length: 10 }).map((_, colIndex) => {
          const cx = startX + colIndex * (dotSize + dotGap) + dotSize / 2;
          const labelY = startY + gridHeight + 35;
          const isPink = colIndex === 1 || colIndex === 3 || colIndex === 5 || colIndex === 7 || colIndex === 9;

          return (
            <text
              key={colIndex}
              x={cx}
              y={labelY}
              fill={isPink ? '#C2185B' : '#26C6DA'}
              fontSize={18}
              fontWeight="bold"
              textAnchor="middle"
            >
              {colIndex + 1}
            </text>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};