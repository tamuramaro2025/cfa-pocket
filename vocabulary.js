// 単元別の重要英単語データ、基礎60問(q1〜q60)の単元紐付け、および問題・解説プレビュー共通部品

export const STANDALONE_QUESTION_UNITS = {
  q1: 'quant-cashflows',
  q2: 'econ-markets',
  q3: 'fsa-balance',
  q4: 'equity-distributions',
  q5: 'fixed-pricing',
  q6: 'quant-returns',
  q7: 'econ-markets',
  q8: 'fsa-reports',
  q9: 'equity-multiples',
  q10: 'fixed-contracts',
  q11: 'quant-probability',
  q12: 'econ-cycles',
  q13: 'fsa-long-assets',
  q14: 'equity-distributions',
  q15: 'fixed-yields',
  q16: 'quant-cashflows',
  q17: 'quant-distributions',
  q18: 'quant-returns',
  q19: 'econ-markets',
  q20: 'econ-trade',
  q21: 'econ-fx-cross',
  q22: 'fsa-balance',
  q23: 'fsa-inventory',
  q24: 'fsa-cashflows',
  q25: 'equity-dcf',
  q26: 'equity-dcf',
  q27: 'equity-trading',
  q28: 'fixed-duration',
  q29: 'fixed-pricing',
  q30: 'fixed-contracts',
  q31: 'ethics-market-integrity',
  q32: 'ethics-professionalism',
  q33: 'ethics-conflicts',
  q34: 'ethics-conflicts',
  q35: 'ethics-clients',
  q36: 'ethics-program-gips',
  q37: 'corporate-capital-allocation',
  q38: 'corporate-capital-allocation',
  q39: 'corporate-capital-structure',
  q40: 'corporate-capital-allocation',
  q41: 'corporate-liquidity',
  q42: 'corporate-governance',
  q43: 'portfolio-preferences',
  q44: 'portfolio-frontier',
  q45: 'portfolio-performance',
  q46: 'portfolio-capm',
  q47: 'portfolio-capm',
  q48: 'portfolio-ips',
  q49: 'derivatives-forwards',
  q50: 'derivatives-option-values',
  q51: 'derivatives-option-values',
  q52: 'derivatives-option-values',
  q53: 'derivatives-futures',
  q54: 'derivatives-swaps',
  q55: 'alternative-real-estate',
  q56: 'alternative-structures',
  q57: 'alternative-real-estate',
  q58: 'alternative-structures',
  q59: 'alternative-structures',
  q60: 'alternative-structures'
};

// 単元の要点(notes/objectives/formula)に登場する補足重要英単語
export const EXTRA_UNIT_TERMS = {
  'quant-returns': [
    ['total return', 'トータルリターン（総合収益率）', '価格変化だけでなく配当・利息の再投資を含めたリターンです。'],
    ['float-adjusted market-cap weighting', '浮動株調整時価総額加重', '市場で実際に取引可能な浮動株のみを対象に時価総額で重み付けする方式です。']
  ],
  'quant-cashflows': [
    ['ordinary annuity', '普通年金（期末払い年金）', '各期の期末に一定額のキャッシュフローが発生する年金です。'],
    ['annuity due', '期首払い年金', '各期の期首に支払いが発生する年金で、普通年金の現在価値に (1 + r) を掛けて求めます。']
  ],
  'quant-probability': [
    ['mutually exclusive events', '排反事象', '同時に起こり得ない事象です（P(A and B) = 0）。独立事象と混同しないよう注意します。'],
    ['prior / posterior probability', '事前確率・事後確率', '新しい情報を得る前の確率が事前確率、ベイズ更新後の確率が事後確率です。'],
    ['total probability rule', '全確率の公式', '互いに排反で全体を尽くすシナリオごとの条件付き確率を加重平均して全体確率を求めます。']
  ],
  'quant-distributions': [
    ['excess kurtosis', '超過尖度', '正規分布の尖度（3）からの超過分で、正なら裾が厚い（fat tail / leptokurtic）ことを示します。'],
    ['lognormal distribution', '対数正規分布', '対数をとると正規分布になる非負の分布で、資産価格のモデル化によく使われます。']
  ],
  'quant-sampling': [
    ['central limit theorem (CLT)', '中心極限定理', '標本サイズ n が十分大きければ、標本平均の分布は正規分布に近づくという定理です。'],
    ['selection bias / survivorship bias', '選択バイアス・生存者バイアス', '標本の選び方に偏りがある状態で、標本数を増やしても自動的には解消しません。']
  ],
  'quant-testing': [
    ['significance level (alpha)', '有意水準（α）', '真の帰無仮説を誤って棄却してしまう確率（第I種の誤り）の許容上限です。'],
    ['power of a test (1 − beta)', '検出力（1 − β）', '誤っている帰無仮説を正しく棄却できる確率です（β は第II種の誤りの確率）。']
  ],
  'quant-regression': [
    ['heteroskedasticity', '不均一分散', '回帰の誤差項の分散が一定でない状態で、係数の標準誤差や検定に影響します。'],
    ['spurious regression', '見せかけの回帰', '本来の因果関係がないにもかかわらず、共通トレンドなどで高い相関・R²が出てしまう現象です。']
  ],
  'quant-simulation-data': [
    ['Monte Carlo simulation', 'モンテカルロ・シミュレーション', '確率分布を仮定して乱数で多数のシナリオを生成し、結果の分布を推定する手法です。'],
    ['overfitting', '過学習（オーバーフィッティング）', '訓練データのノイズまで学習してしまい、未知データ（out-of-sample）での予測精度が落ちる現象です。']
  ],
  'econ-markets': [
    ['marginal revenue / marginal cost (MR = MC)', '限界収入・限界費用', '1単位追加生産したときの収入増分と費用増分で、利潤最大化の基本条件は MR = MC です。'],
    ['average variable cost (AVC)', '平均変動費', '1単位あたりの変動費で、短期では価格が最小AVCを下回ると操業停止点となります。']
  ],
  'econ-cycles': [
    ['leading / coincident / lagging indicators', '先行・一致・遅行指数', '景気の転換点に先立って動く指標、同時に動く指標、遅れて確認する指標です。'],
    ['demand-pull inflation', '需要牽引型インフレ', '総需要が供給能力を上回ることで物価が上昇するインフレです。']
  ],
  'econ-fiscal': [
    ['fiscal multiplier', '財政乗数', '政府支出や減税が、消費の連鎖を通じてGDPを何倍押し上げるかを示す倍率です。'],
    ['crowding-out effect', 'クラウディング・アウト', '財政赤字による国債増発が金利を押し上げ、民間の投資を抑制する効果です。']
  ],
  'econ-monetary': [
    ['neutral interest rate', '中立金利', '景気を過熱も減速もさせない理論上の政策金利水準です。'],
    ['inflation targeting', 'インフレ目標政策', '中央銀行が中期的な物価上昇率の目標を公表して金融政策を運営する枠組みです。']
  ],
  'econ-geopolitics': [
    ['World Bank / WTO', '世界銀行・世界貿易機関', '世界銀行は開発支援・貧困削減、WTOは多国間の貿易ルールと紛争解決を担います。'],
    ['autarky / multilateralism', '自給自足（閉鎖経済）・多国間主義', '他国と貿易・協調しない体制と、複数国で共通ルールを設けて協調する枠組みです。']
  ],
  'econ-trade': [
    ['import quota', '輸入割当（数量制限）', '輸入量を直接制限する規制で、関税と異なり政府に関税収入が入らない場合があります。'],
    ['capital and financial account', '資本・金融収支', '国際収支のうち、国境を越えた投資・貸借・資産取引を記録する勘定です。']
  ],
  'econ-fx-cross': [
    ['spot exchange rate', '直物（スポット）為替レート', '即時（通常2営業日以内）の受渡しに適用される現在の為替レートです。'],
    ['real exchange rate', '実質為替レート', '名目為替レートに2国間の物価水準の比を反映した、購買力ベースの為替レートです。']
  ],
  'econ-fx-forward': [
    ['uncovered interest rate parity', 'カバーなし金利平価', '先物予約を使わない場合、高金利通貨は将来その金利差だけ減価すると見込む理論関係です。'],
    ['forward premium / discount', 'フォワード・プレミアム／ディスカウント', '先物為替レートが直物レートより高い（または低い）状態を指します。']
  ],
  'fsa-reports': [
    ['accrual accounting', '発生主義会計', '現金の収支時点ではなく、経済事象が発生した時点で収益・費用を認識する会計原則です。'],
    ['unqualified (clean) audit opinion', '無限定適正意見', '財務諸表が会計基準に従い適正に表示されていると監査人が認める意見です。']
  ],
  'fsa-balance': [
    ['working capital', '運転資本', '流動資産から流動負債を差し引いた金額で、短期の支払余力を示します。'],
    ['other comprehensive income (OCI)', 'その他の包括利益', '純利益を通らず資本（包括利益）に直入される未実現損益や換算差額などの項目です。']
  ],
  'fsa-cashflows': [
    ['operating / investing / financing activities', '営業・投資・財務キャッシュフロー', '本業の現金収支（CFO）、設備や投資の収支（CFI）、資金調達・返済の収支（CFF）の3区分です。']
  ],
  'fsa-inventory': [
    ['LIFO (last-in, first-out)', '後入先出法', '後から仕入れた在庫を先に売上原価にする方法で、米国会計基準（US GAAP）で認められますがIFRSでは不可です。'],
    ['LIFO reserve', 'LIFO準備金', 'FIFO在庫評価額とLIFO在庫評価額の差額で、LIFO企業をFIFOベースに換算する際に使います。']
  ],
  'fsa-long-assets': [
    ['impairment loss', '減損損失', '資産の帳簿価額が回収可能価額（または公正価値）を上回り、回収不能となった際に計上する評価損です。'],
    ['expensing vs. capitalizing', '費用処理と資産計上', '支出を当期費用にするか、資産に計上して複数年にわたり減価償却・償却するかの違いです。']
  ],
  'fsa-leases-pensions': [
    ['right-of-use (ROU) asset', '使用権資産', '借手がリース期間にわたり対象資産を使用する権利として貸借対照表に計上する資産です。'],
    ['defined contribution (DC) plan', '確定拠出年金', '企業の拠出額が決まっており、運用リスクを従業員（加入者）側が負う年金制度です。'],
    ['restricted stock units (RSUs)', '譲渡制限付株式ユニット', '一定期間の勤務などの条件達成後に株式が交付される株式報酬で、公正価値を期間按分して費用認識します。']
  ],
  'fsa-taxes': [
    ['deferred tax asset (DTA)', '繰延税金資産', '将来の課税所得を減らす一時差異や繰越欠損金から生じる資産で、回収可能性が低下すると評価性引当金を計上します。'],
    ['valuation allowance', '評価性引当金', '繰延税金資産のうち将来回収できないと見込まれる部分を減額する引当金です。']
  ],
  'fsa-quality-models': [
    ['mean reversion', '平均回帰', '異常に高い（または低い）利益率や成長率が、競争などにより時間とともに平均的水準へ近づく傾向です。']
  ],
  'fixed-contracts': [
    ['affirmative (positive) covenant', '作為条項（肯定的コベナンツ）', '財務諸表の提出や保険維持など、発行体が「行うべき義務」を定めた契約条項です。'],
    ['indenture (trust deed)', '社債信託証書（債券契約書）', '発行体と投資家の権利・義務・償還条件・コベナンツを定めた法的契約文書です。']
  ],
  'fixed-funding': [
    ['repurchase agreement (repo)', 'レポ取引（債券現先）', '債券を売却し、将来の一定日に所定価格で買い戻す条件付きの短期資金調達取引です。']
  ],
  'fixed-pricing': [
    ['clean price / full (dirty) price', 'クリーン価格（裸値段）・フル価格（利含み価格）', '経過利息を除いた表示価格がクリーン価格、実際に受渡しで支払う経過利息込み価格がフル価格です。']
  ],
  'fixed-yields': [
    ['yield to maturity (YTM)', '最終利回り（満期利回り）', '満期まで保有し、クーポンを同利回りで再投資できたと仮定した場合の内部収益率（IRR）です。'],
    ['yield to call (YTC)', '償還条項行使利回り', '期限前償還（コール）日にコール価格で償還されると仮定して計算した利回りです。']
  ],
  'fixed-curves': [
    ['par curve', 'パー・カーブ（平価利回り曲線）', '各満期の債券価格がちょうど額面（パー＝100）になるようなクーポン利回りを結んだ曲線です。']
  ],
  'fixed-duration': [
    ['Macaulay duration', 'マコーレー・デュレーション', '債券キャッシュフローの現在価値で加重平均した回収までの期間（年）です。'],
    ['effective duration', '実効デュレーション', '金利変化時にキャッシュフロー自体が変わるコール条項付き債券などにも使える価格感応度指標です。']
  ],
  'fixed-credit': [
    ['probability of default (PD)', 'デフォルト確率', '債務者が元利金の支払義務を履行できなくなる確率です（期待損失 ≈ PD × LGD）。'],
    ['credit migration (downgrade risk)', '格付け推移リスク（格下げリスク）', 'デフォルトに至らなくても格下げによってスプレッドが拡大し債券価格が下落するリスクです。']
  ],
  'fixed-securitization': [
    ['special purpose entity (SPE / SPV)', '特別目的事業体', 'オリジネーター（原保有者）から資産を切り離し、倒産隔離を実現するために設立される法的主体です。'],
    ['contraction risk', '収縮リスク（期限前返済リスク）', '金利低下時に住宅ローンの借換えが増え、MBSの元本が想定より早く返済されて再投資利回りが下がるリスクです。']
  ],
  'derivatives-markets': [
    ['forward commitment', 'フォワード型契約（先渡し約束）', 'フォワード・先物・スワップのように、将来の取引を現時点で義務として約束するデリバティブです。'],
    ['arbitrage / replication', '裁定（アービトラージ）・複製', '同じキャッシュフローを持つ資産間の価格差から無リスク利益を得る取引と、複数資産で同等の損益を合成する手法です。']
  ],
  'derivatives-forwards': [
    ['convenience yield', 'コンビニエンス・イールド（保有便益）', '現物在庫を実際に手元に保有していることで生産停止を防げるなどの非金銭的メリットです。']
  ],
  'derivatives-futures': [
    ['maintenance margin', '維持証拠金', '証拠金口座で維持しなければならない最低残高で、下回ると追証（margin call）で当初証拠金まで補充します。'],
    ['margin call', '追証（マージン・コール）', '日次値洗いで口座残高が維持証拠金を割り込んだ際に求められる追加資金の差入れです。']
  ],
  'derivatives-swaps': [
    ['fixed-rate payer / floating-rate payer', '固定金利支払側・変動金利支払側', '金利スワップで固定金利を払い変動を受け取る側（ペイヤー）と、変動を払い固定を受け取る側（レシーバー）です。']
  ],
  'derivatives-option-values': [
    ['intrinsic value / moneyness', '本質的価値・マネーネス（ITM / ATM / OTM）', '今すぐ権利行使した場合の価値（max(S−X,0) 等）と、原資産価格と行使価格の位置関係です。']
  ],
  'derivatives-parity': [
    ['fiduciary call / protective put', 'フィデューシャリー・コール／プロテクティブ・プット', '「コール＋割引債」と「原資産＋プット」の組み合わせで、満期価値がどちらも max(S_T, X) で一致します。']
  ],
  'derivatives-binomial': [
    ['hedge ratio (delta)', 'ヘッジ比率（デルタ）', '原資産の上昇時・下落時のオプション価値差を原資産価格差で割った比率で、無リスクポートフォリオ構築に使います。'],
    ['no-arbitrage valuation', '無裁定評価', '投資家のリスク選好（実確率）に依存せず、複製ポートフォリオと無リスク金利からデリバティブ価値を定める考え方です。']
  ],
  'derivatives-hedging': [
    ['long hedge', 'ロング・ヘッジ（買いヘッジ）', '将来資産を購入する予定の主体が、価格上昇リスクを抑えるために先物・フォワードを買い建てるヘッジです。'],
    ['basis risk', 'ベーシス・リスク', 'ヘッジ対象資産とヘッジ手段（先物など）の価格差（ベーシス）が予想外に変動し、完全には相殺できないリスクです。'],
    ['credit event', 'クレジット・イベント（信用事由）', 'CDS（クレジット・デフォルト・スワップ）で保護買い手への支払いが発生する破産・支払不履行・債務再編などの事由です。']
  ],
  'alternative-structures': [
    ['general partner (GP) / limited partner (LP)', '無限責任組合員（GP）・有限責任組合員（LP）', 'ファンドを運用・意思決定するGPと、資金を拠出し出資額を上限に責任を負う投資家（LP）です。'],
    ['hurdle rate (preferred return)', 'ハードルレート（優先分配率）', 'GPが成功報酬（インセンティブフィー）を受け取るために最低限達成すべき基準収益率です。']
  ],
  'alternative-performance': [
    ['DPI / RVPI / MOIC', '分配倍率（DPI）・残存価値倍率（RVPI）・投資倍率（MOIC）', '払込資本に対する実現分配額（DPI）、未実現残存価値（RVPI）、その合計である総合倍率（TVPI / MOIC）です。'],
    ['backfill bias / appraisal smoothing', 'バックフィル・バイアス／評価平滑化', '成績の良いファンドだけが後からデータベースに追加される偏りと、非上場資産の評価更新が遅れボラティリティが低く見える現象です。']
  ],
  'alternative-private-equity': [
    ['leveraged buyout (LBO)', 'レバレッジド・バイアウト', '買収対象企業のキャッシュフローや資産を担保に多額の負債（レバレッジ）を活用して企業を買収する手法です。'],
    ['exit strategies (IPO / trade sale / secondary)', 'イグジット戦略（投資回収手段）', 'PEファンドが投資先を株式公開（IPO）、事業会社への売却（トレードセール）、他ファンドへの売却で回収する方法です。']
  ],
  'alternative-private-debt': [
    ['direct lending', 'ダイレクト・レンディング（直接融資）', '銀行を介さずファンド等が中堅企業などへ直接行うシニアまたは劣後の貸付です。'],
    ['distressed debt / unitranche debt', 'ディストレスト債権・ユニトランシェ債権', '経営難企業の割引債権への投資と、シニアローンと劣後ローンを1つの契約・混合金利にまとめた融資形態です。']
  ],
  'alternative-real-estate': [
    ['REIT (Real Estate Investment Trust)', '不動産投資信託（リート）', '投資家から集めた資金で不動産を保有・運営し、賃料収入や売却益の大部分を配当する上場・非上場の投資ビークルです。'],
    ['funds from operations (FFO)', 'FFO（不動産運用キャッシュフロー）', '純利益に減価償却費を足し戻し、物件売却損益を調整した、REITの経常的な収益力を示す指標です。']
  ],
  'alternative-infrastructure': [
    ['brownfield investment', 'ブラウンフィールド投資', 'すでに建設・稼働しており実績のある既存インフラ施設を拡張・運営する比較的リスクの低い投資です。'],
    ['availability-based payment / concession', 'アベイラビリティ支払方式・コンセッション（運営権）', '利用量ではなく施設が利用可能に維持されているかに応じて対価を得る契約と、公共インフラの長期運営権です。']
  ],
  'alternative-commodities': [
    ['backwardation', 'バックワーデーション（逆ざや）', '在庫不足や高いコンビニエンス・イールドにより、期近物より期先物の先物価格の方が低い状態です（ロールイールドが正になりやすい）。'],
    ['roll yield (roll return)', 'ロール・イールド（乗換え収益）', '期近の先物を期先の先物へ乗り換える（ロールする）際に、先物価格とスポット価格の収束から生じる損益です。']
  ],
  'alternative-hedge-digital': [
    ['event-driven / macro / relative value', 'イベント・ドリブン／マクロ／レラティブ・バリュー', 'M&A等の企業イベント、世界経済トレンド、関連証券間の価格歪みを狙うヘッジファンドの代表的戦略です。'],
    ['smart contract / tokenization', 'スマートコントラクト・トークン化', 'ブロックチェーン上で条件充足時に自動実行されるプログラムと、資産の権利をデジタルトークンとして表章する仕組みです。']
  ],
  'ethics-judgment': [
    ['Code of Ethics / Standards of Professional Conduct', '倫理規程（Code）・職業行為基準（Standards）', 'CFA協会が定める6つの高潔な行動原則（Code）と、7分野の具体的な実務ルール（Standards I〜VII）です。'],
    ['situational influences', '状況的要因（短期的な圧力・同調圧力）', '周囲への同調や目先の報酬など、誠実な専門家の倫理的判断を曇らせやすい環境要因です。']
  ],
  'ethics-professionalism': [
    ['independence and objectivity', '独立性と客観性（Standard I(B)）', '贈答品や圧力に影響されず、公正かつ客観的な判断で調査・推奨を行う義務です。'],
    ['misconduct', '不正行為・品位を損なう行為（Standard I(D)）', '詐欺・虚偽・不誠実な行為など、専門職としての信頼や評判を損なう行為を行ってはならない基準です。']
  ],
  'ethics-market-integrity': [
    ['transaction-based / information-based manipulation', '取引型市場操作・情報型市場操作（Standard II(B)）', '仮装売買などで価格や出来高を歪める行為と、虚偽の噂を流して価格を誘導する行為で、いずれも禁止されています。']
  ],
  'ethics-clients': [
    ['loyalty, prudence, and care', '忠実・慎重・注意義務（Standard III(A)）', '顧客の利益を最優先し、合理的な注意と慎重さをもって顧客資産を運用する受託者責任です。'],
    ['performance presentation', '運用実績の提示（Standard III(D)）', '運用成績を示す際は、事実に基づき公平・正確・網羅的に伝え、誤解を招く選別や誇張を避ける義務です。']
  ],
  'ethics-employers': [
    ['loyalty to employer', '雇用主への忠実義務（Standard IV(A)）', '在職中は雇用主の正当な利益を損なう競合行為や機密持ち出しを行わず、退職時も正当な手続を守る義務です。'],
    ['independent practice', '独立営業・副業', '顧客開拓や競合業務を始める場合は、事前に雇用主へ業務内容・期間・報酬を説明し書面等の同意を得る必要があります。'],
    ['compliance procedures', 'コンプライアンス手続の整備', '監督責任者（Standard IV(C)）は違反を防ぐ社内規程の整備・周知・監視を行い、違反発見時は速やかに調査・是正します。']
  ],
  'ethics-analysis': [
    ['diligence and reasonable basis', '相当の注意と合理的根拠（Standard V(A)）', '投資分析・推奨・行動において、徹底した調査と裏付けとなる合理的な根拠を持つ義務です。'],
    ['fact vs. opinion', '事実と意見の明確な区別（Standard V(B)）', '顧客へのレポートや説明では、客観的な事実とアナリスト自身の予測・意見を明確に区別して伝えます。']
  ],
  'ethics-conflicts': [
    ['beneficial ownership', '実質的保有（ベネフィシャル・オーナーシップ）', '本人名義だけでなく家族口座など自分が実質的な経済的利益や議決権を持つ保有分で、取引優先順位（顧客・雇用主優先）の対象となります。']
  ],
  'ethics-program-gips': [
    ['composite', 'コンポジット（同一戦略ファンド群）', 'GIPS基準において、同じ投資目的・戦略で裁量運用されるすべてのポートフォリオを漏れなく束ねた集計単位です。']
  ],
  'corporate-ownership': [
    ['general / limited partnership', 'ジェネラル／リミテッド・パートナーシップ', '業務執行と無限責任を負うGPと、出資額の範囲で有限責任を負うLPから成る事業形態です。'],
    ['double taxation', '二重課税', '株式会社（法人）の利益に法人税が課され、さらに株主への配当に個人所得税が課される仕組みです。']
  ],
  'corporate-governance': [
    ['independent director', '独立社外取締役', '経営陣や大株主と利害関係がなく、客観的な立場から経営監督や監査・報酬委員会を担う取締役です。'],
    ['proxy contest (proxy fight)', '委任状争奪戦', '株主が取締役の選任や経営方針の変更を求めて、他の株主から議決権の委任状を集める行動です。']
  ],
  'corporate-liquidity': [
    ['primary / secondary liquidity sources', '一次的・二次的流動性源泉', '日常の現金・短期借入枠などの一次流動性と、資産売却・増資・債務再編など本業に影響し得る二次流動性です。'],
    ['drag / pull on liquidity', '流動性ドラッグ（流入遅延）・流動性プル（流出加速）', '売掛金回収の遅れや陳腐化在庫（ドラッグ）と、仕入先からの与信縮小・早期支払要求（プル）です。']
  ],
  'corporate-capital-allocation': [
    ['opportunity cost / cannibalization', '機会費用・カニバリゼーション（自社競合）', '既存資産をプロジェクトに使うことで失う最善の代替価値と、新製品が自社の既存製品の売上を奪う影響で、どちらも増分CFに含めます。']
  ],
  'corporate-real-options': [
    ['timing (delay) option', 'タイミング（延期）オプション', 'すぐ投資せず、需要や価格の不確実性が判明するまで投資時期を待てる柔軟性です。'],
    ['expansion (growth) option', '拡張（成長）オプション', '初期投資が好調だった場合に追加投資して事業規模を拡大できる権利です。'],
    ['flexibility / fundamental option', '操業柔軟性オプション・ファンダメンタルオプション', '価格変動に応じて投入資源や生産量を切り替える柔軟性と、資源価格そのものに事業価値が連動する性質です。']
  ],
  'corporate-capital-structure': [
    ['static trade-off theory', '静的トレードオフ理論', '負債の節税効果（メリット）と財務危機コスト（デメリット）が釣り合う点で最適資本構成が決まるという理論です。'],
    ['pecking order theory', 'ペッキング・オーダー理論', '情報の非対称性のため、経営者は「内部留保 → 負債 → 株式新規発行」の順で資金調達を好むという理論です。']
  ],
  'corporate-business-models': [
    ['network effect', 'ネットワーク効果', '利用者や参加者が増えるほどサービス自体の価値が高まり、競合に対する参入障壁になる効果です。'],
    ['recurring revenue / subscription model', '継続課金（リカーリング／サブスクリプション）モデル', '単発の売切りではなく、定額利用料などで継続的・予測可能な収益を得るビジネスモデルです。'],
    ['operating cash flow conversion', '営業キャッシュフロー転換率', '計上された利益がどれだけ実際の現金流入（営業CF）に結びついているかを示す効率性です。']
  ],
  'corporate-leverage': [
    ['degree of operating leverage (DOL)', '営業レバレッジ度（DOL）', '売上数量が1%変化したときに営業利益（EBIT）が何%変化するかを示す感応度で、固定営業費用が大きいほど高まります。'],
    ['degree of financial leverage (DFL)', '財務レバレッジ度（DFL）', '営業利益（EBIT）が1%変化したときに純利益（またはEPS）が何%変化するかを示す感応度で、支払利息（固定財務費用）で高まります。'],
    ['contribution margin', '限界利益（貢献利益）', '販売価格から変動費を差し引いた1単位あたり利益（P − V）で、まず固定費の回収に貢献し、損益分岐点以降は営業利益になります。']
  ],
  'equity-rights': [
    ['common shares vs. preference shares', '普通株式と優先株式', '議決権と残余財産・成長の享受を持つ普通株と、配当・清算で優先される代わりに原則議決権が制限される優先株です。'],
    ['callable / putable common shares', 'コール条項付き・プット条項付き株式', '発行企業が所定価格で買い戻せる株式（callable）と、株主が発行企業へ所定価格で売り戻せる株式（putable）です。']
  ],
  'equity-trading': [
    ['market order / stop order', '成行注文・逆指値（ストップ）注文', '現在の最良気配で即座に約定させる成行注文と、指定したトリガー価格に達したら発注される逆指値注文です。'],
    ['initial margin / maintenance margin', '信用取引の委託保証金率・維持率', '信用買い等で最初に自己資金で差し入れる割合と、価格下落時に追証を防ぐために維持すべき純資産割合です。']
  ],
  'equity-distributions': [
    ['declaration / holder-of-record / payment date', '配当宣言日・株主確定基準日・支払日', '取締役会が配当を発表する日、配当受領株主を確定する基準日（その前営業日等が権利落ち日）、実際に支払われる日です。'],
    ['reverse stock split', '株式併合', '複数株を1株にまとめて株価水準を引き上げる措置で、企業の理論的な時価総額や株主の持分比率は変わりません。']
  ],
  'equity-dcf': [
    ['free cash flow to equity (FCFE) valuation', '株主フリーキャッシュフロー評価', '負債元利払い後の株主に帰属する余剰キャッシュフロー（FCFE）を株主資本コストで割り引いて株主価値を求めるモデルです。']
  ],
  'equity-multiples': [
    ['EV / EBITDA multiple', 'EV/EBITDA倍率', '企業価値（時価総額＋負債−現金）を利払前・税引前・償却前利益で割った倍率で、資本構成や減価償却方法が異なる企業間の比較に適します。'],
    ['price-to-book (P/B) / price-to-sales (P/S)', '株価純資産倍率（PBR）・株価売上高倍率（PSR）', '株価を1株あたり純資産または売上高で割った相対評価指標です。']
  ],
  'equity-forecasting': [
    ['retention ratio (b) / dividend payout ratio', '内部留保率（1 − 配当性向）・配当性向', '純利益のうち社内に再投資する割合（b）と配当に回す割合で、サステナブル成長率は g = ROE × b で表されます。']
  ],
  'equity-industry': [
    ['Porter’s five forces', 'ポーターの5つの競争要因', '新規参入の脅威・代替品の脅威・買い手の交渉力・売り手の交渉力・既存競合間の敵対関係から業界の収益性を分析する枠組みです。'],
    ['cost leadership / differentiation', 'コストリーダーシップ戦略・差別化戦略', '業界最低水準の低コストで競争優位を築く戦略と、独自の付加価値で価格決定力を持つ戦略です。']
  ],
  'equity-research': [
    ['Fama–French multifactor model', 'ファーマ＝フレンチ多ファクターモデル', '市場全体のベータに加え、企業規模（SMB）や割安度（HML）などのファクターで株式リターンを説明するモデルです。']
  ],
  'portfolio-preferences': [
    ['indifference curve', '無差別曲線', 'ある投資家にとって同じ効用（満足度）を与えるリスクと期待リターンの組み合わせを結んだ曲線です。']
  ],
  'portfolio-frontier': [
    ['global minimum-variance portfolio', '最小分散ポートフォリオ', 'リスク資産のみを組み合わせた投資機会集合の中で、最も分散（リスク）が小さくなるポートフォリオです。'],
    ['tangency (market) portfolio', '接点ポートフォリオ（市場ポートフォリオ）', '無リスク資産から効率的フロンティアへ引いた接線（資本市場線：CML）が接する、シャープレシオ最大のポートフォリオです。']
  ],
  'portfolio-capm': [
    ['systematic (non-diversifiable) risk', 'システマティック・リスク（市場リスク）', '金利や景気など市場全体に起因し、分散投資では消せないリスクで、ベータ（β）によって測定されます。'],
    ['alpha (Jensen’s alpha)', 'アルファ（超過収益）', '実際のポートフォリオ収益率から、ベータに応じたCAPMの理論期待収益率を差し引いた超過リターンです。']
  ],
  'portfolio-ips': [
    ['LLTTU constraints (Liquidity, Legal, Time horizon, Tax, Unique)', 'IPSの5つの投資制約（流動性・法規制・期間・税金・固有事情）', '投資方針書（IPS）で整理する代表的な5つの制約条件の頭文字です。']
  ],
  'portfolio-allocation': [
    ['strategic asset allocation (SAA)', '戦略的資産配分（SAA）', 'IPSの長期的なリスク・リターン目標と制約に合わせて定める、基本となる長期ターゲット資産配分です。']
  ],
  'portfolio-behavior': [
    ['loss aversion / disposition effect', '損失回避バイアス・ディスポジション効果', '同額の利益より損失の痛みを強く感じ、含み益の銘柄を早く売り含み損の銘柄を塩漬けにしやすくなる傾向です。'],
    ['overconfidence / hindsight bias', '過信バイアス・後知恵バイアス', '自分の予測精度を過大評価する偏りと、結果を知った後に「最初から予測できた」と思い込む偏りです。']
  ],
  'portfolio-risk': [
    ['conditional VaR (CVaR / expected shortfall)', '条件付きVaR（期待ショートフォール）', 'VaR（一定の損失閾値）を超えた最悪ケースにおいて、平均していくらの損失が出るかを示すテールリスク指標です。']
  ],
  'portfolio-performance': [
    ['tracking error (active risk)', 'トラッキング・エラー（アクティブリスク）', 'ポートフォリオのリターンとベンチマークのリターンの差（アクティブリターン）の標準偏差です。']
  ]
};

export function unitIdForQuestion(q) {
  return q?.unit || STANDALONE_QUESTION_UNITS[q?.id] || '';
}

export function questionsForUnit(unit, allQuestions) {
  const direct = Array.isArray(unit?.questions) ? unit.questions : [];
  const directIds = new Set(direct.map(q => q.id));
  const mapped = (allQuestions || []).filter(q => !directIds.has(q.id) && unitIdForQuestion(q) === unit?.id);
  return [...direct, ...mapped];
}

export function vocabularyForUnit(unit, allQuestions) {
  const qs = questionsForUnit(unit, allQuestions);
  const seen = new Set();
  const items = [];
  for (const q of qs) {
    const key = q.term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({
      term: q.term,
      meaning: q.meaning,
      note: q.summary,
      questionId: q.id,
      question: q,
      unitId: unit.id,
      topic: unit.topic
    });
  }
  for (const [term, meaning, note] of EXTRA_UNIT_TERMS[unit.id] || []) {
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({
      term,
      meaning,
      note,
      questionId: '',
      question: null,
      unitId: unit.id,
      topic: unit.topic
    });
  }
  return items;
}

export function allVocabulary(units, allQuestions) {
  return units.flatMap(u => vocabularyForUnit(u, allQuestions));
}

export function questionProgressBadge(q, state, esc) {
  const p = state?.progress?.[q.id];
  const saved = state?.bookmarks?.includes(q.id);
  const star = saved ? '<span class="q-badge saved">★ 保存済み</span>' : '';
  if (!p) return `${star}<span class="q-badge unseen">未回答</span>`;
  if (p.lastCorrect && p.lastConfidence === 'sure') {
    return `${star}<span class="q-badge mastered">✓ 正解・自信あり（${p.correct}/${p.attempts}）· 次回 ${esc(p.due)}</span>`;
  }
  if (p.lastCorrect) {
    return `${star}<span class="q-badge review">△ 正解・要復習（${p.correct}/${p.attempts}）· 次回 ${esc(p.due)}</span>`;
  }
  return `${star}<span class="q-badge wrong">× 要復習（${p.correct}/${p.attempts}）· 次回 ${esc(p.due)}</span>`;
}

export function renderQuestionPreview(q, { state, topics = [], units = [], esc, showUnitLink = true, openByDefault = false }) {
  const topic = topics.find(t => t.id === q.topic);
  const uId = unitIdForQuestion(q);
  const unit = units.find(u => u.id === uId);
  const bookmarked = Boolean(state?.bookmarks?.includes(q.id));
  return `<article class="q-preview-card" id="q-card-${esc(q.id)}">
    <div class="q-preview-head">
      <div class="q-preview-title">
        ${topic ? `<span class="pill soft">${esc(topic.name)}</span>` : ''}
        <span class="q-id-label">${esc(q.id)}</span>
        <strong class="q-term-title">${esc(q.term)}</strong>
        <span class="q-meaning-title">（${esc(q.meaning)}）</span>
      </div>
      <div class="q-preview-badges">${questionProgressBadge(q, state, esc)}</div>
    </div>
    <p class="q-preview-prompt" lang="en">${esc(q.prompt)}</p>
    <details class="q-preview-details" ${openByDefault ? 'open' : ''}>
      <summary>選択肢と正解・日本語解説を見る</summary>
      <div class="q-preview-body">
        <div class="q-preview-options">
          ${q.options.map((opt, i) => `<div class="q-preview-opt ${i === q.answer ? 'is-answer' : ''}"><span class="q-opt-letter">${'ABC'[i]}</span><span lang="en">${esc(opt)}</span>${i === q.answer ? '<b>✓ 正解</b>' : ''}</div>`).join('')}
        </div>
        <div class="q-preview-exp">
          <p class="q-exp-summary"><b>要点：</b>${esc(q.summary)}</p>
          <p>${esc(q.explanation)}</p>
          <div class="q-exp-reasons">
            ${q.reasons.map((reason, i) => `<p><b>${'ABC'[i]}.</b> ${esc(reason)}</p>`).join('')}
          </div>
        </div>
      </div>
    </details>
    <div class="q-preview-actions">
      <button class="secondary" data-action="audit-question" data-id="${esc(q.id)}">この1問を解く →</button>
      <button class="secondary" data-action="bookmark" data-id="${esc(q.id)}">${bookmarked ? '✓ 用語を保存済み' : '＋ 用語を保存'}</button>
      ${showUnitLink && unit ? `<a class="text-link" href="#lesson/${esc(unit.id)}">単元「${esc(unit.title)}」へ →</a>` : ''}
    </div>
  </article>`;
}
