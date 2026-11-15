import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAPM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-capm', label: 'What Is CAPM?' },
  { id: 'capm-formula', label: 'CAPM Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'capm-faq', label: 'Frequently Asked Questions' },
];

export const CAPM_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the CAPM calculator compute?',
    answer:
      'It estimates an asset’s risk premium and expected return from the risk-free rate, broad market return, and beta using the Capital Asset Pricing Model.',
  },
  {
    question: 'How are asset risk premium and expected return calculated?',
    answer:
      'Asset risk premium = Beta × (Rm − Rf). Expected return R = Rf + Beta × (Rm − Rf). Inputs Rf and Rm are in percent; beta is unitless.',
  },
  {
    question: 'Can beta be zero or negative?',
    answer:
      'Yes. Zero beta means expected return equals the risk-free rate. Negative beta can produce a negative asset risk premium and a lower expected return.',
  },
  {
    question: 'What if the market return is below the risk-free rate?',
    answer:
      'That is allowed. Market risk premium becomes negative, so asset risk premium and expected return can fall below Rf depending on beta.',
  },
];
