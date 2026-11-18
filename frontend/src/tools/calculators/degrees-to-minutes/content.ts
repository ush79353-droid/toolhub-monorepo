import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  arcminutesToDegrees,
  degreesToArcminutes,
  degreesToArcminutesTableRows,
  formatAngleValue,
} from './calculation';

export const DEGREES_TO_MINUTES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How Do I Convert Degrees to Minutes of Arc?' },
  { id: 'how-it-works', label: 'How Does the Degrees to Minutes Converter Work?' },
  { id: 'degrees-arcminutes-arcseconds', label: 'Degrees, Arcminutes, and Arcseconds' },
  { id: 'related-angle-tools', label: 'Other Related Angle Conversion Tools' },
  { id: 'degrees-to-minutes-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_TABLE = degreesToArcminutesTableRows();

export const DEGREES_TO_MINUTES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Degrees to Minutes of Arc?',
    paragraphs: [
      'An arcminute (symbol ′) is an angular unit equal to one-sixtieth of a degree. It is used in geometry, astronomy, navigation, geographic coordinates, surveying, mapping, and engineering whenever a finer subdivision of a degree is helpful.',
      'This converter works with angular measurements only — not clock time. One time-minute is sixty seconds of duration; one arcminute is 1/60 of one angular degree.',
      `To convert degrees to arcminutes, multiply by 60. Example: 180 × 60 = ${formatAngleValue(degreesToArcminutes(180))}, so 180° = 10,800′. Fractional example: 2.5 × 60 = ${formatAngleValue(degreesToArcminutes(2.5))}, so 2.5° = 150′.`,
    ],
    formula: 'M = D × 60   ·   D = M ÷ 60',
    tableHeaders: ['Degrees (°)', 'Arcminutes (′)'],
    table: EXAMPLE_TABLE.map((row) => [
      formatAngleValue(row.degrees),
      formatAngleValue(row.arcminutes),
    ]),
  },
  {
    id: 'how-it-works',
    title: 'How Does the Degrees to Minutes Converter Work?',
    paragraphs: [
      'Enter a value in either field. Editing degrees updates arcminutes immediately (×60). Editing arcminutes updates degrees immediately (÷60). Both fields start empty; clear or reload restores that empty state.',
      'Signed angles and values outside 0–360° are supported because angular displacement can be negative or describe more than one full turn.',
      `Reverse example: 240 ÷ 60 = ${formatAngleValue(arcminutesToDegrees(240))}, so 240′ = 4°.`,
    ],
    formula: 'Degrees = Arcminutes ÷ 60',
  },
  {
    id: 'degrees-arcminutes-arcseconds',
    title: 'Degrees, Arcminutes, and Arcseconds',
    paragraphs: [
      'Sexagesimal angle measure splits each degree into 60 arcminutes and each arcminute into 60 arcseconds. Therefore 1° = 60′ = 3,600″. Geographic coordinates and telescope pointing often quote positions in degrees, minutes, and seconds of arc for precision finer than whole degrees.',
    ],
    tableHeaders: ['Unit', 'Equivalent'],
    table: [
      ['1 degree', '60 arcminutes'],
      ['1 arcminute', '60 arcseconds'],
      ['1 degree', '3,600 arcseconds'],
      ['0.5 degree', '30 arcminutes'],
    ],
  },
  {
    id: 'related-angle-tools',
    title: 'Other Related Angle Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Angle Converter, Degrees Minutes Seconds tools, and other angular converters. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const DEGREES_TO_MINUTES_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Degrees Is One Minute of Arc?',
    answer: `One arcminute is exactly 1/60 of a degree. 1′ = ${formatAngleValue(arcminutesToDegrees(1))}°.`,
  },
  {
    question: 'How Do I Convert 90 Degrees to Minutes of Arc?',
    answer: `Multiply 90 by 60: 90 × 60 = ${formatAngleValue(degreesToArcminutes(90))}. Therefore 90° = 5,400′.`,
  },
  {
    question: 'How Many Arcminutes Are in 45 Degrees?',
    answer: `45 × 60 = ${formatAngleValue(degreesToArcminutes(45))}. Therefore 45° = 2,700 arcminutes.`,
  },
  {
    question: 'How Do I Convert Arcminutes to Degrees?',
    answer: `Divide arcminutes by 60. Example: 120 ÷ 60 = ${formatAngleValue(arcminutesToDegrees(120))}, so 120′ = 2°.`,
  },
  {
    question: 'Are Arcminutes the Same as Minutes of Time?',
    answer:
      'No. Arcminutes measure angles (1′ = 1/60 of one degree). Minutes of time measure duration (60 seconds of clock time). This converter does not treat them as interchangeable.',
  },
];
