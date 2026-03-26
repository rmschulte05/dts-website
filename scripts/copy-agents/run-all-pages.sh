#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  DTS Copy Agent Suite — runs the full copy pipeline on ALL website pages
#  (excludes blog posts and blog index)
#
#  Usage:   npm run copy:all
#  Resume:  npm run copy:all -- --from=src/pages/faq.astro
#           (skips pages before the given path alphabetically)
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SINGLE_AGENT_SCRIPT="$SCRIPT_DIR/run-all.sh"

# Colours
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

# ── Optional --from flag to resume mid-run ────────────────────────────────────
RESUME_FROM=""
for arg in "$@"; do
  if [[ "$arg" == --from=* ]]; then
    RESUME_FROM="${arg#--from=}"
  fi
done

# ── Collect all non-blog pages ────────────────────────────────────────────────
mapfile -t PAGES < <(
  find "$PROJECT_ROOT/src/pages" -name "*.astro" \
    ! -path "*/blog/*" \
    | sed "s|$PROJECT_ROOT/||" \
    | sort
)

TOTAL=${#PAGES[@]}
PASSED=0
FAILED=0
SKIPPED=0
FAILED_PAGES=()

echo ""
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  DTS Copy Agent Suite — All Pages${RESET}"
echo -e "  ${TOTAL} pages queued$([ -n "$RESUME_FROM" ] && echo " (resuming from $RESUME_FROM)" || echo "")"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

START_TOTAL=$(date +%s)
SKIPPING=true

for PAGE in "${PAGES[@]}"; do

  # ── Resume logic ────────────────────────────────────────────────────────────
  if [[ -n "$RESUME_FROM" && "$SKIPPING" == true ]]; then
    if [[ "$PAGE" == "$RESUME_FROM" ]]; then
      SKIPPING=false
    else
      echo -e "  ${CYAN}↷  Skipping${RESET} $PAGE"
      SKIPPED=$(( SKIPPED + 1 ))
      continue
    fi
  fi

  PAGE_NUM=$(( PASSED + FAILED + SKIPPED + 1 ))
  echo ""
  echo -e "${BOLD}${CYAN}── Page ${PAGE_NUM}/${TOTAL} ──────────────────────────────────────────${RESET}"
  echo -e "${BOLD}   $PAGE${RESET}"
  echo ""

  START=$(date +%s)

  if bash "$SINGLE_AGENT_SCRIPT" "$PAGE"; then
    END=$(date +%s)
    ELAPSED=$(( END - START ))
    echo -e "${GREEN}   ✓ Done${RESET} — ${ELAPSED}s"
    PASSED=$(( PASSED + 1 ))
  else
    END=$(date +%s)
    echo -e "${RED}   ✗ Failed${RESET}"
    FAILED=$(( FAILED + 1 ))
    FAILED_PAGES+=("$PAGE")
  fi

  echo ""
done

END_TOTAL=$(date +%s)
TOTAL_TIME=$(( END_TOTAL - START_TOTAL ))

echo ""
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  All pages processed${RESET}"
echo -e "  ${GREEN}${PASSED} passed${RESET}   ${RED}${FAILED} failed${RESET}   ${CYAN}${SKIPPED} skipped${RESET}   —   ${TOTAL_TIME}s total"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

if [[ ${#FAILED_PAGES[@]} -gt 0 ]]; then
  echo -e "${RED}  Failed pages:${RESET}"
  for f in "${FAILED_PAGES[@]}"; do
    echo "    • $f"
  done
  echo ""
  echo -e "  Resume from first failure:"
  echo -e "  ${BOLD}npm run copy:all -- --from=${FAILED_PAGES[0]}${RESET}"
  echo ""
fi

echo -e "  Review all changes: ${BOLD}git diff src/pages/${RESET}"
echo ""

exit $([ $FAILED -eq 0 ] && echo 0 || echo 1)
