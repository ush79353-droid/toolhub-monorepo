import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatLength, metersToYards, yardsToMeters } from './calculation';
import { METERS_PER_YARD } from './types';

export const YARDS_TO_METERS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'yards-to-meters-intro', label: 'Yards to Meters Conversion' },
  { id: 'how-to-convert', label: 'How Do I Perform Yards to Meters Conversion?' },
  { id: 'examples', label: 'Yards to Meters Conversion Examples' },
  { id: 'conversion-table', label: 'Yards to Meters Reference Table' },
  { id: 'related-tools', label: 'Other Length Related Converters' },
  { id: 'yards-to-meters-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_YARDS = [0.5, 1, 2, 3, 5, 10, 25, 50, 100, 120, 500, 1000] as const;

export const YARDS_TO_METERS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'yards-to-meters-intro',
    title: 'Yards to Meters Conversion',
    paragraphs: [
      'Convert yards to meters and meters back to yards instantly with this bidirectional length calculator.',
      'Yards belong to the imperial and US customary systems. Meters are the SI base unit of length. Use this tool for sports field dimensions, construction layouts, fabric measurements, landscaping, international distance comparisons, and everyday length calculations.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Perform Yards to Meters Conversion?',
    paragraphs: [
      `The international yard is defined exactly as ${METERS_PER_YARD} meters. One meter is therefore about ${formatLength(metersToYards(1))} yards.`,
      `To convert yards to meters, multiply by ${METERS_PER_YARD}. To convert meters to yards, divide by ${METERS_PER_YARD}.`,
      `Example — 10 yards: 10 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(10))} m.`,
      `Example — 50 meters: 50 ÷ ${METERS_PER_YARD} ≈ ${formatLength(metersToYards(50))} yd.`,
    ],
    formula: `1 yd = ${METERS_PER_YARD} m\n1 m ≈ ${formatLength(metersToYards(1))} yd\nm = yd × ${METERS_PER_YARD}\nyd = m ÷ ${METERS_PER_YARD}`,
  },
  {
    id: 'examples',
    title: 'Yards to Meters Conversion Examples',
    paragraphs: [
      `Example 1 — Convert 10 yards to meters: 10 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(10))}. Result: 10 yards = ${formatLength(yardsToMeters(10))} meters.`,
      `Example 2 — Convert 25 yards to meters: 25 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(25))}. Result: 25 yards = ${formatLength(yardsToMeters(25))} meters.`,
      `Example 3 — Convert 120 yards to meters: 120 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(120))}. Result: 120 yards = ${formatLength(yardsToMeters(120))} meters.`,
      `Example 4 — Convert 50 meters to yards: 50 ÷ ${METERS_PER_YARD} ≈ ${formatLength(metersToYards(50))}. Result: 50 meters ≈ ${formatLength(metersToYards(50))} yards.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Yards to Meters Reference Table',
    paragraphs: [
      `Values below are generated with the exact factor 1 yd = ${METERS_PER_YARD} m — the same engine used by the calculator.`,
    ],
    tableHeaders: ['Yards (yd)', 'Meters (m)'],
    table: TABLE_YARDS.map((yd) => [formatLength(yd), formatLength(yardsToMeters(yd))]),
  },
  {
    id: 'related-tools',
    title: 'Other Length Related Converters',
    paragraphs: [
      'Related Omega Calculators tools include Yard Conversion (/tools/yard-conversion), Length Converter (/tools/length-converter), Feet to Yards Conversion (/tools/feet-to-yards-conversion), Inches to Yard Conversion (/tools/inches-to-yard-conversion), Meters to Feet Converter (/tools/meters-to-feet-converter), Feet to Inches Calculator (/tools/feet-to-inches-calculator), Inch Converter (/tools/inch-converter), and km to Feet Conversion (/tools/km-to-feet-conversion). Only catalog tools that are active appear as live public routes.',
    ],
  },
];

export const YARDS_TO_METERS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 1 Yard to Meters?',
    answer: `Multiply by ${METERS_PER_YARD}. 1 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(1))}. Therefore 1 yard equals exactly ${formatLength(yardsToMeters(1))} meters.`,
  },
  {
    question: 'How Do I Convert 100 Yards to Meters?',
    answer: `100 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(100))}. Therefore 100 yards = ${formatLength(yardsToMeters(100))} meters.`,
  },
  {
    question: 'How Many Meters Are in 25 Yards?',
    answer: `25 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(25))}. Therefore 25 yards = ${formatLength(yardsToMeters(25))} meters.`,
  },
  {
    question: 'Are One Meter and One Yard the Same Length?',
    answer: `No. A meter is slightly longer than a yard. 1 yard = ${METERS_PER_YARD} meters, and 1 meter ≈ ${formatLength(metersToYards(1))} yards. A meter is about 9.36% longer than a yard.`,
  },
  {
    question: 'How Many Meters Are in 120 Yards?',
    answer: `120 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(120))}. Therefore 120 yards = ${formatLength(yardsToMeters(120))} meters.`,
  },
  {
    question: 'How Do I Convert Meters Back to Yards?',
    answer: `Divide meters by ${METERS_PER_YARD}. Example: 20 ÷ ${METERS_PER_YARD} ≈ ${formatLength(metersToYards(20))}. Therefore 20 meters ≈ ${formatLength(metersToYards(20))} yards.`,
  },
];
