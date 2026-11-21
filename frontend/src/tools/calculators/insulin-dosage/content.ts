import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INSULIN_DOSAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Insulin Dosage Calculator' },
  { id: 'how-it-works', label: 'How the Arithmetic Works' },
  { id: 'tdd', label: 'Total Daily Dose Notes' },
  { id: 'units', label: 'Glucose Units' },
  { id: 'safety', label: 'Safety and Limitations' },
  { id: 'insulin-dosage-faq', label: 'Frequently Asked Questions' },
];

export const INSULIN_DOSAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator do?',
    answer:
      'It performs illustrative mealtime math you already use with your care team: carbohydrate coverage (carbs ÷ ICR), correction bolus ((current − target) ÷ ISF, floored at zero), and their sum. It does not prescribe insulin.',
  },
  {
    question: 'Why are ratio 15, target 100, and sensitivity 50 prefilled?',
    answer:
      'Those are sample educational field values matching the reference UI so you can see the arithmetic. They are not recommended personal doses. Replace them with settings from your clinician.',
  },
  {
    question: 'What happens if glucose is below target?',
    answer:
      'Correction units are set to zero. A soft warning appears when current glucose is under 70 mg/dL (or mmol/L equivalent). Seek clinical guidance for hypoglycemia.',
  },
  {
    question: 'What does “I know my total daily insulin dose” do?',
    answer:
      'It shows an optional TDD field and educational Rule of 500 / Rule of 1800 estimates. Those estimates are never written into your ICR or ISF fields automatically.',
  },
  {
    question: 'Is personal data stored?',
    answer:
      'No. Inputs stay in your browser for this session. Share copies only the public page URL—not glucose, carbs, or doses.',
  },
];
