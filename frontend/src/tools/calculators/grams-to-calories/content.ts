import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GRAMS_TO_CALORIES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'grams-to-calories', label: 'Grams to Calories Conversion' },
  { id: 'carbs-calories', label: 'How Many Calories Are in a Gram of Carbohydrates?' },
  { id: 'protein-calories', label: 'How Many Calories Are in a Gram of Protein?' },
  { id: 'fat-calories', label: 'How Many Calories Are in a Gram of Fat?' },
  { id: 'alcohol-calories', label: 'How to Calculate Calories from Alcohol' },
  { id: 'cal-vs-kcal', label: 'Is a Calorie (cal) and a Kilocalorie (kcal) the Same?' },
  { id: 'practical-example', label: 'Practical Grams to Calories Example' },
  { id: 'grams-to-calories-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const GRAMS_TO_CALORIES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'grams-to-calories',
    title: 'Grams to Calories Conversion',
    paragraphs: [
      'Dietary energy from food is often estimated from the grams of each macronutrient. General-purpose Atwater factors convert nutrient mass into kilocalories (kcal): carbohydrates ≈ 4 kcal/g, protein ≈ 4 kcal/g, fat ≈ 9 kcal/g, and ethanol ≈ 7 kcal/g.',
      'These factors are nutritional approximations. Actual labels can differ because of fiber, digestibility, food composition, and rounding. Do not treat an arbitrary number of grams of total food as a fixed calorie amount — composition matters.',
    ],
    tableHeaders: ['Macronutrient', '1 gram', '10 grams', '100 grams'],
    table: [
      ['Carbohydrates', '4 kcal', '40 kcal', '400 kcal'],
      ['Protein', '4 kcal', '40 kcal', '400 kcal'],
      ['Fat', '9 kcal', '90 kcal', '900 kcal'],
      ['Alcohol', '7 kcal', '70 kcal', '700 kcal'],
    ],
  },
  {
    id: 'carbs-calories',
    title: 'How Many Calories Are in a Gram of Carbohydrates?',
    paragraphs: [
      'As a general rule, 1 g of carbohydrate contributes about 4 kcal. Examples: 10 g → 40 kcal, 25 g → 100 kcal, 50 g → 200 kcal, 100 g → 400 kcal.',
      'Fiber and some carbohydrate types can contribute differently, so 4 kcal/g remains an approximation.',
    ],
    formula: '1 g carbohydrates ≈ 4 kcal',
  },
  {
    id: 'protein-calories',
    title: 'How Many Calories Are in a Gram of Protein?',
    paragraphs: [
      'Protein is also approximated at 4 kcal per gram. Examples: 10 g → 40 kcal, 25 g → 100 kcal, 50 g → 200 kcal.',
    ],
    formula: '1 g protein ≈ 4 kcal',
  },
  {
    id: 'fat-calories',
    title: 'How Many Calories Are in a Gram of Fat?',
    paragraphs: [
      'Fat is more energy-dense: about 9 kcal per gram. Examples: 5 g → 45 kcal, 10 g → 90 kcal, 20 g → 180 kcal, 50 g → 450 kcal.',
    ],
    formula: '1 g fat ≈ 9 kcal',
  },
  {
    id: 'alcohol-calories',
    title: 'How to Calculate Calories from Alcohol',
    paragraphs: [
      'Ethanol is approximated at 7 kcal per gram. If you know the grams of alcohol, multiply by 7.',
      'If you only know beverage volume and ABV, estimate alcohol mass as volume (mL) × (ABV/100) × 0.789 g/mL, then multiply by 7. That estimates ethanol only — not sugars, mixers, or other ingredients.',
    ],
    formula: '1 g alcohol ≈ 7 kcal · Alcohol(g) ≈ mL × ABV/100 × 0.789',
  },
  {
    id: 'cal-vs-kcal',
    title: 'Is a Calorie (cal) and a Kilocalorie (kcal) the Same?',
    paragraphs: [
      'In science, 1 kilocalorie (kcal) equals 1,000 small calories (cal). In nutrition, one food Calorie (often capitalized) equals one kilocalorie. Food labels that say “Calories” usually mean kcal. This calculator reports energy in kcal.',
    ],
  },
  {
    id: 'practical-example',
    title: 'Practical Grams to Calories Example',
    paragraphs: [
      'Suppose a portion provides 25 g carbohydrates, 15 g protein, 8 g fat, and no alcohol.',
      'Calories: (25 × 4) + (15 × 4) + (8 × 9) = 100 + 60 + 72 = 232 kcal. This estimates energy from the listed nutrients, not from the food’s total mass.',
    ],
    formula: '(25 × 4) + (15 × 4) + (8 × 9) = 232 kcal',
    tableHeaders: ['Nutrient', 'Grams', 'Calories'],
    table: [
      ['Carbohydrates', '25 g', '100 kcal'],
      ['Protein', '15 g', '60 kcal'],
      ['Fat', '8 g', '72 kcal'],
      ['Alcohol', '0 g', '0 kcal'],
      ['Total', '', '232 kcal'],
    ],
  },
];

export const GRAMS_TO_CALORIES_FAQS: readonly FAQItem[] = [
  {
    question: 'How many calories are in 1 gram of carbohydrates?',
    answer: 'Approximately 4 kcal.',
  },
  {
    question: 'How many calories are in 1 gram of protein?',
    answer: 'Approximately 4 kcal.',
  },
  {
    question: 'How many calories are in 1 gram of fat?',
    answer: 'Approximately 9 kcal.',
  },
  {
    question: 'How many calories are in 1 gram of alcohol?',
    answer: 'Approximately 7 kcal from ethanol.',
  },
  {
    question: 'How do I convert grams to calories?',
    answer:
      'Multiply the grams of each nutrient by its calorie factor (4, 4, 9, or 7) and add the results.',
  },
  {
    question: 'Can I convert 100 grams of any food directly into calories?',
    answer:
      'No. Energy depends on nutrient composition. Two foods weighing 100 grams can have very different calorie contents.',
  },
  {
    question: 'Does dietary fiber have 4 calories per gram?',
    answer:
      'Not necessarily. The energy contribution of dietary fiber varies by type and by the nutrition-labeling method used.',
  },
  {
    question: 'Why do my calculated calories differ from a food label?',
    answer:
      'Differences may result from rounding, fiber, digestibility, nutrient-specific energy factors, and how the label was calculated.',
  },
];
