import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-da', label: 'What Is Dimensional Analysis?' },
  { id: 'base-derived', label: 'Base and Derived Units' },
  { id: 'write-formula', label: 'How to Write a Dimensional Formula' },
  { id: 'dimensional-equations', label: 'Understanding Dimensional Equations' },
  { id: 'da-example', label: 'Dimensional Analysis Example' },
  { id: 'how-to-use', label: 'How to Use the Dimensional Analysis Calculator' },
  { id: 'applications', label: 'Applications of Dimensional Analysis' },
  { id: 'dimensional-analysis-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const DA_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-da',
    title: 'What Is Dimensional Analysis?',
    paragraphs: [
      'Dimensional analysis studies how physical quantities combine through their dimensions; mass, length, time, and the other SI base dimensions. It is used to check equations, convert units, and reason about relationships in physics and engineering.',
      'A physically valid equation must be dimensionally consistent: both sides must reduce to the same combination of base dimensions. Matching dimensions are necessary, but they do not by themselves prove an equation is correct.',
    ],
    formula: 'Distance = Speed × Time → [L] = [LT⁻¹] × [T] = [L]',
  },
  {
    id: 'base-derived',
    title: 'Base and Derived Units',
    paragraphs: [
      'SI defines seven base quantities with base units. Derived quantities are built from those bases (for example, force from mass × acceleration). A dimension describes the physical nature of a quantity; a unit specifies the measurement scale.',
    ],
    tableHeaders: ['Quantity', 'Dimension', 'SI unit'],
    table: [
      ['Length', 'L', 'meter (m)'],
      ['Mass', 'M', 'kilogram (kg)'],
      ['Time', 'T', 'second (s)'],
      ['Electric current', 'I', 'ampere (A)'],
      ['Thermodynamic temperature', 'Θ', 'kelvin (K)'],
      ['Amount of substance', 'N', 'mole (mol)'],
      ['Luminous intensity', 'J', 'candela (cd)'],
    ],
  },
  {
    id: 'write-formula',
    title: 'How to Write a Dimensional Formula',
    paragraphs: [
      'Replace each physical quantity with its base-dimension symbols, then combine exponents for products, quotients, and powers.',
      'Velocity is LT⁻¹, acceleration LT⁻², force MLT⁻², energy ML²T⁻², power ML²T⁻³, and density ML⁻³.',
    ],
    formula: '[v]=LT⁻¹ · [a]=LT⁻² · [F]=MLT⁻² · [E]=ML²T⁻² · [P]=ML²T⁻³ · [ρ]=ML⁻³',
  },
  {
    id: 'dimensional-equations',
    title: 'Understanding Dimensional Equations',
    paragraphs: [
      '1. Identify the quantities in the equation.',
      '2. Write each quantity’s dimensional formula.',
      '3. Add exponents for multiplication and subtract for division.',
      '4. Simplify.',
      '5. Compare both sides. they must match for dimensional consistency.',
      'Newton’s second law: F = ma → [F] = [M][LT⁻²] = MLT⁻².',
    ],
  },
  {
    id: 'da-example',
    title: 'Dimensional Analysis Example',
    paragraphs: [
      'Kinetic energy is often written KE = ½mv². The factor ½ is dimensionless. Dimensionally, [E] = [M][LT⁻¹]² = ML²T⁻², which matches the dimensions of energy (joules).',
    ],
    formula: 'KE = ½mv² → [E] = M × (LT⁻¹)² = ML²T⁻²',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Dimensional Analysis Calculator',
    paragraphs: [
      'Compare two values: select Compare, choose Base or Derived units, pick a physical quantity, enter both measurements with their units, and read the converted equivalents, difference, and comparison.',
      'Convert units: select Convert, choose category and quantity, enter a value, choose From and To units, and read the converted result with its dimensional formula.',
    ],
  },
  {
    id: 'applications',
    title: 'Applications of Dimensional Analysis',
    paragraphs: [
      'Dimensional analysis helps verify equations, convert units, solve physics problems, support engineering calculations, derive scaling relationships, identify dimensionless groups, and catch inconsistent formulas.',
      'Remember: dimensional consistency is necessary but not sufficient to prove a physical law, and different quantities can share the same dimensions (for example torque and energy).',
    ],
  },
];

export const DA_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is Dimensional Analysis Used For?',
    answer:
      'It is used for unit conversion, checking dimensional consistency of equations, and understanding how physical quantities relate through base dimensions.',
  },
  {
    question: 'How Do I Use Dimensional Analysis to Find How Many Minutes Are in 180 Days?',
    answer:
      'Cancel units: 180 days × 24 h/day × 60 min/h = 259,200 minutes.',
  },
  {
    question: 'What Are the Limitations of Dimensional Analysis?',
    answer:
      'It cannot fix dimensionless constants, cannot alone prove an equation is correct, cannot invent arbitrary functional forms, and different quantities may share identical dimensions.',
  },
  {
    question: 'What Is the Dimensional Formula of Power?',
    answer: 'ML²T⁻³.',
  },
  {
    question: 'What Is the Dimensional Formula of Force?',
    answer: 'MLT⁻².',
  },
  {
    question: 'What Is the Dimensional Formula of Energy?',
    answer: 'ML²T⁻².',
  },
  {
    question: 'What Is the Difference Between Dimensions and Units?',
    answer:
      'Dimensions describe the physical nature of a quantity; units define the measurement scale used to express that quantity.',
  },
  {
    question: 'Can Two Quantities Have the Same Dimensions but Different Meanings?',
    answer:
      'Yes. Torque and energy both have dimensions ML²T⁻² but represent different physical concepts.',
  },
];
