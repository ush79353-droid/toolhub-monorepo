import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SCALE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'scale-factor', label: 'What Is a Scale Factor?' },
  { id: 'types-of-scales', label: 'Types of Scales' },
  { id: 'architectural-scales', label: 'Popular Architectural Scales' },
  { id: 'area-volume', label: 'Area and Volume Scaling' },
  { id: 'applications', label: 'Applications' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'scale-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const SCALE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'A scale calculator relates a measurement on a drawing, map, or model to the corresponding real-world size. The linear scale factor k is the ratio of scaled length to real length after both values share the same units.',
      'This tool supports length, area, and volume. Area changes with k² and volume with k³, so a linear map scale must never be applied directly to an area or volume without raising it to the correct power.',
    ],
  },
  {
    id: 'scale-factor',
    title: 'What Is a Scale Factor?',
    paragraphs: [
      'For length, k = scaled length ÷ real length. When 0 < k < 1 the representation is a reduction (for example 1:100). When k > 1 it is an enlargement (for example 2:1). When k = 1 the drawing is actual size (1:1).',
      'Ratios such as 1:200 mean one drawing unit represents 200 of the same units in reality, so k = 1/200 = 0.005.',
    ],
    formula: 'k = Scaled Length / Real Length',
  },
  {
    id: 'types-of-scales',
    title: 'Types of Scales',
    paragraphs: [
      'Numerical scales (1:100, 1:1000, 1:50 000) appear on maps and drawings. Architectural scales describe buildings and floor plans. Map scales translate paper or screen distance into geographic distance. Engineering scales enlarge or reduce mechanical parts for clarity.',
    ],
  },
  {
    id: 'architectural-scales',
    title: 'Popular Architectural Scales',
    paragraphs: [
      'Common ratios and their linear scale factors:',
    ],
    table: [
      { left: '1:1', right: '1', third: 'Actual size' },
      { left: '1:2', right: '0.5', third: 'Half size' },
      { left: '1:5', right: '0.2', third: 'One-fifth' },
      { left: '1:10', right: '0.1', third: 'One-tenth' },
      { left: '1:20', right: '0.05', third: 'One-twentieth' },
      { left: '1:50', right: '0.02', third: 'Reduction' },
      { left: '1:100', right: '0.01', third: 'Reduction' },
      { left: '1:200', right: '0.005', third: 'Reduction' },
      { left: '1:500', right: '0.002', third: 'Reduction' },
      { left: '1:1000', right: '0.001', third: 'Reduction' },
    ],
    tableHeaders: ['Scale', 'Scale factor', 'Interpretation'],
  },
  {
    id: 'area-volume',
    title: 'Scale Conversion of Area and Volume',
    paragraphs: [
      'If every linear dimension is multiplied by k, areas multiply by k² and volumes by k³. For a linear scale of 1:10, the area multiplier is 1/100 and the volume multiplier is 1/1000.',
      'When solving for k from areas, take the square root of (scaled area ÷ real area). From volumes, take the cube root. Do not report the area or volume multiplier as if it were the linear scale factor.',
    ],
    formula: 'Scaled = Real × k^d   (d = 1 length, 2 area, 3 volume)',
  },
  {
    id: 'applications',
    title: 'Application of the Scale Calculator',
    paragraphs: [
      'Use scale conversion for architecture, engineering, geography, cartography, construction, model making, technical drawings, floor plans, land mapping, 3D models, and classroom geometry.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Scale Calculator',
    paragraphs: [
      'Choose Length, Area, or Volume. Select whether you need the scale factor, the scaled measurement, or the real measurement. Enter the known values and units, add a ratio such as 1:100 when required, then read the result. Copy or share when finished.',
    ],
  },
];

export const SCALE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a scale factor?',
    answer:
      'A scale factor describes the proportional relationship between a scaled measurement and its original measurement.',
  },
  {
    question: 'How do I calculate a scale factor?',
    answer:
      'For length, divide the scaled length by the corresponding real length after converting both measurements to the same units.',
  },
  {
    question: 'What does a scale of 1:100 mean?',
    answer: 'One unit on the drawing represents 100 of the same units in reality.',
  },
  {
    question: 'What is a scale of 1:50?',
    answer: 'One drawing unit represents 50 corresponding real-world units.',
  },
  {
    question: 'How do I calculate real distance from a map?',
    answer:
      'Divide the scaled distance by the linear scale factor and convert to the required measurement unit.',
  },
  {
    question: 'What is the difference between enlargement and reduction?',
    answer:
      'Enlargement has a linear scale factor greater than one, while reduction has a scale factor between zero and one.',
  },
  {
    question: 'How does scale factor affect area?',
    answer: 'Area changes by the square of the linear scale factor.',
  },
  {
    question: 'How does scale factor affect volume?',
    answer: 'Volume changes by the cube of the linear scale factor.',
  },
  {
    question: 'How do I convert an architectural scale?',
    answer:
      'Express the drawing and actual measurements in consistent units, then use their ratio.',
  },
  {
    question: 'What does 1:1000 mean on a map?',
    answer: 'One unit on the map corresponds to 1000 of the same units in the real world.',
  },
  {
    question: 'Can a scale factor be greater than one?',
    answer: 'Yes. A scale factor greater than one represents enlargement.',
  },
  {
    question: 'Is a scale factor unitless?',
    answer:
      'Yes. After converting measurements to compatible units, the ratio is dimensionless.',
  },
  {
    question: 'What is a 1:1 scale?',
    answer: 'A 1:1 scale represents actual size.',
  },
  {
    question: 'How does scaling work for a 3D object?',
    answer:
      'Every linear dimension changes by the linear scale factor, surface areas by its square, and volume by its cube.',
  },
];
