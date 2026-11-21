import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CLTV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'CLTV Calculator' },
  { id: 'what-is', label: 'What Is Customer Lifetime Value?' },
  { id: 'formula', label: 'Customer Lifetime Value Formula' },
  { id: 'how-calculate', label: 'How to Calculate CLTV' },
  { id: 'apv', label: 'Average Purchase Value' },
  { id: 'apf', label: 'Average Purchase Frequency' },
  { id: 'acv', label: 'Average Customer Value' },
  { id: 'lifespan', label: 'Estimating Customer Lifespan' },
  { id: 'revenue-vs-profit', label: 'Revenue vs. Profit CLTV' },
  { id: 'cac', label: 'CLTV vs. CAC' },
  { id: 'good-ratio', label: 'What Is a Good CLTV:CAC Ratio?' },
  { id: 'increase', label: 'How to Increase CLTV' },
  { id: 'ecommerce', label: 'CLTV for Ecommerce' },
  { id: 'saas', label: 'CLTV for SaaS' },
  { id: 'subscription', label: 'CLTV for Subscriptions' },
  { id: 'practice', label: 'CLTV in Practice' },
  { id: 'limitations', label: 'Limitations of CLTV' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cltv-faq', label: 'Frequently Asked Questions' },
];

export const CLTV_FAQS: readonly FAQItem[] = [
  {
    question: 'What is CLTV?',
    answer:
      'CLTV (Customer Lifetime Value) estimates the revenue, or sometimes gross profit, attributable to an average customer over the expected length of the relationship.',
  },
  {
    question: 'What does customer lifetime value mean?',
    answer:
      'It is a planning metric for how much economic value one customer is expected to create while they remain a customer, under stated assumptions about spending and lifespan.',
  },
  {
    question: 'How do you calculate CLTV?',
    answer:
      'A common simplified formula is CLTV = Average Purchase Value × Annual Purchase Frequency × Customer Lifespan (years). Optional margin and discounting produce related variants.',
  },
  {
    question: 'What is the customer lifetime value formula?',
    answer:
      'CLTV = APV × APF × L, where APV is average purchase value, APF is purchases per customer per year, and L is lifespan in years.',
  },
  {
    question: 'What is average purchase value?',
    answer:
      'APV = Total revenue ÷ Total purchases for a defined period. Example: $5,000,000 ÷ 100,000 purchases = $50.',
  },
  {
    question: 'How do you calculate purchase frequency?',
    answer:
      'Period APF = Total purchases ÷ Number of customers. Annualize if the reporting period is not one year (monthly ×12, quarterly ×4, or ×12/m for custom months).',
  },
  {
    question: 'What is average customer value?',
    answer:
      'ACV = APV × annual APF; estimated revenue per customer per year before multiplying by lifespan.',
  },
  {
    question: 'How do you determine average customer lifespan?',
    answer:
      'Use cohort retention, historical tenure, subscription duration, or, as a rough constant-hazard approximation, 1 ÷ annual churn rate. Averages hide segment differences.',
  },
  {
    question: 'What is the difference between CLTV and LTV?',
    answer:
      'They usually refer to the same concept (lifetime value). Naming varies by team; always clarify whether the figure is revenue-based, margin-based, or discounted.',
  },
  {
    question: 'What is the difference between CLTV and customer value?',
    answer:
      '“Customer value” often means annual ACV. CLTV multiplies that annual value by expected lifespan (and may apply margin or discounting).',
  },
  {
    question: 'What is a good customer lifetime value?',
    answer:
      'There is no universal number. Evaluate CLTV against CAC, payback period, margins, and growth goals for your model and industry.',
  },
  {
    question: 'What is the CLTV:CAC ratio?',
    answer:
      'CLTV ÷ CAC. Prefer gross-profit CLTV when comparing to acquisition spend. Example: $300 ÷ $100 = 3:1. Benchmarks are context-specific, not guarantees.',
  },
  {
    question: 'How can businesses increase CLTV?',
    answer:
      'Improve retention, raise purchase frequency or order value, upsell/cross-sell thoughtfully, strengthen onboarding and support, and reduce avoidable churn, without inflating CAC unsustainably.',
  },
  {
    question: 'Can customer lifetime value be negative?',
    answer:
      'Revenue CLTV from nonnegative inputs is nonnegative. After costs, a customer relationship can be economically negative even if revenue CLTV looks positive.',
  },
  {
    question: 'Is CLTV based on revenue or profit?',
    answer:
      'Either, if labeled clearly. This calculator’s default is revenue-based; enabling gross margin produces a gross-profit CLTV, not net profit.',
  },
  {
    question: 'How do ecommerce businesses calculate CLTV?',
    answer:
      'Often with average order value, orders per year, lifespan, and optionally gross margin. Align all inputs to the same customer population and period.',
  },
  {
    question: 'How do SaaS businesses calculate customer lifetime value?',
    answer:
      'Commonly with ARPA/ARPU, gross margin, and churn-implied lifespan, or with cohort cash-flow models. The APV×APF×L form is a simplification versus subscription LTV analytics.',
  },
  {
    question: 'What is customer acquisition cost?',
    answer:
      'CAC is the average cost to acquire a customer (sales and marketing spend allocated per new customer) over a defined period.',
  },
  {
    question: 'How does customer retention affect CLTV?',
    answer:
      'Higher retention lengthens expected lifespan and usually raises CLTV if spending per year holds. Retention also supports more stable forecasts.',
  },
  {
    question: 'How does churn affect customer lifetime value?',
    answer:
      'Higher churn shortens expected lifespan. Under a constant annual churn rate c, a rough lifespan estimate is 1/c (e.g., 20% → 5 years).',
  },
  {
    question: 'Can small businesses use a CLTV calculator?',
    answer:
      'Yes. Even approximate CLTV helps compare acquisition offers and retention investments when data is limited, document assumptions clearly.',
  },
  {
    question: 'Why is CLTV important in digital marketing?',
    answer:
      'It frames how much you can afford to spend to acquire and retain customers and which channels create durable value versus one-off transactions.',
  },
  {
    question: 'What are the limitations of the CLTV formula?',
    answer:
      'It assumes steady spending, averages across segments, may ignore discounting, and can confuse revenue with profit. Cohort and cash-flow models are richer.',
  },
  {
    question: 'What is discounted customer lifetime value?',
    answer:
      'The present value of expected future contribution margins, discounting each year’s cash flow. This tool’s optional mode sums M/(1+r)^t for whole years.',
  },
  {
    question: 'What is CLTV for a customer spending $25 per purchase with a three-year lifespan?',
    answer:
      'You also need annual purchase frequency. If APF = 4 purchases/year, CLTV = 25 × 4 × 3 = $300 (revenue-based). Without frequency, CLTV cannot be determined.',
  },
];
