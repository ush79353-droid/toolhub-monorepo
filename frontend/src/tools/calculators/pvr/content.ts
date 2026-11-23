import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PVR_SOURCE_NOTE =
  'PVR (Wood) = (mPAP − LAP) / CO; dyn·s·cm⁻⁵ = Wood × 80. LAP may be a PCWP/PAWP surrogate. Educational pulmonary hemodynamics arithmetic only.';

export const PVR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'PVR Calculator' },
  { id: 'what-is', label: 'What Is Pulmonary Vascular Resistance?' },
  { id: 'formula', label: 'PVR Formula and Units' },
  { id: 'lap-context', label: 'LAP and Wedge-Pressure Surrogates' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'pvr-faq', label: 'Frequently Asked Questions' },
];

export const PVR_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this PVR calculator do?',
    answer:
      'It computes educational pulmonary vascular resistance from mean pulmonary arterial pressure (mPAP), left atrial pressure (LAP), and cardiac output (CO). Wood units = (mPAP − LAP) / CO; dyn·s·cm⁻⁵ = Wood × 80.',
  },
  {
    question: 'Can I enter LAP as a wedge pressure?',
    answer:
      'Yes, clinicians often use pulmonary capillary wedge pressure (PCWP/PAWP) as a surrogate for left atrial pressure. This tool does not convert or invent a wedge value — enter the number you measured and keep that context with your notes.',
  },
  {
    question: 'Why do pressure fields offer mmHg and kPa?',
    answer:
      'Switching units preserves the physical pressure (converted before math). Cardiac output stays in L/min. The result can display dyn·s·cm⁻⁵ or Wood units.',
  },
  {
    question: 'What if cardiac output is zero or LAP exceeds mPAP?',
    answer:
      'PVR stays blank. Zero CO is rejected, and a non-positive (mPAP − LAP) driving pressure is treated as physiologically inconsistent for this arithmetic.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. The page states that PVR should be calculated separately and double-checked by a health care provider. It is educational arithmetic only.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Entries stay in your browser session. Share and copy use the public tool page URL only — never mPAP, LAP, CO, or PVR numbers.',
  },
];
