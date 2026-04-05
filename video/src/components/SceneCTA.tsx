import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BRAND, centered, heading, subheading } from "./styles";

// Scene 6: CTA — Book your demo (39-45s = frames 1170-1350)
export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 50 } });
  const titleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = spring({ frame: frame - 20, fps, config: { damping: 15, stiffness: 80 } });
  const ctaOpacity = interpolate(frame, [60, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaScale = spring({ frame: frame - 60, fps, config: { damping: 14, stiffness: 90 } });
  const urlOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glow pulse
  const glowIntensity = Math.sin(frame * 0.06) * 0.3 + 0.7;

  return (
    <div style={{ ...centered, width: "100%", height: "100%", position: "relative" }}>
      {/* Background glow burst */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(59,130,246,${0.08 * glowIntensity}), transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Logo text */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          fontSize: 28,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          color: BRAND.blue,
          letterSpacing: 6,
          textTransform: "uppercase",
          marginBottom: 40,
          opacity: 0.7,
        }}
      >
        ClarityWorks Studio
      </div>

      {/* Main CTA */}
      <div
        style={{
          ...heading,
          fontSize: 78,
          opacity: titleOpacity,
          transform: `translateY(${interpolate(titleY, [0, 1], [30, 0])}px)`,
          marginBottom: 20,
        }}
      >
        Stop Losing Leads.
      </div>
      <div
        style={{
          ...heading,
          fontSize: 78,
          opacity: titleOpacity,
          transform: `translateY(${interpolate(titleY, [0, 1], [30, 0])}px)`,
        }}
      >
        Start{" "}
        <span
          style={{
            background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.emerald})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Converting 24/7.
        </span>
      </div>

      {/* CTA Button */}
      <div
        style={{
          marginTop: 55,
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          padding: "22px 60px",
          borderRadius: 60,
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.indigo})`,
          color: BRAND.white,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 26,
          boxShadow: `0 0 60px ${BRAND.blueGlow}, 0 10px 40px rgba(0,0,0,0.4)`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        Book Your Free Strategy Call
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>

      {/* URL */}
      <div
        style={{
          marginTop: 35,
          opacity: urlOpacity,
          fontSize: 22,
          fontWeight: 600,
          fontFamily: "system-ui, sans-serif",
          color: BRAND.slate,
          letterSpacing: 1,
        }}
      >
        clarityworksstudio.com
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          fontSize: 16,
          fontWeight: 600,
          fontFamily: "system-ui, sans-serif",
          color: "rgba(148,163,184,0.4)",
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Agentic AI Consulting &bull; Toronto, Canada
      </div>
    </div>
  );
};
