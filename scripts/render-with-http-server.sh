#!/bin/bash
#===============================================================================
# Render with HTTP Server
#===============================================================================
# Renders Remotion composition using an HTTP server for footage files.
# This avoids copying large video files to the bundle, saving memory.
#
# Usage:
#   ./scripts/render-with-http-server.sh <composition-id> [output-file]
#   ./scripts/render-with-http-server.sh PF05-Full
#   ./scripts/render-with-http-server.sh PF05-Full rendered/ep05.mp4
#
# Options (via environment variables):
#   CONCURRENCY     - Number of parallel renders (default: 50%)
#   CACHE_SIZE_GB   - Offthread video cache size in GB (default: 4)
#   FOOTAGE_PORT    - Port for footage HTTP server (default: 3333)
#===============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

# Arguments
COMPOSITION_ID="${1:-PF05-Full}"
OUTPUT_FILE="${2:-rendered/${COMPOSITION_ID}.mp4}"

# Configuration with defaults
CONCURRENCY="${CONCURRENCY:-50%}"
CACHE_SIZE_GB="${CACHE_SIZE_GB:-4}"
FOOTAGE_PORT="${FOOTAGE_PORT:-3333}"

# Calculate cache size in bytes
CACHE_SIZE_BYTES=$((CACHE_SIZE_GB * 1024 * 1024 * 1024))

# Paths
FOOTAGE_DIR="$PROJECT_DIR/public/footage"
EMPTY_PUBLIC_DIR="/tmp/remotion-empty-public-$$"
FOOTAGE_URL="http://localhost:$FOOTAGE_PORT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[render]${NC} $1"; }
warn() { echo -e "${YELLOW}[warn]${NC} $1"; }
error() { echo -e "${RED}[error]${NC} $1"; exit 1; }

#-------------------------------------------------------------------------------
# Check dependencies
#-------------------------------------------------------------------------------
command -v npx &>/dev/null || error "npx not found"
command -v curl &>/dev/null || error "curl not found"

if [ ! -d "$FOOTAGE_DIR" ]; then
    error "Footage directory not found: $FOOTAGE_DIR"
fi

#-------------------------------------------------------------------------------
# Create empty public directory
#-------------------------------------------------------------------------------
mkdir -p "$EMPTY_PUBLIC_DIR"
log "Created empty public dir: $EMPTY_PUBLIC_DIR"

#-------------------------------------------------------------------------------
# Start HTTP server for footage
#-------------------------------------------------------------------------------
log "Starting HTTP server for footage on port $FOOTAGE_PORT..."

# Kill any existing server on this port
lsof -ti:$FOOTAGE_PORT | xargs kill -9 2>/dev/null || true

# Start serve in background
npx serve "$FOOTAGE_DIR" -p $FOOTAGE_PORT --cors -L &
SERVER_PID=$!

# Cleanup function
cleanup() {
    log "Cleaning up..."
    if [ -n "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    rm -rf "$EMPTY_PUBLIC_DIR"
}
trap cleanup EXIT

# Wait for server to be ready
log "Waiting for server to be ready..."
for i in {1..30}; do
    if curl -s "$FOOTAGE_URL" > /dev/null 2>&1; then
        log "Server ready at $FOOTAGE_URL"
        break
    fi
    sleep 0.5
done

# Verify server is running
if ! curl -s "$FOOTAGE_URL" > /dev/null 2>&1; then
    error "Server failed to start on port $FOOTAGE_PORT"
fi

#-------------------------------------------------------------------------------
# Render
#-------------------------------------------------------------------------------
log "Starting render..."
log "  Composition: $COMPOSITION_ID"
log "  Output: $OUTPUT_FILE"
log "  Concurrency: $CONCURRENCY"
log "  Cache size: ${CACHE_SIZE_GB}GB"
log "  Footage URL: $FOOTAGE_URL"

mkdir -p "$(dirname "$OUTPUT_FILE")"

# Run Remotion render with environment variable for footage URL
REMOTION_FOOTAGE_URL="$FOOTAGE_URL" npx remotion render \
    src/index.ts \
    "$COMPOSITION_ID" \
    "$OUTPUT_FILE" \
    --public-dir="$EMPTY_PUBLIC_DIR" \
    --concurrency="$CONCURRENCY" \
    --offthread-video-cache-size-in-bytes="$CACHE_SIZE_BYTES" \
    --log=verbose

#-------------------------------------------------------------------------------
# Done
#-------------------------------------------------------------------------------
if [ -f "$OUTPUT_FILE" ]; then
    log "Render complete!"
    ls -lh "$OUTPUT_FILE"
else
    error "Output file not created"
fi
