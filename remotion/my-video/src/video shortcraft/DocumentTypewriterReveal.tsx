import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const HISTORY_ENTRIES = [
  { id: 1, title: 'v2.4 Weekly Sync Notes', time: '10 mins ago' },
  { id: 2, title: 'Foundation Lab Patch #12', time: '42 mins ago' },
  { id: 3, title: 'ASR Augmentation Metrics', time: '2 hours ago' },
  { id: 4, title: 'Cascade Router Calibration', time: '5 hours ago' },
  { id: 5, title: 'Self-Healing CI Triage Update', time: 'Yesterday' },
  { id: 6, title: '2026-W28 Initial Draft', time: '2 days ago' },
];

export const DocumentTypewriterReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ==========================================
  // CAMERA MOTION (Hermite Spline keyframes)
  // ==========================================
  const scale = interpolate(
    frame,
    [0, 26, 64, 104, 150],
    [1.42, 1.24, 0.86, 0.74, 0.746],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const rotY = interpolate(
    frame,
    [0, 64, 150],
    [-18, 0, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const rotX = interpolate(
    frame,
    [0, 64, 104, 150],
    [8, 0, 9, 9],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateY = interpolate(
    frame,
    [64, 104, 150],
    [0, -78, -78],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ==========================================
  // TYPEWRITER & BLOCK REVEAL CALCULATIONS
  // ==========================================
  const totalBlocks = 12;
  const getBlockReveal = (blockIndex: number) => {
    const startFrame = 8 + blockIndex * 4.4;
    const endFrame = startFrame + 9;
    return interpolate(frame, [startFrame, endFrame], [100, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  };

  // Active Caret tracking
  let activeWritingBlock = -1;
  for (let i = 0; i < totalBlocks; i++) {
    const start = 8 + i * 4.4;
    const end = start + 9;
    if (frame >= start && frame <= end + 2) {
      activeWritingBlock = i;
    }
  }

  const leftColOpacity = interpolate(frame, [54, 64], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rightColOpacity = interpolate(frame, [62, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const taglineOpacity = interpolate(frame, [104, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#09090b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1200px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '1300px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(9,9,11,0) 70%)',
            transform: 'translateZ(-40px)',
            filter: 'blur(40px)',
            zIndex: 0,
          }}
        />

        <div
          style={{
            width: '1380px',
            height: '800px',
            backgroundColor: '#18181b',
            borderRadius: '16px',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.8), 0 0 30px rgba(147, 51, 234, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1,
            transform: `scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${translateY}px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* WINDOW TOOLBAR */}
          <div style={{ height: '52px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', backgroundColor: '#202024' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ marginLeft: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>2026 第 28 周 7月10日 已同步</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 500 }}>
              Foundation Lab Weekly
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            
            {/* SIDEBAR */}
            <div
              style={{
                width: '260px',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                opacity: leftColOpacity,
                backgroundColor: '#1a1a1e',
              }}
            >
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Workspace
              </div>
              <div style={{ color: '#d4d4d8', fontSize: '13px', padding: '6px 8px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                📁 Foundation Lab
              </div>
              <div style={{ color: '#a1a1aa', fontSize: '13px', padding: '6px 8px' }}>📄 2026-W28 Weekly</div>

              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Revision History Track
              </div>
              
              {HISTORY_ENTRIES.map((entry, index) => {
                const dropCue = 66 + index * 5;
                const entrySpring = spring({
                  frame: frame - dropCue,
                  fps,
                  config: { damping: 12, stiffness: 120, mass: 0.8 },
                });

                const entryTranslateY = interpolate(entrySpring, [0, 1], [-48, 0]);
                const entryOpacity = interpolate(frame, [dropCue, dropCue + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

                return (
                  <div
                    key={entry.id}
                    style={{
                      transform: `translateY(${entryTranslateY}px)`,
                      opacity: entryOpacity,
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div style={{ color: '#f3f4f6', fontSize: '12px', fontWeight: 500 }}>{entry.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '2px' }}>{entry.time}</div>
                  </div>
                );
              })}
            </div>

            {/* DOCUMENT SHEET */}
            <div
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                color: '#1f2937',
                padding: '48px 64px',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              {/* Document Title with integrated inline caret */}
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 20px 0', position: 'relative', display: 'inline-block' }}>
                2026-W28 · Foundation Lab Weekly
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: `${getBlockReveal(0)}%`, backgroundColor: '#ffffff' }} />
                {activeWritingBlock === 0 && (
                  <span style={{ position: 'absolute', right: `${getBlockReveal(0)}%`, top: 0, bottom: 0, width: '3px', backgroundColor: '#9333ea', boxShadow: '0 0 8px rgba(147, 51, 234, 0.8)', display: 'inline-block' }} />
                )}
              </h1>

              {/* Jackie's Download Section */}
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#374151', margin: '24px 0 8px 0', position: 'relative', display: 'inline-block' }}>
                Jackie's Download
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: `${getBlockReveal(1)}%`, backgroundColor: '#ffffff' }} />
                {activeWritingBlock === 1 && (
                  <span style={{ position: 'absolute', right: `${getBlockReveal(1)}%`, top: 0, bottom: 0, width: '3px', backgroundColor: '#9333ea', boxShadow: '0 0 8px rgba(147, 51, 234, 0.8)', display: 'inline-block' }} />
                )}
              </h3>
              
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, fontSize: '14px', color: '#4b5563', marginBottom: '20px' }}>
                <li style={{ position: 'relative', marginBottom: '6px' }}>
                  本周三条主线都到了可定去留的节点:cascade 承接率、drift 提前量、ASR 增广,周五评审逐条过。
                  <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: `${getBlockReveal(2)}%`, backgroundColor: '#ffffff' }} />
                  {activeWritingBlock === 2 && (
                    <span style={{ position: 'absolute', right: `${getBlockReveal(2)}%`, top: 0, bottom: 0, width: '3px', backgroundColor: '#9333ea', boxShadow: '0 0 8px rgba(147, 51, 234, 0.8)' }} />
                  )}
                </li>
                <li style={{ position: 'relative' }}>
                  提醒:实验注记模板 v2 已生效,新实验直接按新表头归档。
                  <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: `${getBlockReveal(3)}%`, backgroundColor: '#ffffff' }} />
                  {activeWritingBlock === 3 && (
                    <span style={{ position: 'absolute', right: `${getBlockReveal(3)}%`, top: 0, bottom: 0, width: '3px', backgroundColor: '#9333ea', boxShadow: '0 0 8px rgba(147, 51, 234, 0.8)' }} />
                  )}
                </li>
              </ul>

              {/* Lin Section */}
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#7c3aed', margin: '20px 0 6px 0' }}>Lin</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, fontSize: '14px', color: '#4b5563', marginBottom: '20px' }}>
                <li style={{ position: 'relative', marginBottom: '6px' }}>
                  Sensor drift early-warning:patch-length ablation 在 held-out 产线数据上收敛,tiny transformer 领先 rolling-stats 基线 <span style={{ backgroundColor: frame > 30 ? 'rgba(168, 85, 247, 0.2)' : 'transparent', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, mixBlendMode: 'multiply' }}>3.1× 提前量</span>。
                  <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: `${getBlockReveal(4)}%`, backgroundColor: '#ffffff' }} />
                  {activeWritingBlock === 4 && (
                    <span style={{ position: 'absolute', right: `${getBlockReveal(4)}%`, top: 0, bottom: 0, width: '3px', backgroundColor: '#9333ea', boxShadow: '0 0 8px rgba(147, 51, 234, 0.8)' }} />
                  )}
                </li>
              </ul>
            </div>

            {/* RIGHT METRICS PANEL */}
            <div
              style={{
                width: '280px',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                opacity: rightColOpacity,
                backgroundColor: '#1a1a1e',
              }}
            >
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Weekly Analytics
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Total Experiments</div>
                <div style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>13 Labs</div>
              </div>
            </div>

          </div>
        </div>

        {/* CLOSING TAGLINE */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            left: 'calc(50% - 690px)',
            opacity: taglineOpacity,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: 500 }}>
            Foundation Lab Weekly Document Synthesis
          </div>
          <div style={{ color: '#a855f7', fontSize: '24px', fontWeight: 700 }}>
            Real-time Continuous Production Workflow.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};