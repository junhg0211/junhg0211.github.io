#!/bin/sh

if [ -z "$1" ]; then
    echo "Usage: ./new.sh <title>"
    exit 1
fi

FILE="content/$(date +%Y/%m)/$1.md"

hugo new "$FILE" && nvim "$FILE"
