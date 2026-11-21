import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatArea,
  kathaToSquareFeet,
  kathaToSquareMeters,
  squareFeetToKatha,
  squareMetersPerKatha,
} from './calculation';
import {
  KATHA_REGIONS,
  PENDING_REGION_NOTES,
  SQUARE_METERS_PER_SQUARE_FOOT,
  getKathaRegion,
} from './types';

export const KATHA_TO_SQFT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Katha to Square Feet Converter' },
  { id: 'what-is-katha', label: 'What Is a Katha?' },
  { id: 'katha-to-sqft', label: 'How Do I Convert Katha to Square Feet?' },
  { id: 'sqft-to-katha', label: 'How Do I Convert Square Feet to Katha?' },
  { id: 'katha-to-m2', label: 'How to Convert Katha to Square Meters' },
  { id: 'by-region', label: 'Katha Conversion by Region' },
  { id: 'why-varies', label: 'Why Does Katha Size Vary by Region?' },
  { id: 'related-tools', label: 'Related Calculators' },
  { id: 'katha-to-sqft-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const NEPAL = getKathaRegion('nepal');
const NEPAL_R = NEPAL.squareFeetPerKatha;

export const KATHA_TO_SQFT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Katha to Square Feet Converter',
    paragraphs: [
      'Convert regional katha land measurements into square feet and square meters with this free Omega Calculators tool. Choose the region that matches your land-record convention, then edit any of the three area fields.',
      'Katha is not a single global unit. The calculator applies only verified square-feet-per-katha factors and recalculates instantly when you change the region or any measurement.',
    ],
  },
  {
    id: 'what-is-katha',
    title: 'What Is a Katha?',
    paragraphs: [
      'Katha (also spelled kattha or cottah) is a traditional land-area unit used in parts of South Asia, including Nepal, Bangladesh, and India.',
      'Its exact size depends on the local land-measurement convention. Katha appears in residential and agricultural land deals, property listings, and local land records.',
      'Always confirm the definition that applies to an official document before relying on a conversion for legal or financial decisions.',
    ],
  },
  {
    id: 'katha-to-sqft',
    title: 'How Do I Convert Katha to Square Feet?',
    paragraphs: [
      'Multiply katha by the selected region’s square-feet-per-katha factor.',
      `Nepal example; convert 2 katha: 2 × ${formatArea(NEPAL_R)} = ${formatArea(kathaToSquareFeet(2, NEPAL_R))} ft². This example uses the Nepal Terai Survey Department definition and does not apply to other regions.`,
    ],
    formula: `Square feet = Katha × Regional factor\nNepal: ft² = katha × ${formatArea(NEPAL_R)}`,
  },
  {
    id: 'sqft-to-katha',
    title: 'How Do I Convert Square Feet to Katha?',
    paragraphs: [
      'Divide square feet by the selected region’s factor.',
      `Nepal example; convert ${formatArea(kathaToSquareFeet(2, NEPAL_R))} ft²: ${formatArea(kathaToSquareFeet(2, NEPAL_R))} ÷ ${formatArea(NEPAL_R)} = ${formatArea(squareFeetToKatha(kathaToSquareFeet(2, NEPAL_R), NEPAL_R))} katha.`,
    ],
    formula: `Katha = Square feet ÷ Regional factor`,
  },
  {
    id: 'katha-to-m2',
    title: 'How to Convert Katha to Square Meters',
    paragraphs: [
      `Convert katha to square feet with the regional factor, then multiply by the exact international constant ${SQUARE_METERS_PER_SQUARE_FOOT}.`,
      `Nepal example; 1 katha: ${formatArea(NEPAL_R)} × ${SQUARE_METERS_PER_SQUARE_FOOT} = ${formatArea(kathaToSquareMeters(1, NEPAL_R))} m².`,
    ],
    formula: `m² = katha × regional ft²/katha × ${SQUARE_METERS_PER_SQUARE_FOOT}`,
  },
  {
    id: 'by-region',
    title: 'Katha Conversion by Region',
    paragraphs: [
      'The table below is generated from the same verified registry the calculator uses. Local land records may still differ, confirm the applicable definition before official use.',
      `Pending / not exposed as calculator options: ${PENDING_REGION_NOTES.join(' ')}`,
    ],
    tableHeaders: ['Region', 'Square Feet per Katha', 'Square Meters per Katha'],
    table: KATHA_REGIONS.map((region) => [
      region.name,
      formatArea(region.squareFeetPerKatha),
      formatArea(squareMetersPerKatha(region.squareFeetPerKatha)),
    ]),
  },
  {
    id: 'why-varies',
    title: 'Why Does Katha Size Vary by Region?',
    paragraphs: [
      'Katha developed as a subdivision of local bigha systems. Because bigha itself was never nationally standardized across South Asia, katha inherited those regional differences.',
      'Selecting the correct region keeps estimates aligned with the land-record tradition you are comparing against. Using Nepal’s 3,645 ft² factor for a West Bengal plot would be incorrect.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Square Feet Converter, Square Meter Converter, Area Converter, Square Yard Converter, Acre Converter, Hectare Converter, Gaj to Square Yard Converter, Square Feet to Acres Converter, and Square Feet to Square Meter Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KATHA_TO_SQFT_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Square Feet Are in One Katha?',
    answer: `It depends on the region. For the commonly used Nepal Terai Survey Department definition, 1 katha = ${formatArea(NEPAL_R)} square feet. Other verified regions in this tool use different factors.`,
  },
  {
    question: 'How Do I Convert Katha to Square Feet?',
    answer:
      'Multiply the number of katha by the applicable region’s square-feet-per-katha factor. Select the region first so the calculator applies the correct constant.',
  },
  {
    question: 'How Many Square Feet Are in Two Katha in Nepal?',
    answer: `2 × ${formatArea(NEPAL_R)} = ${formatArea(kathaToSquareFeet(2, NEPAL_R))} ft² under the Nepal Terai definition.`,
  },
  {
    question: 'How Many Square Meters Are in One Katha in Nepal?',
    answer: `About ${formatArea(kathaToSquareMeters(1, NEPAL_R))} m² (exactly ${formatArea(NEPAL_R)} × ${SQUARE_METERS_PER_SQUARE_FOOT}).`,
  },
  {
    question: 'Is One Katha the Same Size Everywhere?',
    answer:
      'No. Katha is region-dependent. Nepal, Bangladesh, West Bengal, Assam, and Bihar districts publish different sizes. Always match the local convention.',
  },
  {
    question: 'How Do I Convert Square Feet Back to Katha?',
    answer:
      'Divide square feet by the selected region’s katha factor. The calculator updates the katha and square-meter fields automatically.',
  },
  {
    question: 'Can I Use This Calculator for Official Land Documents?',
    answer:
      'Use it for estimates and conversions under the selected published definition. Confirm official land records and locally applicable standards before legal or financial decisions.',
  },
];
