import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  
  Easing,
} from 'remotion';

// Data segments: Noun + Verb relay with step progression
const STEPS = [
  { 
    id: '01', 
    noun: 'Agent', 
    verb: 'plans', 
    desc: 'Deconstructing complex user intents into actionable execution graphs.' 
  },
  { 
    id: '02', 
    noun: 'Agent', 
    verb: 'retrieves', 
    desc: 'Querying dense vector spaces for contextual semantic embeddings.' 
  },
  { 
    id: '03', 
    noun: 'Agent', 
    verb: 'executes', 
    desc: 'Synthesizing retrieved context into deterministic structured outputs.' 
  },
];

export const WordRelayFilmstrip: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 180 frames total (6 seconds @ 30fps), 3 steps divided evenly (~60 frames per step)
  const stepDuration = durationInFrames / STEPS.length;
  
  // Right side text instantly updates when the new step's duration starts
  const currentStepIndex = Math.min(STEPS.length - 1, Math.floor(frame / stepDuration));

  // Left column physics constants
  const cardHeight = 530;
  const cardSpacing = 105;
  const totalCardStride = cardHeight + cardSpacing;
  const transitionDuration = 18;

  // ==========================================
  // PERFECT SCROLL TRACKING
  // Maps frame directly to exact continuous scroll index 
  // preventing double-jumps and over-scrolling
  // ==========================================
  let scrollIndex = 0;
  
  for (let i = 1; i < STEPS.length; i++) {
    const transitionStart = i * stepDuration;
    if (frame >= transitionStart) {
      if (frame < transitionStart + transitionDuration) {
        // We are inside the 18-frame scroll window
        const p = (frame - transitionStart) / transitionDuration;
        const eased = Easing.bezier(0.25, 1, 0.5, 1)(p); // EASE.swift
        scrollIndex = (i - 1) + eased;
        break; 
      } else {
        // We have fully settled on this step
        scrollIndex = i;
      }
    }
  }

  // Multiply precise scroll float by stride length
  const targetTranslateY = -(scrollIndex * totalCardStride);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0c0d10', // Graphite near-monochrome dark field
        fontFamily: '-apple-system, BlinkMacSystemFont, "Didot", "Playfair Display", serif',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 120px',
        overflow: 'hidden',
        color: '#f2f5ff',
      }}
    >
      {/* LEFT COLUMN: Filmstrip Page Cards */}
      <div
        style={{
          position: 'relative',
          width: '940px',
          height: '1080px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: `${(1080 - cardHeight) / 2}px`, // Centered vertically (y = 275)
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: `${cardSpacing}px`,
            transform: `translateY(${targetTranslateY}px)`,
          }}
        >
          {STEPS.map((step, i) => {
            const isWhiteCard = i % 2 === 0;
            const cardTop = (i * totalCardStride) + targetTranslateY + (1080 - cardHeight) / 2;
            const focusCenter = (1080 - cardHeight) / 2;
            
            // Depth of field calculations based on distance from center view
            const dist = Math.abs(cardTop - focusCenter) / 635;
            const cardOpacity = Math.max(0.3, 1 - 0.68 * dist);
            const blurAmount = Math.min(3, dist * 3);

            return (
              <div
                key={i}
                style={{
                  width: '940px',
                  height: `${cardHeight}px`,
                  backgroundColor: isWhiteCard ? '#f4f4f6' : '#1a1c23',
                  color: isWhiteCard ? '#0c0d10' : '#f2f5ff',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '60px',
                  boxSizing: 'border-box',
                  opacity: cardOpacity,
                  filter: `blur(${blurAmount}px)`,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: '16px' }}>
                  Phase {step.id}
                </div>
                <div style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                  {step.noun} {step.verb} layer active
                </div>
                <div style={{ fontSize: '20px', lineHeight: 1.6, opacity: 0.8, maxWidth: '700px', fontFamily: '-apple-system, sans-serif' }}>
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: Synchronized Serif Word Relay */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '700px',
          height: '1080px',
          position: 'relative',
        }}
      >
        {/* Step Counter Indicator */}
        <div style={{ position: 'absolute', top: '220px', fontSize: '16px', letterSpacing: '0.3em', color: '#c3cbe2', opacity: 0.6 }}>
          {STEPS[currentStepIndex].id} / 03
        </div>

        {/* Word Block Centered exactly at y = 540 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            height: '308px',
            justifyContent: 'center',
          }}
        >
          {/* Noun Line (Constant) */}
          <div
            style={{
              fontSize: '140px',
              fontWeight: 400,
              fontFamily: 'Didot, "Playfair Display", serif',
              color: '#c3cbe2',
              letterSpacing: '-0.03em',
              lineHeight: '154px',
            }}
          >
            {STEPS[currentStepIndex].noun}
          </div>

          {/* Verb Line (Rotating in-place) */}
          <div
            style={{
              fontSize: '140px',
              fontStyle: 'italic',
              fontWeight: 700,
              fontFamily: 'Didot, "Playfair Display", serif',
              color: '#f2f5ff',
              letterSpacing: '-0.03em',
              lineHeight: '154px',
            }}
          >
            {STEPS[currentStepIndex].verb}
          </div>
        </div>

        {/* Supporting Footnote */}
        <div style={{ position: 'absolute', bottom: '240px', fontSize: '18px', fontFamily: '-apple-system, sans-serif', color: '#8a95b5', maxWidth: '500px', lineHeight: 1.5 }}>
          {STEPS[currentStepIndex].desc}
        </div>
      </div>
    </AbsoluteFill>
  );
};