import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DRAW_LENGTH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Draw Length Calculator' },
  { id: 'what', label: 'What is draw length?' },
  {
    id: 'how',
    label: 'How to calculate draw length — How do you figure out bow draw length?',
  },
  { id: 'why', label: 'Why is draw length important in archery?' },
  { id: 'draw-length-faq', label: 'FAQs' },
];

export const DRAW_LENGTH_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate draw length from wingspan?',
    answer:
      'Measure fingertip-to-fingertip wingspan with arms outstretched, then divide by 2.5. Example: 70 in wingspan → 28 in estimated draw length.',
  },
  {
    question: 'What units can I use?',
    answer:
      'Centimetres, metres, inches, or feet. Changing a unit preserves the physical length and updates the paired field via wingspan ÷ 2.5.',
  },
  {
    question: 'Is this a bow fitting?',
    answer:
      'No. This is an educational anthropometric estimate only. It does not include weapon fitting or operating guidance.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
