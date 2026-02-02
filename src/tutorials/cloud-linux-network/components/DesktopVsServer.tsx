import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const comparisons = [
  { aspect: "Interface", desktop: "GUI (Graphical)", server: "CLI (Terminal only)" },
  { aspect: "RAM Usage", desktop: "2-4 GB minimum", server: "512 MB - 1 GB" },
  { aspect: "Disk Usage", desktop: "25+ GB", server: "5-10 GB" },
  { aspect: "Use Case", desktop: "Daily use, Learning", server: "Production, Services" },
  { aspect: "Remote Access", desktop: "Optional", server: "SSH (essential)" },
  { aspect: "Auto Updates", desktop: "GUI prompts", server: "Manual / automated" },
];

export const DesktopVsServer: React.FC = () => {
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
          Ubuntu Desktop vs Server
        </h1>
      </div>

      {/* Side by side comparison */}
      <div className="flex justify-center gap-8 mb-8">
        {/* Desktop */}
        <div
          className="w-[400px] rounded-2xl overflow-hidden"
          style={{
            opacity: spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 100 } }),
            border: `2px solid #8b5cf6`,
          }}
        >
          <div className="p-4 text-center" style={{ backgroundColor: "#8b5cf620" }}>
            <h2 className="text-2xl font-bold" style={{ color: "#8b5cf6" }}>Ubuntu Desktop</h2>
          </div>
          <div className="p-4 bg-slate-800/30">
            {/* Mock desktop UI */}
            <div className="bg-slate-700 rounded-lg p-2 h-48 flex flex-col">
              <div className="flex gap-1 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 flex gap-2">
                <div className="w-12 bg-slate-600 rounded" />
                <div className="flex-1 bg-slate-600/50 rounded flex items-center justify-center">
                  <span className="text-slate-400 text-sm">GUI Window</span>
                </div>
              </div>
              <div className="h-6 bg-slate-600 rounded mt-2 flex items-center px-2">
                <span className="text-xs text-slate-400">Taskbar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Server */}
        <div
          className="w-[400px] rounded-2xl overflow-hidden"
          style={{
            opacity: spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 100 } }),
            border: `2px solid ${TERMINAL_GREEN}`,
          }}
        >
          <div className="p-4 text-center" style={{ backgroundColor: `${TERMINAL_GREEN}20` }}>
            <h2 className="text-2xl font-bold" style={{ color: TERMINAL_GREEN }}>Ubuntu Server</h2>
          </div>
          <div className="p-4 bg-slate-900/50">
            {/* Mock terminal */}
            <div className="bg-black rounded-lg p-3 h-48 font-mono text-sm" style={{ color: TERMINAL_GREEN }}>
              <div className="mb-1">Ubuntu 24.04 LTS</div>
              <div className="mb-1">server login: admin</div>
              <div className="mb-1">Password: ****</div>
              <div className="mb-2">Last login: Mon Jan 1 00:00</div>
              <div className="flex">
                <span className="text-green-400">admin@server</span>
                <span className="text-slate-500">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-slate-500">$</span>
                <span className="ml-1 animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="max-w-4xl mx-auto">
        {comparisons.map((row, i) => {
          const delay = 35 + i * 6;
          const rowSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div
              key={row.aspect}
              className="grid grid-cols-3 gap-4 mb-2"
              style={{
                opacity: rowSpring,
                transform: `translateY(${(1 - rowSpring) * 10}px)`,
              }}
            >
              <div className="text-right text-slate-500 py-2">{row.aspect}</div>
              <div className="text-center py-2 rounded-lg" style={{ backgroundColor: "#8b5cf615", color: "#c4b5fd" }}>
                {row.desktop}
              </div>
              <div className="text-center py-2 rounded-lg" style={{ backgroundColor: `${TERMINAL_GREEN}15`, color: TERMINAL_GREEN }}>
                {row.server}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        style={{
          opacity: spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <p className="text-lg text-slate-400">
          Mulai dengan <span style={{ color: "#8b5cf6" }}>Desktop</span> untuk belajar,
          lanjut ke <span style={{ color: TERMINAL_GREEN }}>Server</span> untuk production
        </p>
      </div>
    </AbsoluteFill>
  );
};
