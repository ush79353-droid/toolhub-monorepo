import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STAMP_DUTY_LAND_TAX_UK_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Stamp Duty Land Tax Calculator UK' },
    { id: 'how-sdlt-works', label: 'How SDLT Works' },
    { id: 'rates', label: 'Rates and Reliefs' },
    { id: 'how-to-use', label: 'How to Use' },
    { id: 'example', label: 'Worked Example' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'sdlt-faq', label: 'Frequently Asked Questions' },
  ];

export const STAMP_DUTY_LAND_TAX_UK_FAQS: readonly FAQItem[] = [
  {
    question: 'What is Stamp Duty Land Tax?',
    answer:
      'SDLT is a tax on purchases of land and property in England and Northern Ireland. It is charged on increasing portions of the price (marginal bands), not a single flat rate on the whole amount.',
  },
  {
    question: 'Which nations does this calculator cover?',
    answer:
      'England and Northern Ireland only. Scotland uses Land and Buildings Transaction Tax (LBTT) and Wales uses Land Transaction Tax (LTT) — different rules and rates.',
  },
  {
    question: 'Which rates schedule is used?',
    answer:
      'Residential rates from 1 April 2025 as published on GOV.UK (retrieved 2026-11-21): standard nil-rate band £125,000; first-time buyer relief up to £300,000 / £500,000; higher rates +5 percentage points; non-UK resident surcharge +2 percentage points.',
  },
  {
    question: 'When do higher rates apply?',
    answer:
      'Typically when the purchase means you will own more than one residential property (additional home or buy-to-let / flip). Moving home / replacing a main residence usually uses standard rates if the previous main home is sold within the HMRC replacement window.',
  },
  {
    question: 'How does first-time buyer relief work?',
    answer:
      'If you (and anyone buying with you) are first-time buyers and the price is £500,000 or less, you pay 0% up to £300,000 and 5% from £300,001 to £500,000. Above £500,000, relief is not available and standard bands apply.',
  },
  {
    question: 'What is the non-UK resident surcharge?',
    answer:
      'Buyers who are not UK resident for SDLT usually pay an extra 2% on top of every applicable residential band rate, including first-time buyer and higher rates.',
  },
  {
    question: 'Is this official tax advice?',
    answer:
      'No. It is an educational estimate. Companies, trusts, shared ownership, linked purchases, lease NPV rent, and other special rules are not modelled. Confirm with HMRC guidance or a qualified adviser.',
  },
];
