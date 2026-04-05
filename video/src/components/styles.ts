import React from "react";

// Brand colors
export const BRAND = {
  bg: "#050B1A",
  bgLight: "#0d1626",
  blue: "#3B82F6",
  blueDark: "#1E40AF",
  blueGlow: "rgba(59, 130, 246, 0.4)",
  indigo: "#6366F1",
  emerald: "#10B981",
  amber: "#F59E0B",
  white: "#FFFFFF",
  slate: "#94A3B8",
  slateDark: "#475569",
};

// Common style helpers
export const fullScreen: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
};

export const centered: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};

export const heading: React.CSSProperties = {
  fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  fontWeight: 900,
  color: BRAND.white,
  textAlign: "center",
  lineHeight: 1.1,
  letterSpacing: "-0.03em",
};

export const subheading: React.CSSProperties = {
  fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  fontWeight: 600,
  color: BRAND.slate,
  textAlign: "center",
  lineHeight: 1.4,
};
