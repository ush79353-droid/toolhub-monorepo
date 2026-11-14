import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LENGTH_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-length-converter', label: 'What Is a Length Converter?' },
  { id: 'how-to-use', label: 'How to Use the Length Converter' },
  { id: 'metric-units', label: 'Metric Length Units' },
  { id: 'imperial-units', label: 'Imperial and US Customary Units' },
  { id: 'metric-to-imperial', label: 'Metric to Imperial' },
  { id: 'imperial-to-metric', label: 'Imperial to Metric' },
  { id: 'nautical-units', label: 'Nautical Length Units' },
  { id: 'scientific-astronomical', label: 'Scientific and Astronomical Distances' },
  { id: 'conversion-table', label: 'Common Length Conversion Table' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'length-converter-faq', label: 'Frequently Asked Questions' },
];

export interface LengthTableRow {
  unit: string;
  meters: string;
}

export interface LengthConverterGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly LengthTableRow[];
}

export const LENGTH_CONVERTER_GUIDE_SECTIONS: readonly LengthConverterGuideSection[] = [
  {
    id: 'what-is-length-converter',
    title: 'What Is a Length Converter?',
    paragraphs: [
      'A length converter expresses the same physical distance in different units—meters, feet, miles, nautical miles, or even light-years. Omega Calculators stores one canonical length in meters and derives every other unit from exact conversion factors.',
      'It does not replace surveying or navigation instruments; it only scales a known length between unit systems.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Length Converter',
    paragraphs: [
      'Enter a distance in any of the six fields and choose its unit. The other fields update from the same meter-based measurement. Open Metric or Imperial sections as needed, expand Other units for scientific and nautical equivalents, then copy or reset the results.',
    ],
  },
  {
    id: 'metric-units',
    title: 'Metric Length Units',
    paragraphs: [
      'The metric system scales by powers of ten. One meter is 100 centimeters, 1,000 millimeters, or 0.001 kilometers. Decimeters, decameters, and hectometers fill the intermediate decades when needed.',
    ],
  },
  {
    id: 'imperial-units',
    title: 'Imperial and US Customary Length Units',
    paragraphs: [
      'US customary length uses fixed relationships: 12 inches = 1 foot, 3 feet = 1 yard, 1,760 yards = 1 mile, and 5,280 feet = 1 mile. The international inch is exactly 0.0254 meters, so one foot is exactly 0.3048 meters and one mile is exactly 1,609.344 meters.',
      'Specialized units such as thou (mil), chain, rod, furlong, and fathom appear in surveying, manufacturing, and maritime work.',
    ],
  },
  {
    id: 'metric-to-imperial',
    title: 'Metric to Imperial Length Conversion',
    paragraphs: [
      'Example: 10 m ÷ 0.3048 ≈ 32.8083989501 ft. Five kilometers ÷ 1,609.344 ≈ 3.10685596119 mi. Twelve inches × 0.0254 ÷ 0.01 = 30.48 cm when going the other way from inches into centimeters.',
    ],
    formula: 'ft = m ÷ 0.3048',
  },
  {
    id: 'imperial-to-metric',
    title: 'Imperial to Metric Length Conversion',
    paragraphs: [
      'One mile equals exactly 1.609344 kilometers. One foot equals 0.3048 meters. One inch equals 2.54 centimeters. Convert through meters when chaining several units so rounding does not accumulate.',
    ],
  },
  {
    id: 'nautical-units',
    title: 'Nautical Length Units',
    paragraphs: [
      'A nautical mile is exactly 1,852 meters and is used in marine and aviation navigation. This calculator treats one international cable as one-tenth of a nautical mile (185.2 m). Do not confuse nautical miles with statute miles.',
    ],
  },
  {
    id: 'scientific-astronomical',
    title: 'Scientific and Astronomical Distances',
    paragraphs: [
      'Nanometers, micrometers, picometers, and ångströms describe tiny lengths. Astronomical unit (AU), light-year, and parsec describe solar-system and interstellar distances. A light-year is a distance—how far light travels in a Julian year of 365.25 days at 299,792,458 m/s—not a duration.',
      'One AU is exactly 149,597,870,700 meters. One parsec is (648,000/π) AU by definition.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Common Length Conversion Table',
    paragraphs: ['Selected units and their exact or defined meter equivalents.'],
    table: [
      { unit: '1 cm', meters: '0.01' },
      { unit: '1 in', meters: '0.0254' },
      { unit: '1 ft', meters: '0.3048' },
      { unit: '1 yd', meters: '0.9144' },
      { unit: '1 m', meters: '1' },
      { unit: '1 nmi', meters: '1,852' },
      { unit: '1 mi', meters: '1,609.344' },
      { unit: '1 km', meters: '1,000' },
    ],
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Construction takeoffs, engineering drawings, science labs, classrooms, travel planning, navigation, manufacturing tolerances, and amateur astronomy all mix unit systems. Converting through meters keeps those figures comparable.',
    ],
  },
];

export const LENGTH_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How many centimeters are in one meter?',
    answer: 'There are exactly 100 centimeters in one meter.',
  },
  {
    question: 'How many inches are in one foot?',
    answer: 'There are exactly 12 inches in one foot.',
  },
  {
    question: 'How many feet are in one meter?',
    answer: 'One meter is approximately 3.28083989501 feet (exactly 1 ÷ 0.3048).',
  },
  {
    question: 'How do I convert kilometers to miles?',
    answer: 'Divide kilometers by 1.609344, or multiply by about 0.621371192237.',
  },
  {
    question: 'How many meters are in one mile?',
    answer: 'One international mile equals exactly 1,609.344 meters.',
  },
  {
    question: 'What is the difference between a mile and a nautical mile?',
    answer:
      'A statute mile is 1,609.344 meters. A nautical mile is exactly 1,852 meters and is used in navigation.',
  },
  {
    question: 'How many millimeters are in one inch?',
    answer: 'One inch equals exactly 25.4 millimeters.',
  },
  {
    question: 'How do I convert feet to meters?',
    answer: 'Multiply feet by 0.3048.',
  },
  {
    question: 'What is a light-year?',
    answer:
      'A light-year is the distance light travels in vacuum in one Julian year (365.25 days). It is a unit of length, not time.',
  },
  {
    question: 'Can I convert astronomical distances with this calculator?',
    answer:
      'Yes. Astronomical units, light-years, and parsecs are included in Other units, derived from exact SI definitions.',
  },
];
