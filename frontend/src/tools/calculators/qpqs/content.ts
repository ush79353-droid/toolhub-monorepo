import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Qp/Qs shunt ratio from echocardiographic stroke-volume proxy (RVOT and LVOT diameter²×VTI), Fick oxygen-content step-ups, or direct flow quotient. Educational illustration of standard textbook relationships — not a cath-lab or echo report.';

export const DISCLAIMER =
  'Educational Qp/Qs worksheet only. It does not diagnose congenital heart disease, size defects, or replace hemodynamic assessment. Confirm with imaging, cath, and clinical context.';

export const QPQS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Qp/Qs Calculator' },
  { id: 'circulatory', label: 'Circulatory system' },
  { id: 'shunt', label: 'What is a shunt?' },
  { id: 'formula', label: 'Qp/Qs formulas' },
  { id: 'how-to', label: 'How to use this calculator' },
  { id: 'values', label: 'Interpreting Qp/Qs' },
  { id: 'qpqs-faq', label: 'Frequently Asked Questions' },
];

export const QPQS_FAQS: readonly FAQItem[] = [
  {
    question: 'What does Qp/Qs mean?',
    answer:
      'Pulmonary blood flow (Qp) divided by systemic blood flow (Qs). Values above 1 suggest net left-to-right shunting; below 1, right-to-left dominance.',
  },
  {
    question: 'Which calculation method should I use?',
    answer:
      'Echo uses outflow tract diameters and VTIs. Fick uses paired oxygen contents. Direct mode is for when Qp and Qs are already measured in the same flow units.',
  },
  {
    question: 'Are my entries stored or shared?',
    answer:
      'No. Values stay in your browser. Share uses the public page URL only.',
  },
];