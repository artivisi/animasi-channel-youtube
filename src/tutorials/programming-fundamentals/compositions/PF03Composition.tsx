import React from "react";
import { AbsoluteFill, Sequence, OffthreadVideo } from "remotion";
import { PFIntro, PFOutro } from "../../../animations/programming-fundamentals";
import { Subtitles, VideoLowerThird } from "../../../components";
import { pf_03_cameraTranscript, pf_03_cameraSubtitles } from "../pf-03-transcript";
import {
  AIDosDonts,
  AIToolsShowcase,
  AILearningCycle,
  PromptExampleCard,
  UseEnglishTip,
} from "../components";
import { getVideoPath } from "../video-paths";

/**
 * Episode 3: AI untuk Belajar Programming
 *
 * This is a webcam-only episode (no screen recording).
 * The host discusses how to use AI tools like ChatGPT, Claude, and Gemini
 * effectively for learning programming.
 *
 * B-Roll Timeline (extended durations for engagement):
 * - 0:39-1:30 (51s): AI tools intro → AIToolsShowcase
 * - 2:55-3:34 (39s): Ask AI to explain → PromptExampleCard(explain)
 * - 4:17-5:06 (49s): Generate exercises → PromptExampleCard(exercise)
 * - 5:16-5:50 (34s): Ask for hints → PromptExampleCard(hint)
 * - 6:39-7:50 (71s): Explain errors → PromptExampleCard(error)
 * - 8:10-9:55 (105s): Use English with AI → UseEnglishTip
 * - 10:13-11:00 (47s): Don't ask for solutions → AIDosDonts
 * - 11:00-11:40 (40s): Learning cycle summary → AILearningCycle
 *
 * Timeline:
 * - 0:00 - 0:05: PF Series Intro (150 frames)
 * - 0:05 - 12:36: Main content (webcam)
 * - 12:36 - 12:42: Outro (180 frames)
 */

const FPS = 30;
const INTRO_DURATION = 150; // 5 seconds
const OUTRO_DURATION = 180; // 6 seconds

// Calculate main content duration from transcript
const mainContentDuration = Math.ceil(
  pf_03_cameraTranscript.segments[pf_03_cameraTranscript.segments.length - 1].end * FPS
);

// B-Roll timing (from transcript analysis) - all times in seconds
// Extended durations to keep audiences engaged

// AI Tools Showcase: 0:39-1:30 - when mentioning AI providers (51s)
const AI_TOOLS_START = Math.round(39 * FPS);
const AI_TOOLS_DURATION = Math.round(51 * FPS); // Extended: shows all 4 AI tools

// Explain Concept Prompt: 2:55-3:34 - explaining concepts (39s)
const EXPLAIN_PROMPT_START = Math.round(175 * FPS);
const EXPLAIN_PROMPT_DURATION = Math.round(39 * FPS);

// Exercise Generation Prompt: 4:17-5:06 - generate exercises (49s)
const EXERCISE_PROMPT_START = Math.round(257 * FPS);
const EXERCISE_PROMPT_DURATION = Math.round(49 * FPS);

// Hint Request Prompt: 5:16-5:50 - ask for hints (34s)
const HINT_PROMPT_START = Math.round(316 * FPS);
const HINT_PROMPT_DURATION = Math.round(34 * FPS);

// Error Explanation Prompt: 6:39-7:50 - error explanation (71s)
const ERROR_PROMPT_START = Math.round(399 * FPS);
const ERROR_PROMPT_DURATION = Math.round(71 * FPS);

// Use English tip: 8:10-9:55 - discussing English usage (105s)
const USE_ENGLISH_START = Math.round(490 * FPS);
const USE_ENGLISH_DURATION = Math.round(105 * FPS);

// Don't ask for solutions: 10:13-11:00 - warning about direct solutions (47s)
const DONT_ASK_START = Math.round(613 * FPS);
const DONT_ASK_DURATION = Math.round(47 * FPS);

// Learning Cycle: 11:00-11:40 - summary before outro (40s)
const LEARNING_CYCLE_START = Math.round(660 * FPS);
const LEARNING_CYCLE_DURATION = Math.round(40 * FPS);

export const PF03Composition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Series Intro */}
      <Sequence durationInFrames={INTRO_DURATION}>
        <PFIntro />
      </Sequence>

      {/* Main Content - Webcam */}
      <Sequence from={INTRO_DURATION} durationInFrames={mainContentDuration}>
        <AbsoluteFill>
          {/* Webcam video */}
          <OffthreadVideo
            src={getVideoPath("pf-03-camera")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Episode title lower third */}
          <Sequence from={60} durationInFrames={180}>
            <VideoLowerThird
              title="AI untuk Belajar Programming"
              subtitle="Programming Fundamentals - Episode 3"
            />
          </Sequence>

          {/* Subtitles */}
          <Subtitles cues={pf_03_cameraSubtitles} />

          {/* B-Roll 1: AI Tools Showcase - 0:39-1:30 (51s) */}
          <Sequence from={AI_TOOLS_START} durationInFrames={AI_TOOLS_DURATION}>
            <AIToolsShowcase />
          </Sequence>

          {/* B-Roll 2: Explain Concept Prompt - 2:55-3:34 (39s) */}
          <Sequence from={EXPLAIN_PROMPT_START} durationInFrames={EXPLAIN_PROMPT_DURATION}>
            <PromptExampleCard type="explain" />
          </Sequence>

          {/* B-Roll 3: Exercise Generation Prompt - 4:17-5:06 (49s) */}
          <Sequence from={EXERCISE_PROMPT_START} durationInFrames={EXERCISE_PROMPT_DURATION}>
            <PromptExampleCard type="exercise" />
          </Sequence>

          {/* B-Roll 4: Hint Request Prompt - 5:16-5:50 (34s) */}
          <Sequence from={HINT_PROMPT_START} durationInFrames={HINT_PROMPT_DURATION}>
            <PromptExampleCard type="hint" />
          </Sequence>

          {/* B-Roll 5: Error Explanation Prompt - 6:39-7:50 (71s) */}
          <Sequence from={ERROR_PROMPT_START} durationInFrames={ERROR_PROMPT_DURATION}>
            <PromptExampleCard type="error" />
          </Sequence>

          {/* B-Roll 6: Use English Tip - 8:10-9:55 (105s) */}
          <Sequence from={USE_ENGLISH_START} durationInFrames={USE_ENGLISH_DURATION}>
            <UseEnglishTip />
          </Sequence>

          {/* B-Roll 7: Don't Ask for Solutions - 10:13-11:00 (47s) */}
          <Sequence from={DONT_ASK_START} durationInFrames={DONT_ASK_DURATION}>
            <AIDosDonts showDos={false} showDonts={true} />
          </Sequence>

          {/* B-Roll 8: Learning Cycle Summary - 11:00-11:40 (40s) */}
          <Sequence from={LEARNING_CYCLE_START} durationInFrames={LEARNING_CYCLE_DURATION}>
            <AILearningCycle />
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* Series Outro */}
      <Sequence from={INTRO_DURATION + mainContentDuration} durationInFrames={OUTRO_DURATION}>
        <PFOutro nextEpisodeTitle="Hello World" />
      </Sequence>
    </AbsoluteFill>
  );
};

// Export duration for Root.tsx
export const PF03_DURATION = INTRO_DURATION + mainContentDuration + OUTRO_DURATION;
