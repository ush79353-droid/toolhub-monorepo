import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MEDICINE_3_TIMES_A_DAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Medicine 3 Times a Day Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'modes', label: 'Dosing Modes' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'medicine-3-times-a-day-faq', label: 'Frequently Asked Questions' },
];

export const MEDICINE_3_TIMES_A_DAY_FAQS: readonly FAQItem[] = [
  {
    question: 'Does “3 times a day” always mean every 8 hours?',
    answer:
      'No. Some labels mean every 8 hours around the clock; others mean three doses during waking hours. This tool’s “3 doses” mode uses 24 ÷ 3 = 8 hours for an educational around-the-clock schedule. Confirm which your prescription intends with a pharmacist or clinician.',
  },
  {
    question: 'What is the difference between 4 doses (waking hours) and every 6 hours?',
    answer:
      '“4 doses (waking hours)” spaces four doses evenly across a 15-hour waking window (first to last), about every 5 hours — for example 7:00 AM, 12:00 PM, 5:00 PM, 10:00 PM. “4 doses (every 6 hours)” uses a strict 6-hour around-the-clock interval and may land one dose overnight.',
  },
  {
    question: 'Can I edit the second or third dose time?',
    answer:
      'This worksheet calculates later doses from the first dose and the selected mode. Change the first dose or mode to rebuild the schedule.',
  },
  {
    question: 'Are my dose times shared in the link?',
    answer:
      'No. Share uses the public tool page URL only — entered times stay in your browser.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is an educational interval worksheet. Follow your prescription label and ask a licensed clinician or pharmacist about timing, food interactions, and overnight doses.',
  },
];
