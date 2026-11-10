# GitHubアップロード準備確認

確認日: 2026-11-11（JST）。以下はGitHub接続前の準備時点の記録です。その後の接続・再確認結果は末尾に記載しています。

## Gitの状態

- 作業ブランチ: `feature/android-capacitor`。
- 調査時のHEAD: `8a2fd51`。変更前のWeb版とAndroid対応の既存コミットはそのまま保持。
- リモートは未登録。GitHubへの通信は行っていません。
- 以下の準備変更は未コミット。生成物の追跡解除7点だけがステージ済みで、設定・説明・点検スクリプトの変更は未ステージ/未追跡です。意図した内容を確認してから、後でまとめてコミットしてください。

## 除外設定

[.gitignore](../.gitignore) に、次を追加・整理しました。

- `.env` と環境別ファイル、`.envrc`、`.npmrc`、`.netrc`、Git認証保存ファイル、ローカルクラウド認証ディレクトリ。
- 秘密鍵・署名鍵・証明書コンテナー・署名用properties、サービスアカウントJSON、Firebase/Google設定。
- `node_modules`、`www`、各 `build`/`dist`、Gradleキャッシュ、APK/AAB/AAR、配布アーカイブ、ログ、端末設定。
- 学習記録のバックアップ、`.local`、従来のローカル配信用 `mobile-site`、`.openai` の配信設定。
- Webアイコン・PWAキャッシュ一覧と、Capacitor同期で自動生成するGradle接続設定。

`.env.example` と `.env.template` は例外として共有できますが、入れるのはダミー値だけにしてください。秘密の値を含めてよいという意味ではありません。

`.gitignore` は既に追跡しているファイルには効かないため、以下を `git rm --cached` で追跡解除しました。ディスク上のファイルは削除していません。

1. `public/precache-manifest.js`
2. `public/icons/icon-192.png`
3. `public/icons/icon-512.png`
4. `public/icons/maskable-512.png`
5. `public/icons/apple-touch-icon.png`
6. `android/capacitor.settings.gradle`
7. `android/app/capacitor.build.gradle`

既存のコミット履歴には上記の生成物が残ります。今回の検査で秘密情報は検出されておらず、過去の履歴は書き換えていません。追跡解除をコミットすると、以後のGit管理対象から外れます。

ソースとして必要な教材、設定、`package-lock.json`、Androidプロジェクト、Gradle wrapperのJARは残します。wrapperのJARはAPK等のビルド結果ではなく、再現可能なビルドに必要なツールです。

## 秘密情報の確認範囲と結果

[点検スクリプト](../scripts/check-repository.mjs) は完全にローカルで実行し、検出値を出力しません。

- 到達可能な全4コミット、重複を除く125 Git blobを確認。
- 現在のワークツリー、Gitのインデックス、未追跡のコミット候補を確認。
- ローカルGit設定も値を表示せず、URL中の認証情報・保存された認証ヘッダー等を確認。
- 秘密鍵のPEMヘッダー、GitHub/OpenAI/AWS/Google/Slack/Stripeの代表的なキー形式、JWT、Bearer、認証情報付きURL、文字列で直書きされたキー・トークン・パスワード等を照合。
- 除外すべき機密ファイル名・生成物がコミット候補にないことを確認。
- 結果: **今回のルールに該当する秘密情報は検出されませんでした**。

これはパターンによる点検であり、秘密情報が絶対にないことを保証する監査ではありません。依存パッケージ・ビルド出力のディレクトリ、バイナリ内容、シンボリックリンク先は内容検査から除外しています。共有する前には、公開してよい教材・説明・個人情報かも確認してください。もし後日秘密情報が見つかった場合、除外だけでなく認証情報の失効・再発行と履歴への対応が必要です。

## 動作確認

- `git check-ignore` で環境ファイル・鍵・署名設定・APK・生成物等の除外を確認。
- `git ls-files -ci --exclude-standard` の結果は空。除外設定に該当するファイルの追跡漏れなし。
- `npm test`: **28件合格**。テスト前に必要なWeb生成物を自動生成する `pretest` を追加。
- `npm run build:android-web`: 成功。
- 生成物を含めないコミット候補のソースを一時フォルダにコピーし、`npm test`、`npm run build:android-web`、`cap sync android` がすべて成功。除外したWeb/Androidファイルが再生成されることを確認。
- 一時フォルダの確認では、既存のロック済み依存パッケージをリンクして使用。完全に新しい環境での `npm ci` やAndroid APKの再ビルドを今回再実施したという意味ではありません。
- `npm start` とVS Codeの起動タスクにも生成ステップを接続。既存の起動用コマンドファイルは従来から生成ステップを実行します。
- `git diff --check`: 問題なし。

Webアプリの保存キー、学習記録、問題データ、Androidの保存処理は変更していません。既存のAPKもそのまま残っています。

## 再確認コマンド

```sh
git status --short --branch
git diff
git diff --cached --stat
git ls-files -ci --exclude-standard
npm run check:repository
npm test
```

準備内容をコミットする場合は、レビュー後に上記の変更だけを選んで追加してください。新しいファイルをステージした後にも `npm run check:repository` を実行すると、実際のインデックスを検査できます。この手順書にはPushを自動実行するコマンドを含めていません。

## GitHub接続時の再確認（2026-11-11 JST）

- ユーザーからコミットとmainへのPushの指示を受け、`origin` に `https://github.com/tamuramaro2025/cfa-pocket.git` を登録。
- `npm run check:repository` を再実行し、到達可能な全4コミット・125 Git blob、インデックス111ファイル、未追跡候補2ファイル、ローカル144ファイルを確認。検出0件。検査方法と限界は上記のとおり。
- `npm test` は28件すべて合格。`git diff --check` とステージ済み差分の空白チェックも問題なし。
- HTTPSの履歴取得は `could not read Username for 'https://github.com': Device not configured` で失敗。SSH agentにも利用可能な鍵はなく、VS CodeのGit認証連携や環境変数のトークンも利用不可。認証情報の値は出力していない。
- 準備変更はローカルの `feature/android-capacitor` ブランチでコミットする。認証後にGitHubのmainを取得し、履歴の関係と競合の有無を確認してから反映する。
- GitHub側の履歴はまだ取得できていないため、mainへの統合とPushは保留。履歴の上書き・force pushは行っていない。
