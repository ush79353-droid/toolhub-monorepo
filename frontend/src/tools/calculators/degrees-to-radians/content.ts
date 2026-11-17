import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  DEGREES_RADIANS_TABLE,
  degreesToRadians,
  formatAngleValue,
  radiansToDegrees,
} from './calculation';

export const DEGREES_TO_RADIANS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How Do I Convert Degrees to Radians?' },
  { id: 'how-it-works', label: 'How Does the Degrees to Radians Converter Work?' },
  { id: 'conversion-table', label: 'Degrees and Radians Conversion Table' },
  { id: 'related-angle-tools', label: 'Other Related Angle Conversion Tools' },
  { id: 'degrees-to-radians-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const DEGREES_TO_RADIANS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Degrees to Radians?',
    paragraphs: [
      'A radian is the central angle subtended by an arc whose length equals the circle’s radius. A full turn is 360° or 2π radians, so 180° equals π radians.',
      'Degrees-to-radians conversion is common in geometry, trigonometry, physics, engineering, computer graphics, and programming APIs that expect radian arguments.',
      `Primary formula: radians = degrees × π / 180. Example: 90 × π / 180 = π/2 ≈ ${formatAngleValue(degreesToRadians(90))} rad. Another: 45° = π/4 ≈ ${formatAngleValue(degreesToRadians(45))} rad.`,
    ],
    formula: 'Radians = Degrees × π / 180   ·   Degrees = Radians × 180 / π',
  },
  {
    id: 'how-it-works',
    title: 'How Does the Degrees to Radians Converter Work?',
    paragraphs: [
      'Enter a value in either field. Editing degrees updates radians immediately (× π/180). Editing radians updates degrees immediately (× 180/π). Both fields start empty; clear or reload restores that empty state.',
      'Signed angles and values outside 0–360° are supported. The calculator uses decimal numeric input, so enter π as a decimal such as 3.141592653589793 when converting from radians.',
      `Reverse example: π × 180 / π = 180°, so π rad = 180°. Numerically, ${formatAngleValue(Math.PI)} rad ≈ ${formatAngleValue(radiansToDegrees(Math.PI))}°.`,
    ],
    formula: 'Degrees = Radians × 180 / π',
  },
  {
    id: 'conversion-table',
    title: 'Degrees and Radians Conversion Table',
    paragraphs: [
      'Common angles and their exact π-fraction equivalents. The calculator still stores full floating-point precision from Math.PI for every conversion.',
    ],
    tableHeaders: ['Degrees', 'Radians'],
    table: DEGREES_RADIANS_TABLE.map((row) => [
      `${formatAngleValue(row.degrees)}°`,
      row.piLabel,
    ]),
  },
  {
    id: 'related-angle-tools',
    title: 'Other Related Angle Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Angle Converter, Degrees to Minutes Converter, Degrees Minutes Seconds tools, and other angular converters. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const DEGREES_TO_RADIANS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Turn Degrees Into Radians?',
    answer: `Multiply degrees by π/180. Example: 60 × π / 180 = π/3 ≈ ${formatAngleValue(degreesToRadians(60))} rad. Therefore 60° = π/3 radians.`,
  },
  {
    question: 'What Is 360 Degrees in Radians?',
    answer: `A full revolution is 2π radians. 360 × π / 180 = 2π ≈ ${formatAngleValue(degreesToRadians(360))} rad. Therefore 360° = 2π radians.`,
  },
  {
    question: 'What Is 180 Degrees in Radians?',
    answer: `180 × π / 180 = π ≈ ${formatAngleValue(degreesToRadians(180))} rad. Therefore 180° = π radians.`,
  },
  {
    question: 'How Do I Convert Radians Back to Degrees?',
    answer: `Multiply radians by 180/π. Example: (π/2) × 180 / π = 90°. Numerically, ${formatAngleValue(Math.PI / 2)} rad ≈ ${formatAngleValue(radiansToDegrees(Math.PI / 2))}°.`,
  },
  {
    question: 'Why Are Radians Used in Mathematics?',
    answer:
      'Radians measure angles using radius and arc length, so many calculus, trigonometry, physics, and engineering identities are simplest when the angle is expressed in radians rather than degrees.',
  },
];
