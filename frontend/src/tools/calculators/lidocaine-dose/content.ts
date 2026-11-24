import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LIDOCAINE_DOSE_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Lidocaine Dose Calculator' },
  { id: 'labeling', label: 'FDA maximum dose labeling' },
  { id: 'lidocaine-faq', label: 'Frequently Asked Questions' },
];

export const LIDOCAINE_DOSE_FAQS: readonly FAQItem[] = [
  {
    question: 'Which lidocaine product does this worksheet use?',
    answer:
      'Lidocaine hydrochloride injection for infiltration / subcutaneous use without epinephrine, using FDA/DailyMed adult maximums: 4.5 mg/kg individual dose and a general absolute maximum of 300 mg. Solutions with epinephrine (7 mg/kg, 500 mg) are out of scope because the screenshot has no epinephrine control.',
  },
  {
    question: 'How is concentration converted to mg/mL?',
    answer:
      'Percent weight/volume × 10 equals milligrams per milliliter. Example: 0.25% w/v = 2.5 mg/mL. Max volume (mL) = max mass (mg) ÷ mg/mL.',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Weight and concentration stay in the browser. Share copies only the public calculator page URL—never clinical inputs.',
  },
];
