import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FLANGE_SIZE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Flange Size Calculator' },
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'spectra-table', label: 'Spectra Sizing Table' },
  { id: 'how-to-measure', label: 'How to Measure' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'flange-faq', label: 'Frequently Asked Questions' },
];

export const FLANGE_SIZE_FAQS: readonly FAQItem[] = [
  {
    question: 'Which flange sizing system is used?',
    answer:
      'Spectra Baby USA’s published discrete bands: up to 12 mm nipple → 16 mm flange; up to 16→20; up to 20→24; up to 24→28; up to 28→32. It is not Medela’s Room-to-Move “add 4 mm” starting guide.',
  },
  {
    question: 'How should I measure?',
    answer:
      'Measure the nipple base diameter (widest point where nipple meets areola) and exclude the areola. Use the same units the calculator expects (mm or inches).',
  },
  {
    question: 'What if my measurement is above 28 mm?',
    answer:
      'The tool reports that the value is outside Spectra’s published table and does not invent a larger stock size. Ask a lactation professional or the pump manufacturer for options.',
  },
  {
    question: 'Does a suggested size guarantee a good fit?',
    answer:
      'No. Nipples expand during pumping. Use the suggestion as a starting point and confirm comfort, free nipple movement, and milk flow while pumping.',
  },
  {
    question: 'Are my measurements stored?',
    answer:
      'No. Values stay in your browser. Share and copy use the public page URL only—never diameters or suggested sizes.',
  },
];
