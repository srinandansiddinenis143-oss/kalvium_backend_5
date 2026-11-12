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
  cyan: number;   // Bottom layer value
  yellow: number; // Middle layer value
  red: number;    // Top layer value
}

const DATA: DataPoint[] = [
  { label: 'Jan', cyan: 0, yellow: 15, red: 20 },
  { label: 'Feb', cyan: 6, yellow: 18, red: 28 },
  { label: 'Mar', cyan: 22, yellow: 46, red: 21 },
  { label: 'Apr', cyan: 40, yellow: 15, red: 32 },
  { label: 'May', cyan: 38, yellow: 30, red: 5 },
  { label: 'Jun', cyan: 45, yellow: 18, red: 17 },
  { label: 'Jul', cyan: 40, yellow: 46, red: 12 },
  { label: 'Aug', cyan: 28, yellow: 8, red: 64 },
  { label: 'Sep', cyan: 42, yellow: 26, red: 8 },
  { label: 'Oct', cyan: 48, yellow: 6, red: 30 },
  { label: 'Nov', cyan: 62, yellow: 32, red: 6 },
  { label: 'Dec', cyan: 72, yellow: 9, red: 23 },
];

export const StackedAreaChart: React.FC = () => {
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

  // Calculate cumulative stacked Y heights for each dataset
  const points = DATA.map((item, index) => {
    const x = yAxisX + index * xStep;
    const cyanY = getY(item.cyan);
    const yellowY = getY(item.cyan + item.yellow);
    const redY = getY(item.cyan + item.yellow + item.red);

    return { x, cyanY, yellowY, redY };
  });

  // Helper to build closed SVG area path between two curve lines
  const buildAreaPath = (
    topKeys: number[],
    bottomKeys?: number[]
  ) => {
    let topPath = points.reduce((acc, pt, idx) => {
      const y = topKeys[idx];
      return idx === 0 ? `M ${pt.x} ${y}` : `${acc} L ${pt.x} ${y}`;
    }, '');

    if (bottomKeys) {
      // Trace backwards along the lower boundary line
      for (let i = points.length - 1; i >= 0; i--) {
        topPath += ` L ${points[i].x} ${bottomKeys[i]}`;
      }
    } else {
      // Close down to baseline
      topPath += ` L ${points[points.length - 1].x} ${xAxisY} L ${yAxisX} ${xAxisY}`;
    }

    return `${topPath} Z`;
  };

  const cyanPath = buildAreaPath(points.map((p) => p.cyanY));
  const yellowPath = buildAreaPath(
    points.map((p) => p.yellowY),
    points.map((p) => p.cyanY)
  );
  const redPath = buildAreaPath(
    points.map((p) => p.redY),
    points.map((p) => p.yellowY)
  );

  // Smooth left-to-right clip reveal animation
  const areaSpring = spring({
    frame,
    fps,
    config: {
      stiffness: 25, // Slow & cinematic pace
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
          <clipPath id="stackedClip">
            <rect
              x={yAxisX}
              y={0}
              width={(graphWidth * clipWidthPercent) / 100}
              height={height}
            />
          </clipPath>
        </defs>

        {/* Y-Axis Gridlines & Scale Labels (0, 20, 40, 60, 80, 100) */}
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

        {/* Stacked Animated Area Layers */}
        <g clipPath="url(#stackedClip)">
          {/* Bottom Layer: Cyan / Teal */}
          <path d={cyanPath} fill="#00838F" opacity={0.95} />

          {/* Middle Layer: Yellow / Amber */}
          <path d={yellowPath} fill="#FFB74D" opacity={0.95} />

          {/* Top Layer: Red / Coral */}
          <path d={redPath} fill="#FF5722" opacity={0.95} />
        </g>

        {/* Y-Axis Line */}
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