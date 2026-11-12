import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

// 22 Keywords matching length distribution and midnight palette
const KEYWORDS = [
  'Neural Core', 'TensorFlow', 'PyTorch', 'Vector DB',
  'Latent Space', 'Embeddings', 'Transformers', 'Attention',
  'Fine-Tuning', 'Zero-Shot', 'Quantization', 'Inference',
  'Agent Loop', 'RAG Pipeline', 'Tokenizers', 'Backpropagation',
  'Gradient', 'Activation', 'Parameters', 'Epochs',
  'Batch Norm', 'Stochastic'
];

const CYCLES = 2; // Seamless loop cycles

export const FlyingWords: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // Normalized time progress [0, 1) over CYCLES
  const t = (frame % durationInFrames) / durationInFrames;

  // Pre-calculate golden ratio layout properties
  const wordNodes = useMemo(() => {
    return KEYWORDS.map((word, i) => {
      const N = KEYWORDS.length;
      const basePhase = i / N;
      
      const goldenAngle = 2.39996;
      const pseudoRand1 = Math.sin(i * 12.9898) * 43758.5453 % 1;
      const pseudoRand2 = Math.cos(i * 78.233) * 43758.5453 % 1;
      
      const angle = i * goldenAngle + pseudoRand1 * 0.8;
      // Expanded radius for a wider cinematic tunnel spread
      const radius = 600 + pseudoRand2 * 900;
      
      // Compress y-radius by 0.55 to flatten into a wide cinematic ellipse
      const xBase = Math.cos(angle) * radius;
      const yBase = Math.sin(angle) * radius * 0.55;
      
      // Drift outward coefficient (increased spread)
      const drift = 0.8 + (i % 5) * 0.35;
      
      const fontSize = 28 + (i % 4) * 10;
      const isAccent = i % 5 === 0;
      
      return {
        word,
        xBase,
        yBase,
        drift,
        phase: basePhase,
        fontSize,
        isAccent,
      };
    });
  }, []);

  const tunnelRotation = Math.sin(t * Math.PI * 2) * 2.0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07080c',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        perspective: '4400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Central Electro-Optical Blue Halo */}
      <div
        style={{
          position: 'absolute',
          width: '1200px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(134,168,255,0.15) 0%, rgba(7,8,12,0) 70%)',
          opacity: 0.82 + Math.sin(t * Math.PI * 4 * CYCLES) * 0.14,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      {/* 3D Tunnel Space Container */}
      <div
        style={{
          position: 'relative',
          width: width,
          height: height,
          transformStyle: 'preserve-3d',
          transform: `rotate(${tunnelRotation}deg)`,
          zIndex: 1,
        }}
      >
        {wordNodes.map((item, index) => {
          const u = (t * CYCLES + item.phase) % 1;

          // Z-axis travel: -8000px -> +3500px
          const zStart = -8000;
          const zEnd = 3500;
          const z = zStart + u * (zEnd - zStart);

          const P = 4400;
          const perspectiveScale = P / (P - z);

          // Proper outward radial dispersion based on depth
          const currentDrift = Math.pow(perspectiveScale, item.drift) * 1.4;
          const x = width / 2 + item.xBase * currentDrift;
          const y = height / 2 + item.yBase * currentDrift;

          // Life Curve OP = [0, 1, 0.5, 0.2, 0] @ OT = [0, 0.25, 0.6, 0.85, 1]
          let opacity = 0;
          if (u < 0.25) {
            opacity = interpolate(u, [0, 0.25], [0, 1], { extrapolateRight: 'clamp' });
          } else if (u < 0.6) {
            opacity = interpolate(u, [0.25, 0.6], [1, 0.4], { extrapolateRight: 'clamp' });
          } else if (u < 0.85) {
            opacity = interpolate(u, [0.6, 0.85], [0.4, 0.15], { extrapolateRight: 'clamp' });
          } else {
            opacity = interpolate(u, [0.85, 1], [0.15, 0], { extrapolateRight: 'clamp' });
          }

          // Distance-based blur + Defocus on close pass
          const blurAmount = u > 0.82 ? (u - 0.82) * 35 : z < -4000 ? 4 : 0;

          const textShadow = item.isAccent
            ? '0 0 24px rgba(134,168,255,0.8), 0 0 48px rgba(134,168,255,0.4)'
            : '0 0 16px rgba(195,203,226,0.25)';

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${perspectiveScale})`,
                transformOrigin: 'center center',
                opacity: opacity,
                filter: `blur(${blurAmount}px)`,
                fontSize: `${item.fontSize}px`,
                fontWeight: 700,
                fontStyle: index % 3 === 0 ? 'italic' : 'normal',
                color: item.isAccent ? '#86a8ff' : '#f2f5ff',
                textShadow: textShadow,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {item.word}
            </div>
          );
        })}
      </div>

      {/* Foreground Protected Title Layer (With subtle vignette backdrop so words don't clash) */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          textAlign: 'center',
          background: 'radial-gradient(circle, rgba(7,8,12,0.85) 0%, rgba(7,8,12,0) 70%)',
          width: '900px',
          height: '400px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: '#8a95b5',
            marginBottom: '12px',
            fontWeight: 600,
          }}
        >
          System Architecture Core
        </div>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            color: '#f2f5ff',
            letterSpacing: '-0.02em',
            textShadow: '0 10px 30px rgba(0,0,0,0.9), 0 0 40px rgba(134,168,255,0.2)',
          }}
        >
          Autonomous Intelligence
        </div>
      </div>
    </AbsoluteFill>
  );
};