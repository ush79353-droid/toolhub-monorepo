import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MELATONIN_DOSAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Melatonin Dosage Calculator' },
  { id: 'circadin-vs-supplements', label: 'Circadin vs Supplements' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits & Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'melatonin-dosage-faq', label: 'Frequently Asked Questions' },
];

export const MELATONIN_DOSAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'Why doesn’t this invent a milligram dose for tablets or capsules?',
    answer:
      'In the United States, melatonin is generally sold as a dietary supplement. Products are not FDA-approved OTC drugs with one national Drug Facts dosing table. This explorer refuses to invent mg amounts from blank screenshot defaults. Read the directions on your specific product and ask a clinician or pharmacist.',
  },
  {
    question: 'What does the Circadin option show?',
    answer:
      'EMA Circadin 2 mg prolonged-release tablets are authorized for short-term primary insomnia (poor sleep quality) in adults aged 55 years and over: 2 mg once daily after food, 1–2 hours before bedtime, swallow whole, for up to 13 weeks. That SmPC summary appears only when you select the prolonged-release 2 mg medication type with a matching indication.',
  },
  {
    question: 'Why is therapy duration blank by default?',
    answer:
      'The reference screenshot leaves duration empty. The tool never invents a course length from that blank. Optional duration enables a Circadin 13-week ceiling check and educational tablet-count math for the 2 mg once-daily SmPC regimen only.',
  },
  {
    question: 'Can I use this for children?',
    answer:
      'No pediatric milligram schedule is provided. Circadin’s SmPC states safety and efficacy in children 0–18 years have not been established. Ask a clinician before giving melatonin to children or adolescents.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It summarizes published Circadin SmPC information and explains why US supplement forms do not get invented doses here. Always follow your product or dispensed label and clinician guidance.',
  },
];
