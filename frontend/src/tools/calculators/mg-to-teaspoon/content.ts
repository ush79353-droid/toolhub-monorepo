import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMeasure,
  milligramsToTeaspoons,
  teaspoonsToMilligrams,
} from './calculation';
import {
  SALT_DENSITY_G_PER_ML,
  US_TEASPOON_ML,
  WATER_DENSITY_G_PER_ML,
} from './types';

export const MG_TO_TEASPOON_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-teaspoon', label: 'What Is a Teaspoon?' },
  { id: 'mg-to-tsp-conversion', label: 'Milligrams to Teaspoon Conversion' },
  { id: 'mg-in-a-teaspoon', label: 'How Many mg Are in a Teaspoon?' },
  { id: 'how-to-use', label: 'How to Use This mg to Teaspoon Converter' },
  { id: 'why-density-matters', label: 'Why Density Matters' },
  { id: 'related-tools', label: 'Related Calculators' },
  { id: 'mg-to-teaspoon-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { label: string; value: string }[];
}

const water1TspMg = teaspoonsToMilligrams(1, WATER_DENSITY_G_PER_ML, US_TEASPOON_ML);
const salt1TspMg = teaspoonsToMilligrams(1, SALT_DENSITY_G_PER_ML, US_TEASPOON_ML);
const salt6000Tsp = milligramsToTeaspoons(6000, SALT_DENSITY_G_PER_ML, US_TEASPOON_ML);
const water5000Tsp = milligramsToTeaspoons(5000, WATER_DENSITY_G_PER_ML, US_TEASPOON_ML);

export const MG_TO_TEASPOON_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-teaspoon',
    title: 'What Is a Teaspoon?',
    paragraphs: [
      'A teaspoon is a cooking volume unit. Its size depends on the measurement standard you follow.',
      `A US customary teaspoon is exactly ${US_TEASPOON_ML} mL (one forty-eighth of a US cup). A metric teaspoon is defined as 5 mL.`,
      'Household spoons vary and are not precise measuring instruments. This converter defaults to the US teaspoon and always shows which standard is selected.',
    ],
    formula: `US tsp = ${US_TEASPOON_ML} mL\nMetric tsp = 5 mL`,
  },
  {
    id: 'mg-to-tsp-conversion',
    title: 'Milligrams to Teaspoon Conversion',
    paragraphs: [
      'Milligrams measure mass. Teaspoons measure volume. You need the ingredient density in g/mL before converting.',
      'Convert milligrams to grams (divide by 1000), divide by density to get milliliters, then divide by the teaspoon volume in milliliters.',
      `For salt at an assumed bulk density of ${SALT_DENSITY_G_PER_ML} g/mL using US teaspoons, 6000 mg ≈ ${formatMeasure(Number(salt6000Tsp.toFixed(5)))} US tsp.`,
    ],
    formula: `tsp = mg / (1000 × ρ × ${US_TEASPOON_ML})\nwhere ρ is density in g/mL`,
  },
  {
    id: 'mg-in-a-teaspoon',
    title: 'How Many mg Are in a Teaspoon?',
    paragraphs: [
      'The milligram mass of one teaspoon depends on the substance density and the teaspoon standard.',
      `mg = ρ(g/mL) × teaspoon_mL × 1000. For water at 1 g/mL and a US teaspoon, that is about ${formatMeasure(Number(water1TspMg.toFixed(2)))} mg.`,
      `For salt at ${SALT_DENSITY_G_PER_ML} g/mL, one US teaspoon is about ${formatMeasure(Number(salt1TspMg.toFixed(2)))} mg. Switching to a metric teaspoon (5 mL) changes the mass for the same density.`,
    ],
    formula: `mg/tsp = ρ × V_tsp × 1000\n1 US tsp water ≈ ${formatMeasure(Number(water1TspMg.toFixed(2)))} mg\n1 US tsp salt (ρ=${SALT_DENSITY_G_PER_ML}) ≈ ${formatMeasure(Number(salt1TspMg.toFixed(2)))} mg`,
    table: [
      {
        label: '1 US tsp water (1 g/mL)',
        value: `${formatMeasure(Number(water1TspMg.toFixed(2)))} mg`,
      },
      {
        label: `1 US tsp salt (${SALT_DENSITY_G_PER_ML} g/mL)`,
        value: `${formatMeasure(Number(salt1TspMg.toFixed(2)))} mg`,
      },
      {
        label: '5000 mg water → US tsp',
        value: formatMeasure(Number(water5000Tsp.toFixed(5))),
      },
      {
        label: '6000 mg salt → US tsp',
        value: formatMeasure(Number(salt6000Tsp.toFixed(5))),
      },
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use This mg to Teaspoon Converter',
    paragraphs: [
      '1. Choose an ingredient (Salt is the default) or select Custom density.',
      '2. Review its density and unit; edit if your substance differs.',
      '3. Select the teaspoon standard (US or metric).',
      '4. Enter the mass in milligrams.',
      '5. Read the calculated volume in teaspoons.',
      '6. Or edit teaspoons to calculate milligrams.',
      '7. Use Reload calculator to restore Salt defaults, or Clear all changes to empty mass and volume while keeping density settings.',
    ],
  },
  {
    id: 'why-density-matters',
    title: 'Why Density Matters',
    paragraphs: [
      'Equal volumes of different ingredients do not contain the same mass. A teaspoon of honey weighs more than a teaspoon of flour because honey is denser.',
      'Bulk density for powders and crystals can vary with particle size, packing, moisture, temperature, and composition. Preset values are illustrative estimates.',
      'Prefer a measured density for your specific sample when accuracy matters. This tool performs physical mass–volume arithmetic only and must not be used for medication dosing.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include mg to Tablespoon Converter, mg to mL Converter, mg to cc Conversion, Grams in mL Converter, kg to Liter Converter, kg to mL Converter, Grams to fl oz Converter, and other density-based mass–volume tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const MG_TO_TEASPOON_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert mg to tsp?',
    answer: `Determine the substance density in g/mL, then use tsp = mg / (1000 × ρ × ${US_TEASPOON_ML}) for US customary teaspoons. Switch the standard to metric (5 mL) when needed.`,
  },
  {
    question: 'How Many mg Are in 1 tsp of Salt?',
    answer: `Using an assumed salt bulk density of ${SALT_DENSITY_G_PER_ML} g/mL: mg = ${SALT_DENSITY_G_PER_ML} × ${US_TEASPOON_ML} × 1000 ≈ ${formatMeasure(Number(salt1TspMg.toFixed(2)))} mg. Therefore 1 US tsp of salt ≈ ${formatMeasure(Number(salt1TspMg.toFixed(2)))} mg. Results vary with salt type, particle size, and packing.`,
  },
  {
    question: 'How Many mg Are in a Teaspoon of Water?',
    answer: `Assuming water density is 1 g/mL: 1 US tsp of water ≈ ${formatMeasure(Number(water1TspMg.toFixed(2)))} mg.`,
  },
  {
    question: 'Is 5000 mg Equal to 1 Teaspoon?',
    answer: `Not universally. For water at approximately 1 g/mL, 5000 mg corresponds to about ${formatMeasure(Number(water5000Tsp.toFixed(5)))} US teaspoons. Other substances produce different volumes depending on density.`,
  },
  {
    question: 'Is 1 Teaspoon Exactly 5 mL?',
    answer: `A metric teaspoon is defined as 5 mL. A US customary teaspoon is ${US_TEASPOON_ML} mL. This calculator identifies the selected standard explicitly.`,
  },
  {
    question: 'Can I Convert mg to tsp Without Knowing Density?',
    answer:
      'An accurate mass-to-volume conversion requires the substance density. Without density, the conversion cannot be determined reliably.',
  },
  {
    question: 'Can I Use Teaspoons to Measure Medication?',
    answer:
      "This calculator is not intended for medication dosing. Drug dose conversions require the product's labeled concentration, such as mg/mL, rather than the liquid's overall density. Use approved dosing instructions and calibrated measuring devices. Do not use household teaspoons to measure medication.",
  },
];
