#!/bin/bash
# Render with TMPDIR on external drive to avoid filling laptop SSD

export TMPDIR="/Volumes/ENDY1TB/Video Production/remotion-projects/temp"
mkdir -p "$TMPDIR"

cd "/Volumes/ENDY1TB/Video Production/remotion-projects"

echo "TMPDIR=$TMPDIR"
echo "Starting render..."

npx remotion render src/index.ts "$@"
