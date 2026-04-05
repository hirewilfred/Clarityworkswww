import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BRAND, centered, heading } from "./styles";

// Scene 5: ROI / Time Savings (32-39s = frames 960-1170)
export const SceneROI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Animated counter
  const hoursCount = Math.round(interpolate(frame, [40, 120], [0, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const savingsCount = Math.round(interpolate(frame, [60, 140], [0, 75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const callsCount = Math.round(interpolate(frame, [80, 150], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const stats = [
    { value: `${hoursCount}+`, label: "Hours Saved Monthly", color: BRAND.emerald, delay: 40 },
    { value: `$${savingsCount}K`, label: "Revenue Recovered", color: BRAND.blue, delay: 60 },
    { value: `${callsCount}%`, label: "Calls Answered", color: BRAND.indigo, delay: 80 },
  ];

  // Progress bar
  const barWidth = interpolate(frame, [100, 170], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const comparisonOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ ...centered, width: "100%", height: "100%", position: "relative", padding: "60px 120px" }}>
      <div style={{ ...heading, fontSize: 56, opacity: titleOpacity, marginBottom: 70 }}>
        The Numbers{" "}
        <span style={{ color: BRAND.emerald }}>Speak for Themselves</span>
      </div>

      {/* Big stats */}
      <div style={{ display: "flex", gap: 80, marginBottom: 70 }}>
        {stats.map((stat, i) => {
          const scale = spring({ frame: frame - stat.delay, fps, config: { damping: 12, stiffness: 70 } });
          const opacity = interpolate(frame, [stat.delay, stat.delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{ textAlign: "center", opacity, transform: `scale(${scale})` }}>
              <div
                style={{
                  fontSize: 100,
                  fontWeight: 900,
                  fontFamily: "system-ui, sans-serif",
                  color: stat.color,
                  lineHeight: 1,
                  textShadow: `0 0 50px ${stat.color}60`,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: BRAND.slate,
                  fontFamily: "system-ui, sans-serif",
                  marginTop: 15,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Before/After comparison bars */}
      <div style={{ width: "100%", maxWidth: 900, opacity: comparisonOpacity }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
          <div style={{ width: 180, fontSize: 18, fontWeight: 700, color: BRAND.slate, fontFamily: "system-ui, sans-serif", textAlign: "right" }}>
            Without AI Agent
          </div>
          <div style={{ flex: 1, height: 36, background: "rgba(255,255,255,0.05)", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div
              style={{
                height: "100%",
                width: "38%",
                background: "linear-gradient(90deg, #F87171, #EF4444)",
                borderRadius: 18,
                boxShadow: "0 0 20px rgba(248,113,113,0.3)",
              }}
            />
          </div>
          <div style={{ width: 60, fontSize: 18, fontWeight: 800, color: "#F87171", fontFamily: "system-ui, sans-serif" }}>38%</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 180, fontSize: 18, fontWeight: 700, color: BRAND.white, fontFamily: "system-ui, sans-serif", textAlign: "right" }}>
            With AI Receptionist
          </div>
          <div style={{ flex: 1, height: 36, background: "rgba(255,255,255,0.05)", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div
              style={{
                height: "100%",
                width: `${barWidth}%`,
                background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.emerald})`,
                borderRadius: 18,
                boxShadow: `0 0 25px ${BRAND.blueGlow}`,
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <div style={{ width: 60, fontSize: 18, fontWeight: 800, color: BRAND.emerald, fontFamily: "system-ui, sans-serif" }}>100%</div>
        </div>
      </div>
    </div>
  );
};
