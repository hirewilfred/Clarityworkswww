import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BRAND, fullScreen } from "./styles";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Slowly rotating gradient orbs
  const orb1X = interpolate(frame, [0, 1350], [-10, 20], { extrapolateRight: "clamp" });
  const orb2X = interpolate(frame, [0, 1350], [110, 80], { extrapolateRight: "clamp" });
  const pulse = Math.sin(frame * 0.02) * 0.15 + 0.85;

  return (
    <div style={{ ...fullScreen, background: BRAND.bg, overflow: "hidden" }}>
      {/* Grid lines */}
      <div
        style={{
          ...fullScreen,
          backgroundImage: `linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          transform: `perspective(1000px) rotateX(${interpolate(frame, [0, 1350], [60, 55])}deg)`,
          transformOrigin: "center 120%",
          opacity: 0.6,
        }}
      />

      {/* Orb 1 — blue */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: `${orb1X}%`,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(59,130,246,${0.12 * pulse}), transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Orb 2 — indigo */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: `${100 - orb2X}%`,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(99,102,241,${0.1 * pulse}), transparent 70%)`,
          filter: "blur(90px)",
        }}
      />

      {/* Scanline overlay */}
      <div
        style={{
          ...fullScreen,
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`,
        }}
      />
    </div>
  );
};
