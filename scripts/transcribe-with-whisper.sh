#!/bin/bash

# Transcribe video/audio using OpenAI Whisper
#
# Prerequisites:
#   pip install openai-whisper
#   # or with GPU support:
#   pip install openai-whisper torch torchvision torchaudio
#
# Usage:
#   ./scripts/transcribe-with-whisper.sh footage/pf-01-main.mp4
#   ./scripts/transcribe-with-whisper.sh footage/pf-01-main.mp4 --model medium
#   ./scripts/transcribe-with-whisper.sh footage/pf-01-main.mp4 --language id

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <video-file> [whisper-options]"
  echo ""
  echo "Examples:"
  echo "  $0 footage/pf-01-main.mp4"
  echo "  $0 footage/pf-01-main.mp4 --model medium"
  echo "  $0 footage/pf-01-main.mp4 --language id"
  echo "  $0 footage/pf-01-main.mp4 --model large --language id"
  echo ""
  echo "Available models: tiny, base, small, medium, large"
  echo "Use --language id for Indonesian"
  exit 1
fi

INPUT_FILE="$1"
shift

# Get output directory (same as input file)
OUTPUT_DIR=$(dirname "$INPUT_FILE")
BASENAME=$(basename "$INPUT_FILE" | sed 's/\.[^.]*$//')

echo "Transcribing: $INPUT_FILE"
echo "Output directory: $OUTPUT_DIR"

# Run Whisper with word-level timestamps
whisper "$INPUT_FILE" \
  --output_dir "$OUTPUT_DIR" \
  --output_format json \
  --word_timestamps True \
  "$@"

echo ""
echo "Transcription complete!"
echo "Output files:"
echo "  - ${OUTPUT_DIR}/${BASENAME}.json (for Remotion)"
echo "  - ${OUTPUT_DIR}/${BASENAME}.srt"
echo "  - ${OUTPUT_DIR}/${BASENAME}.vtt"
echo ""
echo "Next step: Process transcript for Remotion"
echo "  node scripts/process-transcript.mjs ${OUTPUT_DIR}/${BASENAME}.json src/tutorials/<series>/<episode>-transcript.ts"
