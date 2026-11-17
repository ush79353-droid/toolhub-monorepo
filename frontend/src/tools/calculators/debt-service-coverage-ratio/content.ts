import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEBT_SERVICE_COVERAGE_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    {
      id: 'what-is-dscr',
      label: 'What Is the Debt Service Coverage Ratio?',
    },
    { id: 'dscr-formula', label: 'DSCR Formula' },
    { id: 'step-by-step-example', label: 'Step-by-Step Example' },
    { id: 'dscr-faq', label: 'Frequently Asked Questions' },
  ];

export const DEBT_SERVICE_COVERAGE_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What does DSCR measure?',
    answer:
      'Debt service coverage ratio compares net operating income (NOI) to debt service for the same period. Lenders often look for DSCR above 1.0× (sometimes higher) as a cushion that income can cover loan payments. It is a screening ratio, not a full underwriting model.',
  },
  {
    question: 'How is the loan payment calculated?',
    answer:
      'When total loan, annual interest rate, and term are set, the calculator fills an amortizing monthly payment: M = P × r / (1 − (1+r)^(-n)) with r = annual rate / 1200 and n = term in months. Zero interest uses P / n. You can override the payment; DSCR always uses the payment field as debt service.',
  },
  {
    question: 'What is inside the NOI calculation section?',
    answer:
      'It builds NOI from gross income, expenses %, and vacancy % using NOI = (1 − expenses%) × (1 − vacancy%) × gross income. The result syncs into the NOI field. You can also enter NOI directly.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Total loan, loan payment, and NOI each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. Before DSCR, payment and NOI normalize into the total-loan currency and into monthly periods, so a currency-only change does not alter the ratio. Interest rate, term, and DSCR itself are never converted. If rates are unavailable, cross-currency switching is blocked.',
  },
];
