import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RMD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rmd', label: 'What Is an RMD?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'uniform-lifetime', label: 'Uniform Lifetime Table' },
  { id: 'rmd-faq', label: 'Frequently Asked Questions' },
];

export const RMD_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the RMD calculated?',
    answer:
      'For most owners, RMD = prior December 31 account balance ÷ the IRS Uniform Lifetime Table factor for your age in the distribution year (Pub. 590-B / Treas. Reg. §1.401(a)(9)-9, 2022+ table).',
  },
  {
    question: 'Why is age 72 shown as 27.4 instead of 25.6?',
    answer:
      '25.6 was the pre-2022 Uniform Lifetime factor. For distribution years beginning on or after January 1, 2022, age 72 uses 27.4.',
  },
  {
    question: 'What if my spouse is more than 10 years younger and the sole beneficiary?',
    answer:
      'IRS rules then use the Joint Life and Last Survivor Expectancy table, which needs both ages. This form does not collect spouse age, so that path is marked unavailable rather than inventing a factor.',
  },
  {
    question: 'Does this enforce SECURE 2.0 RMD starting ages?',
    answer:
      'No. SECURE 2.0 generally sets the applicable beginning age at 73 for people born 1951–1959 and 75 for those born 1960 or later (with earlier cohorts under prior law). This calculator only applies the Uniform Lifetime Table factors you select (ages 72–120) and does not decide whether an RMD is due for your birth year.',
  },
];
