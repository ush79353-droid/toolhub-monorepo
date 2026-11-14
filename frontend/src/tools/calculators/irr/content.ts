import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IRR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-irr', label: 'What Is IRR?' },
  { id: 'irr-formula', label: 'IRR Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'irr-faq', label: 'Frequently Asked Questions' },
];

export const IRR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is internal rate of return (IRR)?',
    answer:
      'IRR is the annual discount rate that makes the net present value of an investment and its future cash flows equal to zero.',
  },
  {
    question: 'How is IRR calculated?',
    answer:
      'Solve 0 = −Initial Investment + Σ [Cash Flow(t) ÷ (1 + r)^t] for r using a numerical root-finding method. It is not a simple average return.',
  },
  {
    question: 'Can annual cash flows be negative?',
    answer:
      'Yes. Positive values are earnings/inflows; negative values are expenses or losses. A unique IRR still requires one overall sign change from the initial outlay.',
  },
  {
    question: 'Why might no IRR appear?',
    answer:
      'If cash flows do not cross zero in a way that yields a unique real root (for example multiple sign changes), or if inputs are incomplete, the calculator leaves the result blank instead of showing NaN.',
  },
];
