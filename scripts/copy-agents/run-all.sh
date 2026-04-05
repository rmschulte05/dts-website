#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  DTS Copy Agent Suite — audits and rewrites existing website page copy
#  Usage:   npm run copy -- src/pages/diensten/momentsleutel-kalibratie.astro
#  Single:  npm run copy:audit   -- src/pages/over-ons.astro
#           npm run copy:rewrite -- src/pages/over-ons.astro
#           etc.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colours
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

# Check claude CLI is available
if ! command -v claude &> /dev/null; then
  echo -e "${RED}Error: 'claude' CLI not found. Make sure Claude Code is installed.${RESET}"
  echo "Install: https://claude.ai/download"
  exit 1
fi

# ── Require a page path argument ──────────────────────────────────────────────
if [[ $# -eq 0 ]]; then
  echo -e "${RED}Error: No page specified.${RESET}"
  echo ""
  echo "  Usage:   npm run copy -- src/pages/diensten/momentsleutel-kalibratie.astro"
  echo "  Example: npm run copy -- src/pages/over-ons.astro"
  echo ""
  echo "  Available pages:"
  find "$PROJECT_ROOT/src/pages" -name "*.astro" \
    ! -path "*/blog/*" \
    ! -name "index.astro" \
    | sed "s|$PROJECT_ROOT/||" \
    | sort \
    | while read -r f; do echo "    • $f"; done
  echo ""
  exit 1
fi

PAGE_PATH="$1"
ABS_PAGE_PATH="$PROJECT_ROOT/$PAGE_PATH"

# Validate the file exists
if [[ ! -f "$ABS_PAGE_PATH" ]]; then
  echo -e "${RED}Error: File not found: $ABS_PAGE_PATH${RESET}"
  exit 1
fi

# ── Agent definitions ─────────────────────────────────────────────────────────
AGENTS=(
  "1-audit.md:Audit:Reading page copy and scoring voice, clarity, and SEO"
  "2-rewrite.md:Rewrite:Rewriting flagged sections in Jan-Piet's voice"
  "3-fact-check.md:Fact-Check:Verifying every claim against DTS ground truth"
  "4-seo.md:SEO:Optimising title, meta, H1/H2s, internal links, local SEO"
  "5-implement.md:Implement:Writing improved copy back into the .astro file"
)

# Allow running a single agent by passing its number as second argument
# e.g.  bash run-all.sh src/pages/over-ons.astro 2  →  runs only Rewrite
if [[ $# -gt 1 ]]; then
  INDEX=$(( $2 - 1 ))
  AGENTS=("${AGENTS[$INDEX]}")
fi

TOTAL=${#AGENTS[@]}
PASSED=0
FAILED=0

echo ""
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  DTS Copy Agent Suite${RESET}  —  ${TOTAL} agent(s) queued"
echo -e "  Page: ${BOLD}${PAGE_PATH}${RESET}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

START_TOTAL=$(date +%s)

PIPELINE_OUTPUT=""

for ENTRY in "${AGENTS[@]}"; do
  IFS=':' read -r FILE NAME DESC <<< "$ENTRY"
  PROMPT_FILE="$SCRIPT_DIR/$FILE"

  echo -e "${YELLOW}▶  $NAME${RESET}"
  echo -e "   ${DESC}"
  echo ""

  START=$(date +%s)

  # Build the prompt: page path context + accumulated pipeline output + agent instructions
  CONTEXT="Working directory: $PROJECT_ROOT
Target page: $PAGE_PATH

$(if [[ -n "$PIPELINE_OUTPUT" ]]; then echo "=== PIPELINE OUTPUT FROM PREVIOUS AGENTS ===
$PIPELINE_OUTPUT
=== END PIPELINE OUTPUT ===
"; fi)"

  AGENT_PROMPT="$(cat "$PROMPT_FILE")"
  FULL_PROMPT="$CONTEXT

$AGENT_PROMPT"

  AGENT_OUTPUT=""
  if AGENT_OUTPUT=$(claude --dangerously-skip-permissions -p "$FULL_PROMPT" 2>&1); then
    END=$(date +%s)
    ELAPSED=$(( END - START ))
    echo "$AGENT_OUTPUT"
    echo ""
    echo -e "${GREEN}   ✓ $NAME complete${RESET} — ${ELAPSED}s"
    PASSED=$(( PASSED + 1 ))
    # Sliding window: each agent only receives the previous agent's output.
    # For the SEO agent, extract only the final copy block — that is all Implement needs.
    if [[ "$NAME" == "SEO" ]]; then
      FINAL_BLOCK=$(echo "$AGENT_OUTPUT" | awk '/^FINAL COPY WITH SEO APPLIED:/{found=1} found{print}')
      PIPELINE_OUTPUT="${FINAL_BLOCK:-$AGENT_OUTPUT}"
    else
      PIPELINE_OUTPUT="$AGENT_OUTPUT"
    fi
  else
    END=$(date +%s)
    echo "$AGENT_OUTPUT"
    echo ""
    echo -e "${RED}   ✗ $NAME failed${RESET}"
    FAILED=$(( FAILED + 1 ))
  fi

  echo ""
  echo -e "   ${CYAN}────────────────────────────────────────────────${RESET}"
  echo ""
done

END_TOTAL=$(date +%s)
TOTAL_TIME=$(( END_TOTAL - START_TOTAL ))

echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  Done${RESET}  —  ${GREEN}${PASSED} passed${RESET}  ${RED}${FAILED} failed${RESET}  —  ${TOTAL_TIME}s total"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "  Review all changes: ${BOLD}git diff $PAGE_PATH${RESET}"
echo ""

exit $([ $FAILED -eq 0 ] && echo 0 || echo 1)
