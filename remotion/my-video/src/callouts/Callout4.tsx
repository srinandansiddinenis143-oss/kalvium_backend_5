import { Callout8 } from './Callout8';
import { Callout7 } from './Callout7';
import { Callout6 } from './Callout6';
import { Callout5 } from './Callout5';
import { Callout1 } from './Callout1';
import { Callout2 } from './Callout2';
import { Callout3 } from './Callout3';
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig, Sequence,
} from 'remotion';

interface Props {
  headlineText?: string;
  badgeText?: string;
}

export const Callout4: React.FC<Props> = ({
  headlineText = 'EASY FOR CUSTOMIZE',
  badgeText = 'FULL CONTROL',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // -----------------------------------------------------------
  // TIMING: Sequential 3-Step Intro (Dot -> Diag Line -> Skewed Box)
  // -----------------------------------------------------------
  const dotIntro = spring({ frame, fps, config: { stiffness: 70, damping: 14 } });
  const diagLineIntro = spring({ frame: frame - 12, fps, config: { stiffness: 60, damping: 15 } });
  const boxesIntro = spring({ frame: frame - 24, fps, config: { stiffness: 60, damping: 15 } });

  // -----------------------------------------------------------
  // TIMING: Sequential 3-Step Outro (Reverse)
  // -----------------------------------------------------------
  const outroStartFrame = durationInFrames - 45;
  const boxesOutro = spring({ frame: frame - outroStartFrame, fps, config: { stiffness: 60, damping: 15 } });
  const diagLineOutro = spring({ frame: frame - (outroStartFrame + 10), fps, config: { stiffness: 60, damping: 15 } });
  const dotOutro = spring({ frame: frame - (outroStartFrame + 20), fps, config: { stiffness: 70, damping: 14 } });

  // -----------------------------------------------------------
  // INTERPOLATIONS
  // -----------------------------------------------------------
  const dotScale = frame >= outroStartFrame ? interpolate(dotOutro, [0, 1], [1, 0]) : interpolate(dotIntro, [0, 1], [0, 1]);
  const diagLineProgress = frame >= outroStartFrame ? interpolate(diagLineOutro, [0, 1], [1, 0]) : interpolate(diagLineIntro, [0, 1], [0, 1]);
  const boxesScaleX = frame >= outroStartFrame ? interpolate(boxesOutro, [0, 1], [1, 0]) : interpolate(boxesIntro, [0, 1], [0, 1]);

  // -----------------------------------------------------------
  // LAYOUT COORDINATES
  // -----------------------------------------------------------
  const cornerX = 1100;
  const cornerY = 700;

  // Short diagonal pointer vector (Pointing down-right to the dot)
  const lineDeltaX = 70;
  const lineDeltaY = 70;

  const lineLength = Math.sqrt(lineDeltaX * lineDeltaX + lineDeltaY * lineDeltaY);
  const lineAngle = (Math.atan2(lineDeltaY, lineDeltaX) * 180) / Math.PI;

  const dotX = cornerX + lineDeltaX;
  const dotY = cornerY + lineDeltaY;

  return (
    <>
      <AbsoluteFill
        style={{
          backgroundColor: 'transparent',
          fontFamily: 'Montserrat, Arial, sans-serif',
          translate: '-323.7px 89.6px'
        }}
      >
        
        {/* STEP 1: Target Circle Node */}
        <div
          style={{
            position: 'absolute', left: dotX, top: dotY,
            width: 28, height: 28, borderRadius: '50%',
            border: '2px solid #FFFFFF', backgroundColor: '#0288D1',
            transform: `translate(-50%, -50%) scale(${dotScale})`,
            transformOrigin: 'center center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 4, boxShadow: '0 0 10px rgba(2, 136, 209, 0.6)',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
        </div>
      
        {/* STEP 2: Diagonal Pointer Line */}
        <div
          style={{
            position: 'absolute', left: cornerX, top: cornerY,
            width: lineLength, height: 2, backgroundColor: '#FFFFFF',
            transform: `rotate(${lineAngle}deg) scaleX(${diagLineProgress})`,
            transformOrigin: 'left center', zIndex: 3,
          }}
        />
      
        {/* STEP 3: Skewed Box Container with Bottom Accent Bar */}
        <div
          style={{
            position: 'absolute',
            right: 1920 - cornerX,
            top: cornerY,
            transform: `translate(0, -100%) scaleX(${boxesScaleX})`,
            transformOrigin: 'right bottom',
            display: 'flex', flexDirection: 'column',
            border: '2px solid #FFFFFF',
            transformStyle: 'preserve-3d',
            zIndex: 2,
          }}
        >
          {/* Main Skewed Header Box */}
          <div
            style={{
              backgroundColor: 'rgba(15, 15, 15, 0.85)',
              padding: '18px 45px',
              transform: 'skewX(-15deg)', // Slanted parallelogram effect
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              zIndex: 2,
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                fontSize: 34,
                fontWeight: 900,
                fontStyle: 'italic',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                display: 'block',
                transform: 'skewX(0deg)', // Keeps text upright
              }}
            >
              {headlineText}
            </span>
          </div>
      
          {/* Bottom Accent Bar */}
          <div
            style={{
              backgroundColor: '#0288D1',
              color: '#FFFFFF',
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              transform: 'skewX(-15deg)',
              zIndex: 1,
              marginTop: -2,
            }}
          >
            {badgeText}
          </div>
        </div>
      </AbsoluteFill>
      <Sequence
        name="Callout3"
        width={1920}
        height={1080}
        durationInFrames={150}
        style={{
          position: 'absolute',
          translate: '464.3px 64.7px'
        }}
      >
        <Callout3 />
      </Sequence>
      <Sequence
        name="Callout2"
        width={1920}
        height={1080}
        durationInFrames={150}
        style={{
          position: 'absolute',
          translate: '448.7px -281.2px'
        }}
      >
        <Callout2 />
      </Sequence>
      <Sequence
        name="Callout1"
        width={1920}
        height={1080}
        durationInFrames={150}
        style={{
          position: 'absolute',
          translate: '-402.6px -267.4px'
        }}
      >
        <Callout1 />
      </Sequence>
      <Sequence
        name="Callout5"
        width={1920}
        height={1080}
        durationInFrames={150}
        style={{
          position: 'absolute',
          translate: '394.8px 164.2px'
        }}
      >
        <Callout5 />
      </Sequence>
      <Sequence
        name="Callout6"
        width={1920}
        height={1080}
        durationInFrames={150}
        style={{
          position: 'absolute',
          translate: '-90.8px -314.4px'
        }}
      >
        <Callout6 />
      </Sequence>
      <Sequence
        name="Callout7"
        width={1920}
        height={1080}
        durationInFrames={150}
        style={{
          position: 'absolute',
          translate: '-807px -387.8px'
        }}
      >
        <Callout7 />
      </Sequence>
      <Sequence
        from={39}
        name="Callout8"
        width={1920}
        height={1080}
        durationInFrames={150}
        style={{
          position: 'absolute',
          translate: '0px 0px',
          scale: 2.303
        }}
      >
        <Callout8 />
      </Sequence>
    </>
  );
};