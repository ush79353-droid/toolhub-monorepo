import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HEIGHT_IN_INCHES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-height-in-inches-calculator', label: 'What Is a Height in Inches Calculator?' },
  { id: 'measure-height-in-inches', label: 'How to Measure Height in Inches' },
  { id: 'feet-inches-to-total-inches', label: 'Feet and Inches to Total Inches' },
  { id: 'inches-to-feet-inches', label: 'Inches to Feet and Inches' },
  { id: 'centimeters-to-inches', label: 'Centimeters to Inches' },
  { id: 'inches-to-meters', label: 'Inches to Meters' },
  { id: 'worked-examples', label: 'Worked Examples' },
  { id: 'common-mistakes', label: 'Common Mistakes' },
  { id: 'reference-table', label: 'Conversion Reference Table' },
  { id: 'height-in-inches-faq', label: 'Frequently Asked Questions' },
];

export interface HeightTableRow {
  imperial: string;
  inches: string;
  centimeters: string;
}

export interface HeightGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly HeightTableRow[];
}

export const HEIGHT_IN_INCHES_GUIDE_SECTIONS: readonly HeightGuideSection[] = [
  {
    id: 'what-is-height-in-inches-calculator',
    title: 'What Is a Height in Inches Calculator?',
    paragraphs: [
      'A height in inches calculator turns a height written in feet and inches into a single inch total, and the reverse. It also bridges customary height to centimeters and meters using the exact international inch.',
      'Use it for forms that ask for height in inches, for comparing a metric measurement with an imperial listing, or for any general length written the same way as a person’s height. It is a unit converter, not a medical assessment.',
    ],
  },
  {
    id: 'measure-height-in-inches',
    title: 'How to Measure Height in Inches',
    paragraphs: [
      'Stand against a flat wall without shoes. Mark the top of the head, then measure from the floor to that mark with a tape marked in inches, or in centimeters and convert afterward.',
      'Record whole feet plus leftover inches, or the total inches alone. Small rounding in a home tape is normal; this calculator does not invent measurement error—it only converts the numbers you enter.',
    ],
  },
  {
    id: 'feet-inches-to-total-inches',
    title: 'How to Convert Feet and Inches to Total Inches',
    paragraphs: [
      'Multiply feet by 12 and add the remaining inches. Two feet and four inches is (2 × 12) + 4 = 28 inches. Five feet six inches is 66 inches. Six feet even is 72 inches.',
      'If the inches field is 12 or more, the total still uses that sum, and the normalized feet-and-inches display carries the excess. Five feet fourteen inches becomes 74 inches, shown as 6 ft 2 in.',
    ],
  },
  {
    id: 'inches-to-feet-inches',
    title: 'How to Convert Inches to Feet and Inches',
    paragraphs: [
      'Divide total inches by 12. The whole number is feet; the remainder is inches. Sixty-eight inches is 5 feet with 8 inches left over.',
      'Type in the total-inches field when that is the figure you already have. Feet, remaining inches, centimeters, and meters update from the same exact factors.',
    ],
  },
  {
    id: 'centimeters-to-inches',
    title: 'How to Convert Centimeters to Inches',
    paragraphs: [
      'Divide centimeters by 2.54. One hundred seventy centimeters is about 66.9291 inches. Two hundred fifty-four centimeters is exactly 100 inches.',
      'Open the centimeters and meters section to edit metric values directly. One inch equals exactly 2.54 centimeters by international definition.',
    ],
  },
  {
    id: 'inches-to-meters',
    title: 'How to Convert Inches to Meters',
    paragraphs: [
      'Multiply inches by 0.0254, or convert to centimeters first and divide by 100. Sixty-eight inches is 1.7272 meters. One meter is about 39.3701 inches.',
      'Editing meters updates total inches and the feet-and-inches breakdown using the same exact inch.',
    ],
  },
  {
    id: 'worked-examples',
    title: 'Worked Height Conversion Examples',
    paragraphs: [
      '2 ft 4 in = 28 in = 71.12 cm = 0.7112 m. 5 ft 10 in = 70 in = 177.8 cm. 6 ft 0 in = 72 in = 182.88 cm.',
      'From metric: 170 cm ÷ 2.54 ≈ 66.9291 in → 5 ft 6.9291 in. 1.75 m ÷ 0.0254 ≈ 68.8976 in → 5 ft 8.8976 in.',
    ],
  },
  {
    id: 'common-mistakes',
    title: 'Common Height Measurement Mistakes',
    paragraphs: [
      'Mixing feet with centimeters without converting, treating 5.10 as five feet ten inches instead of 5.1 feet, and dropping excess inches instead of carrying them into the next foot are frequent errors.',
      'Also watch for using 2.5 instead of 2.54 for centimeters per inch. This calculator keeps 12 and 2.54 exact.',
    ],
  },
  {
    id: 'reference-table',
    title: 'Height Conversion Reference Table',
    paragraphs: [
      'Each row uses total inches = feet × 12 + inches, centimeters = inches × 2.54.',
    ],
    table: [
      { imperial: '2 ft 4 in', inches: '28', centimeters: '71.12' },
      { imperial: '5 ft 0 in', inches: '60', centimeters: '152.4' },
      { imperial: '5 ft 6 in', inches: '66', centimeters: '167.64' },
      { imperial: '5 ft 10 in', inches: '70', centimeters: '177.8' },
      { imperial: '6 ft 0 in', inches: '72', centimeters: '182.88' },
      { imperial: '6 ft 2 in', inches: '74', centimeters: '187.96' },
    ],
  },
];

export const HEIGHT_IN_INCHES_FAQS: readonly FAQItem[] = [
  {
    question: 'How many inches is 5 feet 6 inches?',
    answer: '5 feet 6 inches equals 66 inches. That is (5 × 12) + 6.',
  },
  {
    question: 'How many inches is 6 feet?',
    answer: '6 feet equals 72 inches.',
  },
  {
    question: 'How do I convert 170 cm to inches?',
    answer: 'Divide 170 by 2.54. The result is about 66.9291 inches, or roughly 5 feet 6.9 inches.',
  },
  {
    question: 'How do I write height in feet and inches?',
    answer:
      'Write whole feet, then the leftover inches under 12—for example 5′10″ or 5 ft 10 in. If inches reach 12 or more, carry them into the next foot.',
  },
  {
    question: 'How many centimeters are in one inch?',
    answer: 'Exactly 2.54 centimeters equal one inch.',
  },
  {
    question: 'Can I enter inches greater than 12?',
    answer:
      'Yes. The total uses the sum as entered, and the feet-and-inches display normalizes—for example 5 ft 14 in becomes 6 ft 2 in.',
  },
];
