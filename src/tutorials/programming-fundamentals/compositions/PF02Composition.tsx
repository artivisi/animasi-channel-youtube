import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { PFIntro, PFOutro } from "../../../animations/programming-fundamentals";
import { Subtitles, VideoLowerThird, PipFrame } from "../../../components";
import { pf_02_camera_1Transcript, pf_02_camera_1Subtitles } from "../pf-02-transcript";
import { pf_02_camera_2Transcript, pf_02_camera_2Subtitles } from "../pf-02-camera-2-transcript";
import { pf_02_screen_2Subtitles } from "../pf-02-screen-2-transcript";
import { pf_02_camera_1_pf_02_screen_1_sync } from "../pf-02-sync-screen1";
import { pf_02_camera_1_pf_02_screen_2_sync } from "../pf-02-sync-screen2";
import { getVideoPath } from "../video-paths";

// Fade transition component with hold on black
const FadeTransition: React.FC<{
  durationInFrames: number;
  fadeInDuration?: number;
  holdDuration?: number;
  fadeOutDuration?: number;
}> = ({
  durationInFrames,
  fadeInDuration = durationInFrames * 0.3,
  holdDuration = durationInFrames * 0.4,
  fadeOutDuration = durationInFrames * 0.3,
}) => {
  const frame = useCurrentFrame();

  // Fade to black, hold, then fade from black
  const opacity = interpolate(
    frame,
    [0, fadeInDuration, fadeInDuration + holdDuration, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity }} />
  );
};

/**
 * Episode 2: GitHub & Codespaces
 *
 * This episode has webcam + screen recordings that need to be synced.
 *
 * Footage:
 * - pf-02-camera-1.mov: Main camera (30 min) - ends due to FAT 4GB limit
 * - pf-02-camera-2.mov: Closing statement (2 min 15s) - pickup shot
 * - pf-02-screen-1.mov: Screen recording 1 (24 min) - starts at camera 3:55
 * - pf-02-screen-2.mov: Screen recording 2 (11 min) - starts at camera 28:41
 *
 * Sync offsets (from transcript matching):
 * - Screen 1: offset +235.8s (screen started before camera, aligns at camera 3:55)
 * - Screen 2: offset +1721.0s (screen started much later, aligns at camera 28:41)
 *
 * Timeline:
 * - 0:00 - 0:05: PF Series Intro (150 frames)
 * - 0:05 - 3:55: Webcam only (intro/explanation)
 * - 3:55 - 27:46: Webcam PIP + Screen 1 (ends at "sudah dipush ke repository")
 * - [CUT] 27:46 - 28:43: Skipped 57s (verification demo + gap)
 * - 27:46 - ~29:03: Webcam PIP + Screen 2 (camera 1 audio, adjusted timeline)
 * - ~29:03 - ~29:56: Screen 2 only with its audio (cut at 2:11 before dead air)
 * - ~29:56 - 32:11: Camera 2 - closing statement
 */

const FPS = 30;
const INTRO_DURATION = 150; // 5 seconds
const OUTRO_DURATION = 180; // 6 seconds

// Dead time cut - skip the verification demo and gap
// Content flow:
// - 27:44 (1665s): "semua perubahan kita sudah dipush ke repository" (verbal explanation done)
// - 27:46-28:10: Demo of checking commits (skip this)
// - 28:10-28:43: Silence/gap (skip this)
// - 28:43 (1723s): "Oke, selanjutnya setelah ini sudah jadi ya" (codespace closed)
const CUT_START_TIME = 1666; // 27:46 - after "ke repository"
const CUT_END_TIME = 1723; // 28:43 - "Oke, selanjutnya setelah ini"
const CUT_DURATION = CUT_END_TIME - CUT_START_TIME; // 57 seconds to remove

// Transition timing (smoother cut with audio fade)
const AUDIO_FADE_OUT_DURATION = 45; // 1.5 seconds audio fade out before cut
const TRANSITION_DURATION = 90; // 3 second visual transition (fade to black, hold, fade from black)
const AUDIO_FADE_IN_DURATION = 45; // 1.5 seconds audio fade in after cut

// Sync points (in camera timeline seconds)
const SCREEN1_START_CAMERA_TIME = pf_02_camera_1_pf_02_screen_1_sync.offset; // ~235.8s = 3:55
// End screen 1 at the cut point for clean transition
const SCREEN1_DURATION = CUT_START_TIME - SCREEN1_START_CAMERA_TIME; // ~1430s screen time

const SCREEN2_START_CAMERA_TIME = pf_02_camera_1_pf_02_screen_2_sync.offset; // ~1721s = 28:41
const SCREEN2_DURATION = 11 * 60; // ~11 min screen recording

// Calculate main content duration from transcript, minus the cut
const originalDuration = Math.ceil(
  pf_02_camera_1Transcript.segments[pf_02_camera_1Transcript.segments.length - 1].end * FPS
);
const mainContentDuration = originalDuration - Math.round(CUT_DURATION * FPS);

// Convert camera time to frames (relative to main content start)
const screen1StartFrame = Math.round(SCREEN1_START_CAMERA_TIME * FPS);
const screen1DurationFrames = Math.round(SCREEN1_DURATION * FPS);

// Screen 2 starts after the cut, so adjust its position in the output timeline
const cutStartFrame = Math.round(CUT_START_TIME * FPS);
const screen2StartFrameOriginal = Math.round(SCREEN2_START_CAMERA_TIME * FPS);
const screen2StartFrame = screen2StartFrameOriginal - Math.round(CUT_DURATION * FPS); // Adjusted for the cut
const screen2DurationFrames = Math.round(SCREEN2_DURATION * FPS);

// Camera 2 - closing statement (2m 15s)
const camera2Duration = Math.ceil(
  pf_02_camera_2Transcript.segments[pf_02_camera_2Transcript.segments.length - 1].end * FPS
);

// Gap between camera 1 ending and camera 2 closing statement
// Camera 1 ends at 1799.5s, but screen 2 has dead air from 2:11 to 2:56
// So we cut screen 2 extension at 131s (2:11) to avoid the silence
const CAMERA1_END_TIME = 1799.5; // When camera 1 footage ends (FAT limit)
const SCREEN2_EXTENSION_END_TIME = 131; // End at 2:11 in screen 2, before the dead air
// Screen 2 continues from ~78.5s to 131s (about 52.5s of content)
const screen2ExtensionDuration = Math.round((SCREEN2_EXTENSION_END_TIME - (CAMERA1_END_TIME - SCREEN2_START_CAMERA_TIME)) * FPS);

export const PF02Composition: React.FC = () => {
  const frame = useCurrentFrame();

  // Audio fade timing calculations (in global frames)
  const cutPointFrame = INTRO_DURATION + cutStartFrame;
  const audioFadeOutStart = cutPointFrame - AUDIO_FADE_OUT_DURATION;
  const audioFadeOutEnd = cutPointFrame;
  const audioFadeInStart = cutPointFrame;
  const audioFadeInEnd = cutPointFrame + AUDIO_FADE_IN_DURATION;

  // Calculate volume for Part 1 (fades out before cut)
  const part1Volume = frame < audioFadeOutStart ? 1 :
    frame >= audioFadeOutStart && frame < audioFadeOutEnd ?
      interpolate(frame, [audioFadeOutStart, audioFadeOutEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // Calculate volume for Part 2 (fades in after cut)
  const part2Volume = frame < audioFadeInStart ? 0 :
    frame >= audioFadeInStart && frame < audioFadeInEnd ?
      interpolate(frame, [audioFadeInStart, audioFadeInEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  // Determine which screen recording (if any) should be visible
  const mainContentFrame = frame - INTRO_DURATION;
  const isScreen1Active = mainContentFrame >= screen1StartFrame &&
    mainContentFrame < screen1StartFrame + screen1DurationFrames;
  const isScreen2Active = mainContentFrame >= screen2StartFrame &&
    mainContentFrame < screen2StartFrame + screen2DurationFrames;
  const isScreenActive = isScreen1Active || isScreen2Active;

  // Part 1 ends at the cut point
  const part1EndFrame = cutStartFrame;
  // Part 2 starts after the cut (in output timeline, it continues from where part 1 ended)
  const part2StartFrame = cutStartFrame;
  const part2VideostartFrom = Math.round(CUT_END_TIME * FPS); // Skip to after the dead time

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Series Intro */}
      <Sequence durationInFrames={INTRO_DURATION}>
        <PFIntro />
      </Sequence>

      {/* Main Content - Part 1 (before the cut) */}
      <Sequence from={INTRO_DURATION} durationInFrames={part1EndFrame}>
        <AbsoluteFill>
          {/* Webcam (fullscreen when no screen recording) */}
          <Video
            src={getVideoPath("pf-02-camera-1")}
            volume={part1Volume}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isScreenActive ? 0 : 1,
            }}
          />

          {/* Screen Recording 1 - GitHub signup & Codespaces (muted - audio from camera) */}
          <Sequence from={screen1StartFrame} durationInFrames={screen1DurationFrames}>
            <AbsoluteFill>
              <Video
                src={getVideoPath("pf-02-screen-1")}
                muted
                style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#1a1a2e" }}
              />
            </AbsoluteFill>
          </Sequence>

          {/* Webcam PIP (when screen is active) - matches FFmpeg output */}
          {isScreenActive && (
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
                src={getVideoPath("pf-02-camera-1")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                volume={0}
              />
              <PipFrame />
            </div>
          )}

          {/* Episode title lower third */}
          <Sequence from={60} durationInFrames={180}>
            <VideoLowerThird
              title="GitHub & Codespaces"
              subtitle="Programming Fundamentals - Episode 2"
            />
          </Sequence>

          {/* Subtitles */}
          <Subtitles cues={pf_02_camera_1Subtitles} />
        </AbsoluteFill>
      </Sequence>

      {/* Fade transition at the cut point */}
      <Sequence from={INTRO_DURATION + part1EndFrame - TRANSITION_DURATION / 2} durationInFrames={TRANSITION_DURATION}>
        <FadeTransition durationInFrames={TRANSITION_DURATION} />
      </Sequence>

      {/* Main Content - Part 2 (after the cut, skip dead time) */}
      <Sequence from={INTRO_DURATION + part2StartFrame} durationInFrames={mainContentDuration - part1EndFrame}>
        <AbsoluteFill>
          {/* Webcam continues from after the cut */}
          <Video
            src={getVideoPath("pf-02-camera-1")}
            trimBefore={part2VideostartFrom}
            volume={part2Volume}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isScreenActive ? 0 : 1,
            }}
          />

          {/* Screen Recording 2 - synced with camera 1 timeline */}
          {/* At camera time 1728s (CUT_END_TIME), screen 2 should be at time 1728-1721=7s */}
          <Sequence from={screen2StartFrame - part2StartFrame} durationInFrames={screen2DurationFrames}>
            <AbsoluteFill>
              <Video
                src={getVideoPath("pf-02-screen-2")}
                trimBefore={Math.round((CUT_END_TIME - SCREEN2_START_CAMERA_TIME) * FPS)} // Sync screen 2 with camera timeline
                muted
                style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#1a1a2e" }}
              />
            </AbsoluteFill>
          </Sequence>

          {/* Webcam PIP (when screen is active) - matches FFmpeg output */}
          {isScreenActive && (
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
                src={getVideoPath("pf-02-camera-1")}
                trimBefore={part2VideostartFrom}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                volume={0}
              />
              <PipFrame />
            </div>
          )}

          {/* Subtitles - offset to match original video timeline after the cut */}
          <Subtitles cues={pf_02_camera_1Subtitles} frameOffset={part2VideostartFrom} />
        </AbsoluteFill>
      </Sequence>

      {/* Screen 2 extension - after camera 1 ends, cut at 2:11 before dead air */}
      {/* Screen 2 plays with its own audio during this gap */}
      <Sequence from={INTRO_DURATION + mainContentDuration} durationInFrames={screen2ExtensionDuration}>
        <AbsoluteFill>
          {/* Screen 2 continues from where camera 1 ended */}
          <Video
            src={getVideoPath("pf-02-screen-2")}
            trimBefore={Math.round((CAMERA1_END_TIME - SCREEN2_START_CAMERA_TIME) * FPS)} // ~78s into screen 2
            style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#1a1a2e" }}
          />
          {/* Subtitles from screen 2, offset to start from ~78s */}
          <Subtitles
            cues={pf_02_screen_2Subtitles}
            frameOffset={Math.round((CAMERA1_END_TIME - SCREEN2_START_CAMERA_TIME) * FPS)}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Fade transition between screen 2 extension and camera 2 */}
      <Sequence from={INTRO_DURATION + mainContentDuration + screen2ExtensionDuration - 45} durationInFrames={90}>
        <FadeTransition durationInFrames={90} />
      </Sequence>

      {/* Camera 2 - Closing statement */}
      <Sequence from={INTRO_DURATION + mainContentDuration + screen2ExtensionDuration} durationInFrames={camera2Duration}>
        <AbsoluteFill>
          <Video
            src={getVideoPath("pf-02-camera-2")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Subtitles cues={pf_02_camera_2Subtitles} />
        </AbsoluteFill>
      </Sequence>

      {/* Series Outro */}
      <Sequence from={INTRO_DURATION + mainContentDuration + screen2ExtensionDuration + camera2Duration} durationInFrames={OUTRO_DURATION}>
        <PFOutro nextEpisodeTitle="Belajar Coding dengan AI" />
      </Sequence>
    </AbsoluteFill>
  );
};

// Export duration for Root.tsx
export const PF02_DURATION = INTRO_DURATION + mainContentDuration + screen2ExtensionDuration + camera2Duration + OUTRO_DURATION;
