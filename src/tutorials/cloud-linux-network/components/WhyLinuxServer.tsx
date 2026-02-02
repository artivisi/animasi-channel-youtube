import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

const reasons = [
  { icon: "free", title: "Gratis", desc: "Tidak perlu bayar lisensi" },
  { icon: "stable", title: "Stabil", desc: "Uptime bertahun-tahun" },
  { icon: "efficient", title: "Efisien", desc: "Hemat resource, ringan" },
  { icon: "secure", title: "Aman", desc: "Minim virus & malware" },
  { icon: "flexible", title: "Fleksibel", desc: "Bisa dikustomisasi" },
  { icon: "community", title: "Komunitas", desc: "Support & dokumentasi luas" },
];

export const WhyLinuxServer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TERMINAL_BG }} className="flex flex-col items-center p-12">
      {/* Title */}
      <div
        className="text-center mb-12"
        style={{
          transform: `translateY(${(1 - titleSpring) * -30}px)`,
          opacity: titleSpring,
        }}
      >
        <h1
          className="text-5xl font-bold mb-3"
          style={{ color: TERMINAL_GREEN, textShadow: `0 0 30px ${GLOW_GREEN}40` }}
        >
          Kenapa Server Pakai Linux?
        </h1>
        <p className="text-2xl text-slate-400">96% server di dunia menggunakan Linux</p>
      </div>

      {/* Reasons grid */}
      <div className="grid grid-cols-3 gap-8 mt-4">
        {reasons.map((reason, i) => {
          const delay = 20 + i * 10;
          const itemSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div
              key={reason.icon}
              className="flex flex-col items-center p-8 rounded-2xl"
              style={{
                backgroundColor: `${TERMINAL_GREEN}10`,
                border: `2px solid ${TERMINAL_GREEN}40`,
                boxShadow: `0 0 25px ${TERMINAL_GREEN}20`,
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                width: 320,
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `${TERMINAL_GREEN}20`,
                  border: `2px solid ${TERMINAL_GREEN}`,
                }}
              >
                <ReasonIcon type={reason.icon} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: TERMINAL_GREEN }}>
                {reason.title}
              </h3>
              <p className="text-lg text-slate-400 text-center">{reason.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Terminal decoration */}
      <div
        className="absolute bottom-8 left-12 font-mono text-lg text-slate-600"
        style={{ opacity: spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 100 } }) }}
      >
        <div><span style={{ color: TERMINAL_GREEN }}>$</span> uptime</div>
        <div className="text-slate-500">up 365 days, 0:00, 0 users</div>
      </div>
    </AbsoluteFill>
  );
};

const ReasonIcon: React.FC<{ type: string }> = ({ type }) => {
  const style = { width: 40, height: 40, color: TERMINAL_GREEN };

  const icons: Record<string, JSX.Element> = {
    free: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    stable: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    efficient: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    secure: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    flexible: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    community: (
      <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  };

  return icons[type] || null;
};
