import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EROA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'EROA - Mitral Regurgitation Calculator' },
  { id: 'what-is', label: 'What Is PISA EROA?' },
  { id: 'formula', label: 'Formulas Used' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'eroa-faq', label: 'Frequently Asked Questions' },
];

export const EROA_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this EROA calculator do?',
    answer:
      'It applies the hemispherical PISA formulas for instantaneous regurgitant flow, effective regurgitant orifice area, and regurgitant volume. It does not grade mitral regurgitation severity.',
  },
  {
    question: 'Which formulas are used?',
    answer:
      'Flow (mL/s) = 2π r² Va; EROA (cm²) = flow / Vmax; RVol (mL/beat) = EROA × VTI. Each result appears when its required inputs are valid.',
  },
  {
    question: 'Why can flow appear without EROA?',
    answer:
      'Flow needs only radius and aliasing speed. EROA additionally needs a positive Vmax; regurgitant volume needs EROA and VTI.',
  },
  {
    question: 'What geometry is assumed?',
    answer:
      'A hemispherical proximal convergence zone. Constrained or non-hemispheric jets can misestimate area — this tool does not correct for that.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Entries stay in your browser. Share/copy use the public page URL only.',
  },
];
