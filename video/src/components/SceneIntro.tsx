import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BRAND, centered, heading, subheading } from "./styles";

// Scene 3: Introducing the AI Receptionist (12-20s = frames 360-600)
export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 60 } });
  const subtitleOpacity = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeScale = spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 90 } });

  // AI pulse rings
  const ring1 = interpolate((frame % 90), [0, 90], [0.5, 1.8]);
  const ring2 = interpolate(((frame + 30) % 90), [0, 90], [0.5, 1.8]);
  const ring3 = interpolate(((frame + 60) % 90), [0, 90], [0.5, 1.8]);
  const ringOpacity = (ringVal: number) => interpolate(ringVal, [0.5, 1.8], [0.6, 0]);

  return (
    <div style={{ ...centered, width: "100%", height: "100%", position: "relative" }}>
      {/* AI Core with pulse rings */}
      <div style={{ position: "relative", width: 200, height: 200, marginBottom: 50 }}>
        {[ring1, ring2, ring3].map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `2px solid ${BRAND.blue}`,
              transform: `translate(-50%, -50%) scale(${r})`,
              opacity: ringOpacity(r),
            }}
          />
        ))}
        {/* AI icon center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${titleScale})`,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.indigo})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 80px ${BRAND.blueGlow}, inset 0 0 30px rgba(255,255,255,0.1)`,
          }}
        >
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          ...heading,
          fontSize: 72,
          transform: `scale(${titleScale})`,
        }}
      >
        Meet Your
        <br />
        <span
          style={{
            background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.indigo})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          24/7 AI Receptionist
        </span>
      </div>

      {/* Subtitle */}
      <div style={{ ...subheading, fontSize: 28, marginTop: 30, opacity: subtitleOpacity, maxWidth: 750 }}>
        An intelligent AI agent that answers every call,
        <br />
        books appointments, and never takes a day off.
      </div>

      {/* Badge */}
      <div
        style={{
          marginTop: 40,
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          padding: "14px 36px",
          borderRadius: 50,
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.3)",
          color: BRAND.blue,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Powered by ClarityWorks Studio
      </div>
    </div>
  );
};
