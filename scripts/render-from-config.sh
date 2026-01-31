#!/bin/bash
#===============================================================================
# Render Episode from Config
#===============================================================================
# Reads episode timeline from JSON config and renders using FFmpeg.
# The config format mirrors the Remotion composition structure.
#
# Usage:
#   ./scripts/render-from-config.sh <episode>
#   ./scripts/render-from-config.sh ep01
#   ./scripts/render-from-config.sh ep03
#
# Requirements:
#   - jq (for JSON parsing)
#   - Node.js with Remotion
#   - FFmpeg with VideoToolbox (macOS)
#===============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_DIR="$PROJECT_DIR/scripts/episode-config"
VIDEO_DIR="$PROJECT_DIR/public/footage"
OUTPUT_DIR="/Volumes/ENDY1TB/Video Production/seri-programming-fundamental/rendered"

cd "$PROJECT_DIR"

#-------------------------------------------------------------------------------
# Check dependencies
#-------------------------------------------------------------------------------
check_deps() {
    local missing=()
    command -v jq &>/dev/null || missing+=("jq")
    command -v npx &>/dev/null || missing+=("npx/node")
    command -v ffmpeg &>/dev/null || missing+=("ffmpeg")

    if [ ${#missing[@]} -gt 0 ]; then
        echo "ERROR: Missing dependencies: ${missing[*]}"
        exit 1
    fi

    if [ ! -d "$VIDEO_DIR" ]; then
        echo "ERROR: Video directory not found: $VIDEO_DIR"
        exit 1
    fi
}

#-------------------------------------------------------------------------------
# Get encoder settings
#-------------------------------------------------------------------------------
get_encoder() {
    if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q hevc_videotoolbox; then
        echo "hevc_videotoolbox"
    else
        echo "libx265"
    fi
}

get_encoder_opts() {
    if [ "$1" = "hevc_videotoolbox" ]; then
        echo "-q:v 65"
    else
        echo "-crf 23 -preset medium"
    fi
}

#-------------------------------------------------------------------------------
# Hide/restore footage folder to speed up Remotion bundling
# Overlays don't need footage, so we temporarily hide it
#-------------------------------------------------------------------------------
FOOTAGE_DIR="$PROJECT_DIR/public/footage"
FOOTAGE_HIDDEN="$PROJECT_DIR/.footage-hidden"

hide_footage() {
    if [ -d "$FOOTAGE_DIR" ] && [ ! -d "$FOOTAGE_HIDDEN" ]; then
        mv "$FOOTAGE_DIR" "$FOOTAGE_HIDDEN"
    fi
}

restore_footage() {
    if [ -d "$FOOTAGE_HIDDEN" ] && [ ! -d "$FOOTAGE_DIR" ]; then
        mv "$FOOTAGE_HIDDEN" "$FOOTAGE_DIR"
    fi
}

# Ensure footage is restored on script exit
trap restore_footage EXIT

#-------------------------------------------------------------------------------
# Render Remotion composition
#-------------------------------------------------------------------------------
render_composition() {
    local comp_id=$1
    local output=$2
    local type=$3  # "solid" or "transparent"

    if [ -f "$output" ]; then
        echo "    [skip] $(basename "$output")"
        return
    fi

    echo "    [render] $comp_id"

    # Hide footage to speed up bundling
    hide_footage

    if [ "$type" = "transparent" ]; then
        npx remotion render src/index.ts "$comp_id" "$output" \
            --codec prores \
            --prores-profile 4444 \
            --image-format png \
            --pixel-format yuva444p10le \
            2>&1 | grep -E "^\[" | tail -1 || true
    else
        npx remotion render src/index.ts "$comp_id" "$output" \
            --codec prores \
            --prores-profile 4444 \
            2>&1 | grep -E "^\[" | tail -1 || true
    fi

    # Restore footage after rendering
    restore_footage
}

#-------------------------------------------------------------------------------
# Render Remotion still (single frame PNG)
#-------------------------------------------------------------------------------
render_still() {
    local comp_id=$1
    local output=$2

    if [ -f "$output" ]; then
        echo "    [skip] $(basename "$output")"
        return
    fi

    echo "    [render] $comp_id (still)"

    # Hide footage to speed up bundling
    hide_footage

    npx remotion still src/index.ts "$comp_id" "$output" \
        --image-format png \
        2>&1 | grep -E "^\[" | tail -1 || true

    # Restore footage after rendering
    restore_footage
}

#-------------------------------------------------------------------------------
# Main render function
#-------------------------------------------------------------------------------
render_episode() {
    local config_file=$1
    local episode_id=$(jq -r '.id' "$config_file")
    local title=$(jq -r '.title' "$config_file")
    local fps=$(jq -r '.fps' "$config_file")

    echo "=== Rendering: $title ==="

    local OVERLAY_DIR="$OUTPUT_DIR/overlays-$episode_id"
    local TEMP_DIR="$OUTPUT_DIR/temp-$episode_id"
    local ENCODER=$(get_encoder)
    local ENCODER_OPTS=$(get_encoder_opts "$ENCODER")

    mkdir -p "$OVERLAY_DIR" "$TEMP_DIR"

    echo "Encoder: $ENCODER"

    # Get paths
    local camera_path="$VIDEO_DIR/$(jq -r '.mainContent.camera' "$config_file")"
    local intro_comp=$(jq -r '.intro.composition' "$config_file")
    local outro_comp=$(jq -r '.outro.composition' "$config_file")
    local output_name=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
    local OUTPUT="$OUTPUT_DIR/pf-$episode_id-$output_name.mp4"

    #---------------------------------------------------------------------------
    # Step 1: Render overlays
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 1: Rendering Remotion overlays..."

    # Intro/Outro
    render_composition "$intro_comp" "$OVERLAY_DIR/intro.mov" "solid"
    render_composition "$outro_comp" "$OVERLAY_DIR/outro.mov" "solid"

    # Main content overlays
    local overlay_count=$(jq '.mainContent.overlays | length' "$config_file")
    for i in $(seq 0 $((overlay_count - 1))); do
        local comp=$(jq -r ".mainContent.overlays[$i].composition" "$config_file")
        local type=$(jq -r ".mainContent.overlays[$i].type" "$config_file")
        local filename=$(echo "$comp" | tr '[:upper:]' '[:lower:]').mov
        render_composition "$comp" "$OVERLAY_DIR/$filename" "$type"
    done

    #---------------------------------------------------------------------------
    # Step 2: Encode intro
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 2: Encoding intro..."
    ffmpeg -y -i "$OVERLAY_DIR/intro.mov" \
        -c:v $ENCODER $ENCODER_OPTS -pix_fmt yuv420p -r $fps \
        "$TEMP_DIR/01-intro.mp4" 2>/dev/null

    #---------------------------------------------------------------------------
    # Step 3: Build FFmpeg filter for main content
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 3: Compositing main content..."

    # Build input list and filter_complex dynamically
    local inputs="-i \"$camera_path\""
    local filter="[0:v]fps=$fps[main];"
    local chain="[main]"
    local input_idx=1

    for i in $(seq 0 $((overlay_count - 1))); do
        local comp=$(jq -r ".mainContent.overlays[$i].composition" "$config_file")
        local start_frame=$(jq -r ".mainContent.overlays[$i].startFrame" "$config_file")
        local type=$(jq -r ".mainContent.overlays[$i].type" "$config_file")
        local filename=$(echo "$comp" | tr '[:upper:]' '[:lower:]').mov
        local start_sec=$(echo "scale=3; $start_frame / $fps" | bc)

        inputs="$inputs -i \"$OVERLAY_DIR/$filename\""

        if [ "$type" = "transparent" ]; then
            filter="${filter}[$input_idx:v]format=rgba,setpts=PTS+${start_sec}/TB[ov$i];"
        else
            filter="${filter}[$input_idx:v]fps=$fps,setpts=PTS+${start_sec}/TB[ov$i];"
        fi

        filter="${filter}${chain}[ov$i]overlay=eof_action=pass[v$i];"
        chain="[v$i]"
        input_idx=$((input_idx + 1))
    done

    # Remove trailing semicolon and rename final output
    filter="${filter%;}"
    filter=$(echo "$filter" | sed "s/\[v$((overlay_count-1))\]$/[vout]/")

    # Execute FFmpeg
    eval ffmpeg -y $inputs \
        -filter_complex "\"$filter\"" \
        -map '"[vout]"' -map '0:a' \
        -c:v $ENCODER $ENCODER_OPTS -c:a aac -b:a 192k -r $fps \
        "\"$TEMP_DIR/02-main.mp4\"" 2>&1 | grep -E "^frame=" | tail -1 || true

    #---------------------------------------------------------------------------
    # Step 4: Encode outro
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 4: Encoding outro..."
    ffmpeg -y -i "$OVERLAY_DIR/outro.mov" \
        -c:v $ENCODER $ENCODER_OPTS -pix_fmt yuv420p -r $fps \
        "$TEMP_DIR/03-outro.mp4" 2>/dev/null

    #---------------------------------------------------------------------------
    # Step 5: Concatenate
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 5: Concatenating final video..."
    cat > "$TEMP_DIR/concat.txt" << EOF
file '01-intro.mp4'
file '02-main.mp4'
file '03-outro.mp4'
EOF
    ffmpeg -y -f concat -safe 0 -i "$TEMP_DIR/concat.txt" -c copy "$OUTPUT" 2>/dev/null

    # Cleanup
    rm -rf "$TEMP_DIR"

    echo ""
    echo "Done: $OUTPUT"
    ls -lh "$OUTPUT"
}

#-------------------------------------------------------------------------------
# EP02 Specialized Render (multi-camera + screen PIP)
#-------------------------------------------------------------------------------
render_ep02() {
    local config_file="$CONFIG_DIR/ep02.json"
    local fps=$(jq -r '.fps' "$config_file")

    echo "=== Rendering: GitHub & Codespaces ==="

    local OVERLAY_DIR="$OUTPUT_DIR/overlays-ep02"
    local TEMP_DIR="$OUTPUT_DIR/temp-ep02"
    local ENCODER=$(get_encoder)
    local ENCODER_OPTS=$(get_encoder_opts "$ENCODER")
    local OUTPUT="$OUTPUT_DIR/pf-ep02-github-codespaces.mp4"

    mkdir -p "$OVERLAY_DIR" "$TEMP_DIR"

    echo "Encoder: $ENCODER"

    # Source files
    local CAMERA1="$VIDEO_DIR/$(jq -r '.sources.camera1' "$config_file")"
    local CAMERA2="$VIDEO_DIR/$(jq -r '.sources.camera2' "$config_file")"
    local SCREEN1="$VIDEO_DIR/$(jq -r '.sources.screen1' "$config_file")"
    local SCREEN2="$VIDEO_DIR/$(jq -r '.sources.screen2' "$config_file")"

    #---------------------------------------------------------------------------
    # Step 1: Render overlays
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 1: Rendering Remotion overlays..."
    render_composition "PFIntro" "$OVERLAY_DIR/intro.mov" "solid"
    render_composition "EP02-LowerThird" "$OVERLAY_DIR/lower-third.mov" "transparent"
    render_composition "EP02-Outro" "$OVERLAY_DIR/outro.mov" "solid"
    render_still "PipFrame" "$OVERLAY_DIR/pip-frame.png"

    local PIP_FRAME="$OVERLAY_DIR/pip-frame.png"

    #---------------------------------------------------------------------------
    # Step 2: Encode intro
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 2: Encoding intro..."
    ffmpeg -y -i "$OVERLAY_DIR/intro.mov" \
        -c:v $ENCODER $ENCODER_OPTS -pix_fmt yuv420p -r $fps \
        "$TEMP_DIR/01-intro.mp4" 2>/dev/null

    #---------------------------------------------------------------------------
    # Step 3: Segment 1 - Camera only (0:00-3:55) with lower third
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 3: Processing camera-only segment (0:00-3:55)..."
    ffmpeg -y \
        -i "$CAMERA1" \
        -i "$OVERLAY_DIR/lower-third.mov" \
        -filter_complex "
            [0:v]fps=$fps,trim=0:235.8,setpts=PTS-STARTPTS[cam];
            [1:v]format=rgba,setpts=PTS+2/TB[lt];
            [cam][lt]overlay=eof_action=pass[vout]
        " \
        -map "[vout]" \
        -ss 0 -t 235.8 -map 0:a \
        -c:v $ENCODER $ENCODER_OPTS -c:a aac -b:a 192k -r $fps \
        "$TEMP_DIR/02-cam-only.mp4" 2>&1 | grep -E "^frame=" | tail -1 || true

    #---------------------------------------------------------------------------
    # Step 4: Segment 2 - Screen 1 with Camera PIP (3:55-27:46)
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 4: Processing screen+PIP segment 1 (3:55-27:46)..."
    # Duration: 1666 - 235.8 = 1430.2 seconds
    # PIP: 320x240 (4:3) with camera cropped to fit, styled frame overlay
    ffmpeg -y \
        -ss 235.8 -i "$CAMERA1" \
        -i "$SCREEN1" \
        -i "$PIP_FRAME" \
        -filter_complex "
            [1:v]fps=$fps,trim=0:1430.2,setpts=PTS-STARTPTS,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#1a1a2e[screen];
            [0:v]fps=$fps,setpts=PTS-STARTPTS,scale=320:240:force_original_aspect_ratio=increase,crop=320:240[cam];
            [cam][2:v]overlay=0:0[pip];
            [screen][pip]overlay=W-w-40:H-h-40[vout]
        " \
        -map "[vout]" -map 0:a \
        -t 1430.2 \
        -c:v $ENCODER $ENCODER_OPTS -c:a aac -b:a 192k -r $fps \
        "$TEMP_DIR/03-screen1-pip.mp4" 2>&1 | grep -E "^frame=" | tail -1 || true

    #---------------------------------------------------------------------------
    # Step 5: Segment 3 - Screen 2 with Camera PIP (28:43-29:59)
    # Skip 27:46-28:43 (dead time)
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 5: Processing screen+PIP segment 2 (28:43-29:59)..."
    # Camera 1 from 1723s, Screen 2 from 2s, duration ~76.5s
    # PIP: 320x240 (4:3) with camera cropped to fit, styled frame overlay
    ffmpeg -y \
        -ss 1723 -i "$CAMERA1" \
        -ss 2 -i "$SCREEN2" \
        -i "$PIP_FRAME" \
        -filter_complex "
            [1:v]fps=$fps,setpts=PTS-STARTPTS,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#1a1a2e[screen];
            [0:v]fps=$fps,setpts=PTS-STARTPTS,scale=320:240:force_original_aspect_ratio=increase,crop=320:240[cam];
            [cam][2:v]overlay=0:0[pip];
            [screen][pip]overlay=W-w-40:H-h-40[vout]
        " \
        -map "[vout]" -map 0:a \
        -t 76.5 \
        -c:v $ENCODER $ENCODER_OPTS -c:a aac -b:a 192k -r $fps \
        "$TEMP_DIR/04-screen2-pip.mp4" 2>&1 | grep -E "^frame=" | tail -1 || true

    #---------------------------------------------------------------------------
    # Step 6: Segment 4 - Screen 2 only (29:59-30:51)
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 6: Processing screen-only segment (29:59-30:51)..."
    # Screen 2 from 78.5s to 131s (52.5s) - uses screen audio
    # Use input seeking for efficiency, then trim both audio and video in filter
    ffmpeg -y \
        -ss 78.5 -i "$SCREEN2" \
        -filter_complex "
            [0:v]fps=$fps,trim=0:52.5,setpts=PTS-STARTPTS,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#1a1a2e[vout];
            [0:a]atrim=0:52.5,asetpts=PTS-STARTPTS[aout]
        " \
        -map "[vout]" -map "[aout]" \
        -c:v $ENCODER $ENCODER_OPTS -c:a aac -b:a 192k -r $fps \
        "$TEMP_DIR/05-screen2-only.mp4" 2>&1 | grep -E "^frame=" | tail -1 || true

    #---------------------------------------------------------------------------
    # Step 7: Segment 5 - Camera 2 closing (30:51-33:06)
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 7: Processing camera 2 closing..."
    ffmpeg -y \
        -i "$CAMERA2" \
        -c:v $ENCODER $ENCODER_OPTS -c:a aac -b:a 192k -r $fps \
        "$TEMP_DIR/06-camera2.mp4" 2>&1 | grep -E "^frame=" | tail -1 || true

    #---------------------------------------------------------------------------
    # Step 8: Encode outro
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 8: Encoding outro..."
    ffmpeg -y -i "$OVERLAY_DIR/outro.mov" \
        -c:v $ENCODER $ENCODER_OPTS -pix_fmt yuv420p -r $fps \
        "$TEMP_DIR/07-outro.mp4" 2>/dev/null

    #---------------------------------------------------------------------------
    # Step 9: Concatenate all segments
    #---------------------------------------------------------------------------
    echo ""
    echo "Step 9: Concatenating all segments..."
    cat > "$TEMP_DIR/concat.txt" << EOF
file '01-intro.mp4'
file '02-cam-only.mp4'
file '03-screen1-pip.mp4'
file '04-screen2-pip.mp4'
file '05-screen2-only.mp4'
file '06-camera2.mp4'
file '07-outro.mp4'
EOF
    ffmpeg -y -f concat -safe 0 -i "$TEMP_DIR/concat.txt" -c copy "$OUTPUT" 2>/dev/null

    # Cleanup
    rm -rf "$TEMP_DIR"

    echo ""
    echo "Done: $OUTPUT"
    ls -lh "$OUTPUT"
}

#-------------------------------------------------------------------------------
# Main
#-------------------------------------------------------------------------------
check_deps

case "${1:-help}" in
    ep01|1)
        render_episode "$CONFIG_DIR/ep01.json"
        ;;
    ep02|2)
        render_ep02
        ;;
    ep03|3)
        render_episode "$CONFIG_DIR/ep03.json"
        ;;
    help|--help|-h)
        echo "Usage: $0 <episode>"
        echo ""
        echo "Episodes with config files:"
        ls -1 "$CONFIG_DIR"/*.json 2>/dev/null | xargs -I{} basename {} .json | sed 's/^/  /'
        ;;
    *)
        if [ -f "$CONFIG_DIR/$1.json" ]; then
            render_episode "$CONFIG_DIR/$1.json"
        else
            echo "ERROR: No config file found for: $1"
            echo "Available configs:"
            ls -1 "$CONFIG_DIR"/*.json 2>/dev/null | xargs -I{} basename {} .json | sed 's/^/  /'
            exit 1
        fi
        ;;
esac
