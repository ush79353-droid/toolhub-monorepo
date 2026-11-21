import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ALEVE_DOSAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Aleve Dosage Calculator' },
  { id: 'otc-vs-rx', label: 'OTC Aleve vs Prescription' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits & Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'aleve-dosage-faq', label: 'Frequently Asked Questions' },
];

export const ALEVE_DOSAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the usual OTC Aleve dose for adults?',
    answer:
      'For adults and children 12 years and older, FDA Drug Facts for Aleve (naproxen sodium 220 mg) direct: take 1 tablet/caplet/gel every 8 to 12 hours while symptoms last; for the first dose you may take 2 within the first hour; do not exceed 2 in any 8- to 12-hour period; do not exceed 3 in 24 hours. Children under 12: ask a doctor.',
  },
  {
    question: 'Why doesn’t this show “500 mg per day” or “2.3 tablets”?',
    answer:
      'Those figures match a common prescription naproxen pain schedule (500 mg initial) incorrectly paired with 220 mg OTC strength (500 ÷ 220 ≈ 2.27). This tool never invents fractional tablets. OTC Aleve follows 220 mg unit directions; prescription schedules use matching prescription strengths.',
  },
  {
    question: 'How does naproxen sodium relate to naproxen?',
    answer:
      'Aleve 220 mg naproxen sodium equals about 200 mg naproxen (base). Prescription naproxen sodium 275 mg / 550 mg roughly corresponds to 250 mg / 500 mg naproxen. Labels are not interchangeable milligram-for-milligram across salt forms.',
  },
  {
    question: 'Can I use OTC Aleve for gout or rheumatoid arthritis?',
    answer:
      'OTC Aleve Drug Facts list temporary minor aches/pains and fever — not clinician-managed rheumatoid arthritis, osteoarthritis programs, or acute gout regimens. Those appear here only under prescription product rows with FDA prescription schedules, for education.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It summarizes published U.S. label directions for education. Read your package or prescription label, and ask a clinician or pharmacist about risks (stomach bleeding, heart, allergy, pregnancy, interactions) and whether naproxen is appropriate for you.',
  },
];
