# CFA Pocket

自分専用で使う、1回3問のCFA Level I隙間時間学習アプリ。

## 自分専用で使う

登録・ログインなしですぐ学習できます。学習記録は端末内に保存し、JSONバックアップで移せます。Google Playへの公開準備は中止しました。AndroidはAPKを直接インストールして使えます。

## Androidで試す

Capacitor 8によるオフライン対応Android版を追加しました。実機へのインストール、再ビルド、必要なSDK、Google Play公開前の作業は [Android開発・実機テスト手順](docs/android.md) を参照してください。今回の変更・コマンド・検証結果は [Android対応レポート](docs/android-report.md) に記録しています。外部デプロイは不要です。

```sh
npm ci
npm run android:debug
```

生成先: `android/app/build/outputs/apk/debug/app-debug.apk`。これはテスト用のデバッグ署名APKで、Google Play公開用ではありません。

スマホへWi-Fiでダウンロードするには `npm run android:share` を実行し、Macと同じWi-Fiに接続したAndroidのChromeで表示されたURLを開いてください。配信停止はCtrl+C。インストール後はMacなしで使えます。

## 起動

Macでは [CFA Pocketを開く.command](./CFA%20Pocketを開く.command) をダブルクリックしてください。サーバーが停止中なら起動し、ブラウザを開きます。起動済みならそのままブラウザを開きます。ターミナルを閉じても配信は続きます。Macの再起動後は再度ダブルクリックしてください。

URLだけでは停止したサーバーは起動しません。開けない場合も同じ起動ファイルを使ってください。ログは `.local/server.log` に保存します。

Node.js 22以上で、追加パッケージなしで動きます。

```sh
node scripts/build-mobile.mjs
node server.mjs
```

ブラウザで http://127.0.0.1:4173 を開いてください。VS Codeの「CFA Pocketを起動」タスクでも起動できます。

```sh
npm test
```

`npm start`・`npm test` は必要なWebアイコンとオフライン一覧を先に生成します。依存パッケージ、APK、各ビルド出力、生成アセット、端末内データ、認証設定はGit管理しません。GitHubへの送信前の点検は `npm run check:repository`。除外方針と今回の確認結果は [GitHubアップロード準備](docs/github-preparation.md) を参照してください。

## 実装済み

- レスポンシブなホーム・分野別演習・復習・学習記録・設定
- 英語の独自問題396問、日本語の解説、各誤答の理由。分野・単元ごとに固定数の制限はありません
- 2027年版の科目構成を参考にした80単元の学習ガイド（各分野8単元）
- 単元ごとの日本語要点・式・注意点・可変数の確認演習、検索・分野フィルタ・読了記録
- 公式2027アウトラインの340項目と問題IDを結び付ける対応確認画面（すべて部分対応として表示）
- 回答後の自信度入力、正誤と自信度に応じた復習日設定
- 保存した用語、日別の学習回数、連続学習日数、分野別正答率
- WebはlocalStorage、AndroidはSharedPreferencesでの記録。JSON書き出し・確認付き読み込み・確認付き初期化
- 非公開 GitHub Gist を使った PC・Android 間の自動進捗同期（両端末の履歴・復習予定・ブックマーク・読了単元・設定を自動マージ、接続コードによる2台目連携）
- 目標回答数・受験予定日の保存
- Web App Manifest（インストール可否はブラウザによる）
- Web版のオフライン保存と、教材を内蔵したAndroid版

## 設計

- [public/app.js](public/app.js)：画面と操作
- [public/engine.js](public/engine.js)：出題・復習スケジュール・日付処理
- [public/questions.js](public/questions.js)：教材データ
- [public/questions-extra.js](public/questions-extra.js)：追加45問の教材データ
- [public/curriculum.js](public/curriculum.js)：80単元と追加演習を統合
- [public/questions-los.js](public/questions-los.js)：LOS照合で追加した176問を統合
- [public/los-audit.js](public/los-audit.js)：公式項目の位置・関連問題・数値演習を集計
- [docs/los-audit-2027.md](docs/los-audit-2027.md)：全340項目の対応根拠と残る補強
- [public/learning-guide.js](public/learning-guide.js)：ガイドと単元詳細の画面
- [docs/curriculum-coverage.md](docs/curriculum-coverage.md)：収録内容と補強対象
- [docs/content-sources.md](docs/content-sources.md)：教材の参照先と確認範囲
- [public/style.css](public/style.css)：レスポンシブUI
- [server.mjs](server.mjs)：localhost限定の静的配信
- [test/engine.test.js](test/engine.test.js)：学習ロジックと教材構造のテスト

学習記録は「理解度」の選択時に保存します。解説を読んだだけでは保存しません。期限を迎えた問題を先に出し、未学習、将来の復習予定の順で3問選びます。復習専用モードは期限到来分のみです。

初回の自信あり正解は3日後、その後は7・14・30日後へ。不正解または「まだ不安」は翌日、「少し迷った」は3日後に復習します。これは検証前の簡易ルールです。繰り返し不正解時の基礎問題への分岐は未実装。

1回のセッションは最大3問ですが、教材の問題数を3問・22問に制限しているわけではありません。単元別演習の結果画面から「この単元を続ける」で次のセッションへ進めます。LOS対応確認画面では、関連する問題を1問指定して開けます。

## 現時点の制約と次の開発

1. 教材は10分野・80単元・396問。公式2027アウトラインの340項目を位置ごとに照合し、関連問題を記録しました。すべて部分対応であり、全動詞・条件・例外を満たす完全対応や専門家監修は未完了です。80単元は本アプリ独自の単元数で、読了や問題数を公式網羅率として表示しません。2026年版との差分・Practical Skills Modulesは対象外です。
2. 学習記録は端末内に保存し、設定画面で非公開 GitHub Gist と連携すると PC・Android 間で自動同期・マージされます。連携しない場合は従来どおり JSON の書き出し／読み込みで移行できます。通知、決済、AI質問は未実装です。
3. Web版は教材のオフライン保存完了後に通信なしで利用できます。Android版は初回から教材を同梱。フォントは端末内のものを使用します。公式PDFなど外部リンクには通信が必要です。
4. ブラウザデータの消去やAndroidアプリのアンインストール・データ消去で記録が消えます。定期的にJSONを保存し、設定画面から読み込んで復元してください。WebとAndroidの記録は別々です。
5. 受験予定日は保存のみ。出題・計画には未反映です。
6. アクセシビリティ、実機動作、データ形式移行は引き続き確認が必要です。

CFA Instituteとは提携していない独立した学習プロトタイプです。
