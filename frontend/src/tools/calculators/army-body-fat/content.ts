import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ARMY_BODY_FAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is the Army Body Fat Calculator?' },
  { id: 'one-site', label: 'Current One-Site Method' },
  { id: 'legacy', label: 'Legacy Multi-Site Estimate' },
  { id: 'standards', label: 'Maximum Allowable Standards' },
  { id: 'how-to', label: 'How to Use This Calculator' },
  { id: 'limits', label: 'Limitations' },
  { id: 'army-bf-faq', label: 'Frequently Asked Questions' },
];

export const ARMY_BODY_FAT_FAQS: readonly FAQItem[] = [
  {
    question: 'Which method should I use?',
    answer:
      'If you are modeling current Army Body Composition Program taping, leave “I am on active duty” checked. That uses the one-site abdomen circumference equations authorized effective 9 June 2023. Uncheck it only for the older multi-site DoDI 1308.3 / AR 600-9 educational estimate.',
  },
  {
    question: 'Where do the one-site formulas come from?',
    answer:
      'They appear in ALARACT 032/2025 implementing guidance for Army Directive 2023-11 / AR 600-9 updates: male %BF = −26.97 − 0.12×weight(lb) + 1.99×abdomen(in); female %BF = −9.15 − 0.015×weight(lb) + 1.27×abdomen(in). Results round to the nearest whole percent.',
  },
  {
    question: 'Why did neck, waist, and hip disappear?',
    answer:
      'Those sites belong to the legacy multi-site tape. The current authorized Army method measures abdomen at the navel plus body weight. Unsupported fields are hidden for the selected model.',
  },
  {
    question: 'Do units matter?',
    answer:
      'Yes. Official equations use inches and pounds. Enter cm or kg if you prefer; values are converted before calculation. Prefer the same unit system for a set of measurements.',
  },
  {
    question: 'What do the age-group maxima mean?',
    answer:
      'Optional age compares your rounded estimate to Table B–2 maximum allowable body-fat percentages (17–20, 21–27, 28–39, 40+). That comparison is educational and is not a pass/fail from your unit.',
  },
  {
    question: 'Is this an official tape test?',
    answer:
      'No. Official results require trained measurers, averaging rules, DA Form 5500/5501, and command procedures. Supplemental DXA / InBody / Bod Pod assessments follow separate policy.',
  },
  {
    question: 'Is my data stored?',
    answer:
      'No. Measurements stay in your browser session. Share uses the public calculator page URL without embedding your measurements.',
  },
];
