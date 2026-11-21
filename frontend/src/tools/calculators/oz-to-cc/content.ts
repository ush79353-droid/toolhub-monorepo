import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  CC_PER_UK_FL_OZ,
  CC_PER_US_FL_OZ,
  ccToFluidOunces,
  fluidOuncesToCc,
  formatVolume,
} from './calculation';

export const OZ_TO_CC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'oz to cc Converter' },
  { id: 'what-is-volume', label: 'What Is Volume?' },
  { id: 'cc-to-oz', label: 'How to Convert cc to oz' },
  { id: 'oz-to-cc', label: 'How to Convert oz to cc' },
  { id: 'conversion-table', label: 'Fluid Ounces to cc Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the oz to cc Converter' },
  { id: 'related-tools', label: 'Other Related Volume Conversion Calculators' },
  { id: 'oz-to-cc-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_FL_OZ = [1, 2, 4, 5, 8, 10, 12, 16, 20, 32, 50, 100] as const;

function tableCc(amount: number, system: 'us' | 'uk'): string {
  return Number(fluidOuncesToCc(amount, system).toFixed(4)).toString();
}

export const OZ_TO_CC_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'oz to cc Converter',
    paragraphs: [
      'Convert fluid ounces (fl oz) to cubic centimeters (cc) and back. Choose US customary or UK imperial fluid ounces: the factors differ.',
      'Useful for cooking and recipes, liquid packaging, laboratory volume checks, and customary ↔ metric volume work. This tool converts volume only; not mass ounces.',
    ],
  },
  {
    id: 'what-is-volume',
    title: 'What Is Volume?',
    paragraphs: [
      'Volume is the three-dimensional space occupied by a substance or object. Common volume units include cubic centimeters (cc), milliliters (mL), liters (L), and fluid ounces (fl oz).',
      'Exactly 1 cc = 1 mL. Fluid ounces measure liquid volume; an avoirdupois ounce measures mass and cannot convert to cc without density.',
    ],
    formula: '1 cc = 1 mL',
  },
  {
    id: 'cc-to-oz',
    title: 'How to Convert cc to oz',
    paragraphs: [
      `US: US fl oz = cc ÷ ${CC_PER_US_FL_OZ}. Example; 100 cc ≈ ${formatVolume(ccToFluidOunces(100, 'us'))} US fl oz.`,
      `UK: UK fl oz = cc ÷ ${CC_PER_UK_FL_OZ}. Example; 100 cc ≈ ${formatVolume(ccToFluidOunces(100, 'uk'))} UK fl oz.`,
      'A US fluid ounce is slightly larger than a UK imperial fluid ounce.',
    ],
    formula: `US fl oz = cc ÷ ${CC_PER_US_FL_OZ}\nUK fl oz = cc ÷ ${CC_PER_UK_FL_OZ}`,
  },
  {
    id: 'oz-to-cc',
    title: 'How to Convert oz to cc',
    paragraphs: [
      `US: cc = US fl oz × ${CC_PER_US_FL_OZ}. Example; 5 US fl oz = ${formatVolume(fluidOuncesToCc(5, 'us'))} cc.`,
      `UK: cc = UK fl oz × ${CC_PER_UK_FL_OZ}. Example; 5 UK fl oz = ${formatVolume(fluidOuncesToCc(5, 'uk'))} cc.`,
    ],
    formula: `cc = US fl oz × ${CC_PER_US_FL_OZ}\ncc = UK fl oz × ${CC_PER_UK_FL_OZ}`,
  },
  {
    id: 'conversion-table',
    title: 'Fluid Ounces to cc Conversion Table',
    paragraphs: [
      'Values generated from the exact US and UK factors; cubic centimeters shown to four decimal places.',
    ],
    tableHeaders: ['Fluid Ounces', 'US fl oz to cc', 'UK fl oz to cc'],
    table: TABLE_FL_OZ.map((oz) => [
      formatVolume(oz),
      tableCc(oz, 'us'),
      tableCc(oz, 'uk'),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the oz to cc Converter',
    paragraphs: [
      '1. Enter a volume in fluid ounces.',
      '2. Select US or UK fluid ounces.',
      '3. Read the corresponding volume in cc.',
      '4. Alternatively, enter the cc value.',
      '5. The fluid-ounce result updates automatically for the selected system.',
      '6. Use Reload (restores 1 US fl oz), Clear, and Share as needed.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Volume Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Conversion, mL to oz Converter, CC to OZ Converter, Cups to Oz Converter, and Liter conversion tools. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const OZ_TO_CC_FAQS: readonly FAQItem[] = [
  {
    question: 'Does Volume Only Apply to Liquids?',
    answer:
      'No. Solids, liquids, and gases all occupy volume. Fluid ounces specifically measure fluid volume.',
  },
  {
    question: 'What Is oz?',
    answer:
      'The abbreviation oz often means an ounce of mass, while fl oz means a fluid ounce (volume). This calculator uses fluid ounces.',
  },
  {
    question: 'How Can I Convert 10 cc to oz?',
    answer: `For US fluid ounces: 10 ÷ ${CC_PER_US_FL_OZ} ≈ ${formatVolume(ccToFluidOunces(10, 'us'))} US fl oz.`,
  },
  {
    question: 'What Is the Difference Between US fl oz and UK fl oz?',
    answer: `1 US fl oz = ${CC_PER_US_FL_OZ} mL exactly. 1 UK imperial fl oz = ${CC_PER_UK_FL_OZ} mL exactly. A US fluid ounce is slightly larger.`,
  },
  {
    question: 'Is 1 cc Equal to 1 mL?',
    answer: 'Yes. One cubic centimeter equals exactly one milliliter.',
  },
  {
    question: 'How Many cc Are in 8 US fl oz?',
    answer: `8 × ${CC_PER_US_FL_OZ} = ${formatVolume(fluidOuncesToCc(8, 'us'))} cc.`,
  },
  {
    question: 'Can I Convert Ounces of Weight Directly to cc?',
    answer:
      'No. Converting mass to volume requires knowing the substance’s density.',
  },
];
