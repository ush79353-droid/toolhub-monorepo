import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatVolume, mlToLiters, ML_PER_LITER } from './calculation';

export const MLCC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-volume', label: 'What Is Volume?' },
  { id: 'how-to-convert', label: 'How to Convert mL to cc?' },
  { id: 'conversion-table', label: 'mL to cc Conversion Table' },
  { id: 'how-to-use', label: 'How to Use This Converter' },
  { id: 'related-tools', label: 'Other Related Volume Calculators' },
  { id: 'mlcc-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_ML = [0.1, 0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000] as const;

export const MLCC_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-volume',
    title: 'What Is Volume?',
    paragraphs: [
      'The mL to cc Converter converts between milliliters, liters, and cubic centimeters. Milliliters and cubic centimeters measure the same volume. The tool is useful for laboratory measurements, liquid volume calculations, scientific experiments, engineering measurements, container capacities, and general volume conversions. It does not determine safe medication doses.',
      'Volume is the amount of three-dimensional space occupied by an object or substance.',
      'Common volume units include cubic meters (m³), liters (L), milliliters (mL), and cubic centimeters (cm³ or cc).',
      'A cubic centimeter is the volume of a cube measuring one centimeter on each side.',
      'By definition used here: 1 cm³ = 1 mL = 1 cc.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert mL to cc?',
    paragraphs: [
      'The conversion is exact because the two units are identical measures of volume.',
      'Formula: cc = mL. Example: 100 mL = 100 cc.',
      'Steps: (1) identify the volume in milliliters, (2) use the conversion factor of 1, (3) keep the numerical value unchanged, (4) express the result in cc.',
      `Liters relate by ${ML_PER_LITER.toLocaleString('en-US')} mL = ${ML_PER_LITER.toLocaleString('en-US')} cc = 1 L.`,
    ],
    formula: `cc = mL\n100 mL = 100 cc\n${ML_PER_LITER} mL = ${ML_PER_LITER} cc = 1 L`,
  },
  {
    id: 'conversion-table',
    title: 'mL to cc Conversion Table',
    paragraphs: [
      'Exact conversions using 1 mL = 1 cc and 1 L = 1,000 mL.',
    ],
    tableHeaders: ['Milliliters (mL)', 'Cubic Centimeters (cc)', 'Liters (L)'],
    table: TABLE_ML.map((ml) => [
      formatVolume(ml),
      formatVolume(ml),
      formatVolume(mlToLiters(ml)),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mL to cc Converter',
    paragraphs: [
      '1. Enter the volume in milliliters, liters, or cubic centimeters.',
      '2. The calculator automatically fills the other two units.',
      '3. Edit any field to reverse the conversion.',
      '4. Use Reload calculator or Clear all changes to reset every field.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Volume Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Liter to cc Converter, cc to mL Converter, mL to Cups Converter, Liters to Centiliters Converter, Volume Conversion, and Gallon Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MLCC_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is cc?',
    answer:
      'cc stands for cubic centimeter. One cubic centimeter is the volume of a cube measuring one centimeter along each edge. 1 cc = 1 cm³ = 1 mL.',
  },
  {
    question: 'How Can I Convert mL to cc?',
    answer:
      'The numerical values are identical. For example, 20 mL = 20 cc. No multiplication or division is necessary.',
  },
  {
    question: 'Is 1 mL Equal to 1 cc?',
    answer: 'Yes. 1 mL = 1 cc exactly. The units are equivalent measures of volume.',
  },
  {
    question: 'How Many cc Are in 100 mL?',
    answer: '100 mL = 100 cc.',
  },
  {
    question: 'How Many cc Are in 1 Liter?',
    answer: `One liter contains ${ML_PER_LITER.toLocaleString('en-US')} milliliters. Because each milliliter is one cubic centimeter, 1 L = ${ML_PER_LITER.toLocaleString('en-US')} cc.`,
  },
  {
    question: 'Can Volume Be Negative?',
    answer:
      'Ordinary physical volume cannot be negative because it describes the amount of space occupied. This converter rejects negative inputs.',
  },
  {
    question: 'What Is the SI Unit of Volume?',
    answer:
      'The SI unit of volume is the cubic meter (m³). Liters, milliliters, and cubic centimeters are commonly used units that relate exactly to cubic meters (1 L = 0.001 m³; 1 mL = 1 cm³ = 10⁻⁶ m³).',
  },
];
