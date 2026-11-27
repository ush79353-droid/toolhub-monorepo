import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PARKLAND_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Parkland Formula Calculator' },
  { id: 'how', label: 'How the Parkland formula works' },
  { id: 'nines', label: 'Rule of Nines and TBSA' },
  { id: 'parkland-faq', label: 'FAQs' },
];

export const PARKLAND_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Parkland formula?',
    answer:
      'Educational adult teaching model: 24-hour crystalloid volume (mL) = 4 × body weight in kg × TBSA percentage points of partial-/full-thickness burn. Give half in the first 8 hours from injury and half over the next 16 hours.',
  },
  {
    question: 'How is burn percentage estimated?',
    answer:
      'This tool uses Wallace rule of nines for adults and a modified child chart (larger head, smaller legs). Only 2nd- and 3rd-degree regions count. Selections should not double-count the same surface.',
  },
  {
    question: 'Does this include daily maintenance fluids?',
    answer:
      'No. Parkland estimates replacement of burn losses only. Add maintenance fluids separately, especially in children.',
  },
  {
    question: 'Are inputs stored?',
    answer:
      'No. Values stay in your browser. Share copies the public page URL only — no patient data.',
  },
];
