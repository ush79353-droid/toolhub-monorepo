import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TYLENOL_DOSAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is the Tylenol Dosage Calculator?' },
  { id: 'labels', label: 'Current Label Schedules' },
  { id: 'combo', label: 'Combination Products & Acetaminophen' },
  { id: 'how-to', label: 'How to Use This Calculator' },
  { id: 'limits', label: 'Limitations' },
  { id: 'tylenol-faq', label: 'Frequently Asked Questions' },
];

export const TYLENOL_DOSAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'Why is Extra Strength every 6 hours?',
    answer:
      'Current DailyMed / Drug Facts for Extra Strength TYLENOL (500 mg) direct adults and children 12+ to take 2 units every 6 hours, with a maximum of 6 units (3,000 mg) in 24 hours unless a doctor directs otherwise. Older “every 4–6 hours” wording for Extra Strength is outdated for these cartons.',
  },
  {
    question: 'What about Regular Strength?',
    answer:
      'Regular Strength (325 mg) remains 2 units every 4 to 6 hours while symptoms last, not more than 10 units (3,250 mg) in 24 hours unless directed by a doctor.',
  },
  {
    question: 'Can I take Sinus or Cold + Flu with Regular Strength?',
    answer:
      'No. Combination products already contain acetaminophen. Taking another acetaminophen product at the same time can exceed safe limits. This tool warns about duplication and filters products by symptom.',
  },
  {
    question: 'How does Tylenol PM differ?',
    answer:
      'PM Extra Strength pairs acetaminophen 500 mg with diphenhydramine HCl 25 mg. The labeled adult dose is 2 caplets at bedtime, and not more than 2 caplets of that product in 24 hours. It is not a daytime every-4–6-hour pain schedule.',
  },
  {
    question: 'Is my selection stored?',
    answer:
      'No. Choices stay in your browser session. Share uses the public calculator page URL without embedding a dose regimen.',
  },
];
