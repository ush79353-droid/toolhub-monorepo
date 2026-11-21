import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CALORIE_INTAKE_SIMPLE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Calorie Intake Calculator (Simple)' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'formula', label: 'Mifflin–St Jeor and PAL' },
  { id: 'activity', label: 'Activity Levels' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'calorie-intake-simple-faq', label: 'Frequently Asked Questions' },
];

export const CALORIE_INTAKE_SIMPLE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator estimate?',
    answer:
      'It estimates daily calories to maintain your current weight for a healthy adult, using Mifflin–St Jeor BMR multiplied by an activity factor (PAL).',
  },
  {
    question: 'Which BMR equation is used?',
    answer:
      'Mifflin–St Jeor (1990): men use +5 and women use −161 after 10×weight(kg) + 6.25×height(cm) − 5×age.',
  },
  {
    question: 'What activity multipliers are used?',
    answer:
      'Omni Simple factors: little/no exercise 1.2; light 1–2×/week 1.4; moderate 2–3×/week 1.6; hard 3–5×/week 1.75; physical job or hard exercise 6–7×/week 2.0.',
  },
  {
    question: 'Is this the same as the full Calorie Calculator?',
    answer:
      'For matching sex, age, height, weight, and an equivalent activity band, maintenance kcal should match when both use Mifflin–St Jeor and the same PAL. This simple tool exposes only the five Omni Simple activity labels.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is an educational estimate. Pregnancy, breastfeeding, illness, medications, and athletic training can require different intakes—confirm with a clinician or dietitian.',
  },
];
