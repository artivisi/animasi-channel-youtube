#!/bin/bash

# Detect silence in video/audio using FFmpeg
#
# This script analyzes audio and outputs silence regions
# The output can be processed by detect-silence.mjs for Remotion integration
#
# Prerequisites:
#   - FFmpeg installed
#
# Usage:
#   ./scripts/detect-silence.sh footage/pf-01-main.mp4
#   ./scripts/detect-silence.sh footage/pf-01-main.mp4 -35 0.5

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <video-file> [threshold-db] [min-duration]"
  echo ""
  echo "Arguments:"
  echo "  video-file     Input video/audio file"
  echo "  threshold-db   Silence threshold in dB (default: -35)"
  echo "  min-duration   Minimum silence duration in seconds (default: 0.5)"
  echo ""
  echo "Examples:"
  echo "  $0 footage/pf-01-main.mp4"
  echo "  $0 footage/pf-01-main.mp4 -40 0.3"
  exit 1
fi

INPUT_FILE="$1"
THRESHOLD="${2:--35}"
MIN_DURATION="${3:-0.5}"

# Get output path
OUTPUT_DIR=$(dirname "$INPUT_FILE")
BASENAME=$(basename "$INPUT_FILE" | sed 's/\.[^.]*$//')
OUTPUT_FILE="${OUTPUT_DIR}/${BASENAME}-silence.txt"

echo "Analyzing: $INPUT_FILE"
echo "Threshold: ${THRESHOLD}dB"
echo "Min duration: ${MIN_DURATION}s"
echo ""

# Run FFmpeg silencedetect filter
ffmpeg -i "$INPUT_FILE" -af "silencedetect=noise=${THRESHOLD}dB:d=${MIN_DURATION}" -f null - 2>&1 | \
  grep -E "silence_start|silence_end|silence_duration" | \
  tee "$OUTPUT_FILE"

echo ""
echo "Silence analysis saved to: $OUTPUT_FILE"
echo ""
echo "Next step: Process silence data for Remotion"
echo "  node scripts/detect-silence.mjs $OUTPUT_FILE --fps 30"
