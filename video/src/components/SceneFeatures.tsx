import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BRAND, centered, heading } from "./styles";

// Scene 4: Features — what the AI receptionist does (20-32s = frames 600-960)
export const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      title: "Answers Every Call",
      desc: "24/7/365 — never miss another lead",
      color: BRAND.blue,
      delay: 10,
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/>
        </svg>
      ),
      title: "Books Appointments",
      desc: "Syncs directly with your calendar",
      color: BRAND.emerald,
      delay: 55,
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: "Qualifies Leads",
      desc: "Asks the right questions, captures intent",
      color: BRAND.indigo,
      delay: 100,
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>
        </svg>
      ),
      title: "Handles FAQs",
      desc: "Trained on your business knowledge",
      color: BRAND.amber,
      delay: 145,
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: "Routes to Team",
      desc: "Escalates urgent calls to the right person",
      color: "#EC4899",
      delay: 190,
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>
        </svg>
      ),
      title: "Captures Everything",
      desc: "Full transcripts + CRM integration",
      color: "#06B6D4",
      delay: 235,
    },
  ];

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ ...centered, width: "100%", height: "100%", padding: "60px 100px", position: "relative" }}>
      <div style={{ ...heading, fontSize: 52, opacity: titleOpacity, marginBottom: 60 }}>
        Everything It Does.{" "}
        <span style={{ color: BRAND.blue }}>Automatically.</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 30,
          width: "100%",
          maxWidth: 1500,
        }}
      >
        {features.map((feat, i) => {
          const cardScale = spring({ frame: frame - feat.delay, fps, config: { damping: 14, stiffness: 80 } });
          const cardOpacity = interpolate(frame, [feat.delay, feat.delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 24,
                padding: "36px 32px",
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: `${feat.color}15`,
                  border: `1px solid ${feat.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: feat.color,
                  flexShrink: 0,
                }}
              >
                {feat.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: BRAND.white,
                    fontFamily: "system-ui, sans-serif",
                    marginBottom: 6,
                  }}
                >
                  {feat.title}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: BRAND.slateDark,
                    fontFamily: "system-ui, sans-serif",
                    lineHeight: 1.4,
                  }}
                >
                  {feat.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
