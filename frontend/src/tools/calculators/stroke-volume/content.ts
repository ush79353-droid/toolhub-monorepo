import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STROKE_VOLUME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Stroke Volume Calculator' },
  { id: 'what-is', label: 'What Is Stroke Volume?' },
  { id: 'formula', label: 'Formulas Used' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'stroke-volume-faq', label: 'Frequently Asked Questions' },
];

export const STROKE_VOLUME_FAQS: readonly FAQItem[] = [
  {
    question: 'How is stroke volume calculated here?',
    answer:
      'Stroke volume (mL) = 1000 × cardiac output (L/min) ÷ heart rate (bpm). The factor 1000 converts litres to millilitres so SV is expressed per beat in mL.',
  },
  {
    question: 'Which BSA formula is used?',
    answer:
      'Mosteller: BSA (m²) = √(height in cm × weight in kg ÷ 3600). The same method is used by the Cardiac Index Calculator on this site.',
  },
  {
    question: 'What are cardiac index and stroke volume index?',
    answer:
      'Cardiac index = cardiac output ÷ BSA (L/min/m²). Stroke volume index = stroke volume ÷ BSA (mL/m²). Each index appears as soon as its own inputs are complete.',
  },
  {
    question: 'Why is there no EDV − ESV mode?',
    answer:
      'This worksheet follows the reference layout: stroke volume from cardiac output and heart rate, plus Mosteller BSA and indexed values. Ventricular volumes for SV = EDV − ESV belong in imaging-based tools such as the Ejection Fraction Calculator.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Entries stay in your browser session. Share and copy use the public tool page URL only — never CO, HR, anthropometrics, or computed indices.',
  },
];
