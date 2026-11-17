import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertGallonsQuarts,
  formatVolume,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from './calculation';

export const GAL_TO_QUARTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-gallon', label: 'What Is a Gallon?' },
  { id: 'what-is-a-quart', label: 'What Is a Quart?' },
  { id: 'how-to-convert', label: 'How to Convert Gallons to Quarts' },
  { id: 'how-to-use', label: 'How to Use the Gallons to Quarts Converter' },
  { id: 'related-tools', label: 'More Volume Converters' },
  { id: 'gal-to-quarts-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

const usGalToUkQt = convertGallonsQuarts(1, 'usGal', 'ukQt');

export const GAL_TO_QUARTS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-gallon',
    title: 'What Is a Gallon?',
    paragraphs: [
      'A gallon is a unit of volume commonly used to measure liquids. US liquid gallons are used in the United States. UK imperial gallons belong to the imperial measurement system.',
      `1 US liquid gallon = exactly ${LITERS_PER_US_LIQUID_GALLON} liters. 1 UK imperial gallon = exactly ${LITERS_PER_IMPERIAL_GALLON} liters.`,
      'The UK gallon is larger than the US gallon. Choosing the correct system matters when converting to quarts.',
    ],
    formula: `1 US gal = ${LITERS_PER_US_LIQUID_GALLON} L · 1 UK gal = ${LITERS_PER_IMPERIAL_GALLON} L`,
  },
  {
    id: 'what-is-a-quart',
    title: 'What Is a Quart?',
    paragraphs: [
      'A quart is a unit of volume equal to one-fourth of a gallon within the same measurement system. There are separate US customary and UK imperial quarts.',
      `1 US liquid quart = ${formatVolume(LITERS_PER_US_LIQUID_GALLON / 4)} liters. 1 UK imperial quart = ${formatVolume(LITERS_PER_IMPERIAL_GALLON / 4)} liters.`,
      'Within either system: 1 gallon = 4 quarts, 1 quart = 2 pints, and 1 gallon = 8 pints.',
    ],
    formula: '1 gal = 4 qt = 8 pt (same measurement system)',
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Gallons to Quarts',
    paragraphs: [
      'When gallons and quarts use the same measurement system: Quarts = Gallons × 4. Reverse: Gallons = Quarts ÷ 4.',
      'Example 1: 3 US gallons → US quarts: 3 × 4 = 12. Result: 12 US quarts.',
      'Example 2: 5 UK gallons → UK quarts: 5 × 4 = 20. Result: 20 UK quarts.',
      'Example 3: 12 US quarts → US gallons: 12 ÷ 4 = 3. Result: 3 US gallons.',
      `Converting US gallons to UK quarts (or vice versa) uses liter factors, not simply ×4. Example: 1 US gallon ≈ ${formatVolume(usGalToUkQt)} UK quarts.`,
    ],
    formula: 'Same-system: Quarts = Gallons × 4 · Gallons = Quarts ÷ 4',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Gallons to Quarts Converter',
    paragraphs: [
      '1. Enter the volume in the gallons field. 2. Select US gallons or UK gallons. 3. Select US quarts or UK quarts. 4. View the automatically calculated result. 5. Or enter a value in the quarts field for the reverse conversion. 6. Use Reload Calculator or Clear All Changes to reset.',
      'Practical example: enter 2 in gallons with US gal and US qt selected to see 8 US quarts instantly.',
    ],
  },
  {
    id: 'related-tools',
    title: 'More Volume Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Conversion, Gallons to Cups Converter, Gallons to Pints Converter, Gallons to Cubic Feet Converter, Cups to Gallons Converter, and other liquid-volume tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GAL_TO_QUARTS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 3 Gallons to Quarts?',
    answer:
      'Multiply gallons by four when using the same measurement system. 3 × 4 = 12. Therefore 3 US gallons equal 12 US quarts. Similarly, 3 UK gallons equal 12 UK quarts.',
  },
  {
    question: 'Why Does 1 Gallon Equal 4 Quarts?',
    answer:
      'The quart is defined as one-fourth of a gallon within the same measurement system. Therefore 1 gallon = 4 quarts. This applies separately to US customary units and UK imperial units.',
  },
  {
    question: 'Is 3 Gallons Equal to 12 Quarts?',
    answer:
      'Yes, provided the units belong to the same measurement system. 3 US gallons = 12 US quarts. 3 UK gallons = 12 UK quarts.',
  },
  {
    question: 'Is 1 Gallon the Same as 2 Quarts?',
    answer:
      'No. 1 gallon equals 4 quarts within the same measurement system. 2 quarts equal half a gallon.',
  },
  {
    question: 'Are US Quarts and UK Quarts the Same?',
    answer: `No. 1 US liquid quart = ${formatVolume(LITERS_PER_US_LIQUID_GALLON / 4)} liters. 1 UK imperial quart = ${formatVolume(LITERS_PER_IMPERIAL_GALLON / 4)} liters. The UK imperial quart is larger.`,
  },
];
