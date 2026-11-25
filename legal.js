import { releaseInfo } from './release-info.js';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function privacyMarkup(info = releaseInfo) {
  return `<section class="card legal-copy"><h2>CFA Pocket データの保存について</h2><p>更新日：${escapeHtml(info.policyUpdated)}</p><p>CFA Pocketは、自分専用で使う学習アプリです。メールアドレスやパスワードの入力は不要です。</p><h3>端末内の学習記録</h3><p>回答履歴、正答率、復習予定、保存用語、読了記録、目標回答数、受験予定日は端末内に保存します。Androidではアプリ専用領域、Webではブラウザ内に保存します。学習記録を外部サーバーへ自動送信しません。広告・解析・クラッシュ収集SDKは組み込んでいません。</p><h3>バックアップと復元</h3><p>設定画面から学習データをJSONファイルに書き出し、別の端末で読み込めます。端末間の自動同期はありません。バックアップには学習記録と設定が含まれるため、自分で保存先を管理してください。</p><h3>記録の削除</h3><p>設定画面の「学習データの初期化」で端末内の記録を削除できます。アプリのアンインストールやOSのデータ消去、Webのサイトデータ消去でも記録が失われるため、必要な記録は先にバックアップしてください。別の端末や書き出したJSONファイルは、それぞれの保存先で削除してください。</p><h3>通信と外部リンク</h3><p>Android版は教材をアプリ内に収録しています。Web版は初回読み込みと教材更新に通信を使い、オフライン保存完了後は通信なしで学習できます。外部の教材リンクを開くと、そのサイトのデータ取扱方針が適用されます。</p></section>`;
}

export function aboutMarkup(info = releaseInfo) {
  return `<section class="card legal-copy"><h2>${escapeHtml(info.appName)}</h2><p>バージョン ${escapeHtml(info.versionName)} (${info.versionCode})</p><p>自分専用のCFA Level I学習アプリです。学習記録はこの端末に保存します。</p><p>英語の問題と日本語の解説で基礎を学ぶ、独立した学習アプリです。CFA Instituteとの提携・承認はありません。合格や教材の完全網羅を保証しません。</p><p>教育目的の内容であり、個別銘柄の推奨・投資助言・証券取引・資産運用サービスを提供しません。収録内容は独自作成の学習サンプルで、専門家監修は未完了です。</p><p><a class="text-link" href="#privacy">データの保存について →</a></p><p><a class="text-link" href="/licenses.html">オープンソースライセンス →</a></p></section>`;
}
