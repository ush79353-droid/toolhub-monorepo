import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  RADIANS_DEGREES_TABLE,
  degreesToRadians,
  formatAngleValue,
  radiansToDegrees,
} from './calculation';

export const RADIANS_TO_DEGREES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Radians to Degrees Converter' },
  { id: 'how-to-convert', label: 'How Do I Convert Radians to Degrees?' },
  { id: 'how-it-works', label: 'How Does the Radians to Degrees Converter Work?' },
  { id: 'what-is-radian', label: 'What Is a Radian?' },
  { id: 'what-is-degree', label: 'What Is a Degree?' },
  { id: 'conversion-table', label: 'Radians to Degrees Conversion Chart' },
  { id: 'related-tools', label: 'Other Related Angle Conversion Tools' },
  { id: 'radians-to-degrees-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const RADIANS_TO_DEGREES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Radians to Degrees Converter',
    paragraphs: [
      'Convert angular measurements between radians and degrees for geometry, trigonometry, physics, engineering, mathematics, computer graphics, and rotational work.',
      'The calculator uses Math.PI for the exact π relationship — not a low-precision stand-in such as 3.14. Expand Other angle units for gradians, turns, arcminutes, arcseconds, and milliradians.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Radians to Degrees?',
    paragraphs: [
      'Because π radians equal 180°, multiply radians by 180/π to get degrees. Reverse the conversion by multiplying degrees by π/180.',
      `Example — π rad: π × 180 / π = 180°. Example — 2 rad: 2 × 180 / π ≈ ${formatAngleValue(radiansToDegrees(2))}°.`,
      `Example — 90° back to radians: 90 × π / 180 = π/2 ≈ ${formatAngleValue(degreesToRadians(90))} rad.`,
    ],
    formula: 'degrees = radians × 180 / π   ·   radians = degrees × π / 180',
  },
  {
    id: 'how-it-works',
    title: 'How Does the Radians to Degrees Converter Work?',
    paragraphs: [
      '1. Enter an angle in radians (decimal or a restricted π expression such as π/2 or 2π).',
      '2. Degrees update automatically.',
      '3. Enter degrees instead to calculate radians.',
      '4. Expand Other angle units for gradians, turns, arcminutes, arcseconds, and milliradians.',
      '5. Use Share, Reload, or Clear as needed.',
      'Negative angles and values outside 0–360° are preserved; the tool does not force-wrap the circle unless you enter a different value yourself.',
    ],
  },
  {
    id: 'what-is-radian',
    title: 'What Is a Radian?',
    paragraphs: [
      'A radian is the central angle subtended by an arc whose length equals the circle’s radius. One full turn is 2π radians, which equals 360°.',
      'Radians are the natural unit for many calculus, trigonometry, and physics formulas because arc length and radius share the same length unit.',
    ],
    formula: '2π rad = 360° · π rad = 180°',
  },
  {
    id: 'what-is-degree',
    title: 'What Is a Degree?',
    paragraphs: [
      'Degrees divide a complete circle into 360 equal angular units. Common reference angles include 30°, 45°, 60°, 90°, 180°, 270°, and 360°.',
      'Degrees remain widely used in navigation, surveying, education, and everyday angle descriptions even when underlying math uses radians.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Radians to Degrees Conversion Chart',
    paragraphs: [
      'Common angles with exact π labels. Numeric conversions still use full Math.PI precision.',
    ],
    tableHeaders: ['Radians', 'Degrees'],
    table: RADIANS_DEGREES_TABLE.map((row) => [
      row.radiansLabel,
      `${formatAngleValue(row.degrees)}°`,
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Related Angle Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include Angle Conversion Calculator, Degrees to Radians Converter, Degrees to Minutes Converter, Degrees to Seconds Converter, and Degrees Minutes Seconds Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const RADIANS_TO_DEGREES_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 5 Radians to Degrees?',
    answer: `Multiply 5 by 180/π. 5 × 180 / π ≈ ${formatAngleValue(radiansToDegrees(5))}°.`,
  },
  {
    question: 'How Many Degrees Is 6.283 Radians?',
    answer: `6.283 × 180 / π ≈ ${formatAngleValue(radiansToDegrees(6.283))}°. That is approximately one full rotation (2π ≈ ${formatAngleValue(2 * Math.PI)} rad).`,
  },
  {
    question: 'How Many Degrees Are in π Radians?',
    answer: 'π radians equal 180 degrees.',
  },
  {
    question: 'How Many Radians Are in 90 Degrees?',
    answer: `90° = π/2 rad ≈ ${formatAngleValue(degreesToRadians(90))} rad.`,
  },
  {
    question: 'What Is 1 Radian in Degrees?',
    answer: `One radian is approximately ${formatAngleValue(radiansToDegrees(1))} degrees.`,
  },
  {
    question: 'How Do I Convert Degrees Back to Radians?',
    answer: 'Multiply the degree value by π/180.',
  },
  {
    question: 'Are Radians and Degrees the Same?',
    answer:
      'No. They measure the same physical quantity—angle—but use different scales. π rad = 180° and 2π rad = 360°.',
  },
  {
    question: 'Can Angles Be Negative?',
    answer:
      'Yes. Negative angles generally indicate rotation in the clockwise direction under the usual mathematical sign convention. This converter preserves signed inputs.',
  },
];
