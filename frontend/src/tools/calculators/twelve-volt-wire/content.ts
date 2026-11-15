import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TWELVE_VOLT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-12v-wire', label: 'What Is a 12 Volt Wire Size Calculator?' },
  { id: 'how-to-calculate', label: 'How to Calculate Wire Size for 12V DC' },
  { id: 'why-size-matters', label: 'Why Wire Size Matters at 12 Volts' },
  { id: 'distance', label: 'How Distance Affects 12V Wire Size' },
  { id: 'copper-aluminum', label: 'Copper vs. Aluminum' },
  { id: 'awg-mm2', label: 'AWG and mm²' },
  { id: 'allowable-drop', label: 'What Is Allowable Voltage Drop?' },
  { id: 'worked-example', label: 'Worked 12V Voltage-Drop Example' },
  { id: 'temperature', label: 'How Temperature Affects Resistance' },
  { id: 'automotive', label: 'Automotive 12V Wiring' },
  { id: 'solar', label: 'Solar and Battery Systems' },
  { id: 'ampacity', label: 'Voltage Drop vs. Ampacity' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'twelve-volt-faq', label: 'Frequently Asked Questions' },
];

export const TWELVE_VOLT_FAQS: readonly FAQItem[] = [
  {
    question: 'What wire size do I need for 12 volts?',
    answer:
      'There is no single size. It depends on current, one-way length, material, temperature, and how much voltage you can lose. This calculator estimates the copper or aluminum area that keeps a two-wire DC drop within the percentage you enter. It does not check ampacity.',
  },
  {
    question: 'How do I calculate wire size for 12V DC?',
    answer:
      'For equal supply and return wires, voltage drop is 2 × I × ρ × L / A. Rearranged, the minimum area is A = 2 × ρ × I × L / Vdrop. ρ is the resistivity at the conductor temperature, L is the one-way length, and Vdrop is 12 V times your percentage.',
  },
  {
    question: 'Does wire length affect 12V voltage drop?',
    answer:
      'Yes. Drop rises in proportion to length. The length you enter is one way. The model multiplies by two because the current also returns.',
  },
  {
    question: 'What is an acceptable voltage drop for 12V?',
    answer:
      'The default 3% of 12 V is 0.36 V. That is a planning target used by this form, not a rule that every circuit must meet. Sensitive electronics, motors, and long solar runs may need a tighter or looser target.',
  },
  {
    question: 'Can I use 16 AWG wire for a 12V circuit?',
    answer:
      'Only if both the voltage-drop area and the ampacity of that installation allow it. ASTM B258 gives 16 AWG a solid area near 1.31 mm². This page does not state a maximum current for 16 AWG.',
  },
  {
    question: 'How many amps can 14 AWG wire carry?',
    answer:
      'This calculator does not answer that. Ampacity depends on insulation, terminals, bundling, ambient temperature, and the code or manufacturer table that applies. 14 AWG has a solid area near 2.08 mm², which is a geometry fact, not a current rating.',
  },
  {
    question: 'Is copper better than aluminum for 12V wiring?',
    answer:
      'Copper has lower resistivity in the IEC 60228 values used here, so the same current and length need less area. Aluminum is lighter and is used when the installation, terminations, and corrosion practice are suitable. The calculator only compares resistance, not those installation issues.',
  },
  {
    question: 'What is the difference between AWG and mm²?',
    answer:
      'AWG is a diameter series defined by ASTM B258. mm² is a nominal cross-sectional area. A converted AWG area is not the same product as the next metric cable size. The results list each series separately.',
  },
  {
    question: 'Does this calculator account for the return wire?',
    answer:
      'Yes. The default model is a two-wire DC circuit with the same material and length on the supply and the return. It does not assume a chassis return has zero resistance.',
  },
  {
    question: 'Can I use this calculator for solar or automotive wiring?',
    answer:
      'You can use it as a voltage-drop estimate for a 12 V DC two-wire run. Solar, marine, and vehicle wiring also depend on fusing, voltage at the device, vibration, temperature, and the maker’s instructions. Those are not calculated here.',
  },
];
