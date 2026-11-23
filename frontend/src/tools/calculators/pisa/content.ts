import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PISA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'PISA Calculator' },
  { id: 'what-is', label: 'What Is PISA?' },
  { id: 'formula', label: 'Formulas Used' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'pisa-faq', label: 'Frequently Asked Questions' },
];

export const PISA_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this PISA calculator do?',
    answer:
      'It estimates angle-corrected proximal isovelocity surface area, volume flow rate, mitral valve area (stenosis path), effective regurgitant orifice area, and regurgitant volume. It does not grade valve disease.',
  },
  {
    question: 'How is the α angle used?',
    answer:
      'Leaflet constraint in mitral stenosis uses α/180 on the hemispherical shell (2πr²). A full hemisphere is α = 180° (factor 1). Blank α is treated as 180° for educational hemispheric arithmetic.',
  },
  {
    question: 'Why are MVA and EROA both shown?',
    answer:
      'Both equal instantaneous flow ÷ Vmax. MVA labels the stenosis orifice estimate; EROA labels the regurgitant orifice estimate. Acquire the matching clinical jet and document which path you intend.',
  },
  {
    question: 'What if Vmax is zero?',
    answer:
      'Orifice area is undefined when Vmax ≤ 0. Flow and PISA can still appear from radius, Vr, and α.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Entries stay in your browser. Share/copy use the public page URL only.',
  },
];
