import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const JOULES_TO_VOLTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-energy', label: 'What Is Energy?' },
  { id: 'what-is-electric-charge', label: 'What Is Electric Charge?' },
  { id: 'what-is-voltage', label: 'What Is Voltage?' },
  { id: 'how-to-convert', label: 'How to Convert Joules to Volts' },
  { id: 'formula', label: 'Joules to Volts Formula' },
  { id: 'examples', label: 'Joules to Volts Calculation Examples' },
  { id: 'how-to-use', label: 'How to Use the Joules to Volts Calculator' },
  { id: 'joules-to-volts-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const JOULES_TO_VOLTS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-energy',
    title: 'What Is Energy?',
    paragraphs: [
      'Energy is the capacity to do work. The joule (J) is the SI unit of energy: one joule equals one newton-meter of work, or the energy transferred when one coulomb of charge moves through a potential difference of one volt.',
      'Electrical energy is energy associated with electric charge and electric potential. Many devices convert electrical energy into light, heat, motion, or stored chemical energy. When a charge Q moves through a potential difference V, the electrical energy transferred is E = VQ (idealized, neglecting losses).',
    ],
    formula: 'E = V × Q',
  },
  {
    id: 'what-is-electric-charge',
    title: 'What Is Electric Charge?',
    paragraphs: [
      'Electric charge is a fundamental property of matter. The SI unit is the coulomb (C). Charges may be positive or negative; like charges repel and opposite charges attract.',
      'Electric current is the rate of charge flow. If a steady current I flows for time t, the transferred charge is Q = It, with I in amperes and t in seconds (1 A = 1 C/s). Example: 2 A for 5 s transfers 10 C.',
    ],
    formula: 'Q = I × t',
  },
  {
    id: 'what-is-voltage',
    title: 'What Is Voltage?',
    paragraphs: [
      'Voltage is electric potential difference; energy transferred per unit charge between two points. The SI unit is the volt (V): 1 V = 1 J/C.',
      'Voltage is not the same as energy. A large energy can correspond to a small voltage if a large charge is involved, and vice versa. Therefore joules alone cannot determine volts; charge must also be known.',
    ],
    formula: '1 V = 1 J/C',
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Joules to Volts',
    paragraphs: [
      '1. Express electrical energy in joules (convert from kJ, Wh, eV, etc. if needed).',
      '2. Express electric charge in coulombs (convert from mC, μC, Ah, etc. if needed).',
      '3. Divide energy by charge: V = E / Q.',
      '4. Express the result in volts (or mV, kV, …).',
      'Example: 1000 J / 10 C = 100 V.',
    ],
    formula: 'V = E / Q',
  },
  {
    id: 'formula',
    title: 'Joules to Volts Formula',
    paragraphs: [
      'Use V = E / Q when energy and charge are known. Use E = VQ when voltage and charge are known. Use Q = E / V when energy and voltage are known. Choose the rearrangement that matches your known quantities, and never divide by zero.',
    ],
    formula: 'V = E / Q ·  E = VQ ·  Q = E / V',
  },
  {
    id: 'examples',
    title: 'Joules to Volts Calculation Examples',
    paragraphs: [
      'Example 1: 500 J and 5 C → V = 500/5 = 100 V.',
      'Example 2: 2 kJ and 20 C → V = 2000/20 = 100 V.',
      'Example 3: 12 V and 25 C → E = 12 × 25 = 300 J.',
      'Example 4: 120 J and 6 V → Q = 120/6 = 20 C.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Joules to Volts Calculator',
    paragraphs: [
      '1. Select whether to calculate voltage, energy, or charge.',
      '2. Enter the two known quantities.',
      '3. Choose units beside each field (physical quantity is preserved when you change units).',
      '4. Read the calculated result in the third field.',
      '5. Use Share Result, Reload Calculator, or Clear All Changes as needed.',
    ],
  },
];

export const JOULES_TO_VOLTS_FAQS: readonly FAQItem[] = [
  {
    question: 'Can you convert joules directly to volts?',
    answer:
      'No. Electric charge must also be known. Voltage is energy per unit charge (V = E / Q).',
  },
  {
    question: 'How many volts are in 1 joule?',
    answer:
      'There is no unique answer without charge. If 1 J is transferred per 1 C, then V = 1 V.',
  },
  {
    question: 'What is the voltage when there are 1,000 J and 10 C?',
    answer: 'V = 1000 / 10 = 100 V.',
  },
  {
    question: 'How do I convert volts into joules?',
    answer: 'Multiply voltage by charge: E = V × Q.',
  },
  {
    question: 'What is the relationship between joules and volts?',
    answer:
      'One volt represents one joule of energy transferred per coulomb of charge (1 V = 1 J/C).',
  },
  {
    question: 'Can voltage be negative?',
    answer:
      'Yes. Voltage is a potential difference, and its sign depends on the chosen reference direction.',
  },
  {
    question: 'Is one joule equal to one volt?',
    answer:
      'No. The joule measures energy; the volt measures electric potential difference (energy per charge).',
  },
  {
    question: 'What is the difference between electrical energy and electrical power?',
    answer:
      'Energy is measured in joules. Power is the rate of energy transfer, measured in watts: P = E / t.',
  },
];
