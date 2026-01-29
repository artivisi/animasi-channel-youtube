#!/bin/bash

# Remove silence from video using FFmpeg (quick cut without re-encoding)
#
# This is a standalone script that combines detection and removal
# For more control, use detect-silence.sh + detect-silence.mjs
#
# Prerequisites:
#   - FFmpeg installed
#
# Usage:
#   ./scripts/remove-silence.sh footage/pf-01-main.mp4
#   ./scripts/remove-silence.sh footage/pf-01-main.mp4 -35 0.5

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <video-file> [threshold-db] [min-duration]"
  echo ""
  echo "This script detects and removes silence from video."
  echo ""
  echo "Arguments:"
  echo "  video-file     Input video/audio file"
  echo "  threshold-db   Silence threshold in dB (default: -35)"
  echo "  min-duration   Minimum silence duration in seconds (default: 0.5)"
  echo ""
  echo "Output: <filename>-nosilence.mp4"
  echo ""
  echo "Examples:"
  echo "  $0 footage/pf-01-main.mp4"
  echo "  $0 footage/pf-01-main.mp4 -40 0.3"
  exit 1
fi

INPUT_FILE="$1"
THRESHOLD="${2:--35}"
MIN_DURATION="${3:-0.5}"
PADDING="0.1"

# Get output path
OUTPUT_DIR=$(dirname "$INPUT_FILE")
BASENAME=$(basename "$INPUT_FILE" | sed 's/\.[^.]*$//')
EXT="${INPUT_FILE##*.}"
OUTPUT_FILE="${OUTPUT_DIR}/${BASENAME}-nosilence.${EXT}"
TEMP_DIR=$(mktemp -d)
SEGMENTS_FILE="${TEMP_DIR}/segments.txt"

echo "Input: $INPUT_FILE"
echo "Output: $OUTPUT_FILE"
echo "Threshold: ${THRESHOLD}dB"
echo "Min silence: ${MIN_DURATION}s"
echo "Padding: ${PADDING}s"
echo ""

# Get video duration
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT_FILE")
echo "Video duration: ${DURATION}s"

# Detect silence and extract timestamps
echo "Detecting silence..."
SILENCE_DATA=$(ffmpeg -i "$INPUT_FILE" -af "silencedetect=noise=${THRESHOLD}dB:d=${MIN_DURATION}" -f null - 2>&1 | grep -E "silence_start|silence_end")

# Parse silence regions and build segment list
echo "Building segment list..."

# Start with 0
LAST_END=0
SEGMENT_COUNT=0

# Process silence regions
while IFS= read -r line; do
  if [[ $line =~ silence_start:\ ([0-9.]+) ]]; then
    SILENCE_START="${BASH_REMATCH[1]}"
    # Write segment from last_end to silence_start (minus padding)
    SEG_START=$(echo "$LAST_END" | awk '{printf "%.3f", $1}')
    SEG_END=$(echo "$SILENCE_START - $PADDING" | bc | awk '{printf "%.3f", ($1 < 0) ? 0 : $1}')

    if (( $(echo "$SEG_END > $SEG_START + 0.1" | bc -l) )); then
      SEGMENT_FILE="${TEMP_DIR}/seg_${SEGMENT_COUNT}.${EXT}"
      echo "  Segment $SEGMENT_COUNT: ${SEG_START}s - ${SEG_END}s"
      ffmpeg -y -i "$INPUT_FILE" -ss "$SEG_START" -to "$SEG_END" -c copy "$SEGMENT_FILE" 2>/dev/null
      echo "file '$SEGMENT_FILE'" >> "$SEGMENTS_FILE"
      ((SEGMENT_COUNT++))
    fi
  elif [[ $line =~ silence_end:\ ([0-9.]+) ]]; then
    LAST_END=$(echo "${BASH_REMATCH[1]} + $PADDING" | bc)
  fi
done <<< "$SILENCE_DATA"

# Add final segment
if (( $(echo "$LAST_END < $DURATION" | bc -l) )); then
  SEG_START=$(echo "$LAST_END" | awk '{printf "%.3f", $1}')
  SEGMENT_FILE="${TEMP_DIR}/seg_${SEGMENT_COUNT}.${EXT}"
  echo "  Segment $SEGMENT_COUNT: ${SEG_START}s - ${DURATION}s"
  ffmpeg -y -i "$INPUT_FILE" -ss "$SEG_START" -c copy "$SEGMENT_FILE" 2>/dev/null
  echo "file '$SEGMENT_FILE'" >> "$SEGMENTS_FILE"
  ((SEGMENT_COUNT++))
fi

echo ""
echo "Found $SEGMENT_COUNT segments to keep"

# Concatenate segments
if [ $SEGMENT_COUNT -gt 0 ]; then
  echo "Concatenating segments..."
  ffmpeg -y -f concat -safe 0 -i "$SEGMENTS_FILE" -c copy "$OUTPUT_FILE" 2>/dev/null

  # Get output duration
  OUTPUT_DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_FILE")
  SAVED=$(echo "$DURATION - $OUTPUT_DURATION" | bc)
  PERCENT=$(echo "scale=1; $SAVED / $DURATION * 100" | bc)

  echo ""
  echo "Done!"
  echo "Original: ${DURATION}s"
  echo "Output: ${OUTPUT_DURATION}s"
  echo "Saved: ${SAVED}s (${PERCENT}%)"
  echo ""
  echo "Output file: $OUTPUT_FILE"
else
  echo "No segments found to concatenate"
fi

# Cleanup
rm -rf "$TEMP_DIR"
