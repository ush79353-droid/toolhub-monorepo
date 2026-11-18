import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatLength, WRENCH_CHART } from './calculation';
import { convertLength } from './units';

export const METRIC_TO_SAE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-sae', label: 'What Is the SAE System?' },
  { id: 'calculate-conversion', label: 'Calculate the Conversion From Metric to SAE' },
  { id: 'conversion-chart', label: 'Metric to SAE Conversion Chart' },
  { id: 'wrench-size-chart', label: 'The Metric to SAE Wrench Size Chart' },
  { id: 'how-to-use', label: 'How to Use the Metric to SAE Calculator' },
  { id: 'metric-vs-sae', label: 'Metric vs. SAE: Key Differences' },
  { id: 'metric-to-sae-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  callout?: string;
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
  }[];
}

const LENGTH_CHART: readonly { label: string; from: 'mm' | 'm' | 'km'; value: number; to: 'in' | 'ft' | 'yd' | 'mi' }[] = [
  { label: '1 mm', from: 'mm', value: 1, to: 'in' },
  { label: '5 mm', from: 'mm', value: 5, to: 'in' },
  { label: '10 mm', from: 'mm', value: 10, to: 'in' },
  { label: '12.7 mm', from: 'mm', value: 12.7, to: 'in' },
  { label: '25.4 mm', from: 'mm', value: 25.4, to: 'in' },
  { label: '50.8 mm', from: 'mm', value: 50.8, to: 'in' },
  { label: '100 mm', from: 'mm', value: 100, to: 'in' },
  { label: '1 m', from: 'm', value: 1, to: 'ft' },
  { label: '10 m', from: 'm', value: 10, to: 'yd' },
  { label: '1 km', from: 'km', value: 1, to: 'mi' },
];

export const METRIC_TO_SAE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-sae',
    title: 'What Is the SAE System?',
    paragraphs: [
      'SAE stands for Society of Automotive Engineers, now known as SAE International. In workshops and parts catalogs, “SAE” is commonly used as a label for inch-based tools and fastener sizes rather than as a complete SI-style measurement system.',
      'Metric length uses millimeters, centimeters, meters, and kilometers. US customary and imperial length units commonly include inches, feet, yards, and miles. Automotive and mechanical work often mixes both metric and SAE-sized components.',
      'US customary and British imperial systems are not identical for every quantity, but the standard length units in this calculator share the same internationally defined values (for example, 1 inch = 25.4 mm exactly).',
    ],
  },
  {
    id: 'calculate-conversion',
    title: 'Calculate the Conversion From Metric to SAE',
    paragraphs: [
      'Convert through exact factors. Millimeters to inches: inches = millimeters ÷ 25.4 (example: 25.4 mm = 1 in). Centimeters to inches: inches = centimeters ÷ 2.54. Meters to feet: feet = meters ÷ 0.3048. Kilometers to miles: miles = kilometers ÷ 1.609344.',
      'Reverse (SAE to metric): millimeters = inches × 25.4; meters = feet × 0.3048. The calculator applies these factors through a shared meter base so all eight fields stay consistent.',
    ],
    formula:
      'in = mm ÷ 25.4  ·  ft = m ÷ 0.3048  ·  mi = km ÷ 1.609344  ·  mm = in × 25.4',
  },
  {
    id: 'conversion-chart',
    title: 'Metric to SAE Conversion Chart',
    paragraphs: [
      'General length equivalents (rounded for readability). This table is separate from the wrench size comparison below.',
    ],
    tableHeaders: ['Metric', 'SAE / US customary equivalent'],
    table: LENGTH_CHART.map((row) => {
      const converted = convertLength(row.value, row.from, row.to);
      const symbol = row.to;
      return [row.label, `${formatLength(converted)} ${symbol}`];
    }),
  },
  {
    id: 'wrench-size-chart',
    title: 'The Metric to SAE Wrench Size Chart',
    paragraphs: [
      'Metric wrenches are labeled in millimeters; SAE wrenches and sockets are often labeled in fractional inches. Nearby sizes can look interchangeable on a chart but still differ by tenths of a millimeter.',
      'Convert millimeters to inches (÷ 25.4), then compare with standard fractional sizes. Near matches can round corners or slip under torque — always use the specified tool size.',
    ],
    tableHeaders: ['Metric (mm)', 'SAE fraction', 'SAE size (mm)', 'Difference'],
    table: WRENCH_CHART.map((row) => [
      `${row.metricMm} mm`,
      row.saeFraction,
      `${formatLength(row.saeMm)} mm`,
      `${formatLength(row.differenceMm)} mm`,
    ]),
    callout:
      'Metric and SAE wrench sizes may be close without being identical. Using an incorrectly sized wrench or socket can damage fasteners or cause slipping. Always use the correctly specified tool size, especially for high-torque applications.',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Metric to SAE Calculator',
    paragraphs: [
      '1. Open the Metric to SAE Calculator.',
      '2. Enter a measurement into any of the eight metric or SAE fields.',
      '3. Read the converted measurements automatically in every other field.',
      '4. Expand or collapse the Metric and SAE groups as needed.',
      '5. Consult the wrench chart when comparing tool sizes — it is a reference, not a substitution guarantee.',
      '6. Share or clear the result when finished.',
    ],
  },
  {
    id: 'metric-vs-sae',
    title: 'Metric vs. SAE: Key Differences',
    paragraphs: [
      'The systems use different naming and scaling conventions, but lengths convert exactly with standardized definitions.',
    ],
    tableHeaders: ['Feature', 'Metric', 'SAE / inch-based'],
    table: [
      ['Common length units', 'mm, cm, m, km', 'in, ft, yd, mi'],
      ['Main scaling', 'Decimal (powers of ten)', 'Mixed relationships (12 in = 1 ft, etc.)'],
      ['Common wrench labels', '10 mm, 13 mm, 19 mm', '3/8 in, 1/2 in, 3/4 in'],
      ['Typical use', 'International applications', 'US and legacy equipment'],
      ['Measurement basis', 'SI definitions', 'Standardized inch-based units'],
    ],
  },
];

export const METRIC_TO_SAE_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I Use a Metric Wrench on an SAE Bolt?',
    answer:
      'Sometimes sizes are close, but they are not automatically interchangeable. Prefer the correctly specified wrench or socket.',
  },
  {
    question: 'How Do I Convert Millimeters to SAE Inches?',
    answer: 'Divide millimeters by 25.4. Example: 12.7 ÷ 25.4 = 0.5 in.',
  },
  {
    question: 'What Is 13 mm in SAE?',
    answer:
      '13 mm is approximately 0.5118 inches. A 1/2-inch wrench is 12.7 mm — close but not exactly equivalent.',
  },
  {
    question: 'What Is 10 mm in SAE?',
    answer:
      '10 mm is approximately 0.3937 inches. A 3/8-inch wrench measures 9.525 mm, so the sizes are not identical.',
  },
  {
    question: 'What Is the Difference Between Metric and SAE Tools?',
    answer:
      'Metric tools are labeled in millimeters, while SAE wrench and socket sizes are commonly labeled in fractional inches.',
  },
  {
    question: 'How Do I Convert SAE Inches to Millimeters?',
    answer: 'Multiply inches by 25.4. Example: 0.75 × 25.4 = 19.05 mm.',
  },
  {
    question: 'What SAE Size Is Closest to 19 mm?',
    answer:
      '3/4 inch equals 19.05 mm, a difference of 0.05 mm. Confirm the required fastener specification before substituting tools.',
  },
  {
    question: 'Is SAE the Same as Imperial?',
    answer:
      'Not exactly. SAE refers to engineering standards and is commonly used to describe inch-based tools, while imperial describes a broader system of measurement.',
  },
];
