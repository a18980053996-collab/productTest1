#!/usr/bin/env bash
set -euo pipefail
cd /Users/guochengyu/Documents/dify/docker
docker compose up -d
docker compose ps
echo
echo "Dify: http://localhost"
echo "导入 DSL: $(cd "$(dirname "$0")" && pwd)/dsl"
