import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FUEL_COST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Fuel Cost Calculator' },
  { id: 'what-is', label: 'What Is a Fuel Cost Calculator?' },
  { id: 'why-calculate', label: 'Why Calculate Fuel Costs Before Traveling?' },
  { id: 'how-works', label: 'How Does the Calculator Work?' },
  { id: 'formula', label: 'Fuel Cost Formula' },
  { id: 'consumption', label: 'How to Calculate Fuel Consumption' },
  { id: 'efficiency', label: 'Understanding Fuel Efficiency' },
  { id: 'per-km', label: 'Fuel Cost Per Kilometer' },
  { id: 'per-mile', label: 'Fuel Cost Per Mile' },
  { id: 'round-trip', label: 'One-Way vs. Round-Trip' },
  { id: 'long-trips', label: 'Fuel Cost for Long Trips' },
  { id: 'unknown-mileage', label: 'Estimating Without Knowing Mileage' },
  { id: 'gas-diesel', label: 'Gasoline vs. Diesel Fuel Costs' },
  { id: 'speed', label: 'How Driving Speed Affects Consumption' },
  { id: 'road', label: 'How Road Conditions Affect Economy' },
  { id: 'ac', label: 'How Air Conditioning Affects Consumption' },
  { id: 'reduce', label: 'How to Reduce Fuel Costs' },
  { id: 'per-passenger', label: 'Fuel Cost Per Passenger' },
  { id: 'road-trips', label: 'Fuel Cost for Road Trips' },
  { id: 'commuting', label: 'Fuel Cost for Daily Commuting' },
  { id: 'why-differ', label: 'Why Actual Costs May Differ' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'fc-faq', label: 'Frequently Asked Questions' },
];

export const FUEL_COST_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a fuel cost calculator?',
    answer:
      'A tool that estimates fuel volume and trip expense from travel distance, fuel economy, and fuel price.',
  },
  {
    question: 'How do I calculate fuel cost for a trip?',
    answer:
      'Find fuel used from distance and economy, then multiply by price per matching volume unit: FuelCost = FuelUsed × FuelPrice.',
  },
  {
    question: 'What is the fuel cost formula?',
    answer: 'FuelCost = FuelUsed × FuelPrice, with volume units aligned (e.g., liters and price per liter).',
  },
  {
    question: 'How do I calculate fuel consumption?',
    answer:
      'With L/100 km: FuelUsed(L) = Distance(km) × Consumption / 100. With km/L: FuelUsed = Distance / Efficiency.',
  },
  {
    question: 'How much fuel do I need for a 100 km trip?',
    answer:
      'At 8 L/100 km: 100 × 8 / 100 = 8 L. Change the economy to match your vehicle.',
  },
  {
    question: 'How much fuel do I need for a 200 km trip?',
    answer: 'At 8 L/100 km: 16 L.',
  },
  {
    question: 'How do I calculate fuel cost per kilometer?',
    answer:
      'CostPerKm = TotalFuelCost / TotalDistanceKm. Example: PKR 6,300 / 300 km = PKR 21/km.',
  },
  {
    question: 'How do I calculate fuel cost per mile?',
    answer:
      'Convert distance to miles (1 mi = 1.609344 km) or divide total cost by miles traveled.',
  },
  {
    question: 'How do I calculate fuel cost for a round trip?',
    answer:
      'Double the one-way distance (or enable two-way trip), then apply economy and price as usual.',
  },
  {
    question: 'What is fuel efficiency?',
    answer:
      'How far a vehicle travels per unit of fuel, or how much fuel it uses per distance. Units include L/100 km, km/L, and mpg.',
  },
  {
    question: 'What does L/100 km mean?',
    answer:
      'Liters of fuel used to travel 100 kilometers. Lower L/100 km means better economy.',
  },
  {
    question: 'What does km/L mean?',
    answer:
      'Kilometers traveled per liter. Higher km/L means better economy. L/100 km = 100 / (km/L).',
  },
  {
    question: 'What does mpg mean?',
    answer:
      'Miles per gallon. US and UK gallons differ — never mix them. Higher mpg means better economy.',
  },
  {
    question: 'How do I convert mpg to L/100 km?',
    answer:
      'Approx. L/100 km = 235.215 / US mpg, or 282.481 / UK mpg.',
  },
  {
    question: 'What is the difference between US mpg and UK mpg?',
    answer:
      'US gallons are smaller (≈3.785 L) than imperial gallons (≈4.546 L), so the same mpg number is not interchangeable.',
  },
  {
    question: 'How do I calculate gasoline cost for a road trip?',
    answer:
      'Enter total (or round-trip) distance, gasoline economy, and current pump price in your currency.',
  },
  {
    question: 'How do I estimate diesel fuel expenses?',
    answer:
      'Use the same formulas with diesel price and diesel economy. Do not assume a fixed gasoline–diesel price gap.',
  },
  {
    question: 'How do I calculate monthly fuel expenses?',
    answer:
      'Estimate one trip or daily commute cost, then multiply by trips per month under similar assumptions.',
  },
  {
    question: 'How do I estimate fuel costs for daily commuting?',
    answer:
      'Use round-trip commute distance × days, or calculate one day and scale. Traffic can raise real consumption.',
  },
  {
    question: 'How does driving speed affect fuel consumption?',
    answer:
      'Very high speeds increase aerodynamic drag and often worsen economy; optimal cruise speeds vary by vehicle.',
  },
  {
    question: 'How does traffic affect fuel economy?',
    answer:
      'Stop-start traffic usually raises fuel use versus steady highway cruising.',
  },
  {
    question: 'Does air conditioning increase fuel consumption?',
    answer:
      'AC loads the engine and can raise fuel use, especially in hot climates or city driving. Magnitude varies.',
  },
  {
    question: 'How can I reduce my fuel expenses?',
    answer:
      'Smooth acceleration, correct tire pressure, reduced idle, lighter loads, and well-maintained engines help. Combine trips when practical.',
  },
  {
    question: 'How do I calculate fuel cost per passenger?',
    answer:
      'Divide total fuel cost by the number of passengers sharing the trip equally.',
  },
  {
    question: 'How much fuel is needed for a 500 km journey?',
    answer:
      'At 7.5 L/100 km: 500 × 7.5 / 100 = 37.5 L.',
  },
  {
    question: 'How much does a 1,000 km road trip cost?',
    answer:
      'At 7.5 L/100 km and PKR 280/L: 75 L × 280 = PKR 21,000 (illustrative prices only).',
  },
  {
    question: 'How accurate is a fuel cost calculator?',
    answer:
      'It is only as accurate as distance, economy, and price inputs. Real trips vary with conditions and driving style.',
  },
  {
    question: 'Can I calculate fuel costs without knowing my car\'s mileage?',
    answer:
      'Yes — use a clearly labeled category estimate, then refine with your own measured economy when available.',
  },
  {
    question: 'How does vehicle weight affect fuel consumption?',
    answer:
      'Heavier loads generally increase fuel use, especially in stop-start and hilly driving.',
  },
  {
    question: 'Why is my actual fuel cost different from the estimate?',
    answer:
      'Traffic, weather, speed, AC, tire pressure, maintenance, and route hills all shift real consumption from a simple average.',
  },
];
