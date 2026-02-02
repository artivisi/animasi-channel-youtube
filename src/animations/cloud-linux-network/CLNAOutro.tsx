import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion";
import logoSrc from "../../assets/logos/logo-artivisi.svg";
import outroSfx from "../../assets/audio/outro-sfx.wav";
import outroStatic from "../../assets/audio/outro-static.wav";
import transitionSfx from "../../assets/audio/transition-sfx.wav";

const SERIES_TITLE = "Cloud & Linux Network Admin";

// Terminal color scheme
const TERMINAL_GREEN = "#22c55e";
const GLOW_GREEN = "#00ff00";
const TERMINAL_BG = "#0d1117";

type CLNAOutroProps = {
  nextEpisodeTitle?: string;
};

export const CLNAOutro: React.FC<CLNAOutroProps> = ({ nextEpisodeTitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgFade = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Staggered spring animations
  const logoSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const titleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const thanksSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const nextEpSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const subscribeSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const socialSpring = spring({
    frame: frame - 90,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const pulseScale = 1 + Math.sin(frame * 0.15) * 0.03;

  // Glitch effect
  const glitchActive =
    (frame > 25 && frame < 29) ||
    (frame > 60 && frame < 64) ||
    (frame > 95 && frame < 99) ||
    (frame > 125 && frame < 128);

  const glitchOffset = glitchActive ? random(`glitch-${frame}`) * 10 - 5 : 0;
  const glitchOffsetY = glitchActive ? random(`glitch-y-${frame}`) * 6 - 3 : 0;
  const rgbSplit = glitchActive ? 4 : 0;

  // Matrix rain characters (subtle background)
  const matrixChars = "01アイウエオカキクケコ";

  return (
    <AbsoluteFill
      style={{ opacity: bgFade }}
      className="bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center overflow-hidden"
    >
      {/* Main outro sound effect */}
      <Audio src={outroSfx} volume={0.35} />

      {/* Static noise - plays during glitch moments */}
      <Sequence from={20} durationInFrames={10}>
        <Audio src={outroStatic} volume={0.12} />
      </Sequence>
      <Sequence from={55} durationInFrames={10}>
        <Audio src={outroStatic} volume={0.12} />
      </Sequence>
      <Sequence from={90} durationInFrames={10}>
        <Audio src={outroStatic} volume={0.12} />
      </Sequence>

      {/* Swoosh for subscribe button */}
      <Sequence from={65}>
        <Audio src={transitionSfx} volume={0.25} />
      </Sequence>

      {/* Matrix-style falling characters (very subtle) */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.02]">
        {Array.from({ length: 20 }).map((_, i) => {
          const x = (i * 96) % 1920;
          const speed = 1.5 + (i % 3);
          const offset = ((frame * speed + i * 80) % 1200) - 100;
          const char = matrixChars[i % matrixChars.length];
          return (
            <div
              key={i}
              className="absolute font-mono text-xl"
              style={{
                left: x,
                top: offset,
                color: TERMINAL_GREEN,
                textShadow: `0 0 8px ${GLOW_GREEN}`,
              }}
            >
              {char}
            </div>
          );
        })}
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.1) 2px,
            rgba(0, 255, 0, 0.1) 4px
          )`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(${TERMINAL_GREEN}40 1px, transparent 1px),
            linear-gradient(90deg, ${TERMINAL_GREEN}40 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ArtiVisi Logo - Top Right */}
      <div
        className="absolute top-10 right-10"
        style={{
          transform: `scale(${logoSpring})`,
          opacity: logoSpring,
        }}
      >
        <Img src={logoSrc} className="w-32 h-32 drop-shadow-lg" />
      </div>

      {/* Main content with glitch offset */}
      <div
        className="flex flex-col items-center gap-8 z-10"
        style={{
          transform: `translate(${glitchOffset}px, ${glitchOffsetY}px)`,
        }}
      >
        {/* Series title */}
        <div
          style={{
            transform: `scale(${titleSpring})`,
            opacity: titleSpring,
          }}
          className="flex items-center gap-4"
        >
          <span
            className="font-mono text-4xl font-bold"
            style={{
              color: TERMINAL_GREEN,
              filter: `drop-shadow(0 0 10px ${GLOW_GREEN})`,
            }}
          >
            {"["}
          </span>
          <span
            className="text-4xl font-bold tracking-wide"
            style={{ color: TERMINAL_GREEN }}
          >
            {SERIES_TITLE}
          </span>
          <span
            className="font-mono text-4xl font-bold"
            style={{
              color: TERMINAL_GREEN,
              filter: `drop-shadow(0 0 10px ${GLOW_GREEN})`,
            }}
          >
            {"]"}
          </span>
        </div>

        {/* Thank you text with terminal styling */}
        <div
          style={{
            transform: `translateY(${(1 - thanksSpring) * 30}px)`,
            opacity: thanksSpring,
          }}
          className="text-center relative"
        >
          {/* Terminal prompt styling */}
          <div className="font-mono text-2xl text-slate-500 mb-2">
            <span style={{ color: TERMINAL_GREEN }}>root@server:~#</span>{" "}
            echo "Terima Kasih!"
          </div>

          {glitchActive && (
            <>
              <h1
                className="absolute text-7xl font-black text-cyan-500/50"
                style={{
                  transform: `translate(${-rgbSplit}px, ${-rgbSplit / 2}px)`,
                }}
              >
                Terima Kasih!
              </h1>
              <h1
                className="absolute text-7xl font-black text-red-500/50"
                style={{
                  transform: `translate(${rgbSplit}px, ${rgbSplit / 2}px)`,
                }}
              >
                Terima Kasih!
              </h1>
            </>
          )}
          <h1
            className="text-7xl font-black"
            style={{
              color: TERMINAL_GREEN,
              textShadow: `0 0 40px ${GLOW_GREEN}, 0 0 80px ${TERMINAL_GREEN}40`,
            }}
          >
            Terima Kasih!
          </h1>
        </div>

        {/* Next episode preview - only show if title is provided */}
        {nextEpisodeTitle && (
          <div
            style={{
              transform: `translateY(${(1 - nextEpSpring) * 20}px) scale(${nextEpSpring})`,
              opacity: nextEpSpring,
            }}
            className="flex flex-col items-center gap-3 mt-4"
          >
            <p className="text-2xl font-mono" style={{ color: TERMINAL_GREEN }}>
              <span className="text-slate-500">// </span>
              Episode berikutnya
            </p>
            <div
              className="flex items-center gap-4 px-8 py-4 rounded-lg"
              style={{
                backgroundColor: TERMINAL_BG,
                border: `2px solid ${TERMINAL_GREEN}40`,
                boxShadow: `0 0 20px ${TERMINAL_GREEN}20`,
              }}
            >
              <span className="text-3xl font-bold text-slate-200">
                {nextEpisodeTitle}
              </span>
            </div>
          </div>
        )}

        {/* Subscribe button with terminal styling */}
        <div className="relative mt-4">
          {glitchActive && (
            <>
              <div
                className="absolute inset-0 bg-cyan-600/50 px-10 py-4 rounded-lg"
                style={{ transform: `translateX(${-rgbSplit}px)` }}
              />
              <div
                className="absolute inset-0 bg-red-600/50 px-10 py-4 rounded-lg"
                style={{ transform: `translateX(${rgbSplit}px)` }}
              />
            </>
          )}
          <div
            style={{
              transform: `scale(${subscribeSpring * pulseScale})`,
              opacity: subscribeSpring,
            }}
            className="bg-red-600 px-10 py-4 rounded-lg flex items-center gap-4 shadow-xl shadow-red-600/30"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            <span className="text-white font-bold text-3xl">SUBSCRIBE</span>
          </div>
        </div>

        {/* Tech badges */}
        <div
          style={{
            transform: `translateY(${(1 - socialSpring) * 20}px)`,
            opacity: socialSpring,
          }}
          className="flex gap-4 mt-4"
        >
          <TechBadge name="Linux" />
          <TechBadge name="Docker" />
          <TechBadge name="Cloud" />
        </div>

        {/* Social links */}
        <div
          style={{
            transform: `translateY(${(1 - socialSpring) * 20}px)`,
            opacity: socialSpring,
          }}
          className="flex gap-10 mt-2"
        >
          <SocialLink icon="blog" label="software.endy.muhardin.com" />
          <SocialLink icon="web" label="artivisi.com" />
        </div>
      </div>

      {/* Glitch noise overlay */}
      {glitchActive && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Scanline effect during glitch */}
      {glitchActive && (
        <div
          className="absolute left-0 w-full h-0.5 pointer-events-none"
          style={{
            top: `${(frame * 7) % 100}%`,
            background: `linear-gradient(to right, transparent, ${GLOW_GREEN}50, transparent)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// Tech badge component
const TechBadge: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div
      className="px-4 py-2 rounded-lg font-mono text-lg font-semibold"
      style={{
        backgroundColor: `${TERMINAL_GREEN}15`,
        border: `2px solid ${TERMINAL_GREEN}60`,
        color: TERMINAL_GREEN,
        boxShadow: `0 0 15px ${TERMINAL_GREEN}20`,
      }}
    >
      {name}
    </div>
  );
};

// Social link component
const SocialLink: React.FC<{ icon: "blog" | "web"; label: string }> = ({
  icon,
  label,
}) => {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      {icon === "blog" && (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      )}
      {icon === "web" && (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      )}
      <span className="text-2xl">{label}</span>
    </div>
  );
};
