import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FUTURE_SALARY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-future-salary', label: 'What Is Future Salary?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'future-salary-formulas', label: 'Future Salary Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'future-salary-faq', label: 'Frequently Asked Questions' },
];

export const FUTURE_SALARY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is expected future salary calculated?',
    answer:
      'Expected (nominal) future salary compounds current pay at the average annual salary change: Future = Current × (1 + growth%/100)^years. Zero growth leaves pay unchanged; growth may be negative if above −100%.',
  },
  {
    question: 'What is real future salary?',
    answer:
      'Real future salary expresses that nominal future pay in today’s purchasing power after inflation: Real = Future ÷ (1 + inflation%/100)^years. Zero inflation makes real equal to nominal; deflation (above −100%) increases real purchasing power.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Current salary, expected future salary, and real future salary each have independent currencies. Money is normalized with stored FX rates before display. Growth %, inflation %, and years are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
