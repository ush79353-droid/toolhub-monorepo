import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertImperialField,
  formatImperial,
  imperialGallonsToLiters,
  poundsToKilograms,
  usGallonsToLiters,
} from './calculation';

export const IMPERIAL_TO_METRIC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-imperial', label: 'What Is the Imperial System of Measurement?' },
  { id: 'common-conversions', label: 'Common Conversions from Imperial to Metric' },
  { id: 'length-area-volume', label: 'Length, Area, and Volume' },
  { id: 'temperature', label: 'Imperial to Metric Temperatures' },
  { id: 'weight', label: 'Weight Conversion from Imperial to Metric' },
  { id: 'metric-to-imperial', label: 'Examples of Conversions from Metric to Imperial' },
  { id: 'other-conversions', label: 'Other Conversions Between Measurement Systems' },
  { id: 'conversion-tables', label: 'Conversion Tables' },
  { id: 'related-tools', label: 'Related Calculators' },
  { id: 'imperial-to-metric-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const LENGTH_TABLE = [
  { imperial: '1 inch', metric: '2.54 cm' },
  { imperial: '1 foot', metric: '30.48 cm' },
  { imperial: '1 yard', metric: '0.9144 m' },
  { imperial: '1 mile', metric: '1.609344 km' },
] as const;

export const MASS_TABLE = [
  {
    imperial: '1 oz',
    metric: `${formatImperial(convertImperialField(1, 'mass', 'oz', 'g'), 'mass')} g`,
  },
  {
    imperial: '1 lb',
    metric: `${formatImperial(poundsToKilograms(1), 'mass')} kg`,
  },
  {
    imperial: '1 st',
    metric: `${formatImperial(convertImperialField(1, 'mass', 'st', 'kg'), 'mass')} kg`,
  },
  {
    imperial: '1 US ton',
    metric: `${formatImperial(convertImperialField(1, 'mass', 'shortTon', 'kg'), 'mass')} kg`,
  },
] as const;

export const VOLUME_TABLE = [
  {
    imperial: '1 US gallon',
    metric: `${formatImperial(usGallonsToLiters(1), 'volume')} L`,
  },
  {
    imperial: '1 Imperial gallon',
    metric: `${formatImperial(imperialGallonsToLiters(1), 'volume')} L`,
  },
  {
    imperial: '1 US fl oz',
    metric: `${formatImperial(convertImperialField(1, 'volume', 'usFlOz', 'mL'), 'volume')} mL`,
  },
  {
    imperial: '1 Imperial fl oz',
    metric: `${formatImperial(convertImperialField(1, 'volume', 'impFlOz', 'mL'), 'volume')} mL`,
  },
] as const;

export const IMPERIAL_TO_METRIC_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-imperial',
    title: 'What Is the Imperial System of Measurement?',
    paragraphs: [
      'The British Imperial system is a historical set of units for length, area, volume, and mass. The US customary system is closely related but not identical — especially for liquid volume, where US and Imperial gallons differ.',
      'This converter focuses on everyday Imperial/US customary units and their metric counterparts for length, area, volume, mass, and temperature.',
    ],
  },
  {
    id: 'common-conversions',
    title: 'Common Conversions from Imperial to Metric',
    paragraphs: [
      'Everyday conversions include inches to centimeters, feet to meters, miles to kilometers, pounds to kilograms, gallons to liters, and Fahrenheit to Celsius.',
      'Select the matching category in the calculator, enter any unit, and the compatible metric fields update instantly.',
    ],
  },
  {
    id: 'length-area-volume',
    title: 'Imperial to Metric Conversion of Length, Area, and Volume',
    paragraphs: [
      'Length uses meters as the canonical base (1 in = 0.0254 m, 1 ft = 0.3048 m, 1 mi = 1,609.344 m). Area uses square meters; volume uses liters with separate US and Imperial gallon definitions.',
      `Example: 1 US gallon = ${formatImperial(usGallonsToLiters(1), 'volume')} L, while 1 Imperial gallon = ${formatImperial(imperialGallonsToLiters(1), 'volume')} L.`,
    ],
    formula: '1 in = 2.54 cm\n1 ft = 0.3048 m\n1 mi = 1.609344 km\n1 US gal = 3.785411784 L\n1 Imp. gal = 4.54609 L',
  },
  {
    id: 'temperature',
    title: 'Common Conversions from Imperial to Metric Temperatures',
    paragraphs: [
      'Temperature is not a simple scale factor. Fahrenheit and Celsius share an offset, and Kelvin is the absolute scale used internally.',
      'Absolute zero (0 K) is the lower bound. Values below that are rejected.',
    ],
    formula: 'C = (F − 32) × 5/9\nF = C × 9/5 + 32\nK = C + 273.15',
  },
  {
    id: 'weight',
    title: 'Weight Conversion from Imperial to Metric',
    paragraphs: [
      `Mass conversions use the international avoirdupois pound: 1 lb = ${formatImperial(poundsToKilograms(1), 'mass')} kg.`,
      `Examples: 1 lb ≈ ${formatImperial(poundsToKilograms(1), 'mass')} kg; 10 lb ≈ ${formatImperial(poundsToKilograms(10), 'mass')} kg; 100 lb ≈ ${formatImperial(poundsToKilograms(100), 'mass')} kg.`,
    ],
    formula: 'kg = lb × 0.45359237',
  },
  {
    id: 'metric-to-imperial',
    title: 'Examples of Conversions from Metric to Imperial',
    paragraphs: [
      `100 cm ≈ ${formatImperial(convertImperialField(100, 'length', 'cm', 'in'), 'length')} in.`,
      `5 m ≈ ${formatImperial(convertImperialField(5, 'length', 'm', 'ft'), 'length')} ft.`,
      `10 km ≈ ${formatImperial(convertImperialField(10, 'length', 'km', 'mi'), 'length')} mi.`,
      `50 kg ≈ ${formatImperial(convertImperialField(50, 'mass', 'kg', 'lb'), 'mass')} lb.`,
    ],
  },
  {
    id: 'other-conversions',
    title: 'Other Conversions Between Measurement Systems',
    paragraphs: [
      'Any units that share the same physical dimension can convert through the shared engine — for example feet ↔ meters or pounds ↔ kilograms.',
      'Linear feet cannot become cubic meters: length and volume are different dimensions and require three-dimensional information for volume.',
    ],
  },
  {
    id: 'conversion-tables',
    title: 'Imperial to Metric Conversion Tables',
    paragraphs: [
      'The tables below use the same exact factors as the calculator engine.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Imperial Calculator, Metric Converter, Length Converter, Weight Converter, Volume Conversion, Temperature Conversion, and Hectares to Acres Converter. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const IMPERIAL_TO_METRIC_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Imperial to Metric Length?',
    answer:
      'Use the matching length factor. Example: multiply inches by 2.54 to get centimeters, or use the Length category in this calculator.',
  },
  {
    question: 'How Many Centimeters Are in One Inch?',
    answer: 'Exactly 2.54 centimeters.',
  },
  {
    question: 'How Do I Convert Feet to Meters?',
    answer: 'Multiply feet by 0.3048.',
  },
  {
    question: 'How Do I Convert Miles to Kilometers?',
    answer: 'Multiply miles by 1.609344.',
  },
  {
    question: 'What Is the Conversion Between Pounds and Kilograms?',
    answer: `1 pound = ${formatImperial(poundsToKilograms(1), 'mass')} kilograms.`,
  },
  {
    question: 'How Do I Convert Degrees Fahrenheit into Celsius?',
    answer: 'Subtract 32 from Fahrenheit, then multiply by 5/9.',
  },
  {
    question: 'How Many Liters Are in a Gallon?',
    answer: `A US gallon contains ${formatImperial(usGallonsToLiters(1), 'volume')} liters. An Imperial gallon contains ${formatImperial(imperialGallonsToLiters(1), 'volume')} liters.`,
  },
  {
    question: 'How Much Is 10 Feet in Cubic Meters?',
    answer:
      'Linear feet cannot convert directly into cubic meters — they measure different dimensions. Volume needs three length dimensions (or an existing volume unit).',
  },
  {
    question: 'What Is the Difference Between Imperial and Metric Measurements?',
    answer:
      'Imperial/US customary systems use units such as inches, feet, pounds, and gallons. The metric system uses meters, kilograms, and liters with decimal scaling. US and British Imperial volumes are not always the same.',
  },
];
