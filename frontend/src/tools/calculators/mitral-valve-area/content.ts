import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MITRAL_VALVE_AREA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Mitral Valve Area Calculator' },
  { id: 'what-is', label: 'What Is MVA?' },
  { id: 'methods', label: 'Calculation Methods' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'mva-faq', label: 'Frequently Asked Questions' },
];

export const MITRAL_VALVE_AREA_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this mitral valve area calculator do?',
    answer:
      'It estimates mitral valve area using continuity-equation Doppler, pressure half-time (Hatle), or deceleration time. Results are educational and are not a diagnosis of mitral stenosis.',
  },
  {
    question: 'What is the continuity formula?',
    answer:
      'LVOT CSA = π × (diameter in cm ÷ 2)². MVA (cm²) = CSA × (LVOT VTI ÷ mitral VTI). Diameter and VTIs are normalized to centimeters before the calculation.',
  },
  {
    question: 'How does pressure half-time work?',
    answer:
      'Hatle’s empirical relation: MVA (cm²) = 220 / PHT, with PHT in milliseconds. Significant aortic regurgitation, tachycardia, or abnormal compliance can make this unreliable.',
  },
  {
    question: 'How is deceleration time converted?',
    answer:
      'When the model applies, PHT ≈ 0.29 × deceleration time (ms), then MVA = 220 / PHT. The same limitations as pressure half-time apply.',
  },
  {
    question: 'Are my echo measurements stored?',
    answer:
      'No. Values stay in your browser session. Share and copy actions use the public tool page URL only—never diameters, VTIs, times, or the computed MVA.',
  },
];
