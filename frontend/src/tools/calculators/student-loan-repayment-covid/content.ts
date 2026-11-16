import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STUDENT_LOAN_REPAYMENT_COVID_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'historical-overview', label: 'Historical Overview' },
  { id: 'why-no-longer-valid', label: 'Why Calculations Are Not Valid' },
  { id: 'current-guidance', label: 'Current Repayment Guidance' },
  { id: 'slrc-faq', label: 'Frequently Asked Questions' },
];

export const STUDENT_LOAN_REPAYMENT_COVID_FAQS: readonly FAQItem[] = [
  {
    question: 'Are federal student loan payments still suspended at 0% interest?',
    answer:
      'No. This page describes a historical COVID-era suspension that referenced December 31, 2020. It does not claim that current federal student loans have suspended payments or a 0% interest rate.',
  },
  {
    question: 'Can I use this tool to estimate my repayment today?',
    answer:
      'No. COVID-era repayment calculations shown in the original reference are no longer applicable. Use our Loan Calculator for general payment estimates, and confirm official rules with your loan servicer.',
  },
  {
    question: 'What was the CARES Act suspension?',
    answer:
      'During the COVID-19 emergency, U.S. federal policy temporarily suspended certain federal student loan payments and applied a 0% interest rate for a period that this page treats as historical, with a December 31, 2020 reference date from the original notice.',
  },
  {
    question: 'Where should I go for current loan payment math?',
    answer:
      'Use the Omega Calculators Loan Calculator at /tools/loan-calculator for monthly payment estimates with fees and extra payment options. Always verify terms with your official loan servicer.',
  },
];
