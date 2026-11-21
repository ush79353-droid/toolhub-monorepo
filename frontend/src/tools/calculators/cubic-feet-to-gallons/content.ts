import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  cubicFeetToGallons,
  formatVolume,
  gallonsToCubicFeet,
} from './calculation';

export const CU_FT_TO_GAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'cubic-feet-and-gallons', label: 'Cubic Feet and Gallons' },
  { id: 'equivalence', label: 'Equivalence Between Cubic Feet and Gallons' },
  { id: 'how-to-convert', label: 'How Do I Convert Cubic Feet to Gallons?' },
  { id: 'related-volume-tools', label: 'Other Useful Volume Conversion Tools' },
  { id: 'cu-ft-to-gal-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_FT3_US = [0, 0.5, 1, 2, 5, 10, 15, 20, 25, 50, 100, 250, 500, 1000] as const;
const EXAMPLE_FT3_UK = [1, 2, 5, 10, 20, 50, 100] as const;

export const CU_FT_TO_GAL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'cubic-feet-and-gallons',
    title: 'Cubic Feet and Gallons',
    paragraphs: [
      'A cubic foot is the volume of a cube measuring one foot on each edge (1 ft³ = 1728 in³). Gallons measure liquid volume in US customary and British imperial systems.',
      'A US liquid gallon equals exactly 231 cubic inches (3.785411784 L). A UK imperial gallon equals exactly 4.54609 L. Always select the correct gallon system before converting.',
      'Common uses include water tanks, pools, plumbing, industrial containers, construction, and fluid capacity estimates.',
    ],
    formula: '1 ft³ = 1728 in³  ·  1 US gal = 231 in³  ·  1 UK gal = 4.54609 L',
  },
  {
    id: 'equivalence',
    title: 'Equivalence Between Cubic Feet and Gallons',
    paragraphs: [
      `Using exact cubic-meter definitions, 1 ft³ ≈ ${formatVolume(cubicFeetToGallons(1, 'us'))} US gal and 1 ft³ ≈ ${formatVolume(cubicFeetToGallons(1, 'uk'))} UK gal.`,
      'The results differ because the imperial gallon is larger than the US liquid gallon. A one-cubic-foot container holds more US gallons than UK gallons.',
    ],
    formula: `1 ft³ ≈ ${formatVolume(cubicFeetToGallons(1, 'us'))} US gal  ·  1 ft³ ≈ ${formatVolume(cubicFeetToGallons(1, 'uk'))} UK gal`,
    tableHeaders: ['Cubic feet (ft³)', 'US gallons', 'UK gallons'],
    table: EXAMPLE_FT3_UK.map((ft3) => [
      formatVolume(ft3),
      formatVolume(cubicFeetToGallons(ft3, 'us')),
      formatVolume(cubicFeetToGallons(ft3, 'uk')),
    ]),
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Cubic Feet to Gallons?',
    paragraphs: [
      `Convert 15 ft³ to US gallons: 15 × ${formatVolume(cubicFeetToGallons(1, 'us'))} ≈ ${formatVolume(cubicFeetToGallons(15, 'us'))} US gal.`,
      `Convert 15 ft³ to UK gallons: 15 × ${formatVolume(cubicFeetToGallons(1, 'uk'))} ≈ ${formatVolume(cubicFeetToGallons(15, 'uk'))} UK gal.`,
      `Reverse example: 10 US gal ≈ ${formatVolume(gallonsToCubicFeet(10, 'us'))} ft³.`,
      'Enter either cubic feet or gallons: the other field updates instantly. Switch the gallon dropdown to recalculate with the selected system.',
    ],
    formula: 'US/UK gal = ft³ × (0.028316846592 ÷ gallon_m³)  ·  ft³ = gal × (gallon_m³ ÷ 0.028316846592)',
    tableHeaders: ['Cubic feet (ft³)', 'US gallons (approx.)'],
    table: EXAMPLE_FT3_US.map((ft3) => [
      formatVolume(ft3),
      formatVolume(cubicFeetToGallons(ft3, 'us')),
    ]),
  },
  {
    id: 'related-volume-tools',
    title: 'Other Useful Volume Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include Cubic Feet Calculator, Cubic Feet to Cubic Meters Converter, Cubic Meter Calculator, Volume Converter, and Metric Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CU_FT_TO_GAL_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Gallons Are in 1.5 Cubic Feet?',
    answer: `US: 1.5 × ${formatVolume(cubicFeetToGallons(1, 'us'))} ≈ ${formatVolume(cubicFeetToGallons(1.5, 'us'))} US gal. UK: ≈ ${formatVolume(cubicFeetToGallons(1.5, 'uk'))} UK gal.`,
  },
  {
    question: 'Is a Cubic Foot a Metric Unit?',
    answer:
      'No. A cubic foot belongs to US customary and imperial systems. The SI volume unit is the cubic meter.',
  },
  {
    question: 'How Many US Gallons Are in 10 Cubic Feet?',
    answer: `10 × ${formatVolume(cubicFeetToGallons(1, 'us'))} ≈ ${formatVolume(cubicFeetToGallons(10, 'us'))} US gallons.`,
  },
  {
    question: 'Are US and UK Gallons the Same?',
    answer:
      'No. A US liquid gallon equals 3.785411784 L. A UK imperial gallon equals 4.54609 L. The UK gallon is larger.',
  },
  {
    question: 'How Do I Convert Gallons Back to Cubic Feet?',
    answer: `For US gallons, ft³ = US gal × (0.003785411784 ÷ 0.028316846592). Example: 100 US gal ≈ ${formatVolume(gallonsToCubicFeet(100, 'us'))} ft³.`,
  },
];
