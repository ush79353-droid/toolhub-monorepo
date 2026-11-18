import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TRUE_COST_RE_COMMISSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'what-is-true-cost-commission',
    label: 'What Is the True Cost of Real Estate Commission?',
  },
  { id: 'true-cost-commission-formula', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'true-cost-commission-faq', label: 'Frequently Asked Questions' },
];

export const TRUE_COST_RE_COMMISSION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is apparent commission vs commission amount?',
    answer:
      'Apparent commission is only the buyer’s commission share of the property price. Commission amount is the full cash commission at closing: property price × (seller’s % + buyer’s %). The seller’s share is usually baked into the asking price, so buyers effectively fund both.',
  },
  {
    question: 'How can commission be part of my mortgage?',
    answer:
      'Because commission is embedded in the sale price, a share of it is financed whenever you borrow. Loan commission = commission amount × (loan amount ÷ property price). That financed share accrues mortgage interest over the term.',
  },
  {
    question: 'How is real commission cost calculated?',
    answer:
      'Real commission cost = (commission amount − loan commission) + (monthly commission payment × number of payments). Equivalently, it is the cash commission plus all interest paid on the financed commission share.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Property price and down payment convert numerically when their currencies change, using MongoDB-backed rates. Mortgage and commission results each have independent display currencies. Commission rates, term, and interest rate % are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
