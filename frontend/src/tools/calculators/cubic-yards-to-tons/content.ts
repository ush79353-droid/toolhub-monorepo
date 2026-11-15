import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { calculateCubicYardsToTons, formatMeasure } from './calculation';
import {
  CUBIC_METERS_PER_CUBIC_YARD,
  DEFAULT_CUBIC_YARDS_TO_TONS_INPUT,
  WATER_DENSITY_KG_PER_M3,
} from './types';

export const CUBIC_YARDS_TO_TONS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-cubic-yard', label: 'What Is a Cubic Yard?' },
  { id: 'what-is-a-ton', label: 'What Does a Ton Mean?' },
  { id: 'what-is-density', label: 'What Is Density?' },
  { id: 'how-to-convert', label: 'How to Convert Cubic Yards to Tons' },
  { id: 'metric-tonnes-formula', label: 'Cubic Yards to Metric Tonnes' },
  { id: 'short-tons-formula', label: 'Cubic Yards to US Short Tons' },
  { id: 'tons-to-yards', label: 'Tons to Cubic Yards' },
  { id: 'how-many-tons', label: 'How Many Tons in One Cubic Yard?' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'sand-gravel-soil', label: 'Sand, Gravel, and Soil Weights' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'limitations', label: 'Estimation Limitations' },
  { id: 'cubic-yards-to-tons-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  yards: string;
  tonnes: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
  tableNote?: string;
}

const TABLE_YD3 = [0, 0.5, 1, 2, 3, 5, 10, 20, 50, 100] as const;

export const CUBIC_YARDS_TO_TONS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This calculator converts material volume in cubic yards into mass in tons (and the reverse) using density. The same cubic-yard quantity of water, steel, or gravel does not weigh the same amount, because each material has a different density.',
      'There is no universal cubic-yards-to-tons factor. Always confirm whether you need metric tonnes, US short tons, or imperial long tons, and whether the density is a material density or a bulk density.',
    ],
  },
  {
    id: 'what-is-a-cubic-yard',
    title: 'What Does Cubic Yard Stand For?',
    paragraphs: [
      `A cubic yard is a unit of volume. Its symbol is yd³. One cubic yard is a cube measuring one yard on each edge. Exactly 1 yd³ = 27 ft³ and 1 yd³ = ${CUBIC_METERS_PER_CUBIC_YARD} m³ (from the international yard of 0.9144 m).`,
    ],
  },
  {
    id: 'what-is-a-ton',
    title: 'What Does a Ton Mean?',
    paragraphs: [
      '“Ton” is ambiguous unless the definition is stated. This calculator supports three exact conventions under the international pound:',
      '1 metric tonne (t) = 1000 kg. 1 US short ton = 2000 lb = 907.18474 kg. 1 imperial long ton = 2240 lb = 1016.0469088 kg.',
      'Do not treat a US short ton as a metric tonne. The default result unit here is the metric tonne (t).',
    ],
  },
  {
    id: 'what-is-density',
    title: 'What Is Density?',
    paragraphs: [
      'Density is mass divided by volume: Density = Mass / Volume. In SI form, density (kg/m³) = mass (kg) / volume (m³). Without density, volume alone cannot determine mass.',
      'For loose construction materials, the relevant figure is often bulk density, which includes voids between particles and can change with moisture and compaction.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Cubic Yards to Tons',
    paragraphs: [
      'Choose a substance category and material, or enter a custom density. Confirm density units. Enter volume in cubic yards (or another supported volume unit). Select the ton definition you need. Read the calculated mass. Reverse the process by editing mass instead of volume.',
    ],
  },
  {
    id: 'metric-tonnes-formula',
    title: 'Cubic Yards to Metric Tonnes Formula',
    paragraphs: [
      `Example at ${WATER_DENSITY_KG_PER_M3} kg/m³: 1 yd³ → ${formatMeasure(
        calculateCubicYardsToTons({
          ...DEFAULT_CUBIC_YARDS_TO_TONS_INPUT,
          volume: 1,
          densityValue: WATER_DENSITY_KG_PER_M3,
        }).mass
      )} t.`,
    ],
    formula:
      'Tonnes = Cubic yards × 0.764554857984 × Density (kg/m³) / 1000',
  },
  {
    id: 'short-tons-formula',
    title: 'Cubic Yards to US Short Tons Formula',
    paragraphs: [
      'Convert cubic yards to cubic meters, multiply by density in kg/m³, then divide by 907.18474 kg per US short ton.',
    ],
    formula:
      'US short tons = Cubic yards × 0.764554857984 × Density (kg/m³) / 907.18474',
  },
  {
    id: 'tons-to-yards',
    title: 'Tons to Cubic Yards',
    paragraphs: [
      'Convert mass to kilograms, divide by density in kg/m³ to get cubic meters, then divide by 0.764554857984 to get cubic yards. Example: 5 t at 1000 kg/m³ → 5 m³ ≈ 6.54 yd³.',
    ],
    formula: 'Cubic yards = Mass (kg) ÷ Density (kg/m³) ÷ 0.764554857984',
  },
  {
    id: 'how-many-tons',
    title: 'How Many Tons Are in One Cubic Yard?',
    paragraphs: [
      `It depends on density and which ton you mean. At an assumed density of ${WATER_DENSITY_KG_PER_M3} kg/m³, 1 yd³ ≈ 0.76455 metric tonnes ≈ 0.843 US short tons ≈ 0.752 imperial long tons. Those figures are not universal for gravel, sand, or soil.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Cubic Yards to Tons Conversion Table',
    paragraphs: [
      `Values below use an assumed density of ${WATER_DENSITY_KG_PER_M3} kg/m³ and metric tonnes. They illustrate the calculator engine for that assumption only.`,
    ],
    table: TABLE_YD3.map((yd3) => {
      const r = calculateCubicYardsToTons({
        ...DEFAULT_CUBIC_YARDS_TO_TONS_INPUT,
        volume: yd3,
        densityValue: WATER_DENSITY_KG_PER_M3,
        massUnit: 't',
      });
      return { yards: formatMeasure(yd3), tonnes: formatMeasure(r.mass) };
    }),
    tableNote:
      'Assumed density 1000 kg/m³ (conventional water-like figure). Not a universal cubic-yards-to-tons table and not a material purchase specification.',
  },
  {
    id: 'sand-gravel-soil',
    title: 'Why Sand, Gravel, and Soil Have Different Weights',
    paragraphs: [
      'Composition, particle size, moisture, compaction, and void space all change bulk density. Dry sand and wet sand of the same pile volume can differ substantially in mass. Loose gravel differs from compacted gravel. Topsoil differs from dense fill.',
      'This calculator does not assign one universal density to sand, gravel, or soil. Enter a bulk density appropriate to your material and conditions.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Typical uses include landscaping estimates, construction takeoffs, gravel purchasing, soil haul planning, aggregate quantities, excavation spoil estimates, bulk storage planning, and rough load planning—always with density uncertainty in mind.',
    ],
  },
  {
    id: 'limitations',
    title: 'Important Estimation Limitations',
    paragraphs: [
      'Calculated weights are only as good as the density you enter. Preset densities are approximate and condition-dependent. For vehicle loading limits, structural design, billing disputes, or other safety-critical work, rely on verified material data and qualified professional judgment rather than approximate calculator results alone.',
    ],
  },
];

export const CUBIC_YARDS_TO_TONS_FAQS: readonly FAQItem[] = [
  {
    question: 'How many tons are in one cubic yard?',
    answer:
      'There is no universal answer. It depends on the material density and whether you use metric tonnes, US short tons, or imperial long tons.',
  },
  {
    question: 'How do I convert cubic yards to tons?',
    answer:
      'Convert cubic yards to cubic meters, multiply by density in kg/m³, then divide by the kilograms in the selected ton unit.',
  },
  {
    question: 'How many cubic yards are in one metric tonne?',
    answer:
      'It depends on density. At 1000 kg/m³, 1 tonne = 1 m³ ≈ 1.30795 yd³.',
  },
  {
    question: 'What is the difference between cubic yards and tons?',
    answer: 'Cubic yards measure volume. Tons measure mass.',
  },
  {
    question: 'Are short tons the same as metric tonnes?',
    answer:
      'No. A US short ton equals 907.18474 kg; a metric tonne equals 1000 kg.',
  },
  {
    question: 'What is a long ton?',
    answer: 'An imperial long ton equals 2240 pounds, or 1016.0469088 kg.',
  },
  {
    question: 'How many cubic feet are in a cubic yard?',
    answer: 'Exactly 27 cubic feet.',
  },
  {
    question: 'How do I calculate tons of gravel from cubic yards?',
    answer:
      'Use the gravel’s applicable bulk density, convert cubic yards to cubic meters, multiply by density, then convert kilograms to the ton unit you need.',
  },
  {
    question: 'How do I convert tons back to cubic yards?',
    answer:
      'Convert mass to kilograms, divide by density in kg/m³, then divide by 0.764554857984.',
  },
  {
    question: 'Why does wet sand weigh more than dry sand?',
    answer:
      'Moisture changes the mass in a given bulk volume. The difference depends on the material’s condition.',
  },
  {
    question: 'Can I enter a custom density?',
    answer: 'Yes. Choose Custom material and enter density with the unit you prefer.',
  },
  {
    question: 'Can I calculate soil weight using this calculator?',
    answer:
      'Yes, if you supply an appropriate bulk density. Results are estimates when density is approximate.',
  },
  {
    question: 'Does this calculator support US and metric tons?',
    answer:
      'Yes. You can select metric tonnes, US short tons, or imperial long tons explicitly.',
  },
];
