# 2027 Level I 教材対応監査

確認日：2026-11-09。公式アウトライン全31ページの340チェック項目を、原文のページ・項目位置で照合しました。

[公式アウトライン](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf) / [アプリの対応確認画面](http://127.0.0.1:4173/#coverage)

## 判定方法

- 問題数の均等配分ではなく、各LOSに関連する問題IDを手動で対応付けました。
- 初回の保守的な対応付けでは169項目に既存問題を確認し、171項目が未紐付けでした。これは関連し得る既存問題が絶対にないと証明する意味ではありません。
- 不足や演習の浅さに応じて176問追加し、合計396問。すべてのLOSに少なくとも部分的な関連問題を記録しています。
- calculate等の実行要求を含む56項目には、それぞれ少なくとも一つの数値演習を確認しました。すべての計算法・例外・応用が揃ったという意味ではありません。
- 全行の判定は「関連演習あり・部分対応」です。完全対応・習得済み・網羅率100%とは判定していません。
- 原文の長文を転載せず、独自監査IDとPDFの開始ページ・ページ内チェック項目番号で特定します。複合LOSの残りの要件や試験難度の検証は補強対象です。

## 分野別結果

| 分野 | LOS数 | 追加前の紐付け | 現在の部分対応 | 未紐付け | 現在の問題数 |
|---|---:|---:|---:|---:|---:|
| 定量分析 | 30 | 23 | 30 | 0 | 42 |
| 経済学 | 30 | 13 | 30 | 0 | 38 |
| 財務諸表分析 | 53 | 18 | 53 | 0 | 56 |
| 株式投資 | 37 | 18 | 37 | 0 | 39 |
| 債券 | 51 | 18 | 51 | 0 | 54 |
| 倫理・職業行為基準 | 33 | 19 | 33 | 0 | 32 |
| 企業財務 | 22 | 14 | 22 | 0 | 30 |
| ポートフォリオ構築 | 40 | 17 | 40 | 0 | 44 |
| デリバティブ・リスク管理 | 22 | 17 | 22 | 0 | 29 |
| オルタナティブ投資 | 22 | 12 | 22 | 0 | 32 |

## 残る補強

関連問題が1問あっても、長いLOSの全条件を検査できません。特に以下は継続して拡充が必要です。

- 統計検定の選択から結論までの複合ケース、分布の条件付き共分散、回帰の残差診断と予測区間の全計算。
- 複数の希薄化証券や会計基準差、財務三表を統合した予測・評価の長いケース。
- 複雑な債券・証券化CF、非平行金利変化、モデル依存のオプション調整。
- 企業別の競争分析・多段階成長・複数評価法を統合する判断。
- 倫理の全サブ基準・例外を横断する複合事例、専門家による内容監修。

Practical Skills Modulesと2026年版との差分は今回の監査対象外です。GIPS等の基礎補助内容も含むため、問題数は試験の出題比率を再現しません。

## 全340項目の根拠

表の問題IDはアプリの「学習範囲の確認」画面で直接選択して演習できます。新規IDは los- で始まります。計算欄の「あり」は計算要求の一部に数値例がある意味です。

| 監査ID | 公式PDFの位置 | 既存問題ID | 追加問題ID | 数値演習 |
|---|---|---|---|---|
| 2027-quant-1 | [p.1 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=1) | q11, q14 | — | — |
| 2027-quant-2 | [p.1 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=1) | q46, u-econ-monetary-2 | — | — |
| 2027-quant-3 | [p.1 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=1) | q18, u-quant-returns-1 | — | あり（一部） |
| 2027-quant-4 | [p.1 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=1) | u-quant-cashflows-1 | los-14-mwr | あり（一部） |
| 2027-quant-5 | [p.1 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=1) | u-quant-returns-2 | los-15-index, los-15-cap-index | あり（一部） |
| 2027-quant-6 | [p.1 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=1) | q16, q25 | — | あり（一部） |
| 2027-quant-7 | [p.2 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | q26, q38 | — | あり（一部） |
| 2027-quant-8 | [p.2 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | u-derivatives-parity-1, u-econ-fx-forward-1 | — | — |
| 2027-quant-9 | [p.2 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | q6, q17 | los-31-weighted-mean | あり（一部） |
| 2027-quant-10 | [p.2 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | u-quant-distributions-1 | — | — |
| 2027-quant-11 | [p.2 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | u-quant-distributions-2 | — | あり（一部） |
| 2027-quant-12 | [p.2 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | — | los-35, los-35-downside | あり（一部） |
| 2027-quant-13 | [p.2 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | q11 | — | あり（一部） |
| 2027-quant-14 | [p.2 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | — | los-40 | あり（一部） |
| 2027-quant-15 | [p.2 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | — | los-42, los-42-variance | あり（一部） |
| 2027-quant-16 | [p.2 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | u-quant-probability-2 | — | — |
| 2027-quant-17 | [p.2 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | u-quant-sampling-1 | los-47-interval | — |
| 2027-quant-18 | [p.2 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | u-quant-testing-1, u-quant-testing-2 | los-49-test-stat | あり（一部） |
| 2027-quant-19 | [p.2 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | — | los-52, los-52-chi, los-52-expected-count | あり（一部） |
| 2027-quant-20 | [p.2 項目14](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | q43, q44 | los-57-correlated-portfolio | あり（一部） |
| 2027-quant-21 | [p.2 項目15](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | — | los-59 | あり（一部） |
| 2027-quant-22 | [p.2 項目16](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | u-portfolio-preferences-1 | — | — |
| 2027-quant-23 | [p.2 項目17](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=2) | — | los-66 | — |
| 2027-quant-24 | [p.3 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=3) | u-quant-sampling-2 | — | — |
| 2027-quant-25 | [p.3 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=3) | — | los-71 | — |
| 2027-quant-26 | [p.3 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=3) | u-quant-regression-1 | — | — |
| 2027-quant-27 | [p.3 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=3) | u-quant-regression-2 | los-77-anova | — |
| 2027-quant-28 | [p.3 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=3) | u-quant-regression-1 | los-80-prediction, los-80-see | あり（一部） |
| 2027-quant-29 | [p.3 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=3) | q46, u-portfolio-capm-1 | — | あり（一部） |
| 2027-quant-30 | [p.3 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=3) | u-quant-simulation-data-1, u-quant-simulation-data-2 | — | — |
| 2027-econ-1 | [p.5 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=5) | u-econ-markets-2, u-corporate-leverage-1 | — | あり（一部） |
| 2027-econ-2 | [p.5 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=5) | u-econ-markets-1 | — | — |
| 2027-econ-3 | [p.5 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=5) | — | los-99 | — |
| 2027-econ-4 | [p.5 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=5) | — | los-101 | — |
| 2027-econ-5 | [p.5 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=5) | — | los-103 | — |
| 2027-econ-6 | [p.5 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=5) | — | los-107 | — |
| 2027-econ-7 | [p.5 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=5) | — | los-108 | — |
| 2027-econ-8 | [p.5 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=5) | — | los-107 | — |
| 2027-econ-9 | [p.6 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-115 | — |
| 2027-econ-10 | [p.6 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-116 | — |
| 2027-econ-11 | [p.6 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-115 | — |
| 2027-econ-12 | [p.6 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | u-econ-fiscal-2 | — | — |
| 2027-econ-13 | [p.6 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | u-econ-geopolitics-2 | — | — |
| 2027-econ-14 | [p.6 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | u-econ-monetary-1 | — | — |
| 2027-econ-15 | [p.6 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-127 | — |
| 2027-econ-16 | [p.6 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-130 | — |
| 2027-econ-17 | [p.6 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-133 | — |
| 2027-econ-18 | [p.6 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-133 | — |
| 2027-econ-19 | [p.6 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | u-econ-geopolitics-2 | — | — |
| 2027-econ-20 | [p.6 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | u-econ-geopolitics-1 | — | — |
| 2027-econ-21 | [p.6 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-139 | — |
| 2027-econ-22 | [p.6 項目14](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | u-econ-geopolitics-1 | — | — |
| 2027-econ-23 | [p.6 項目15](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-143 | — |
| 2027-econ-24 | [p.6 項目16](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | u-econ-trade-1 | — | — |
| 2027-econ-25 | [p.6 項目17](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-146 | — |
| 2027-econ-26 | [p.6 項目18](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | q21 | los-150-fx-percent | あり（一部） |
| 2027-econ-27 | [p.6 項目19](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | u-econ-fx-cross-2 | — | — |
| 2027-econ-28 | [p.6 項目20](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=6) | — | los-155 | — |
| 2027-econ-29 | [p.7 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=7) | u-econ-fx-cross-1 | — | あり（一部） |
| 2027-econ-30 | [p.7 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=7) | u-econ-fx-forward-1, u-econ-fx-forward-2 | los-160-points | あり（一部） |
| 2027-corporate-1 | [p.9 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=9) | u-corporate-ownership-1 | — | — |
| 2027-corporate-2 | [p.9 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=9) | — | los-169 | — |
| 2027-corporate-3 | [p.9 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=9) | — | los-170 | — |
| 2027-corporate-4 | [p.9 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=9) | u-corporate-ownership-2 | — | — |
| 2027-corporate-5 | [p.9 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=9) | — | los-174 | — |
| 2027-corporate-6 | [p.9 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=9) | — | los-175 | — |
| 2027-corporate-7 | [p.9 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=9) | q42, u-corporate-governance-2 | — | — |
| 2027-corporate-8 | [p.9 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=9) | u-corporate-governance-1 | — | — |
| 2027-corporate-9 | [p.9 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=9) | — | los-183 | — |
| 2027-corporate-10 | [p.10 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | q41, u-corporate-liquidity-2 | — | — |
| 2027-corporate-11 | [p.10 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | q3, u-corporate-liquidity-1 | — | — |
| 2027-corporate-12 | [p.10 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | — | los-191 | — |
| 2027-corporate-13 | [p.10 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | — | los-195 | — |
| 2027-corporate-14 | [p.10 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | q37, q38, u-corporate-capital-allocation-1 | — | あり（一部） |
| 2027-corporate-15 | [p.10 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | q40, u-corporate-capital-allocation-2 | — | — |
| 2027-corporate-16 | [p.10 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | u-corporate-real-options-1, u-corporate-real-options-2 | — | — |
| 2027-corporate-17 | [p.10 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | q39 | — | あり（一部） |
| 2027-corporate-18 | [p.10 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | u-corporate-capital-structure-2 | — | — |
| 2027-corporate-19 | [p.10 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | u-corporate-capital-structure-1 | — | — |
| 2027-corporate-20 | [p.10 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | — | los-207 | — |
| 2027-corporate-21 | [p.10 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | u-corporate-business-models-1 | — | — |
| 2027-corporate-22 | [p.10 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=10) | u-corporate-business-models-2 | — | — |
| 2027-fsa-1 | [p.11 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=11) | — | los-218 | — |
| 2027-fsa-2 | [p.11 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=11) | — | los-218 | — |
| 2027-fsa-3 | [p.11 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=11) | u-fsa-reports-2 | — | — |
| 2027-fsa-4 | [p.11 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=11) | — | los-222 | — |
| 2027-fsa-5 | [p.11 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=11) | — | los-225 | — |
| 2027-fsa-6 | [p.11 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=11) | — | los-229 | — |
| 2027-fsa-7 | [p.11 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=11) | u-fsa-long-assets-1 | — | — |
| 2027-fsa-8 | [p.11 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=11) | — | los-236 | — |
| 2027-fsa-9 | [p.12 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | u-fsa-reports-1 | los-240-dilution | あり（一部） |
| 2027-fsa-10 | [p.12 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | q8 | — | — |
| 2027-fsa-11 | [p.12 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | — | los-247 | — |
| 2027-fsa-12 | [p.12 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | u-fsa-balance-2 | — | — |
| 2027-fsa-13 | [p.12 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | — | los-249 | — |
| 2027-fsa-14 | [p.12 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | — | los-250 | — |
| 2027-fsa-15 | [p.12 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | u-fsa-balance-1 | — | あり（一部） |
| 2027-fsa-16 | [p.12 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | — | los-254 | — |
| 2027-fsa-17 | [p.12 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | q24 | — | — |
| 2027-fsa-18 | [p.12 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | — | los-259, los-259-suppliers | — |
| 2027-fsa-19 | [p.12 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | — | los-260 | — |
| 2027-fsa-20 | [p.12 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | — | los-264 | — |
| 2027-fsa-21 | [p.12 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | u-fsa-cashflows-1, u-fsa-cashflows-2 | — | あり（一部） |
| 2027-fsa-22 | [p.12 項目14](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | u-fsa-inventory-2 | — | — |
| 2027-fsa-23 | [p.12 項目15](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | u-fsa-inventory-1 | los-271-cost-method | あり（一部） |
| 2027-fsa-24 | [p.12 項目16](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | — | los-274 | — |
| 2027-fsa-25 | [p.12 項目17](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | u-fsa-long-assets-2 | — | — |
| 2027-fsa-26 | [p.12 項目18](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | — | los-281, los-281-disposal | — |
| 2027-fsa-27 | [p.12 項目19](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=12) | — | los-283 | — |
| 2027-fsa-28 | [p.13 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | u-fsa-leases-pensions-1 | — | — |
| 2027-fsa-29 | [p.13 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | u-fsa-leases-pensions-2 | — | — |
| 2027-fsa-30 | [p.13 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-250 | — |
| 2027-fsa-31 | [p.13 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-296 | — |
| 2027-fsa-32 | [p.13 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | u-fsa-taxes-2 | — | — |
| 2027-fsa-33 | [p.13 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | u-fsa-taxes-1 | — | あり（一部） |
| 2027-fsa-34 | [p.13 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-304 | — |
| 2027-fsa-35 | [p.13 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-309 | — |
| 2027-fsa-36 | [p.13 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-309 | — |
| 2027-fsa-37 | [p.13 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-312 | — |
| 2027-fsa-38 | [p.13 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-313 | — |
| 2027-fsa-39 | [p.13 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-313 | — |
| 2027-fsa-40 | [p.13 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-318 | — |
| 2027-fsa-41 | [p.13 項目14](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-320 | — |
| 2027-fsa-42 | [p.13 項目15](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | u-fsa-quality-models-2 | — | — |
| 2027-fsa-43 | [p.13 項目16](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-326 | — |
| 2027-fsa-44 | [p.13 項目17](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | q3, q23, q8 | — | あり（一部） |
| 2027-fsa-45 | [p.13 項目18](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-329 | — |
| 2027-fsa-46 | [p.13 項目19](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | u-fsa-quality-models-1 | — | あり（一部） |
| 2027-fsa-47 | [p.13 項目20](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-332 | — |
| 2027-fsa-48 | [p.13 項目21](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=13) | — | los-333 | — |
| 2027-fsa-49 | [p.14 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=14) | — | los-333 | — |
| 2027-fsa-50 | [p.14 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=14) | — | los-339 | — |
| 2027-fsa-51 | [p.14 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=14) | — | los-341 | — |
| 2027-fsa-52 | [p.14 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=14) | — | los-343 | — |
| 2027-fsa-53 | [p.14 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=14) | — | los-345 | — |
| 2027-equity-1 | [p.15 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=15) | u-corporate-ownership-2 | — | — |
| 2027-equity-2 | [p.15 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=15) | — | los-354 | — |
| 2027-equity-3 | [p.15 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=15) | u-equity-rights-1 | — | — |
| 2027-equity-4 | [p.15 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=15) | — | los-359 | — |
| 2027-equity-5 | [p.15 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=15) | q27 | — | — |
| 2027-equity-6 | [p.15 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=15) | — | los-364 | — |
| 2027-equity-7 | [p.15 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=15) | u-equity-trading-2 | — | あり（一部） |
| 2027-equity-8 | [p.15 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=15) | u-quant-returns-2 | — | — |
| 2027-equity-9 | [p.16 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | u-equity-distributions-1, u-equity-distributions-2 | — | — |
| 2027-equity-10 | [p.16 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | — | los-373 | — |
| 2027-equity-11 | [p.16 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | q14 | — | あり（一部） |
| 2027-equity-12 | [p.16 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | u-equity-industry-2 | — | — |
| 2027-equity-13 | [p.16 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | u-equity-multiples-1 | — | — |
| 2027-equity-14 | [p.16 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | — | los-380 | — |
| 2027-equity-15 | [p.16 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | u-equity-dcf-1 | — | — |
| 2027-equity-16 | [p.16 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | q26, u-equity-dcf-2 | los-387-two-stage | あり（一部） |
| 2027-equity-17 | [p.16 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | — | los-390 | — |
| 2027-equity-18 | [p.16 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | q25 | — | あり（一部） |
| 2027-equity-19 | [p.16 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | u-equity-multiples-2 | — | — |
| 2027-equity-20 | [p.16 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | q9, u-equity-multiples-1 | — | あり（一部） |
| 2027-equity-21 | [p.16 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | — | los-400 | — |
| 2027-equity-22 | [p.16 項目14](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | — | los-402 | — |
| 2027-equity-23 | [p.16 項目15](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | u-equity-forecasting-2 | — | — |
| 2027-equity-24 | [p.16 項目16](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | — | los-408 | — |
| 2027-equity-25 | [p.16 項目17](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=16) | — | los-410 | — |
| 2027-equity-26 | [p.17 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | — | los-415 | — |
| 2027-equity-27 | [p.17 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | — | los-415 | — |
| 2027-equity-28 | [p.17 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | — | los-418 | — |
| 2027-equity-29 | [p.17 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | u-equity-industry-1 | — | — |
| 2027-equity-30 | [p.17 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | — | los-424 | — |
| 2027-equity-31 | [p.17 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | — | los-424 | — |
| 2027-equity-32 | [p.17 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | — | los-426 | — |
| 2027-equity-33 | [p.17 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | — | los-429 | — |
| 2027-equity-34 | [p.17 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | — | los-429 | — |
| 2027-equity-35 | [p.17 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | u-equity-research-1 | — | — |
| 2027-equity-36 | [p.17 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | q46, u-equity-research-2 | — | — |
| 2027-equity-37 | [p.17 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=17) | — | los-440 | — |
| 2027-fixed-1 | [p.19 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=19) | q10 | — | — |
| 2027-fixed-2 | [p.19 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=19) | u-fixed-contracts-1 | — | — |
| 2027-fixed-3 | [p.19 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=19) | q30, u-fixed-contracts-2 | — | — |
| 2027-fixed-4 | [p.19 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=19) | — | los-454 | — |
| 2027-fixed-5 | [p.19 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=19) | — | los-458 | — |
| 2027-fixed-6 | [p.19 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=19) | — | los-460 | — |
| 2027-fixed-7 | [p.19 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=19) | — | los-461 | — |
| 2027-fixed-8 | [p.20 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | u-fixed-funding-2 | — | — |
| 2027-fixed-9 | [p.20 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | u-fixed-funding-1 | — | — |
| 2027-fixed-10 | [p.20 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-468 | — |
| 2027-fixed-11 | [p.20 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-472 | — |
| 2027-fixed-12 | [p.20 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-461 | — |
| 2027-fixed-13 | [p.20 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-478 | あり（一部） |
| 2027-fixed-14 | [p.20 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | q5 | — | — |
| 2027-fixed-15 | [p.20 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | u-fixed-pricing-2 | — | — |
| 2027-fixed-16 | [p.20 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | u-fixed-yields-2 | — | あり（一部） |
| 2027-fixed-17 | [p.20 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | q15, u-fixed-yields-1 | — | あり（一部） |
| 2027-fixed-18 | [p.20 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-489 | あり（一部） |
| 2027-fixed-19 | [p.20 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-490 | あり（一部） |
| 2027-fixed-20 | [p.20 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-493 | あり（一部） |
| 2027-fixed-21 | [p.20 項目14](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | u-fixed-curves-1 | los-495-par | あり（一部） |
| 2027-fixed-22 | [p.20 項目15](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-497 | — |
| 2027-fixed-23 | [p.20 項目16](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-500 | あり（一部） |
| 2027-fixed-24 | [p.20 項目17](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-501 | — |
| 2027-fixed-25 | [p.20 項目18](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=20) | — | los-503 | あり（一部） |
| 2027-fixed-26 | [p.21 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | q28 | los-507-pvbp | あり（一部） |
| 2027-fixed-27 | [p.21 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-509 | — |
| 2027-fixed-28 | [p.21 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | u-fixed-duration-1 | los-512-price-convexity | あり（一部） |
| 2027-fixed-29 | [p.21 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | u-fixed-duration-1 | — | あり（一部） |
| 2027-fixed-30 | [p.21 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-515 | あり（一部） |
| 2027-fixed-31 | [p.21 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-519 | — |
| 2027-fixed-32 | [p.21 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-519 | あり（一部） |
| 2027-fixed-33 | [p.21 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | u-fixed-duration-2 | — | — |
| 2027-fixed-34 | [p.21 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-525 | — |
| 2027-fixed-35 | [p.21 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | u-fixed-credit-1 | — | — |
| 2027-fixed-36 | [p.21 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-530 | — |
| 2027-fixed-37 | [p.21 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-531 | — |
| 2027-fixed-38 | [p.21 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-535 | — |
| 2027-fixed-39 | [p.21 項目14](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-539 | — |
| 2027-fixed-40 | [p.21 項目15](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-539 | あり（一部） |
| 2027-fixed-41 | [p.21 項目16](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | u-fixed-credit-2 | — | — |
| 2027-fixed-42 | [p.21 項目17](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-546 | — |
| 2027-fixed-43 | [p.21 項目18](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=21) | — | los-546 | — |
| 2027-fixed-44 | [p.22 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=22) | — | los-552 | — |
| 2027-fixed-45 | [p.22 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=22) | u-fixed-securitization-1 | — | — |
| 2027-fixed-46 | [p.22 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=22) | — | los-555 | — |
| 2027-fixed-47 | [p.22 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=22) | — | los-557 | — |
| 2027-fixed-48 | [p.22 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=22) | u-fixed-securitization-2 | — | — |
| 2027-fixed-49 | [p.22 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=22) | — | los-562 | — |
| 2027-fixed-50 | [p.22 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=22) | — | los-563 | — |
| 2027-fixed-51 | [p.22 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=22) | — | los-566 | — |
| 2027-derivatives-1 | [p.23 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=23) | u-derivatives-markets-1 | — | — |
| 2027-derivatives-2 | [p.23 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=23) | — | los-573 | — |
| 2027-derivatives-3 | [p.23 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=23) | q54, u-derivatives-hedging-2 | — | — |
| 2027-derivatives-4 | [p.23 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=23) | q50, q51, q52 | los-579-short-put | — |
| 2027-derivatives-5 | [p.23 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=23) | u-derivatives-markets-1 | — | — |
| 2027-derivatives-6 | [p.23 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=23) | u-derivatives-hedging-2 | — | — |
| 2027-derivatives-7 | [p.23 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=23) | u-derivatives-hedging-1, q54 | — | — |
| 2027-derivatives-8 | [p.23 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=23) | u-derivatives-markets-2 | — | — |
| 2027-derivatives-9 | [p.24 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | u-derivatives-forwards-1 | — | — |
| 2027-derivatives-10 | [p.24 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | u-derivatives-forwards-1, u-derivatives-forwards-2, q49 | — | — |
| 2027-derivatives-11 | [p.24 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | — | los-598, los-598-settlement | — |
| 2027-derivatives-12 | [p.24 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | u-derivatives-futures-1, u-derivatives-futures-2 | — | — |
| 2027-derivatives-13 | [p.24 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | — | los-603 | — |
| 2027-derivatives-14 | [p.24 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | — | los-606 | — |
| 2027-derivatives-15 | [p.24 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | u-derivatives-swaps-1, u-derivatives-swaps-2 | — | — |
| 2027-derivatives-16 | [p.24 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | u-derivatives-option-values-1 | — | — |
| 2027-derivatives-17 | [p.24 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | u-derivatives-markets-2 | — | — |
| 2027-derivatives-18 | [p.24 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | u-derivatives-option-values-2 | — | — |
| 2027-derivatives-19 | [p.24 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | u-derivatives-parity-1, u-derivatives-parity-2 | — | — |
| 2027-derivatives-20 | [p.24 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | — | los-619 | — |
| 2027-derivatives-21 | [p.24 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | u-derivatives-binomial-2 | — | — |
| 2027-derivatives-22 | [p.24 項目14](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=24) | u-derivatives-binomial-1 | — | — |
| 2027-alternative-1 | [p.25 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=25) | — | los-629 | — |
| 2027-alternative-2 | [p.25 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=25) | — | los-630 | — |
| 2027-alternative-3 | [p.25 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=25) | q58, u-alternative-structures-1 | — | — |
| 2027-alternative-4 | [p.25 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=25) | u-alternative-performance-1, u-alternative-performance-2 | — | — |
| 2027-alternative-5 | [p.25 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=25) | q59, q60 | los-637-fees | あり（一部） |
| 2027-alternative-6 | [p.25 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=25) | u-alternative-private-equity-1, u-alternative-private-equity-2 | — | — |
| 2027-alternative-7 | [p.25 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=25) | u-alternative-private-debt-1, u-alternative-private-debt-2 | — | — |
| 2027-alternative-8 | [p.25 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=25) | — | los-642 | — |
| 2027-alternative-9 | [p.25 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=25) | q57, u-alternative-real-estate-2 | — | — |
| 2027-alternative-10 | [p.25 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=25) | q55, u-alternative-real-estate-1 | — | — |
| 2027-alternative-11 | [p.26 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | u-alternative-infrastructure-1 | — | — |
| 2027-alternative-12 | [p.26 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | u-alternative-infrastructure-2 | — | — |
| 2027-alternative-13 | [p.26 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | — | los-652 | — |
| 2027-alternative-14 | [p.26 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | u-alternative-commodities-1, u-alternative-commodities-2 | — | — |
| 2027-alternative-15 | [p.26 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | — | los-655 | — |
| 2027-alternative-16 | [p.26 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | u-alternative-hedge-digital-1 | — | — |
| 2027-alternative-17 | [p.26 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | — | los-661 | — |
| 2027-alternative-18 | [p.26 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | — | los-662 | — |
| 2027-alternative-19 | [p.26 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | — | los-666 | — |
| 2027-alternative-20 | [p.26 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | — | los-667 | — |
| 2027-alternative-21 | [p.26 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | — | los-667 | — |
| 2027-alternative-22 | [p.26 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=26) | u-alternative-hedge-digital-2 | — | — |
| 2027-portfolio-1 | [p.27 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | — | los-677 | — |
| 2027-portfolio-2 | [p.27 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | u-portfolio-preferences-1 | — | — |
| 2027-portfolio-3 | [p.27 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | — | los-680 | — |
| 2027-portfolio-4 | [p.27 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | — | los-682 | あり（一部） |
| 2027-portfolio-5 | [p.27 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | q44 | — | あり（一部） |
| 2027-portfolio-6 | [p.27 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | — | los-685 | — |
| 2027-portfolio-7 | [p.27 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | u-portfolio-frontier-1 | — | — |
| 2027-portfolio-8 | [p.27 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | — | los-691 | — |
| 2027-portfolio-9 | [p.27 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | u-portfolio-frontier-2 | — | — |
| 2027-portfolio-10 | [p.27 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | q47 | — | — |
| 2027-portfolio-11 | [p.27 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | u-equity-research-2 | — | — |
| 2027-portfolio-12 | [p.27 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=27) | u-portfolio-capm-1 | — | あり（一部） |
| 2027-portfolio-13 | [p.28 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-699 | — |
| 2027-portfolio-14 | [p.28 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | q46 | — | あり（一部） |
| 2027-portfolio-15 | [p.28 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | u-portfolio-capm-2 | — | — |
| 2027-portfolio-16 | [p.28 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | q45, u-portfolio-performance-2 | los-703-m2, los-703-alpha | あり（一部） |
| 2027-portfolio-17 | [p.28 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-706 | — |
| 2027-portfolio-18 | [p.28 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-706 | — |
| 2027-portfolio-19 | [p.28 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-708 | — |
| 2027-portfolio-20 | [p.28 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | u-fsa-leases-pensions-2 | — | — |
| 2027-portfolio-21 | [p.28 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-710 | — |
| 2027-portfolio-22 | [p.28 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-711 | — |
| 2027-portfolio-23 | [p.28 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-715 | — |
| 2027-portfolio-24 | [p.28 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-715 | — |
| 2027-portfolio-25 | [p.28 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | q35 | — | — |
| 2027-portfolio-26 | [p.28 項目14](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | u-portfolio-ips-2 | — | — |
| 2027-portfolio-27 | [p.28 項目15](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | u-portfolio-ips-1 | — | — |
| 2027-portfolio-28 | [p.28 項目16](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-723 | — |
| 2027-portfolio-29 | [p.28 項目17](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | u-portfolio-allocation-1, u-portfolio-allocation-2 | — | — |
| 2027-portfolio-30 | [p.28 項目18](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-726 | — |
| 2027-portfolio-31 | [p.28 項目19](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-730 | — |
| 2027-portfolio-32 | [p.28 項目20](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | u-portfolio-behavior-1, u-portfolio-behavior-2 | — | — |
| 2027-portfolio-33 | [p.28 項目21](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-733 | — |
| 2027-portfolio-34 | [p.28 項目22](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-737 | — |
| 2027-portfolio-35 | [p.28 項目23](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-737 | — |
| 2027-portfolio-36 | [p.28 項目24](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-739 | — |
| 2027-portfolio-37 | [p.28 項目25](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-740 | — |
| 2027-portfolio-38 | [p.28 項目26](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-740 | — |
| 2027-portfolio-39 | [p.28 項目27](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | — | los-742 | — |
| 2027-portfolio-40 | [p.28 項目28](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=28) | u-portfolio-risk-1, u-portfolio-risk-2 | — | — |
| 2027-ethics-1 | [p.29 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | — | los-752 | — |
| 2027-ethics-2 | [p.29 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | — | los-752 | — |
| 2027-ethics-3 | [p.29 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | — | los-752 | — |
| 2027-ethics-4 | [p.29 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | — | los-752 | — |
| 2027-ethics-5 | [p.29 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | — | los-752 | — |
| 2027-ethics-6 | [p.29 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | u-ethics-judgment-2 | — | — |
| 2027-ethics-7 | [p.29 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | u-ethics-judgment-1 | — | — |
| 2027-ethics-8 | [p.29 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | u-ethics-judgment-2 | — | — |
| 2027-ethics-9 | [p.29 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | — | los-762 | — |
| 2027-ethics-10 | [p.29 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | — | los-764 | — |
| 2027-ethics-11 | [p.29 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=29) | — | los-766 | — |
| 2027-ethics-12 | [p.30 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | q32, u-ethics-professionalism-1, u-ethics-professionalism-2 | — | — |
| 2027-ethics-13 | [p.30 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | — | los-773 | — |
| 2027-ethics-14 | [p.30 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | q32, u-ethics-professionalism-1 | — | — |
| 2027-ethics-15 | [p.30 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | q31, u-ethics-market-integrity-1, u-ethics-market-integrity-2 | — | — |
| 2027-ethics-16 | [p.30 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | — | los-781 | — |
| 2027-ethics-17 | [p.30 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | q31, u-ethics-market-integrity-2 | — | — |
| 2027-ethics-18 | [p.30 項目7](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | q35, u-ethics-clients-1, u-ethics-clients-2 | — | — |
| 2027-ethics-19 | [p.30 項目8](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | — | los-789 | — |
| 2027-ethics-20 | [p.30 項目9](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | q35, u-ethics-clients-1 | — | — |
| 2027-ethics-21 | [p.30 項目10](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | u-ethics-employers-1 | — | — |
| 2027-ethics-22 | [p.30 項目11](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | u-ethics-employers-2 | — | — |
| 2027-ethics-23 | [p.30 項目12](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | u-ethics-employers-1 | — | — |
| 2027-ethics-24 | [p.30 項目13](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | u-ethics-analysis-1, u-ethics-analysis-2 | — | — |
| 2027-ethics-25 | [p.30 項目14](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | — | los-805 | — |
| 2027-ethics-26 | [p.30 項目15](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | u-ethics-analysis-1 | — | — |
| 2027-ethics-27 | [p.30 項目16](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=30) | q33, q34, u-ethics-conflicts-1 | — | — |
| 2027-ethics-28 | [p.31 項目1](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=31) | — | los-814 | — |
| 2027-ethics-29 | [p.31 項目2](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=31) | q33, q34, u-ethics-conflicts-2 | — | — |
| 2027-ethics-30 | [p.31 項目3](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=31) | q36, u-ethics-program-gips-1 | — | — |
| 2027-ethics-31 | [p.31 項目4](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=31) | — | los-824 | — |
| 2027-ethics-32 | [p.31 項目5](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=31) | u-ethics-conflicts-2 | — | — |
| 2027-ethics-33 | [p.31 項目6](https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf#page=31) | u-ethics-analysis-1 | — | — |

## 再集計

```sh
node scripts/audit-report.mjs
node --test
```

この監査は教材上の関連性の確認であり、CFA Instituteの認定や専門家による監修ではありません。問題ID参照・単元到達性・計算式等は自動テストで検証し、設問内容の深さの監修とは区別しています。
