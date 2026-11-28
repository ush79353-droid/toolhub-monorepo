import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IDLING_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Idling Fuel Consumption Calculator' },
  { id: 'what-is', label: 'What Is Idling Fuel Consumption?' },
  { id: 'why-consume', label: 'Why Does an Engine Consume Fuel While Idling?' },
  { id: 'petrol-diesel', label: 'Petrol vs. Diesel Idling' },
  { id: 'how-much', label: 'How Much Fuel Does a Car Use While Idling?' },
  { id: 'how-calc', label: 'How to Calculate Idling Fuel Consumption' },
  { id: 'formula', label: 'Idling Fuel Consumption Formula' },
  { id: 'total-fuel', label: 'How to Calculate Total Fuel Consumed' },
  { id: 'cost', label: 'How to Calculate Idling Fuel Cost' },
  { id: 'example', label: 'Worked Example' },
  { id: '2l', label: '2.0 L Engine While Idling' },
  { id: '10min', label: '10 Minutes of Idling' },
  { id: '30min', label: '30 Minutes of Idling' },
  { id: '1hour', label: 'One Hour of Idling' },
  { id: 'engine-size', label: 'Does Engine Size Affect Idling?' },
  { id: 'ac', label: 'Does Air Conditioning Increase Idling Use?' },
  { id: 'cold', label: 'Cold Weather and Idling' },
  { id: 'temp', label: 'Engine Temperature' },
  { id: 'restart', label: 'Idling vs. Restarting' },
  { id: 'reduce', label: 'How to Reduce Unnecessary Idling' },
  { id: 'co2', label: 'Idling and CO₂ Emissions' },
  { id: 'monthly', label: 'Daily and Monthly Idling Costs' },
  { id: 'why-differ', label: 'Why Estimates Differ From Reality' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'idle-faq', label: 'Frequently Asked Questions' },
];

export const IDLING_FAQS: readonly FAQItem[] = [
  {
    question: 'What is idling fuel consumption?',
    answer:
      'Fuel burned while the engine runs without moving the vehicle — typically expressed in liters (or gallons) per hour.',
  },
  {
    question: 'How much fuel does a car use while idling?',
    answer:
      'It varies. A simplified estimate is about 0.6 × displacement (L) for petrol and 0.45 × displacement for diesel, in L/h — not a guarantee.',
  },
  {
    question: 'How do I calculate idling fuel consumption?',
    answer:
      'Estimate hourly rate from displacement (or use a measured rate), then FuelConsumed = Rate × IdlingHours.',
  },
  {
    question: 'How much petrol does a 2.0 L engine consume while idling?',
    answer: 'Rough estimate: 2.0 × 0.6 = 1.2 L/h.',
  },
  {
    question: 'How much diesel does a 2.0 L engine consume while idling?',
    answer: 'Rough estimate: 2.0 × 0.45 = 0.9 L/h.',
  },
  {
    question: 'Does idling waste fuel?',
    answer:
      'Yes — fuel is burned without distance traveled. Short stops may still be reasonable for comfort or safety.',
  },
  {
    question: 'How much fuel does a car use in 10 minutes of idling?',
    answer:
      'At 1.2 L/h: 1.2 × (10/60) = 0.2 L. Scale with your estimated rate.',
  },
  {
    question: 'How much fuel does a car use in 15 minutes of idling?',
    answer: 'At 1.2 L/h: 0.3 L.',
  },
  {
    question: 'How much fuel does a car use in 30 minutes of idling?',
    answer: 'At 1.2 L/h: 0.6 L.',
  },
  {
    question: 'How much fuel does a car use in one hour of idling?',
    answer: 'About equal to the hourly rate — e.g. ~1.2 L for a 2.0 L petrol estimate.',
  },
  {
    question: 'Does engine capacity affect idling consumption?',
    answer:
      'Larger displacement often correlates with higher idle burn, but design, load, and accessories matter too.',
  },
  {
    question: 'Do diesel engines consume less fuel while idling?',
    answer:
      'Often lower than petrol at similar size in simplified models, but real results depend on the specific engines.',
  },
  {
    question: 'Does air conditioning increase idling fuel consumption?',
    answer:
      'Yes — A/C loads the engine and typically raises idle fuel use.',
  },
  {
    question: 'Does cold weather increase fuel consumption?',
    answer:
      'Cold starts and richer mixtures can raise fuel use until the engine warms.',
  },
  {
    question: 'Does hot weather affect idling consumption?',
    answer:
      'High A/C demand can increase idle burn even when the engine is warm.',
  },
  {
    question: 'Does engine age affect fuel consumption?',
    answer:
      'Wear, deposits, and sensor issues can change idle fueling over time.',
  },
  {
    question: 'Does engine maintenance affect idling efficiency?',
    answer:
      'Clean filters, correct oil, and healthy sensors help keep idle closer to design intent.',
  },
  {
    question: 'How do I calculate the cost of idling?',
    answer: 'IdlingCost = FuelConsumed × PricePerLiter (aligned units).',
  },
  {
    question: 'How much does idling cost per hour?',
    answer:
      'HourlyCost ≈ HourlyFuelRate × PricePerLiter. Example: 1.2 × 280 = PKR 336/h at PKR 280/L.',
  },
  {
    question: 'How much does idling cost per day?',
    answer:
      'Multiply one day’s idle hours by the hourly rate and fuel price.',
  },
  {
    question: 'How much does idling cost per month?',
    answer:
      'Scale daily or weekly costs; this tool’s long-term mode uses annual/12 for an average month.',
  },
  {
    question: 'How much does idling cost per year?',
    answer:
      'Weekly cost × (365.2425/7) under a steady weekly pattern, or sum measured days.',
  },
  {
    question: 'How can I reduce fuel consumption while idling?',
    answer:
      'Shut off when safe and practical, limit A/C at idle, and avoid long warm-up idles in mild weather.',
  },
  {
    question: 'Is prolonged idling bad for an engine?',
    answer:
      'Extended idle can increase deposits and wear relative to normal driving; follow manufacturer guidance.',
  },
  {
    question: 'Does restarting a car consume more fuel than idling?',
    answer:
      'It depends on engine technology and idle duration. Many modern systems favor shutting off for longer stops.',
  },
  {
    question: 'Can idling drain a car battery?',
    answer:
      'At low idle, alternator output may not cover heavy electrical loads — batteries can discharge.',
  },
  {
    question: 'Does idling charge the car battery?',
    answer:
      'Sometimes partially; higher RPM or driving usually charges more effectively.',
  },
  {
    question: 'Does idling use fuel in neutral?',
    answer: 'Yes — the engine still burns fuel to keep running.',
  },
  {
    question: 'Does idling use more fuel in park?',
    answer:
      'Park vs neutral is usually minor compared with A/C and electrical load.',
  },
  {
    question: 'Does vehicle weight affect idling fuel consumption?',
    answer:
      'At true idle, weight matters little; accessory load and engine design dominate.',
  },
  {
    question: 'How accurate are idling fuel calculators?',
    answer:
      'Displacement models are rough. Measured OBD or tank data is more accurate — use custom rate when available.',
  },
  {
    question: 'Can I enter a custom idling fuel consumption rate?',
    answer: 'Yes — enable custom measured rate and enter L/h or gal/h.',
  },
  {
    question: 'How do I convert liters per hour into gallons per hour?',
    answer:
      'Divide L/h by 3.785411784 for US gal/h, or by 4.54609 for imperial gal/h.',
  },
  {
    question: 'What is the difference between US and UK gallons?',
    answer:
      'US gallon ≈ 3.785 L; imperial gallon ≈ 4.546 L. Never mix them.',
  },
  {
    question: 'How much CO₂ is produced while idling?',
    answer:
      'Rough tank-to-wheel: ~2.31 kg CO₂ per liter petrol and ~2.68 kg per liter diesel burned.',
  },
  {
    question: 'Why do modern engines use different amounts of fuel while idling?',
    answer:
      'Injection strategy, start-stop, hybrids, and accessory loads differ widely by model.',
  },
  {
    question: 'Does a turbocharged engine consume more fuel while idling?',
    answer:
      'Not necessarily at idle — turbos often matter more under load. Measure when possible.',
  },
  {
    question: 'Does engine speed affect idling fuel consumption?',
    answer:
      'Higher idle RPM generally burns more fuel than a lower stable idle.',
  },
  {
    question: 'Is idling fuel consumption the same for all cars?',
    answer: 'No. Treat calculator outputs as estimates unless you supply a measured rate.',
  },
  {
    question: 'How can I measure my car’s actual idling fuel consumption?',
    answer:
      'Use OBD fuel-rate data, manufacturer diagnostics, or carefully timed tank measurements.',
  },
];
