import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { dagToGrams, formatMass } from './calculation';
import { GRAMS_PER_DECAGRAM } from './types';

export const DECAGRAM_TO_GRAM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-decagram', label: 'What Is a Decagram?' },
  { id: 'what-is-a-gram', label: 'What Is a Gram?' },
  { id: 'grams-in-one-dag', label: 'How Many Grams in One Decagram?' },
  { id: 'dag-to-g', label: 'How to Convert Decagrams to Grams' },
  { id: 'g-to-dag', label: 'How to Convert Grams to Decagrams' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'conversion-table', label: 'Decagram to Gram Conversion Table' },
  { id: 'metric-units', label: 'Understanding Metric Mass Units' },
  { id: 'dag-vs-dg', label: 'Decagram vs Decigram' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'decagram-to-gram-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  dag: string;
  g: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly ConversionTableRow[];
}

const TABLE_DAG = [
  0, 0.01, 0.1, 0.25, 0.5, 1, 2, 3, 5, 7, 7.5, 10, 15, 25, 50, 100, 250, 1000,
] as const;

export const DECAGRAM_TO_GRAM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      `This converter turns metric mass between decagrams (dag) and grams (g) using the exact factor ${GRAMS_PER_DECAGRAM}. Enter either unit and read the matching value instantly.`,
    ],
  },
  {
    id: 'what-is-a-decagram',
    title: 'What Is a Decagram?',
    paragraphs: [
      'A decagram is a metric unit of mass. Its symbol is dag. The prefix “deca-” means ten, so one decagram equals exactly ten grams and 0.01 kilograms. Decagrams appear in some food labeling, cooking, and metric classroom contexts.',
    ],
  },
  {
    id: 'what-is-a-gram',
    title: 'What Is a Gram?',
    paragraphs: [
      'A gram is a metric unit of mass with symbol g. One gram equals 1000 milligrams, and one kilogram equals 1000 grams. Grams are widely used for food, ingredients, science, and everyday weighing.',
    ],
  },
  {
    id: 'grams-in-one-dag',
    title: 'How Many Grams Are in One Decagram?',
    paragraphs: [`Exactly ${GRAMS_PER_DECAGRAM} grams: 1 dag = ${GRAMS_PER_DECAGRAM} g.`],
  },
  {
    id: 'dag-to-g',
    title: 'How to Convert Decagrams to Grams',
    paragraphs: ['Multiply decagrams by 10. Example: 7 dag × 10 = 70 g.'],
    formula: 'Grams = Decagrams × 10',
  },
  {
    id: 'g-to-dag',
    title: 'How to Convert Grams to Decagrams',
    paragraphs: ['Divide grams by 10. Example: 250 g ÷ 10 = 25 dag.'],
    formula: 'Decagrams = Grams / 10',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Decagram to Gram Converter',
    paragraphs: [
      'Enter a mass in decagrams to fill grams, or enter grams to fill decagrams. Open More conversion options for µg, mg, cg, dg, hg, kg, and tonnes. Copy result places a short summary on the clipboard; Reset clears both fields.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Decagram to Gram Conversion Table',
    paragraphs: [
      `Common values below use the same engine as the calculator. Every row follows 1 dag = ${GRAMS_PER_DECAGRAM} g exactly.`,
    ],
    table: TABLE_DAG.map((dag) => ({
      dag: formatMass(dag),
      g: formatMass(dagToGrams(dag)),
    })),
  },
  {
    id: 'metric-units',
    title: 'Understanding Metric Mass Units',
    paragraphs: [
      'Metric mass prefixes scale by powers of ten: µg, mg, cg, dg, g, dag, hg, kg, and t. Each step is a factor of 10 relative to neighboring prefixes on that ladder (with µg and t spanning larger jumps from the gram).',
    ],
  },
  {
    id: 'dag-vs-dg',
    title: 'Difference Between Decagram and Decigram',
    paragraphs: [
      'A decagram (dag) equals 10 grams. A decigram (dg) equals 0.1 grams. Therefore 1 decagram = 100 decigrams. The abbreviations look similar—always check whether a recipe or label means dag or dg.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use the converter for cooking and food ingredient checks, metric education, scientific notes, everyday mass conversion, and clarifying dag vs dg mistakes.',
    ],
  },
];

export const DECAGRAM_TO_GRAM_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert decagrams to grams?',
    answer: 'Multiply the decagram value by ten.',
  },
  {
    question: 'How do I convert grams to decagrams?',
    answer: 'Divide the gram value by ten.',
  },
  {
    question: 'How many grams are in one decagram?',
    answer: 'Exactly 10 grams.',
  },
  {
    question: 'How many decagrams are in 100 grams?',
    answer: '100 ÷ 10 = 10 dag.',
  },
  {
    question: 'How many grams are in 5 decagrams?',
    answer: '5 × 10 = 50 g.',
  },
  {
    question: 'How many grams are in 7 decagrams?',
    answer: '7 × 10 = 70 g.',
  },
  {
    question: 'How many grams are in 15 decagrams?',
    answer: '15 × 10 = 150 g.',
  },
  {
    question: 'How many decagrams are in 250 grams?',
    answer: '250 ÷ 10 = 25 dag.',
  },
  {
    question: 'How many decagrams are in one kilogram?',
    answer: '1000 g ÷ 10 = 100 dag.',
  },
  {
    question: 'Is a decagram the same as a decigram?',
    answer:
      'No. A decagram equals 10 grams, while a decigram equals 0.1 grams.',
  },
  {
    question: 'What is the symbol for decagram?',
    answer: 'The standard symbol is dag.',
  },
  {
    question: 'Can I convert decimal decagram values?',
    answer: 'Yes. The converter supports integer and decimal measurements.',
  },
  {
    question: 'Is one decagram larger than one gram?',
    answer: 'Yes. A decagram is ten times larger than a gram.',
  },
];
