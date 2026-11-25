import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_NOTE =
  'Cole F. (1957) uncuffed ID = age(years)/4 + 4 mm; Omni/Khine-style cuffed ID = age/4 + 3 mm; oral insertion depth ≈ age/2 + 12 cm (Jain & Rabb / Omni ETT size). Cole age formulas are intended for children about 1–12 years. Estimates only — verify clinically; not procedural instructions.';

export const DISCLAIMER =
  'Educational size estimates only. Not a device order, intubation protocol, or substitute for airway expertise. Confirm tube size and depth clinically (auscultation, capnography, imaging as indicated).';

export const ETT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Endotracheal Tube Size Calculator' },
  { id: 'what-is', label: 'What is endotracheal intubation?' },
  { id: 'formulas', label: 'ET tube size formula' },
  { id: 'limits', label: 'Age range and limits' },
  { id: 'ett-faq', label: 'Frequently Asked Questions' },
];

export const ETT_FAQS: readonly FAQItem[] = [
  {
    question: 'Which formulas does this use?',
    answer:
      'Uncuffed internal diameter follows Cole: age(years)/4 + 4 mm. Cuffed uses age/4 + 3 mm (Omni / Khine-style). Insertion depth uses age/2 + 12 cm. Tube IDs round to the nearest 0.5 mm commercial step.',
  },
  {
    question: 'What ages are supported?',
    answer:
      'Cole age formulas are validated for roughly ages 1–12 years. Under 1 year or over 12 years, age-only Cole/Khine estimates are not applied here—use clinical/weight- or height-based sizing.',
  },
  {
    question: 'Are answers stored?',
    answer:
      'No. Values stay in your browser. Share uses the public page URL only — never the entered age or sizes.',
  },
];
