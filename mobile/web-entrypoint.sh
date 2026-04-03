#!/bin/sh
set -e

# Generate Tailwind CSS
echo "Generating Tailwind CSS..."
npx tailwindcss -i ./global.css -o ./public/nativewind-output.css --minify 2>/dev/null || \
  npx tailwindcss -i ./global.css -o ./public/nativewind-output.css 2>/dev/null

echo "Tailwind CSS generated ($(wc -c < ./public/nativewind-output.css) bytes)"

# Start Expo
exec "$@"
