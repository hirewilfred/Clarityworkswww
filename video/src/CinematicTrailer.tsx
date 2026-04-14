import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Img,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  staticFile,
} from "remotion";

/*
 * ClarityWorks Studio — 6-Second Cinematic AI Agent Trailer
 *
 * Brand:
 *   Primary Blue: #5c7cff
 *   Accent: #a5b4fc
 *   Background: #050614
 *   Font: Plus Jakarta Sans, weight 900
 *   Glass: rgba(255,255,255,0.03) + blur
 *
 * Structure (180 frames @ 30fps):
 *   Beat 1 (0-30):   Flash — city at night, "THE FUTURE" text slam
 *   Beat 2 (25-60):  Team collab photo, "ISN'T COMING" text slam
 *   Beat 3 (55-90):  AI tech visual, "IT'S HERE." big reveal
 *   Beat 4 (85-130): Professional + team montage, feature text
 *   Beat 5 (125-160): Logo + tagline resolve
 *   Beat 6 (155-180): CTA + URL
 */

const BLUE = "#5c7cff";
const ACCENT = "#a5b4fc";
const BG = "#050614";
const WHITE = "#ffffff";

const FONT: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
  fontWeight: 900,
  letterSpacing: "-0.03em",
  lineHeight: 1,
};

// ─── Cinematic Ken Burns image ───
const CinematicImage: React.FC<{
  src: string;
  zoomStart?: number;
  zoomEnd?: number;
  panX?: number;
  panY?: number;
  opacity?: number;
  blur?: number;
}> = ({ src, zoomStart = 1.05, zoomEnd = 1.15, panX = 0, panY = 0, opacity = 1, blur = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [zoomStart, zoomEnd]);
  const x = interpolate(frame, [0, durationInFrames], [0, panX]);
  const y = interpolate(frame, [0, durationInFrames], [0, panY]);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom}) translate(${x}px, ${y}px)`,
          opacity,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      {/* Cinematic color grade overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${BG}cc 0%, ${BG}66 40%, ${BG}99 100%)`,
          mixBlendMode: "multiply",
        }}
      />
      {/* Brand blue tint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${BLUE}20, transparent 60%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Text slam (movie trailer title card) ───
const TextSlam: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  gradient?: boolean;
}> = ({ text, fontSize = 120, color = WHITE, delay = 0, gradient = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 200, mass: 0.8 },
  });
  const opacity = interpolate(frame, [delay, delay + 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textStyle: React.CSSProperties = gradient
    ? {
        background: `linear-gradient(135deg, ${WHITE} 30%, ${ACCENT} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }
    : { color };

  return (
    <div
      style={{
        ...FONT,
        fontSize,
        opacity,
        transform: `scale(${interpolate(scale, [0, 1], [1.4, 1])})`,
        textAlign: "center",
        textShadow: gradient ? undefined : `0 0 80px ${BLUE}60, 0 4px 30px ${BG}`,
        ...textStyle,
      }}
    >
      {text}
    </div>
  );
};

// ─── Flash / strobe transition ───
const Flash: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const flashOpacity = interpolate(frame, [at, at + 2, at + 5], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: WHITE,
        opacity: flashOpacity,
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
};

// ─── Letterbox bars ───
const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: BG, zIndex: 90 }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: BG, zIndex: 90 }} />
  </>
);

// ─── Main Composition ───
export const CinematicTrailer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Global vignette
  const vignetteOpacity = 0.7;

  return (
    <AbsoluteFill style={{ background: BG }}>

      {/* ═══ BEAT 1: City at night — "THE FUTURE" (frames 0-30) ═══ */}
      <Sequence from={0} durationInFrames={35}>
        <CinematicImage src="images/city-night.jpg" zoomStart={1.0} zoomEnd={1.12} panX={-15} />
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TextSlam text="THE FUTURE" fontSize={140} delay={5} />
        </AbsoluteFill>
      </Sequence>

      {/* ═══ BEAT 2: Team collaboration — "ISN'T COMING" (frames 25-60) ═══ */}
      <Sequence from={28} durationInFrames={37}>
        <CinematicImage src="images/team-collab.jpg" zoomStart={1.1} zoomEnd={1.0} panX={10} panY={-5} />
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TextSlam text="ISN'T COMING" fontSize={130} delay={4} />
        </AbsoluteFill>
      </Sequence>

      {/* ═══ BEAT 3: AI tech — "IT'S HERE." (frames 55-95) ═══ */}
      <Sequence from={60} durationInFrames={40}>
        <CinematicImage src="images/ai-tech.jpg" zoomStart={1.0} zoomEnd={1.2} panY={8} />
        {/* Glow pulse behind text */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${BLUE}30, transparent 70%)`,
              filter: "blur(60px)",
              animation: "none",
              opacity: Math.sin(frame * 0.15) * 0.3 + 0.7,
            }}
          />
          <TextSlam text="IT'S HERE." fontSize={160} delay={5} gradient />
        </AbsoluteFill>
      </Sequence>

      {/* ═══ BEAT 4: People montage + feature lines (frames 90-135) ═══ */}
      <Sequence from={95} durationInFrames={45}>
        {/* Split: professional woman left, business team right */}
        <AbsoluteFill>
          <CinematicImage src="images/professional-woman.jpg" zoomStart={1.05} zoomEnd={1.1} panX={-8} opacity={0.85} />
        </AbsoluteFill>

        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {(() => {
              const f = useCurrentFrame();
              const lines = [
                { text: "AI Agents That Work 24/7", delay: 4 },
                { text: "So Your Team Doesn't Have To", delay: 14 },
              ];
              return lines.map((line, i) => {
                const lineOpacity = interpolate(f, [line.delay, line.delay + 5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const lineX = interpolate(f, [line.delay, line.delay + 8], [60, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <div
                    key={i}
                    style={{
                      ...FONT,
                      fontSize: i === 0 ? 72 : 56,
                      color: i === 0 ? WHITE : ACCENT,
                      opacity: lineOpacity,
                      transform: `translateX(${lineX}px)`,
                      textShadow: `0 0 60px ${BG}, 0 0 120px ${BG}`,
                    }}
                  >
                    {line.text}
                  </div>
                );
              });
            })()}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ═══ BEAT 5: Logo resolve (frames 130-162) ═══ */}
      <Sequence from={133} durationInFrames={32}>
        <CinematicImage src="images/team-meeting.jpg" zoomStart={1.15} zoomEnd={1.05} blur={3} opacity={0.35} />
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {(() => {
            const f = useCurrentFrame();
            const logoScale = spring({ frame: f - 3, fps, config: { damping: 15, stiffness: 100 } });
            const tagOpacity = interpolate(f, [12, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <>
                <div
                  style={{
                    ...FONT,
                    fontSize: 64,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    transform: `scale(${logoScale})`,
                    background: `linear-gradient(135deg, ${WHITE} 30%, ${ACCENT} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "none",
                  }}
                >
                  ClarityWorks Studio
                </div>
                <div
                  style={{
                    ...FONT,
                    fontSize: 26,
                    fontWeight: 600,
                    color: ACCENT,
                    opacity: tagOpacity,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                  }}
                >
                  Agentic AI Consulting
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      </Sequence>

      {/* ═══ BEAT 6: CTA (frames 155-180) ═══ */}
      <Sequence from={157} durationInFrames={23}>
        <AbsoluteFill style={{ background: BG }} />
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {(() => {
            const f = useCurrentFrame();
            const ctaScale = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 120 } });
            const urlOpacity = interpolate(f, [8, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <>
                <div
                  style={{
                    ...FONT,
                    fontSize: 48,
                    color: WHITE,
                    transform: `scale(${ctaScale})`,
                    textAlign: "center",
                  }}
                >
                  Book Your Free Strategy Call
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: "10px 40px",
                    borderRadius: 50,
                    background: `linear-gradient(135deg, ${BLUE}, #818cf8)`,
                    opacity: urlOpacity,
                    boxShadow: `0 0 50px ${BLUE}50`,
                  }}
                >
                  <span
                    style={{
                      ...FONT,
                      fontSize: 28,
                      fontWeight: 700,
                      color: WHITE,
                      letterSpacing: "0.05em",
                    }}
                  >
                    clarityworksstudio.com
                  </span>
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      </Sequence>

      {/* ═══ FLASH TRANSITIONS ═══ */}
      <Flash at={28} />
      <Flash at={60} />
      <Flash at={95} />
      <Flash at={133} />
      <Flash at={157} />

      {/* ═══ CINEMATIC LETTERBOX ═══ */}
      <Letterbox />

      {/* ═══ VIGNETTE ═══ */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, ${BG} 100%)`,
          opacity: vignetteOpacity,
          pointerEvents: "none",
          zIndex: 80,
        }}
      />

      {/* ═══ TOP ACCENT LINE ═══ */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          width: "100%",
          height: 2,
          background: `linear-gradient(90deg, transparent 10%, ${BLUE}80 50%, transparent 90%)`,
          opacity: 0.5,
          zIndex: 91,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          width: "100%",
          height: 2,
          background: `linear-gradient(90deg, transparent 10%, ${BLUE}80 50%, transparent 90%)`,
          opacity: 0.5,
          zIndex: 91,
        }}
      />
    </AbsoluteFill>
  );
};
