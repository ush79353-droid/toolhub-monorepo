import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  calculateTorqueToHp,
  formatPowerNumber,
  rpmToRadiansPerSecond,
} from './calculation';
import {
  DEFAULT_TORQUE_TO_HP_INPUT,
  NEWTON_METERS_PER_FOOT_POUND,
  WATTS_PER_MECHANICAL_HP,
  WATTS_PER_METRIC_HP,
} from './types';

export const TORQUE_TO_HP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-horsepower', label: 'What Is Horsepower?' },
  { id: 'what-is-torque', label: 'What Is Torque?' },
  { id: 'speed-and-hp', label: 'Speed and Horsepower' },
  { id: 'torque-vs-hp', label: 'Torque vs Horsepower' },
  { id: 'formula', label: 'Torque to HP Formula' },
  { id: 'worked-example', label: 'Worked Example' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'applications', label: 'Applications' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'torque-to-hp-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  left: string;
  right: string;
  mid?: string;
  mid2?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly ConversionTableRow[];
  tableHeaders?: readonly string[];
  tableNote?: string;
}

const demo = calculateTorqueToHp(DEFAULT_TORQUE_TO_HP_INPUT);
const TABLE_NM = [10, 25, 50, 75, 100, 150, 200, 250, 500] as const;
const TABLE_RPM = 3000;

export const TORQUE_TO_HP_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Torque to HP Calculator finds mechanical shaft power from torque and rotational speed, then expresses that power in watts, kilowatts, or horsepower. Torque alone cannot become horsepower — angular velocity is required.',
      'Canonical relationship: P = τ × ω with torque in N·m, angular speed in rad/s, and power in watts.',
    ],
  },
  {
    id: 'what-is-horsepower',
    title: 'What Is Horsepower?',
    paragraphs: [
      `Horsepower is a unit of power. Mechanical horsepower is defined as 550 ft·lbf/s, which equals exactly ${formatPowerNumber(WATTS_PER_MECHANICAL_HP)} W. Metric horsepower (PS) is exactly ${WATTS_PER_METRIC_HP} W. This calculator keeps those definitions separate.`,
    ],
    formula: `1 mechanical hp = 550 ft·lbf/s ≈ ${formatPowerNumber(WATTS_PER_MECHANICAL_HP)} W`,
  },
  {
    id: 'what-is-torque',
    title: 'What Is Torque?',
    paragraphs: [
      'Torque is the rotational effect of a force about an axis. For a force F applied at lever arm r with angle θ between them: τ = r × F × sin(θ). When the force is perpendicular, torque = force × lever arm.',
      `SI torque is the newton-meter (N·m). Foot-pound-force is related by 1 ft·lbf = ${formatPowerNumber(NEWTON_METERS_PER_FOOT_POUND)} N·m. Torque is not energy, even though N·m and J share dimensions.`,
    ],
    formula: 'τ = r × F × sin(θ)',
  },
  {
    id: 'speed-and-hp',
    title: 'Is Speed Related to Horsepower?',
    paragraphs: [
      'Yes. Power is torque times angular velocity. The same torque at a higher RPM delivers more shaft power (and more horsepower) unless torque falls enough to offset the speed increase. RPM is converted with ω = 2π × RPM / 60.',
    ],
    formula: 'P = τ × ω',
  },
  {
    id: 'torque-vs-hp',
    title: 'Torque vs Horsepower',
    paragraphs: [
      'Torque measures rotational moment. Horsepower measures the rate of doing mechanical work. High torque at low speed can still mean modest horsepower; high RPM with falling torque may also limit power. Use both quantities for the application at hand.',
    ],
  },
  {
    id: 'formula',
    title: 'Torque to HP Formula',
    paragraphs: [
      'In SI: Power(W) = Torque(N·m) × RPM × 2π / 60, then HP = Power(W) / WattsPerHP for the selected horsepower definition.',
      `With torque in ft·lbf and mechanical horsepower: HP = Torque(ft·lbf) × RPM × 2π / 33000 ≈ Torque(ft·lbf) × RPM / ${formatPowerNumber(33000 / (2 * Math.PI))}.`,
    ],
    formula: 'HP = τ(N·m) × RPM × 2π / (60 × WattsPerHP)',
  },
  {
    id: 'worked-example',
    title: 'How to Calculate Horsepower',
    paragraphs: [
      `Given torque 100 N·m and speed 3000 rpm: ω = 3000 × 2π / 60 ≈ ${formatPowerNumber(rpmToRadiansPerSecond(3000))} rad/s.`,
      `Power P = 100 × ω ≈ ${formatPowerNumber(demo.powerW)} W ≈ ${formatPowerNumber(demo.powerDisplay)} kW.`,
      `Mechanical horsepower ≈ ${formatPowerNumber(demo.horsepowerDisplay)} hp (using ${formatPowerNumber(WATTS_PER_MECHANICAL_HP)} W per hp).`,
    ],
    formula: `Example ≈ ${formatPowerNumber(demo.horsepowerDisplay)} mechanical hp`,
  },
  {
    id: 'conversion-table',
    title: 'Torque to Horsepower at 3000 RPM',
    paragraphs: [
      `Selected torque values at ${TABLE_RPM} rpm. Power and horsepower come from the shared engine (mechanical hp).`,
    ],
    tableHeaders: ['Torque (N·m)', 'Speed (rpm)', 'Power (kW)', 'Mech. hp'],
    table: TABLE_NM.map((nm) => {
      const row = calculateTorqueToHp({
        ...DEFAULT_TORQUE_TO_HP_INPUT,
        torque: nm,
        speed: TABLE_RPM,
      });
      return {
        left: formatPowerNumber(nm),
        mid: formatPowerNumber(TABLE_RPM),
        mid2: formatPowerNumber(row.powerDisplay),
        right: formatPowerNumber(row.horsepowerDisplay),
      };
    }),
    tableNote: `Fixed speed ${TABLE_RPM} rpm · mechanical hp · P = τω.`,
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Engine and motor shaft power, pumps, generators, industrial drives, and power-transmission estimates all use P = τω. Shaft mechanical power is not the same as electrical input or useful output when efficiency losses matter — account for those separately.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Torque to HP Calculator',
    paragraphs: [
      '1. Enter torque and select its unit.',
      '2. Enter rotational speed and select its unit.',
      '3. Read power and horsepower (or edit power/hp with speed to solve for torque).',
      '4. Switch units; physical quantities are preserved.',
      '5. Copy or share the result, or clear all changes to reset.',
    ],
  },
];

export const TORQUE_TO_HP_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate horsepower from torque?',
    answer:
      'Multiply torque by angular velocity to get watts, then divide by the watts-per-horsepower factor for mechanical or metric horsepower.',
  },
  {
    question: 'What is the torque to horsepower formula?',
    answer: `For mechanical hp with ft·lbf: HP ≈ Torque(ft·lbf) × RPM / ${formatPowerNumber(33000 / (2 * Math.PI))}. Prefer SI: P(W) = τ(N·m) × ω(rad/s), then divide by ${formatPowerNumber(WATTS_PER_MECHANICAL_HP)}.`,
  },
  {
    question: 'How do I calculate horsepower from Newton-meters?',
    answer:
      'Convert RPM to rad/s, compute P = τ × ω in watts, then convert watts to horsepower.',
  },
  {
    question: 'How much torque is required to produce 1 horsepower?',
    answer: `It depends on speed. At about ${formatPowerNumber(33000 / (2 * Math.PI))} rpm, 1 ft·lbf produces 1 mechanical horsepower.`,
  },
  {
    question: 'Can I calculate horsepower without RPM?',
    answer: 'Not from torque alone. You need rotational speed or another equivalent angular velocity.',
  },
  {
    question: 'What is better: more torque or more horsepower?',
    answer:
      'Neither is universally better. They describe different characteristics; the right metric depends on the application.',
  },
  {
    question: 'What does RPM mean?',
    answer: 'Revolutions per minute — a measure of rotational speed.',
  },
  {
    question: 'What does torque measure?',
    answer: 'The rotational effect of a force about an axis.',
  },
  {
    question: 'What is the SI unit of torque?',
    answer: 'Newton-meter (N·m).',
  },
  {
    question: 'What is the SI unit of power?',
    answer: 'Watt (W).',
  },
  {
    question: 'How many watts are in one mechanical horsepower?',
    answer: `Exactly ${formatPowerNumber(WATTS_PER_MECHANICAL_HP)} W (from 550 ft·lbf/s).`,
  },
  {
    question: 'What is the difference between mechanical and metric horsepower?',
    answer: `Mechanical hp ≈ ${formatPowerNumber(WATTS_PER_MECHANICAL_HP)} W. Metric PS = ${WATTS_PER_METRIC_HP} W exactly.`,
  },
  {
    question: 'How do I calculate torque from horsepower?',
    answer:
      'Convert horsepower to watts, convert speed to rad/s, then τ = P / ω (nonzero speed required).',
  },
  {
    question: 'Can horsepower be negative?',
    answer:
      'Signed power can be negative under a chosen sign convention for torque and rotation direction.',
  },
  {
    question: 'Does higher RPM always mean higher horsepower?',
    answer:
      'Not necessarily. Power depends on both torque and angular velocity; falling torque can offset rising speed.',
  },
  {
    question: 'Is torque the same as force?',
    answer: 'No. Torque is force’s rotational effect about an axis and uses different units.',
  },
  {
    question: 'Can torque be converted directly to horsepower?',
    answer: 'No. They are different quantities; rotational speed is also required.',
  },
];
