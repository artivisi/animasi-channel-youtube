import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

import testcontainersScreenshot from "../assets/screenshots/testcontainers-homepage.png";
import sonarcloudScreenshot from "../assets/screenshots/sonarcloud-homepage.png";
import zapScreenshot from "../assets/screenshots/zap-proxy-homepage.png";
import githubActionsScreenshot from "../assets/screenshots/github-actions-homepage.png";

type DevTool = {
  name: string;
  subtitle: string;
  color: string;
  icon: string;
  screenshot: string;
  keyPoints: string[];
};

const tools: DevTool[] = [
  {
    name: "Testcontainers",
    subtitle: "Integration Testing with Real Dependencies",
    color: "#2496ED",
    icon: "🧪",
    screenshot: testcontainersScreenshot,
    keyPoints: [
      "Real database in tests — no mocks needed",
      "Docker-based, disposable containers",
      "Supports Java (JUnit) and Go",
    ],
  },
  {
    name: "SonarCloud",
    subtitle: "Static Analysis & Code Quality",
    color: "#FD3456",
    icon: "🔍",
    screenshot: sonarcloudScreenshot,
    keyPoints: [
      "Code smell and bug detection",
      "Security vulnerability scanning (SAST)",
      "Quality gates in CI/CD pipeline",
    ],
  },
  {
    name: "ZAP Proxy",
    subtitle: "Dynamic Application Security Testing (DAST)",
    color: "#00549E",
    icon: "🛡️",
    screenshot: zapScreenshot,
    keyPoints: [
      "OWASP maintained — industry standard",
      "Automated security scans against running app",
      "API and web application testing",
    ],
  },
  {
    name: "GitHub Actions",
    subtitle: "CI/CD Pipeline Automation",
    color: "#2088FF",
    icon: "🔄",
    screenshot: githubActionsScreenshot,
    keyPoints: [
      "Built into GitHub — no external CI server",
      "YAML-based workflow definitions",
      "Runs tests, SonarCloud, ZAP on every push",
    ],
  },
];

const FRAMES_PER_TOOL = 150;

export const DevToolsStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentIndex = Math.min(Math.floor(frame / FRAMES_PER_TOOL), tools.length - 1);
  const localFrame = frame - currentIndex * FRAMES_PER_TOOL;

  const tool = tools[currentIndex];

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
  const keyPointProgresses = tool.keyPoints.map((_, i) =>
    spring({
      frame: localFrame - 15 - i * 8,
      fps,
      config: { damping: 12, stiffness: 100 },
    })
  );

  // Exit fade (last 20 frames of each section, except last tool)
  const isLastTool = currentIndex === tools.length - 1;
  const exitOpacity = isLastTool
    ? 1
    : interpolate(localFrame, [FRAMES_PER_TOOL - 20, FRAMES_PER_TOOL], [1, 0], {
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
          color: "#2088FF",
          textTransform: "uppercase",
          letterSpacing: 3,
          fontWeight: "bold",
          marginBottom: 30,
          opacity: cardProgress,
        }}
      >
        Dev Tools · {currentIndex + 1}/{tools.length}
      </div>

      {/* Main content: screenshot + info */}
      <div style={{ display: "flex", gap: 50, flex: 1 }}>
        {/* Screenshot (left 55%) */}
        <div
          style={{
            flex: "0 0 55%",
            borderRadius: 16,
            overflow: "hidden",
            border: `2px solid ${tool.color}40`,
            boxShadow: `0 0 40px ${tool.color}20`,
            opacity: screenshotProgress,
            transform: `translateX(${interpolate(screenshotProgress, [0, 1], [-40, 0])}px)`,
          }}
        >
          <Img
            src={tool.screenshot}
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
          <div style={{ fontSize: 56, marginBottom: 12 }}>{tool.icon}</div>
          <div style={{ fontSize: 42, fontWeight: "bold", color: "white", marginBottom: 8 }}>
            {tool.name}
          </div>
          <div style={{ fontSize: 22, color: tool.color, marginBottom: 40 }}>
            {tool.subtitle}
          </div>

          {/* Key points */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tool.keyPoints.map((point, i) => (
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
                    backgroundColor: tool.color,
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
        {tools.map((t, i) => (
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

export default DevToolsStack;
