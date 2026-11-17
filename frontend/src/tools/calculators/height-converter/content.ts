import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  calculateHeight,
  feetInchesToMeters,
  formatLength,
  metersToCentimeters,
  metersToFeetInches,
} from './calculation';
import {
  CENTIMETERS_PER_FOOT,
  CENTIMETERS_PER_INCH,
  METERS_PER_FOOT,
  METERS_PER_INCH,
} from './types';

export const HEIGHT_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'overview', label: 'Overview of Height Conversion' },
  { id: 'to-centimeters', label: 'How to Convert Height to Centimeters' },
  { id: 'to-meters', label: 'How to Convert Height to Meters' },
  { id: 'to-inches', label: 'How to Convert Height to Inches' },
  { id: 'to-feet', label: 'How to Convert Height to Feet' },
  { id: 'why-convert', label: 'Why Height Conversion Matters' },
  { id: 'related-tools', label: 'Related Calculators' },
  { id: 'height-converter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly {
    unit: string;
    cm: string;
    m: string;
    inches: string;
    feet: string;
  }[];
}

const overviewRows = [
  { label: '1 cm', meters: 0.01 },
  { label: '1 m', meters: 1 },
  { label: '1 in', meters: METERS_PER_INCH },
  { label: '1 ft', meters: METERS_PER_FOOT },
] as const;

export const HEIGHT_OVERVIEW_TABLE = overviewRows.map((row) => {
  const result = calculateHeight({
    source: 'meters',
    centimeters: null,
    meters: row.meters,
    metersPart: null,
    centimetersPart: null,
    inches: null,
    feet: null,
    feetPart: null,
    inchesPart: null,
    otherUnit: 'km',
    otherValue: null,
  });
  return {
    unit: row.label,
    cm: formatLength(result.centimeters),
    m: formatLength(result.meters),
    inches: formatLength(Number(result.inches.toFixed(6))),
    feet: formatLength(Number(result.feet.toFixed(7))),
  };
});

const ft7 = metersToCentimeters(feetInchesToMeters(5, 7));
const cm180In = 180 / CENTIMETERS_PER_INCH;
const cm180Ft = 180 / CENTIMETERS_PER_FOOT;
const mixed170 = metersToFeetInches(1.7);

export const HEIGHT_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'overview',
    title: 'Overview of Height Conversion',
    paragraphs: [
      'Height is a length measurement. Metric units use powers of ten (cm, m), while imperial units use fixed factors such as 12 inches per foot and exactly 2.54 centimeters per inch.',
      'This converter keeps centimeters, meters, meters-and-centimeters, inches, feet, and feet-and-inches synchronized from a single internal meters value.',
    ],
    table: HEIGHT_OVERVIEW_TABLE,
  },
  {
    id: 'to-centimeters',
    title: 'How to Convert Height to Centimeters',
    paragraphs: [
      `Meters to centimeters: multiply by 100. Inches to centimeters: multiply by ${CENTIMETERS_PER_INCH}. Feet to centimeters: multiply by ${CENTIMETERS_PER_FOOT}.`,
      `Feet and inches to centimeters: cm = (ft × ${CENTIMETERS_PER_FOOT}) + (in × ${CENTIMETERS_PER_INCH}).`,
      `Example: convert 5 ft 7 in. (5 × ${CENTIMETERS_PER_FOOT}) + (7 × ${CENTIMETERS_PER_INCH}) = ${formatLength(ft7)} cm.`,
    ],
    formula: `cm = (ft × ${CENTIMETERS_PER_FOOT}) + (in × ${CENTIMETERS_PER_INCH})`,
  },
  {
    id: 'to-meters',
    title: 'How to Convert Height to Meters',
    paragraphs: [
      'Divide centimeters by 100, multiply feet by 0.3048, or multiply inches by 0.0254.',
      'Example: convert 175 cm to meters. 175 ÷ 100 = 1.75 m.',
    ],
    formula: `m = cm ÷ 100\nm = ft × ${METERS_PER_FOOT}\nm = in × ${METERS_PER_INCH}`,
  },
  {
    id: 'to-inches',
    title: 'How to Convert Height to Inches',
    paragraphs: [
      `Divide centimeters by ${CENTIMETERS_PER_INCH}, or multiply feet by 12.`,
      `Example: 180 ÷ ${CENTIMETERS_PER_INCH} ≈ ${formatLength(Number(cm180In.toFixed(4)))} in.`,
    ],
    formula: `in = cm ÷ ${CENTIMETERS_PER_INCH}`,
  },
  {
    id: 'to-feet',
    title: 'How to Convert Height to Feet',
    paragraphs: [
      `Divide centimeters by ${CENTIMETERS_PER_FOOT} for decimal feet.`,
      `Example: 180 ÷ ${CENTIMETERS_PER_FOOT} ≈ ${formatLength(Number(cm180Ft.toFixed(4)))} ft.`,
      'Decimal feet are not feet-and-inches: 5.9 ft is not 5 ft 9 in. Use the feet-and-inches row for mixed imperial height.',
    ],
    formula: `ft = cm ÷ ${CENTIMETERS_PER_FOOT}`,
  },
  {
    id: 'why-convert',
    title: 'Why Height Conversion Matters',
    paragraphs: [
      'People convert height for medical and fitness records, clothing and apparel sizing, construction clearances, travel documents, and international forms that mix metric and imperial units.',
      'Keeping one exact factor set (especially 1 in = 2.54 cm) avoids rounded shortcuts that accumulate error.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Related Height and Length Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Centimeter Calculator, Feet Converter, CM Height Conversion Calculator, CM to Ft In Converter, Meters to Feet Converter, Feet to Meters Converter, Foot to Centimeter Converter, and Distance Converter. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const HEIGHT_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Centimeters to Inches?',
    answer: `Divide centimeters by ${CENTIMETERS_PER_INCH}. Example: 170 ÷ ${CENTIMETERS_PER_INCH} ≈ ${formatLength(Number((170 / CENTIMETERS_PER_INCH).toFixed(4)))} inches.`,
  },
  {
    question: 'How Tall Is 170 cm in Feet and Inches?',
    answer: `170 cm equals approximately ${formatLength(mixed170.feetPart)} feet ${formatLength(Number(mixed170.inchesPart.toFixed(2)))} inches. Rounded to the nearest whole inch, that is about 5 ft 7 in.`,
  },
  {
    question: 'How Tall Is 6 Feet in Centimeters?',
    answer: `6 × ${CENTIMETERS_PER_FOOT} = ${formatLength(6 * CENTIMETERS_PER_FOOT)} cm.`,
  },
  {
    question: 'How Many Centimeters Are in 5 Feet 10 Inches?',
    answer: `(5 × ${CENTIMETERS_PER_FOOT}) + (10 × ${CENTIMETERS_PER_INCH}) = ${formatLength(metersToCentimeters(feetInchesToMeters(5, 10)))} cm.`,
  },
  {
    question: 'How Do I Convert Meters to Feet?',
    answer: `Multiply meters by 1 ÷ ${METERS_PER_FOOT} (≈ 3.280839895). Example: 1.8 m ≈ ${formatLength(Number((1.8 / METERS_PER_FOOT).toFixed(6)))} ft.`,
  },
  {
    question: 'What Units Are Used to Measure Height?',
    answer:
      'Height is commonly measured in centimeters, meters, feet, and inches. Metric contexts usually use centimeters or meters; feet and inches are common in the United States.',
  },
];
