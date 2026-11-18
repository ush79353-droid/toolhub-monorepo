import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatKitchen,
  formatMeasure,
  gramsToTeaspoons,
  kgM3ToGmL,
  teaspoonsToGrams,
  US_TEASPOON_ML,
} from './calculation';
import {
  GRANULATED_SUGAR_KG_PER_M3,
  allIngredientTypes,
  requireType,
} from './ingredients';

export const TSPG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'tsp to grams Converter' },
  { id: 'how-many-grams', label: 'How Many Grams Are in a Teaspoon?' },
  { id: 'how-to-use', label: 'How Do I Use the tsp to Grams Converter?' },
  { id: 'formula', label: 'Teaspoon to Grams Conversion Formula' },
  { id: 'why-different', label: 'Why Do Ingredients Have Different Weights?' },
  { id: 'examples', label: 'Common Teaspoon to Gram Examples' },
  { id: 'related-tools', label: 'Other Conversion Calculators' },
  { id: 'tspg-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const sugar = requireType('sugar', 'granulated-sugar');
const sugarDensity = kgM3ToGmL(GRANULATED_SUGAR_KG_PER_M3);
const sugar1g = teaspoonsToGrams(1, sugarDensity);
const sugar2g = teaspoonsToGrams(2, sugarDensity);

export const TSPG_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'tsp to grams Converter',
    paragraphs: [
      'Convert teaspoon measurements into grams using ingredient-specific density. The same teaspoon volume can hold different masses of sugar, flour, salt, butter, honey, and other kitchen ingredients. This tool looks up an approximate density for the selected ingredient subtype, accepts a custom density, and converts in both directions.',
    ],
  },
  {
    id: 'how-many-grams',
    title: 'How Many Grams Are in a Teaspoon?',
    paragraphs: [
      'There is no single answer. A teaspoon measures volume, while grams measure mass. Bulk density, packing, ingredient type, and the teaspoon standard (US vs metric) all change the result.',
      'Mass = Density × Volume. With density in g/mL and a US teaspoon volume of 4.92892159375 mL, grams = tsp × 4.92892159375 × ρ.',
      `Using the reference granulated-sugar density of ${GRANULATED_SUGAR_KG_PER_M3} kg/m³ (${formatMeasure(sugarDensity)} g/mL), 1 US tsp ≈ ${formatKitchen(sugar1g)} g.`,
    ],
    formula: `Mass = Density × Volume\n1 US tsp sugar ≈ ${formatKitchen(sugar1g)} g at ${GRANULATED_SUGAR_KG_PER_M3} kg/m³`,
  },
  {
    id: 'how-to-use',
    title: 'How Do I Use the tsp to Grams Converter?',
    paragraphs: [
      '1. Open Lookup density or input your own.',
      '2. Select an ingredient category (for example, Sugar).',
      '3. Select the subtype (for example, Granulated sugar).',
      '4. Review or customize the density and density unit.',
      '5. Enter teaspoons to read grams, or enter grams to read teaspoons.',
      '6. Switching ingredients or density recalculates from the last actively edited measurement field.',
    ],
  },
  {
    id: 'formula',
    title: 'Teaspoon to Grams Conversion Formula',
    paragraphs: [
      `For US teaspoons: g = tsp × ${US_TEASPOON_ML} × ρ, where ρ is density in g/mL.`,
      `Reverse: tsp = g ÷ (${US_TEASPOON_ML} × ρ).`,
      `Worked example — 2 US tsp of granulated sugar at ${GRANULATED_SUGAR_KG_PER_M3} kg/m³: 2 × ${US_TEASPOON_ML} × ${formatMeasure(sugarDensity)} ≈ ${formatKitchen(sugar2g)} g.`,
    ],
    formula: `g = tsp × ${US_TEASPOON_ML} × ρ\ntsp = g ÷ (${US_TEASPOON_ML} × ρ)\n2 × ${US_TEASPOON_ML} × ${formatMeasure(sugarDensity)} ≈ ${formatKitchen(sugar2g)}`,
  },
  {
    id: 'why-different',
    title: 'Why Do Ingredients Have Different Weights?',
    paragraphs: [
      'Materials have different true densities, and powders trap air between particles so bulk density is lower than solid density.',
      'Loose, leveled, packed, sifted, melted, and chopped forms change how much mass fits in one teaspoon.',
      'Moisture and temperature also shift mass for the same scooped volume. The calculator uses approximate reference densities — not universal constants.',
    ],
  },
  {
    id: 'examples',
    title: 'Common Teaspoon to Gram Examples',
    paragraphs: [
      'Approximate mass of 1 US teaspoon for each listed subtype, calculated from the same density dataset used by the converter. These are estimates for level teaspoons.',
    ],
    tableHeaders: ['Ingredient', 'Density (g/mL)', '≈ g per US tsp'],
    table: allIngredientTypes().map((item) => [
      item.name,
      formatMeasure(item.densityGPerMl),
      formatKitchen(teaspoonsToGrams(1, item.densityGPerMl)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include tbsp to Grams Converter, Tbsp to mL Converter, Volume Conversion, Grams in mL Converter, g to tsp Converter, mL to tsp Converter, Grams to Ounces Calculator, and Ounces to Grams Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const TSPG_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 1 tsp of Sugar to Grams?',
    answer: `Select Sugar → Granulated sugar. Using the reference density ${GRANULATED_SUGAR_KG_PER_M3} kg/m³ (${formatMeasure(sugar.densityGPerMl)} g/mL): 1 × ${US_TEASPOON_ML} × ${formatMeasure(sugar.densityGPerMl)} ≈ ${formatKitchen(sugar1g)} g. Therefore 1 US tsp ≈ ${formatKitchen(sugar1g)} g under this density assumption.`,
  },
  {
    question: 'How Many Grams Are in a Teaspoon of Salt?',
    answer:
      'It depends on the salt type, grain size, and packing. Choose Table salt, Fine sea salt, or Coarse salt in the calculator for an approximate estimate. For reliable results, weigh salt on a kitchen scale.',
  },
  {
    question: 'Is 1 Teaspoon Always 5 Grams?',
    answer:
      'No. A teaspoon measures volume; grams measure mass. A teaspoon of water, sugar, flour, or honey will not weigh the same. The common “5 g” kitchen shorthand is not a universal conversion.',
  },
  {
    question: 'How Do I Convert Grams to Teaspoons?',
    answer: `Divide mass by the mass of one teaspoon of the selected ingredient: tsp = g ÷ (ρ × ${US_TEASPOON_ML}), with ρ in g/mL. Example: ${formatKitchen(sugar2g)} g of granulated sugar ≈ ${formatKitchen(gramsToTeaspoons(sugar2g, sugarDensity))} US tsp at the reference density.`,
  },
  {
    question: 'Why Does the Calculator Need Ingredient Density?',
    answer:
      'Teaspoons measure volume and grams measure mass. Density supplies the relationship needed to calculate mass from volume (or the reverse).',
  },
  {
    question: 'Can I Enter My Own Ingredient Density?',
    answer:
      'Yes. Choose Custom ingredient, enter a positive density, and select kg/m³, g/mL, or g/cm³. The converter updates results automatically from that density.',
  },
];
