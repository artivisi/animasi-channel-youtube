import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

import postgresqlScreenshot from "../assets/screenshots/postgresql-homepage.png";
import springBootScreenshot from "../assets/screenshots/spring-boot-homepage.png";
import golangScreenshot from "../assets/screenshots/golang-homepage.png";
import htmxScreenshot from "../assets/screenshots/htmx-homepage.png";
import alpineScreenshot from "../assets/screenshots/alpinejs-homepage.png";

type BackendTech = {
  name: string;
  subtitle: string;
  color: string;
  icon: string;
  screenshot: string;
  keyPoints: string[];
};

const techs: BackendTech[] = [
  {
    name: "PostgreSQL + Docker",
    subtitle: "Relational Database via Containers",
    color: "#336791",
    icon: "🐘",
    screenshot: postgresqlScreenshot,
    keyPoints: [
      "Reliable open-source RDBMS",
      "Docker for dev environment — no local install",
      "Production-grade features: JSONB, CTE, window functions",
    ],
  },
  {
    name: "Spring Boot",
    subtitle: "Java Enterprise Framework",
    color: "#6DB33F",
    icon: "🍃",
    screenshot: springBootScreenshot,
    keyPoints: [
      "Rapid development with convention over configuration",
      "Production-ready defaults (actuator, security)",
      "Massive ecosystem: Spring Data, Spring Security",
    ],
  },
  {
    name: "Go (no framework)",
    subtitle: "Lightweight Backend, stdlib-first",
    color: "#00ADD8",
    icon: "🐹",
    screenshot: golangScreenshot,
    keyPoints: [
      "Standard library covers HTTP, JSON, SQL",
      "Fast compilation, single binary deployment",
      "Low memory footprint, great concurrency",
    ],
  },
  {
    name: "HTMX",
    subtitle: "Server-Driven UI Interactions",
    color: "#3366CC",
    icon: "⚡",
    screenshot: htmxScreenshot,
    keyPoints: [
      "No JavaScript build step needed",
      "Server returns HTML fragments",
      "Hypermedia-driven: REST as it was meant to be",
    ],
  },
  {
    name: "Alpine.js (CSP build)",
    subtitle: "Lightweight JS with Security",
    color: "#8BC0D0",
    icon: "🏔️",
    screenshot: alpineScreenshot,
    keyPoints: [
      "CSP build — no eval(), no inline scripts",
      "Content Security Policy compliant",
      "Minimal footprint, pairs with HTMX",
    ],
  },
];

const FRAMES_PER_TECH = 150;

export const BackendStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentIndex = Math.min(Math.floor(frame / FRAMES_PER_TECH), techs.length - 1);
  const localFrame = frame - currentIndex * FRAMES_PER_TECH;

  const tech = techs[currentIndex];

  // Screenshot animation
  const screenshotProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Info card animation
  const cardProgress = spring({
    frame: localFrame - 8,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Key points staggered
  const keyPointProgresses = tech.keyPoints.map((_, i) =>
    spring({
      frame: localFrame - 15 - i * 8,
      fps,
      config: { damping: 12, stiffness: 100 },
    })
  );

  // Exit fade (last 20 frames of each section, except last tech)
  const isLastTech = currentIndex === techs.length - 1;
  const exitOpacity = isLastTech
    ? 1
    : interpolate(localFrame, [FRAMES_PER_TECH - 20, FRAMES_PER_TECH], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a1a2e 100%)",
        padding: 50,
        opacity: exitOpacity,
      }}
    >
      {/* Category label */}
      <div
        style={{
          fontSize: 18,
          color: "#6DB33F",
          textTransform: "uppercase",
          letterSpacing: 3,
          fontWeight: "bold",
          marginBottom: 30,
          opacity: cardProgress,
        }}
      >
        Backend · {currentIndex + 1}/{techs.length}
      </div>

      {/* Main content: screenshot + info */}
      <div style={{ display: "flex", gap: 50, flex: 1 }}>
        {/* Screenshot (left 55%) */}
        <div
          style={{
            flex: "0 0 55%",
            borderRadius: 16,
            overflow: "hidden",
            border: `2px solid ${tech.color}40`,
            boxShadow: `0 0 40px ${tech.color}20`,
            opacity: screenshotProgress,
            transform: `translateX(${interpolate(screenshotProgress, [0, 1], [-40, 0])}px)`,
          }}
        >
          <Img
            src={tech.screenshot}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Info card (right 45%) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: cardProgress,
            transform: `translateX(${interpolate(cardProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Icon + Name */}
          <div style={{ fontSize: 56, marginBottom: 12 }}>{tech.icon}</div>
          <div style={{ fontSize: 42, fontWeight: "bold", color: "white", marginBottom: 8 }}>
            {tech.name}
          </div>
          <div style={{ fontSize: 22, color: tech.color, marginBottom: 40 }}>
            {tech.subtitle}
          </div>

          {/* Key points */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tech.keyPoints.map((point, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  opacity: keyPointProgresses[i],
                  transform: `translateX(${interpolate(keyPointProgresses[i], [0, 1], [20, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: tech.color,
                    marginTop: 10,
                    flexShrink: 0,
                  }}
                />
                <div style={{ fontSize: 22, color: "#e2e8f0", lineHeight: 1.4 }}>{point}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 30 }}>
        {techs.map((t, i) => (
          <div
            key={t.name}
            style={{
              width: i === currentIndex ? 32 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i === currentIndex ? t.color : "#334155",
              transition: "width 0.3s",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export default BackendStack;
