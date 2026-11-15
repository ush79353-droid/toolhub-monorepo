import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ACRES_TO_MI2_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-acres-and-square-miles', label: 'What Are Acres and Square Miles?' },
  { id: 'acres-in-one-square-mile', label: 'How Many Acres in One Square Mile?' },
  { id: 'convert-acres-to-square-miles', label: 'How to Convert Acres to Square Miles' },
  { id: 'convert-square-miles-to-acres', label: 'How to Convert Square Miles to Acres' },
  { id: 'conversion-formulas', label: 'Conversion Formulas' },
  { id: 'worked-examples', label: 'Worked Examples' },
  { id: 'acres-vs-square-miles', label: 'Acres vs Square Miles' },
  { id: 'common-uses', label: 'Common Uses' },
  { id: 'reference-table', label: 'Conversion Reference Table' },
  { id: 'acres-to-mi2-faq', label: 'Frequently Asked Questions' },
];

export interface AreaTableRow {
  acres: string;
  squareMiles: string;
}

export interface AcresToMi2GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly AreaTableRow[];
}

export const ACRES_TO_MI2_GUIDE_SECTIONS: readonly AcresToMi2GuideSection[] = [
  {
    id: 'what-are-acres-and-square-miles',
    title: 'What Are Acres and Square Miles?',
    paragraphs: [
      'An acre is a customary area unit used for farms, ranches, timber tracts, and many real-estate parcels. A square mile is the area of a square one mile on each side. Both appear on maps, deeds, and land statistics in the United States and other places that still publish customary land measures.',
      'This calculator converts between the two using the exact survey relationship of 640 acres in one square mile. It does not estimate irregular boundaries; it only scales a known area from one unit into the other.',
    ],
  },
  {
    id: 'acres-in-one-square-mile',
    title: 'How Many Acres Are in One Square Mile?',
    paragraphs: [
      'There are exactly 640 acres in one square mile. That factor is the standard used in US Public Land Survey sections and in most customary land tables.',
      'Because the ratio is exact, one acre is 1 ÷ 640 = 0.0015625 square miles, and 2,000 acres are 3.125 square miles.',
    ],
  },
  {
    id: 'convert-acres-to-square-miles',
    title: 'How to Convert Acres to Square Miles',
    paragraphs: [
      'Divide the number of acres by 640. Two thousand acres ÷ 640 = 3.125 square miles. Six hundred forty acres ÷ 640 = 1 square mile.',
      'Enter acres in the calculator to fill square miles automatically. The acres field you are typing is left alone until you finish the number, including a trailing decimal point.',
    ],
  },
  {
    id: 'convert-square-miles-to-acres',
    title: 'How to Convert Square Miles to Acres',
    paragraphs: [
      'Multiply square miles by 640. One square mile × 640 = 640 acres. Three and one-eighth square miles × 640 = 2,000 acres.',
      'Type in the square-miles field when that is the figure you already know. Acres update from the same exact factor.',
    ],
  },
  {
    id: 'conversion-formulas',
    title: 'Conversion Formulas',
    paragraphs: [
      'Keep 640 as an exact integer. Do not replace it with a rounded metric bridge unless you are deliberately converting through square meters instead of customary acres and miles.',
    ],
    formula: 'mi² = acres ÷ 640  |  acres = mi² × 640',
    formulaNote: '1 mi² = 640 ac. 1 ac = 0.0015625 mi².',
  },
  {
    id: 'worked-examples',
    title: 'Worked Examples',
    paragraphs: [
      'A full section of land is often described as one square mile, which is 640 acres. Halving that area gives 320 acres, or 0.5 square miles.',
      'A 2,000-acre ranch is 2,000 ÷ 640 = 3.125 square miles. A 10-acre lot is 10 ÷ 640 = 0.015625 square miles. Going the other way, 1.5625 square miles × 640 = 1,000 acres.',
    ],
  },
  {
    id: 'acres-vs-square-miles',
    title: 'Acres vs Square Miles',
    paragraphs: [
      'Acres are convenient for individual parcels and farm fields. Square miles suit counties, watersheds, parks, and map tiles where the numbers would otherwise be huge in acres.',
      'Neither unit replaces a survey. Legal descriptions, GIS layers, and recorded plats remain authoritative when boundaries are irregular or disputed.',
    ],
  },
  {
    id: 'common-uses',
    title: 'Common Uses',
    paragraphs: [
      'Agriculture and ranching often quote acreage while regional planning quotes square miles. Mapping products may switch units depending on zoom level. Real-estate marketing sometimes lists both so buyers can compare a listing with a county land table.',
      'Use this page for quick unit changes, homework, and planning estimates. Use a surveyor or GIS workflow when you need boundary accuracy.',
    ],
  },
  {
    id: 'reference-table',
    title: 'Conversion Reference Table',
    paragraphs: [
      'Each row uses square miles = acres ÷ 640.',
    ],
    table: [
      { acres: '1', squareMiles: '0.0015625' },
      { acres: '10', squareMiles: '0.015625' },
      { acres: '100', squareMiles: '0.15625' },
      { acres: '640', squareMiles: '1' },
      { acres: '1,000', squareMiles: '1.5625' },
      { acres: '2,000', squareMiles: '3.125' },
    ],
  },
];

export const ACRES_TO_MI2_FAQS: readonly FAQItem[] = [
  {
    question: 'How many acres are in a square mile?',
    answer: 'There are exactly 640 acres in one square mile.',
  },
  {
    question: 'How do I convert acres to square miles?',
    answer: 'Divide acres by 640. For example, 2,000 acres ÷ 640 = 3.125 square miles.',
  },
  {
    question: 'How do I convert square miles to acres?',
    answer: 'Multiply square miles by 640. For example, 1 square mile × 640 = 640 acres.',
  },
  {
    question: 'What is 2,000 acres in square miles?',
    answer: '2,000 acres equal 3.125 square miles.',
  },
  {
    question: 'Is the 640-acre factor exact?',
    answer:
      'Yes. This calculator uses the exact customary relationship of 640 acres per square mile, not a rounded metric approximation.',
  },
  {
    question: 'Can I enter decimals?',
    answer:
      'Yes. Fractional acres and fractional square miles are supported. Incomplete numbers such as a trailing decimal stay editable until you finish typing.',
  },
];
