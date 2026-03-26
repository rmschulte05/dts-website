#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  DTS SEO Agent Suite — runs all 7 agents in sequence
#  Usage:   npm run seo
#  Single:  npm run seo:research | seo:write | seo:facts | seo:eeat
#           npm run seo:humanize | seo:optimize | seo:aeo
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTS_DIR="$SCRIPT_DIR/reports"

# Colours
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

# Check claude CLI is available
if ! command -v claude &> /dev/null; then
  echo -e "${RED}Error: 'claude' CLI not found. Make sure Claude Code is installed.${RESET}"
  echo "Install: https://claude.ai/download"
  exit 1
fi

mkdir -p "$REPORTS_DIR"

AGENTS=(
  "1-research.md:Research:Gathering competitor analysis, sources, and article outline"
  "2-writer.md:Writer:Drafting the article in Jan-Piet's voice"
  "3-fact-check.md:Fact-Check:Verifying every claim against DTS ground truth"
  "4-eeat.md:E-E-A-T:Adding experience, expertise, authority and trust signals"
  "5-humanizer.md:Humanizer:Breaking AI patterns, restoring human voice (target: 90%+ human)"
  "6-seo.md:SEO:Optimising titles, meta, keyword density, internal links"
  "7-aeo.md:AEO:Structuring content for AI search and featured snippets"
)

# Allow running a single agent by passing its number as argument
# e.g.  bash run-all.sh 3  →  runs only Fact-Check
if [[ $# -gt 0 ]]; then
  INDEX=$(( $1 - 1 ))
  AGENTS=("${AGENTS[$INDEX]}")
fi

TOTAL=${#AGENTS[@]}
PASSED=0
FAILED=0

echo ""
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  DTS SEO Agent Suite${RESET}  —  ${TOTAL} agent(s) queued"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

START_TOTAL=$(date +%s)

for ENTRY in "${AGENTS[@]}"; do
  IFS=':' read -r FILE NAME DESC <<< "$ENTRY"
  PROMPT_FILE="$SCRIPT_DIR/$FILE"

  echo -e "${YELLOW}▶  $NAME${RESET}"
  echo -e "   ${DESC}"
  echo ""

  START=$(date +%s)

  if claude -p "$(cat "$PROMPT_FILE")"; then
    END=$(date +%s)
    ELAPSED=$(( END - START ))
    echo ""
    echo -e "${GREEN}   ✓ $NAME complete${RESET} — ${ELAPSED}s"
    PASSED=$(( PASSED + 1 ))
  else
    END=$(date +%s)
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

if [[ -d "$REPORTS_DIR" && $(ls "$REPORTS_DIR"/*.md 2>/dev/null | wc -l) -gt 0 ]]; then
  echo -e "  ${BOLD}Reports written to:${RESET}"
  ls "$REPORTS_DIR"/*.md 2>/dev/null | while read -r f; do
    echo "  • $(basename "$f")"
  done
  echo ""
fi

echo -e "  Review all changes: ${BOLD}git diff${RESET}"
echo ""

exit $([ $FAILED -eq 0 ] && echo 0 || echo 1)
