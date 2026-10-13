#!/bin/bash
# Vercel per AAA, SEMPRE con l'account di Giacomo.
# Le credenziali di Giacomo stanno in ~/.vercel-aaa, separate da quelle di default del Mac
# (account di Andrea, usato per tutti gli altri progetti).
#
#   npm run vercel:login    login (una volta) con l'account di Giacomo, nel browser
#   npm run vercel:link     collega questa cartella al progetto "aaa"
#   npm run deploy          build + deploy in produzione, dopo i controlli
#   npm run vercel:check    solo i controlli

set -euo pipefail
cd "$(dirname "$0")/.."

CONFIG_DIR="$HOME/.vercel-aaa"
EXPECTED_USER="giacomoisidori-2449"
EXPECTED_SCOPE="giacomoisidori-2449s-projects"
EXPECTED_PROJECT="aaa"
EXPECTED_ORG="team_GoHsW6Y20KEm3CSmx49opBzo"

vc() { npx --yes vercel --global-config "$CONFIG_DIR" "$@"; }

check_account() {
  local who
  who=$(vc whoami 2>/dev/null | tail -1 || true)
  if [ "$who" != "$EXPECTED_USER" ]; then
    echo "STOP: account Vercel per AAA = '${who:-nessuno}', atteso '$EXPECTED_USER'. Esegui: npm run vercel:login" >&2
    exit 1
  fi
  echo "ok  account: $who"
}

check_link() {
  local f=".vercel/project.json"
  if [ ! -f "$f" ] || ! grep -q "\"projectName\":\"$EXPECTED_PROJECT\"" "$f" || ! grep -q "\"orgId\":\"$EXPECTED_ORG\"" "$f"; then
    echo "STOP: $f non punta al progetto '$EXPECTED_PROJECT' del team di Giacomo. Esegui: npm run vercel:link" >&2
    exit 1
  fi
  echo "ok  progetto: $EXPECTED_PROJECT ($EXPECTED_ORG)"
}

case "${1:-}" in
  login)
    mkdir -p "$CONFIG_DIR"
    vc login
    check_account
    ;;
  link)
    check_account
    vc link --project "$EXPECTED_PROJECT" --scope "$EXPECTED_SCOPE" --yes
    check_link
    ;;
  check)
    check_account
    check_link
    ;;
  deploy)
    check_account
    check_link
    npm run build
    vc --prod --yes
    ;;
  *)
    echo "Uso: $0 {login|link|check|deploy}" >&2
    exit 1
    ;;
esac
