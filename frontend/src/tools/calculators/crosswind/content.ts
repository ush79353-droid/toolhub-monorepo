import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CROSSWIND_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Crosswind Calculator' },
  { id: 'what-crosswind', label: 'What Is a Crosswind?' },
  { id: 'what-headwind', label: 'What Is a Headwind?' },
  { id: 'what-tailwind', label: 'What Is a Tailwind?' },
  { id: 'compare', label: 'Crosswind vs. Headwind vs. Tailwind' },
  { id: 'runway-number', label: 'What Is a Runway Number?' },
  { id: 'runway-heading', label: 'How to Calculate Runway Heading' },
  { id: 'wind-direction', label: 'Understanding Wind Direction' },
  { id: 'how-crosswind', label: 'How to Calculate Crosswind' },
  { id: 'crosswind-formula', label: 'Crosswind Formula' },
  { id: 'how-headwind', label: 'How to Calculate Headwind' },
  { id: 'headwind-formula', label: 'Headwind Formula' },
  { id: 'how-tailwind', label: 'How to Calculate Tailwind' },
  { id: 'example', label: 'Crosswind Calculation Example' },
  { id: 'ht-examples', label: 'Headwind and Tailwind Examples' },
  { id: 'chart', label: 'Crosswind Component Chart' },
  { id: 'relative-angle', label: 'What Is Relative Wind Angle?' },
  { id: 'left-right', label: 'Crosswind Direction' },
  { id: 'takeoff-landing', label: 'Wind and Takeoff/Landing' },
  { id: 'max-demonstrated', label: 'Maximum Demonstrated Crosswind' },
  { id: 'gusts', label: 'Wind Gusts' },
  { id: 'true-magnetic', label: 'True vs. Magnetic Wind' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'crosswind-faq', label: 'Frequently Asked Questions' },
];

export const CROSSWIND_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a crosswind?',
    answer:
      'A crosswind is the wind component perpendicular to the runway (or aircraft track). Pilots resolve total wind into crosswind and head/tail components for takeoff and landing planning.',
  },
  {
    question: 'How do I calculate crosswind?',
    answer:
      'Find the relative wind angle θ between wind direction and runway heading, then Crosswind = WindSpeed × |sin(θ)|. Signed form X = V sin(θ) also shows left vs right.',
  },
  {
    question: 'What is the crosswind component formula?',
    answer:
      'X = V × sin(θ), where V is wind speed and θ is the relative wind angle normalized between −180° and +180°.',
  },
  {
    question: 'How do I calculate headwind?',
    answer:
      'Hw = V × cos(θ). Positive Hw is a headwind; negative Hw is a tailwind of magnitude −Hw.',
  },
  {
    question: 'How do I calculate tailwind?',
    answer:
      'Tailwind = max(0, −Hw) where Hw = V cos(θ). When wind is from behind the runway heading, Hw is negative.',
  },
  {
    question: 'What is a relative wind angle?',
    answer:
      'The angular difference between wind-from direction and runway heading, wrapped to (−180°, 180°]. It drives both sine (cross) and cosine (head/tail) components.',
  },
  {
    question: 'How do I calculate runway heading?',
    answer:
      'Approximate magnetic runway heading ≈ runway number × 10°. Runway 27 → 270°, runway 09 → 90°, runway 36 → 360°/0°.',
  },
  {
    question: 'What does runway 36 mean?',
    answer:
      'Runway 36 is oriented roughly toward magnetic north (360°). The reciprocal runway is usually 18.',
  },
  {
    question: 'What does runway 27 mean?',
    answer:
      'Runway 27 points roughly west (270° magnetic). The reciprocal is typically runway 09.',
  },
  {
    question: 'What is a direct crosswind?',
    answer:
      'When θ = ±90°, sin(θ) = ±1 so the entire wind speed is crosswind and head/tail is zero.',
  },
  {
    question: 'How do I know whether crosswind comes from the left or right?',
    answer:
      'With θ = ((W − H + 540) mod 360) − 180, positive signed X means wind from the right; negative means from the left.',
  },
  {
    question: 'What is a crosswind component chart?',
    answer:
      'A plot of X = V sin(θ) versus relative angle. At a fixed V, crosswind peaks at ±90° and is zero at 0° and ±180°.',
  },
  {
    question: 'How do pilots calculate crosswind?',
    answer:
      'Using trigonometry, flight computers, apps, or rules of thumb (e.g., 30° ≈ half, 60° ≈ ~0.87 of wind speed). Exact values use sine of the relative angle.',
  },
  {
    question: 'Why does wind direction matter?',
    answer:
      'Direction sets θ. The same speed can be pure headwind, pure crosswind, or pure tailwind depending on alignment with the runway.',
  },
  {
    question: 'What is the difference between true and magnetic wind direction?',
    answer:
      'True references geographic north; magnetic references magnetic north. METARs are often true; runway numbers are magnetic. Convert before comparing (Magnetic = True − east-positive variation).',
  },
  {
    question: 'What is the difference between headwind and tailwind?',
    answer:
      'Headwind opposes runway direction (helps shorten ground roll). Tailwind is from behind and increases groundspeed for a given airspeed.',
  },
  {
    question: 'Can crosswind exceed wind speed?',
    answer:
      'No. |sin(θ)| ≤ 1, so crosswind magnitude never exceeds total wind speed.',
  },
  {
    question: 'Can headwind and crosswind exist simultaneously?',
    answer:
      'Yes. Any θ that is not a multiple of 90° produces both a longitudinal and a lateral component.',
  },
  {
    question: 'What happens when wind direction matches runway heading?',
    answer:
      'θ ≈ 0°: pure headwind equal to wind speed and zero crosswind.',
  },
  {
    question: 'What happens when wind direction is opposite runway heading?',
    answer:
      'θ ≈ ±180°: pure tailwind equal to wind speed and zero crosswind.',
  },
  {
    question: 'How does crosswind affect takeoff?',
    answer:
      'It creates a weathervane and drift tendency. Pilots use appropriate control inputs per training and aircraft guidance — this calculator only estimates the component.',
  },
  {
    question: 'How does crosswind affect landing?',
    answer:
      'It requires crab or wing-low techniques and may approach demonstrated limits. Always follow the aircraft flight manual and instructor guidance.',
  },
  {
    question: 'How do wind gusts affect crosswind calculations?',
    answer:
      'Gusts raise instantaneous speed. Many pilots evaluate components using gust values as a conservative planning check, per local SOP — not invented here as a universal rule.',
  },
  {
    question: 'What is maximum demonstrated crosswind?',
    answer:
      'A flight-test value published for many types showing the highest crosswind demonstrated during certification. It is not automatically a hard legal limit for every operation.',
  },
  {
    question: 'How do I convert knots to mph?',
    answer:
      '1 knot ≈ 1.150779448 mph. This calculator converts automatically when you change the speed unit.',
  },
  {
    question: 'How do I convert knots to km/h?',
    answer:
      '1 knot = 1.852 km/h. Select km/h in the unit menu to convert while preserving physical speed.',
  },
  {
    question: 'What is the 30-degree crosswind rule?',
    answer:
      'A rule of thumb: at about 30° relative angle, crosswind ≈ half the wind speed (sin 30° = 0.5). Exact values still use sine.',
  },
  {
    question: 'What is the 60-degree crosswind rule?',
    answer:
      'At about 60°, crosswind ≈ 0.87 × wind speed (sin 60° ≈ √3/2). Useful for mental math, not a substitute for precise calculation.',
  },
  {
    question: 'Why is the runway number only an approximate heading?',
    answer:
      'Numbers are rounded to the nearest 10°. Published magnetic headings can differ slightly; use the advanced precise-heading field when needed.',
  },
  {
    question: 'Can I use this calculator for flight planning?',
    answer:
      'Only as an educational/reference aid. Use official weather, approved charts/procedures, and aircraft documentation for actual decisions.',
  },
];
