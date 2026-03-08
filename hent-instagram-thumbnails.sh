#!/bin/bash
# ════════════════════════════════════════════════════════
#  Galleri Hair – Download Instagram Thumbnails
#  Kør: bash hent-instagram-thumbnails.sh
#
#  Kræver: yt-dlp (brew install yt-dlp)
#  Installer: brew install yt-dlp
# ════════════════════════════════════════════════════════

POSTS=(
  "DVV6zywDGMA"
  "DVTf50aDFtm"
  "DVHNRrnjAqX"
  "DVBTibsDEX1"
  "DU6S6iUjFf0"
  "DUnN76AjLzS"
  "DUi7zh5jG8T"
  "DUgE1MjDNY1"
  "DUa5jtnjL5E"
)

mkdir -p "assets/images/instagram"

for CODE in "${POSTS[@]}"; do
  OUT="assets/images/instagram/${CODE}.jpg"
  if [ -f "$OUT" ]; then
    echo "✓ $CODE (allerede hentet)"
    continue
  fi
  echo "→ Henter thumbnail for $CODE..."
  yt-dlp \
    --write-thumbnail \
    --skip-download \
    --convert-thumbnails jpg \
    -o "assets/images/instagram/${CODE}" \
    "https://www.instagram.com/p/${CODE}/" 2>/dev/null
  if [ -f "$OUT" ]; then
    echo "✓ $CODE gemt"
  else
    echo "✗ $CODE fejlede – prøv manuelt"
  fi
done

echo ""
echo "Færdig! Billeder gemt i assets/images/instagram/"
