import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const checklist = [
  { task: "Update sistem", command: "sudo apt update && sudo apt upgrade", priority: "high" },
  { task: "Install Guest Additions", command: "Devices → Insert Guest Additions CD", priority: "high" },
  { task: "Reboot setelah update", command: "sudo reboot", priority: "medium" },
  { task: "Buat Snapshot", command: "VirtualBox → Snapshots → Take", priority: "high" },
  { task: "Test internet", command: "ping google.com", priority: "medium" },
  { task: "Cek disk space", command: "df -h", priority: "low" },
];

export const PostInstallChecklist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  const priorityColors: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  };

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
          Post-Install Checklist
        </h1>
        <p className="text-lg text-slate-400">Lakukan setelah instalasi selesai</p>
      </div>

      {/* Checklist */}
      <div className="max-w-4xl mx-auto">
        {checklist.map((item, i) => {
          const delay = 20 + i * 10;
          const itemSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
          const checkDelay = delay + 15;
          const checkSpring = spring({ frame: frame - checkDelay, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div
              key={item.task}
              className="flex items-center gap-4 p-4 mb-3 rounded-xl"
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                border: "1px solid rgba(71, 85, 105, 0.3)",
                transform: `translateX(${(1 - itemSpring) * -30}px)`,
                opacity: itemSpring,
              }}
            >
              {/* Checkbox */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: checkSpring > 0.5 ? TERMINAL_GREEN : "transparent",
                  border: `2px solid ${TERMINAL_GREEN}`,
                  transition: "background-color 0.2s",
                }}
              >
                {checkSpring > 0.5 && (
                  <svg className="w-5 h-5" fill="none" stroke={TERMINAL_BG} viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Task */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xl text-slate-200">{item.task}</span>
                  <span
                    className="px-2 py-0.5 rounded text-xs uppercase"
                    style={{
                      backgroundColor: `${priorityColors[item.priority]}30`,
                      color: priorityColors[item.priority],
                    }}
                  >
                    {item.priority}
                  </span>
                </div>
                <code
                  className="text-sm font-mono mt-1 block"
                  style={{ color: TERMINAL_GREEN, opacity: 0.8 }}
                >
                  {item.command}
                </code>
              </div>
            </div>
          );
        })}
      </div>

      {/* Important note */}
      <div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-4 rounded-xl"
        style={{
          backgroundColor: `${TERMINAL_GREEN}15`,
          border: `2px solid ${TERMINAL_GREEN}60`,
          opacity: spring({ frame: frame - 90, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <p className="text-lg text-slate-300">
          <span style={{ color: TERMINAL_GREEN }}>💡 Snapshot</span> = Save point. Bisa rollback jika ada masalah!
        </p>
      </div>
    </AbsoluteFill>
  );
};
