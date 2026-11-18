import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  fluidOuncesToGrams,
  formatMeasure,
  gramsToFluidOunces,
} from './calculation';
import { UK_FL_OZ_IN_ML, US_FL_OZ_IN_ML } from './types';

export const GRAMS_TO_FL_OZ_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'converting-by-hand', label: 'Converting From Grams to fl oz by Hand' },
  { id: 'density-g-per-cm3', label: 'Expressing Density in Terms of g/cm³' },
  { id: 'conversion-examples', label: 'Grams to Fluid Ounces Conversion Examples' },
  { id: 'how-to-use', label: 'How to Use the Grams to fl oz Converter' },
  { id: 'related-tools', label: 'Other Related Conversion Tools' },
  { id: 'grams-to-fl-oz-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { grams: string; us: string; uk: string }[];
}

const water100Us = gramsToFluidOunces(100, 1, 'US');
const water100Uk = gramsToFluidOunces(100, 1, 'UK');
const honey100Us = gramsToFluidOunces(100, 1.42, 'US');
const evaporated12Us = fluidOuncesToGrams(12, 1.07, 'US');

function row(grams: number): { grams: string; us: string; uk: string } {
  return {
    grams: String(grams),
    us: formatMeasure(Number(gramsToFluidOunces(grams, 1, 'US').toFixed(4))),
    uk: formatMeasure(Number(gramsToFluidOunces(grams, 1, 'UK').toFixed(4))),
  };
}

export const WATER_FL_OZ_TABLE: readonly { grams: string; us: string; uk: string }[] = [
  row(10),
  row(25),
  row(50),
  row(100),
  row(250),
  row(500),
  row(1000),
];

export const GRAMS_TO_FL_OZ_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'converting-by-hand',
    title: 'Converting From Grams to fl oz by Hand',
    paragraphs: [
      'Grams measure mass. Fluid ounces measure volume. You need the substance density before converting — and you must choose US or imperial (UK) fluid ounces, because the two units are not the same size.',
      'Steps: (1) identify the substance, (2) determine density in g/mL, (3) divide mass in grams by density to get milliliters, (4) divide by 29.5735295625 for US fluid ounces, or by 28.4130625 for imperial fluid ounces.',
      `Example: 100 grams of water at ≈ 1 g/mL. Volume = 100 mL. US fl oz = 100 ÷ ${US_FL_OZ_IN_ML} ≈ ${formatMeasure(Number(water100Us.toFixed(4)))}. UK fl oz = 100 ÷ ${UK_FL_OZ_IN_ML} ≈ ${formatMeasure(Number(water100Uk.toFixed(4)))}.`,
      `Honey is denser. At 1.42 g/mL, 100 g ≈ ${formatMeasure(Number(honey100Us.toFixed(4)))} US fl oz.`,
    ],
    formula: `Volume_mL = Mass_g ÷ Density_g/mL\nUS fl oz = Volume_mL ÷ ${US_FL_OZ_IN_ML}\nUK fl oz = Volume_mL ÷ ${UK_FL_OZ_IN_ML}`,
  },
  {
    id: 'density-g-per-cm3',
    title: 'Expressing Density in Terms of g/cm³',
    paragraphs: [
      'One cubic centimeter of water near 1 g/cm³ has a mass of about one gram, and 1 cm³ = 1 mL, so 1 g/cm³ = 1 g/mL.',
      'Useful relationships: 1 g/mL = 1000 kg/m³ = 1 kg/L = 1 g/cm³. The calculator keeps a canonical g/mL density and converts display units without changing the physical value.',
      'You can enter density in kg/m³, lb/ft³, or lb/US gal; the mass–volume result stays consistent as long as the physical density is unchanged.',
    ],
    formula: '1 g/cm³ = 1 g/mL = 1 kg/L = 1000 kg/m³',
  },
  {
    id: 'conversion-examples',
    title: 'Grams to Fluid Ounces Conversion Examples',
    paragraphs: [
      'The table below uses water at an approximate density of 1 g/mL. Values are rounded for display and are approximate.',
      'Equal masses of denser liquids occupy fewer fluid ounces. Equal volumes of denser liquids have larger masses in grams.',
    ],
    table: WATER_FL_OZ_TABLE,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Grams to fl oz Converter',
    paragraphs: [
      '1. Select a substance from the dropdown (Water is the default).',
      '2. Check or edit the suggested density; choose Custom density when needed.',
      '3. Enter a mass in grams (or another mass unit).',
      '4. Read the calculated volume — default unit is US fluid ounces.',
      '5. Switch the volume unit to UK fl oz (or other volume units) when needed; physical volume is preserved.',
      '6. Or enter volume to calculate mass instead.',
      '7. Do not confuse mass ounces (oz) with fluid ounces (volume).',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Grams in mL Converter, Gal to kg Converter, Gallons to Grams Conversion, Fluid Ounces to Pounds Conversion, Gallons to Tons Converter, and other density-based mass–volume tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GRAMS_TO_FL_OZ_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Grams Are in a Fluid Ounce?',
    answer: `A fluid ounce measures volume, so the corresponding mass depends on density. For water at ≈ 1 g/mL: 1 US fl oz ≈ ${formatMeasure(Number(US_FL_OZ_IN_ML.toFixed(2)))} grams, and 1 UK fl oz ≈ ${formatMeasure(Number(UK_FL_OZ_IN_ML.toFixed(2)))} grams. Other substances differ.`,
  },
  {
    question: 'How Many Grams Are in 12 fl oz of Evaporated Milk?',
    answer: `Assuming US fluid ounces and a density of 1.07 g/mL: 12 × ${US_FL_OZ_IN_ML} × 1.07 ≈ ${formatMeasure(Number(evaporated12Us.toFixed(2)))} g. Therefore, 12 US fl oz of evaporated milk has an approximate mass of ${formatMeasure(Number(evaporated12Us.toFixed(2)))} grams.`,
  },
  {
    question: 'Is 1 Fluid Ounce Equal to 28 Grams?',
    answer: `Not necessarily. A fluid ounce measures volume; a gram measures mass. One US fl oz of water is about ${formatMeasure(Number(US_FL_OZ_IN_ML.toFixed(2)))} g, while one imperial fl oz of water is about ${formatMeasure(Number(UK_FL_OZ_IN_ML.toFixed(2)))} g.`,
  },
  {
    question: 'How Do I Convert 100 Grams to US Fluid Ounces?',
    answer: `Determine density in g/mL, then US fl oz = 100 ÷ (Density × ${US_FL_OZ_IN_ML}). For water at 1 g/mL, the result is approximately ${formatMeasure(Number(water100Us.toFixed(4)))} US fl oz.`,
  },
  {
    question: 'Why Do Honey and Water Have Different Fluid Ounce Conversions?',
    answer: `Because their densities differ. Honey is typically denser than water, so the same mass of honey occupies less volume. At 1.42 g/mL, 100 g of honey is about ${formatMeasure(Number(honey100Us.toFixed(4)))} US fl oz, versus about ${formatMeasure(Number(water100Us.toFixed(4)))} US fl oz for water.`,
  },
];
