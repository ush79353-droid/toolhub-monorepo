import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FACE_SHAPE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Face Shape Calculator' },
  { id: 'shapes', label: 'Seven face shapes' },
  { id: 'formula', label: 'Omega heuristic rules' },
  { id: 'measurements', label: 'How to measure' },
  { id: 'fs-faq', label: 'Frequently Asked Questions' },
];

export const FACE_SHAPE_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this the same as Omiverse or clinical face analysis?',
    answer:
      'No. This is an Omega-defined aesthetic heuristic from simple width and length inputs. It is not Omiverse/Omni proprietary parity and is not clinically validated.',
  },
  {
    question: 'Why is jawline length a proxy?',
    answer:
      'True jaw breadth is hard to measure at home. This tool treats chin-to-outer-ear jawline length as a jaw-width proxy only, with that caveat shown in results.',
  },
  {
    question: 'Does sex change the classification?',
    answer:
      'No. Optional sex affects styling-tip copy only, not numeric thresholds.',
  },
  {
    question: 'Which shapes can appear?',
    answer:
      'Oval, round, oblong, square, triangle (pear), diamond, and heart — first matching rule in the documented order wins.',
  },
  {
    question: 'Are measurements stored?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL and optional result text, not your measurements.',
  },
];