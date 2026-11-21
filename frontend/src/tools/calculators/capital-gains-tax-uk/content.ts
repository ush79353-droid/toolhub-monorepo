import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAPITAL_GAINS_TAX_UK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Capital Gains Tax UK Calculator' },
  { id: 'how-cgt-works', label: 'How UK CGT Works' },
  { id: 'rates', label: 'Rates and Allowances' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'uk-cgt-faq', label: 'Frequently Asked Questions' },
];

export const CAPITAL_GAINS_TAX_UK_FAQS: readonly FAQItem[] = [
  {
    question: 'What is UK Capital Gains Tax?',
    answer:
      'Capital Gains Tax (CGT) is charged on gains when you dispose of chargeable assets (for example shares, most crypto, or property that is not fully covered by Private Residence Relief), after deducting the annual exempt amount and applying HMRC rates.',
  },
  {
    question: 'Which tax years does this calculator support?',
    answer:
      '2025/26 and 2026/27, using HMRC rates and annual exempt amounts published on GOV.UK. Obsolete screenshot-only years are not offered.',
  },
  {
    question: 'What income should I enter?',
    answer:
      'Enter taxable income after Personal Allowance and Income Tax reliefs — the figure HMRC uses when allocating the basic-rate band to gains. Annual income and other income are summed.',
  },
  {
    question: 'How are Shares, Property, Crypto, and Other taxed here?',
    answer:
      'For 2025/26 and 2026/27, individuals pay 18% within the unused basic-rate band and 24% above it for these asset classes (residential and non-residential rates are aligned). Property still assumes no Private Residence Relief.',
  },
  {
    question: 'What if the assets are in a trust?',
    answer:
      'Most trustees use a half-size annual exempt amount (£1,500 when the individual AEA is £3,000) and a flat 24% rate. Vulnerable-beneficiary and multi-settlement AEA reductions are not modelled.',
  },
  {
    question: 'What is the GOV.UK worked example?',
    answer:
      'For 2026/27: taxable income £20,000 and gains £12,600 → AEA £3,000 leaves £9,600 chargeable, all within the £37,700 basic band → CGT £1,728 at 18%.',
  },
  {
    question: 'Is this official tax advice?',
    answer:
      'No. It is an educational estimate. Losses, reliefs (PRR, BADR), carried interest, and complex trust rules can change the result. Confirm with HMRC guidance or a qualified adviser.',
  },
];
