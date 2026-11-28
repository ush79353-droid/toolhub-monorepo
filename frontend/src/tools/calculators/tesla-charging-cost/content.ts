import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TCC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Tesla Charging Cost Calculator' },
  { id: 'how-much', label: 'How Much Does It Cost?' },
  { id: 'formula', label: 'Charging Cost Formula' },
  { id: 'how-calc', label: 'How to Calculate' },
  { id: 'full-example', label: 'Full Charge Example' },
  { id: 'driving', label: 'Driving Cost' },
  { id: 'drive-formula', label: 'Driving Cost Formula' },
  { id: 'per-km', label: 'Cost per Kilometer' },
  { id: 'per-mi', label: 'Cost per Mile' },
  { id: 'factors', label: 'What Affects Cost?' },
  { id: 'home-vs-sc', label: 'Home vs Supercharging' },
  { id: 'capacity', label: 'Battery Capacity' },
  { id: 'efficiency', label: 'Charging Efficiency' },
  { id: 'kwh100', label: 'Energy per 100 km' },
  { id: 'soc', label: 'Battery Level and Cost' },
  { id: 'reduce', label: 'Reduce Charging Costs' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'tcc-faq', label: 'Frequently Asked Questions' },
];

export const TCC_FAQS: readonly FAQItem[] = [
  {
    question: 'How much does it cost to charge a Tesla?',
    answer:
      'Roughly usable battery kWh × your electricity price per kWh for a full charge (ideal). Real sessions also depend on start/end SOC and charging losses.',
  },
  {
    question: 'How do I calculate Tesla charging cost?',
    answer: 'C = B × P for a full ideal charge. Partial: add energy for the SOC window, divide by charging efficiency, then multiply by price.',
  },
  {
    question: 'What is the Tesla charging cost formula?',
    answer: 'Full: C = B × P. Driving: Cd = D × R × P / 100 when R is kWh/100 km.',
  },
  {
    question: 'How much electricity does a Tesla use?',
    answer:
      'It varies by model and conditions. Efficiency is often expressed as kWh/100 km or mi/kWh — use your trip data when possible.',
  },
  {
    question: 'How much does it cost to fully charge a Tesla?',
    answer:
      'Example: 60 kWh × 0.25 /kWh = 15.00 in that currency (ideal, no losses).',
  },
  {
    question: 'How much does it cost to charge a Tesla Model 3?',
    answer:
      'Depends on that car’s usable capacity and your tariff. Use the Model 3 estimate preset or enter your pack’s usable kWh.',
  },
  {
    question: 'How much does it cost to charge a Tesla Model Y?',
    answer:
      'Same method: capacity × price. Model Y packs and efficiency vary by year and trim.',
  },
  {
    question: 'How much does it cost to charge a Tesla Model S?',
    answer:
      'Larger packs generally cost more per full charge at the same tariff. Override the illustrative preset with your usable kWh.',
  },
  {
    question: 'How much does it cost to charge a Tesla Model X?',
    answer:
      'Calculate from usable capacity and local electricity price; presets here are estimates only.',
  },
  {
    question: 'How much does Tesla home charging cost?',
    answer:
      'Use your residential rate (and any time-of-use periods). Home charging is often cheaper per kWh than many public DC rates.',
  },
  {
    question: 'Is Tesla Supercharging more expensive than home charging?',
    answer:
      'Often yes per kWh, but prices vary by site and time. This calculator does not fetch live Supercharger tariffs.',
  },
  {
    question: 'How do I calculate charging cost per kWh?',
    answer:
      'That is your electricity tariff. Total session cost ≈ grid kWh drawn × price per kWh.',
  },
  {
    question: 'What is battery capacity?',
    answer:
      'Energy the pack can store, usually in kWh. Usable capacity may be less than the nominal marketing figure.',
  },
  {
    question: 'What is usable battery capacity?',
    answer:
      'The portion available for driving/charging in normal operation — the right input for cost estimates.',
  },
  {
    question: 'What is charging efficiency?',
    answer:
      'Fraction of grid energy that ends up in the battery. Losses come from conversion heat and auxiliary loads.',
  },
  {
    question: 'How do charging losses affect electricity cost?',
    answer:
      'Grid energy = battery energy added ÷ η. Lower η means more grid kWh and higher cost for the same SOC gain.',
  },
  {
    question: 'How much does it cost to charge from 20% to 80%?',
    answer:
      'Example: 60 kWh × 0.6 = 36 kWh into the pack; at 90% η → 40 kWh from the grid; × 0.25 = 10.00.',
  },
  {
    question: 'How much does it cost to charge from 10% to 90%?',
    answer:
      'Energy fraction is 80% of usable capacity, then apply η and price the same way.',
  },
  {
    question: 'Is charging to 100% always necessary?',
    answer:
      'No. Many drivers use daily SOC windows for longevity and charge-time reasons; cost scales with energy added.',
  },
  {
    question: 'How do I calculate electricity cost per mile?',
    answer:
      'Convert efficiency to kWh/mi (or use mi/kWh inverse), then multiply by price per kWh.',
  },
  {
    question: 'How do I calculate electricity cost per kilometer?',
    answer: 'kWh/km × price per kWh, or (kWh/100 km × price) / 100.',
  },
  {
    question: 'What does kWh/100 km mean?',
    answer:
      'Kilowatt-hours used to drive 100 kilometers — lower is more efficient.',
  },
  {
    question: 'What does mi/kWh mean?',
    answer:
      'Miles driven per kilowatt-hour — higher is more efficient. Invert carefully for cost math.',
  },
  {
    question: 'How do I convert mi/kWh to kWh/100 km?',
    answer:
      'kWh/km = 1 / (mi/kWh × 1.609344); then × 100 for kWh/100 km.',
  },
  {
    question: 'What affects Tesla energy consumption?',
    answer:
      'Speed, temperature, elevation, cabin climate, cargo, wheels/tires, and driving style.',
  },
  {
    question: 'Does cold weather increase Tesla charging costs?',
    answer:
      'Often yes: cabin heat and reduced efficiency raise kWh per distance; preconditioning can also use energy.',
  },
  {
    question: 'Does driving speed affect Tesla electricity use?',
    answer:
      'Yes — higher speeds typically increase energy use per distance due to aerodynamic drag.',
  },
  {
    question: 'Does battery degradation affect charging estimates?',
    answer:
      'Reduced usable capacity lowers energy needed for 0–100%, but range per charge also falls.',
  },
  {
    question: 'What is the difference between AC and DC charging?',
    answer:
      'AC (home/destination) uses the onboard charger; DC fast charging feeds the pack more directly and usually costs more per kWh at public sites.',
  },
  {
    question: 'Do public chargers charge additional fees?',
    answer:
      'Sometimes (idle fees, session fees, membership). This tool estimates energy cost only.',
  },
  {
    question: 'How do I compare charging costs between EV models?',
    answer:
      'Compare usable capacity × tariff for full charges, and efficiency × distance × tariff for trips.',
  },
  {
    question: 'Can I calculate Tesla charging cost in PKR?',
    answer:
      'Yes — select PKR as denomination and enter your tariff already in PKR. No automatic FX conversion.',
  },
  {
    question: 'Can I calculate Tesla charging cost in USD?',
    answer:
      'Yes — choose USD and enter the price per kWh in dollars.',
  },
  {
    question: 'Does electricity price vary by time of day?',
    answer:
      'On time-of-use plans, yes. Use the rate that applies to your charging window.',
  },
  {
    question: 'How can I reduce Tesla charging expenses?',
    answer:
      'Charge on off-peak rates, improve efficiency (speed/climate), and avoid unnecessary public DC when home rates are lower.',
  },
  {
    question: 'Can I use this calculator for another electric car?',
    answer:
      'Yes — pick Custom and enter that EV’s usable capacity and efficiency.',
  },
  {
    question: 'Does battery capacity determine driving range?',
    answer:
      'Range ≈ usable kWh ÷ kWh per distance. Capacity alone is not range.',
  },
  {
    question: 'Does charging efficiency affect total cost?',
    answer:
      'Yes in Advanced mode — lower η increases grid kWh for the same SOC gain.',
  },
  {
    question: 'What is the difference between battery energy and grid electricity?',
    answer:
      'Battery energy is stored in the pack; grid electricity is what the meter records, including losses.',
  },
  {
    question: 'How accurate is this Tesla charging cost calculator?',
    answer:
      'As accurate as your capacity, tariff, efficiency, SOC window, and η. Presets are labeled estimates, not OEM guarantees.',
  },
];
