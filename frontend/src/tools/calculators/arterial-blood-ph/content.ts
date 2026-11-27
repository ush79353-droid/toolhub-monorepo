import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ARTERIAL_BLOOD_PH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Arterial Blood pH Calculator' },
  { id: 'what', label: 'What is arterial blood gas?' },
  { id: 'formula', label: 'Henderson–Hasselbalch equation' },
  { id: 'example', label: 'Worked example' },
  { id: 'abph-faq', label: 'Frequently Asked Questions' },
];

export const ARTERIAL_BLOOD_PH_FAQS: readonly FAQItem[] = [
  {
    question: 'How is arterial blood pH calculated?',
    answer:
      'pH = 6.1 + log₁₀(HCO₃ / (0.0308 × PaCO₂ in mmHg)), the Henderson–Hasselbalch teaching form for the bicarbonate–carbonic acid buffer.',
  },
  {
    question: 'Can I enter PaCO₂ in kPa?',
    answer:
      'Yes. Choose kPa from the unit menu; the calculator converts to mmHg before applying the 0.0308 solubility coefficient.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
