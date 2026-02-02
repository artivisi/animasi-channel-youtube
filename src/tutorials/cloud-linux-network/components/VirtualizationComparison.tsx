import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const software = [
  { name: "VirtualBox", os: "Win/Mac/Linux", price: "Gratis", type: "VM", recommended: true, color: "#183A61" },
  { name: "VMware Player", os: "Win/Linux", price: "Gratis*", type: "VM", recommended: false, color: "#607078" },
  { name: "Hyper-V", os: "Win Pro only", price: "Built-in", type: "VM", recommended: false, color: "#0078D4" },
  { name: "Parallels", os: "macOS", price: "~$100/yr", type: "VM", recommended: false, color: "#FF3E30" },
  { name: "UTM", os: "macOS (M1/M2)", price: "Gratis", type: "VM", recommended: false, color: "#1E90FF" },
  { name: "Docker", os: "Win/Mac/Linux", price: "Gratis", type: "Container", recommended: false, color: "#2496ED" },
];

export const VirtualizationComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="p-10">
      {/* Title */}
      <div
        className="text-center mb-6"
        style={{
          transform: `translateY(${(1 - titleSpring) * -30}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          Perbandingan Software Virtualisasi
        </h1>
      </div>

      {/* Table */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          className="grid grid-cols-5 gap-2 mb-3 px-4"
          style={{
            opacity: spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 100 } }),
          }}
        >
          <div className="text-lg font-bold text-slate-500">Software</div>
          <div className="text-lg font-bold text-slate-500">OS Support</div>
          <div className="text-lg font-bold text-slate-500">Harga</div>
          <div className="text-lg font-bold text-slate-500">Type</div>
          <div className="text-lg font-bold text-slate-500">Notes</div>
        </div>

        {/* Rows */}
        {software.map((sw, i) => {
          const delay = 15 + i * 8;
          const rowSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div
              key={sw.name}
              className="grid grid-cols-5 gap-2 mb-2 p-4 rounded-xl"
              style={{
                backgroundColor: sw.recommended ? `${TERMINAL_GREEN}15` : "rgba(30,41,59,0.3)",
                border: sw.recommended ? `2px solid ${TERMINAL_GREEN}` : "2px solid transparent",
                boxShadow: sw.recommended ? `0 0 20px ${TERMINAL_GREEN}20` : "none",
                opacity: rowSpring,
                transform: `translateX(${(1 - rowSpring) * -20}px)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: sw.color }}
                >
                  {sw.name[0]}
                </div>
                <span
                  className="text-lg font-semibold"
                  style={{ color: sw.recommended ? TERMINAL_GREEN : "#e2e8f0" }}
                >
                  {sw.name}
                </span>
              </div>
              <div className="text-lg text-slate-300 flex items-center">{sw.os}</div>
              <div className="text-lg text-slate-300 flex items-center">{sw.price}</div>
              <div className="flex items-center">
                <span
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: sw.type === "VM" ? `${TERMINAL_GREEN}30` : "#2496ED30",
                    color: sw.type === "VM" ? TERMINAL_GREEN : "#2496ED",
                  }}
                >
                  {sw.type}
                </span>
              </div>
              <div className="text-lg text-slate-400 flex items-center">
                {sw.recommended && (
                  <span className="flex items-center gap-1" style={{ color: TERMINAL_GREEN }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Rekomendasi
                  </span>
                )}
                {sw.name === "VMware Player" && "Personal use only"}
                {sw.name === "Hyper-V" && "No Home edition"}
                {sw.name === "Parallels" && "Mac only, paid"}
                {sw.name === "UTM" && "Apple Silicon"}
                {sw.name === "Docker" && "For apps, not OS"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        style={{
          opacity: spring({ frame: frame - 70, fps, config: { damping: 15, stiffness: 100 } }),
        }}
      >
        <p className="text-lg text-slate-500">
          <span style={{ color: TERMINAL_GREEN }}>VirtualBox</span> = gratis, cross-platform, works di Windows Home
        </p>
      </div>
    </AbsoluteFill>
  );
};
