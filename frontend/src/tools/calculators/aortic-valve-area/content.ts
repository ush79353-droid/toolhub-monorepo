import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AORTIC_VALVE_AREA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Aortic Valve Area Calculator' },
  { id: 'what-is', label: 'What Is AVA?' },
  { id: 'formula', label: 'Continuity Equation' },
  { id: 'vti-labels', label: 'VTI₁ and VTI₂' },
  { id: 'severity', label: 'Severity Table' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ava-faq', label: 'Frequently Asked Questions' },
];

export const AORTIC_VALVE_AREA_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this aortic valve area calculator do?',
    answer:
      'It estimates effective orifice area with the Doppler continuity equation from LVOT diameter, LVOT VTI (VTI₁), and transaortic VTI (VTI₂). Results are educational and are not a diagnosis of aortic stenosis.',
  },
  {
    question: 'What is the formula?',
    answer:
      'AVA (cm²) = π × (LVOT diameter in cm ÷ 2)² × (VTI₁ ÷ VTI₂). Diameter and VTIs are normalized to centimeters before the calculation.',
  },
  {
    question: 'Which measurement is VTI₁ vs VTI₂?',
    answer:
      'VTI₁ is the LVOT stroke distance (flow proximal to the valve). VTI₂ is the transaortic jet stroke distance across the valve. Both must be positive; a zero jet VTI would make AVA undefined.',
  },
  {
    question: 'How are severity bands applied?',
    answer:
      'The on-screen table follows the reference layout: <1 cm² severe; 1–1.5 moderate (1.5 inclusive); >1.5–3 mild; >3 labeled normal for education. ACC/AHA 2020 often cites severe as AVA ≤1.0 cm² and emphasizes that velocity and gradient also define severity—area alone cannot settle discordant studies.',
  },
  {
    question: 'Can I change units?',
    answer:
      'Yes. LVOT supports mm/cm, VTIs support cm/m, and AVA display supports cm²/mm². Switching units preserves the physical value where possible; math always runs in centimeters / cm².',
  },
  {
    question: 'Are my echo measurements stored?',
    answer:
      'No. Values stay in your browser session. Share and copy actions use the public tool page URL only—never diameters, VTIs, or the computed AVA.',
  },
];
