import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NSFR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'NSFR Calculator' },
  { id: 'what-is', label: 'What Is NSFR?' },
  { id: 'formula', label: 'NSFR Formula' },
  { id: 'asf', label: 'Available Stable Funding Explained' },
  { id: 'rsf', label: 'Required Stable Funding Explained' },
  { id: 'worked-example', label: 'How to Calculate NSFR; Worked Example' },
  { id: 'interpret', label: 'How to Interpret NSFR' },
  { id: 'basel', label: 'Basel III and the 100% NSFR Requirement' },
  { id: 'vs-lcr', label: 'NSFR vs. LCR' },
  { id: 'why-important', label: 'Why Is NSFR Important for Banks?' },
  { id: 'improve', label: 'How Banks Can Improve Their NSFR' },
  { id: 'limitations', label: 'NSFR Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'nsfr-faq', label: 'Frequently Asked Questions' },
];

export const NSFR_FAQS: readonly FAQItem[] = [
  {
    question: 'What does NSFR stand for?',
    answer: 'Net Stable Funding Ratio.',
  },
  {
    question: 'What is NSFR in banking?',
    answer:
      'NSFR is a Basel III structural liquidity metric comparing available stable funding to required stable funding over a one-year horizon.',
  },
  {
    question: 'How do you calculate NSFR?',
    answer:
      'Divide Available Stable Funding (ASF) by Required Stable Funding (RSF) and multiply by 100.',
  },
  {
    question: 'What is the NSFR formula?',
    answer: 'NSFR = (ASF / RSF) × 100.',
  },
  {
    question: 'What is a good NSFR?',
    answer:
      'Basel frameworks generally reference a 100% minimum for covered banks. “Good” depends on jurisdiction, business model, and supervisory expectations; higher is not automatically better.',
  },
  {
    question: 'Why is the minimum NSFR generally 100%?',
    answer:
      'A 100% threshold means weighted stable funding at least matches the weighted funding needed for assets and certain OBS exposures over about one year in the standard framework.',
  },
  {
    question: 'Can NSFR be below 100%?',
    answer:
      'Yes in a calculation. That indicates ASF is below RSF under the inputs used. Supervisory consequences depend on local rules.',
  },
  {
    question: 'Can NSFR be negative?',
    answer:
      'Not under standard nonnegative ASF and positive RSF. Negative ASF is rejected here.',
  },
  {
    question: 'Can NSFR exceed 100%?',
    answer: 'Yes. Many banks operate with buffers above 100%.',
  },
  {
    question: 'What does an NSFR of 120% mean?',
    answer:
      'Illustratively, ASF is 1.2× RSF; about a 20% buffer above the standard minimum under the entered amounts.',
  },
  {
    question: 'What is Available Stable Funding?',
    answer:
      'ASF is the weighted sum of eligible capital and liabilities, with higher weights for more stable, longer-term funding.',
  },
  {
    question: 'How do you calculate ASF?',
    answer:
      'Sum each eligible funding category amount times its ASF factor (for example 100%, 95%, 90%, 50%, or 0% in simplified illustrations).',
  },
  {
    question: 'What is Required Stable Funding?',
    answer:
      'RSF is the weighted funding banks are assumed to need for assets and certain off-balance-sheet items given liquidity, maturity, and encumbrance.',
  },
  {
    question: 'How do you calculate RSF?',
    answer:
      'Sum asset (and OBS) amounts times their RSF factors, using the applicable rule set. This tool’s helper uses illustrative factors only.',
  },
  {
    question: 'What is the difference between ASF and RSF?',
    answer:
      'ASF measures stable funding sources; RSF measures how much stable funding assets and OBS items require.',
  },
  {
    question: 'What is the difference between NSFR and LCR?',
    answer:
      'NSFR is a one-year structural funding ratio (ASF/RSF). LCR is a 30-day HQLA-to-net-outflows stress measure.',
  },
  {
    question: 'Why do banks need stable funding?',
    answer:
      'To reduce rollover risk, support longer-term assets, and limit reliance on short-term wholesale funding that can disappear in stress.',
  },
  {
    question: 'How can banks improve NSFR?',
    answer:
      'Increase eligible stable funding, lengthen maturities, improve deposit stability, adjust asset mix, manage encumbrance, and monitor concentrations; each with cost trade-offs.',
  },
  {
    question: 'What happens if a bank\'s NSFR falls below 100%?',
    answer:
      'Supervisors may require remediation plans, capital/funding actions, or other measures depending on jurisdiction. This calculator does not assess legal consequences.',
  },
  {
    question: 'Is NSFR a measure of solvency?',
    answer:
      'No. NSFR is a funding/liquidity structure metric, not a capital adequacy or solvency ratio.',
  },
  {
    question: 'What is the Basel III NSFR requirement?',
    answer:
      'Basel standards generally reference NSFR ≥ 100% for covered banks after phase-in, subject to national implementation.',
  },
  {
    question: 'What is the NSFR reporting horizon?',
    answer:
      'The standard focuses on a one-year structural horizon for funding stability.',
  },
  {
    question: 'Does NSFR apply to all banks?',
    answer:
      'Scope depends on jurisdiction and institution size/type. Not every bank worldwide is subject to identical NSFR rules.',
  },
  {
    question: 'Can NSFR be used outside banking?',
    answer:
      'The regulatory metric is banking-focused. Analogous funding-stability ideas exist elsewhere, but official ASF/RSF weights are bank-specific.',
  },
  {
    question: 'What are the limitations of NSFR?',
    answer:
      'It depends on classifications and reporting dates, varies by jurisdiction, and does not capture all stress, concentration, currency, or solvency risks.',
  },
];
