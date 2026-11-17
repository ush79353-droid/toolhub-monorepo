import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { centimetersToFeet, feetToCentimeters, formatLength } from './calculation';
import { CENTIMETERS_PER_FOOT } from './types';

export const FOOT_TO_CM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How Do I Convert ft to cm?' },
  { id: 'conversion-example', label: 'ft to cm Conversion Example' },
  { id: 'related-tools', label: 'Other Length Related Converters' },
  { id: 'foot-to-cm-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_FEET = [0.5, 1, 2, 3, 5, 6, 10, 100] as const;

export const FOOT_TO_CM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How Do I Convert ft to cm?',
    paragraphs: [
      'This calculator converts lengths between feet (ft) and centimeters (cm) instantly in both directions. Common uses include height, furniture and room dimensions, construction, and switching between imperial and metric systems.',
      `The international foot is defined as exactly 0.3048 meters. Because 1 m = 100 cm, one foot equals exactly ${CENTIMETERS_PER_FOOT} centimeters.`,
      `Equivalently, 1 cm ≈ ${formatLength(1 / CENTIMETERS_PER_FOOT)} ft. Prefer dividing by ${CENTIMETERS_PER_FOOT} rather than multiplying by a rounded reciprocal such as 0.03281.`,
      `Feet to centimeters: multiply by ${CENTIMETERS_PER_FOOT}. Example: 6 × ${CENTIMETERS_PER_FOOT} = ${formatLength(feetToCentimeters(6))} cm. Therefore 6 feet equals 182.88 centimeters.`,
      `Centimeters to feet: divide by ${CENTIMETERS_PER_FOOT}. Example: 152.4 ÷ ${CENTIMETERS_PER_FOOT} = ${formatLength(centimetersToFeet(152.4))} ft. Therefore 152.4 centimeters equals 5 feet.`,
    ],
    formula: `cm = ft × ${CENTIMETERS_PER_FOOT} · ft = cm ÷ ${CENTIMETERS_PER_FOOT}`,
    tableHeaders: ['Feet', 'Centimeters'],
    table: TABLE_FEET.map((ft) => [formatLength(ft), formatLength(feetToCentimeters(ft))]),
  },
  {
    id: 'conversion-example',
    title: 'ft to cm Conversion Example',
    paragraphs: [
      `Scenario: a person measures 7 feet of fabric and wants the equivalent in centimeters.`,
      `Calculate: 7 × ${CENTIMETERS_PER_FOOT} = ${formatLength(feetToCentimeters(7))} cm. Therefore 7 feet of fabric is exactly 213.36 centimeters.`,
      `Reverse example: convert 213.36 cm back to feet. 213.36 ÷ ${CENTIMETERS_PER_FOOT} = ${formatLength(centimetersToFeet(213.36))} ft.`,
    ],
    formula: `7 × ${CENTIMETERS_PER_FOOT} = ${formatLength(feetToCentimeters(7))} cm`,
  },
  {
    id: 'related-tools',
    title: 'Other Length Related Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Feet Converter, Feet to Miles Converter, Feet to Yards Conversion, Meter Converter, Distance Converter, cm to m Converter, and Inches Converter. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const FOOT_TO_CM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 6 ft to cm?',
    answer: `Multiply 6 by ${CENTIMETERS_PER_FOOT}: 6 × ${CENTIMETERS_PER_FOOT} = ${formatLength(feetToCentimeters(6))}. Therefore 6 feet equals 182.88 centimeters.`,
  },
  {
    question: 'How Many cm Is 2 Feet?',
    answer: `Multiply 2 by ${CENTIMETERS_PER_FOOT}: 2 × ${CENTIMETERS_PER_FOOT} = ${formatLength(feetToCentimeters(2))}. Therefore 2 feet equals 60.96 centimeters.`,
  },
  {
    question: 'How Many Centimeters Are in One Foot?',
    answer: `There are exactly ${CENTIMETERS_PER_FOOT} centimeters in one international foot.`,
  },
  {
    question: 'How Do I Convert Centimeters to Feet?',
    answer: `Divide centimeters by ${CENTIMETERS_PER_FOOT}. Example: 182.88 ÷ ${CENTIMETERS_PER_FOOT} = ${formatLength(centimetersToFeet(182.88))}. Therefore 182.88 centimeters equals 6 feet.`,
  },
  {
    question: 'Is the Foot-to-Centimeter Conversion Exact?',
    answer:
      'Yes. The international foot is defined as exactly 0.3048 meters. Since one meter is exactly 100 centimeters, one foot equals exactly 30.48 centimeters.',
  },
];
