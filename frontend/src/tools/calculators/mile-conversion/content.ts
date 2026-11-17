import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertLength,
  FEET_PER_MILE,
  formatLength,
  KM_PER_MILE,
  METERS_PER_MILE,
} from './calculation';
import { INCHES_PER_MILE, METERS_PER_NAUTICAL_MILE, YARDS_PER_MILE } from './types';

export const MILE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'convert-miles', label: 'Convert Miles to Other Units' },
  { id: 'conversion-chart', label: 'Mile Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use the Mile Conversion Calculator' },
  { id: 'statute-vs-nautical', label: 'Difference Between a Mile and a Nautical Mile' },
  { id: 'related-tools', label: 'Other Length Conversion Tools' },
  { id: 'mile-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_MILES = [0.5, 1, 2, 5, 10, 20, 50, 100] as const;

export const MILE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'convert-miles',
    title: 'Convert Miles to Other Units',
    paragraphs: [
      'The Mile Conversion Calculator converts international statute miles into metric, imperial, nautical, and astronomical distance units. Use it for road distances, travel measurements, maps, running distances, and scientific calculations.',
      `Start from the exact definition: 1 mile = ${METERS_PER_MILE} meters.`,
      `Metric: km = mi × ${KM_PER_MILE}; m = mi × ${METERS_PER_MILE}; cm = mi × ${METERS_PER_MILE * 100}; mm = mi × ${METERS_PER_MILE * 1000}.`,
      `Imperial/US: in = mi × ${INCHES_PER_MILE}; ft = mi × ${FEET_PER_MILE}; yd = mi × ${YARDS_PER_MILE}.`,
      `Others: nmi = (mi × ${METERS_PER_MILE}) / ${METERS_PER_NAUTICAL_MILE}; astronomical units and light-years use documented IAU constants through the shared length engine.`,
    ],
    formula: `1 mi = ${METERS_PER_MILE} m = ${KM_PER_MILE} km\nkm = mi × ${KM_PER_MILE}\nft = mi × ${FEET_PER_MILE}\nyd = mi × ${YARDS_PER_MILE}\nnmi = (mi × ${METERS_PER_MILE}) / ${METERS_PER_NAUTICAL_MILE}`,
  },
  {
    id: 'conversion-chart',
    title: 'Mile Conversion Chart',
    paragraphs: [
      'Common statute-mile values converted with the same exact engine as the calculator.',
    ],
    tableHeaders: ['Miles (mi)', 'Kilometers (km)', 'Meters (m)', 'Feet (ft)'],
    table: CHART_MILES.map((mi) => [
      formatLength(mi),
      formatLength(convertLength(mi, 'mi', 'km')),
      formatLength(convertLength(mi, 'mi', 'm')),
      formatLength(convertLength(mi, 'mi', 'ft')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Mile Conversion Calculator',
    paragraphs: [
      '1. Enter a value in the miles input.',
      '2. View the converted metric units (km, m, cm).',
      '3. Expand Imperial/US for yards, feet, and other units.',
      '4. Expand Others for light-years, astronomical units, and nautical miles.',
      '5. Use the More units selector for parsecs, solar radii, or ångströms.',
      '6. Edit any unit field to calculate in reverse.',
      '7. Reset with Clear or Reload when needed.',
    ],
  },
  {
    id: 'statute-vs-nautical',
    title: 'Difference Between a Mile and a Nautical Mile',
    paragraphs: [
      `A statute mile equals exactly ${METERS_PER_MILE} meters and is commonly used for road distances.`,
      `An international nautical mile equals exactly ${METERS_PER_NAUTICAL_MILE} meters and is used in marine and aviation navigation.`,
      `1 nautical mile ≈ ${formatLength(convertLength(1, 'nmi', 'mi'))} statute miles.`,
    ],
    formula: `1 statute mi = ${METERS_PER_MILE} m\n1 nmi = ${METERS_PER_NAUTICAL_MILE} m\n1 nmi ≈ ${formatLength(convertLength(1, 'nmi', 'mi'))} mi`,
  },
  {
    id: 'related-tools',
    title: 'Other Length Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Kilometer Calculator, Kilometers to Miles Calculator, Kilometer to Meter Converter, km to Feet Conversion, Inch Converter, Feet Converter, Yard Converter, Inches to Yard Conversion, Meter to Mile Converter, and Nautical Mile Converter. Only active catalog tools appear as live links.',
    ],
  },
];

export const MILE_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Miles Are in a Kilometer?',
    answer: `One kilometer is approximately ${formatLength(convertLength(1, 'km', 'mi'))} miles. mi = km / ${KM_PER_MILE}.`,
  },
  {
    question: 'How Many Feet Are in a Mile?',
    answer: `One international statute mile contains exactly ${FEET_PER_MILE} feet.`,
  },
  {
    question: 'What Is 60 Miles in Kilometers?',
    answer: `60 × ${KM_PER_MILE} = ${formatLength(convertLength(60, 'mi', 'km'))} km. Therefore 60 miles equals ${formatLength(convertLength(60, 'mi', 'km'))} kilometers.`,
  },
  {
    question: 'How Many Yards Are in One Mile?',
    answer: `Exactly ${YARDS_PER_MILE} yards.`,
  },
  {
    question: 'How Many Meters Are in One Mile?',
    answer: `Exactly ${METERS_PER_MILE} meters.`,
  },
  {
    question: 'Is a Nautical Mile Longer Than a Regular Mile?',
    answer: `Yes. A nautical mile is ${METERS_PER_NAUTICAL_MILE} meters, while a statute mile is ${METERS_PER_MILE} meters.`,
  },
  {
    question: 'How Do I Convert Miles to Kilometers?',
    answer: `Multiply the distance in miles by ${KM_PER_MILE}.`,
  },
  {
    question: 'How Do I Convert Kilometers to Miles?',
    answer: `Divide the distance in kilometers by ${KM_PER_MILE}.`,
  },
  {
    question: 'How Many Inches Are in One Mile?',
    answer: `Exactly ${INCHES_PER_MILE} inches.`,
  },
];
