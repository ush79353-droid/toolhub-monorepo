import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMeasure,
  gallonsToKilograms,
  kilogramsToGallons,
} from './calculation';
import { LITERS_PER_UK_GALLON, LITERS_PER_US_GALLON } from './types';

export const GAL_TO_KG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-it-works', label: 'Gal to kg Converter — How Does It Work?' },
  { id: 'convert-manually', label: 'How to Convert Gallons to kg Manually' },
  { id: 'si-units', label: 'What Is the International System of Units (SI)?' },
  { id: 'related-tools', label: 'Other Related Conversion Calculators' },
  { id: 'gal-to-kg-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

const water1 = gallonsToKilograms(1, 1, 'usGal');
const water5 = gallonsToKilograms(5, 1, 'usGal');
const water10 = gallonsToKilograms(10, 1, 'usGal');
const uk1 = gallonsToKilograms(1, 1, 'ukGal');
const milk1 = gallonsToKilograms(1, 1.03, 'usGal');
const reverse10 = kilogramsToGallons(10, 1, 'usGal');

export const GAL_TO_KG_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-it-works',
    title: 'Gal to kg Converter — How Does It Work?',
    paragraphs: [
      'This converter turns gallons of volume into kilograms of mass — and the reverse — using substance density. Three quantities matter: volume in gallons, density of the substance, and mass in kilograms.',
      'Water is the default material because its density is approximately 1 kg/L near 4 °C, which makes the US-gallon factor easy to remember.',
      `Worked example: 5 US gallons of water at 1 kg/L. 5 × ${LITERS_PER_US_GALLON} × 1 = ${formatMeasure(water5)} kg.`,
    ],
    formula: 'Mass (kg) = Gallons × liters/gallon × density (kg/L)',
  },
  {
    id: 'convert-manually',
    title: 'How to Convert Gallons to kg Manually',
    paragraphs: [
      `For US gallons with density in kg/L: kg = gallons × ${LITERS_PER_US_GALLON} × density.`,
      `Example: 10 US gallons of water at 1 kg/L → 10 × ${LITERS_PER_US_GALLON} = ${formatMeasure(water10)} kg.`,
      `For UK imperial gallons: kg = gallons × ${LITERS_PER_UK_GALLON} × density. Example: 1 UK gallon of water = ${formatMeasure(uk1)} kg.`,
      `Milk near 1.03 kg/L: 1 US gallon ≈ ${formatMeasure(milk1)} kg.`,
    ],
    formula: `US: kg = gal × ${LITERS_PER_US_GALLON} × ρ · UK: kg = gal × ${LITERS_PER_UK_GALLON} × ρ`,
  },
  {
    id: 'si-units',
    title: 'What Is the International System of Units (SI)?',
    paragraphs: [
      'The SI has seven base units: meter (m) for length, kilogram (kg) for mass, second (s) for time, ampere (A) for electric current, kelvin (K) for thermodynamic temperature, mole (mol) for amount of substance, and candela (cd) for luminous intensity.',
      'The kilogram is the SI base unit of mass. The gallon is a customary or imperial volume unit, not an SI unit, which is why density is required to convert gallons to kilograms.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Gallons to Grams Conversion, Gallons to Tons Converter, Fluid Ounces to Pounds Conversion, Cubic Meter to Ton Converter, and other density-based volume-to-mass tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GAL_TO_KG_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert gal to kg?',
    answer: `For US gallons: kg = gal × ${LITERS_PER_US_GALLON} × density, with density in kg/L. For water at approximately 1 kg/L, multiply US gallons by ${LITERS_PER_US_GALLON}.`,
  },
  {
    question: 'How Many kg Are in a Gallon of Water?',
    answer: `At a density of approximately 1 kg/L: 1 US gallon of water ≈ ${formatMeasure(water1)} kg. 1 UK gallon of water ≈ ${formatMeasure(uk1)} kg. The values differ because the two gallon definitions represent different volumes.`,
  },
  {
    question: 'How Many Gallons Are There in 10 kg?',
    answer: `For water with a density of 1 kg/L: US gal = 10 ÷ ${LITERS_PER_US_GALLON} ≈ ${formatMeasure(reverse10)} US gallons.`,
  },
  {
    question: 'Does the Conversion Change for Different Liquids?',
    answer:
      'Yes. Liquids have different densities, so equal volumes do not necessarily have equal masses.',
  },
  {
    question: 'Is One Gallon Always Equal to 3.785 kg?',
    answer: `No. A US gallon is exactly ${LITERS_PER_US_GALLON} liters, but its mass depends on the substance’s density. A US gallon of water at approximately 1 kg/L has a mass of about ${formatMeasure(water1)} kg.`,
  },
];
