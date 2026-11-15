import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MB_GB_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mb', label: 'What Is a Megabyte?' },
  { id: 'what-is-gb', label: 'What Is a Gigabyte?' },
  { id: 'gb-vs-mb', label: 'Is a GB Bigger Than an MB?' },
  { id: 'how-to-convert', label: 'How Do You Convert MB to GB?' },
  { id: 'conversion-chart', label: 'MB to GB Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'mb-vs-mib', label: 'MB vs MiB and GB vs GiB' },
  { id: 'mb-gb-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    formula?: string;
  }[];
}

export const MB_GB_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-mb',
    title: 'What Is a Megabyte?',
    paragraphs: [
      'A megabyte (MB) is a unit of digital information. Under SI decimal prefixes, 1 MB equals 1,000,000 bytes. Operating systems and older documentation sometimes used “MB” loosely for a binary-sized quantity near 1,048,576 bytes; the precise IEC name for that binary unit is the mebibyte (MiB).',
    ],
    formula: '1 MB = 1,000,000 bytes · 1 MiB = 1,048,576 bytes',
  },
  {
    id: 'what-is-gb',
    title: 'What Is a Gigabyte?',
    paragraphs: [
      'A gigabyte (GB) is the next common storage prefix above the megabyte. In SI units, 1 GB equals 1,000,000,000 bytes and is widely used for drive capacities, smartphone storage, and download sizes. The binary counterpart is the gibibyte (GiB) at 1,073,741,824 bytes.',
    ],
    formula: '1 GB = 1,000,000,000 bytes · 1 GiB = 1,073,741,824 bytes',
  },
  {
    id: 'gb-vs-mb',
    title: 'Is a GB Bigger Than an MB?',
    paragraphs: [
      'Yes. Under SI definitions a gigabyte is 1000 times a megabyte (1 GB = 1000 MB). Binary units scale by 1024 (1 GiB = 1024 MiB). Drive makers usually advertise decimal GB; some OS file browsers historically showed binary quantities while still labeling them with SI-looking abbreviations, which contributes to “missing” capacity confusion.',
    ],
    formula: '1 GB = 1000 MB · 1 GiB = 1024 MiB',
  },
  {
    id: 'how-to-convert',
    title: 'How Do You Convert MB to GB?',
    paragraphs: [
      'Pick the conversion mode that matches your context. SI decimal storage math uses 1000. This converter’s Base-2 mode follows the legacy numeric factor of 1024 used by many older tools; for precise binary naming use MiB and GiB.',
    ],
    subsections: [
      {
        id: 'base-10',
        title: 'Base-10: SI Decimal System',
        paragraphs: [
          'Divide megabytes by 1000 for gigabytes. Examples: 500 MB = 0.5 GB; 1000 MB = 1 GB; 2500 MB = 2.5 GB.',
        ],
        formula: 'GB = MB / 1000',
      },
      {
        id: 'base-2',
        title: 'Base-2: Legacy Binary Mode',
        paragraphs: [
          'Divide by 1024 for the reference-style binary-mode result. Examples: 512 → 0.5; 1024 → 1; 2048 → 2. The IEC equivalent relation is GiB = MiB / 1024.',
        ],
        formula: 'Binary-mode GB = MB / 1024 · GiB = MiB / 1024',
      },
    ],
  },
  {
    id: 'conversion-chart',
    title: 'MB to GB Conversion Chart',
    paragraphs: ['Common SI decimal conversions:'],
    tableHeaders: ['MB', 'GB (decimal)'],
    table: [
      { left: '1', right: '0.001' },
      { left: '10', right: '0.01' },
      { left: '100', right: '0.1' },
      { left: '500', right: '0.5' },
      { left: '1000', right: '1' },
      { left: '1024', right: '1.024' },
      { left: '1500', right: '1.5' },
      { left: '2000', right: '2' },
      { left: '5000', right: '5' },
      { left: '10000', right: '10' },
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the MB to GB Converter',
    paragraphs: [
      '1) Open the converter. 2) Choose Base-10 or Base-2. 3) Enter MB to see GB, or enter GB to reverse. 4) Switch modes to recalculate with the other factor while keeping the edited number. 5) Share, reload to 1000 MB / 1 GB decimal, or clear fields.',
    ],
  },
  {
    id: 'mb-vs-mib',
    title: 'MB vs MiB and GB vs GiB',
    paragraphs: [
      'MB and GB are SI decimal prefixes (powers of 1000). MiB and GiB are IEC binary prefixes (powers of 1024). Use decimal labels for advertised drive capacity and binary labels when you mean exact powers of two. This calculator’s binary radio is a legacy 1024-factor mode, not a claim that SI GB equals 1024 MB.',
    ],
  },
];

export const MB_GB_FAQS: readonly FAQItem[] = [
  {
    question: 'How many MB are in 1 GB?',
    answer: 'In the SI decimal system, 1 GB = 1000 MB. In binary units, 1 GiB = 1024 MiB.',
  },
  {
    question: 'How many GB are in 1024 MB?',
    answer:
      'In decimal units, 1024 MB = 1.024 GB. With the legacy binary-mode factor of 1024, the numeric result is 1.',
  },
  {
    question: 'Is 1 GB equal to 1024 MB?',
    answer:
      'Not under official SI definitions. One gigabyte equals 1000 megabytes, while one gibibyte equals 1024 mebibytes.',
  },
  {
    question: 'How do I convert MB to GB?',
    answer: 'Divide megabytes by 1000 for SI decimal conversion.',
  },
  {
    question: 'How do I convert GB to MB?',
    answer: 'Multiply gigabytes by 1000.',
  },
  {
    question: 'What is the difference between MB and GB?',
    answer:
      'Both are digital information units; under SI definitions a GB represents 1000 times as many bytes as an MB.',
  },
  {
    question: 'Why does my computer show less storage than advertised?',
    answer:
      'Operating systems may display binary units while manufacturers advertise decimal units. Formatting and reserved system space can also reduce the free capacity you see.',
  },
  {
    question: 'Is 500 MB half a GB?',
    answer: 'Yes, in the decimal system: 500 MB = 0.5 GB.',
  },
  {
    question: 'What is the difference between MB and Mb?',
    answer: 'MB means megabytes; Mb means megabits. Eight bits make one byte.',
  },
  {
    question: 'Which number system should I use?',
    answer:
      'Use Base-10 for standard SI conversions and advertised capacities. Use Base-2 for legacy 1024-style calculations, and prefer MiB/GiB for precise binary quantities.',
  },
];
