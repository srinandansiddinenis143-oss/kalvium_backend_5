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
  value: number; // Scale 0 to 100
}

const DATA: DataPoint[] = [
  { label: 'Jan', value: 0 },
  { label: 'Feb', value: 25 },
  { label: 'Mar', value: 75 },
  { label: 'Apr', value: 52 },
  { label: 'May', value: 65 },
  { label: 'Jun', value: 60 },
  { label: 'Jul', value: 82 },
  { label: 'Aug', value: 38 },
  { label: 'Sep', value: 64 },
  { label: 'Oct', value: 52 },
  { label: 'Nov', value: 92 },
  { label: 'Dec', value: 78 },
];

export const AreaChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Canvas Dimensions
  const width = 1000;
  const height = 600;
  const padding = { top: 60, right: 80, bottom: 90, left: 100 };

  const xAxisY = height - padding.bottom;
  const yAxisX = padding.left;
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxValue = 100;
  const getY = (val: number) => xAxisY - (val / maxValue) * graphHeight;
  const xStep = graphWidth / (DATA.length - 1);

  // 1. Calculate points
  const points = DATA.map((item, index) => ({
    x: yAxisX + index * xStep,
    y: getY(item.value),
  }));

  // 2. Build SVG Path String for Area Fill (Line points closed down to baseline)
  const linePathD = points.reduce((path, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
  }, '');

  const areaPathD = `${linePathD} L ${points[points.length - 1].x} ${xAxisY} L ${yAxisX} ${xAxisY} Z`;

  // 3. Slow reveal animation (left-to-right clip mask)
  const areaSpring = spring({
    frame,
    fps,
    config: {
      stiffness: 25, // Slow & smooth pace
      damping: 22,
    },
  });

  const clipWidthPercent = interpolate(areaSpring, [0, 1], [0, 100]);

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
        <defs>
          {/* Left-to-Right Animated Clip Path Mask */}
          <clipPath id="areaClip">
            <rect
              x={yAxisX}
              y={0}
              width={(graphWidth * clipWidthPercent) / 100}
              height={height}
            />
          </clipPath>
        </defs>

        {/* Y-Axis Gridlines & Numbers (0, 20, 40, 60, 80, 100) */}
        {[0, 20, 40, 60, 80, 100].map((tick) => {
          const yPos = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={yAxisX}
                y1={yPos}
                x2={width - padding.right}
                y2={yPos}
                stroke="#F0F0F0"
                strokeWidth={1.5}
              />
              <text
                x={yAxisX - 18}
                y={yPos + 5}
                fill="#666666"
                fontSize={16}
                fontWeight="600"
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Animated Area Fill & Top Boundary Line */}
        <g clipPath="url(#areaClip)">
          {/* Cyan Area Fill */}
          <path d={areaPathD} fill="#26C6DA" opacity={0.9} />
          {/* Matching Cyan Line on Top Edge */}
          <path
            d={linePathD}
            fill="none"
            stroke="#00ACC1"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Y-Axis Main Line */}
        <line
          x1={yAxisX}
          y1={padding.top - 10}
          x2={yAxisX}
          y2={xAxisY}
          stroke="#444444"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* X-Axis Baseline */}
        <line
          x1={yAxisX}
          y1={xAxisY}
          x2={width - padding.right}
          y2={xAxisY}
          stroke="#444444"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
    </AbsoluteFill>
  );
};