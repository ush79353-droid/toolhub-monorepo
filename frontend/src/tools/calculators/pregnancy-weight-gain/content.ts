import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PREGNANCY_WEIGHT_GAIN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Pregnancy Weight Gain Calculator' },
  { id: 'how-it-works', label: 'How the Calculator Works' },
  { id: 'iom-bands', label: 'IOM Singleton Gain Bands' },
  { id: 'weekly-model', label: 'Week-by-Week Model' },
  { id: 'twins', label: 'Twin Pregnancies' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'pregnancy-weight-gain-faq', label: 'Frequently Asked Questions' },
];

export const PREGNANCY_WEIGHT_GAIN_FAQS: readonly FAQItem[] = [
  {
    question: 'What sources do these ranges use?',
    answer:
      'Singleton total and rate bands follow the Institute of Medicine / National Academies 2009 gestational weight-gain guidelines, summarized by CDC maternal weight-gain materials. Twin totals use the provisional IOM recommendations for normal, overweight, and obese pre-pregnancy BMI.',
  },
  {
    question: 'How is pre-pregnancy BMI calculated?',
    answer:
      'BMI = weight in kilograms ÷ height in meters squared, using the height and weight you enter under Before pregnancy. That BMI selects the IOM category band.',
  },
  {
    question: 'Why does week 40 use different numbers than week 27?',
    answer:
      'Through mid-pregnancy the tool uses a first-trimester cumulative range (0.5–2.0 kg by week 13) plus the IOM second/third-trimester weekly rate ranges. At week 40 it uses the official IOM total bands, which are authoritative at term.',
  },
  {
    question: 'Why are twin results sometimes unavailable?',
    answer:
      'IOM did not publish a twin total band for underweight pre-pregnancy BMI. For twins, this calculator also refuses mid-pregnancy week-by-week extrapolation and only shows provisional total bands from week 37 onward.',
  },
  {
    question: 'Worked example: 165 cm, 60 kg, week 40, singleton?',
    answer:
      'BMI ≈ 22.04 (normal). Recommended total gain 11.5–16 kg, so projected weight ≈ 71.5–76 kg.',
  },
  {
    question: 'Is my data stored or shared?',
    answer:
      'No. Height, weight, week, and results stay in your browser for this session. Share uses only the public page URL so reproductive measurements are never placed in share payloads.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. Ranges are educational screening guides. Individual targets depend on clinical context—discuss goals with a qualified clinician.',
  },
];
