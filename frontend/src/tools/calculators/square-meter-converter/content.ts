import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertArea, formatArea } from './calculation';

export const M2_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Square Meter Converter' },
  { id: 'calculating', label: 'Calculating Square Meters Into Different Units' },
  { id: 'm2-to-m3', label: 'How to Convert Square Meters to Cubic Meters' },
  { id: 'linear-to-m2', label: 'How to Convert Linear Meters to Square Meters' },
  { id: 'm2-to-ft2', label: 'How to Convert 1 Square Meter to Square Feet' },
  { id: 'how-to-use', label: 'How to Use the Square Meter Converter' },
  { id: 'related-tools', label: 'Check Out Our Other Area Tools' },
  { id: 'm2-converter-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const M2_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Square Meter Converter',
    paragraphs: [
      'Convert area measurements between metric, imperial, and US customary units with square meters (m²) as the reference. Use it for rooms, construction, flooring, land measurement, property calculations, architecture, interior design, and agriculture.',
      'Enter a value in square meters, square feet, or any other supported unit — equivalents update automatically across all fields.',
    ],
  },
  {
    id: 'calculating',
    title: 'Calculating Square Meters Into Different Units',
    paragraphs: [
      'Square meters measure area, not length or volume. A square meter is the area of a square measuring one meter on each side: 1 m² = 1 m × 1 m.',
      'General conversion: Converted Area = Original Area × Conversion Factor, where the factor depends on the destination unit.',
      'The table below shows the equivalent of 1 m² in common area units, generated from the same conversion engine as the calculator.',
    ],
    formula: '1 m² = 1 m × 1 m\nConverted Area = Original Area × Conversion Factor',
    tableHeaders: ['Conversion', 'Value'],
    table: [
      ['m² to ft²', formatArea(convertArea(1, 'm2', 'ft2'))],
      ['m² to in²', formatArea(convertArea(1, 'm2', 'in2'))],
      ['m² to yd²', formatArea(convertArea(1, 'm2', 'yd2'))],
      ['m² to cm²', formatArea(convertArea(1, 'm2', 'cm2'))],
      ['m² to mm²', formatArea(convertArea(1, 'm2', 'mm2'))],
      ['m² to km²', formatArea(convertArea(1, 'm2', 'km2'))],
      ['m² to acres', formatArea(convertArea(1, 'm2', 'acre'))],
      ['m² to hectares', formatArea(convertArea(1, 'm2', 'hectare'))],
      ['m² to mi²', formatArea(convertArea(1, 'm2', 'mi2'))],
    ],
  },
  {
    id: 'm2-to-m3',
    title: 'How to Convert Square Meters to Cubic Meters',
    paragraphs: [
      'Area and volume are different physical quantities. Square meters measure two-dimensional area; cubic meters measure three-dimensional volume.',
      'A conversion from m² to m³ requires a third dimension such as height, thickness, or depth.',
      'Formula: V = A × h, where V is volume in cubic meters, A is area in square meters, and h is height or depth in meters.',
      'Example: a concrete slab with area 20 m² and thickness 0.15 m has volume 20 × 0.15 = 3 m³.',
      'This section is educational only — the main calculator remains an area converter and does not treat m² and m³ as interchangeable.',
    ],
    formula: 'V = A × h\n20 m² × 0.15 m = 3 m³',
  },
  {
    id: 'linear-to-m2',
    title: 'How to Convert Linear Meters to Square Meters',
    paragraphs: [
      'A meter measures length; a square meter measures area. A single linear measurement cannot determine area without another dimension.',
      'Formula: A = L × W, where A is area in m², L is length in meters, and W is width in meters.',
      'Example: a room 6 m by 4 m has area 6 × 4 = 24 m².',
      'The main converter handles established area measurements, not dimensional calculations from length alone.',
    ],
    formula: 'A = L × W\n6 m × 4 m = 24 m²',
  },
  {
    id: 'm2-to-ft2',
    title: 'How to Convert 1 Square Meter to Square Feet',
    paragraphs: [
      `Exact relationship from the international foot: 1 m² = ${formatArea(convertArea(1, 'm2', 'ft2'))} ft².`,
      `Formula: ft² = m² × ${formatArea(convertArea(1, 'm2', 'ft2'))}.`,
      `Example — convert 25 m²: 25 × ${formatArea(convertArea(1, 'm2', 'ft2'))} ≈ ${formatArea(convertArea(25, 'm2', 'ft2'))}. Therefore 25 m² ≈ ${formatArea(convertArea(25, 'm2', 'ft2'))} ft².`,
      `Reverse: m² = ft² × 0.09290304. Example: 100 × 0.09290304 = ${formatArea(convertArea(100, 'ft2', 'm2'))}. Therefore 100 ft² = ${formatArea(convertArea(100, 'ft2', 'm2'))} m².`,
    ],
    formula: `1 m² = ${formatArea(convertArea(1, 'm2', 'ft2'))} ft²\nft² = m² × ${formatArea(convertArea(1, 'm2', 'ft2'))}\nm² = ft² × 0.09290304`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Square Meter Converter',
    paragraphs: [
      '1. Enter the area measurement in the Square meters field.',
      '2. View the equivalent area in square feet.',
      '3. Expand Other Area Units to view additional conversions.',
      '4. Enter a value into any supported unit to perform reverse or cross-unit conversions.',
      '5. Review the automatically updated values.',
      '6. Share the result if required.',
      '7. Reload or clear the calculator to start again.',
      'The converter supports real-time changes without requiring a calculate button.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Check Out Our Other Area Tools',
    paragraphs: [
      'Related Omega Calculators area tools include the Area Converter, Square Feet Converter, Square Feet to Acres Calculator, Square Inch to Square Foot Converter, Acres to Square Feet Converter, Hectares to Acres Converter, Square Centimeters to Square Millimeters Converter, and Square Kilometers to Acres Conversion. Only catalog tools that exist on this site appear as links below.',
    ],
  },
];

export const M2_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Square Feet Are in One Square Meter?',
    answer: `One square meter equals approximately ${formatArea(convertArea(1, 'm2', 'ft2'))} square feet. Multiply the measurement in square meters by ${formatArea(convertArea(1, 'm2', 'ft2'))} to obtain square feet.`,
  },
  {
    question: 'How Do I Convert Square Feet to Square Meters?',
    answer: `Multiply square feet by 0.09290304. Example: 200 × 0.09290304 = ${formatArea(convertArea(200, 'ft2', 'm2'))}. Therefore 200 ft² = ${formatArea(convertArea(200, 'ft2', 'm2'))} m².`,
  },
  {
    question: 'How Many Square Centimeters Are in One Square Meter?',
    answer:
      'There are exactly 10,000 square centimeters in one square meter. Since 1 m = 100 cm, 1 m² = 100² = 10,000 cm².',
  },
  {
    question: 'How Many Square Millimeters Are in One Square Meter?',
    answer:
      'There are exactly 1,000,000 square millimeters in one square meter: 1 m² = 1,000,000 mm².',
  },
  {
    question: 'How Many Square Meters Are in One Acre?',
    answer: `One international acre equals approximately ${formatArea(convertArea(1, 'acre', 'm2'))} square meters.`,
  },
  {
    question: 'How Many Square Meters Are in One Hectare?',
    answer: 'One hectare equals exactly 10,000 square meters.',
  },
  {
    question: 'Can I Convert Square Meters Directly to Cubic Meters?',
    answer:
      'No. Square meters measure area, while cubic meters measure volume. You must know the height, thickness, or depth to calculate cubic meters (V = A × h).',
  },
  {
    question: 'How Do I Calculate the Square Meters of a Room?',
    answer:
      'Multiply the room’s length by its width, both measured in meters. Example: 5 m × 4 m = 20 m². A room measuring 5 m by 4 m covers 20 square meters.',
  },
];
