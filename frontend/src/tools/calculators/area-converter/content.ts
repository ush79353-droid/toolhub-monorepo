import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AREA_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-area-converter', label: 'What Is an Area Converter?' },
  { id: 'supported-units', label: 'Supported Area Units' },
  { id: 'how-to-use', label: 'How to Use the Area Converter' },
  { id: 'm2-to-ft2', label: 'Square Meters to Square Feet' },
  { id: 'acres-to-hectares', label: 'Acres to Hectares' },
  { id: 'conversion-table', label: 'Area Conversion Table' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'area-converter-faq', label: 'Frequently Asked Questions' },
];

export interface AreaTableRow {
  unit: string;
  squareMeters: string;
}

export interface AreaConverterGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly AreaTableRow[];
}

export const AREA_CONVERTER_GUIDE_SECTIONS: readonly AreaConverterGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This Area Converter switches a single physical surface area among metric, imperial, and land-area units. Enter a value in any of the five fields, pick that field’s unit, and the other fields update from the same measurement expressed in square meters.',
      'It is a unit converter, not a survey. Legal parcels still depend on recorded boundaries and local measurement practice.',
    ],
  },
  {
    id: 'what-is-area-converter',
    title: 'What Is an Area Converter?',
    paragraphs: [
      'Different systems name the same surface with different units. Metric builders often use square meters or hectares; US listings often use square feet or acres. An area converter multiplies and divides by exact factors so those labels stay comparable.',
      'Omega Calculators uses square meters as the internal base. Every other unit is defined by how many square meters one of that unit contains.',
    ],
  },
  {
    id: 'supported-units',
    title: 'Supported Area Units',
    paragraphs: [
      'Metric: square millimeters, square centimeters, square decimeters, square meters, square decameters, square hectometers, and square kilometers.',
      'Imperial and US customary: square inches, square feet, square yards, and square miles.',
      'Land area: ares, decares, hectares, and acres. One are is 100 m²; one hectare is 10,000 m²; one international acre is 4,046.8564224 m².',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Area Converter',
    paragraphs: [
      'Enter a measurement in any field and choose its unit. The other four fields show the same area in their selected units. Change a unit selector to re-express that row without resetting the calculator. Use Copy results for a summary, or Reset to clear all fields and restore the default units.',
    ],
  },
  {
    id: 'm2-to-ft2',
    title: 'How to Convert Square Meters to Square Feet',
    paragraphs: [
      'One square foot is exactly 0.09290304 square meters. Divide square meters by that factor, or multiply by about 10.7639104167.',
      'Example: 10 m² ÷ 0.09290304 ≈ 107.639104167 ft².',
    ],
    formula: 'ft² = m² ÷ 0.09290304',
  },
  {
    id: 'acres-to-hectares',
    title: 'How to Convert Acres to Hectares',
    paragraphs: [
      'Multiply acres by 0.40468564224, which is 4,046.8564224 ÷ 10,000. Example: 5 acres × 0.40468564224 = 2.0234282112 hectares.',
    ],
    formula: 'ha = ac × 0.40468564224',
  },
  {
    id: 'conversion-table',
    title: 'Area Conversion Table',
    paragraphs: ['Each row lists how many square meters equal one of that unit.'],
    table: [
      { unit: '1 cm²', squareMeters: '0.0001' },
      { unit: '1 ft²', squareMeters: '0.09290304' },
      { unit: '1 yd²', squareMeters: '0.83612736' },
      { unit: '1 a', squareMeters: '100' },
      { unit: '1 daa', squareMeters: '1,000' },
      { unit: '1 acre', squareMeters: '4,046.8564224' },
      { unit: '1 hectare', squareMeters: '10,000' },
      { unit: '1 km²', squareMeters: '1,000,000' },
    ],
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Real estate listings, land surveying notes, agricultural planning, construction takeoffs, architecture drawings, and international property comparisons often mix unit systems. Converting through square meters keeps those figures aligned.',
      'When a contract specifies a particular unit, keep that unit as the source of truth and treat other rows as convenience equivalents.',
    ],
  },
];

export const AREA_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between an are and an acre?',
    answer:
      'One are equals 100 square meters. One international acre equals 4,046.8564224 square meters, so one acre equals 40.468564224 ares.',
  },
  {
    question: 'How do I convert square meters to square feet?',
    answer: 'Multiply square meters by approximately 10.7639104167 (or divide by 0.09290304).',
  },
  {
    question: 'How many acres are in one hectare?',
    answer: 'One hectare equals approximately 2.47105381467 acres.',
  },
  {
    question: 'How many square feet are in one acre?',
    answer: 'One acre equals exactly 43,560 square feet.',
  },
  {
    question: 'How many square yards are in one acre?',
    answer: 'One acre equals exactly 4,840 square yards.',
  },
  {
    question: 'How many square meters are in one acre?',
    answer: 'One acre equals exactly 4,046.8564224 square meters.',
  },
  {
    question: 'What is 50 m² in square yards?',
    answer: '50 ÷ 0.83612736 ≈ 59.799502315 square yards.',
  },
  {
    question: 'Can I convert between metric and imperial area units?',
    answer:
      'Yes. The calculator supports both systems using square meters as the internal reference unit.',
  },
];
