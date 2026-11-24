import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { AGE_BAND_RATES, OVERALL_US_TWIN_RATE_2024 } from './calculation';

export const TWINS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Twins Birth Rate Calculator' },
  { id: 'endpoint', label: 'Twin Births vs Twin Pregnancies' },
  { id: 'sources', label: 'CDC and NVSS Sources' },
  { id: 'age-rates', label: 'Rates by Maternal Age' },
  { id: 'race-rates', label: 'Rates by Race and Hispanic Origin' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Disclaimer' },
  { id: 'twins-faq', label: 'Frequently Asked Questions' },
];

export const TWINS_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this predict whether I will have twins?',
    answer:
      'No. It shows a US population average twin birth rate for one CDC/NVSS demographic stratum (maternal age bracket or race/Hispanic origin group). Individual chances depend on genetics, prior pregnancies, fertility treatment, and other factors not captured here.',
  },
  {
    question: 'Twin birth rate or twin pregnancy rate?',
    answer:
      'This tool uses twin deliveries per 1,000 total live births (NVSS). Twin pregnancies that did not result in a twin birth event in that statistic are outside this endpoint.',
  },
  {
    question: 'Why not combine maternal age and race?',
    answer:
      'CDC publishes age-specific and race/Hispanic-origin-specific tables separately. Multiplying or stacking those averages would invent a combined rate this tool does not support. Pick one stratum mode at a time.',
  },
  {
    question: 'Do the rates include fertility treatment?',
    answer:
      'Yes. Published US twin birth rates include twins born after assisted reproductive technology (ART) and other fertility care reflected in national birth statistics.',
  },
  {
    question: 'What was the overall US twin rate in 2024?',
    answer: `The national reference rate is ${OVERALL_US_TWIN_RATE_2024} twin births per 1,000 total births. The calculator shows your selected stratum alongside this context figure.`,
  },
  {
    question: 'Is my age or race stored in the URL?',
    answer:
      'No. Demographic selections stay in your browser. Copy and share actions use the public calculator page URL only.',
  },
];

/** Summary rows for guide article table. */
export const TWINS_AGE_TABLE_ROWS = Object.values(AGE_BAND_RATES).map((row) => ({
  label: row.label,
  rate: row.rate,
}));