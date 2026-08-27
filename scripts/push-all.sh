#!/usr/bin/env bash
# 一次 push 同步到 Gitee（Pages）和 GitHub（Vercel 自动部署）
set -e

branch="$(git rev-parse --abbrev-ref HEAD)"

echo "→ 推送到 Gitee (origin)..."
git push origin "$branch"

if git remote get-url github &>/dev/null; then
  echo "→ 推送到 GitHub (github)..."
  git push github "$branch"
else
  echo "⚠ 未配置 github 远程仓库，跳过。Vercel 需要 GitHub 远程才能自动部署。"
  echo "  配置命令：git remote add github https://github.com/<用户名>/crm-login-prototype.git"
fi

echo "✓ 完成。Gitee Pages 与 Vercel 将在 1～3 分钟内更新。"
