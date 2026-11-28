import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GAS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Gas Calculator' },
  { id: 'what-is', label: 'What Is a Gas Calculator?' },
  { id: 'how-much-gas', label: 'How Much Gas Do I Need?' },
  { id: 'how-cost', label: 'How to Calculate Gas Cost' },
  { id: 'efficiency', label: 'What Is Fuel Efficiency?' },
  { id: 'consumption', label: 'How to Calculate Fuel Consumption' },
  { id: 'per-km', label: 'Fuel Cost Per Kilometer' },
  { id: 'road-trip', label: 'How Much Gas Does a Road Trip Use?' },
  { id: 'round-trip', label: 'How to Calculate Round-Trip Fuel Cost' },
  { id: 'per-person', label: 'Gas Cost Per Person' },
  { id: 'mpg-convert', label: 'How to Convert MPG to L/100 km' },
  { id: 'us-uk-mpg', label: 'US MPG vs. UK MPG' },
  { id: 'range', label: 'How to Estimate Driving Range' },
  { id: 'prices', label: 'Gas Prices and Fuel Expenses' },
  { id: 'speed', label: 'How Driving Speed Affects Fuel Consumption' },
  { id: 'weight', label: 'How Vehicle Weight Affects Fuel Economy' },
  { id: 'city-highway', label: 'City vs. Highway Fuel Consumption' },
  { id: 'save', label: 'How to Save Money on Gas' },
  { id: 'compare', label: 'How to Compare Fuel Costs Between Vehicles' },
  { id: 'monthly', label: 'How to Budget for Monthly Gas Expenses' },
  { id: 'why-differ', label: 'Why Actual Fuel Consumption May Differ' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gas-faq', label: 'Frequently Asked Questions' },
];

export const GAS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a gas calculator?',
    answer:
      'A tool that estimates fuel volume and trip expense from travel distance, vehicle fuel economy, and the price you pay at the pump.',
  },
  {
    question: 'How do I calculate gas cost for a trip?',
    answer:
      'Convert distance and economy into fuel used, then multiply by price per matching volume unit: FuelCost = FuelRequired × FuelPrice.',
  },
  {
    question: 'How much gas do I need for 100 km?',
    answer:
      'At 5 L/100 km you need 5 L; at 7.5 L/100 km you need 7.5 L. Change economy to match your vehicle.',
  },
  {
    question: 'How much gas do I need for 500 km?',
    answer: 'At 8 L/100 km: 500 × 8 / 100 = 40 L.',
  },
  {
    question: 'How much gas do I need for 1,000 km?',
    answer: 'At 6 L/100 km: 60 L. At 7.5 L/100 km: 75 L.',
  },
  {
    question: 'How do I calculate fuel consumption?',
    answer:
      'With L/100 km: FuelRequired(L) = Distance(km) × Consumption / 100. With km/L: FuelRequired = Distance / Efficiency.',
  },
  {
    question: 'What is a good fuel efficiency?',
    answer:
      'It depends on vehicle class, fuel, and driving mix. Compare your measured L/100 km or mpg to similar vehicles rather than a single universal target.',
  },
  {
    question: 'What does L/100 km mean?',
    answer:
      'Liters of fuel used to travel 100 kilometers. Lower L/100 km means better economy.',
  },
  {
    question: 'What does MPG mean?',
    answer:
      'Miles per gallon. Higher mpg means better economy. Always confirm whether the gallon is US or imperial.',
  },
  {
    question: 'How do I convert MPG to L/100 km?',
    answer:
      'Approximate L/100 km = 235.215 / US mpg, or 282.481 / UK mpg.',
  },
  {
    question: 'What is the difference between US MPG and UK MPG?',
    answer:
      'US gallons are about 3.785 L; imperial gallons about 4.546 L. The same mpg number is not interchangeable.',
  },
  {
    question: 'How do I calculate gas cost per mile?',
    answer:
      'Divide total fuel cost by miles traveled, or convert kilometers with 1 mi = 1.609344 km.',
  },
  {
    question: 'How do I calculate gas cost per kilometer?',
    answer:
      'CostPerKm = TotalFuelCost / TotalDistanceKm. Example: PKR 5,250 / 250 km = PKR 21/km.',
  },
  {
    question: 'How do I calculate round-trip fuel cost?',
    answer:
      'Use total distance = one-way × 2 (or select round trip), then apply economy and price as usual.',
  },
  {
    question: 'How do I split gas costs between passengers?',
    answer:
      'Divide total fuel cost by the number of people sharing equally, including the driver.',
  },
  {
    question: 'How much does a 200 km trip cost?',
    answer:
      'At 7.5 L/100 km and PKR 280/L: 15 L × 280 = PKR 4,200 (illustrative price only).',
  },
  {
    question: 'How much fuel does a car use per kilometer?',
    answer:
      'From L/100 km: liters per km = (L/100 km) / 100. At 7.5 L/100 km that is 0.075 L/km.',
  },
  {
    question: 'How do I calculate driving range?',
    answer:
      'Range(km) ≈ AvailableFuel(L) × 100 / (L/100 km). Example: 40 L at 7.5 → about 533 km.',
  },
  {
    question: 'How far can I travel with 20 liters of gas?',
    answer:
      'At 7.5 L/100 km: 20 × 100 / 7.5 ≈ 267 km under the average economy assumption.',
  },
  {
    question: 'How far can I travel with 40 liters of gas?',
    answer:
      'At 7.5 L/100 km: about 533 km. Real range varies with speed, load, and conditions.',
  },
  {
    question: 'How does fuel efficiency affect gas expenses?',
    answer:
      'Higher consumption (or lower mpg) raises fuel volume and cost for the same distance and price.',
  },
  {
    question: 'How do I calculate monthly gas costs?',
    answer:
      'Estimate one trip cost, multiply by trips per week, then use monthly ≈ weekly × 52 / 12 for an average month.',
  },
  {
    question: 'How do I estimate yearly fuel expenses?',
    answer:
      'Annual ≈ weekly fuel cost × 52 when your weekly trip pattern is stable.',
  },
  {
    question: 'How can I reduce gas consumption?',
    answer:
      'Smooth driving, correct tire pressure, lighter loads, well-maintained engines, and combining trips often help.',
  },
  {
    question: 'Does driving faster use more fuel?',
    answer:
      'Very high speeds increase aerodynamic drag and often worsen economy; the effect varies by vehicle.',
  },
  {
    question: 'Does air conditioning increase fuel consumption?',
    answer:
      'AC loads the engine and can raise fuel use, especially in hot climates or city driving.',
  },
  {
    question: 'Does vehicle weight affect gas mileage?',
    answer:
      'Heavier loads generally increase fuel use, especially in stop-start and hilly driving.',
  },
  {
    question: 'Why is highway fuel economy different from city fuel economy?',
    answer:
      'City driving has more idling and acceleration; steady highway cruising often uses less fuel per distance — until high-speed drag dominates.',
  },
  {
    question: 'How do I compare gas costs between two cars?',
    answer:
      'Use the same distance and fuel price with each vehicle’s economy; subtract the cheaper trip cost from the other.',
  },
  {
    question: 'How accurate is a gas calculator?',
    answer:
      'It is only as accurate as distance, economy, and price inputs. Real trips vary with conditions and driving style.',
  },
  {
    question: 'Can I calculate fuel cost in PKR?',
    answer:
      'Yes — select PKR (or another currency) as a label and enter the pump price in that currency. No live FX is applied.',
  },
  {
    question: 'How do I convert gallons into liters?',
    answer:
      '1 US gallon ≈ 3.785 L; 1 imperial gallon ≈ 4.546 L. Do not mix US and UK gallons.',
  },
  {
    question: 'Can I use the calculator for diesel vehicles?',
    answer:
      'Yes — use diesel economy and diesel pump price. The formulas are the same; only inputs change.',
  },
  {
    question: 'How do I calculate fuel savings?',
    answer:
      'Compare two economies over the same distance and price, or apply a percent reduction in L/100 km and subtract the new cost from the original.',
  },
  {
    question: 'Why does actual fuel consumption differ from calculated estimates?',
    answer:
      'Traffic, weather, speed, AC, tire pressure, maintenance, hills, and driving style all shift real use from a simple average.',
  },
];
