import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Winch Size Calculator' },
  { id: 'what-winch', label: 'What Is a Winch?' },
  { id: 'how-works', label: 'How Does a Winch Work?' },
  { id: 'used-for', label: 'Vehicle Winch Uses' },
  { id: 'what-size', label: 'What Size Winch Do I Need?' },
  { id: 'formula', label: 'Winch Size Formula' },
  { id: 'capacity-vs-weight', label: 'Capacity vs Vehicle Weight' },
  { id: 'how-calc', label: 'How to Calculate Pulling Force' },
  { id: 'rolling', label: 'What Is Rolling Resistance?' },
  { id: 'terrain', label: 'How Terrain Affects Size' },
  { id: 'slope', label: 'How Slope Affects Capacity' },
  { id: 'choose', label: 'How to Choose a Vehicle Winch' },
  { id: 'electric-hydraulic', label: 'Electric vs Hydraulic' },
  { id: 'single-double', label: 'Single-Line vs Double-Line' },
  { id: 'line-pull', label: 'What Is Winch Line Pull?' },
  { id: 'snatch', label: 'What Is a Snatch Block?' },
  { id: 'working-load', label: 'Working Load' },
  { id: 'cable-rope', label: 'Cable vs Synthetic Rope' },
  { id: 'too-small', label: 'Can a Winch Be Too Small?' },
  { id: 'too-large', label: 'Can a Winch Be Too Large?' },
  { id: 'safety', label: 'Winch Safety Precautions' },
  { id: 'how-use', label: 'How to Use' },
  { id: 'example', label: 'Sizing Example' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ws-faq', label: 'Frequently Asked Questions' },
];

export const WS_FAQS: readonly FAQItem[] = [
  {
    question: 'What size winch do I need for my vehicle?',
    answer:
      'Estimate from mass, terrain resistance, slope, and a planning factor, and compare with the common 1.5× vehicle-weight guideline. Neither replaces manufacturer ratings or field judgment.',
  },
  {
    question: 'How do I calculate winch size?',
    answer:
      'Compute resistance and slope forces in newtons, sum them, multiply by a safety factor, then convert to lbf/kgf/kN. Optionally compare to 1.5× vehicle weight in pounds.',
  },
  {
    question: 'What does winch pulling capacity mean?',
    answer:
      'Usually the manufacturer’s rated line pull under specified first-layer drum conditions — not necessarily the force available in every recovery situation.',
  },
  {
    question: 'How much winch capacity do I need for a 2,000 kg vehicle?',
    answer:
      'A 1.5× weight guideline is about 6,614 lbf. Resistance-based estimates may be lower or higher depending on terrain and slope — real stuck loads can exceed both.',
  },
  {
    question: 'What does a 9,500 lb winch mean?',
    answer:
      'A common nominal rating of about 9,500 pounds-force of line pull under the maker’s stated test conditions.',
  },
  {
    question: 'Is a 12,000 lb winch enough for an SUV?',
    answer:
      'It may suit many mid/full-size SUVs under the 1.5× guideline, but mounting, electrics, rope, and actual recovery conditions decide adequacy.',
  },
  {
    question: 'What is the 1.5 times winch rule?',
    answer:
      'A recreational guideline: choose a winch whose nominal rating is at least about 1.5× the vehicle’s weight. It is not a guarantee of safe recovery capacity.',
  },
  {
    question: 'How does vehicle weight affect winch size?',
    answer:
      'Heavier mass increases gravitational, rolling/drag, and slope force components, and raises the weight-based guideline.',
  },
  {
    question: 'How does mud affect winch pulling requirements?',
    answer:
      'Mud raises rolling/drag coefficients in this model (e.g. ~0.35 illustrative). Suction and sinkage can demand far more force than the simplified estimate.',
  },
  {
    question: 'How does sand affect winch capacity?',
    answer:
      'Sand often implies higher resistance (illustrative C ≈ 0.30 here). Tire flotation and dig-in still dominate real recoveries.',
  },
  {
    question: 'Does slope angle affect winch size?',
    answer:
      'Yes. Uphill adds F_s = m·g·sin(θ) and changes the normal force in rolling resistance via cos(θ).',
  },
  {
    question: 'How do I calculate slope resistance?',
    answer: 'F_s = m·g·sin(θ) with θ in radians for the sine function (convert from degrees or percent grade first).',
  },
  {
    question: 'What is rolling resistance?',
    answer:
      'The force opposing a rolling vehicle from deformation and surface interaction, modeled here as C_rr·m·g·cos(θ).',
  },
  {
    question: 'What is the difference between pulling force and vehicle weight?',
    answer:
      'Weight is a mass (or mg force). Pulling force is the horizontal/along-slope effort needed under resistance and incline assumptions.',
  },
  {
    question: 'Can I use a winch smaller than my vehicle weight?',
    answer:
      'Some recoveries use multi-line rigging or favorable conditions, but undersizing risks failure. Follow component ratings and professional practice.',
  },
  {
    question: 'Can a winch be too powerful?',
    answer:
      'Excess capacity can stress mounts, bumpers, electrics, and anchors if misused. Match the whole system, not only the stamp rating.',
  },
  {
    question: 'What is the difference between electric and hydraulic winches?',
    answer:
      'Electric winches draw from the vehicle electrical system; hydraulic units are typically powered by a hydraulic circuit with different duty and plumbing needs.',
  },
  {
    question: 'What is winch line pull?',
    answer:
      'The force the winch can exert on the rope under stated conditions. It often decreases as layers build on the drum.',
  },
  {
    question: 'Does winch capacity change with drum layers?',
    answer:
      'Yes — available pull is typically highest on the first layer and lower on outer layers. Check the manufacturer’s chart.',
  },
  {
    question: 'How do I convert kilograms to pounds for a winch?',
    answer:
      'Multiply mass in kg by ≈2.20462 to get pounds mass; the 1.5× guideline uses that mass in pounds as a rating comparison.',
  },
  {
    question: 'How do I convert newtons to pounds-force?',
    answer: 'Divide newtons by ≈4.44822 to get pounds-force (lbf).',
  },
  {
    question: 'What is a winch safety factor?',
    answer:
      'Here it is a user planning multiplier on estimated resistance — distinct from manufacturer working-load limits or rope design factors.',
  },
  {
    question: 'How do I select a winch for off-road recovery?',
    answer:
      'Consider capacity guidelines, mounting, rope type, electrical/hydraulic supply, duty cycle, and accessories — then follow the maker’s instructions.',
  },
  {
    question: 'What winch size is appropriate for an ATV?',
    answer:
      'Often a few thousand pounds nominal, scaled to ATV mass and use. Verify mounts and battery capacity.',
  },
  {
    question: 'What winch size is appropriate for a pickup truck?',
    answer:
      'Many trucks use roughly 9,500–12,000+ lb classes under common guidelines — confirm with actual weight and recovery needs.',
  },
  {
    question: 'How much pulling force is needed to recover a stuck vehicle?',
    answer:
      'It varies widely. Simplified resistance models are a starting point; suction, obstacles, and stalled wheels can demand much more.',
  },
  {
    question: 'Does tire size affect winch recovery requirements?',
    answer:
      'Indirectly — larger, softer tires can change sinkage and rolling resistance. This calculator does not model tire geometry.',
  },
  {
    question: 'What is a snatch block?',
    answer:
      'A pulley used in recovery rigging that can redirect the line and, when correctly rated and rigged, change mechanical advantage.',
  },
  {
    question: 'Does double-line pulling increase available pulling force?',
    answer:
      'It can increase mechanical advantage on the load while changing loads in the rope and anchors. Friction and ratings still limit the system.',
  },
  {
    question: 'What is the difference between winch rating and rope breaking strength?',
    answer:
      'Winch rating is motor/gear pull under stated conditions; rope breaking strength is a separate material limit. Both (and fittings) must be respected.',
  },
  {
    question: 'Is a synthetic winch rope better than steel cable?',
    answer:
      'Synthetic rope is lighter and often safer on recoil, but needs abrasion protection and proper care. Steel is durable but heavier and riskier if it fails.',
  },
  {
    question: 'How important is the winch mounting system?',
    answer:
      'Critical. Mounts and bumpers must be rated for the loads; a strong winch on a weak mount is unsafe.',
  },
  {
    question: 'What is winch duty cycle?',
    answer:
      'How long a winch can pull before needing to cool. Exceeding duty cycle can damage motors and degrade performance.',
  },
  {
    question: 'How do I determine the mass of my loaded vehicle?',
    answer:
      'Use a scale when possible, or estimate curb weight plus passengers, cargo, and armor/gear. Do not confuse estimate with GVWR.',
  },
  {
    question: 'Can I use GVWR to estimate winch size?',
    answer:
      'GVWR is a maximum permitted gross weight — often conservative vs actual mass. Using it increases the guideline; still verify mounts and conditions.',
  },
  {
    question: 'Does tire sinkage increase recovery resistance?',
    answer:
      'Yes. Deep sinkage and suction can exceed simple rolling-resistance coefficients substantially.',
  },
  {
    question: 'How accurate is a winch size calculator?',
    answer:
      'Exact for the formulas and inputs entered. Real recoveries involve variables this tool does not model.',
  },
  {
    question: 'What affects the actual pulling force of a winch?',
    answer:
      'Drum layer, voltage/hydraulic supply, rope condition, motor heat, gear efficiency, and rigging geometry.',
  },
  {
    question: 'Can one winch be used for different vehicles?',
    answer:
      'Sometimes if capacity, mounts, and power suit each use case — re-check ratings and mass each time.',
  },
  {
    question: 'Why should I follow winch manufacturer capacity ratings?',
    answer:
      'They define tested limits for that product. Exceeding ratings risks equipment failure and injury.',
  },
];
