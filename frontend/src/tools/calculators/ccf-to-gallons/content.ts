import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { ccfToUsGallons, formatVolume, usGallonsToCcf } from './calculation';
import { LITERS_PER_CCF, US_GALLONS_PER_CCF } from './types';

export const CCF_TO_GALLONS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-ccf', label: 'What Is CCF?' },
  { id: 'what-is-us-gallon', label: 'What Is a US Liquid Gallon?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'ccf-to-gallons', label: 'CCF to Gallons Formula' },
  { id: 'gallons-to-ccf', label: 'Gallons to CCF Formula' },
  { id: 'how-much-is-1-ccf', label: 'How Much Water Is 1 CCF?' },
  { id: 'conversion-table', label: 'CCF to Gallons Conversion Table' },
  { id: 'why-convert', label: 'Why Convert CCF to Gallons?' },
  { id: 'ccf-to-gallons-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  ccf: string;
  usGallons: string;
}

export interface CcfToGallonsGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
}

const TABLE_CCF = [0.5, 1, 2, 3, 5, 10, 20, 25, 50, 100, 200] as const;

export const CCF_TO_GALLONS_GUIDE_SECTIONS: readonly CcfToGallonsGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This converter turns water-volume measurements between hundred cubic feet (CCF) and US liquid gallons. Enter either unit and read the matching value instantly.',
      'Primary results use US liquid gallons (231 cubic inches). Imperial gallons and other units appear under More conversion options when you want them.',
    ],
  },
  {
    id: 'what-is-ccf',
    title: 'What Is CCF?',
    paragraphs: [
      'CCF stands for hundred cubic feet. One CCF equals exactly 100 cubic feet. Some US water utilities measure and bill consumption in CCF, so a water bill may show usage in this unit.',
      `One CCF equals exactly ${formatVolume(US_GALLONS_PER_CCF)} US liquid gallons (172800 ÷ 231) and exactly ${formatVolume(LITERS_PER_CCF)} liters. Billing rules still vary by utility.`,
    ],
  },
  {
    id: 'what-is-us-gallon',
    title: 'What Is a US Liquid Gallon?',
    paragraphs: [
      'A US liquid gallon is a volume unit equal to exactly 231 cubic inches, or exactly 3.785411784 liters. Four US liquid quarts make one US gallon.',
      'US liquid gallons are not the same as Imperial gallons (exactly 4.54609 liters) or US dry gallons. This calculator’s primary field is always the US liquid gallon.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Converter',
    paragraphs: [
      'Enter a volume in CCF to fill US gallons, or enter US gallons to fill CCF. Open More conversion options for cubic feet, cubic meters, liters, milliliters, and Imperial gallons. Copy result places a short summary on the clipboard; Reset clears both fields.',
    ],
  },
  {
    id: 'ccf-to-gallons',
    title: 'CCF to Gallons Formula',
    paragraphs: [
      `Multiply CCF by 172800 ÷ 231. Example: 2 CCF ≈ ${formatVolume(ccfToUsGallons(2))} US gallons.`,
    ],
    formula: 'US gallons = CCF × (172800 / 231)',
  },
  {
    id: 'gallons-to-ccf',
    title: 'Gallons to CCF Formula',
    paragraphs: [
      `Multiply US gallons by 231 ÷ 172800. Example: 1000 US gallons ≈ ${formatVolume(usGallonsToCcf(1000))} CCF.`,
    ],
    formula: 'CCF = US gallons × (231 / 172800)',
  },
  {
    id: 'how-much-is-1-ccf',
    title: 'How Much Water Is 1 CCF?',
    paragraphs: [
      `One CCF is 100 cubic feet of water—about ${formatVolume(US_GALLONS_PER_CCF)} US gallons or ${formatVolume(LITERS_PER_CCF)} liters. That is roughly the volume of a small backyard pool’s early fill, or several weeks of household use for a typical single-family home, depending on habits and climate.`,
    ],
    formula: '1 CCF = 100 ft³ ≈ 748.052 US gal = 2831.6846592 L',
  },
  {
    id: 'conversion-table',
    title: 'CCF to Gallons Conversion Table',
    paragraphs: [
      'Common CCF values below use the same engine as the calculator. Displayed gallons are rounded for readability; arithmetic uses the exact 172800/231 ratio.',
    ],
    table: TABLE_CCF.map((ccf) => ({
      ccf: formatVolume(ccf),
      usGallons: formatVolume(ccfToUsGallons(ccf)),
    })),
  },
  {
    id: 'why-convert',
    title: 'Why Convert CCF to Gallons?',
    paragraphs: [
      'Converting CCF to gallons helps when reading a water bill, comparing household usage, planning conservation, reporting utility totals, or sizing plumbing and water systems that speak in gallons.',
      'This page converts volume only. It does not estimate a full utility bill (taxes, sewer, tiers, or fixed fees).',
    ],
  },
];

export const CCF_TO_GALLONS_FAQS: readonly FAQItem[] = [
  {
    question: 'How many gallons are in 1 CCF?',
    answer: `One CCF equals exactly 172800 ÷ 231 ≈ ${formatVolume(US_GALLONS_PER_CCF)} US liquid gallons.`,
  },
  {
    question: 'What does CCF mean?',
    answer: 'CCF means hundred cubic feet, a volume equal to 100 cubic feet.',
  },
  {
    question: 'How do I convert CCF to gallons?',
    answer: 'Multiply CCF by the exact ratio 172800/231.',
  },
  {
    question: 'How do I convert gallons to CCF?',
    answer: 'Multiply US gallons by 231/172800.',
  },
  {
    question: 'How much water is 100 CCF?',
    answer: `100 CCF ≈ ${formatVolume(ccfToUsGallons(100))} US gallons.`,
  },
  {
    question: 'What is 2.4 CCF in gallons?',
    answer: `2.4 × (172800 / 231) ≈ ${formatVolume(ccfToUsGallons(2.4))} US gallons.`,
  },
  {
    question: 'How many gallons are in 12.4 CCF?',
    answer: `12.4 × (172800 / 231) ≈ ${formatVolume(ccfToUsGallons(12.4))} US gallons.`,
  },
  {
    question: 'How many CCF are in 825 US gallons?',
    answer: `825 × (231 / 172800) ≈ ${formatVolume(usGallonsToCcf(825))} CCF.`,
  },
  {
    question: 'Is CCF used on water bills?',
    answer:
      'Yes. Some US water utilities measure and bill water consumption in units of hundred cubic feet.',
  },
  {
    question: 'Is one CCF equal to one cubic foot?',
    answer: 'No. One CCF equals 100 cubic feet.',
  },
  {
    question: 'Are US gallons and Imperial gallons the same?',
    answer:
      'No. A US liquid gallon is 3.785411784 liters; an Imperial gallon is 4.54609 liters. This tool’s primary field is US liquid gallons.',
  },
  {
    question: 'Can I convert decimal CCF values?',
    answer: 'Yes. The calculator supports whole-number and decimal volume measurements.',
  },
];
