import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SODIUM_CHANGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Sodium Change Calculator in Hypertriglyceridemia' },
  { id: 'what', label: 'Sodium in hypertriglyceridemia' },
  { id: 'pseudo', label: 'Pseudohyponatremia phenomenon' },
  { id: 'how', label: 'How to use the sodium change calculator' },
  { id: 'sodium-change-faq', label: 'Frequently Asked Questions' },
];

export const SODIUM_CHANGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is sodium change calculated?',
    answer:
      'ΔNa (mEq/L) = triglycerides (mg/dL) × 0.002. Corrected sodium = measured sodium + ΔNa. Triglycerides in mmol/L are converted with ×88.57.',
  },
  {
    question: 'When does this correction apply?',
    answer:
      'It is a teaching estimate for indirect ion-selective electrode methods where severe hypertriglyceridemia displaces plasma water. Direct ISE and osmometry are largely unaffected.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
