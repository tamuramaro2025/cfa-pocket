import { extraQuestions } from './questions-extra.js';
import { curriculumQuestions } from './curriculum.js';
const q = (id, topic, prompt, options, answer, summary, explanation, reasons, term, meaning) => ({ id, topic, prompt, options, answer, summary, explanation, reasons, term, meaning });
export const topics = [
  { id: 'quant', name: '定量分析', en: 'Quantitative Methods', icon: '∑', color: '#eee9fb' },
  { id: 'econ', name: '経済学', en: 'Economics', icon: '↗', color: '#e8f0dc' },
  { id: 'fsa', name: '財務諸表分析', en: 'Financial Statement Analysis', icon: '▤', color: '#f9eddb' },
  { id: 'equity', name: '株式投資', en: 'Equities', icon: '◈', color: '#e1eef5' },
  { id: 'fixed', name: '債券', en: 'Fixed Income', icon: '≋', color: '#f4e5e9' },
  { id: 'ethics', name: '倫理・職業行為基準', en: 'Ethical and Professional Standards', icon: '⚖', color: '#e8eedb' },
  { id: 'corporate', name: '企業財務', en: 'Corporate Finance', icon: '▣', color: '#e9eafa' },
  { id: 'portfolio', name: 'ポートフォリオ構築', en: 'Portfolio Construction', icon: '◷', color: '#dfefeb' },
  { id: 'derivatives', name: 'デリバティブ・リスク管理', en: 'Derivatives and Risk Management', icon: '⇄', color: '#f9eadc' },
  { id: 'alternative', name: 'オルタナティブ投資', en: 'Alternative Investments', icon: '◇', color: '#f1e5f2' }
];
export const questions = [
  q('q1','quant','An investment of $1,000 earns 5% annually, compounded annually. Its value after two years is closest to:', ['$1,050.00','$1,100.00','$1,102.50'],2,'複利では、利息にも次の年の利息がつきます。','FV = PV × (1 + r)ⁿ = 1,000 × 1.05² = $1,102.50。2年目は1,050ドルに対して5%の利息がつきます。',['1年後の金額です。','単利で計算した金額です。','元本と利息を再投資した複利の金額です。'],'compounded annually','年1回の複利'),
  q('q2','econ','If the price of a substitute for a good rises, with all else held constant, demand for the good will most likely:', ['Decrease','Increase','Remain unchanged'],1,'代替品の値上がりは、その商品の需要を増やします。','紅茶が値上がりすると、代わりにコーヒーを選ぶ人が増えるイメージです。対象商品の需要曲線は右にシフトします。',['需要が減るのは、補完品の値上がりなどの場合です。','相対的な魅力が上がるため、需要が増えます。','代替品の価格は需要を変化させる要因です。'],'substitute','代替財'),
  q('q3','fsa','A company has current assets of $240 and current liabilities of $120. Its current ratio is:', ['0.5','2.0','3.0'],1,'流動比率は「流動資産 ÷ 流動負債」です。','Current ratio = 240 ÷ 120 = 2.0。流動負債1に対して流動資産が2ある状態です。',['分子と分母が逆です。','240 ÷ 120 = 2.0です。','流動資産と流動負債の和を使う計算ではありません。'],'current liabilities','流動負債'),
  q('q4','equity','A stock pays an annual dividend of $3 and trades at $60. Its dividend yield is:', ['3%','5%','20%'],1,'配当利回りは「年間配当 ÷ 株価」です。','Dividend yield = 3 ÷ 60 = 0.05 = 5%。株価の値上がり益は含みません。',['配当額3ドルをそのまま百分率にした値です。','年間配当を現在の株価で割ります。','株価を配当で割ると20倍ですが、利回りではありません。'],'dividend yield','配当利回り'),
  q('q5','fixed','For a fixed-rate bond with no embedded options, when the required yield rises, its price will most likely:', ['Rise','Fall','Remain unchanged'],1,'固定利付債の価格と要求利回りは、逆方向に動きます。','利回りが上がると、将来のクーポンや元本をより高い割引率で割り引くため、現在価値が下がります。',['価格と利回りは通常、逆方向です。','割引率の上昇は現在価値を下げます。','キャッシュフローが一定でも、割引率が変われば価格は変わります。'],'required yield','要求利回り'),
  q('q6','quant','The arithmetic mean of returns of 4%, 6%, and 8% is:', ['5%','6%','7%'],1,'算術平均は、値の合計を個数で割ります。','(4 + 6 + 8) ÷ 3 = 6%。複数期間の複利成長率を求める幾何平均とは区別します。',['合計18を3で割ると6です。','3つの値の単純平均です。','合計18を3で割ると6です。'],'arithmetic mean','算術平均'),
  q('q7','econ','A market has a price ceiling below its equilibrium price. The most likely result is:', ['A surplus','A shortage','No change in quantity traded'],1,'均衡価格より低い価格上限は、供給不足を生みます。','安い価格では需要量が増える一方、供給量が減るため、需要量が供給量を上回ります。',['供給超過は均衡より高い価格下限などで生じます。','需要量が供給量を上回るため不足します。','拘束力のある価格上限は取引量に影響します。'],'price ceiling','価格上限'),
  q('q8','fsa','Revenue is $500 and cost of goods sold is $300. The gross profit margin is:', ['40%','60%','67%'],0,'売上総利益率は「売上総利益 ÷ 売上高」です。','売上総利益 = 500 − 300 = 200。Gross profit margin = 200 ÷ 500 = 40%。',['売上総利益を売上高で割った正しい値です。','売上原価を売上高で割った値です。','売上総利益を売上原価で割った値に近く、分母が違います。'],'gross profit margin','売上総利益率'),
  q('q9','equity','A stock trades at $48 and has annual earnings per share of $4. Its price-to-earnings ratio is:', ['8 times','12 times','16 times'],1,'PERは「株価 ÷ 1株当たり利益」です。','P/E = 48 ÷ 4 = 12倍。PERだけで割安・割高が決まるわけではなく、成長率やリスクも考慮します。',['48 ÷ 4は12です。','株価を1株当たり利益で割ります。','48 ÷ 4は12です。'],'earnings per share','1株当たり利益（EPS）'),
  q('q10','fixed','A bond has a face value of $1,000 and a 4% annual coupon rate. Total coupon payments per year equal:', ['$25','$40','$400'],1,'年間クーポンは「額面 × クーポンレート」です。','Annual coupon = 1,000 × 0.04 = $40。市場価格が変わっても、固定クーポンの金額は変わりません。',['額面に4%を掛けると40ドルです。','額面1,000ドルの4%です。','4%は0.04です。0.4ではありません。'],'face value','額面金額'),
  q('q11','quant','An investment has a 50% probability of returning 10% and a 50% probability of returning −2%. Its expected return is:', ['4%','6%','8%'],0,'期待リターンは、各リターンを発生確率で加重平均します。','E(R) = 0.5 × 10% + 0.5 × (−2%) = 4%。期待値は実際に必ず得られる利益ではありません。',['発生確率を掛けて足した値です。','マイナス2%をプラスとして扱った値です。','リターンの差であり、期待値ではありません。'],'expected return','期待リターン'),
  q('q12','econ','If nominal GDP grows by 6% and the GDP deflator rises by 2%, real GDP growth is closest to:', ['2%','4%','8%'],1,'実質成長率は、名目成長率から物価上昇の影響を除きます。','厳密には1.06 ÷ 1.02 − 1 ≈ 3.92%。近似的に6% − 2% = 4%と計算できます。',['名目成長から物価の影響を除く必要があります。','厳密な3.92%に最も近い値です。','物価上昇を足すのではなく除きます。'],'GDP deflator','GDPデフレーター'),
  q('q13','fsa','A company purchases equipment for $12,000 with no residual value and a useful life of four years. Annual straight-line depreciation is:', ['$2,000','$3,000','$4,000'],1,'定額法では、償却対象額を耐用年数で均等に配分します。','Annual depreciation = (12,000 − 0) ÷ 4 = $3,000。残存価額がある場合は、取得原価から差し引きます。',['12,000を4年で割ると3,000です。','償却対象額を耐用年数で割った値です。','12,000を4年で割ると3,000です。'],'straight-line depreciation','定額法による減価償却'),
  q('q14','equity','A stock is purchased for $50, pays a $2 dividend, and is sold for $53. Its holding period return is:', ['6%','10%','12%'],1,'保有期間リターンには、値上がり益と配当を含めます。','HPR = (53 − 50 + 2) ÷ 50 = 10%。税金・手数料はないものとします。',['値上がり益だけのリターンで、配当が抜けています。','値上がり益3ドルと配当2ドルの合計を取得価格で割ります。','利益合計5ドルを取得価格50ドルで割ると10%です。'],'holding period return','保有期間リターン'),
  q('q15','fixed','A bond is priced at $950 and pays an annual coupon of $50. Its current yield is closest to:', ['5.00%','5.26%','5.50%'],1,'直接利回りは「年間クーポン ÷ 現在価格」です。','Current yield = 50 ÷ 950 ≈ 5.26%。満期までの償還差損益は考慮しないため、最終利回り（YTM）とは異なります。',['額面1,000ドルと仮定した場合のクーポンレートです。','年間クーポンを市場価格で割った値です。','50 ÷ 950に最も近い値は5.26%です。'],'current yield','直接利回り'),
  ...extraQuestions,
  ...curriculumQuestions
];
