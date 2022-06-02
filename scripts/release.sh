#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

echo "Release version:"
read -r VERSION

npm ci
npm run build
git add .
git commit -m "Release version $VERSION"
git tag -a "$VERSION" -m "Release version $VERSION"
git push --follow-tags
