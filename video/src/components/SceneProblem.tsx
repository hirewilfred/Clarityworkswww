import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BRAND, centered, heading, subheading } from "./styles";

// Scene 2: The Problem — Missed calls, lost revenue (5-12s = frames 150-360)
export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { number: "62%", label: "of calls to small businesses go unanswered", delay: 15 },
    { number: "$75K+", label: "lost revenue per year from missed leads", delay: 45 },
    { number: "80%", label: "of callers won't leave a voicemail", delay: 75 },
  ];

  const titleOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ ...centered, width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          ...heading,
          fontSize: 58,
          opacity: titleOpacity,
          marginBottom: 70,
          color: "#F87171",
        }}
      >
        The Calls You're Missing
      </div>

      <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>
        {stats.map((stat, i) => {
          const statScale = spring({ frame: frame - stat.delay, fps, config: { damping: 14, stiffness: 70 } });
          const statOpacity = interpolate(frame, [stat.delay, stat.delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                opacity: statOpacity,
                transform: `scale(${statScale})`,
                width: 350,
              }}
            >
              <div
                style={{
                  fontSize: 90,
                  fontWeight: 900,
                  fontFamily: "system-ui, sans-serif",
                  color: "#F87171",
                  lineHeight: 1,
                  textShadow: "0 0 40px rgba(248,113,113,0.4)",
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: BRAND.slate,
                  marginTop: 18,
                  lineHeight: 1.4,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Red warning pulse */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: `2px solid rgba(248,113,113,${Math.sin(frame * 0.08) * 0.15 + 0.05})`,
          borderRadius: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
