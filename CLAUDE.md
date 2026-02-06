# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference for Episode Processing

**When user says "process episode X" or provides new footage:**

1. **Move files** from SD card/screencast folder to `public/footage/ep-XX/`
2. **Create symlinks** in `footage/programming-fundamentals/`
3. **Transcribe** with mlx-whisper (venv required)
4. **Sync** camera and screen recordings
5. **Extract cursor** for zoom keyframes (optional, ~1.4x realtime)
6. **Create episode config** in `scripts/episode-config/epXX.json`
7. **Register compositions** in `src/Root.tsx`
8. **Render** with `./scripts/render-from-config.sh epXX`

**Full workflow documentation:** `docs/PRODUCTION-WORKFLOW.md`
**Components reference:** `docs/COMPONENTS.md`
**Scripts reference:** `docs/SCRIPTS.md`

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

## Rendering Long Videos (30+ minutes)

For long videos, standard Remotion render copies the entire public folder, exhausting memory. Use the HTTP server approach instead:

### HTTP Server Render (Recommended)

```bash
./scripts/render-with-http-server.sh PF05-Full rendered/output.mp4
```

**How it works:**
1. Starts HTTP server serving `public/footage/` on port 3333
2. Creates empty public folder for bundling (no large files copied)
3. Video paths resolve to `http://localhost:3333/...` URLs
4. Renders with memory-optimized settings

**Environment variables:**
- `CONCURRENCY` - Parallel renders (default: 50%, use 2 for low memory)
- `CACHE_SIZE_GB` - Video cache size (default: 4GB)
- `FOOTAGE_PORT` - HTTP server port (default: 3333)

**Example with custom settings:**
```bash
CACHE_SIZE_GB=6 CONCURRENCY=2 ./scripts/render-with-http-server.sh PF05-Full rendered/ep05.mp4
```

### Video Path Configuration

`src/tutorials/programming-fundamentals/video-paths.ts` automatically switches between:
- **Preview mode**: `staticFile()` for Remotion Studio
- **Render mode**: HTTP URLs when `REMOTION_FOOTAGE_URL` is set

### Monitoring Progress

```bash
# Watch render progress
tail -f rendered/render-log.txt | grep "Rendered"

# Check if still running
ps aux | grep remotion
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

## Hardware Acceleration (Apple Silicon)

Always use hardware acceleration for video encoding/decoding on M1/M2 Macs.

### FFmpeg with VideoToolbox

```bash
# Encode with hardware acceleration (8x faster than software)
# Use explicit bitrate (-b:v) not quality (-q:v) for predictable results
ffmpeg -i input.mov -c:v h264_videotoolbox -b:v 12M -c:a aac -b:a 192k output.mp4

# HEVC encoding (better compression)
ffmpeg -i input.mov -c:v hevc_videotoolbox -b:v 8M -c:a aac -b:a 192k output.mp4
```

**Bitrate recommendations for 1080p:**
- 12-15M: High quality (source footage, editing)
- 8-10M: Good quality (final output, YouTube)
- 4-6M: Acceptable quality (smaller files)

Note: VideoToolbox `-q:v` scale is unreliable. Always use explicit bitrate `-b:v`.

### When to Re-encode Source Files

Re-encode camera/screen recordings if Remotion shows decoding errors:
```
Error decoding ... EncodingError: Decoding error
Cannot decode ... falling back to <OffthreadVideo>
Page crashed!
```

Fix by re-encoding with VideoToolbox before rendering:
```bash
ffmpeg -i original.MOV -c:v h264_videotoolbox -b:v 12M -c:a aac -b:a 192k fixed.mp4
```

Then update `video-paths.ts` to use the fixed file.

### Segmented Rendering for Long Videos

For videos longer than 10 minutes, use segmented rendering to avoid Chrome crashes:

```bash
./scripts/render-segments.sh PF05-Full rendered/output.mp4 5000
```

This renders in 5000-frame segments (~2.7 min each), then concatenates with FFmpeg.

## Zoom/Pan Workflow

### Manual Keyframe Definition (Recommended)

For precise control, define zoom actions manually in `pf-XX-zoom-manual.ts`:

```typescript
const actions: Array<{
  camTime: number;      // Camera time in seconds (from transcript)
  duration: number;     // How long to hold (seconds)
  x: number;            // Focus X (0-1, 0.5 = center)
  y: number;            // Focus Y (0-1, 0.5 = center)
  scale: number;        // Zoom level (1 = wide, 1.7 = zoomed)
  note: string;         // Description for reference
}> = [
  { camTime: 134, duration: 5, x: 0.15, y: 0.4, scale: 1.5, note: "File explorer" },
  { camTime: 142, duration: 10, x: 0.5, y: 0.35, scale: 1.8, note: "Editor - show code" },
  { camTime: 160, duration: 10, x: 0.5, y: 0.65, scale: 1.8, note: "Terminal - run command" },
];
```

**Focus Position Reference (VSCode layout):**
| Area | X | Y | Scale |
|------|---|---|-------|
| Wide view | 0.5 | 0.5 | 1.0 |
| File explorer | 0.15 | 0.4 | 1.5-1.7 |
| Editor | 0.5 | 0.35 | 1.7-1.8 |
| Terminal | 0.5 | 0.65 | 1.7-1.8 |

**Time Conversion:**
- Screen time = Camera time - syncOffset (e.g., 4.282s for ep05)
- Frame = Screen time × 30

### Automated Detection (Alternative)

| Aspect | Cursor Detection | Transcript Hints |
|--------|------------------|------------------|
| Time | 37 min (automated) | ~5 min (manual) |
| Output | 67 keyframes (many) | 6-10 keyframes (focused) |
| Catches | Editor pauses, menu clicks | Verbal teaching cues |
| Misses | Fast typing, cursor moving | Requires manual review |

### DaVinci Resolve Export

Generate timeline files for DaVinci Resolve:
```bash
node scripts/generate-davinci-timeline.mjs ep05
```

Outputs:
- `rendered/ep05-zoom-keyframes.txt` - Keyframe data with DaVinci position values
- `rendered/ep05-timeline-info.txt` - Timeline structure guide
- `rendered/ep05-timeline.edl` - EDL for basic timeline import

## Processing Time Reference (26-min video)

| Step | Time |
|------|------|
| Copy files | ~2 min |
| Transcription (mlx-whisper) | ~20 min |
| Manual zoom keyframe definition | ~10 min |
| Re-encode source files (if needed) | ~5 min |
| Render (segmented, 10 segments) | ~2.5 hours |
| **Total** | **~3 hours** |

**Render approaches:**
| Render Method | Time | Notes |
|---------------|------|-------|
| Segmented render (5000 frames/segment) | ~2.5 hours | Full zoom/pan, avoids crashes |
| FFmpeg pipeline | ~5 min | No zoom/pan, simple overlay only |
| DaVinci Resolve | ~15 min | Manual keyframe entry required |
