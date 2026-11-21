import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  fluidOuncesToPounds,
  formatMeasure,
  poundsToFluidOunces,
} from './calculation';

export const FL_OZ_TO_LB_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'mass-volume-density', label: 'Relation Between Mass, Volume, and Density' },
  { id: 'definition-fl-oz-pounds', label: 'Definition of Fluid Ounces and Pounds' },
  { id: 'converting-fl-oz-to-pounds', label: 'Converting Fluid Ounces to Pounds' },
  { id: 'calculating-pounds-to-fl-oz', label: 'Calculating Pounds to Fluid Ounces' },
  { id: 'how-to-use', label: 'Using This Fluid Ounces to Pounds Conversion Tool' },
  { id: 'related-tools', label: 'Other Related Tools' },
  { id: 'fl-oz-to-lb-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const water16Lb = fluidOuncesToPounds(16, 1000);
const water1FlOz = fluidOuncesToPounds(1, 1000);
const reverse1Lb = poundsToFluidOunces(1, 1000);
const custom16 = fluidOuncesToPounds(16, 800);

export const FL_OZ_TO_LB_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'mass-volume-density',
    title: 'Relation Between Mass, Volume, and Density',
    paragraphs: [
      'This calculator converts fluid ounces of volume into pounds of mass (and the reverse) using substance density. There is no universal fluid-ounce-to-pound factor, because fluid ounces measure space while pounds measure matter.',
      'Density is mass per unit volume. In symbols: ρ = m / V. Rearrange for mass: m = ρ V. Rearrange for volume: V = m / ρ.',
      'Equal volumes of different substances do not share the same mass. Sixteen US fluid ounces of water and sixteen US fluid ounces of honey occupy the same volume but have different masses because their densities differ.',
      'Choose a listed ingredient to load an approximate density, or enter a custom density when you have a measured or specification value.',
    ],
    formula: 'ρ = m / V · m = ρ V · V = m / ρ',
  },
  {
    id: 'definition-fl-oz-pounds',
    title: 'Definition of Fluid Ounces and Pounds',
    paragraphs: [
      'A fluid ounce is a unit of volume. A US fluid ounce equals exactly 29.5735295625 mL (0.0000295735295625 m³). An imperial (UK) fluid ounce equals exactly 28.4130625 mL (0.0000284130625 m³). They are not interchangeable.',
      'The avoirdupois pound is a unit of mass: 1 lb = 0.45359237 kg exactly.',
      'Do not confuse fluid ounces with ounces of mass. A fluid ounce measures volume; an avoirdupois ounce (oz) measures mass (1 lb = 16 oz). This calculator treats them as different quantities.',
    ],
    formula: '1 US fl oz = 29.5735295625 mL · 1 Imp fl oz = 28.4130625 mL · 1 lb = 0.45359237 kg',
  },
  {
    id: 'converting-fl-oz-to-pounds',
    title: 'Converting Fluid Ounces to Pounds',
    paragraphs: [
      'Convert volume to cubic meters, multiply by density in kg/m³ to get kilograms, then divide by 0.45359237 to get pounds.',
      'For US fluid ounces: m_lb = (V_US fl oz × 0.0000295735295625 × ρ_kg/m³) / 0.45359237.',
      `Worked example: 16 US fluid ounces of water at 1000 kg/m³. Volume = 16 × 0.0000295735295625 = 0.000473176473 m³. Mass = 1000 × 0.000473176473 = 0.473176473 kg. In pounds: 0.473176473 / 0.45359237 ≈ ${formatMeasure(water16Lb)} lb.`,
      'Therefore 16 US fluid ounces of water weigh approximately 1.04322 pounds at a density of 1000 kg/m³. Other substances produce different results at the same volume.',
    ],
    formula: 'm_lb = (V_US fl oz × 0.0000295735295625 × ρ) / 0.45359237',
    tableHeaders: ['US fluid ounces (water @ 1000 kg/m³)', 'Pounds'],
    table: [
      ['1', formatMeasure(water1FlOz)],
      ['8', formatMeasure(fluidOuncesToPounds(8, 1000))],
      ['16', formatMeasure(water16Lb)],
      ['32', formatMeasure(fluidOuncesToPounds(32, 1000))],
      ['64', formatMeasure(fluidOuncesToPounds(64, 1000))],
      ['128', formatMeasure(fluidOuncesToPounds(128, 1000))],
    ],
  },
  {
    id: 'calculating-pounds-to-fl-oz',
    title: 'Calculating Pounds to Fluid Ounces',
    paragraphs: [
      'Reverse the path: convert pounds to kilograms, divide by density in kg/m³ to get cubic meters, then convert to the selected fluid-ounce unit.',
      `Worked example: 1 pound of water at 1000 kg/m³. Mass = 0.45359237 kg. Volume = 0.45359237 / 1000 = 0.00045359237 m³. In US fluid ounces: 0.00045359237 / 0.0000295735295625 ≈ ${formatMeasure(reverse1Lb)} US fl oz.`,
      'The answer always depends on density. At 800 kg/m³, 16 US fl oz weigh about ' +
        formatMeasure(custom16) +
        ' lb instead of about ' +
        formatMeasure(water16Lb) +
        ' lb for water.',
    ],
    formula: 'V = m / ρ',
  },
  {
    id: 'how-to-use',
    title: 'Using This Fluid Ounces to Pounds Conversion Tool',
    paragraphs: [
      '1. Select a substance from the Ingredient dropdown (default Water).',
      '2. Check the automatically populated density, or edit it.',
      '3. Enter a custom density if your material is not listed or the preset is only approximate.',
      '4. Enter a value in the Volume field (default unit US fl oz).',
      '5. Read the automatically calculated mass in pounds (or another mass unit).',
      '6. Change volume or mass units with the dropdowns. physical quantities are preserved.',
      '7. Enter a mass value to calculate volume in reverse.',
      '8. Use Reload Calculator or Clear All Changes, and share or copy results when useful.',
      'Density must be known and greater than zero for accurate results.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Cubic Feet to Pounds Calculator, Gallons to Pounds Converter, Quarts to Pounds Conversion, CC to Grams Converter, Liters to Pounds Calculator, Density Conversion, Volume Conversion, and Weight Converter. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const FL_OZ_TO_LB_FAQS: readonly FAQItem[] = [
  {
    question: 'Can Fluid Ounces Be Converted Directly to Pounds?',
    answer:
      'Not without knowing the substance’s density. Fluid ounces measure volume, while pounds measure mass. Density connects these two measurements.',
  },
  {
    question: 'How Many Pounds Are in 16 Fluid Ounces of Water?',
    answer: `Assuming US fluid ounces and a water density of 1000 kg/m³: 16 US fl oz ≈ ${formatMeasure(water16Lb)} lb. The result changes slightly with water temperature because density changes.`,
  },
  {
    question: 'Is One Fluid Ounce Equal to One Ounce of Weight?',
    answer:
      'No. A fluid ounce measures volume. An avoirdupois ounce measures mass. They are different physical quantities.',
  },
  {
    question: 'How Do I Convert Fluid Ounces of Oil to Pounds?',
    answer:
      'You must know the oil’s density. Select olive oil or vegetable oil from the ingredient dropdown, or enter the density manually. Then enter the volume in fluid ounces to calculate mass in pounds.',
  },
  {
    question: 'How Do I Convert Pounds Back to Fluid Ounces?',
    answer: `Convert pounds into kilograms, divide by density in kg/m³, and convert the resulting cubic meters to fluid ounces. Example: 1 lb of water at 1000 kg/m³ ≈ ${formatMeasure(reverse1Lb)} US fl oz.`,
  },
  {
    question: 'Are US Fluid Ounces and UK Fluid Ounces the Same?',
    answer:
      'No. A US fluid ounce is approximately 29.5735 mL. An imperial fluid ounce is 28.4130625 mL. Always choose the correct unit system.',
  },
];
