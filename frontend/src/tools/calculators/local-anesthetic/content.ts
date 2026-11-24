import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LOCAL_ANESTHETIC_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Local Anesthetic Max Dose' },
  { id: 'limits', label: 'Plain dose ceilings' },
  { id: 'la-faq', label: 'Frequently Asked Questions' },
];

export const LOCAL_ANESTHETIC_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this include epinephrine?',
    answer:
      'No. This worksheet is for plain (without epinephrine) ceilings only, matching the screenshot scope.',
  },
  {
    question: 'Why is bupivacaine capped at 175 mg?',
    answer:
      'FDA Marcaine labeling notes single doses up to 175 mg without epinephrine. The tool also applies a 2.5 mg/kg teaching ceiling and uses the smaller of the two.',
  },
  {
    question: 'Are my values stored?',
    answer: 'No. Inputs stay in your browser. Share uses the public page URL only.',
  },
];
