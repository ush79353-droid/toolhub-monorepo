import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IMPLANTATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Implantation Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'formula', label: 'Timing Windows' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'implantation-faq', label: 'Frequently Asked Questions' },
];

export const IMPLANTATION_FAQS: readonly FAQItem[] = [
  {
    question: 'When does implantation usually happen after ovulation?',
    answer:
      'In a classic human study of clinical pregnancies, implantation most often occurred about 6–12 days after ovulation. This calculator shows that range plus a typical midpoint for education only.',
  },
  {
    question: 'What if I do not know my ovulation date?',
    answer:
      'Choose No and enter your last period and cycle length. Ovulation is estimated as LMP + (cycle − 14) calendar days, then the same post-ovulation window is applied.',
  },
  {
    question: 'How does IVF transfer dating work here?',
    answer:
      'Enter the transfer day only. Without embryo age, the calculator shows a wide educational band after transfer instead of guessing blastocyst versus cleavage stage.',
  },
  {
    question: 'Is my data included when I share?',
    answer:
      'No. Share copies the public calculator page URL only. Dates you type stay in your browser.',
  },
];