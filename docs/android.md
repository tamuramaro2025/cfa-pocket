# Android開発・実機テスト

## まず自分のスマホで使う

Wi-Fiでダウンロードする場合:

```sh
npm run android:debug
npm run android:share
```

スマホをMacと同じWi-Fiに接続し、表示されたURLをスマホのChromeで開く。「Android版をダウンロード」を押し、APKを開いてインストールする。配信中はMacを起動したままにする。停止はCtrl+C。インストール後のアプリはMacなしでも利用できる。共有するのは案内ページとAPKだけで、プロジェクトや学習記録は配信しない。コピーしたAPKは `dist/android/CFA-Pocket.apk` にも保存する。VPNなどで別のネットワークが選ばれた場合は `ANDROID_SHARE_HOST=MacのWi-FiのIPアドレス npm run android:share` で指定できる。

USBでコピーする場合:

1. Macの `android/app/build/outputs/apk/debug/app-debug.apk` をUSBなどでスマホのDownloadsにコピーする。外部サービスへのアップロードは不要。
2. スマホのファイルアプリでAPKを開き、必要な場合だけ、そのファイルアプリに「不明なアプリのインストール」を許可する。
3. 「CFA Pocket」をインストールして起動する。インストール後は上の許可を戻して構わない。
4. 問題を解き、解説の下で理解度を選ぶ。これが回答の保存タイミング。
5. 「学習記録」の回答数・正答率を確認し、アプリを終了して開き直す。さらにAndroidの設定から「強制停止」して開き直し、同じ記録が残るか確認する。「ストレージを消去」は押さない。
6. 機内モードでも問題とガイドを開き、回答の保存を確認する。

既存の同じアプリを更新する場合は上書きインストールする。アンインストールしない。同じアプリID・同じ署名の更新で記録を維持する。別のMacで作ったAPKや将来のPlay版で署名が違うと、そのまま更新できない。先にJSONバックアップを保存すること。

USBデバッグを使う場合:

```sh
"$HOME/Library/Android/sdk/platform-tools/adb" devices -l
"$HOME/Library/Android/sdk/platform-tools/adb" -s YOUR_DEVICE_SERIAL install -r android/app/build/outputs/apk/debug/app-debug.apk
```

`YOUR_DEVICE_SERIAL` は実機の識別子に置き換える。`-r` は更新であり、アプリデータを消さない。こちらでは実機へのインストールは行っていない。

## 構成と保存

- 既存の [public](../public/) はフレームワークなしのHTML/CSS/ES Modules。Web版の起動はこれまでどおり。
- [native/entry.js](../native/entry.js) がCapacitorのApp・Preferences・KeyboardとAndroid用バックアップ機能を初期化して既存画面を読み込む。
- [build-android-web.mjs](../scripts/build-android-web.mjs) がesbuildで教材を含むJavaScriptをまとめ、Android専用の `www` に出力する。公開処理は含まない。
- [capacitor.config.json](../capacitor.config.json) は外部 `server.url` を指定しない。APK内の教材を利用し、AndroidではPWAのService Workerを登録しない。
- Web版のキー `cfa-pocket-v1`・データ形式を維持。Androidは公式Preferencesプラグイン経由のSharedPreferencesを使う。正答率は保存済み履歴から計算する。
- Android内に旧WebViewデータがある場合だけ、初回にコピーする。元データを削除せず、既存のネイティブ記録も上書きしない。Macのブラウザデータは別の保存先なので、自動移行・同期しない。
- 回答は理解度選択時、読了・用語・設定は変更時に保存。連続書き込みを順番に処理し、回答の保存中は二重操作を防ぐ。
- 壊れた保存データを読んだ場合は自動初期化せず書き込みを止め、画面に警告する。
- Androidバックアップは設定からJSONを書き出し、システムの保存先選択画面で保存する。端末内のDownloadsを選べばクラウドは不要。Androidの自動クラウドバックアップは無効にしている。
- アンインストールやOS設定のデータ消去には耐えない。これは端末内保存で、同期・暗号化データベースではない。大量の履歴を長期蓄積する段階ではSQLite等への移行を検討する。

ネイティブ領域の選択根拠: [公式Preferences仕様](https://capacitorjs.com/docs/apis/preferences)。localStorageだけではOSに消去される可能性があるため。

## 再ビルド

プロジェクト直下で:

```sh
npm ci
npm run build
npm test
npm run android:debug
```

最後のコマンドは、Android用Webアセットの生成 → `cap sync android` → Gradleの `assembleDebug testDebugUnitTest` を実行する。Gradle実行には10分の上限を設けている。エラーは終了コードとして返し、外部配信の入力待ちは行わない。

Android Studioで開く場合:

```sh
npm run android:open
```

Webの教材を変更したら `npm run build` を実行してPWAキャッシュ一覧を更新する。Androidにも反映する場合は `npm run android:debug` を実行する。`www` やAndroidの生成済みアセットを直接編集しない。

## 必要な環境・不足していた場合

このMacではNode.js 25.6.0、npm 11.8.0、Android Studio 2025.2、Java 21、SDK Platform 36が存在し、実際にビルドが成功した。今回、新しいAndroid Studio・SDK・Javaのインストールは行っていない。

別のMacで不足した場合:

1. Node.js 22以上と、[Android Studio](https://developer.android.com/studio) のApple Silicon対応版をインストールする。Capacitor 8の公式推奨はAndroid Studio 2025.2.1以上。
2. StudioのSDK Managerで「Android SDK Platform 36」「Android SDK Build-Tools」（Gradleの要求バージョン）「Android SDK Platform-Tools」「Android SDK Command-line Tools」を導入する。
3. Gradle JDKにStudio同梱のJava 21対応JDKを選択する。コマンドでは既存のJAVA_HOMEを優先し、未指定ならStudio同梱JDKを使う。
4. SDKが標準位置と異なる場合はANDROID_HOMEに設定する。プロジェクトの認証設定は不要。

```sh
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
npm run android:debug
```

[公式環境要件](https://capacitorjs.com/docs/getting-started/environment-setup)。SDKライセンスへの同意が求められた場合は内容を確認し、自分で同意する。ライセンスへの自動一括同意は行っていない。

## エミュレーターの再現テスト

エミュレーターを起動し、APKをインストールしてから実行する。実機への誤操作を防ぐため、スクリプトは `emulator-数字` のシリアルだけを受け付ける。毎回テスト回答を2件追加し、削除しない。既存記録を保持したまま比較する。

```sh
node scripts/android-smoke.mjs emulator-5554
```

テスト対象: 回答保存・実プロセスの強制終了と再起動・全記録の一致・正答率表示・通信オフを模擬したWebView再読込・画面幅・Androidの戻る・ソフトキーボード表示とナビ復帰。実機テストや全OSの互換性を代替するものではない。

## Google Play公開までに残る作業（今回は実行しない）

1. 自分の公開主体で所有・管理する正式なアプリIDを確定する。現在は実機テスト用に `jp.cfapocket.study` を設定。Playに初回登録する前に確定し、それ以降は変えない。
2. 実機の機内モード、戻るジェスチャー、回転、フォント拡大、ファイル書き出し・復元、OS更新、APK更新時のデータ維持を確認する。対応下限はAndroid 7/API 24、WebView 100以上。古い実機での動作は未確認。
3. 教材の専門家レビュー、CFA名称・商標の取り扱い、独立した非公式教材であることの表示を確認する。問題の収録数を公式の完全網羅率としない。
4. 問い合わせ先、プライバシーポリシー、データセーフティ、コンテンツレーティング、スクリーンショット、ストア説明を準備する。
5. 公開用のアップロード鍵を安全に管理し、署名付きAndroid App Bundle（AAB）を作成する。鍵・パスワードはGitに入れない。このデバッグAPKやデバッグ鍵では一般公開しない。
6. Google Play Consoleの登録と、その時点のテスト要件・対象API要件を確認し、内部テスト → 必要なクローズドテスト → 本番審査へ進む。課金・登録・アップロードは別途明示的な許可を得て行う。

[Android公式: アプリ署名と公開](https://developer.android.com/studio/publish/app-signing)。公開用鍵の作成、Playへの登録・提出、外部ホスティング、課金は今回行っていない。
