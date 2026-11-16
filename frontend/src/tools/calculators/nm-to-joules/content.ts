import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NM_TO_JOULES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'overview', label: 'Newton-Meter (Nm) to Joules Calculator' },
  { id: 'n-to-j', label: 'How to Convert Newtons to Joules' },
  { id: 'j-to-nm', label: 'Convert Joules to Newton-Meters' },
  { id: 'j-to-n', label: 'How to Convert Joules to Newtons' },
  { id: 'differences', label: 'Difference Between Newtons, Joules, and Newton-Meters' },
  { id: 'how-to-use', label: 'How to Use the Nm to Joules Calculator' },
  { id: 'force-table', label: 'Force Conversion Table' },
  { id: 'energy-table', label: 'Work/Energy Conversion Table' },
  { id: 'nm-to-joules-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const NM_TO_JOULES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'overview',
    title: 'Newton-Meter (Nm) to Joules Calculator',
    paragraphs: [
      'A newton (N) is the SI unit of force. A joule (J) is the SI unit of work or energy. A newton-meter (N·m) can express work when force acts through a displacement, and it can also express torque. Although work and torque share the same SI base dimensions, they are different physical quantities — do not treat torque as automatically interchangeable with energy.',
      'Dimensionally, 1 N = 1 J/m and 1 J = 1 N·m for work. This calculator converts those unit pairs numerically with a factor of 1, and optionally computes work from force, displacement, and angle.',
    ],
    formula: '1 J = 1 N·m · 1 N = 1 J/m',
  },
  {
    id: 'n-to-j',
    title: 'How to Convert Newtons to Joules',
    paragraphs: [
      'Newtons cannot be converted directly to joules without additional information. Force alone does not determine work. For a constant force, work is W = F d cos(θ), where d is displacement and θ is the angle between force and displacement. When the force is parallel (θ = 0°), W = F d.',
      'Example: 8 N through 3 m at 0° → W = 8 × 3 = 24 J.',
    ],
    formula: 'W = F d cos(θ)',
  },
  {
    id: 'j-to-nm',
    title: 'Convert Joules to Newton-Meters',
    paragraphs: [
      'When expressing work, the numerical value is unchanged: 1 J = 1 N·m. Example: 125 J of work = 125 N·m. Remember that an N·m of torque is not the same statement as an N·m of work.',
    ],
    formula: '1 J = 1 N·m',
  },
  {
    id: 'j-to-n',
    title: 'How to Convert Joules to Newtons',
    paragraphs: [
      'If constant force acts along the displacement, F = W / d. Example: 60 J over 5 m → F = 12 N. More generally, F = W / (d cos(θ)) when cos(θ) ≠ 0 and d ≠ 0.',
    ],
    formula: 'F = W / d · F = W / (d cos(θ))',
  },
  {
    id: 'differences',
    title: 'Difference Between Newtons, Joules, and Newton-Meters',
    paragraphs: [
      'Dimensional equivalence is not the same as physical identity. Use the table below as a quick reference.',
    ],
    tableHeaders: ['Unit', 'Symbol', 'Measures'],
    table: [
      ['Newton', 'N', 'Force'],
      ['Joule', 'J', 'Work or energy'],
      ['Joule per meter', 'J/m', 'Force-equivalent quantity'],
      ['Newton-meter', 'N·m', 'Work or torque, depending on context'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Nm to Joules Calculator',
    paragraphs: [
      '1. Open the Force conversion or Work/energy conversion section.',
      '2. Enter a numeric value in either field of that pair.',
      '3. The paired field updates immediately (factor of 1).',
      '4. Optionally open Calculate work to compute W = F d cos(θ).',
      '5. Share or copy the result; use Reload or Clear to reset.',
    ],
  },
  {
    id: 'force-table',
    title: 'Force Conversion Table',
    paragraphs: ['Because 1 N = 1 J/m exactly:'],
    tableHeaders: ['Newtons', 'Joules per meter'],
    table: [
      ['0 N', '0 J/m'],
      ['1 N', '1 J/m'],
      ['2.5 N', '2.5 J/m'],
      ['10 N', '10 J/m'],
      ['50 N', '50 J/m'],
      ['100 N', '100 J/m'],
      ['1,000 N', '1,000 J/m'],
    ],
  },
  {
    id: 'energy-table',
    title: 'Work/Energy Conversion Table',
    paragraphs: ['Because 1 J = 1 N·m for work/energy:'],
    tableHeaders: ['Joules', 'Newton-meters'],
    table: [
      ['0 J', '0 N·m'],
      ['1 J', '1 N·m'],
      ['2.5 J', '2.5 N·m'],
      ['10 J', '10 N·m'],
      ['25 J', '25 N·m'],
      ['100 J', '100 N·m'],
      ['500 J', '500 N·m'],
      ['1,000 J', '1,000 N·m'],
    ],
  },
];

export const NM_TO_JOULES_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Newtons Are in 5 Joules per Meter?',
    answer: 'Five joules per meter equals five newtons. 5 J/m = 5 N.',
  },
  {
    question: 'How Many Joules Are in 2 Newton-Meters?',
    answer: 'Two newton-meters of work equal two joules. 2 N·m = 2 J.',
  },
  {
    question: 'Can I Convert Newtons Directly to Joules?',
    answer:
      'Not without additional information. Newtons measure force; joules measure work or energy. Displacement and force direction are needed to calculate work.',
  },
  {
    question: 'How Can I Convert Newtons to Joules?',
    answer: 'For constant force parallel to displacement, multiply force by displacement: W = F d.',
  },
  {
    question: 'How Can I Convert Joules to Newton-Meters?',
    answer: 'For work, the numerical value is unchanged: 1 J = 1 N·m.',
  },
  {
    question: 'How Many Newton-Meters Are in 2.98 Joules?',
    answer: '2.98 J = 2.98 N·m when expressing work.',
  },
  {
    question: 'How Many Joules Are in 2.98 Newton-Meters?',
    answer: 'For work: 2.98 N·m = 2.98 J.',
  },
  {
    question: 'One Joule Is Equal to How Many Newton-Meters?',
    answer: 'One joule of work equals one newton-meter.',
  },
  {
    question: 'Is a Newton-Meter the Same as a Joule?',
    answer:
      'They share SI base-unit dimensions, but usage matters. Joules express energy or work; newton-meters also express torque. Torque and energy are distinct.',
  },
  {
    question: 'Can I Convert Newton-Meters of Torque Directly to Joules?',
    answer:
      'Not by renaming units. For rotational work under constant torque about a fixed axis, W = τ θ with θ in radians.',
  },
];
