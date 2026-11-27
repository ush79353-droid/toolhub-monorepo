import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const KARVONEN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Karvonen Formula Calculator' },
  { id: 'why-target', label: 'Why do we need the target heart rate?' },
  {
    id: 'how-target',
    label: 'How do I calculate target heart rate using the Karvonen formula?',
  },
  {
    id: 'how-max',
    label: 'How do I calculate Karvonen formula for maximum heart rate?',
  },
  { id: 'how-to-use', label: 'How to use this Karvonen formula calculator?' },
  { id: 'karvonen-faq', label: 'FAQs' },
];

export const KARVONEN_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Karvonen formula for target heart rate?',
    answer:
      'THR = resting HR + (intensity/100) × (maximum HR − resting HR). Heart rate reserve is maximum HR minus resting HR.',
  },
  {
    question: 'How is maximum heart rate estimated when unknown?',
    answer:
      'This educational worksheet uses the Fox estimate: maximum HR (bpm) = 220 − age (years). Measured max HR is preferred when available.',
  },
  {
    question: 'What intensity should I use?',
    answer:
      'Moderate exercise is often discussed around 50–70% of heart rate reserve; many fat-burning zone references cite about 60–80%. Individual targets belong with a clinician or coach.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your heart-rate numbers.',
  },
];
