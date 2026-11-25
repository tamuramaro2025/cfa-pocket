// 問題を解くために実際の計算を要する問題を人手で分類。単なる数字を含む概念問題は含めない。
export const calculationIds = new Set([
  'q1','q3','q4','q6','q8','q9','q10','q11','q12','q13','q14','q15','q16','q17','q18','q19','q22','q23','q24','q25','q26','q28','q29','q37','q38','q39','q41','q43','q44','q45','q46','q49','q50','q51','q52','q56','q57','q58','q59',
  'u-quant-returns-1','u-quant-cashflows-1','u-quant-probability-1','u-quant-probability-2','u-quant-distributions-2','u-quant-sampling-1','u-quant-regression-1','u-quant-regression-2',
  'u-econ-cycles-1','u-econ-fiscal-1','u-econ-monetary-2','u-econ-fx-cross-1','u-econ-fx-forward-1',
  'u-fsa-reports-1','u-fsa-balance-1','u-fsa-cashflows-1','u-fsa-cashflows-2','u-fsa-inventory-2','u-fsa-taxes-1','u-fsa-quality-models-1',
  'u-fixed-contracts-2','u-fixed-funding-1','u-fixed-pricing-1','u-fixed-yields-1','u-fixed-yields-2','u-fixed-curves-1','u-fixed-duration-1','u-fixed-credit-1',
  'u-derivatives-forwards-1','u-derivatives-forwards-2','u-derivatives-futures-1','u-derivatives-swaps-1','u-derivatives-option-values-1','u-derivatives-parity-1','u-derivatives-binomial-1','u-derivatives-binomial-2',
  'u-alternative-performance-1','u-alternative-real-estate-2','u-corporate-liquidity-1','u-corporate-capital-allocation-1','u-corporate-leverage-1','u-equity-trading-2','u-equity-dcf-2','u-equity-multiples-1','u-equity-forecasting-1','u-portfolio-capm-1','u-portfolio-performance-1',
  'los-35','los-35-downside','los-40','los-42','los-42-variance','los-59','los-14-mwr','los-15-index','los-47-interval','los-77-anova','los-103','los-160-points',
  'los-229','los-236','los-254','los-259','los-264','los-281','los-283','los-304','los-333','los-343','los-240-dilution','los-259-suppliers','los-281-disposal',
  'los-402','los-410','los-418','los-426','los-387-two-stage',
  'los-478','los-489','los-490','los-493','los-495-par','los-500','los-503','los-515','los-519','los-507-pvbp','los-539','los-557','los-598','los-579-short-put','los-598-settlement',
  'los-637-fees','los-680','los-682','los-691','los-703-m2','los-703-alpha',
  'los-49-test-stat','los-52-expected-count','los-150-fx-percent','los-271-cost-method','los-512-price-convexity','los-80-see','los-31-weighted-mean','los-57-correlated-portfolio','los-15-cap-index'
]);
