import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WINDSOCK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Windsock Calculator' },
  { id: 'what', label: 'What Is a Windsock?' },
  { id: 'how-works', label: 'How Does a Windsock Work?' },
  { id: 'measures', label: 'What Does a Windsock Measure?' },
  { id: 'how-read', label: 'How to Read a Windsock' },
  { id: 'formula', label: 'Windsock Wind Speed Formula' },
  { id: 'knots-per', label: 'Knots per Segment' },
  { id: 'estimate', label: 'How to Estimate Wind Speed' },
  { id: 'conversion', label: 'Wind Speed Conversion' },
  { id: 'full', label: 'Fully Extended Windsock' },
  { id: 'colors', label: 'Windsock Colors' },
  { id: 'where', label: 'Where Are Windsocks Used?' },
  { id: 'aviation', label: 'Windsocks in Aviation' },
  { id: 'direction', label: 'Wind Direction' },
  { id: 'vs-anemometer', label: 'Windsock vs Anemometer' },
  { id: 'vs-vane', label: 'Windsock vs Weather Vane' },
  { id: 'accuracy', label: 'How Accurate Is a Windsock?' },
  { id: 'factors', label: 'Factors Affecting Accuracy' },
  { id: 'how-use', label: 'How to Use' },
  { id: 'example', label: 'Calculation Example' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'windsock-faq', label: 'Frequently Asked Questions' },
];

export const WINDSOCK_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a windsock?',
    answer:
      'A conical fabric tube on a mast that aligns with the wind and extends more as wind speed increases, giving a quick visual cue of direction and approximate strength.',
  },
  {
    question: 'What does a windsock measure?',
    answer:
      'It indicates wind direction clearly and suggests approximate wind speed by how far it extends — not a precise instrument reading.',
  },
  {
    question: 'How does a windsock work?',
    answer:
      'Air enters the wide end, fills the cone, and the fabric lifts and stretches as dynamic pressure overcomes the sock’s weight and stiffness.',
  },
  {
    question: 'How do you read a windsock?',
    answer:
      'The wide open end faces into the wind; the narrow end points downwind. Count roughly how many segments look filled or extended for a speed estimate.',
  },
  {
    question: 'How can I estimate wind speed from a windsock?',
    answer:
      'In a common five-segment rule of thumb, each extended segment ≈ 3 knots (V_kn = 3n). Treat it as approximate.',
  },
  {
    question: 'How many knots does each windsock segment represent?',
    answer:
      'About 3 knots in the simplified model used here. Real socks vary by design and specification.',
  },
  {
    question: 'What does a fully extended windsock indicate?',
    answer:
      'Under this model, about 15 knots (5 × 3). Actual full-extension thresholds depend on the windsock’s construction.',
  },
  {
    question: 'What does a hanging windsock mean?',
    answer:
      'Little or no extension under the model (~0 kn), though light breezes may still leave some socks drooping.',
  },
  {
    question: 'How many segments does a standard windsock have?',
    answer:
      'Many aviation-style socks are marked or pictured with about five bands; designs differ.',
  },
  {
    question: 'How accurate are windsocks?',
    answer:
      'Useful for direction and rough speed bands; much less precise than a calibrated anemometer.',
  },
  {
    question: 'Can a windsock measure exact wind speed?',
    answer:
      'No. It is a visual indicator, not a calibrated speed instrument.',
  },
  {
    question: 'How do I convert knots to mph?',
    answer: 'Multiply knots by ≈1.15078.',
  },
  {
    question: 'How do I convert knots to km/h?',
    answer: 'Multiply knots by 1.852.',
  },
  {
    question: 'How do I convert knots to m/s?',
    answer: 'Multiply knots by ≈0.51444.',
  },
  {
    question: 'How fast is 3 knots in mph?',
    answer: 'About 3.45 mph.',
  },
  {
    question: 'How fast is 6 knots in km/h?',
    answer: 'About 11.11 km/h.',
  },
  {
    question: 'How fast is 9 knots in mph?',
    answer: 'About 10.36 mph.',
  },
  {
    question: 'How fast is 12 knots in km/h?',
    answer: 'About 22.22 km/h.',
  },
  {
    question: 'How fast is 15 knots in mph?',
    answer: 'About 17.26 mph.',
  },
  {
    question: 'What direction does a windsock point?',
    answer:
      'The narrow end points downwind; the open mouth faces into the wind.',
  },
  {
    question: 'Does a windsock point into or away from the wind?',
    answer:
      'The wide opening faces into the wind; the tip streams away with the wind.',
  },
  {
    question: 'Why do airports use windsocks?',
    answer:
      'They give pilots a quick surface wind direction and rough speed cue near runways and helipads.',
  },
  {
    question: 'Are windsocks required at every airport?',
    answer:
      'Requirements vary by jurisdiction and airport type. Many facilities install them; rules are local/regulatory.',
  },
  {
    question: 'What do red and white windsocks mean?',
    answer:
      'High-visibility orange or red/white stripes are common for contrast — not a universal coded “speed meaning.”',
  },
  {
    question: 'What is the difference between a windsock and an anemometer?',
    answer:
      'An anemometer measures wind speed (and often direction) instrumentally; a windsock is a visual fabric indicator.',
  },
  {
    question: 'What is the difference between a windsock and a weather vane?',
    answer:
      'A weather vane mainly shows direction; a windsock shows direction and a rough sense of strength by extension.',
  },
  {
    question: 'Can a windsock show wind gusts?',
    answer:
      'It can flutter or surge with gusts, but it does not report a numeric gust value.',
  },
  {
    question: 'Does windsock length affect wind speed indication?',
    answer:
      'Yes — size, mass, and stiffness change how readily the sock extends at a given speed.',
  },
  {
    question: 'Can windsocks be used at industrial facilities?',
    answer:
      'Yes — often for spill response or outdoor awareness of wind direction near chemical or industrial sites.',
  },
  {
    question: 'What affects the accuracy of a windsock?',
    answer:
      'Dimensions, fabric, installation, turbulence, nearby buildings, damage, and maintenance.',
  },
  {
    question: 'Why does a windsock move in turbulent wind?',
    answer:
      'Gusts and eddies change local flow, so the sock swings and partially collapses intermittently.',
  },
  {
    question: 'Is a windsock reliable in very light wind?',
    answer:
      'Less so — many socks stay limp until a threshold speed is reached.',
  },
  {
    question: 'Can a windsock be used for aviation decisions?',
    answer:
      'It is a helpful cue alongside official weather and instruments — not a sole decision source.',
  },
  {
    question: 'What is the maximum wind speed a windsock can indicate?',
    answer:
      'This five-segment model saturates near 15 kn; stronger winds still fully extend many socks without finer resolution.',
  },
  {
    question: 'How do I use the Windsock Calculator?',
    answer:
      'Enter segments 0–5 or type a speed in kn/mph/km/h/m/s/ft/s; other fields and the schematic update automatically.',
  },
];
