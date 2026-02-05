import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const COLORS = {
  frontend: { htmx: "#3366CC", alpine: "#8BC0D0" },
  api: "#f59e0b",
  backend: { spring: "#6DB33F", go: "#00ADD8" },
  data: "#336791",
  devtools: {
    actions: "#2088FF",
    sonar: "#FD3456",
    testcontainers: "#2496ED",
    zap: "#00549E",
  },
};

const Node: React.FC<{
  label: string;
  sublabel?: string;
  color: string;
  width: number;
  progress: number;
}> = ({ label, sublabel, color, width, progress }) => (
  <div
    style={{
      width,
      padding: "16px 24px",
      borderRadius: 16,
      backgroundColor: `${color}18`,
      border: `2px solid ${color}`,
      boxShadow: `0 0 25px ${color}25`,
      textAlign: "center",
      opacity: progress,
      transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
    }}
  >
    <div style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>{label}</div>
    {sublabel && (
      <div style={{ fontSize: 14, color, marginTop: 4 }}>{sublabel}</div>
    )}
  </div>
);

const DevToolNode: React.FC<{
  icon: string;
  label: string;
  sublabel: string;
  color: string;
  progress: number;
}> = ({ icon, label, sublabel, color, progress }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      borderRadius: 12,
      backgroundColor: `${color}12`,
      border: `1px solid ${color}60`,
      opacity: progress,
      transform: `translateX(${interpolate(progress, [0, 1], [40, 0])}px)`,
    }}
  >
    <div style={{ fontSize: 28 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>{label}</div>
      <div style={{ fontSize: 13, color }}>{sublabel}</div>
    </div>
  </div>
);

export const ArchitectureDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  // Layer timings (bottom-up reveal)
  const dataProgress = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 100 } });
  const backendProgress = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 100 } });
  const apiProgress = spring({ frame: frame - 60, fps, config: { damping: 12, stiffness: 100 } });
  const frontendProgress = spring({ frame: frame - 80, fps, config: { damping: 12, stiffness: 100 } });

  // Connection arrows (after all layers visible)
  const arrowProgress = interpolate(frame, [100, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dev tools sidebar (after main diagram)
  const devToolsDelays = [150, 162, 174, 186];

  // Dashed line progress (after dev tools)
  const dashedLineProgress = interpolate(frame, [200, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a1a2e 100%)",
        padding: 50,
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 30,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 48, fontWeight: "bold", color: "white" }}>
          Architecture Overview
        </div>
      </div>

      {/* Main layout: diagram (left) + dev tools sidebar (right) */}
      <div style={{ display: "flex", gap: 50, flex: 1 }}>
        {/* Main architecture layers */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 20,
            paddingBottom: 20,
            position: "relative",
          }}
        >
          {/* Frontend layer */}
          <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
            <div
              style={{
                fontSize: 14,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: 2,
                width: 100,
                textAlign: "right",
                opacity: frontendProgress,
              }}
            >
              Frontend
            </div>
            <Node label="HTMX" sublabel="Server-driven UI" color={COLORS.frontend.htmx} width={240} progress={frontendProgress} />
            <Node label="Alpine.js" sublabel="CSP build" color={COLORS.frontend.alpine} width={240} progress={frontendProgress} />
          </div>

          {/* Arrow: frontend → API */}
          <svg width="500" height="40" style={{ opacity: arrowProgress, marginLeft: 100 }}>
            <defs>
              <marker id="arrowDown1" markerWidth="10" markerHeight="7" refX="5" refY="7" orient="auto">
                <polygon points="0 0, 10 0, 5 7" fill="#f59e0b" />
              </marker>
            </defs>
            <line x1="130" y1="0" x2="250" y2="30" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowDown1)" strokeDasharray={`${arrowProgress * 100}`} />
            <line x1="370" y1="0" x2="250" y2="30" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowDown1)" strokeDasharray={`${arrowProgress * 100}`} />
          </svg>

          {/* API layer */}
          <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
            <div
              style={{
                fontSize: 14,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: 2,
                width: 100,
                textAlign: "right",
                opacity: apiProgress,
              }}
            >
              API
            </div>
            <Node label="HTTP / REST API" color={COLORS.api} width={510} progress={apiProgress} />
          </div>

          {/* Arrow: API → backend */}
          <svg width="500" height="40" style={{ opacity: arrowProgress, marginLeft: 100 }}>
            <defs>
              <marker id="arrowDown2" markerWidth="10" markerHeight="7" refX="5" refY="7" orient="auto">
                <polygon points="0 0, 10 0, 5 7" fill="#6DB33F" />
              </marker>
            </defs>
            <line x1="170" y1="0" x2="130" y2="30" stroke="#6DB33F" strokeWidth="2" markerEnd="url(#arrowDown2)" strokeDasharray={`${arrowProgress * 100}`} />
            <line x1="330" y1="0" x2="370" y2="30" stroke="#00ADD8" strokeWidth="2" markerEnd="url(#arrowDown2)" strokeDasharray={`${arrowProgress * 100}`} />
          </svg>

          {/* Backend layer */}
          <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
            <div
              style={{
                fontSize: 14,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: 2,
                width: 100,
                textAlign: "right",
                opacity: backendProgress,
              }}
            >
              Backend
            </div>
            <Node label="Spring Boot" sublabel="Java" color={COLORS.backend.spring} width={240} progress={backendProgress} />
            <Node label="Go (stdlib)" sublabel="No framework" color={COLORS.backend.go} width={240} progress={backendProgress} />
          </div>

          {/* Arrow: backend → data */}
          <svg width="500" height="40" style={{ opacity: arrowProgress, marginLeft: 100 }}>
            <defs>
              <marker id="arrowDown3" markerWidth="10" markerHeight="7" refX="5" refY="7" orient="auto">
                <polygon points="0 0, 10 0, 5 7" fill="#336791" />
              </marker>
            </defs>
            <line x1="130" y1="0" x2="250" y2="30" stroke="#336791" strokeWidth="2" markerEnd="url(#arrowDown3)" strokeDasharray={`${arrowProgress * 100}`} />
            <line x1="370" y1="0" x2="250" y2="30" stroke="#336791" strokeWidth="2" markerEnd="url(#arrowDown3)" strokeDasharray={`${arrowProgress * 100}`} />
          </svg>

          {/* Data layer */}
          <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
            <div
              style={{
                fontSize: 14,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: 2,
                width: 100,
                textAlign: "right",
                opacity: dataProgress,
              }}
            >
              Data
            </div>
            <Node label="PostgreSQL" sublabel="Docker (dev)" color={COLORS.data} width={510} progress={dataProgress} />
          </div>
        </div>

        {/* Dev Tools Sidebar */}
        <div
          style={{
            width: 320,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Sidebar header */}
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 8,
              opacity: spring({ frame: frame - 145, fps, config: { damping: 15, stiffness: 100 } }),
            }}
          >
            Dev Tools
          </div>

          <DevToolNode
            icon="🔄"
            label="GitHub Actions"
            sublabel="CI/CD Pipeline"
            color={COLORS.devtools.actions}
            progress={spring({ frame: frame - devToolsDelays[0], fps, config: { damping: 12, stiffness: 100 } })}
          />
          <DevToolNode
            icon="🔍"
            label="SonarCloud"
            sublabel="Code Quality"
            color={COLORS.devtools.sonar}
            progress={spring({ frame: frame - devToolsDelays[1], fps, config: { damping: 12, stiffness: 100 } })}
          />
          <DevToolNode
            icon="🧪"
            label="Testcontainers"
            sublabel="DB Integration Tests"
            color={COLORS.devtools.testcontainers}
            progress={spring({ frame: frame - devToolsDelays[2], fps, config: { damping: 12, stiffness: 100 } })}
          />
          <DevToolNode
            icon="🛡️"
            label="ZAP Proxy"
            sublabel="DAST Security"
            color={COLORS.devtools.zap}
            progress={spring({ frame: frame - devToolsDelays[3], fps, config: { damping: 12, stiffness: 100 } })}
          />

          {/* Dashed connection lines (SVG overlay) */}
          <svg
            width="320"
            height="400"
            style={{
              position: "absolute",
              left: -50,
              top: 50,
              pointerEvents: "none",
              opacity: dashedLineProgress * 0.4,
            }}
          >
            {/* Dashed lines from dev tools to main diagram */}
            <line x1="0" y1="70" x2="-30" y2="70" stroke={COLORS.devtools.actions} strokeWidth="1" strokeDasharray="6,4" />
            <line x1="0" y1="150" x2="-30" y2="200" stroke={COLORS.devtools.sonar} strokeWidth="1" strokeDasharray="6,4" />
            <line x1="0" y1="230" x2="-30" y2="310" stroke={COLORS.devtools.testcontainers} strokeWidth="1" strokeDasharray="6,4" />
            <line x1="0" y1="310" x2="-30" y2="130" stroke={COLORS.devtools.zap} strokeWidth="1" strokeDasharray="6,4" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default ArchitectureDiagram;
