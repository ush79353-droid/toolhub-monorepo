import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PX_TO_EM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'px-em-pt-percent', label: 'Px, Em, Pt, and %' },
  { id: 'how-to-use', label: 'How to Use Our Px to Em Converter' },
  { id: 'pt-example', label: 'Example: Converting Pt to Px, Em, and %' },
  { id: 'px-to-em-formula', label: 'Px to Em Conversion Formula' },
  { id: 'em-to-px-formula', label: 'Em to Px Conversion Formula' },
  { id: 'conversion-table', label: 'Px to Em Conversion Table' },
  { id: 'base-font-size', label: 'Why Base Font Size Matters' },
  { id: 'px-to-em-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const PX_TO_EM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'px-em-pt-percent',
    title: 'Px, Em, Pt, and %',
    paragraphs: [
      'CSS offers several length units for typography and layout. This converter focuses on four common ones used with font sizes and related properties.',
      'Pixels (px): A CSS pixel is a reference length unit used for font sizes, spacing, borders, and dimensions. A CSS pixel is not guaranteed to match one physical display pixel on every device.',
      'Em (em): An em is a relative unit. For font-size, an em value is relative to the inherited font size. For most other properties, em is relative to the element’s own computed font size. This calculator treats the Base size field as the conversion reference for 1em.',
      'Points (pt): A point is a CSS absolute length unit. One point equals 1/72 of a CSS inch, while one CSS pixel equals 1/96 of a CSS inch. Therefore 1px = 0.75pt under the CSS reference pixel model. That relationship is not a claim about physical screen DPI.',
      'Percentage (%): Percentages are relative to a reference value. For CSS font-size, percentages are relative to the inherited font size. In this calculator, 100% equals the selected base size.',
    ],
    formula: '.parent { font-size: 16px; }  .child { font-size: 1.5em; }  → child = 24px',
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Px to Em Converter',
    paragraphs: [
      '1. Enter the base font size in pixels (default 16).',
      '2. Enter an object size in pixels — or type directly into em, pt, or %.',
      '3. Read the matching values in the other fields.',
      '4. Change the base size to recalculate em and percentage against a different reference while preserving the last edited conversion field.',
      '5. Use Share Result to copy the answer, or Reload / Clear All Changes to restore the default base and empty sizes.',
      'The converter is useful for responsive typography, design tokens, and translating between absolute and relative CSS font sizes.',
    ],
  },
  {
    id: 'pt-example',
    title: 'Example: Converting Pt to Px, Em, and %',
    paragraphs: [
      'Assume a 16px base and an object size of 24pt.',
      'Step 1 — points to pixels: 24 × 4/3 = 32px.',
      'Step 2 — pixels to em: 32 / 16 = 2em.',
      'Step 3 — pixels to percentage: (32 / 16) × 100 = 200%.',
      'Final equivalence at a 16px base: 24pt = 32px = 2em = 200%.',
    ],
    formula: '24pt = 32px = 2em = 200% (base 16px)',
  },
  {
    id: 'px-to-em-formula',
    title: 'Px to Em Conversion Formula',
    paragraphs: [
      'Divide the pixel value by the base font size in pixels.',
      'Example: 20px / 16px = 1.25em.',
    ],
    formula: 'em = px ÷ base size',
  },
  {
    id: 'em-to-px-formula',
    title: 'Em to Px Conversion Formula',
    paragraphs: [
      'Multiply the em value by the base font size in pixels.',
      'Example: 2.5em × 16px = 40px.',
    ],
    formula: 'px = em × base size',
  },
  {
    id: 'conversion-table',
    title: 'Px to Em Conversion Table',
    paragraphs: [
      'Common pixel sizes with matching em, point, and percentage values at a 16px base font size:',
    ],
    tableHeaders: ['Pixels', 'Em', 'Points', 'Percentage'],
    table: [
      ['8', '0.5', '6', '50%'],
      ['10', '0.625', '7.5', '62.5%'],
      ['12', '0.75', '9', '75%'],
      ['14', '0.875', '10.5', '87.5%'],
      ['16', '1', '12', '100%'],
      ['18', '1.125', '13.5', '112.5%'],
      ['20', '1.25', '15', '125%'],
      ['24', '1.5', '18', '150%'],
      ['28', '1.75', '21', '175%'],
      ['32', '2', '24', '200%'],
      ['48', '3', '36', '300%'],
      ['64', '4', '48', '400%'],
    ],
  },
  {
    id: 'base-font-size',
    title: 'Why Base Font Size Matters',
    paragraphs: [
      'Relative CSS units depend on the relevant font-size context. The same em or percentage maps to different pixel lengths when the base changes.',
      'At a 16px base, 1.5em = 24px. At a 20px base, 1.5em = 30px.',
      'Using em can keep typography proportional across a design system, but nested font-size rules can compound because each em is relative to its context. Rem (root em) avoids that compounding by referencing the root element instead.',
    ],
  },
];

export const PX_TO_EM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Pixels Are in 1 Em?',
    answer:
      'With a 16px base font size, 1em equals 16px. The pixel value changes when the reference font size changes.',
  },
  {
    question: 'How Do I Convert Px to Em?',
    answer: 'Divide the pixel value by the selected base font size.',
  },
  {
    question: 'How Much Is 24px in Em?',
    answer: 'At a 16px base size, 24px equals 1.5em.',
  },
  {
    question: 'How Much Is 1.5em in Pixels?',
    answer: 'At a 16px base size, 1.5em equals 24px.',
  },
  {
    question: 'Is 1em Always 16px?',
    answer: 'No. It depends on the relevant CSS font-size reference.',
  },
  {
    question: 'How Do I Convert Px to Pt?',
    answer: 'Multiply the pixel value by 0.75 (CSS reference: 1px = 0.75pt).',
  },
  {
    question: 'What Is 16px in Points?',
    answer: '16px equals 12pt under standard CSS unit conversion rules.',
  },
  {
    question: 'What Is 1em in Percentage?',
    answer: 'Relative to the same base size, 1em equals 100%.',
  },
  {
    question: 'What Is the Difference Between Em and Rem?',
    answer:
      'Em depends on the applicable element font-size context, whereas rem is relative to the root element’s font size.',
  },
];
