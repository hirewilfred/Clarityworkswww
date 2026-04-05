import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BRAND, centered, heading, subheading } from "./styles";

// Scene 1: Opening Hook — "Your Business Never Sleeps" (0-5s = frames 0-150)
export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 80 } });
  const subtitleOpacity = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = Math.sin(frame * 0.05) * 0.3 + 0.7;

  // Clock icon animation
  const clockRotation = interpolate(frame, [0, 150], [0, 360]);
  const clockScale = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 60 } });

  return (
    <div style={{ ...centered, width: "100%", height: "100%", position: "relative" }}>
      {/* Animated clock ring */}
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: `3px solid rgba(59,130,246,${glowPulse * 0.5})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 50,
          transform: `scale(${clockScale})`,
          boxShadow: `0 0 60px rgba(59,130,246,${glowPulse * 0.3})`,
        }}
      >
        {/* Clock hands */}
        <div style={{ position: "relative", width: 120, height: 120 }}>
          {/* Hour hand */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 4,
              height: 35,
              background: BRAND.white,
              borderRadius: 4,
              transformOrigin: "bottom center",
              transform: `translate(-50%, -100%) rotate(${clockRotation * 0.5}deg)`,
            }}
          />
          {/* Minute hand */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 3,
              height: 48,
              background: BRAND.blue,
              borderRadius: 4,
              transformOrigin: "bottom center",
              transform: `translate(-50%, -100%) rotate(${clockRotation}deg)`,
            }}
          />
          {/* Center dot */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: BRAND.blue,
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 15px ${BRAND.blueGlow}`,
            }}
          />
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          ...heading,
          fontSize: 82,
          opacity: titleOpacity,
          transform: `translateY(${interpolate(titleY, [0, 1], [40, 0])}px)`,
        }}
      >
        Your Business
        <br />
        <span style={{ color: BRAND.blue }}>Never Sleeps.</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          ...subheading,
          fontSize: 30,
          marginTop: 30,
          opacity: subtitleOpacity,
          maxWidth: 700,
        }}
      >
        But your team does. What happens to the calls
        <br />
        that come in at 2 AM?
      </div>
    </div>
  );
};
