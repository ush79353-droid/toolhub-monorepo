import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FEET_TO_INCHES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-feet-to-inches', label: 'What Is a Feet to Inches Calculator?' },
  { id: 'how-to-convert', label: 'How to Convert Feet to Inches' },
  { id: 'formula', label: 'Feet to Inches Formula' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'conversion-table', label: 'Feet to Inches Conversion Table' },
  { id: 'why-twelve', label: 'Why Are There 12 Inches in a Foot?' },
  { id: 'feet-to-inches-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  feet: string;
  inches: string;
}

export interface FeetToInchesGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
}

export const FEET_TO_INCHES_GUIDE_SECTIONS: readonly FeetToInchesGuideSection[] = [
  {
    id: 'what-is-feet-to-inches',
    title: 'What Is a Feet to Inches Calculator?',
    paragraphs: [
      'A feet to inches calculator converts a length expressed in feet into the same length in inches, and the reverse. Builders, students, and anyone reading US customary measurements use it when a plan, tape measure, or product listing mixes the two units.',
      'Omega Calculators also lists the same length in millimeters, centimeters, meters, yards, kilometers, and miles so you can compare SI and customary units in one place. The conversion runs in your browser. Nothing is sent to a server to do the arithmetic.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Feet to Inches',
    paragraphs: [
      'Multiply the number of feet by 12. Each foot contains twelve inches, so three feet become 36 inches and five and a half feet become 66 inches.',
      'To go the other way, divide inches by 12. Eighteen inches are 1.5 feet. Thirty inches are 2.5 feet. Whole-inch results that divide evenly land on a whole number of feet; otherwise you get a decimal foot value.',
    ],
  },
  {
    id: 'formula',
    title: 'Feet to Inches Formula',
    paragraphs: [
      'The relationship is exact under the international yard and pound agreement that fixed the yard in terms of the meter. One foot is one third of a yard, and one foot is exactly 0.3048 meters. Twelve inches make that same foot.',
    ],
    formula: 'inches = feet × 12  |  feet = inches ÷ 12',
    formulaNote: '1 ft = 12 in = 304.8 mm = 30.48 cm = 0.3048 m = 1/3 yd.',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Calculator',
    paragraphs: [
      'Type a value in the Feet field to fill Inches, or type in Inches to fill Feet. The field you are editing stays as you typed it, including a trailing decimal point, until the number is complete.',
      'Open Other units to see the same length in metric and longer customary units. Copy result places a short summary on the clipboard. Reset restores the default one-foot example.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Feet to Inches Conversion Table',
    paragraphs: [
      'Common whole-foot and half-foot values are listed below. Every row uses inches = feet × 12.',
    ],
    table: [
      { feet: '0', inches: '0' },
      { feet: '0.5', inches: '6' },
      { feet: '1', inches: '12' },
      { feet: '2', inches: '24' },
      { feet: '3', inches: '36' },
      { feet: '5', inches: '60' },
      { feet: '5.5', inches: '66' },
      { feet: '10', inches: '120' },
      { feet: '100', inches: '1,200' },
    ],
  },
  {
    id: 'why-twelve',
    title: 'Why Are There 12 Inches in a Foot?',
    paragraphs: [
      'The foot and inch are older customary units that were standardized long before the metric system. Many historical systems counted twelve smaller units in a larger one, which made halves and thirds easy to work with in trade and craft.',
      'Modern definitions no longer depend on a particular person’s body. Since 1959 the international foot has been defined through the meter, and the inch is one twelfth of that foot. The calculator uses that fixed 12:1 ratio.',
    ],
  },
];

export const FEET_TO_INCHES_FAQS: readonly FAQItem[] = [
  {
    question: 'How many inches are in one foot?',
    answer:
      'There are exactly 12 inches in one foot. That ratio is fixed by the modern definition of the international foot.',
  },
  {
    question: 'How do I convert feet to inches?',
    answer:
      'Multiply feet by 12. For example, 5 feet × 12 = 60 inches, and 5.5 feet × 12 = 66 inches.',
  },
  {
    question: 'How do I convert inches to feet?',
    answer:
      'Divide inches by 12. For example, 18 inches ÷ 12 = 1.5 feet, and 30 inches ÷ 12 = 2.5 feet.',
  },
  {
    question: 'How many inches are in 5 feet?',
    answer: 'Five feet equal 60 inches, because 5 × 12 = 60.',
  },
  {
    question: 'Which is longer, one foot or one inch?',
    answer:
      'One foot is longer. A foot contains twelve inches, so one foot is twelve times one inch.',
  },
  {
    question: 'Can I convert decimal feet to inches?',
    answer:
      'Yes. Multiply the decimal foot value by 12. Half a foot is 6 inches, and 2.25 feet are 27 inches.',
  },
];
