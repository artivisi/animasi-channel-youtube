import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";
const DOCKER_BLUE = "#2496ED";

const comparisons = [
  { aspect: "Isolasi", vm: "Penuh (kernel terpisah)", container: "Process-level (shared kernel)" },
  { aspect: "Boot Time", vm: "Menit", container: "Detik" },
  { aspect: "Resource", vm: "Heavy (GB per VM)", container: "Light (MB per container)" },
  { aspect: "OS Support", vm: "Any OS", container: "Same OS family" },
  { aspect: "Use Case", vm: "Learn OS, Network sim", container: "Microservices, CI/CD" },
  { aspect: "Contoh", vm: "VirtualBox, VMware", container: "Docker, Podman" },
];

export const VMvsContainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="p-10">
      {/* Title */}
      <div
        className="text-center mb-8"
        style={{
          transform: `translateY(${(1 - titleSpring) * -30}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          VM vs Container
        </h1>
        <p className="text-xl text-slate-400">Kapan pakai yang mana?</p>
      </div>

      {/* Comparison table */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          className="grid grid-cols-3 gap-4 mb-4"
          style={{
            opacity: spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 100 } }),
          }}
        >
          <div className="text-xl font-bold text-slate-500 text-right pr-4">Aspect</div>
          <div
            className="text-xl font-bold text-center py-3 rounded-t-xl"
            style={{ backgroundColor: `${TERMINAL_GREEN}20`, color: TERMINAL_GREEN }}
          >
            Virtual Machine
          </div>
          <div
            className="text-xl font-bold text-center py-3 rounded-t-xl"
            style={{ backgroundColor: `${DOCKER_BLUE}20`, color: DOCKER_BLUE }}
          >
            Container
          </div>
        </div>

        {/* Rows */}
        {comparisons.map((row, i) => {
          const delay = 20 + i * 8;
          const rowSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div
              key={row.aspect}
              className="grid grid-cols-3 gap-4 mb-2"
              style={{
                opacity: rowSpring,
                transform: `translateX(${(1 - rowSpring) * -30}px)`,
              }}
            >
              <div className="text-lg text-slate-400 text-right pr-4 py-3">{row.aspect}</div>
              <div
                className="text-lg text-center py-3 rounded-lg"
                style={{ backgroundColor: `${TERMINAL_GREEN}10`, color: "#e2e8f0" }}
              >
                {row.vm}
              </div>
              <div
                className="text-lg text-center py-3 rounded-lg"
                style={{ backgroundColor: `${DOCKER_BLUE}10`, color: "#e2e8f0" }}
              >
                {row.container}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom recommendation */}
      <div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center"
        style={{
          opacity: spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: `${TERMINAL_GREEN}15`,
            border: `2px solid ${TERMINAL_GREEN}60`,
          }}
        >
          <p className="text-xl text-slate-300">
            Seri ini menggunakan <span style={{ color: TERMINAL_GREEN }} className="font-bold">VM (VirtualBox)</span>
          </p>
          <p className="text-lg text-slate-500 mt-2">
            Karena kita perlu belajar OS dari dasar & simulasi jaringan
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
