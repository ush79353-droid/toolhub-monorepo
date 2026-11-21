import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BBT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BBT Calculator' },
  { id: 'what-is-bbt', label: 'What Is Basal Body Temperature?' },
  { id: 'why-adjust', label: 'Why Adjust for Timing?' },
  { id: 'formula', label: 'Adjustment Formula' },
  { id: 'units', label: 'Celsius and Fahrenheit' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bbt-faq', label: 'Frequently Asked Questions' },
];

export const BBT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this BBT calculator do?',
    answer:
      'It applies an educational linear timing correction so a basal temperature taken earlier or later than your usual wake time can be compared more fairly on a chart. It does not confirm ovulation or replace clinical advice.',
  },
  {
    question: 'What correction rate is used?',
    answer:
      'The Celsius rule used here is 0.05 °C per 30 minutes (0.1 °C per hour), matching common fertility-awareness teaching examples such as Omni Calculator’s BBT tool. Adjusted = measured − k × (actual − usual), with times in hours.',
  },
  {
    question: 'What if I measure much earlier or later than usual?',
    answer:
      'Corrections outside a ±6 hour overnight-wrapped window are not applied. The calculator then shows your measured temperature and the observed time difference only, because a large linear extrapolation is not reliable.',
  },
  {
    question: 'How are overnight times handled?',
    answer:
      'The signed difference usual − actual is wrapped to the shortest path within ±12 hours, so a usual 06:00 reading versus an actual 23:00 reading is treated as a seven-hour earlier measurement, not a seventeen-hour gap.',
  },
  {
    question: 'How do °C and °F differ here?',
    answer:
      'Absolute temperatures convert with °F = °C × 9/5 + 32. Temperature differences use the scale factor 9/5 only — the +32 offset applies to absolute temperatures, not to deltas.',
  },
  {
    question: 'Can I use BBT as birth control?',
    answer:
      'No. Basal temperature charting alone is not a reliable contraceptive method. This tool is an educational timing helper only.',
  },
  {
    question: 'Does a temperature shift prove ovulation?',
    answer:
      'No. This calculator does not interpret charts or confirm ovulation. Sustained biphasic patterns are assessed with a full fertility-awareness method or clinician guidance.',
  },
  {
    question: 'What else can change basal temperature?',
    answer:
      'Fever, illness, alcohol, restless sleep, shift work, travel across time zones, and some medications can move readings more than a short timing difference. Note those days on your chart.',
  },
];
