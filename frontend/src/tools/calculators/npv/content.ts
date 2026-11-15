import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NPV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-npv', label: 'What Is NPV?' },
  { id: 'npv-formula', label: 'NPV Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'npv-faq', label: 'Frequently Asked Questions' },
];

export const NPV_FAQS: readonly FAQItem[] = [
  {
    question: 'What is net present value (NPV)?',
    answer:
      'NPV is the present value of future cash flows minus the initial costs. A positive NPV means the project’s discounted returns exceed the required return; a negative NPV means the opposite.',
  },
  {
    question: 'How is NPV calculated?',
    answer:
      'NPV = −Initial Costs + Σ [Cash Flow(t) / (1 + r)^t], where r is the discount rate as a decimal and t starts at 1.',
  },
  {
    question: 'What are expected cash flows in this calculator?',
    answer:
      'Expected cash flows are the present value of the annual cash flows only (excluding initial costs), discounted at the entered rate. NPV equals expected cash flows minus initial costs.',
  },
  {
    question: 'Can cash flows or NPV be negative?',
    answer:
      'Yes. Annual cash flows may be positive, negative, or zero. NPV may also be negative when discounted returns fall short of the initial outlay.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter all money fields already in the selected currency.',
  },
];
