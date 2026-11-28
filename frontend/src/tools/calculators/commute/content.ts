import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COMMUTE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Commute Calculator' },
  { id: 'what-is', label: 'What Is a Commute Calculator?' },
  { id: 'how-to', label: 'How to Calculate Commuting Costs' },
  { id: 'daily', label: 'Daily Driving Costs' },
  { id: 'monthly', label: 'Monthly Commuting Costs' },
  { id: 'annual', label: 'Annual Commuting Costs' },
  { id: 'fuel', label: 'Fuel Consumption for Commuting' },
  { id: 'driving-cost', label: 'Cost of Driving to Work' },
  { id: 'carpool-save', label: 'How Much Does Carpooling Save?' },
  { id: 'carpool-good', label: 'Is Carpooling a Good Solution?' },
  { id: 'transit', label: 'Public Transport Commute Cost' },
  { id: 'compare', label: 'Car vs. Public Transportation' },
  { id: 'distance', label: 'How Distance Affects Cost' },
  { id: 'economy', label: 'How Fuel Economy Affects Cost' },
  { id: 'lower', label: 'How to Lower Commuting Costs' },
  { id: 'environment', label: 'Environmental Impact' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'commute-faq', label: 'Frequently Asked Questions' },
];

export const COMMUTE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a commute calculator?',
    answer:
      'A tool that estimates home-to-work travel expenses for car and/or public transport using your distance, frequency, and cost inputs.',
  },
  {
    question: 'How do I calculate commuting costs?',
    answer:
      'Compute round-trip distance × commute days, then add fuel, parking/tolls, and wear for car — or ticket/pass costs for transit — and compare.',
  },
  {
    question: 'How much does it cost to drive to work?',
    answer:
      'It depends on distance, fuel economy, fuel price, fees, and wear. Enter those fields to estimate daily through yearly totals.',
  },
  {
    question: 'How do I calculate monthly commuting expenses?',
    answer:
      'Use your round-trip commuting days per month (or convert weekly/yearly). Multiply day-based costs by that count and add monthly fees.',
  },
  {
    question: 'How do I calculate yearly commuting expenses?',
    answer:
      'This calculator annualizes monthly estimates ×12 and weekly rates ×52. Adjust frequency if your work calendar differs.',
  },
  {
    question: 'How do I calculate fuel cost for commuting?',
    answer:
      'FuelUsed(L) = Distance(km) × (L/100 km) / 100, then FuelCost = FuelUsed × price per liter (or converted unit).',
  },
  {
    question: 'How do I calculate fuel consumption per kilometer?',
    answer:
      'From L/100 km: liters per km = (L/100 km) / 100. Example: 8 L/100 km → 0.08 L/km.',
  },
  {
    question: 'How do I calculate fuel consumption per mile?',
    answer:
      'Convert miles to km (×1.609344) or convert economy to mpg, then apply matching fuel price units.',
  },
  {
    question: 'How much does commuting cost per month?',
    answer:
      'Results show monthly car totals, cost per person, and transit totals from your inputs — there is no universal figure.',
  },
  {
    question: 'Is public transportation cheaper than driving?',
    answer:
      'Only when your inputs say so. Compare car cost per person with transit cost; the tool reports which option is cheaper.',
  },
  {
    question: 'How do I compare driving costs with public transport?',
    answer:
      'Fill both sections. Savings = car cost per person − transit cost (positive means transit is cheaper for your share).',
  },
  {
    question: 'How much can carpooling save?',
    answer:
      'Equal split divides total car cost by occupants. More riders lower cost per person for the same trip cost.',
  },
  {
    question: 'Should parking expenses be included in commute costs?',
    answer:
      'Yes if you pay them for work travel. Use Parking and toll costs with the matching frequency.',
  },
  {
    question: 'What are vehicle wear and tear costs?',
    answer:
      'Your estimate of mileage-related costs (tires, maintenance, consumables). Enter zero if you prefer not to include them.',
  },
  {
    question: 'Does fuel economy affect commuting expenses?',
    answer:
      'Yes. Lower L/100 km (or higher mpg) reduces fuel used and fuel cost for the same distance.',
  },
  {
    question: 'How do I calculate round-trip commuting distance?',
    answer: 'RoundTrip = OneWay × 2. Monthly distance = RoundTrip × commute days.',
  },
  {
    question: 'How many workdays should I use per month?',
    answer:
      'Use your actual schedule. 22 is a common default, not a rule — holidays and remote days reduce the count.',
  },
  {
    question: 'How do I calculate the cost of a weekly transport pass?',
    answer:
      'Choose time-based pass mode, set validity to 1 week, and enter the pass price. Monthly estimate ceilings calendar coverage.',
  },
  {
    question: 'How do I calculate the cost of a monthly transport pass?',
    answer:
      'Enter the monthly pass price with validity of one month (or use per-commute-day tickets if that matches your fare).',
  },
  {
    question: 'How can I reduce commuting expenses?',
    answer:
      'Carpool, use transit passes, remote work, efficient routes, fuel-efficient driving, and fewer unnecessary trips.',
  },
  {
    question: 'Is carpooling better than driving alone?',
    answer:
      'It usually lowers cost per person and may cut total cars on the road, subject to schedules and seating capacity.',
  },
  {
    question: 'How can working from home reduce commute costs?',
    answer:
      'Fewer commute days reduce distance-based fuel, day tickets, and some parking — lower the frequency field accordingly.',
  },
  {
    question: 'What is the difference between commuting and carpooling?',
    answer:
      'Commuting is the home–work trip; carpooling is sharing that trip (and usually its costs) with others.',
  },
  {
    question: 'Does the calculator include vehicle depreciation?',
    answer:
      'Only if you include it yourself in wear and tear. Defaults do not invent depreciation.',
  },
  {
    question: 'Can I calculate commute costs in different currencies?',
    answer:
      'Yes — select a currency to format amounts. Enter prices already in that currency; FX is not auto-converted.',
  },
];
