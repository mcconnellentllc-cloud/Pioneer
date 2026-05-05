#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# No npm dependencies to install — this is a static site.
# Verify that linting tools (pre-installed in the container) are available.
command -v eslint >/dev/null 2>&1 || { echo "eslint not found"; exit 1; }
command -v prettier >/dev/null 2>&1 || { echo "prettier not found"; exit 1; }

echo "Session start hook complete — linting tools verified."
