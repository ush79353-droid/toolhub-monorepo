import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LOTTERY_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-lottery-tax-calculator', label: 'What Is This Calculator?' },
  { id: 'lottery-tax-formulas', label: 'Formulas' },
  { id: 'lottery-tax-us', label: 'US Tax Mode' },
  { id: 'lottery-tax-example', label: 'Example' },
  { id: 'lottery-tax-faq', label: 'Frequently Asked Questions' },
];

export const LOTTERY_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the lump-sum payout calculated?',
    answer:
      'Lump Sum Payout = Annuity payout × Lump-sum percentage ÷ 100. Example: 1,200,000,000 × 52% = 624,000,000.',
  },
  {
    question: 'How does the annuity schedule work?',
    answer:
      'The advertised annuity amount is treated as the sum of nominal annual payments. Default setup is 30 years with 5% annual growth (Powerball-style graduated payments). First payment = A × g / ((1+g)^n − 1) when growth ≠ 0. Taxes apply independently to each year’s gross payment.',
  },
  {
    question: 'What does US taxes mode do?',
    answer:
      'US mode sets Tax I to the IRC §3402(q) 24% federal withholding rate commonly applied to lottery proceeds of $5,000 or more. That is withholding, not final federal tax. Tax II stays 0% because this tool does not invent state rates — enter a state rate under Customized tax rates.',
  },
  {
    question: 'Does the Difference column include time value of money?',
    answer:
      'No. The comparison is nominal only. Choosing lump sum vs annuity for personal finance requires a discount rate and other assumptions this calculator does not apply.',
  },
];
