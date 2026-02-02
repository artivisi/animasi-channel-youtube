import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const steps = [
  { num: 1, title: "Boot from ISO", desc: "Start VM, pilih ISO file" },
  { num: 2, title: "Try or Install", desc: "Pilih 'Install Ubuntu'" },
  { num: 3, title: "Keyboard Layout", desc: "Pilih English (US)" },
  { num: 4, title: "Installation Type", desc: "Erase disk (VM only!)" },
  { num: 5, title: "Timezone", desc: "Pilih Asia/Jakarta" },
  { num: 6, title: "User Setup", desc: "Nama, username, password" },
  { num: 7, title: "Wait...", desc: "Proses instalasi ~10-15 menit" },
  { num: 8, title: "Reboot", desc: "Remove ISO, restart VM" },
];

export const InstallationSteps: React.FC = () => {
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
          className="text-4xl font-bold mb-2"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          Langkah Instalasi Ubuntu
        </h1>
        <p className="text-lg text-slate-400">8 langkah sederhana</p>
      </div>

      {/* Steps flowchart */}
      <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
        {steps.map((step, i) => {
          const delay = 15 + i * 8;
          const stepSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
          const isLastInRow = (i + 1) % 4 === 0;
          const isLast = i === steps.length - 1;

          return (
            <div key={step.num} className="flex items-center">
              <div
                className="flex flex-col items-center p-4 rounded-xl w-52"
                style={{
                  backgroundColor: `${TERMINAL_GREEN}15`,
                  border: `2px solid ${TERMINAL_GREEN}60`,
                  boxShadow: `0 0 20px ${TERMINAL_GREEN}20`,
                  transform: `scale(${stepSpring})`,
                  opacity: stepSpring,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-3"
                  style={{
                    backgroundColor: TERMINAL_GREEN,
                    color: TERMINAL_BG,
                  }}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-center" style={{ color: TERMINAL_GREEN }}>
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 text-center mt-1">{step.desc}</p>
              </div>

              {/* Arrow */}
              {!isLast && !isLastInRow && (
                <div className="mx-2" style={{ opacity: stepSpring }}>
                  <svg width="30" height="20" viewBox="0 0 30 20">
                    <path
                      d="M0 10 H20 M15 5 L25 10 L15 15"
                      stroke={TERMINAL_GREEN}
                      strokeWidth="2"
                      fill="none"
                      opacity="0.5"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-8"
        style={{
          opacity: spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">⚠</span>
          <span className="text-slate-400">"Erase disk" aman karena ini VM</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ color: TERMINAL_GREEN }}>💡</span>
          <span className="text-slate-400">Password harus diingat!</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
