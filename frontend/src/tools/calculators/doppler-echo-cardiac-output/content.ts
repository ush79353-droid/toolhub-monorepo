import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DOPPLER_ECHO_CARDIAC_OUTPUT_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    {
      id: 'introduction',
      label: 'Doppler Echo Cardiac Output Calculator',
    },
    { id: 'what-is', label: 'What Is LVOT Doppler Cardiac Output?' },
    { id: 'formula', label: 'Formulas Used' },
    { id: 'how-to-use', label: 'How to Use the Calculator' },
    { id: 'example', label: 'Worked Example' },
    { id: 'limits', label: 'Limits and Safety' },
    { id: 'deco-faq', label: 'Frequently Asked Questions' },
  ];

export const DOPPLER_ECHO_CARDIAC_OUTPUT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator estimate?',
    answer:
      'It estimates stroke volume from LVOT cross-sectional area and velocity-time integral, then cardiac output and cardiac index. Results are for learning Doppler echo arithmetic, not for patient care decisions.',
  },
  {
    question: 'How is body surface area calculated?',
    answer:
      'BSA uses the Mosteller formula √(height_cm × weight_kg / 3600), the same method as the Cardiac Index Calculator on this site.',
  },
  {
    question: 'When do outputs appear?',
    answer:
      'LVOT area needs a diameter; stroke volume needs diameter and VTI; cardiac output also needs heart rate; cardiac index needs cardiac output plus height and weight for BSA. Each value can appear as soon as its inputs are sufficient.',
  },
  {
    question: 'What units are supported?',
    answer:
      'Height (cm/in), weight (kg/lb), LVOT diameter (mm/cm), and LVOT VTI (cm/m). Math always normalizes to centimeters before area and stroke volume.',
  },
  {
    question: 'Are my measurements stored or shared?',
    answer:
      'No. Values stay in your browser. Copy and share use the public tool page URL only.',
  },
];