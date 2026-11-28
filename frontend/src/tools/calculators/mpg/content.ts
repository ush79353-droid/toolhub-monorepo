import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MPG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'MPG Calculator' },
  { id: 'gas-mileage', label: 'What Is Gas Mileage?' },
  { id: 'what-mpg', label: 'What Does MPG Mean?' },
  { id: 'formula', label: 'MPG Formula' },
  { id: 'how-calc', label: 'How to Calculate MPG' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'average', label: 'How to Calculate Average MPG' },
  { id: 'consumption', label: 'Fuel Consumption' },
  { id: 'mpg-l100', label: 'MPG vs L/100 km' },
  { id: 'us-imp', label: 'US vs Imperial MPG' },
  { id: 'convert-l100', label: 'Convert MPG to L/100 km' },
  { id: 'convert-kml', label: 'Convert MPG to km/L' },
  { id: 'fuel-needed', label: 'Fuel Needed for a Trip' },
  { id: 'fuel-cost', label: 'Fuel Cost' },
  { id: 'cost-mile', label: 'Fuel Cost per Mile' },
  { id: 'improve', label: 'How to Improve MPG' },
  { id: 'city-hwy', label: 'City vs Highway MPG' },
  { id: 'combined', label: 'Combined MPG' },
  { id: 'real-world', label: 'Real-World vs Advertised' },
  { id: 'examples', label: 'Examples' },
  { id: 'table', label: 'Conversion Table' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'mpg-faq', label: 'Frequently Asked Questions' },
];

export const MPG_FAQS: readonly FAQItem[] = [
  {
    question: 'What does MPG stand for?',
    answer: 'Miles per gallon — miles driven per gallon of fuel consumed.',
  },
  {
    question: 'How do I calculate MPG?',
    answer:
      'Divide miles driven by US gallons used. Example: 300 mi ÷ 10 US gal = 30 US MPG.',
  },
  {
    question: 'What is the formula for miles per gallon?',
    answer: 'MPG = Miles driven ÷ Gallons used (match US or Imperial gallons).',
  },
  {
    question: 'How do I calculate average MPG?',
    answer:
      'Sum total miles and total gallons across fill-ups, then divide. Do not average trip MPG figures arithmetically.',
  },
  {
    question: 'How many gallons does my car hold?',
    answer:
      'Tank capacity is model-specific — check the owner’s manual or fuel door label. This calculator does not invent tank sizes.',
  },
  {
    question: 'How much fuel does a car use per mile?',
    answer:
      'Gallons per mile = 1 ÷ MPG. At 30 US MPG: 1/30 ≈ 0.0333 US gal per mile.',
  },
  {
    question: 'How do I calculate gallons used from MPG?',
    answer: 'Gallons = Miles ÷ MPG. Example: 300 mi ÷ 30 MPG = 10 US gallons.',
  },
  {
    question: 'How do I calculate miles driven from MPG?',
    answer: 'Miles = MPG × gallons. Example: 30 × 12 = 360 miles.',
  },
  {
    question: 'What is considered good MPG?',
    answer:
      'It depends on vehicle class and market. Compare similar vehicles and your own goals rather than a single universal “good” number.',
  },
  {
    question: 'Is 20 MPG good?',
    answer:
      'Often typical for larger or older vehicles; many compact cars exceed it. Context matters.',
  },
  {
    question: 'Is 25 MPG good?',
    answer: 'Common for many midsize gasoline cars; hybrids and diesels often do better.',
  },
  {
    question: 'Is 30 MPG good?',
    answer: 'Solid for many gasoline cars on mixed driving; still below many hybrids.',
  },
  {
    question: 'Is 35 MPG good?',
    answer: 'Strong for gasoline cars; common territory for efficient highway cruising.',
  },
  {
    question: 'Is 40 MPG good?',
    answer: 'Excellent for many non-hybrid gasoline cars; typical of efficient highway or hybrid use.',
  },
  {
    question: 'Is 50 MPG good?',
    answer: 'Very high — often hybrid or diesel territory under favorable conditions.',
  },
  {
    question: 'What is the difference between city MPG and highway MPG?',
    answer:
      'City cycles include more stops and idling; highway cycles are steadier and often yield higher MPG.',
  },
  {
    question: 'Why is highway MPG often higher than city MPG?',
    answer:
      'Fewer stops, less idling, and more efficient steady speeds usually reduce fuel per mile.',
  },
  {
    question: 'How do I convert MPG to L/100 km?',
    answer: 'L/100 km ≈ 235.214583 ÷ US MPG. Example: 30 US MPG ≈ 7.84 L/100 km.',
  },
  {
    question: 'How do I convert L/100 km to MPG?',
    answer: 'US MPG ≈ 235.214583 ÷ (L/100 km).',
  },
  {
    question: 'How do I convert MPG to km/L?',
    answer: 'km/L ≈ US MPG × 0.425143707. Example: 30 US MPG ≈ 12.75 km/L.',
  },
  {
    question: 'What is the difference between US MPG and Imperial MPG?',
    answer:
      'The Imperial gallon is larger (~4.546 L vs ~3.785 L), so Imperial MPG numbers are higher for the same fuel use.',
  },
  {
    question: 'How much gas do I need to drive 100 miles?',
    answer: 'At 25 US MPG: 100 ÷ 25 = 4 US gallons.',
  },
  {
    question: 'How much gas do I need to drive 200 miles?',
    answer: 'At 20 US MPG: 200 ÷ 20 = 10 US gallons.',
  },
  {
    question: 'How much gas do I need to drive 300 miles?',
    answer: 'At 30 US MPG: 300 ÷ 30 = 10 US gallons.',
  },
  {
    question: 'How much gas do I need to drive 500 miles?',
    answer: 'At 25 US MPG: 500 ÷ 25 = 20 US gallons.',
  },
  {
    question: 'How much does it cost to drive 100 miles?',
    answer:
      'At 25 US MPG and $4/US gal: fuel = 4 gal → cost = $16 (price and economy assumptions).',
  },
  {
    question: 'How do I calculate fuel cost per mile?',
    answer: 'Cost per mile = (fuel price per gallon) ÷ MPG, or total fuel cost ÷ miles.',
  },
  {
    question: 'How do I calculate fuel cost per kilometer?',
    answer: 'Convert miles to km (×1.609344) then divide total fuel cost by kilometers.',
  },
  {
    question: 'How can I improve my MPG?',
    answer:
      'Maintain tire pressure, smooth acceleration, moderate speed, reduce idling and excess weight, and keep up with maintenance.',
  },
  {
    question: 'Does driving faster use more gas?',
    answer:
      'Often yes above efficient cruising speeds due to aerodynamic drag, though exact optima vary by vehicle.',
  },
  {
    question: 'Does idling reduce MPG?',
    answer: 'Yes — fuel burns with zero miles, lowering trip MPG.',
  },
  {
    question: 'Does tire pressure affect MPG?',
    answer: 'Underinflation increases rolling resistance and usually lowers MPG.',
  },
  {
    question: 'Does air conditioning affect MPG?',
    answer: 'AC load can increase fuel use; open windows at high speed also add drag.',
  },
  {
    question: 'Does vehicle weight affect MPG?',
    answer: 'Extra cargo/passengers generally increase fuel use per mile.',
  },
  {
    question: 'Does cold weather reduce MPG?',
    answer:
      'Often yes — denser air, longer warm-ups, winter fuel blends, and cabin heat loads can hurt economy.',
  },
  {
    question: 'Does aggressive driving lower MPG?',
    answer: 'Hard acceleration and braking typically waste fuel and lower MPG.',
  },
  {
    question: 'Why is my actual MPG lower than advertised?',
    answer:
      'Lab cycles differ from your traffic, climate, load, maintenance, and driving style.',
  },
  {
    question: 'Can I calculate MPG using liters?',
    answer:
      'Yes — convert liters to US (or Imperial) gallons, or use km/L and L/100 km modes.',
  },
  {
    question: 'Can I calculate MPG using kilometers?',
    answer:
      'Yes — convert km to miles, or work in km/L and L/100 km directly.',
  },
  {
    question: 'How do I compare fuel economy between two cars?',
    answer:
      'Compare fuel used (or cost) over the same distance after converting both economies to the same basis.',
  },
  {
    question: 'How do I calculate fuel savings from better MPG?',
    answer:
      'Fuel saved = Distance × (1/oldMPG − 1/newMPG). Example: 1000 mi, 25→40 MPG → 15 US gal saved.',
  },
  {
    question: 'How many miles can I drive with 10 gallons?',
    answer: 'At 30 US MPG: 10 × 30 = 300 miles (constant economy assumed).',
  },
  {
    question: 'How many miles can I drive with 15 gallons?',
    answer: 'At 40 US MPG: 15 × 40 = 600 miles.',
  },
  {
    question: 'How much fuel does a 30 MPG car use over 300 miles?',
    answer: '300 ÷ 30 = 10 US gallons.',
  },
  {
    question: 'What is the relationship between MPG and fuel consumption?',
    answer:
      'They are inverse views of the same efficiency. Higher MPG ↔ lower L/100 km for the same units basis.',
  },
];
