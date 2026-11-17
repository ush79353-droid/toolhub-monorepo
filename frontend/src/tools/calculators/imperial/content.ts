import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  celsiusToFahrenheit,
  convertImperialField,
  formatImperial,
  imperialGallonsToLiters,
  inchesToFeet,
  poundsToKilograms,
  usGallonsToLiters,
} from './calculation';

export const IMPERIAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert Imperial Units' },
  { id: 'length-conversions', label: 'Common Imperial Length Conversions' },
  { id: 'area-conversions', label: 'Imperial Area Conversions' },
  { id: 'volume-conversions', label: 'Imperial Volume Conversions' },
  { id: 'mass-conversions', label: 'Imperial Mass and Weight Conversions' },
  { id: 'temperature-conversions', label: 'Fahrenheit and Celsius Conversion' },
  { id: 'conversion-tables', label: 'Imperial Conversion Tables' },
  { id: 'related-tools', label: 'Other Related Calculators' },
  { id: 'imperial-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const LENGTH_TABLE = [
  { from: '1 in', to: `${formatImperial(2.54, 'length')} cm` },
  { from: '1 ft', to: `${formatImperial(0.3048, 'length')} m` },
  { from: '1 yd', to: `${formatImperial(0.9144, 'length')} m` },
  { from: '1 mi', to: `${formatImperial(1.609344, 'length')} km` },
  {
    from: '12 in',
    to: `${formatImperial(inchesToFeet(12), 'length')} ft`,
  },
] as const;

export const AREA_TABLE = [
  {
    from: '1 ft²',
    to: `${formatImperial(convertImperialField(1, 'area', 'ft2', 'm2'), 'area')} m²`,
  },
  {
    from: '1 acre',
    to: `${formatImperial(convertImperialField(1, 'area', 'ac', 'm2'), 'area')} m²`,
  },
  {
    from: '1 mi²',
    to: `${formatImperial(convertImperialField(1, 'area', 'mi2', 'km2'), 'area')} km²`,
  },
] as const;

export const VOLUME_TABLE = [
  {
    from: '1 US gal',
    to: `${formatImperial(usGallonsToLiters(1), 'volume')} L`,
  },
  {
    from: '1 Imp. gal',
    to: `${formatImperial(imperialGallonsToLiters(1), 'volume')} L`,
  },
  {
    from: '1 ft³',
    to: `${formatImperial(convertImperialField(1, 'volume', 'ft3', 'usLiquidGal'), 'volume')} US gal`,
  },
] as const;

export const MASS_TABLE = [
  {
    from: '1 lb',
    to: `${formatImperial(poundsToKilograms(1), 'mass')} kg`,
  },
  {
    from: '1 st',
    to: `${formatImperial(convertImperialField(1, 'mass', 'st', 'lb'), 'mass')} lb`,
  },
  {
    from: '1 US ton',
    to: `${formatImperial(convertImperialField(1, 'mass', 'shortTon', 'lb'), 'mass')} lb`,
  },
  {
    from: '1 UK ton',
    to: `${formatImperial(convertImperialField(1, 'mass', 'longTon', 'lb'), 'mass')} lb`,
  },
] as const;

export const TEMP_TABLE = [
  {
    from: '0°C',
    to: `${formatImperial(celsiusToFahrenheit(0), 'temperature')} °F`,
  },
  {
    from: '100°C',
    to: `${formatImperial(celsiusToFahrenheit(100), 'temperature')} °F`,
  },
  {
    from: '32°F',
    to: `${formatImperial(convertImperialField(32, 'temperature', 'fahrenheit', 'celsius'), 'temperature')} °C`,
  },
  {
    from: '0°C',
    to: `${formatImperial(convertImperialField(0, 'temperature', 'celsius', 'kelvin'), 'temperature')} K`,
  },
] as const;

export const IMPERIAL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert Imperial Units',
    paragraphs: [
      '1. Choose Length, Area, Volume, Mass / Weight, or Temperature.',
      '2. Expand the Imperial/US or Metric group you need.',
      '3. Enter a value in any field — compatible units update instantly.',
      '4. Edit another field to convert in reverse. Switching category clears values so dimensions never mix.',
    ],
  },
  {
    id: 'length-conversions',
    title: 'Common Imperial Length Conversions',
    paragraphs: [
      'International length factors are exact: 1 inch = 0.0254 m, 1 foot = 0.3048 m, 1 yard = 0.9144 m, and 1 mile = 1,609.344 m.',
      'Within customary units: 1 ft = 12 in, 1 yd = 3 ft, and 1 mi = 5,280 ft.',
    ],
    formula: '1 ft = 12 in\n1 yd = 3 ft\n1 mi = 5,280 ft\n1 in = 2.54 cm\n1 ft = 0.3048 m',
  },
  {
    id: 'area-conversions',
    title: 'Imperial Area Conversions',
    paragraphs: [
      'Area uses square meters as the canonical base. Square feet, yards, acres, and square miles convert through exact international factors.',
    ],
    formula: '1 ft² = 0.09290304 m²\n1 acre = 4,046.8564224 m²',
  },
  {
    id: 'volume-conversions',
    title: 'Imperial Volume Conversions',
    paragraphs: [
      'US customary and British Imperial liquid units are not interchangeable. This calculator keeps US gallons and Imperial gallons as separate fields.',
      `1 US gallon = ${formatImperial(usGallonsToLiters(1), 'volume')} liters. 1 Imperial gallon = ${formatImperial(imperialGallonsToLiters(1), 'volume')} liters.`,
    ],
    formula: '1 US gal = 3.785411784 L\n1 Imperial gal = 4.54609 L',
  },
  {
    id: 'mass-conversions',
    title: 'Imperial Mass and Weight Conversions',
    paragraphs: [
      'This category converts mass, not force. The international avoirdupois pound is exactly 0.45359237 kg.',
      '1 stone = 14 lb, 1 US short ton = 2,000 lb, and 1 UK long ton = 2,240 lb.',
    ],
    formula: '1 lb = 0.45359237 kg\n1 st = 14 lb\n1 US ton = 2,000 lb\n1 UK long ton = 2,240 lb',
  },
  {
    id: 'temperature-conversions',
    title: 'Fahrenheit and Celsius Conversion',
    paragraphs: [
      'Temperature uses offset formulas with Kelvin as the internal base. Absolute zero (0 K) is the lower bound.',
      `Example: 100°C = ${formatImperial(celsiusToFahrenheit(100), 'temperature')}°F.`,
    ],
    formula: 'C = (F − 32) × 5/9\nF = C × 9/5 + 32\nK = C + 273.15',
  },
  {
    id: 'conversion-tables',
    title: 'Imperial Conversion Tables',
    paragraphs: [
      'The tables below are generated from the same conversion engine used by the calculator.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Area Converter, Volume Conversion, Weight Converter, Temperature Conversion, Feet Converter, and Hectares to Acres Converter. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const IMPERIAL_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is the Imperial Measurement System?',
    answer:
      'The British Imperial system is a historical measurement system used in the United Kingdom and related contexts. The US customary system is related but not identical — especially for liquid volume, where US and Imperial gallons differ.',
  },
  {
    question: 'How Many Inches Are in One Foot?',
    answer: '1 foot = 12 inches.',
  },
  {
    question: 'How Many Feet Are in One Yard?',
    answer: '1 yard = 3 feet.',
  },
  {
    question: 'How Many Feet Are in One Mile?',
    answer: '1 mile = 5,280 feet.',
  },
  {
    question: 'How Many Centimeters Are in 10 Inches?',
    answer: `10 × 2.54 = ${formatImperial(convertImperialField(10, 'length', 'in', 'cm'), 'length')}. So 10 inches = 25.4 centimeters.`,
  },
  {
    question: 'How Do I Convert Cubic Feet to US Gallons?',
    answer: `Multiply by about ${formatImperial(convertImperialField(1, 'volume', 'ft3', 'usLiquidGal'), 'volume')}. 1 ft³ ≈ 7.48051948 US gallons.`,
  },
  {
    question: 'Are US and Imperial Gallons the Same?',
    answer: `No. 1 US gallon = ${formatImperial(usGallonsToLiters(1), 'volume')} liters. 1 Imperial gallon = ${formatImperial(imperialGallonsToLiters(1), 'volume')} liters.`,
  },
  {
    question: 'What Is the Difference Between a US Ton and a Metric Tonne?',
    answer: `1 US short ton = ${formatImperial(convertImperialField(1, 'mass', 'shortTon', 'kg'), 'mass')} kilograms. 1 metric tonne = 1,000 kilograms.`,
  },
  {
    question: 'How Do I Convert Fahrenheit to Celsius?',
    answer: 'Subtract 32 from the Fahrenheit value, then multiply by 5/9. Example: (212 − 32) × 5/9 = 100°C.',
  },
  {
    question: 'Can I Convert Different Types of Measurements?',
    answer:
      'Yes, when the units share the same physical dimension — feet to meters, pounds to kilograms, or Fahrenheit to Celsius. Feet cannot convert directly to kilograms.',
  },
];
