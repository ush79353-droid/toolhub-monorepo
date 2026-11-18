import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertLength,
  FEET_PER_YARD,
  formatLength,
  INCHES_PER_YARD,
  METERS_PER_YARD,
  YARDS_PER_MILE,
} from './calculation';

export const YARD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'yard-intro', label: 'Yard Conversion' },
  { id: 'yard-definition', label: 'Definition of Yard' },
  { id: 'yard-examples', label: 'Examples of Yard Conversion' },
  { id: 'how-to-use', label: 'How to Use This Yard Conversion Tool' },
  { id: 'conversion-table', label: 'Yard Conversion Reference Table' },
  { id: 'related-tools', label: 'Similar Length Conversion Tools' },
  { id: 'yard-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_YARDS = [1, 2, 3, 5, 10, 25, 50, 100, 500, 1000] as const;

export const YARD_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'yard-intro',
    title: 'Yard Conversion',
    paragraphs: [
      'Use this Yard Conversion calculator to convert a length in yards into feet, inches, miles, millimeters, centimeters, meters, kilometers, and other related units.',
      'It is useful for sports field dimensions, fabric and textile measurements, construction layouts, project planning, and everyday imperial ↔ metric length work. You can also enter any supported unit to recover the equivalent in yards.',
    ],
  },
  {
    id: 'yard-definition',
    title: 'Definition of Yard',
    paragraphs: [
      'A yard is a unit of length in the imperial and US customary systems. The international yard is defined as exactly 0.9144 meters.',
      `Within customary measure: 1 yard = ${FEET_PER_YARD} feet = ${INCHES_PER_YARD} inches, and ${YARDS_PER_MILE} yards make one international mile.`,
      'Yards appear in sports (football fields, cricket pitches), fabric retail, landscaping, and building plans where customary lengths are still common.',
    ],
    formula: `1 yd = ${FEET_PER_YARD} ft = ${INCHES_PER_YARD} in\n1 yd = ${METERS_PER_YARD} m\n1 mi = ${YARDS_PER_MILE} yd`,
  },
  {
    id: 'yard-examples',
    title: 'Examples of Yard Conversion to Different Units',
    paragraphs: [
      `Yards to meters: meters = yards × ${METERS_PER_YARD}. Example: 25 yd = ${formatLength(convertLength(25, 'yd', 'm'))} m.`,
      `Yards to feet: feet = yards × ${FEET_PER_YARD}. Example: 10 yd = ${formatLength(convertLength(10, 'yd', 'ft'))} ft.`,
      `Yards to inches: inches = yards × ${INCHES_PER_YARD}. Example: 100 yd = ${formatLength(convertLength(100, 'yd', 'in'))} in.`,
      `Yards to miles: miles = yards ÷ ${YARDS_PER_MILE}. Example: ${YARDS_PER_MILE} yd = ${formatLength(convertLength(YARDS_PER_MILE, 'yd', 'mi'))} mi.`,
      `Yards to centimeters: centimeters = yards × ${METERS_PER_YARD * 100}. Example: 10 yd = ${formatLength(convertLength(10, 'yd', 'cm'))} cm.`,
      `Yards to kilometers: kilometers = yards × ${METERS_PER_YARD / 1000}. Example: 100 yd = ${formatLength(convertLength(100, 'yd', 'km'))} km.`,
    ],
    formula: `m = yd × ${METERS_PER_YARD}\nft = yd × ${FEET_PER_YARD}\nin = yd × ${INCHES_PER_YARD}\nmi = yd ÷ ${YARDS_PER_MILE}\ncm = yd × ${METERS_PER_YARD * 100}\nkm = yd × ${METERS_PER_YARD / 1000}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Yard Conversion Tool',
    paragraphs: [
      '1. Enter a distance in the Yards field.',
      '2. Open Imperial/US to view inches, feet, and miles.',
      '3. Open Metric to view millimeters, centimeters, meters, and other metric units.',
      '4. Use the Other imperial units selector for a combined feet-and-inches view (or mil, furlong, chain, rod).',
      '5. Use the Other metric units selector for nanometers through kilometers (default kilometers).',
      '6. Edit any standard field to convert in the opposite direction.',
      '7. Clear all changes or reload the calculator to start again. Conversions update automatically — there is no Calculate button.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Yard Conversion Reference Table',
    paragraphs: [
      'Values below are generated with the same exact conversion engine as the calculator (1 yd = 0.9144 m).',
    ],
    tableHeaders: ['Yards', 'Feet', 'Meters', 'Inches'],
    table: TABLE_YARDS.map((yd) => [
      formatLength(yd),
      formatLength(convertLength(yd, 'yd', 'ft')),
      formatLength(convertLength(yd, 'yd', 'm')),
      formatLength(convertLength(yd, 'yd', 'in')),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Our Similar Length Conversion Tools',
    paragraphs: [
      'Related Omega Calculators tools include Length Converter (/tools/length-converter), Feet Converter (/tools/feet-converter), Feet to Yards Conversion (/tools/feet-to-yards-conversion), Inches to Yard Conversion (/tools/inches-to-yard-conversion), Mile Conversion Calculator (/tools/mile-conversion-calculator), Meter to Mile Converter (/tools/meter-to-mile-converter), Meters to Feet Converter (/tools/meters-to-feet-converter), Kilometer to Meter Converter (/tools/kilometer-to-meter-converter), Inch Converter (/tools/inch-converter), and km to Feet Conversion (/tools/km-to-feet-conversion). Only catalog tools that are active appear as live public routes.',
    ],
  },
];

export const YARD_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Feet Is in 100 Yards?',
    answer: `There are ${FEET_PER_YARD} feet in one yard. 100 × ${FEET_PER_YARD} = ${formatLength(convertLength(100, 'yd', 'ft'))}. Therefore 100 yards = ${formatLength(convertLength(100, 'yd', 'ft'))} feet.`,
  },
  {
    question: 'How Many Yards Are in a Meter?',
    answer: `One meter is approximately ${formatLength(convertLength(1, 'm', 'yd'))} yards (yards = meters ÷ ${METERS_PER_YARD}). Example: 250 m ≈ ${formatLength(convertLength(250, 'm', 'yd'))} yards.`,
  },
  {
    question: 'Is a Yard Longer Than a Meter?',
    answer: `No. One yard equals exactly ${METERS_PER_YARD} meters, so a yard is shorter than a meter. One meter is about ${formatLength(convertLength(1, 'm', 'yd'))} yards.`,
  },
  {
    question: 'How Many Inches Are in One Yard?',
    answer: `One yard contains exactly ${INCHES_PER_YARD} inches.`,
  },
  {
    question: 'How Many Yards Are in a Mile?',
    answer: `One international mile contains exactly ${YARDS_PER_MILE} yards.`,
  },
  {
    question: 'How Do I Convert 50 Yards to Meters?',
    answer: `Multiply by ${METERS_PER_YARD}. 50 × ${METERS_PER_YARD} = ${formatLength(convertLength(50, 'yd', 'm'))}. Therefore 50 yards = ${formatLength(convertLength(50, 'yd', 'm'))} meters.`,
  },
];
