#!/bin/zsh -l
cd -- "$(dirname -- "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  print 'Node.jsが見つかりません。Node.js 22以上をインストールしてください。'
  read '?Enterキーで閉じる'
  exit 1
fi
node launch.mjs
if [[ $? -ne 0 ]]; then
  read '?起動に失敗しました。上のエラーを確認し、Enterキーで閉じてください。'
fi
