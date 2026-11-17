import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  arcsecondsToDegrees,
  degreesToArcseconds,
  degreesToArcsecondsTableRows,
  formatAngleValue,
} from './calculation';

export const DEGREES_TO_SECONDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How Do I Convert Degrees to Arcseconds?' },
  { id: 'how-it-works', label: 'How Does the Degrees to Seconds Converter Work?' },
  { id: 'conversion-table', label: 'Degrees to Arcseconds Conversion Table' },
  { id: 'related-angle-tools', label: 'Other Related Tools' },
  { id: 'degrees-to-seconds-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_TABLE = degreesToArcsecondsTableRows();

export const DEGREES_TO_SECONDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Degrees to Arcseconds?',
    paragraphs: [
      'An arcsecond (symbol ″) is a fine angular unit used in astronomy, navigation, surveying, geodesy, and optical measurement. It is not a unit of time.',
      'One degree contains 60 arcminutes, and each arcminute contains 60 arcseconds, so 1° = 3,600″.',
      `Formula: arcseconds = degrees × 3600. Example: 30 × 3600 = ${formatAngleValue(degreesToArcseconds(30))}, so 30° = 108,000″. Another: 0.5 × 3600 = ${formatAngleValue(degreesToArcseconds(0.5))}, so 0.5° = 1,800″.`,
    ],
    formula: 'Arcseconds = Degrees × 3600   ·   Degrees = Arcseconds ÷ 3600',
  },
  {
    id: 'how-it-works',
    title: 'How Does the Degrees to Seconds Converter Work?',
    paragraphs: [
      'Enter a value in degrees or arcseconds. Editing degrees updates arcseconds immediately (×3600). Editing arcseconds updates degrees immediately (÷3600). Expand Other angle units for arcminutes, radians, gradians, and revolutions — each field can also drive the conversion.',
      'Signed angles and values outside 0–360° are supported. Fields start empty; clear or reload restores that empty state.',
      `Reverse example: 18,000 ÷ 3600 = ${formatAngleValue(arcsecondsToDegrees(18000))}, so 18,000″ = 5°.`,
    ],
    formula: 'Degrees = Arcseconds ÷ 3600',
  },
  {
    id: 'conversion-table',
    title: 'Degrees to Arcseconds Conversion Table',
    paragraphs: [
      'Common degree values converted with the exact factor 3,600 arcseconds per degree.',
    ],
    tableHeaders: ['Degrees (°)', 'Arcseconds (″)'],
    table: EXAMPLE_TABLE.map((row) => [
      formatAngleValue(row.degrees),
      formatAngleValue(row.arcseconds),
    ]),
  },
  {
    id: 'related-angle-tools',
    title: 'Other Related Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Angle Converter, Degrees to Minutes Converter, Degrees to Radians Converter, and Degrees Minutes Seconds tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const DEGREES_TO_SECONDS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Arcseconds Are in 1 Degree?',
    answer: `There are 3,600 arcseconds in 1 degree. 1° = ${formatAngleValue(degreesToArcseconds(1))}″ because one degree contains 60 arcminutes and each arcminute contains 60 arcseconds.`,
  },
  {
    question: 'How Do I Convert Arcseconds to Degrees?',
    answer: `Divide arcseconds by 3600. Example: 7,200 ÷ 3600 = ${formatAngleValue(arcsecondsToDegrees(7200))}, so 7,200″ = 2°.`,
  },
  {
    question: 'How Many Arcseconds Are in 90 Degrees?',
    answer: `90 × 3600 = ${formatAngleValue(degreesToArcseconds(90))}. Therefore 90° = 324,000″.`,
  },
  {
    question: 'What Is the Difference Between Arcseconds and Seconds?',
    answer:
      'Arcseconds measure angles (1″ = 1/3600 of one degree). Seconds of time measure duration. They are not interchangeable; this converter uses angular arcseconds only.',
  },
  {
    question: 'How Many Arcseconds Are in One Arcminute?',
    answer: 'One arcminute contains 60 arcseconds. 1′ = 60″.',
  },
];
