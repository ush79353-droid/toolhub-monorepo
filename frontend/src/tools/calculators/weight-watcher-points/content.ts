import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WEIGHT_WATCHER_POINTS_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Weight Watcher Points' },
  { id: 'smartpoints-formula', label: 'SmartPoints formula' },
  { id: 'serving-basis', label: 'Serving basis' },
  { id: 'weight-watcher-points-faq', label: 'Frequently Asked Questions' },
];

export const WEIGHT_WATCHER_POINTS_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this the official WW calculator?',
    answer:
      'No. This is an independent educational worksheet. It is not affiliated with or endorsed by WW International. Current PersonalPoints algorithms are proprietary and personalized; this tool uses the publicly documented historical SmartPoints food formula (2015–2021).',
  },
  {
    question: 'How are Smart points calculated?',
    answer:
      'For one serving: points = round(0.0305 × kcal + 0.275 × saturated fat g + 0.12 × sugar g − 0.098 × protein g), floored at 0. Enter label values for the same serving basis; switching g / mg / oz preserves the physical mass.',
  },
  {
    question: 'Why is “Total of your points today” blank?',
    answer:
      'Smart points stay blank until calories, sugar, protein, and saturated fat are all valid numbers (≥ 0). Incomplete or invalid fields do not invent a score.',
  },
  {
    question: 'Are my nutrition entries stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only — calories and macros are never put in the link.',
  },
];
