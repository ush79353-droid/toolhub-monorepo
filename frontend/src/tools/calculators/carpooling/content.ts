import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CARPOOLING_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Carpooling Calculator' },
  { id: 'what-is', label: 'What Is Carpooling?' },
  { id: 'benefits', label: 'Benefits of Carpooling' },
  { id: 'how-to-calculate', label: 'How to Calculate Costs' },
  { id: 'formula', label: 'Carpooling Cost Formula' },
  { id: 'fuel-consumption', label: 'How to Calculate Fuel Consumption' },
  { id: 'split', label: 'How to Split Fuel Costs' },
  { id: 'savings', label: 'How to Calculate Savings' },
  { id: 'city-highway', label: 'City vs. Highway Fuel Use' },
  { id: 'lower-costs', label: 'How to Lower Driving Costs' },
  { id: 'how-many', label: 'How Many People Should Share?' },
  { id: 'ridesharing', label: 'Carpooling vs. Ridesharing' },
  { id: 'car-sharing', label: 'Carpooling vs. Car Sharing' },
  { id: 'environment', label: 'Environmental Benefits' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'carpooling-faq', label: 'Frequently Asked Questions' },
];

export const CARPOOLING_FAQS: readonly FAQItem[] = [
  {
    question: 'What is carpooling?',
    answer:
      'Carpooling means multiple people share one vehicle for the same trip, splitting travel costs and reducing the number of cars on the road.',
  },
  {
    question: 'How does a carpooling calculator work?',
    answer:
      'It estimates fuel used from distance and fuel economy, multiplies by fuel price, adds optional fees, then divides by the number of travelers.',
  },
  {
    question: 'How do you split fuel costs between passengers?',
    answer:
      'Equal split divides total trip cost by N people including the driver. Other modes leave the driver free or use a custom driver share.',
  },
  {
    question: 'How much should each passenger pay?',
    answer:
      'Under an equal split, CostPerPerson = TotalTripCost / N. Example: $22.40 ÷ 4 = $5.60.',
  },
  {
    question: 'Should the driver pay an equal share?',
    answer:
      'Often yes for fairness; sometimes passengers cover fuel while the driver provides the car. Choose the payment mode that matches your agreement.',
  },
  {
    question: 'How do you calculate fuel cost for a trip?',
    answer:
      'FuelCost = FuelUsed × FuelPrice, with matching volume units (e.g., liters and price per liter).',
  },
  {
    question: 'How do you calculate fuel used from distance?',
    answer:
      'With L/100 km: FuelUsed(L) = Distance(km) × Economy / 100. Example: 100 km × 8 / 100 = 8 L.',
  },
  {
    question: 'How do you calculate trip cost per person?',
    answer:
      'Add fuel cost and additional expenses, then divide by the number of people including the driver.',
  },
  {
    question: 'Is carpooling cheaper than driving alone?',
    answer:
      'Usually for passengers when fuel and fees are shared. Total fuel for one shared car is often less than N separate cars — but only if those solo trips would have happened.',
  },
  {
    question: 'How much money can carpooling save?',
    answer:
      'Use the optional comparison: TotalSavings = N × SoloTripCost − SharedTripCost. Results depend on your assumptions.',
  },
  {
    question: 'Does carpooling reduce fuel consumption?',
    answer:
      'One shared vehicle typically burns less fuel than several separate vehicles for the same trip, if those separate trips would otherwise occur.',
  },
  {
    question: 'How does carpooling help the environment?',
    answer:
      'Fewer vehicle-kilometers can mean lower fuel use and emissions, contingent on real travel alternatives and occupancy.',
  },
  {
    question: 'What is the difference between carpooling and ridesharing?',
    answer:
      'Carpooling is usually informal cost sharing among peers. Ridesharing often involves commercial platforms, fares, and driver compensation rules.',
  },
  {
    question: 'What is the difference between carpooling and car sharing?',
    answer:
      'Carpooling shares a trip; car sharing shares access to a vehicle over time (membership/rental models).',
  },
  {
    question: 'Should tolls be included in carpooling costs?',
    answer:
      'Yes if travelers agree those fees are trip costs. Use Additional Trip Expenses for tolls and parking.',
  },
  {
    question: 'How do you divide parking fees?',
    answer:
      'Add parking to total trip cost, then apply the same split rules as fuel.',
  },
  {
    question: 'How do you calculate carpooling costs for a round trip?',
    answer:
      'Enable Round trip to use TotalDistance = 2 × one-way distance, then recalculate fuel and costs.',
  },
  {
    question: 'What is the cheapest way to share travel expenses?',
    answer:
      'Maximize occupancy (safely), use efficient routes and economy, and agree on a clear split that covers fuel and shared fees.',
  },
  {
    question: 'Does highway driving affect fuel cost?',
    answer:
      'Yes. Highway economy is often better (lower L/100 km) than city driving. Trip type presets adjust sample economies.',
  },
  {
    question: 'How do you calculate fuel consumption in L/100 km?',
    answer:
      'FuelUsed(L) = km × (L/100 km) / 100. Convert other units before applying this form.',
  },
  {
    question: 'How do you calculate fuel consumption in mpg?',
    answer:
      'Convert mpg to L/100 km (or convert distance to miles and use gallons), then multiply by price in matching units.',
  },
  {
    question: 'Can I calculate carpooling costs in different currencies?',
    answer:
      'Yes — pick a currency to label amounts. Enter prices already in that currency; this tool does not live-convert FX rates.',
  },
  {
    question: 'Can I use a custom fuel economy?',
    answer:
      'Yes. Choose Custom Vehicle or edit the economy field; you can also enter fuel used manually.',
  },
  {
    question: 'How do you reimburse a carpool driver?',
    answer:
      'If the driver paid the full trip, reimbursement ≈ TotalTripCost − DriverShare. Equal split: passengers each pay Total/N.',
  },
  {
    question: 'How accurate are carpooling cost estimates?',
    answer:
      'Math is exact for your inputs. Real costs vary with traffic, idling, fuel price changes, and vehicle condition.',
  },
];
