import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertLength, formatLength, fromMeters } from './calculation';

export const METER_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-meter', label: 'What Is a Meter?' },
  { id: 'meters-to-metric', label: 'How to Convert Meters to Other Metric Units' },
  { id: 'meters-to-imperial', label: 'Meters to Imperial and US Units' },
  { id: 'other-measurement-systems', label: 'Calculating Meter Conversions to Other Measurement Systems' },
  { id: 'how-to-use', label: 'How to Use the Meter Converter' },
  { id: 'related-length-tools', label: 'Related Length Conversion Tools' },
  { id: 'meter-converter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const METER_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-meter',
    title: 'What Is a Meter?',
    paragraphs: [
      'The meter (symbol m) is the SI base unit of length. It anchors the metric system for everyday distances, engineering drawings, and scientific work.',
      'Since 1983 the meter has been defined by the speed of light in vacuum: one meter is the distance light travels in 1/299,792,458 of a second.',
      'That definition keeps the meter stable worldwide. Measuring tape markings, map scales, and laboratory instruments all refer back to the same SI meter.',
      'Simple examples: a doorway is often about 2 m tall; a sprint lane is 100 m; a kilometer is 1,000 m.',
    ],
  },
  {
    id: 'meters-to-metric',
    title: 'How to Convert Meters to Other Metric Units',
    paragraphs: [
      'Metric prefixes scale the meter by powers of ten. Moving three places left or right multiplies or divides by 1,000.',
      `Example: 1 m = ${formatLength(fromMeters(1, 'mm'))} mm, and 1 m = ${formatLength(fromMeters(1, 'km'))} km.`,
      `Another example: 2.5 m = ${formatLength(convertLength(2.5, 'm', 'mm'))} mm.`,
      'This converter also exposes hectometers, decameters, decimeters, micrometers, nanometers, and picometers through the Other metric units selector.',
    ],
    formula: 'target = meters / (meters per target unit)',
    tableHeaders: ['Unit', 'Symbol', 'From 1 meter'],
    table: [
      ['Kilometer', 'km', formatLength(fromMeters(1, 'km'))],
      ['Hectometer', 'hm', formatLength(fromMeters(1, 'hm'))],
      ['Decameter', 'dam', formatLength(fromMeters(1, 'dam'))],
      ['Decimeter', 'dm', formatLength(fromMeters(1, 'dm'))],
      ['Centimeter', 'cm', formatLength(fromMeters(1, 'cm'))],
      ['Millimeter', 'mm', formatLength(fromMeters(1, 'mm'))],
      ['Micrometer', 'µm', formatLength(fromMeters(1, 'um'))],
      ['Nanometer', 'nm', formatLength(fromMeters(1, 'nm'))],
    ],
  },
  {
    id: 'meters-to-imperial',
    title: 'Convert Meters to Imperial and US Units',
    paragraphs: [
      'US customary and imperial length units use internationally fixed relationships to the meter. One inch is exactly 0.0254 m, so the foot (12 in) is exactly 0.3048 m and the yard (3 ft) is exactly 0.9144 m. One statute mile is exactly 1,609.344 m.',
      `Therefore 1 m ≈ ${formatLength(fromMeters(1, 'ft'))} ft, ${formatLength(fromMeters(1, 'in'))} in, and ${formatLength(fromMeters(1, 'yd'))} yd.`,
      `Worked example; convert 5 meters to feet: Feet = 5 × ${formatLength(fromMeters(1, 'ft'))} ≈ ${formatLength(convertLength(5, 'm', 'ft'))} ft.`,
      'Additional imperial options include thou/mil, furlong, chain, rod, and the league defined as three statute miles.',
    ],
    formula: '1 m = 3.280839895013123 ft = 39.37007874015748 in',
  },
  {
    id: 'other-measurement-systems',
    title: 'How to Calculate Meter Conversions to Other Measurement Systems',
    paragraphs: [
      'Any length conversion is the same ratio of meters: convert the source into meters, then divide by the meters-per-unit of the target.',
      `Statute miles: 1 m ≈ ${formatLength(fromMeters(1, 'mi'))} mi. Nautical miles use the exact definition 1 nmi = 1,852 m.`,
      'Astronomical unit, light-year (Julian year × speed of light), IAU nominal solar radius, ångström, and parsec cover specialized science and navigation contexts.',
      'Use specialized units when the magnitude would otherwise be awkward in meters, for example, interplanetary distances in AU or atomic spacings in ångströms.',
    ],
    formula: 'converted = input × meters_per_source / meters_per_target',
  },
  {
    id: 'how-to-use',
    title: "How to Use Omega's Meter Converter",
    paragraphs: [
      '1. Enter a value in meters or another supported unit.',
      '2. Watch the other fields update automatically.',
      '3. Expand Metric, Imperial/US, or Other unit groups as needed.',
      '4. Choose an additional unit from a group’s selector to show that field.',
      '5. Edit any visible measurement to convert in reverse.',
      '6. Share, reload, or clear when you are finished.',
    ],
  },
  {
    id: 'related-length-tools',
    title: 'More Than Calculating Meter Conversions',
    paragraphs: [
      'Related Omega Calculators pages include Length Converter, Measurement Converter, Angstrom to nm Converter, Feet to Inches Calculator, and Decimeter to Meter Converter. Only active catalog tools appear as live site links.',
    ],
  },
];

export const METER_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Meters to Millimeters?',
    answer: `Millimeters = Meters × 1,000. Example: 2.5 m = ${formatLength(convertLength(2.5, 'm', 'mm'))} mm.`,
  },
  {
    question: 'How Much Is 10 Inches in Meters?',
    answer: `1 inch = 0.0254 m exactly, so 10 inches = ${formatLength(convertLength(10, 'in', 'm'))} m.`,
  },
  {
    question: 'What Is the Difference Between a Meter and a Foot?',
    answer: `They are different length units. 1 meter ≈ ${formatLength(fromMeters(1, 'ft'))} feet, and 1 foot = 0.3048 meter exactly.`,
  },
  {
    question: 'How Many Centimeters Are in One Meter?',
    answer: '1 meter = 100 centimeters.',
  },
  {
    question: 'How Many Feet Are in 5 Meters?',
    answer: `5 meters ≈ ${formatLength(convertLength(5, 'm', 'ft'))} feet.`,
  },
  {
    question: 'How Do I Convert Meters to Kilometers?',
    answer: `Kilometers = Meters / 1,000. Example: 2,500 m = ${formatLength(convertLength(2500, 'm', 'km'))} km.`,
  },
  {
    question: 'How Many Inches Are in 2 Meters?',
    answer: `2 meters ≈ ${formatLength(convertLength(2, 'm', 'in'))} inches.`,
  },
  {
    question: 'Is a Meter the Same as a Yard?',
    answer: `No. They are different units. 1 meter ≈ ${formatLength(fromMeters(1, 'yd'))} yards, and 1 yard = 0.9144 meter exactly.`,
  },
];
