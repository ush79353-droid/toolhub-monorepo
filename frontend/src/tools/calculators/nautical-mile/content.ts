import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Nautical Mile Calculator' },
  { id: 'what-is', label: 'What Is a Nautical Mile?' },
  { id: 'why', label: 'Why Are Nautical Miles Used?' },
  { id: 'vs-statute', label: 'Nautical vs Statute Mile' },
  { id: 'to-km', label: 'Nautical Miles to Kilometers' },
  { id: 'to-mi', label: 'Nautical Miles to Miles' },
  { id: 'from-km', label: 'Kilometers to Nautical Miles' },
  { id: 'from-mi', label: 'Miles to Nautical Miles' },
  { id: 'knot', label: 'What Is a Knot?' },
  { id: 'kn-mph', label: 'Knots vs MPH' },
  { id: 'kn-kmh', label: 'Knots to km/h' },
  { id: 'kn-mph-conv', label: 'Knots to mph' },
  { id: 'distance', label: 'Distance from Speed and Time' },
  { id: 'travel-time', label: 'Nautical Travel Time' },
  { id: 'speed-calc', label: 'Speed in Knots' },
  { id: 'marine', label: 'Marine Navigation' },
  { id: 'aviation', label: 'Aviation' },
  { id: 'great-circle', label: 'Great-Circle Distance' },
  { id: 'table', label: 'Conversion Table' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'nm-faq', label: 'Frequently Asked Questions' },
];

export const NM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a nautical mile?',
    answer:
      'An international unit of distance used in marine and aviation navigation, exactly 1,852 meters.',
  },
  {
    question: 'How long is one nautical mile?',
    answer: 'Exactly 1,852 meters (1.852 km), about 1.1508 statute miles.',
  },
  {
    question: 'How many kilometers are in a nautical mile?',
    answer: '1 nmi = 1.852 km exactly.',
  },
  {
    question: 'How many statute miles are in a nautical mile?',
    answer: '1 nmi ≈ 1.150779 statute miles.',
  },
  {
    question: 'How many meters are in a nautical mile?',
    answer: '1 nmi = 1,852 m exactly.',
  },
  {
    question: 'How many feet are in a nautical mile?',
    answer: '1 nmi = 1,852 ÷ 0.3048 ≈ 6,076.115 ft.',
  },
  {
    question: 'How do I convert nautical miles to kilometers?',
    answer: 'Multiply by 1.852. Example: 10 nmi × 1.852 = 18.52 km.',
  },
  {
    question: 'How do I convert nautical miles to miles?',
    answer: 'Multiply by ≈1.150779. Example: 10 nmi ≈ 11.5078 statute miles.',
  },
  {
    question: 'How do I convert kilometers to nautical miles?',
    answer: 'Divide by 1.852. Example: 100 km ÷ 1.852 ≈ 53.996 nmi.',
  },
  {
    question: 'How do I convert miles to nautical miles?',
    answer: 'Multiply by ≈0.868976. Example: 100 mi ≈ 86.898 nmi.',
  },
  {
    question: 'What is the difference between a nautical mile and a regular mile?',
    answer:
      'A nautical mile is longer (1,852 m) than a statute (land) mile (1,609.344 m).',
  },
  {
    question: 'Why do ships use nautical miles?',
    answer:
      'They align with latitude: one minute of latitude is approximately one nautical mile, which simplifies chart work.',
  },
  {
    question: 'Why do airplanes use nautical miles?',
    answer:
      'Aviation shares marine distance/speed conventions (nmi and knots) for navigation and ATC.',
  },
  {
    question: 'What is a knot?',
    answer: 'A unit of speed equal to one nautical mile per hour.',
  },
  {
    question: 'How many knots equal one nautical mile per hour?',
    answer: 'Exactly one: 1 kn = 1 nmi/h.',
  },
  {
    question: 'How many mph is one knot?',
    answer: '1 kn ≈ 1.150779 mph.',
  },
  {
    question: 'How many km/h is one knot?',
    answer: '1 kn = 1.852 km/h exactly.',
  },
  {
    question: 'How do I convert knots to mph?',
    answer: 'Multiply by ≈1.150779. Example: 20 kn ≈ 23.02 mph.',
  },
  {
    question: 'How do I convert knots to km/h?',
    answer: 'Multiply by 1.852. Example: 20 kn = 37.04 km/h.',
  },
  {
    question: 'How do I calculate nautical travel time?',
    answer: 'Time = Distance ÷ Speed. Example: 100 nmi ÷ 20 kn = 5 hours.',
  },
  {
    question: 'How do I calculate distance traveled in knots?',
    answer: 'Distance (nmi) = Speed (kn) × Time (h). Example: 15 kn × 4 h = 60 nmi.',
  },
  {
    question: 'How do I calculate speed using nautical miles?',
    answer: 'Speed (kn) = Distance (nmi) ÷ Time (h).',
  },
  {
    question: 'How far can a boat travel at 10 knots in one hour?',
    answer: '10 nautical miles at a constant 10 kn average.',
  },
  {
    question: 'How far can a boat travel at 20 knots in five hours?',
    answer: '20 × 5 = 100 nautical miles (constant speed assumed).',
  },
  {
    question: 'How long does it take to travel 100 nautical miles at 20 knots?',
    answer: '100 ÷ 20 = 5 hours.',
  },
  {
    question: 'How long does it take to travel 200 nautical miles at 25 knots?',
    answer: '200 ÷ 25 = 8 hours.',
  },
  {
    question: 'How many nautical miles are in 100 kilometers?',
    answer: '100 ÷ 1.852 ≈ 53.996 nmi.',
  },
  {
    question: 'How many nautical miles are in 100 statute miles?',
    answer: '≈ 86.898 nmi.',
  },
  {
    question: 'How many kilometers are in 10 nautical miles?',
    answer: '10 × 1.852 = 18.52 km.',
  },
  {
    question: 'How many miles are in 50 nautical miles?',
    answer: '≈ 57.539 statute miles.',
  },
  {
    question: 'Are nautical miles used for international flights?',
    answer:
      'Yes — flight distances and speeds are commonly expressed in nautical miles and knots.',
  },
  {
    question: 'Is a nautical mile based on the Earth\'s circumference?',
    answer:
      'Historically linked to latitude arcs; the modern international nautical mile is defined as exactly 1,852 m.',
  },
  {
    question: 'Is one nautical mile equal to one minute of latitude?',
    answer:
      'Approximately, near that scale — the Earth is not a perfect sphere, so the modern definition is the fixed 1,852 m length.',
  },
  {
    question: 'What is great-circle distance?',
    answer:
      'The shortest path along the sphere between two points on Earth — used as an approximate route distance.',
  },
  {
    question: 'How do I calculate distance between geographical coordinates?',
    answer:
      'Use a great-circle (haversine) formula; this calculator’s coordinate tool is an educational spherical estimate.',
  },
  {
    question: 'What is the difference between knots and nautical miles?',
    answer: 'Nautical miles measure distance; knots measure speed (nmi per hour).',
  },
  {
    question: 'Can nautical miles measure driving distances?',
    answer:
      'They can convert to statute miles or km, but road travel usually uses land miles or kilometers.',
  },
  {
    question: 'Are nautical miles metric or Imperial?',
    answer:
      'Neither exclusively — the international nmi is SI-defined (1,852 m) and used alongside Imperial/US units.',
  },
  {
    question: 'Can I use nautical miles to estimate flight time?',
    answer:
      'Yes for rough planning: Time ≈ Distance ÷ average speed in knots — not a substitute for flight planning systems.',
  },
  {
    question: 'How accurate is a nautical mile calculator?',
    answer:
      'Unit conversions using 1,852 m are exact. Travel times assume constant speed; real voyages differ due to currents, weather, and routing.',
  },
];
