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
  volume: number;       // Primary Y-Axis (0 - 500)
  performance: number;  // Secondary Y-Axis (0% - 100%)
  barColor: string;
}

const DATA: DataPoint[] = [
  { label: 'Jan', volume: 120, performance: 45, barColor: '#FF5722' }, // Orange
  { label: 'Feb', volume: 180, performance: 58, barColor: '#00BCD4' }, // Cyan
  { label: 'Mar', volume: 310, performance: 72, barColor: '#8BC34A' }, // Green
  { label: 'Apr', volume: 240, performance: 61, barColor: '#9C27B0' }, // Purple
  { label: 'May', volume: 450, performance: 80, barColor: '#FFC107' }, // Amber
  { label: 'Jun', volume: 380, performance: 69, barColor: '#E91E63' }, // Pink
  { label: 'Jul', volume: 410, performance: 85, barColor: '#3F51B5' }, // Indigo
];

export const ComboChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Canvas Dimensions
  const width = 1050;
  const height = 550;
  const padding = { top: 70, right: 100, bottom: 90, left: 100 };

  const xAxisY = height - padding.bottom;
  const leftYAxisX = padding.left;
  const rightYAxisX = width - padding.right;
  const graphWidth = rightYAxisX - leftYAxisX;
  const graphHeight = height - padding.top - padding.bottom;

  // Scales
  const maxVolume = 500;
  const maxPerformance = 100;

  // Coordinate Mapping Functions
  const getVolumeY = (val: number) => xAxisY - (val / maxVolume) * graphHeight;
  const getPerformanceY = (val: number) => xAxisY - (val / maxPerformance) * graphHeight;

  const barWidth = 60;
  const stepX = graphWidth / (DATA.length - 1);

  // Calculate static node points for the line
  const nodePoints = DATA.map((item, index) => ({
    x: leftYAxisX + index * stepX,
    y: getPerformanceY(item.performance),
    val: item.performance,
  }));

  // Construct full trend line path
  const fullLinePath = nodePoints.reduce((path, pt, index) => {
    return index === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
  }, '');

  // Line Stroke Drawing Animation
  const totalPathLength = 1400;
  const lineSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  const strokeDashoffset = interpolate(
    lineSpring,
    [0, 1],
    [totalPathLength, 0]
  );

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
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="6"
            refY="5"
            orient="auto"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#222222" />
          </marker>
        </defs>

        {/* Primary Y-Axis Labels (Volume) */}
        {[0, 100, 200, 300, 400, 500].map((tick) => (
          <g key={`vol-${tick}`}>
            <line
              x1={leftYAxisX}
              y1={getVolumeY(tick)}
              x2={rightYAxisX}
              y2={getVolumeY(tick)}
              stroke="#F0F0F0"
              strokeWidth={1.5}
            />
            <text
              x={leftYAxisX - 15}
              y={getVolumeY(tick) + 5}
              fill="#666666"
              fontSize={14}
              fontWeight="600"
              textAnchor="end"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Secondary Y-Axis Labels (Performance %) */}
        {[0, 20, 40, 60, 80, 100].map((tick) => (
          <text
            key={`perf-${tick}`}
            x={rightYAxisX + 15}
            y={getPerformanceY(tick) + 5}
            fill="#222222"
            fontSize={14}
            fontWeight="bold"
            textAnchor="start"
          >
            {tick}%
          </text>
        ))}

        {/* 1. Animated Volume Bars (Rising from Bottom) */}
        {DATA.map((item, index) => {
          const delay = index * 3;

          const barSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.8 },
          });

          const currentBarHeight = interpolate(
            barSpring,
            [0, 1],
            [0, (item.volume / maxVolume) * graphHeight]
          );

          const centerX = leftYAxisX + index * stepX;
          const barX = centerX - barWidth / 2;
          const barY = xAxisY - currentBarHeight;

          return (
            <g key={index}>
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={currentBarHeight}
                rx={8}
                ry={8}
                fill={item.barColor}
                opacity={0.9}
              />
              {/* Month Label */}
              <text
                x={centerX}
                y={xAxisY + 35}
                fill="#333333"
                fontSize={16}
                fontWeight="bold"
                textAnchor="middle"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* 2. Left-to-Right Animated Line Stroke */}
        <path
          d={fullLinePath}
          fill="none"
          stroke="#222222"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalPathLength}
          strokeDashoffset={strokeDashoffset}
          markerEnd="url(#arrowhead)"
        />

        {/* 3. Sequential Node Circles with Value Badges */}
        {nodePoints.map((pt, index) => {
          const delay = 12 + index * 4;

          const nodeSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 120 },
          });

          const scale = interpolate(nodeSpring, [0, 1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <g key={index}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={10 * scale}
                fill="#222222"
              />
              {/* Node Value Label */}
              <text
                x={pt.x}
                y={pt.y - 16}
                fill="#222222"
                fontSize={13}
                fontWeight="800"
                textAnchor="middle"
                opacity={scale}
              >
                {pt.val}%
              </text>
            </g>
          );
        })}

        {/* 4. Axis Border Lines */}
        {/* Left Y-Axis */}
        <line
          x1={leftYAxisX}
          y1={padding.top - 20}
          x2={leftYAxisX}
          y2={xAxisY}
          stroke="#333333"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Right Y-Axis */}
        <line
          x1={rightYAxisX}
          y1={padding.top - 20}
          x2={rightYAxisX}
          y2={xAxisY}
          stroke="#333333"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Bottom X-Axis */}
        <line
          x1={leftYAxisX}
          y1={xAxisY}
          x2={rightYAxisX}
          y2={xAxisY}
          stroke="#333333"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
    </AbsoluteFill>
  );
};