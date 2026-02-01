# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` - Start Remotion Studio for preview
- `npm run build` - Bundle the project
- `npm run lint` - Run ESLint and TypeScript checks
- `npx remotion render <CompositionId>` - Render specific composition
- `npx remotion render <CompositionId> out/filename.mp4` - Render to file
- `./scripts/render-from-config.sh ep01` - **Recommended** FFmpeg render pipeline (5-6x faster)

## Architecture

This is a Remotion project for creating programmatic videos using React.

### Project Structure

- `src/index.ts` - Entry point, registers RemotionRoot
- `src/Root.tsx` - Defines all Composition components (video configurations)
- `src/animations/` - Bumper animations (intro, outro, transitions)
- `src/components/` - Reusable video components (lower thirds, webcam overlay, etc.)
- `src/tutorials/` - Tutorial series content and outlines
- `src/assets/` - Audio, logos, and other static assets

### Key Concepts

- **Composition**: Defined in `Root.tsx`, each `<Composition>` registers a video with id, dimensions, fps, and duration
- **Animation components**: React components that use Remotion hooks (`useCurrentFrame`, `useVideoConfig`, `interpolate`, `spring`, etc.)
- Tailwind CSS v4 is enabled via `remotion.config.ts`

### Available Compositions

| ID | Description | Duration |
|----|-------------|----------|
| VlogIntro | "NGOPI DULU" intro with espresso cup animation | 150 frames |
| LowerThird | Name/title overlay | 150 frames |
| Transition | "artivisi" letter animation | 90 frames |
| Outro | End screen with subscribe CTA | 150 frames |
| PFIntro | Programming Fundamentals series intro | 150 frames |
| PFOutro | Programming Fundamentals series outro | 150 frames |

### Adding New Animations

1. Create component in `src/animations/<animation-name>/`
2. Export from index.ts in that folder
3. Register as `<Composition>` in `src/Root.tsx`

## Programming Fundamentals Series

A 31-episode tutorial series teaching Python, Java, and JavaScript together.

### Episode Outlines

Located in `src/tutorials/programming-fundamentals/`:
- `SERIES_PLAN.md` - Full curriculum overview
- `pf-01.ts` through `pf-31.ts` - Individual episode outlines
- Each episode uses the `VideoOutline` type from `types.ts`

### Episode Outline Structure

```typescript
type VideoOutline = {
  episodeId: string;
  seriesId: string;
  title: string;
  description: string;
  duration: number;      // in seconds
  fps: number;
  outline: OutlineSection[];
  lowerThirds?: LowerThirdCue[];
  codeSnippets?: CodeSnippetCue[];
  references?: Reference[];
};
```

### Series-Specific Bumpers

- `PFIntro` - Dark theme, typing animation, language icons (Py/Jv/JS)
- `PFOutro` - Props: `nextEpisodeTitle?: string` (optional, hides section if not provided)

## Animation Patterns

### Spring Animation
```typescript
const logoSpring = spring({
  frame: frame - 40,
  fps,
  config: { damping: 12, stiffness: 100 },
});
```

### Glitch Effect
```typescript
const glitchActive = (frame > 30 && frame < 34) || (frame > 60 && frame < 63);
const rgbSplit = glitchActive ? 4 : 0;
```

### Typing Animation
```typescript
const charsToShow = Math.floor(
  interpolate(frame, [startFrame, endFrame], [0, text.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
);
```

## Audio Assets

Located in `src/assets/audio/`:
- `keyboard-typing.wav` - Typing sound effect
- `transition-sfx.wav` - Swoosh/whoosh sound
- `outro-sfx.wav` - Outro background sound
- `outro-static.wav` - Static noise for glitch moments
- `white-noise.wav` - Ambient background noise
- `dialup-modem.wav` - Retro modem sound (used in VlogIntro)

## FFmpeg Render Pipeline

Full episodes use a hybrid Remotion + FFmpeg pipeline for faster rendering:

1. **Episode configs** in `scripts/episode-config/epXX.json` define:
   - Intro/outro compositions
   - Camera footage path
   - B-roll overlays with timestamps and types

2. **Render script** `./scripts/render-from-config.sh`:
   - Renders Remotion overlays as ProRes with alpha
   - Composites onto camera footage with FFmpeg (GPU accelerated)
   - Concatenates intro + main + outro

3. **Overlay types**:
   - `solid`: Full-screen replacement (diagrams, charts)
   - `transparent`: Overlay on camera (lower thirds)

4. **Adding new B-roll**:
   - Create component in `src/tutorials/programming-fundamentals/components/`
   - Export from `components/index.ts`
   - Register `<Composition>` in `src/Root.tsx`
   - Add to episode config JSON with startFrame and duration

## Video Component

Use `Video` from `@remotion/media` (not `OffthreadVideo` from remotion):
```tsx
import { Video } from "@remotion/media";
<Video src={getVideoPath("pf-01-camera")} trimBefore={startFrame} />
```

## YouTube Upload Pipeline

Scripts in `scripts/` for batch uploading to YouTube with scheduled publishing.

### Setup (one-time)
1. Create Google Cloud project, enable YouTube Data API v3
2. Create OAuth 2.0 credentials (Desktop app)
3. Save as `client_secret.json` in project root
4. Add yourself as test user in OAuth consent screen
5. Run `node scripts/youtube-auth.mjs`

### Workflow

```bash
# 1. Generate metadata for all episodes (with scheduling)
node scripts/generate-youtube-metadata.mjs all --start-date 2026-02-01 --interval 2

# 2. Generate thumbnails with AI (Gemini, DALL-E, etc.)
#    Then resize to 1280x720:
ffmpeg -i input.png -vf "scale=720:720,pad=1280:720:(ow-iw)/2:0:color=#0d1117" thumbnails/ep01.png

# 3. Upload (batch or single)
node scripts/youtube-batch-upload.mjs ep01 ep03
node scripts/youtube-upload.mjs scripts/youtube-metadata/ep01.json path/to/video.mp4
```

### Metadata Generation
- Reads episode outlines from `src/tutorials/programming-fundamentals/pf-XX.ts`
- Extracts title, description, timeline markers from outline timestamps
- Adds common + episode-specific tags
- Outputs to `scripts/youtube-metadata/epXX.json`

### Upload Features
- Title, description, tags from metadata JSON
- Custom thumbnail from `thumbnails/epXX.png`
- Auto-creates playlist, adds video
- Scheduled publishing (private with publishAt)

## Recording Setup

- **Camera**: Nikon ZFC (records to SD card as `.MOV`)
- **Screen**: QuickTime Player Screen Recording (`.mov`)
- **Storage**: External drive, symlinked to `footage/` folder
