#!/usr/bin/env bash
# 在项目根目录启动本地 HTTP 服务，供浏览器访问原型（勿用 file:// 直接打开 HTML）
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-8765}"
cd "$ROOT"
echo "Serving: $ROOT"
echo "需求目录:  http://127.0.0.1:${PORT}/index.html"
echo "统一原型:  http://127.0.0.1:${PORT}/prd-login-user/ui/"
echo "公告模块:  http://127.0.0.1:${PORT}/prd-login-user/ui/?entry=notice&menu=list&sub=normal"
echo "按 Ctrl+C 停止"
exec python3 -m http.server "$PORT"
