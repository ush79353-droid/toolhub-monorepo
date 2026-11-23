import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FUNDAL_HEIGHT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Fundal Height Calculator' },
  { id: 'formula', label: 'INTERGROWTH Equations' },
  { id: 'modes', label: 'Calculation Modes' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'fh-faq', label: 'Frequently Asked Questions' },
];

export const FUNDAL_HEIGHT_FAQS: readonly FAQItem[] = [
  {
    question: 'Which SFH standard is used?',
    answer:
      'INTERGROWTH-21st international SFH standards from Papageorghiou et al., BMJ 2016;355:i5662, with exact-week median and SD equations and the published dating reverse regression.',
  },
  {
    question: 'What gestational ages are supported for percentiles?',
    answer:
      'About 16–40 weeks exact (with optional justification to 41). Outside that window the tool withholds percentile math rather than inventing extrapolations.',
  },
  {
    question: 'What is the fetal-weight mode?',
    answer:
      'An educational Johnson formula using SFH, a maternal >91 kg flag, and vertex station (11/12). It is not an INTERGROWTH equation and is not a clinical weight diagnosis.',
  },
  {
    question: 'Are my measurements stored?',
    answer:
      'No. Values stay in the browser. Share/copy use the public page URL only.',
  },
];
