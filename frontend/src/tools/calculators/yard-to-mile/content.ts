import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatLength, milesToYards, yardsToMiles } from './calculation';
import { YARDS_PER_MILE } from './types';

export const YARD_TO_MILE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'yard-to-mile-intro', label: 'Yard to Mile Converter' },
  { id: 'conversion-diagram', label: 'Conversion Chart — Miles to Yards' },
  { id: 'yards-to-miles', label: 'How to Convert Yards to Miles' },
  { id: 'miles-to-yards', label: 'How to Convert Miles to Yards' },
  { id: 'conversion-table', label: 'Yard to Mile Conversion Chart' },
  { id: 'related-tools', label: 'Other Tools Similar to the Mile to Yard Converter' },
  { id: 'yard-to-mile-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  diagram?: readonly string[];
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_YARDS = [100, 220, 440, 500, 880, 1000, 1760, 2640, 3520, 5280] as const;

export const YARD_TO_MILE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'yard-to-mile-intro',
    title: 'Yard to Mile Converter',
    paragraphs: [
      'Convert distances between yards and miles instantly. Enter either unit and the other updates in real time.',
      'Use it for sports and athletics, running tracks, road distances, land measurements, outdoor activities, and everyday imperial distance work.',
    ],
  },
  {
    id: 'conversion-diagram',
    title: 'Conversion Chart — Miles to Yards',
    paragraphs: [
      `Within US customary / imperial length: 1 mile = ${YARDS_PER_MILE.toLocaleString('en-US')} yards, 1 yard = 3 feet, and 1 foot = 12 inches.`,
      'Multiply when moving toward smaller units; divide when moving toward larger units.',
    ],
    diagram: [
      '          × 1760              × 3               × 12',
      'Miles  ──────────→  Yards  ──────────→  Feet  ──────────→  Inches',
      '',
      '          ÷ 1760              ÷ 3               ÷ 12',
      'Miles  ←──────────  Yards  ←──────────  Feet  ←──────────  Inches',
    ],
    formula: `1 mi = ${YARDS_PER_MILE} yd = 5,280 ft = 63,360 in\n1 yd = 3 ft = 36 in`,
  },
  {
    id: 'yards-to-miles',
    title: 'How to Convert Yards to Miles',
    paragraphs: [
      `Divide yards by ${YARDS_PER_MILE}.`,
      `Example — convert 500 yards: 500 ÷ ${YARDS_PER_MILE} ≈ ${formatLength(yardsToMiles(500))}. Therefore 500 yards ≈ ${formatLength(yardsToMiles(500))} miles.`,
    ],
    formula: `Miles = Yards ÷ ${YARDS_PER_MILE}`,
  },
  {
    id: 'miles-to-yards',
    title: 'How to Convert Miles to Yards',
    paragraphs: [
      `Multiply miles by ${YARDS_PER_MILE}.`,
      `Example — convert 3 miles: 3 × ${YARDS_PER_MILE} = ${formatLength(milesToYards(3))}. Therefore 3 miles = ${formatLength(milesToYards(3))} yards.`,
    ],
    formula: `Yards = Miles × ${YARDS_PER_MILE}`,
  },
  {
    id: 'conversion-table',
    title: 'Yard to Mile Conversion Chart',
    paragraphs: [
      `Table values may round for display. The calculator uses the exact factor ${YARDS_PER_MILE} without intermediate rounding.`,
    ],
    tableHeaders: ['Yards', 'Miles'],
    table: TABLE_YARDS.map((yd) => [formatLength(yd), formatLength(yardsToMiles(yd))]),
  },
  {
    id: 'related-tools',
    title: 'Other Tools Similar to the Mile to Yard Converter',
    paragraphs: [
      'Related Omega Calculators tools include Length Converter (/tools/length-converter), Mile Conversion Calculator (/tools/mile-conversion-calculator), Yard Conversion (/tools/yard-conversion), Yard to Meter Converter (/tools/yard-to-meter-converter), Meter to Mile Converter (/tools/meter-to-mile-converter), Feet to Yards Conversion (/tools/feet-to-yards-conversion), Inches to Yard Conversion (/tools/inches-to-yard-conversion), Kilometer to Meter Converter (/tools/kilometer-to-meter-converter), km to Feet Conversion (/tools/km-to-feet-conversion), and Decimeter to Meter Converter (/tools/decimeter-to-meter-converter). Only catalog tools that are active appear as live public routes.',
    ],
  },
];

export const YARD_TO_MILE_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is the Conversion Factor Used to Convert Miles to Yards?',
    answer: `The conversion factor is ${YARDS_PER_MILE.toLocaleString('en-US')}. One mile contains exactly ${YARDS_PER_MILE.toLocaleString('en-US')} yards. Yards = Miles × ${YARDS_PER_MILE}. Miles = Yards ÷ ${YARDS_PER_MILE}.`,
  },
  {
    question: 'How Many Miles Is 500 Yards?',
    answer: `500 ÷ ${YARDS_PER_MILE} ≈ ${formatLength(yardsToMiles(500))}. Therefore 500 yards is approximately ${formatLength(yardsToMiles(500))} miles.`,
  },
  {
    question: 'How Many Yards Are in One Mile?',
    answer: `There are exactly ${YARDS_PER_MILE.toLocaleString('en-US')} yards in one mile.`,
  },
  {
    question: 'How Many Miles Are in 880 Yards?',
    answer: `880 ÷ ${YARDS_PER_MILE} = ${formatLength(yardsToMiles(880))}. Therefore 880 yards = ${formatLength(yardsToMiles(880))} miles.`,
  },
  {
    question: 'How Do I Convert 2 Miles to Yards?',
    answer: `2 × ${YARDS_PER_MILE} = ${formatLength(milesToYards(2))}. Therefore 2 miles = ${formatLength(milesToYards(2))} yards.`,
  },
];
