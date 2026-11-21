import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatKitchen,
  formatMeasure,
  gramsPerTablespoon,
  tablespoonsToGrams,
  US_TABLESPOON_ML,
} from './calculation';
import { INGREDIENT_DENSITIES, requireIngredient } from './ingredients';
import { US_TEASPOON_ML } from './types';

export const TBSP_TO_G_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'tbsp to Grams Converter (with Ingredient Weights)' },
  { id: 'how-to', label: 'Tbsp to Grams Converter' },
  { id: 'quick-reference', label: 'Quick Reference; 1 tbsp to Grams' },
  { id: 'formula', label: 'What Is the Formula to Manually Convert Tablespoons to Grams?' },
  { id: 'why-vary', label: 'Why Do Ingredient Weights Vary?' },
  { id: 'related-tools', label: 'Other Useful Conversion Tools' },
  { id: 'tbsp-to-g-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  notice?: string;
}

const butter = requireIngredient('butter');
const sugar = requireIngredient('granulated-sugar');
const butter2g = tablespoonsToGrams(2, butter.densityGPerMl);
const sugar5g = tablespoonsToGrams(5, sugar.densityGPerMl);

export const TBSP_TO_G_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'tbsp to Grams Converter (with Ingredient Weights)',
    paragraphs: [
      'Convert tablespoons into grams based on the selected ingredient. Tablespoons measure volume; grams measure mass. Ingredient density determines the relationship, so different foods weigh differently per tablespoon.',
      'Use it for cooking, baking, recipe conversions, ingredient measurement, kitchen preparation, and international recipes. Enter tablespoons or grams; both directions work for the active ingredient.',
    ],
  },
  {
    id: 'how-to',
    title: 'Tbsp to Grams Converter',
    paragraphs: [
      'Step 1: Select an ingredient from the dropdown (Butter is the default).',
      'Step 2: Enter the quantity in the Tablespoons field (for example, 2 tbsp).',
      `Step 3: Read the grams result. Example: 2 US tbsp of butter ≈ ${formatKitchen(butter2g)} g.`,
      'Step 4: Enter grams instead to convert back to tablespoons.',
      'Step 5: Check Show ingredient density to see density (g/mL) and grams per US tablespoon.',
      `This calculator uses the US tablespoon (${US_TABLESPOON_ML} mL) as its documented standard.`,
    ],
  },
  {
    id: 'quick-reference',
    title: 'Quick Reference; 1 tbsp to Grams (Common Ingredients)',
    paragraphs: [
      'A tablespoon is a unit of volume, so the mass of one tablespoon varies by ingredient. Honey weighs more than flour for the same volume because honey is denser.',
      'Values below assume one level US tablespoon and the listed approximate densities.',
    ],
    tableHeaders: ['Ingredient', 'Approx. g per US tbsp', 'Density (g/mL)'],
    table: INGREDIENT_DENSITIES.map((item) => [
      item.name,
      formatKitchen(gramsPerTablespoon(item.densityGPerMl)),
      formatMeasure(item.densityGPerMl),
    ]),
    notice:
      'Important: Ingredient conversion values are approximate. Actual weights may vary because of temperature, moisture, packing, product formulation, and preparation methods. For precise baking measurements, use a kitchen scale. Leveled, heaped, packed, and sifted tablespoons can produce different weights.',
  },
  {
    id: 'formula',
    title: 'What Is the Formula to Manually Convert Tablespoons to Grams?',
    paragraphs: [
      `grams = tbsp × V_tbsp × ρ, where V_tbsp is the tablespoon volume in milliliters and ρ is density in g/mL.`,
      `For a US tablespoon, V_tbsp = ${US_TABLESPOON_ML} mL, so grams = tbsp × ${US_TABLESPOON_ML} × ρ.`,
      `Example; 2 tablespoons of butter at ≈ ${formatMeasure(butter.densityGPerMl)} g/mL: 2 × ${US_TABLESPOON_ML} × ${formatMeasure(butter.densityGPerMl)} ≈ ${formatKitchen(butter2g)} g.`,
      `Reverse: tbsp = grams ÷ (${US_TABLESPOON_ML} × ρ).`,
    ],
    formula: `grams = tbsp × ${US_TABLESPOON_ML} × ρ\ntbsp = grams ÷ (${US_TABLESPOON_ML} × ρ)\n2 × ${US_TABLESPOON_ML} × ${formatMeasure(butter.densityGPerMl)} ≈ ${formatKitchen(butter2g)}`,
  },
  {
    id: 'why-vary',
    title: 'Why Do Ingredient Weights Vary?',
    paragraphs: [
      'Density; denser ingredients weigh more for the same spoon volume.',
      'Packing; packed sugar or flour can hold more mass per tablespoon than a loose fill.',
      'Moisture; water content changes mass for the same apparent volume.',
      'Temperature; some ingredients expand or contract as temperature changes.',
      'Ingredient form; powdered, granulated, melted, or solid forms often have different bulk densities.',
      'This tool uses approximate reference densities for level US tablespoons; not laboratory certificates.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Useful Conversion Tools',
    paragraphs: [
      'Related Omega Calculators tools include Weight Converter, mg to tablespoon Converter, mg to teaspoon Converter, ml to tbsp Converter, ml to tsp Converter, Grams in mL Converter, Grams to fl oz Converter, Ounces to Grams Converter, and Grams to Ounces Calculator. Only catalog tools that exist on this site appear as links below.',
    ],
  },
];

export const TBSP_TO_G_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Grams to Teaspoons or Tablespoons?',
    answer: `Identify the ingredient density ρ (g/mL). Volume in mL is grams ÷ ρ. Then tbsp = grams ÷ (${US_TABLESPOON_ML} × ρ) for US tablespoons, or tsp = grams ÷ (${US_TEASPOON_ML} × ρ) for US teaspoons.`,
  },
  {
    question: 'How Many Grams Are in a Tablespoon?',
    answer: `It depends on the ingredient. Approximate level US tablespoon masses: water ≈ ${formatKitchen(gramsPerTablespoon(1))} g, butter ≈ ${formatKitchen(gramsPerTablespoon(butter.densityGPerMl))} g, honey ≈ ${formatKitchen(gramsPerTablespoon(requireIngredient('honey').densityGPerMl))} g, all-purpose flour ≈ ${formatKitchen(gramsPerTablespoon(requireIngredient('all-purpose-flour').densityGPerMl))} g.`,
  },
  {
    question: 'How Do I Convert Tablespoons to Grams?',
    answer: `Use grams = tbsp × ${US_TABLESPOON_ML} × ρ with the ingredient density ρ in g/mL. Select an ingredient in the calculator to load its reference density automatically.`,
  },
  {
    question: 'How Many Grams Are in 5 Tablespoons of Sugar?',
    answer: `Using granulated sugar density ≈ ${formatMeasure(sugar.densityGPerMl)} g/mL: 5 × ${US_TABLESPOON_ML} × ${formatMeasure(sugar.densityGPerMl)} ≈ ${formatKitchen(sugar5g)}. Therefore 5 US tablespoons of granulated sugar ≈ ${formatKitchen(sugar5g)} g.`,
  },
  {
    question: 'Is One Tablespoon Always 15 Grams?',
    answer: `No. A tablespoon measures volume; grams measure mass. One US tablespoon is about ${formatKitchen(US_TABLESPOON_ML)} mL, but mass depends on density.`,
  },
  {
    question: 'How Many Grams Are in 2 Tablespoons of Butter?',
    answer: `Using butter density ≈ ${formatMeasure(butter.densityGPerMl)} g/mL: 2 × ${US_TABLESPOON_ML} × ${formatMeasure(butter.densityGPerMl)} ≈ ${formatKitchen(butter2g)}. Therefore 2 US tablespoons of butter ≈ ${formatKitchen(butter2g)} g.`,
  },
  {
    question: 'Are US and Metric Tablespoons the Same?',
    answer: `No. A US tablespoon is approximately ${US_TABLESPOON_ML} mL. A metric tablespoon is generally 15 mL. An Australian tablespoon is commonly 20 mL. This converter uses the US tablespoon standard.`,
  },
];
