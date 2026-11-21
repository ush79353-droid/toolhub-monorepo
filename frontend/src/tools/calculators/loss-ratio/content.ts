import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LOSS_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-loss-ratio', label: 'What is the loss ratio?' },
  { id: 'how-to-calculate', label: 'How to calculate the loss ratio?' },
  { id: 'how-to-interpret', label: 'How to interpret loss ratio?' },
  { id: 'vs-combined-ratio', label: 'Loss ratio vs. combined ratio' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'loss-ratio-faq', label: 'Frequently asked questions' },
];

export const LOSS_RATIO_FAQS: readonly FAQItem[] = [
  {
    question:
      'Can the loss ratio be used to analyze companies other than insurance companies?',
    answer:
      'The insurance loss ratio is specifically associated with insurance operations; claim-related costs relative to earned premiums. Other industries may track losses, cost of goods, or operating margins with different definitions. Applying an insurance loss-ratio formula outside insurance usually produces a number that is not comparable to insurer benchmarks.',
  },
  {
    question: 'What is an acceptable loss ratio?',
    answer:
      'Acceptable loss ratios depend on the insurance line, underwriting model, jurisdiction, claims volatility, reinsurance, accounting conventions, and financial objectives. There is no single percentage that is universally “good” for every insurer or product.',
  },
  {
    question: 'Can a loss ratio be negative?',
    answer:
      'Under this calculator’s paid-claims-plus-loss-adjustment-expenses formula with nonnegative inputs, the loss ratio cannot be negative. Some incurred-loss accounting methods can show negative net incurred losses in unusual cases (for example large reserve releases). Those situations are not the same as entering negative claims or expenses here.',
  },
  {
    question: 'What are the main reasons for a high loss ratio?',
    answer:
      'Common drivers include higher-than-expected claim frequency or severity, underpricing, catastrophic events, claims inflation, weak underwriting or risk selection, fraud exposure, and elevated loss adjustment expenses. Causes vary by line and market.',
  },
  {
    question: 'What is the formula for loss ratio?',
    answer:
      'Loss Ratio (%) = ((Insurance Claims Paid + Loss Adjustment Expenses) / Total Premiums Earned) × 100. This tool uses a paid-claims basis matching the reference interface; not an incurred-loss / reserve-adjusted definition.',
  },
  {
    question: 'What is a 70% loss ratio?',
    answer:
      'A 70% loss ratio means claim payments and loss adjustment expenses equal 70% of earned premiums for the selected period. The remaining 30% of premiums is not automatically profit; underwriting expenses, commissions, taxes, and other items may still apply.',
  },
  {
    question: 'Can loss ratio exceed 100%?',
    answer:
      'Yes. Example: earned premiums 1,000,000; claims paid 950,000; loss adjustment expenses 100,000 → loss ratio 105%. Claim-related costs exceeded earned premiums for that period under this definition.',
  },
  {
    question: 'What is the difference between claims paid and claims incurred?',
    answer:
      'Claims paid are actual payments made during the period. Incurred losses typically also reflect changes in claim reserves and related accounting adjustments. An incurred loss ratio can therefore differ from the paid-claims-based ratio this calculator reports.',
  },
  {
    question: 'Does a low loss ratio mean an insurance company is profitable?',
    answer:
      'Not necessarily. A low loss ratio only says that a smaller share of earned premiums went to claims and loss adjustment expenses. Operating expenses, acquisition costs, investment results, taxes, and other items still affect overall profitability. Use the combined ratio and full financials for a broader view.',
  },
  {
    question: 'How do I reduce an insurance loss ratio?',
    answer:
      'Legitimate levers include pricing adequacy, stronger risk assessment and underwriting, fraud prevention, effective claims management, and loss-prevention programs. Unfairly denying valid claims is not an appropriate way to improve the ratio.',
  },
];
