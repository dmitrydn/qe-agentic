#!/usr/bin/env bash
# record-demo.sh — capture the Stage 7 live walkthrough as an asciinema cast,
# then render a LinkedIn-ready GIF and an MP4. Run from repo root or demo/.
#
# Produces (in demo/recordings/):
#   demo-<ts>.cast   raw asciinema recording (re-renderable, editable timing)
#   demo-<ts>.gif     looping GIF for the LinkedIn feed (Post 1)
#   demo-<ts>.mp4     video for the Featured section / longer cut
#
# Prereqs (install once):
#   brew install asciinema agg ffmpeg     # agg = asciinema-gif-generator
#   node >= 18.18, Colima/Docker running, OPENROUTER_API_KEY in ../.env
#
# Usage:
#   ./demo/record-demo.sh                                  # defaults
#   ./demo/record-demo.sh CYPRESS-RWA-TRANSACTIONS-007 payment-amount-cents
set -euo pipefail

# --- locate repo root (parent of this script's dir) -------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

REQ_ID="${1:-CYPRESS-RWA-TRANSACTIONS-007}"
DEFECT_ID="${2:-payment-amount-cents}"
TS="$(date +%Y%m%d-%H%M%S)"
OUT="$SCRIPT_DIR/recordings"
mkdir -p "$OUT"
CAST="$OUT/demo-$TS.cast"
GIF="$OUT/demo-$TS.gif"
MP4="$OUT/demo-$TS.mp4"

# --- pre-flight -------------------------------------------------------------
command -v asciinema >/dev/null || { echo "missing: asciinema (brew install asciinema)"; exit 1; }
command -v agg        >/dev/null || { echo "missing: agg (brew install agg)"; exit 1; }
[ -f "$ROOT/.env" ] || { echo "missing: $ROOT/.env with OPENROUTER_API_KEY"; exit 1; }
set -a; source "$ROOT/.env"; set +a
[ -n "${OPENROUTER_API_KEY:-}" ] || { echo "OPENROUTER_API_KEY not set in .env"; exit 1; }

echo ">> recording: req=$REQ_ID defect=$DEFECT_ID"
echo ">> a live LLM call runs inside this — expect ~30-90s of real latency"

# --- record ----------------------------------------------------------------
# 80x40 keeps the GIF legible in the LinkedIn feed. --idle-time-limit trims
# dead air (long LLM waits) to 2.5s so the cast stays punchy.
asciinema rec "$CAST" \
  --overwrite \
  --idle-time-limit 2.5 \
  --cols 80 --rows 40 \
  --title "Agentic QE — generate, run 3x, triage, revert" \
  --command "node demo/run-demo.js $REQ_ID $DEFECT_ID"

# --- render GIF (feed) ------------------------------------------------------
# Dark theme, comfortable font size, 2x speed so the ~2-3min run reads in <60s.
agg --theme monokai --font-size 20 --speed 2 "$CAST" "$GIF"

# --- render MP4 (Featured / longer cut), if ffmpeg present ------------------
if command -v ffmpeg >/dev/null; then
  ffmpeg -y -i "$GIF" -movflags faststart -pix_fmt yuv420p \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "$MP4"
fi

echo ">> done:"
echo "   cast: $CAST"
echo "   gif:  $GIF"
[ -f "$MP4" ] && echo "   mp4:  $MP4"
echo ">> verify fidelity: diff the on-screen STEP sequence against the"
echo "   'Watch it work' 7 steps in MAKE-THE-CASE.md before publishing."
