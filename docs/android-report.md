# Android対応 作業レポート

作業日: 2026-11-10〜11（JST）。外部公開なし。実機は未接続。

## 調査とGit保全

- 既存構成: HTML/CSS/JavaScript ES Modules。React/Vue等なし。Node.jsの組み込み機能でlocalhost配信。
- 既存ビルド: `node scripts/build-mobile.mjs`。PWAのアイコンとキャッシュ一覧を生成し、静的成果物を作る。ネット公開はしない。
- 既存保存: localStorageの `cfa-pocket-v1` に履歴・復習進捗・読了・用語・目標・受験日をJSONで保存。
- 調査時点ではGit未初期化だったため、`main` に変更前のコードを保存（`7bfd131`）。その後 `feature/android-capacitor` を作成して実装。
- 選定: Webの教材・出題・表示を共通利用でき、AndroidプロジェクトとAPKを生成できるCapacitor 8が適切。Android用にのみesbuildを導入。

## 実行コマンド（主要なもの）

```sh
git status --short --branch
git init -b main
git add -- .gitignore .vscode package.json README.md public scripts test docs server.mjs launch.mjs 'CFA Pocketを開く.command'
git -c user.name='CFA Pocket development' -c user.email='development@localhost' commit -m 'Preserve web app before Android integration'
git switch -c feature/android-capacitor
node --version
npm --version
/usr/libexec/java_home -V
node --test
npm view @capacitor/core version
npm view @capacitor/cli version
npm view @capacitor/android version
npm view @capacitor/app version
npm view @capacitor/preferences version
npm view esbuild version
npm install --save-exact @capacitor/core@8 @capacitor/android@8 @capacitor/app@8 @capacitor/preferences@8 --ignore-scripts --no-audit --no-fund
npm install --save-dev --save-exact @capacitor/cli@8 esbuild --ignore-scripts --no-audit --no-fund
npm install --save-exact @capacitor/keyboard@8 --ignore-scripts --no-audit --no-fund
npm run build:android-web
npx --no-install cap add android
npm run android:debug
npm run build
npm test
```

Android SDKのadb・emulator・apksignerも利用:

```sh
adb devices -l
emulator -list-avds
emulator -avd Medium_Phone_API_36.1 -no-window -no-audio -no-boot-anim -no-snapshot-save
adb -s emulator-5554 install -r android/app/build/outputs/apk/debug/app-debug.apk
node scripts/android-smoke.mjs emulator-5554
apksigner verify --verbose android/app/build/outputs/apk/debug/app-debug.apk
shasum -a 256 android/app/build/outputs/apk/debug/app-debug.apk
PORT=4176 node server.mjs
```

上記Androidツールは実際には `$HOME/Library/Android/sdk` 配下の絶対パスで実行。テストスクリプトはadb経由でアプリ起動、force-stop、戻るキー、WebViewのローカルデバッグ接続を実施。認証情報は使わない。既存データを消す `pm clear`・アンインストール・AVD初期化は実行していない。

## 実装

- Android内に全396問・80単元を同梱。アプリ内のローカルHTTPS originを利用し、配信サーバー不要。
- Web版は従来のorigin・保存キーを維持。Android版は公式Preferencesを使いネイティブ保存。
- 回答の保存処理待ち・重複操作防止、破損データの保護、ネイティブの保存先選択式JSON書き出しを追加。
- 戻る操作は学習→単元/ホーム、単元→ガイド、その他→ホーム、ホーム→バックグラウンドへ。学習終了時は確認する。
- safe-area、画面サイズ、縦スクロール、入力欄の可視化、キーボード表示中の下部ナビの退避・終了後の復帰に対応。
- 実際のスクリーンショット確認で、入力欄のフォーカスだけでナビを隠すとキーボード終了後も隠れ続ける問題を発見。公式Keyboardプラグインの表示/非表示イベントに変更した。
- 自動クラウドバックアップを無効化。広告・分析・認証・外部保存・決済を導入していない。

## 検証結果

- 変更前: Nodeテスト20件合格。
- 変更後: Nodeテスト28件。既存教材・340 LOS対応・出題・PWA・バックアップに加え、Web保存互換性、ネイティブ再読込、書き込み順、エラー表示、戻る先、キーボード復帰を検証。
- Android: Gradle `assembleDebug testDebugUnitTest` 成功。追加Javaコードもコンパイル成功。Gradleタスク成功を、Android実機の計測テスト全件成功という意味にはしていない。
- エミュレーター: Android API 36.1で実際のUIから正解・不正解を保存し、force-stop後の再起動で全記録が一致。正答率50%を確認。
- WebViewの通信オフ模擬状態でも、同梱画面の再読込とネイティブ記録の読込が成功。これは実機の機内モード試験とは別。
- 学習記録画面は幅360/393/600/852pxでページ全体の横はみ出しなし。Androidハードウェア戻るで単元→ガイドへ戻ることを確認。
- AndroidのIME表示を確認し、入力中の下部ナビ退避と、キーボード終了後の復帰を検証。
- Web回帰確認: 既存のユーザー用4173/4175とは別の4176ポートで回答を保存し、再読込後も1回答・100%・進捗1/396が残ることを確認。既存ポートの学習記録は変更していない。
- APKの署名検証成功（デバッグ署名）。

## APK

[app-debug.apk](../android/app/build/outputs/apk/debug/app-debug.apk)

場所: `android/app/build/outputs/apk/debug/app-debug.apk`。約4.1MB。テスト用の端末非依存APK。テスト記録はAPKに含まれず、インストール先に新しく作られる。

SHA-256: `cfc59c0812f4493f2dc78c5c76b0023caf485d541f87e20c8cf295ed5c734244`

## 残る確認事項

- 自分のAndroid実機でのインストール、機内モード、再起動、回転、大きい文字、読み込み/書き出し、APK更新によるデータ維持は未確認。
- OS全バージョン・全画面でのレイアウト検証、TalkBackのアクセシビリティ検証、Androidドキュメント保存UIでの一連の書き出し・復元は未完了。
- 長期・大量履歴の保存性能、専門家による教材レビュー、正式アプリIDの確定、リリース署名、Play用AAB、ストア審査準備は今後の作業。
- Capacitor生成のGradle設定に `flatDir` 警告があるがビルド失敗ではない。

実機手順と環境不足時のインストール方法は [Android手順](android.md) に記載。今回の作業では、外部デプロイ・公開・課金・認証情報の送信・既存学習データの削除を行っていない。
