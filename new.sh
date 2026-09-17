#!/bin/sh

if [ -z "$1" ]; then
    echo "Usage: ./new.sh <title>"
    exit 1
fi

TITLE="$*"
SLUG=$(printf '%s' "$TITLE" | tr ' ' '-')
FILE="content/$(date +%Y/%m)/$SLUG.md"

if command -v nvim >/dev/null 2>&1; then
    EDITOR="nvim"
else
    EDITOR="vim"
fi

if [ ! -f "$FILE" ]; then
    hugo new "$FILE" || exit 1
fi

"$EDITOR" "$FILE"
