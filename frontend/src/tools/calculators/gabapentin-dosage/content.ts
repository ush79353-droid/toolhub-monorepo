import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GABAPENTIN_DOSAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Gabapentin Dosage Calculator' },
  { id: 'approved', label: 'FDA-Approved Uses' },
  { id: 'off-label', label: 'Off-Label & Other Products' },
  { id: 'renal', label: 'Renal Adjustment' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'gabapentin-faq', label: 'Frequently Asked Questions' },
];

export const GABAPENTIN_DOSAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a prescribing tool?',
    answer:
      'No. It restates FDA NEURONTIN (gabapentin) label schedules for approved indications and explicitly refuses invented doses for off-label uses.',
  },
  {
    question: 'Why is restless legs syndrome blocked?',
    answer:
      'Immediate-release gabapentin is not FDA-labeled for RLS. Gabapentin enacarbil (HORIZANT) is the approved RLS product — this calculator will not invent an IR schedule.',
  },
  {
    question: 'Why no dose for anxiety or peripheral neuropathy?',
    answer:
      'Those are not NEURONTIN labeled indications. The tool stays informational so it does not invent regimens.',
  },
  {
    question: 'Why is pediatric epilepsy only mg/kg text?',
    answer:
      'The reference UI collects age only. Ages 3–11 need body weight for mg amounts; the label ranges are shown without fabricating weight.',
  },
  {
    question: 'Does Share send my age or indication?',
    answer:
      'No. Share/copy uses only the public page URL.',
  },
];
