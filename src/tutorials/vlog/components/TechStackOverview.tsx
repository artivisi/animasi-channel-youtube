import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

type TechItem = {
  name: string;
  description: string;
  color: string;
  icon: string;
};

const backendTech: TechItem[] = [
  { name: "PostgreSQL + Docker", description: "Relational DB via containers in dev", color: "#336791", icon: "🐘" },
  { name: "Spring Boot", description: "Java enterprise framework", color: "#6DB33F", icon: "🍃" },
  { name: "Go (no framework)", description: "Lightweight backend, stdlib-first", color: "#00ADD8", icon: "🐹" },
  { name: "HTMX", description: "Server-driven UI interactions", color: "#3366CC", icon: "⚡" },
  { name: "Alpine.js (CSP)", description: "Lightweight JS, CSP-compliant", color: "#8BC0D0", icon: "🏔️" },
];

const devToolsTech: TechItem[] = [
  { name: "Testcontainers", description: "Integration testing with real deps", color: "#2496ED", icon: "🧪" },
  { name: "SonarCloud", description: "Static analysis & code quality", color: "#FD3456", icon: "🔍" },
  { name: "ZAP Proxy", description: "Dynamic app security testing", color: "#00549E", icon: "🛡️" },
  { name: "GitHub Actions", description: "CI/CD pipeline automation", color: "#2088FF", icon: "🔄" },
];

const TechCard: React.FC<{
  item: TechItem;
  progress: number;
}> = ({ item, progress }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 20,
      padding: "18px 24px",
      borderRadius: 16,
      backgroundColor: `${item.color}12`,
      border: `2px solid ${item.color}50`,
      boxShadow: `0 0 20px ${item.color}15`,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
    }}
  >
    <div style={{ fontSize: 48 }}>{item.icon}</div>
    <div>
      <div style={{ fontSize: 28, fontWeight: "bold", color: "white" }}>{item.name}</div>
      <div style={{ fontSize: 18, color: item.color, marginTop: 4 }}>{item.description}</div>
    </div>
  </div>
);

export const TechStackOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const subtitleProgress = spring({ frame: frame - 8, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a1a2e 100%)",
        padding: 60,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 50,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: "bold", color: "white" }}>
          ArtiVisi Tech Stack 2026
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 8,
            opacity: subtitleProgress,
          }}
        >
          What we use and why
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: 60, flex: 1 }}>
        {/* Backend column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Column header */}
          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#6DB33F",
              textTransform: "uppercase",
              letterSpacing: 3,
              padding: "10px 20px",
              borderBottom: "2px solid #6DB33F40",
              marginBottom: 8,
              opacity: spring({ frame: frame - 12, fps, config: { damping: 15, stiffness: 100 } }),
            }}
          >
            Backend
          </div>

          {backendTech.map((item, index) => {
            const cardProgress = spring({
              frame: frame - 20 - index * 8,
              fps,
              config: { damping: 12, stiffness: 100 },
            });
            return <TechCard key={item.name} item={item} progress={cardProgress} />;
          })}
        </div>

        {/* Dev Tools column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Column header */}
          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#2088FF",
              textTransform: "uppercase",
              letterSpacing: 3,
              padding: "10px 20px",
              borderBottom: "2px solid #2088FF40",
              marginBottom: 8,
              opacity: spring({ frame: frame - 16, fps, config: { damping: 15, stiffness: 100 } }),
            }}
          >
            Dev Tools
          </div>

          {devToolsTech.map((item, index) => {
            const cardProgress = spring({
              frame: frame - 24 - index * 8,
              fps,
              config: { damping: 12, stiffness: 100 },
            });
            return <TechCard key={item.name} item={item} progress={cardProgress} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default TechStackOverview;
