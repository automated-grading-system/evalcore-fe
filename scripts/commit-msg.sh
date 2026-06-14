#!/usr/bin/env bash

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

REGEX="^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-zA-Z0-9\-\_]+\))?: .+"

if [[ ! $COMMIT_MSG =~ $REGEX ]]; then
    echo "Lỗi: Commit message không đúng chuẩn Conventional Commits."
    echo "Format chuẩn: <type>(<scope>): <subject>"
    echo "Ví dụ 1: feat(auth): add login form"
    echo "Ví dụ 2: fix: resolve null pointer exception"
    exit 1
fi
