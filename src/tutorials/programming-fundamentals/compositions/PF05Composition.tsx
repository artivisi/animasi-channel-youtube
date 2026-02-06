import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Video } from "@remotion/media";
import { PFIntro, PFOutro } from "../../../animations/programming-fundamentals";
import { Subtitles, VideoLowerThird, PipFrame, ZoomPan, ZoomPoint } from "../../../components";
import { pf_05_camera_1Subtitles } from "../pf-05-camera-1-transcript";
import { pf_05_camera_2Subtitles } from "../pf-05-camera-2-transcript";
import { getVideoPath } from "../video-paths";
import { CommentSyntaxComparison } from "../components";
import { pf_05_intelligentZoomKeyframes } from "../pf-05-zoom-manual";

/**
 * Episode 5: Statement & Komentar
 *
 * This episode covers statements and comments in Python, JavaScript, and Java.
 * Structure: Welcome from camera-1, then screen+PIP from camera-2, with coffee break cut.
 *
 * Footage:
 * - pf-05-camera-1: Welcome/intro (~15s)
 * - pf-05-camera-2: Main content (~26 min)
 * - pf-05-screen: Screen recording
 *
 * Sync offset: 4.282s (camera started 4.282s AFTER screen)
 * - At camera time X, screen time = X - 4.282
 *
 * Timeline:
 * - 0:00 - 0:15: Welcome statement (camera-1)
 * - 0:15 - 0:20: PF Series Intro (150 frames)
 * - 0:20 - 0:27: Camera-only intro (7s of camera-2)
 * - 0:27 - 9:38: Screen with PIP (7s to 558s of camera-2)
 * - SKIP: Motorcycle noise (558s to 572s)
 * - 9:38 - end: Screen with PIP (572s onwards)
 * - Final: Series outro (6s)
 */

const FPS = 30;
const INTRO_DURATION = 150; // 5 seconds
const OUTRO_DURATION = 180; // 6 seconds

// Welcome section - from camera-1
const WELCOME_END_TIME = 15; // seconds
const WELCOME_DURATION_FRAMES = Math.round(WELCOME_END_TIME * FPS); // 450 frames

// Camera-2 sections
const CAMERA_ONLY_END_TIME = 7; // First 7s of camera-2 is camera-only
const CAMERA_ONLY_DURATION_FRAMES = Math.round(CAMERA_ONLY_END_TIME * FPS); // 210 frames

// Sync offset for screen recording
// At camera 7s, screen is at 2.718s → screen time = camera time - 4.282
const SYNC_OFFSET = 4.282;

// Screen starts at camera-2 time 7s
const SCREEN_START_CAMERA_TIME = 7;
const SCREEN_START_TIME = SCREEN_START_CAMERA_TIME - SYNC_OFFSET; // 2.718s into screen
const SCREEN_START_FRAME = Math.round(SCREEN_START_TIME * FPS);

// Coffee break cut (motorcycle noise)
const COFFEE_BREAK_START = 558; // camera-2 time
const COFFEE_BREAK_END = 572; // camera-2 time

// Part 1: 7s to 558s
const PART1_CAMERA_DURATION = COFFEE_BREAK_START - CAMERA_ONLY_END_TIME; // 551s
const PART1_DURATION_FRAMES = Math.round(PART1_CAMERA_DURATION * FPS);
const PART1_CAMERA_START_FRAME = CAMERA_ONLY_DURATION_FRAMES; // 210 frames

// Part 2: 572s to end (~1562s, cut after "sampai jumpa di video berikutnya")
const CAMERA_2_END_TIME = 1562; // cut right after "di video berikutnya" at 1561.66s
const PART2_CAMERA_START = COFFEE_BREAK_END;
const PART2_CAMERA_DURATION = CAMERA_2_END_TIME - PART2_CAMERA_START; // ~998s
const PART2_DURATION_FRAMES = Math.round(PART2_CAMERA_DURATION * FPS);
const PART2_CAMERA_START_FRAME = Math.round(COFFEE_BREAK_END * FPS); // 17160 frames

// B-Roll: CommentSyntaxComparison at ~20:00 of camera-2 (1200s)
// In Part 2: 1200 - 572 = 628s into Part 2
const COMMENT_COMPARISON_START = Math.round(628 * FPS); // 18840 frames into Part 2
const COMMENT_COMPARISON_DURATION = Math.round(30 * FPS); // 30 seconds

// Screen frame calculations for zoom keyframe offset
const PART2_SCREEN_START_FRAME = Math.round((COFFEE_BREAK_END - SYNC_OFFSET) * FPS);

// Helper to offset keyframes for each part
function offsetKeyframes(keyframes: ZoomPoint[], screenTrimFrame: number, maxFrame: number): ZoomPoint[] {
  return keyframes
    .filter(kf => kf.frame >= screenTrimFrame && kf.frame < screenTrimFrame + maxFrame)
    .map(kf => ({ ...kf, frame: kf.frame - screenTrimFrame }));
}

// Zoom keyframes adjusted for Part 1 (screen frames 81 to ~16613)
const part1ZoomKeyframes = offsetKeyframes(
  pf_05_intelligentZoomKeyframes,
  SCREEN_START_FRAME,
  PART1_DURATION_FRAMES
);

// Zoom keyframes adjusted for Part 2 (screen frames 17031 onwards)
const part2ZoomKeyframes = offsetKeyframes(
  pf_05_intelligentZoomKeyframes,
  PART2_SCREEN_START_FRAME,
  PART2_DURATION_FRAMES
);

// Calculate section start frames
const WELCOME_START = 0;
const INTRO_START = WELCOME_DURATION_FRAMES;
const CAMERA_ONLY_START = INTRO_START + INTRO_DURATION;
const PART1_START = CAMERA_ONLY_START + CAMERA_ONLY_DURATION_FRAMES;
const PART2_START = PART1_START + PART1_DURATION_FRAMES;
const OUTRO_START = PART2_START + PART2_DURATION_FRAMES;

export const PF05Composition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Welcome Section - from camera-1 */}
      <Sequence from={WELCOME_START} durationInFrames={WELCOME_DURATION_FRAMES}>
        <AbsoluteFill>
          <Video
            src={getVideoPath("pf-05-camera-1")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Subtitles cues={pf_05_camera_1Subtitles} />
        </AbsoluteFill>
      </Sequence>

      {/* Series Intro */}
      <Sequence from={INTRO_START} durationInFrames={INTRO_DURATION}>
        <PFIntro />
      </Sequence>

      {/* Camera-only section (first 7s of camera-2) */}
      <Sequence from={CAMERA_ONLY_START} durationInFrames={CAMERA_ONLY_DURATION_FRAMES}>
        <AbsoluteFill>
          <Video
            src={getVideoPath("pf-05-camera-2")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Episode title lower third */}
          <Sequence from={60} durationInFrames={180}>
            <VideoLowerThird
              title="Statement & Komentar"
              subtitle="Programming Fundamentals - Episode 5"
            />
          </Sequence>
          <Subtitles cues={pf_05_camera_2Subtitles} />
        </AbsoluteFill>
      </Sequence>

      {/* Part 1: Screen with PIP (7s to 558s of camera-2) */}
      <Sequence from={PART1_START} durationInFrames={PART1_DURATION_FRAMES}>
        <AbsoluteFill>
          {/* Screen recording with zoom/pan */}
          <ZoomPan keyframes={part1ZoomKeyframes}>
            <Video
              src={getVideoPath("pf-05-screen")}
              trimBefore={SCREEN_START_FRAME}
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: "#1a1a2e",
              }}
            />
          </ZoomPan>

          {/* Camera PIP */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              right: 40,
              width: 320,
              height: 240,
              overflow: "hidden",
              borderRadius: 16,
            }}
          >
            <Video
              src={getVideoPath("pf-05-camera-2")}
              trimBefore={CAMERA_ONLY_DURATION_FRAMES} // Start from 7s
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <PipFrame />
          </div>

          <Subtitles cues={pf_05_camera_2Subtitles} frameOffset={PART1_CAMERA_START_FRAME} />
        </AbsoluteFill>
      </Sequence>

      {/* Part 2: Screen with PIP (572s onwards, after motorcycle cut) */}
      <Sequence from={PART2_START} durationInFrames={PART2_DURATION_FRAMES}>
        <AbsoluteFill>
          {/* Screen recording - continues from where part1 left off + skip */}
          <ZoomPan keyframes={part2ZoomKeyframes}>
            <Video
              src={getVideoPath("pf-05-screen")}
              trimBefore={PART2_SCREEN_START_FRAME}
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: "#1a1a2e",
              }}
            />
          </ZoomPan>

          {/* Camera PIP - continues from 572s */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              right: 40,
              width: 320,
              height: 240,
              overflow: "hidden",
              borderRadius: 16,
            }}
          >
            <Video
              src={getVideoPath("pf-05-camera-2")}
              trimBefore={Math.round(COFFEE_BREAK_END * FPS)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <PipFrame />
          </div>

          {/* Subtitles - offset to match camera-2 trim at 572s */}
          <Subtitles
            cues={pf_05_camera_2Subtitles}
            frameOffset={PART2_CAMERA_START_FRAME}
          />

          {/* B-Roll: Comment Syntax Comparison at ~20:00 mark */}
          <Sequence from={COMMENT_COMPARISON_START} durationInFrames={COMMENT_COMPARISON_DURATION}>
            <CommentSyntaxComparison />
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* Series Outro */}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
        <PFOutro nextEpisodeTitle="Variable & Tipe Data" />
      </Sequence>
    </AbsoluteFill>
  );
};

// Export duration for Root.tsx
export const PF05_DURATION =
  WELCOME_DURATION_FRAMES +
  INTRO_DURATION +
  CAMERA_ONLY_DURATION_FRAMES +
  PART1_DURATION_FRAMES +
  PART2_DURATION_FRAMES +
  OUTRO_DURATION;
