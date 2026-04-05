import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./components/Background";
import { SceneHook } from "./components/SceneHook";
import { SceneProblem } from "./components/SceneProblem";
import { SceneIntro } from "./components/SceneIntro";
import { SceneFeatures } from "./components/SceneFeatures";
import { SceneROI } from "./components/SceneROI";
import { SceneCTA } from "./components/SceneCTA";

// Scene timings (in frames at 30fps)
const SCENES = [
  { start: 0, duration: 165, Component: SceneHook },       // 0-5.5s
  { start: 150, duration: 225, Component: SceneProblem },   // 5-12.5s
  { start: 360, duration: 255, Component: SceneIntro },     // 12-20.5s
  { start: 600, duration: 375, Component: SceneFeatures },  // 20-32.5s
  { start: 960, duration: 225, Component: SceneROI },       // 32-39.5s
  { start: 1170, duration: 180, Component: SceneCTA },      // 39-45s
];

const SceneWithFade: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({
  children,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // Fade in first 15 frames, fade out last 15 frames
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
};

export const AIReceptionistTrailer: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Persistent background */}
      <Background />

      {/* Scene sequences with crossfades */}
      {SCENES.map(({ start, duration, Component }, i) => (
        <Sequence key={i} from={start} durationInFrames={duration}>
          <SceneWithFade durationInFrames={duration}>
            <Component />
          </SceneWithFade>
        </Sequence>
      ))}

      {/* Top thin accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 3,
          background: `linear-gradient(90deg, transparent, #3B82F6, transparent)`,
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};
