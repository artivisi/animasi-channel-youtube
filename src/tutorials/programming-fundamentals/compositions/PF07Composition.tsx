import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import { Video } from "@remotion/media";
import {
  TransitionSeries,
  linearTiming,
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { PFIntro, PFOutro } from "../../../animations/programming-fundamentals";
import { Subtitles, VideoLowerThird, PipFrame } from "../../../components";
import { pf_07_camera_1Subtitles } from "../pf-07-camera-1-transcript";
import { getVideoPath } from "../video-paths";
import transitionSfxLow from "../../../assets/audio/transition-sfx-low.wav";
import transitionSfxReverse from "../../../assets/audio/transition-sfx-reverse.wav";

/**
 * Episode 7: Tipe Data (Data Types & Typing Systems)
 *
 * Footage:
 * - pf-07-camera-1: Full recording (~1444s / ~24 min)
 * - pf-07-screen-1: Screen recording (~1445s / ~24 min)
 *
 * Sync offset:
 * - Camera ↔ Screen: 2.721s (screenTime = cameraTime - 2.721)
 *
 * Timeline (6 sections, 2 transitions):
 * - Welcome (camera-1, 30s)
 * - PF Series Intro (150 frames)
 * - Camera-only + lower third (5s of camera-1 from 30s)
 * --wipe--> Screen with PIP (camera-1 35s-1420s synced with screen-1)
 * --slide-> Outro talking head (camera-1 1420s-1444s)
 * - PF Outro bumper (6s)
 */

const FPS = 30;
const INTRO_DURATION = 150; // 5 seconds
const OUTRO_DURATION = 180; // 6 seconds
const TRANSITION_DURATION = 20; // ~0.67s transition overlap
const NUM_TRANSITIONS = 2;

// Welcome section - first 30s of camera-1
const WELCOME_END_TIME = 30; // seconds
const WELCOME_DURATION_FRAMES = Math.round(WELCOME_END_TIME * FPS);

// Camera-only section (30s-35s of camera-1, with lower third)
const CAMERA_ONLY_DURATION = 5; // seconds
const CAMERA_ONLY_DURATION_FRAMES = Math.round(CAMERA_ONLY_DURATION * FPS);
const CAMERA_ONLY_START_FRAME = WELCOME_DURATION_FRAMES; // 900

// Sync offset: screenTime = cameraTime - 2.721
const SYNC_OFFSET = 2.721;

// Screen+PIP section: camera from 35s to 1420s
const SCREEN_PIP_CAMERA_START = WELCOME_END_TIME + CAMERA_ONLY_DURATION; // 35s
const SCREEN_PIP_CAMERA_START_FRAME = Math.round(SCREEN_PIP_CAMERA_START * FPS);
const SCREEN_START_TIME = SCREEN_PIP_CAMERA_START - SYNC_OFFSET; // 32.279s
const SCREEN_START_FRAME = Math.round(SCREEN_START_TIME * FPS);

const SCREEN_PIP_CAMERA_END = 1420; // seconds
const SCREEN_PIP_DURATION = SCREEN_PIP_CAMERA_END - SCREEN_PIP_CAMERA_START; // 1385s
const SCREEN_PIP_DURATION_FRAMES = Math.round(SCREEN_PIP_DURATION * FPS);

// Outro talking head (camera-1 from 1420s to 1444s)
const OUTRO_CAMERA_START = 1420;
const OUTRO_CAMERA_END = 1444;
const OUTRO_CAMERA_DURATION = OUTRO_CAMERA_END - OUTRO_CAMERA_START;
const OUTRO_CAMERA_DURATION_FRAMES = Math.round(OUTRO_CAMERA_DURATION * FPS);
const OUTRO_CAMERA_START_FRAME = Math.round(OUTRO_CAMERA_START * FPS);

/**
 * Wrap a transition presentation with an audio SFX.
 * Sound plays only on the entering side to avoid double-play.
 */
function addSound<T extends Record<string, unknown>>(
  transition: TransitionPresentation<T>,
  src: string,
  volume = 0.3,
): TransitionPresentation<T> {
  const { component: Component, ...other } = transition;
  const C = Component as React.FC<TransitionPresentationComponentProps<T>>;
  const WithSound: React.FC<TransitionPresentationComponentProps<T>> = (p) => (
    <>
      {p.presentationDirection === "entering" ? <Audio src={src} volume={volume} /> : null}
      <C {...p} />
    </>
  );
  return { component: WithSound, ...other };
}

export const PF07Composition: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Welcome Section - camera only, first 30s */}
      <TransitionSeries.Sequence durationInFrames={WELCOME_DURATION_FRAMES}>
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <Video
            src={getVideoPath("pf-07-camera-1")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Subtitles cues={pf_07_camera_1Subtitles} />
        </AbsoluteFill>
      </TransitionSeries.Sequence>

      {/* Series Intro (hard cut - PFIntro has its own enter/exit animation) */}
      <TransitionSeries.Sequence durationInFrames={INTRO_DURATION}>
        <PFIntro />
      </TransitionSeries.Sequence>

      {/* Camera-only section (30s-35s of camera-1 with lower third) */}
      <TransitionSeries.Sequence durationInFrames={CAMERA_ONLY_DURATION_FRAMES}>
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <Video
            src={getVideoPath("pf-07-camera-1")}
            trimBefore={CAMERA_ONLY_START_FRAME}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Sequence from={30} durationInFrames={120}>
            <VideoLowerThird
              title="Tipe Data & Typing System"
              subtitle="Programming Fundamentals - Episode 7"
            />
          </Sequence>
          <Subtitles cues={pf_07_camera_1Subtitles} frameOffset={CAMERA_ONLY_START_FRAME} />
        </AbsoluteFill>
      </TransitionSeries.Sequence>

      {/* Wipe transition: camera-only → screen+PIP */}
      <TransitionSeries.Transition
        presentation={addSound(wipe({ direction: "from-left" }), transitionSfxLow)}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Screen+PIP: main content (camera 35s-1420s synced with screen) */}
      <TransitionSeries.Sequence durationInFrames={SCREEN_PIP_DURATION_FRAMES}>
        <AbsoluteFill style={{ backgroundColor: "#1a1a2e" }}>
          <Video
            src={getVideoPath("pf-07-screen-1")}
            trimBefore={SCREEN_START_FRAME}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              backgroundColor: "#1a1a2e",
            }}
          />

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
              src={getVideoPath("pf-07-camera-1")}
              trimBefore={SCREEN_PIP_CAMERA_START_FRAME}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <PipFrame />
          </div>

          <Subtitles cues={pf_07_camera_1Subtitles} frameOffset={SCREEN_PIP_CAMERA_START_FRAME} />
        </AbsoluteFill>
      </TransitionSeries.Sequence>

      {/* Slide transition: screen+PIP → outro talking head */}
      <TransitionSeries.Transition
        presentation={addSound(slide({ direction: "from-right" }), transitionSfxReverse)}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Outro talking head (camera-1, closing words) */}
      <TransitionSeries.Sequence durationInFrames={OUTRO_CAMERA_DURATION_FRAMES}>
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <Video
            src={getVideoPath("pf-07-camera-1")}
            trimBefore={OUTRO_CAMERA_START_FRAME}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Subtitles
            cues={pf_07_camera_1Subtitles}
            frameOffset={OUTRO_CAMERA_START_FRAME}
          />
        </AbsoluteFill>
      </TransitionSeries.Sequence>

      {/* Series Outro (hard cut - PFOutro has its own enter animation) */}
      <TransitionSeries.Sequence durationInFrames={OUTRO_DURATION}>
        <PFOutro nextEpisodeTitle="Sistem Bilangan" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

// Export duration for Root.tsx
// TransitionSeries overlaps adjacent sequences during transitions,
// so total = sum of sequences - sum of transition overlaps
export const PF07_DURATION =
  WELCOME_DURATION_FRAMES +
  INTRO_DURATION +
  CAMERA_ONLY_DURATION_FRAMES +
  SCREEN_PIP_DURATION_FRAMES +
  OUTRO_CAMERA_DURATION_FRAMES +
  OUTRO_DURATION -
  NUM_TRANSITIONS * TRANSITION_DURATION;
