import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatLength, metersToYards, yardsToMeters } from './calculation';
import { METERS_PER_YARD } from './types';

export const YARD_TO_METER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'yard-to-meter-intro', label: 'Yard to Meter Converter' },
  { id: 'what-is-yard-meter', label: 'What Is a Yard? What Is a Meter?' },
  { id: 'calculate-conversion', label: 'Calculate the Conversion from Yards to Meters' },
  { id: 'example', label: 'An Example of Calculating the Yard to Meter Conversion' },
  { id: 'related-tools', label: 'More Conversion Tools' },
  { id: 'yard-to-meter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
  }[];
}

export const YARD_TO_METER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'yard-to-meter-intro',
    title: 'Yard to Meter Converter',
    paragraphs: [
      'Convert measurements between imperial yards and metric meters instantly. Enter either unit and the other updates in real time.',
      'Use it for sports fields, football field measurements, athletics, construction, fabric and textile lengths, landscaping, and international distance comparisons.',
    ],
  },
  {
    id: 'what-is-yard-meter',
    title: 'What Is a Yard? What Is a Meter?',
    paragraphs: [
      'Yards and meters measure length in different systems. The international yard is locked to the meter by an exact factor, so conversions are deterministic.',
    ],
    subsections: [
      {
        id: 'the-yard',
        title: 'The Yard',
        paragraphs: [
          `A yard is a unit of length in the imperial and US customary systems. One yard equals exactly 3 feet, 36 inches, and ${METERS_PER_YARD} meters.`,
          'Yards appear in sports field layouts, construction plans, fabric retail, and everyday customary measurements.',
        ],
      },
      {
        id: 'the-meter',
        title: 'The Meter',
        paragraphs: [
          `The meter is the SI base unit of length. One meter equals 100 centimeters or 1,000 millimeters, and about ${formatLength(metersToYards(1))} yards.`,
          'Meters are standard in science, engineering, and international measurement systems.',
        ],
      },
    ],
  },
  {
    id: 'calculate-conversion',
    title: 'Calculate the Conversion from Yards to Meters',
    paragraphs: [
      `The exact relationship is 1 yd = ${METERS_PER_YARD} m.`,
      `To convert yards to meters, multiply by ${METERS_PER_YARD}. To convert meters to yards, divide by ${METERS_PER_YARD}.`,
      '1. Enter the length in yards.',
      `2. Multiply by ${METERS_PER_YARD}.`,
      '3. Read the equivalent length in meters. or let this converter do it automatically.',
    ],
    formula: `1 yd = ${METERS_PER_YARD} m\nMeters = Yards × ${METERS_PER_YARD}\nYards = Meters ÷ ${METERS_PER_YARD}`,
  },
  {
    id: 'example',
    title: 'An Example of Calculating the Yard to Meter Conversion',
    paragraphs: [
      `Convert 100 yards to meters (the distance between goal lines on an American football field, excluding end zones): 100 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(100))}. Therefore 100 yards = ${formatLength(yardsToMeters(100))} meters.`,
      `Convert 50 yards to meters: 50 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(50))}. Therefore 50 yards = ${formatLength(yardsToMeters(50))} meters.`,
      `Convert 10 meters to yards: 10 ÷ ${METERS_PER_YARD} ≈ ${formatLength(metersToYards(10))}. Therefore 10 meters ≈ ${formatLength(metersToYards(10))} yards.`,
    ],
  },
  {
    id: 'related-tools',
    title: 'More Conversion Tools',
    paragraphs: [
      'Related Omega Calculators tools include Length Converter (/tools/length-converter), Yard Conversion (/tools/yard-conversion), Yards to Meters Conversion (/tools/yards-to-meters-conversion), Meters to Feet Converter (/tools/meters-to-feet-converter), Feet to Inches Calculator (/tools/feet-to-inches-calculator), Feet to Yards Conversion (/tools/feet-to-yards-conversion), Inches to Yard Conversion (/tools/inches-to-yard-conversion), and Inch Converter (/tools/inch-converter). Only catalog tools that are active appear as live public routes.',
    ],
  },
];

export const YARD_TO_METER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert from Yard to Meter?',
    answer: `Multiply yards by ${METERS_PER_YARD}. Example: 10 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(10))}. Therefore 10 yards = ${formatLength(yardsToMeters(10))} meters.`,
  },
  {
    question: 'How Much Is 10 Meters in Yards?',
    answer: `Divide meters by ${METERS_PER_YARD}. 10 ÷ ${METERS_PER_YARD} ≈ ${formatLength(metersToYards(10))}. Therefore 10 meters ≈ ${formatLength(metersToYards(10))} yards.`,
  },
  {
    question: 'Is One Yard Equal to One Meter?',
    answer: `No. One yard equals exactly ${METERS_PER_YARD} meters, so a meter is longer. The difference is ${formatLength(1 - METERS_PER_YARD)} m (8.56 centimeters).`,
  },
  {
    question: 'How Many Meters Are in 100 Yards?',
    answer: `100 × ${METERS_PER_YARD} = ${formatLength(yardsToMeters(100))}. Therefore 100 yards = ${formatLength(yardsToMeters(100))} meters.`,
  },
  {
    question: 'How Do I Convert Meters Back to Yards?',
    answer: `Divide meters by ${METERS_PER_YARD}. Example: 20 ÷ ${METERS_PER_YARD} ≈ ${formatLength(metersToYards(20))}. Therefore 20 meters ≈ ${formatLength(metersToYards(20))} yards.`,
  },
];
