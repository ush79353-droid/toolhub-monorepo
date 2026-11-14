import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { ASTM_E11_BY_DESIGNATION } from './types';

export const MESH_TO_MICRON_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-mesh-size', label: 'What Is Mesh Size?' },
  { id: 'what-is-a-micron', label: 'What Is a Micron?' },
  { id: 'how-to-determine', label: 'How to Determine Mesh Size' },
  { id: 'mesh-opening-formula', label: 'Mesh Opening Formula' },
  { id: 'how-to-convert', label: 'How to Convert Mesh to Micron' },
  { id: 'conversion-table', label: 'Mesh to Micron Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'mesh-to-micron-faq', label: 'Frequently Asked Questions' },
];

export interface MeshTableRow {
  sieve: string;
  um: string;
  mm: string;
}

export interface MeshToMicronGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly MeshTableRow[];
}

const CHART = ['10', '20', '40', '60', '100', '200', '325', '400'] as const;

export const MESH_TO_MICRON_GUIDE_SECTIONS: readonly MeshToMicronGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This converter maps ASTM E11 / US Standard sieve designations to their nominal openings in micrometers, and optionally estimates the clear opening of a square woven mesh when you know mesh count and wire diameter. Mesh count is not a length unit; microns are.',
      'Nominal sieve openings are chart values for test sieves. They are not guaranteed manufactured apertures of every screen, and they are not particle diameters.',
    ],
  },
  {
    id: 'what-is-mesh-size',
    title: 'What Is Mesh Size?',
    paragraphs: [
      'For a conventional woven screen, mesh count is the number of openings per linear inch. Higher mesh counts usually mean smaller openings when wire diameter is similar. ASTM E11 sieve numbers are designations that also specify a nominal aperture size—they are not interchangeable with arbitrary manufacturer mesh charts.',
    ],
  },
  {
    id: 'what-is-a-micron',
    title: 'What Is a Micron?',
    paragraphs: [
      'A micron is a micrometer (µm): one-millionth of a meter, or 0.001 millimeters. Laboratory and process work often reports small openings and particle dimensions in microns.',
    ],
  },
  {
    id: 'how-to-determine',
    title: 'How to Determine Mesh Size',
    paragraphs: [
      'Use a standard sieve chart when you have an ASTM E11 designation—look up the nominal opening. Use the woven-mesh formula only when you know both openings per inch and wire diameter. Do not invent openings from mesh count alone.',
    ],
  },
  {
    id: 'mesh-opening-formula',
    title: 'Mesh Opening Formula',
    paragraphs: [
      'For a conventional square weave with uniform spacing: pitch (mm) = 25.4 ÷ mesh count; opening (mm) = pitch − wire diameter (mm); opening (µm) = opening (mm) × 1000. Example: mesh 100 with 0.1 mm wire → pitch 0.254 mm → opening 0.154 mm = 154 µm.',
    ],
    formula: 'Opening (µm) = (25.4 / Mesh Count − Wire Diameter in mm) × 1000',
    formulaNote: 'Assumes square woven mesh. Does not replace ASTM E11 nominal sieve openings.',
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Mesh to Micron',
    paragraphs: [
      'Select a supported US Standard sieve designation and read its nominal opening. Example: No. 100 → 150 µm. For reverse lookup, enter an opening in µm to find an exact or nearest ASTM E11 designation.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Mesh to Micron Conversion Table',
    paragraphs: [
      'Selected ASTM E11 nominal openings. Full list is available in the calculator sieve selector.',
    ],
    table: CHART.map((des) => {
      const s = ASTM_E11_BY_DESIGNATION[des]!;
      return {
        sieve: s.label,
        um: String(s.openingUm),
        mm: String(s.openingUm / 1000),
      };
    }),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Mesh to Micron Calculator',
    paragraphs: [
      'Choose Standard sieve mode and pick an ASTM E11 designation to read the nominal opening. Open Advanced conversion options for mm, cm, inches, and mils. Switch to Custom woven mesh when mesh count and wire diameter are known, or Micron → nearest sieve for reverse lookup. Copy or reset as needed.',
    ],
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Particle-size analysis, sieving, filtration, mining, construction aggregates, powder processing, laboratory testing, manufacturing, and material screening all use sieve designations and aperture sizes.',
      'Aperture size alone does not guarantee filtration efficiency or a specific particle-size distribution.',
    ],
  },
];

export const MESH_TO_MICRON_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a mesh size?',
    answer:
      'Mesh count describes openings per linear inch in a conventional woven screen. ASTM E11 sieve designations also specify nominal openings in a standard chart.',
  },
  {
    question: 'How do I convert mesh to microns?',
    answer:
      'Select a recognized ASTM E11 sieve designation and look up its nominal opening. For custom woven mesh, calculate using mesh count and wire diameter.',
  },
  {
    question: 'What is 100 mesh in microns?',
    answer: 'US Standard No. 100 corresponds to a nominal opening of 150 micrometers.',
  },
  {
    question: 'What is 200 mesh in microns?',
    answer: 'US Standard No. 200 corresponds to a nominal opening of 75 micrometers.',
  },
  {
    question: 'Is mesh size the same as particle size?',
    answer:
      'No. Mesh identifies the screen or sieve specification, while particle size describes the dimensions of particles.',
  },
  {
    question: 'Can you convert mesh to microns exactly?',
    answer:
      'A standardized nominal sieve opening can be looked up, but actual openings may vary within manufacturing tolerances. Mesh count alone cannot determine the exact opening of arbitrary woven cloth.',
  },
  {
    question: 'Why does a higher mesh number usually mean a smaller opening?',
    answer:
      'More openings per linear inch generally require a smaller pitch between adjacent wires, resulting in smaller apertures for comparable wire diameters.',
  },
  {
    question: 'What is the difference between mesh and microns?',
    answer:
      'Mesh count is a screen-spacing designation, whereas microns are physical length units.',
  },
  {
    question: 'What does 200 mesh size mean?',
    answer: 'For a US Standard No. 200 sieve, the nominal opening is 75 micrometers.',
  },
  {
    question: 'How does wire diameter affect mesh opening?',
    answer: 'For a fixed mesh count, a thicker wire reduces the clear opening.',
  },
];
