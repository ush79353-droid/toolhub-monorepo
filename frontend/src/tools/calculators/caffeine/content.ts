import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Serving caffeine amounts as documented on the Omni Caffeine Calculator (tea 50 mg/190 g; filter coffee 140 mg/350 g; instant 100 mg/350 g; cola 40 mg/330 ml; energy drink 80 mg/250 ml; espresso 45 mg; green tea 40 mg/190 g). Population caps: adult 400 mg, pregnant 200 mg, teenager 100 mg; children generally avoid (Temple et al. Frontiers in Psychiatry 2017 cited there).';

export const DISCLAIMER =
  'Educational daily caffeine intake worksheet only. Upper limits are population guidance, not personal goals or medical advice. It does not assess overdose risk for an individual.';

export const CAFFEINE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Caffeine Calculator' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'daily-limits', label: 'Daily Limits' },
  { id: 'servings', label: 'Serving Amounts' },
  { id: 'limits', label: 'Limits' },
  { id: 'caffeine-faq', label: 'Frequently Asked Questions' },
];

export const CAFFEINE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is total caffeine calculated?',
    answer:
      'Each selected drink multiplies its count by a documented mg-per-serving value, then the three lines are summed. Fractional servings are allowed.',
  },
  {
    question: 'What do the max recommended doses mean?',
    answer:
      'They are population upper-limit references (adult 400 mg, pregnant 200 mg, teenager ~100 mg). Children are generally advised to avoid caffeine—this tool shows 0 mg as that framing, not a target intake.',
  },
  {
    question: 'Are my drink counts stored?',
    answer:
      'No. Share and copy use the public page URL only—never drink counts or totals.',
  },
];
