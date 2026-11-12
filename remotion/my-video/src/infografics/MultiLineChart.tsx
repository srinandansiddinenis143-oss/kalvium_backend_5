import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface LineSeries {
  name: string;
  color: string;
  values: number[]; // Percentage values (0 to 100)
}

const SERIES: LineSeries[] = [
  {
    name: 'Series 1',
    color: '#4DD0E1', // Cyan / Light Blue
    values: [22, 23, 35, 54, 56, 72],
  },
  {
    name: 'Series 2',
    color: '#FF8A65', // Orange / Peach
    values: [18, 30, 42, 33, 40, 46],
  },
  {
    name: 'Series 3',
    color: '#AED581', // Lime Green
    values: [15, 12, 28, 44, 39, 36],
  },
  {
    name: 'Series 4',
    color: '#AB47BC', // Purple / Violet (New 4th Line)
    values: [10, 20, 18, 25, 48, 62],
  },
];

export const MultiLineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Canvas setup
  const width = 1000;
  const height = 600;
  const padding = { top: 60, right: 80, bottom: 90, left: 110 };

  const xAxisY = height - padding.bottom;
  const yAxisX = padding.left;
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxValue = 100;
  const getY = (val: number) => xAxisY - (val / maxValue) * graphHeight;

  const xLabels = ['2013', '2014', '2015', '2016'];
  const xStep = graphWidth / (SERIES[0].values.length - 1);
  const totalPathLength = 1400;

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
        {/* Y-Axis Gridlines & Percentage Labels (0%, 50%, 100%) */}
        {[0, 50, 100].map((tick) => {
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
                y={yPos + 6}
                fill="#333333"
                fontSize={18}
                fontWeight="bold"
                textAnchor="end"
              >
                {tick}%
              </text>
            </g>
          );
        })}

        {/* X-Axis Year Labels */}
        {xLabels.map((year, index) => {
          const labelX =
            yAxisX + index * (graphWidth / (xLabels.length - 1));
          return (
            <text
              key={year}
              x={labelX}
              y={xAxisY + 40}
              fill="#333333"
              fontSize={18}
              fontWeight="bold"
              textAnchor="middle"
            >
              {year}
            </text>
          );
        })}

        {/* Multi-Line Series Animation */}
        {SERIES.map((line, seriesIndex) => {
          // Calculate node coordinates for each line
          const nodePoints = line.values.map((val, idx) => ({
            x: yAxisX + idx * xStep,
            y: getY(val),
          }));

          // Build SVG path string
          const linePathD = nodePoints.reduce((path, pt, idx) => {
            return idx === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
          }, '');

          // Smooth slow-motion spring config
          const lineSpring = spring({
            frame: frame - seriesIndex * 8, // Staggered delay for each line
            fps,
            config: {
              stiffness: 25,
              damping: 22,
            },
          });

          const strokeDashoffset = interpolate(
            lineSpring,
            [0, 1],
            [totalPathLength, 0]
          );

          return (
            <path
              key={seriesIndex}
              d={linePathD}
              fill="none"
              stroke={line.color}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={totalPathLength}
              strokeDashoffset={strokeDashoffset}
            />
          );
        })}

        {/* Y-Axis Line */}
        <line
          x1={yAxisX}
          y1={padding.top - 10}
          x2={yAxisX}
          y2={xAxisY}
          stroke="#222222"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* X-Axis Baseline */}
        <line
          x1={yAxisX}
          y1={xAxisY}
          x2={width - padding.right}
          y2={xAxisY}
          stroke="#222222"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </svg>
    </AbsoluteFill>
  );
};