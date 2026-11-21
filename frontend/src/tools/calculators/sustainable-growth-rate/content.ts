import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SGR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is the Sustainable Growth Rate?' },
  { id: 'formula', label: 'Sustainable Growth Rate Formula' },
  { id: 'how-it-works', label: 'How Does the Calculator Work?' },
  { id: 'retention', label: 'What Is the Retention Ratio?' },
  { id: 'roe', label: 'What Is Return on Equity?' },
  { id: 'sgr-vs-igr', label: 'SGR vs. Internal Growth Rate' },
  { id: 'good-sgr', label: 'What Is a Good Sustainable Growth Rate?' },
  { id: 'exceeds', label: 'When Actual Growth Exceeds SGR' },
  { id: 'improve', label: 'How Can a Company Improve Its SGR?' },
  { id: 'limitations', label: 'Limitations of the SGR Model' },
  { id: 'examples', label: 'Practical Examples' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'sgr-faq', label: 'Frequently Asked Questions' },
];

export const SGR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the sustainable growth rate?',
    answer:
      'The sustainable growth rate (SGR) estimates how fast a company can grow sales or assets while keeping its current profitability, payout policy, and capital structure — without issuing new equity. It is a planning benchmark, not a forecast of actual growth.',
  },
  {
    question: 'How do you calculate sustainable growth rate?',
    answer:
      'Compute retention ratio b = (net income − dividends) ÷ net income, compute ROE = net income ÷ equity, then SGR = ROE × b. Example: NI 2,000,000, dividends 1,000,000, equity 10,000,000 → retention 50%, ROE 20%, SGR 10%.',
  },
  {
    question: 'What is the SGR formula?',
    answer:
      'SGR = ROE × retention ratio. With percentages: SGR% = (ROE% × retention%) ÷ 100. Equivalently, SGR% = ((NI − D) ÷ E) × 100 under the simplified model.',
  },
  {
    question: 'What is a good sustainable growth rate?',
    answer:
      'There is no universal “good” SGR. Industry, maturity, reinvestment needs, risk, and opportunity set all matter. Compare peers and ask whether the firm can fund its growth plan without violating financing or payout assumptions.',
  },
  {
    question: 'Can sustainable growth rate be negative?',
    answer:
      'Yes. Negative ROE, negative retention (dividends exceeding earnings), or both can produce a negative SGR. That signals the simplified model does not support positive internal growth under those inputs — not automatic insolvency.',
  },
  {
    question: 'What does a 10% sustainable growth rate mean?',
    answer:
      'Under the model’s assumptions, the firm could theoretically support about 10% growth by retaining earnings while keeping the same ROE and financing mix, without new equity. Actual growth can differ if policies or returns change.',
  },
  {
    question: 'What is the difference between SGR and internal growth rate?',
    answer:
      'Internal growth rate typically uses ROA and assumes no new external financing at all. SGR uses ROE and allows debt to grow with equity under a stable capital structure, but still excludes new equity issuance in the standard model.',
  },
  {
    question: 'How does ROE affect sustainable growth?',
    answer:
      'Higher ROE raises SGR for a given retention ratio because each dollar of equity earns more that can be reinvested. ROE driven only by leverage may raise SGR while increasing financial risk.',
  },
  {
    question: 'How does the retention ratio affect SGR?',
    answer:
      'Higher retention (lower payout) raises SGR for a given ROE because more earnings stay in the business. Cutting dividends to lift SGR has trade-offs for shareholders who value cash distributions.',
  },
  {
    question: 'Does paying dividends reduce sustainable growth?',
    answer:
      'Yes in the simple model: higher dividends lower retention and therefore SGR. That does not mean dividends are “bad” — payout policy balances growth funding against shareholder cash returns.',
  },
  {
    question: 'What happens if actual growth exceeds sustainable growth rate?',
    answer:
      'The firm may need more debt, equity issuance, higher profitability, lower payouts, better working-capital efficiency, or a change in growth ambition. Exceeding SGR is common for growth firms but requires additional resources.',
  },
  {
    question: 'Can a business grow faster than its sustainable growth rate?',
    answer:
      'Yes. Companies often grow faster by raising capital, changing leverage, improving margins, or temporarily running payout policies differently. SGR describes capacity under stated assumptions, not a hard ceiling.',
  },
  {
    question: 'How can a company improve its SGR?',
    answer:
      'By improving sustainable ROE, adjusting payout carefully, allocating retained earnings productively, managing working capital, and avoiding leverage that only inflates ROE without stronger operations.',
  },
  {
    question: 'Why is sustainable growth rate important to investors?',
    answer:
      'SGR helps frame whether growth plans look fundable from internal earnings and assumed leverage. Persistent growth far above SGR without a financing plan can signal dilution, rising leverage, or stretched operations.',
  },
  {
    question: 'Is sustainable growth rate the same as revenue growth?',
    answer:
      'No. SGR is a theoretical capacity measure from ROE and retention. Reported revenue growth is an outcome that can diverge due to strategy, markets, acquisitions, and financing choices.',
  },
  {
    question: 'What are the limitations of the SGR formula?',
    answer:
      'It assumes relatively stable ROE, payout, and capital structure; struggles with negative earnings or equity; ignores lumpy investment needs and cycles; and uses accounting figures that may not match economic reality. Treat it as a planning lens, not a prediction.',
  },
];
