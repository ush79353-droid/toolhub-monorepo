import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  calculatePipeArea,
  calculatePsiToGpm,
  formatFlowNumber,
} from './calculation';
import {
  CUBIC_METERS_PER_US_GALLON,
  DEFAULT_PSI_TO_GPM_INPUT,
  DEFAULT_WATER_DENSITY,
  PASCALS_PER_ATM,
  STANDARD_ATM_PSI,
} from './types';

export const PSI_TO_GPM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'psi-and-gpm', label: 'PSI and GPM' },
  { id: 'bernoulli', label: "Bernoulli's Equation" },
  { id: 'calculating-gpm', label: 'Calculating GPM from Pressure' },
  { id: 'worked-example', label: 'Worked Example' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'diameter-and-flow', label: 'Pipe Diameter and Flow' },
  { id: 'real-pipe-losses', label: 'Pressure Losses in Real Pipes' },
  { id: 'psi-to-gpm-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

const demo = calculatePsiToGpm(DEFAULT_PSI_TO_GPM_INPUT);
const demoDeltaPsi = 50 - STANDARD_ATM_PSI;
const demoAreaM2 = calculatePipeArea(0.02);

export const PSI_TO_GPM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'PSI (pounds-force per square inch) measures pressure. GPM (US gallons per minute) measures volumetric flow rate. Those quantities describe different physical properties, so there is no universal constant that converts PSI into GPM by itself.',
      'This calculator estimates liquid flow from a pressure difference, the internal pipe diameter (or flow area), fluid density, and an optional discharge coefficient. The default model is an idealized Bernoulli discharge for steady, incompressible liquid flow — useful for order-of-magnitude estimates, not a complete pipe-network design tool.',
    ],
  },
  {
    id: 'psi-and-gpm',
    title: 'PSI and GPM',
    paragraphs: [
      'PSI is a pressure unit: force per unit area. Absolute pressure (psia) is measured from vacuum; gauge pressure (psig) is measured relative to a local atmospheric reference. Always keep inlet and exit pressures on the same reference before subtracting them.',
      'GPM is a volumetric flow unit. This tool defaults to US liquid gallons per minute (1 US gallon = 0.003785411784 m³). Imperial gallons are larger and are offered as a separate unit option.',
      'Typical contexts include water supply, irrigation, pumps, hydraulics, and industrial piping — always with the model assumptions stated on the calculator.',
    ],
  },
  {
    id: 'bernoulli',
    title: "What Is Bernoulli's Equation?",
    paragraphs: [
      'Along a streamline for steady, inviscid, incompressible flow, Bernoulli’s relation can be written as P + ½ρv² + ρgh = constant. Here P is pressure, ρ is density, v is speed, g is gravity, and h is elevation.',
      'When elevation change and upstream kinetic energy are negligible, a pressure drop can be related to an ideal exit speed v = √(2ΔP / ρ). Multiplying by flow area gives volumetric flow. Real pipes add friction, fittings, roughness, and other losses that this ideal model does not include.',
    ],
    formula: 'P + ½ρv² + ρgh = constant',
  },
  {
    id: 'calculating-gpm',
    title: 'Calculating GPM from Pressure',
    paragraphs: [
      'Compute the driving pressure difference ΔP = Pinlet − Poutlet in consistent units, convert to pascals, then form the ideal velocity and flow:',
    ],
    formula: 'Q = Cd × A × √(2ΔP / ρ)   ·   US gpm = Q(m³/s) × 60 / 0.003785411784',
  },
  {
    id: 'worked-example',
    title: 'Worked Example',
    paragraphs: [
      `Water (ρ = ${formatFlowNumber(DEFAULT_WATER_DENSITY)} kg/m³), Cd = 1, inlet 50 psia, exit ≈ ${formatFlowNumber(STANDARD_ATM_PSI)} psia (1 atm = ${PASCALS_PER_ATM} Pa), internal diameter 2 cm.`,
      `ΔP ≈ ${formatFlowNumber(demoDeltaPsi)} psi ≈ ${formatFlowNumber(demo.deltaPPa)} Pa. Area A = πd²/4 ≈ ${formatFlowNumber(demoAreaM2)} m². Ideal speed ≈ ${formatFlowNumber(demo.velocityMs)} m/s. Flow ≈ ${formatFlowNumber(demo.flowM3s)} m³/s ≈ ${formatFlowNumber(demo.flowUsGpm)} US gpm (rounded for display; the engine keeps full precision).`,
      'Treat this as an idealized discharge estimate. Friction length, roughness, valves, and elevation changes can change the real flow substantially.',
    ],
    formula: `Example result ≈ ${formatFlowNumber(demo.flowUsGpm)} US gpm`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the PSI to GPM Calculator',
    paragraphs: [
      '1. Enter pressure inside the pipe and pressure at the exit using the same absolute or gauge reference.',
      '2. Enter the internal pipe diameter (or edit area to back-calculate diameter).',
      '3. Review density (default water) and discharge coefficient (ideal Cd = 1).',
      '4. Read the flow in US gpm or switch to another volumetric unit.',
      '5. Copy or share the result, or clear all changes to restore defaults.',
    ],
  },
  {
    id: 'diameter-and-flow',
    title: 'Pipe Diameter and Flow Rate',
    paragraphs: [
      'For a circular section, A = πd²/4, so area grows with the square of diameter. Under a fixed ideal velocity, volumetric flow therefore also scales with d² — doubling diameter multiplies ideal area (and ideal Q) by four.',
      'In real piping, friction and other losses also change with diameter and length, so the simple d² scaling is only a statement about the ideal model, not a guarantee for every network.',
    ],
    formula: 'A = πd² / 4   ·   Q ∝ d² (ideal velocity held fixed)',
  },
  {
    id: 'real-pipe-losses',
    title: 'Pressure Losses in Real Pipes',
    paragraphs: [
      'Actual flow depends on pipe length, internal roughness, viscosity, diameter, fittings, valves, elevation changes, flow regime, and pump curves. Darcy–Weisbach (and related engineering methods) are standard approaches for friction losses.',
      'Do not treat the ideal Bernoulli discharge relation as a complete pipe-loss model. Use a hydraulic model matched to the system whenever design decisions depend on the result.',
    ],
  },
];

export const PSI_TO_GPM_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I convert PSI directly to GPM?',
    answer:
      'No. PSI measures pressure and GPM measures volumetric flow rate. You need a pressure difference, flow area, fluid density, and a flow model — there is no universal PSI→GPM constant.',
  },
  {
    question: 'What information is needed to calculate GPM from PSI?',
    answer:
      'At minimum: a consistent pressure difference, effective flow area (from internal diameter), fluid density, and model assumptions. Real pipe networks may also need length, roughness, fittings, and elevation data.',
  },
  {
    question: 'What is the formula for GPM from PSI?',
    answer: `For the ideal incompressible model: Q = Cd × A × √(2ΔP / ρ) with SI units, then US gpm = Q × 60 / ${CUBIC_METERS_PER_US_GALLON}.`,
  },
  {
    question: 'How does pipe diameter affect GPM?',
    answer:
      'For a fixed ideal velocity, flow scales with cross-sectional area, which grows with the square of diameter. Real systems may deviate because losses also change.',
  },
  {
    question: 'What is the difference between PSI and GPM?',
    answer:
      'PSI is a pressure unit (force per area). GPM is a volumetric flow-rate unit (volume per time).',
  },
  {
    question: 'What is a typical water density used in calculations?',
    answer: `This calculator defaults to approximately ${formatFlowNumber(DEFAULT_WATER_DENSITY)} kg/m³. Density varies with temperature and composition.`,
  },
  {
    question: 'What does 14.7 PSI represent?',
    answer: `About standard atmospheric pressure when written as absolute pressure. Internally this tool uses 1 atm = ${PASCALS_PER_ATM} Pa (≈ ${formatFlowNumber(STANDARD_ATM_PSI)} psi).`,
  },
  {
    question: 'What is the difference between PSIA and PSIG?',
    answer:
      'PSIA is absolute pressure from vacuum. PSIG is gauge pressure relative to a reference atmosphere. Do not mix the two when computing ΔP.',
  },
  {
    question: 'Does increasing pressure always increase GPM?',
    answer:
      'A larger driving pressure difference tends to increase ideal flow when other inputs are fixed, but real systems depend on the full hydraulic path.',
  },
  {
    question: 'Can I calculate GPM from pipe diameter alone?',
    answer:
      'No. Diameter sets area but does not determine flow without a driving ΔP, density, and model assumptions.',
  },
  {
    question: 'Why does pressure drop matter?',
    answer:
      'A pressure difference can supply the mechanical energy that drives fluid motion in the idealized model used here.',
  },
  {
    question: 'How do I calculate pipe cross-sectional area?',
    answer: 'For a circular internal diameter d: A = πd² / 4.',
  },
  {
    question: 'How many liters per minute are in one US GPM?',
    answer:
      'Exactly 1 US gpm = 3.785411784 L/min (1 US liquid gallon = 3.785411784 L).',
  },
  {
    question: 'Can I use the PSI to GPM calculator for gases?',
    answer:
      'The default model assumes incompressible liquid flow. General gas flow needs a compressible-flow treatment; do not treat liquid GPM results as gas predictions.',
  },
  {
    question: 'Is this calculator suitable for engineering design?',
    answer:
      'It provides an estimate under stated assumptions. Final design should use a model appropriate to the piping system and operating conditions.',
  },
];
