import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MPY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Miles per Year Calculator' },
  { id: 'what-is', label: 'What Is Annual Driving Mileage?' },
  { id: 'average', label: 'Average Miles Driven per Year' },
  { id: 'how-calc', label: 'How to Calculate Miles per Year' },
  { id: 'formulas', label: 'Miles per Year Formulas' },
  { id: 'monthly', label: 'From Monthly Mileage' },
  { id: 'weekly', label: 'From Weekly Mileage' },
  { id: 'daily', label: 'From Daily Mileage' },
  { id: 'why', label: 'Why Know Your Yearly Mileage?' },
  { id: 'insurance', label: 'Annual Mileage and Insurance' },
  { id: 'maintenance', label: 'Annual Mileage and Maintenance' },
  { id: 'depreciation', label: 'Annual Mileage and Depreciation' },
  { id: 'fuel', label: 'Annual Mileage and Fuel Costs' },
  { id: 'commute', label: 'Estimate From Your Commute' },
  { id: 'reduce', label: 'How to Reduce Annual Mileage' },
  { id: 'mi-km', label: 'Miles vs. Kilometers' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'limits', label: 'Assumptions and Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'mpy-faq', label: 'Frequently Asked Questions' },
];

export const MPY_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate miles driven per year?',
    answer:
      'Multiply your typical day × 365, week × (365/7), month × 12, or use a yearly total directly.',
  },
  {
    question: 'What is the average miles driven per year?',
    answer:
      'Averages vary by country, city vs rural driving, and work patterns. Use your own logs rather than a single global figure.',
  },
  {
    question: 'How many miles does the average person drive per month?',
    answer:
      'Divide annual miles by 12 for a monthly average under a steady-rate assumption.',
  },
  {
    question: 'How many miles does the average person drive per week?',
    answer:
      'Annual miles ÷ (365/7) ≈ weekly average under a 365-day year.',
  },
  {
    question: 'How many miles does the average person drive per day?',
    answer: 'Annual miles ÷ 365 for a simple daily average.',
  },
  {
    question: 'How many miles is 1,000 miles per month annually?',
    answer: '1,000 × 12 = 12,000 miles per year.',
  },
  {
    question: 'How many miles per year is 500 miles per week?',
    answer: '500 × (365/7) ≈ 26,071.43 miles per year.',
  },
  {
    question: 'How many miles per year is 30 miles per day?',
    answer: '30 × 365 = 10,950 miles per year.',
  },
  {
    question: 'How many miles per year is 50 miles per day?',
    answer: '50 × 365 = 18,250 miles per year.',
  },
  {
    question: 'How many miles per year is 100 miles per day?',
    answer: '100 × 365 = 36,500 miles per year.',
  },
  {
    question: 'Is 10,000 miles per year considered high?',
    answer:
      'It depends on market norms and vehicle type. Compare with your insurer’s brackets and local averages.',
  },
  {
    question: 'Is 12,000 miles per year normal?',
    answer:
      'It is a common planning figure in some markets, but “normal” varies widely.',
  },
  {
    question: 'Is 15,000 miles per year a lot?',
    answer:
      'Often above light-use brackets; still ordinary for longer commutes. Check your policy and maintenance schedule.',
  },
  {
    question: 'Is 20,000 miles per year considered high mileage?',
    answer:
      'Frequently treated as higher annual use for warranties, leases, and insurance — confirm for your contract.',
  },
  {
    question: 'What is considered low annual mileage?',
    answer:
      'Insurers often treat well below their regional average as low use; thresholds differ by company.',
  },
  {
    question: 'What is considered high annual mileage?',
    answer:
      'Anything in an insurer’s or lessor’s upper bracket for your region — read the specific schedule.',
  },
  {
    question: 'How can I estimate annual mileage for car insurance?',
    answer:
      'Use commute days × trip distance plus personal/vacation miles, or annualize a typical month.',
  },
  {
    question: 'Why do insurance companies ask for annual mileage?',
    answer:
      'Higher mileage usually means more exposure to accidents and claims.',
  },
  {
    question: 'Does annual mileage affect car insurance premiums?',
    answer:
      'Often yes, when the insurer prices by declared or verified annual distance.',
  },
  {
    question: 'How do I calculate annual commuting mileage?',
    answer:
      'Trip distance (one-way or round trip) × days per week × weeks worked per year.',
  },
  {
    question: 'How many working days should I use to estimate mileage?',
    answer:
      'Use your real commuting days and weeks (vacation/remote days reduce the total).',
  },
  {
    question: 'How do I calculate mileage from a daily commute?',
    answer:
      'Daily commute miles × 365 if you drive every day, or use days/week × weeks/year for work patterns.',
  },
  {
    question: 'How do I calculate annual mileage in kilometers?',
    answer:
      'Annualize in km the same way, or convert miles × 1.609344.',
  },
  {
    question: 'How do I convert kilometers per year into miles?',
    answer: 'Divide kilometers by 1.609344.',
  },
  {
    question: 'How many kilometers are in one mile?',
    answer: 'Exactly 1.609344 km per international mile.',
  },
  {
    question: 'How many miles are in 10,000 kilometers?',
    answer: '10,000 / 1.609344 ≈ 6,213.71 miles.',
  },
  {
    question: 'Can annual mileage affect vehicle resale value?',
    answer:
      'Higher odometer totals often lower resale value, all else equal.',
  },
  {
    question: 'Does annual mileage affect vehicle maintenance?',
    answer:
      'Many services are mileage-based (oil, brakes, tires). Higher annual miles mean more frequent service.',
  },
  {
    question: 'How do I calculate annual fuel costs?',
    answer:
      'Annual distance ÷ efficiency (aligned units) × fuel price per unit.',
  },
  {
    question: 'How do I estimate future odometer readings?',
    answer:
      'Future ≈ current odometer + annual miles × years, assuming a steady rate.',
  },
  {
    question: 'How accurate is a miles per year calculator?',
    answer:
      'It is exact for the math you enter. Real life varies with seasons, trips, and schedule changes.',
  },
  {
    question: 'Should I include personal trips in annual mileage?',
    answer: 'Yes, if you want a total that matches insurance and fuel budgets.',
  },
  {
    question: 'Should I include vacation travel?',
    answer:
      'Include typical vacation miles for a realistic annual estimate.',
  },
  {
    question: 'How can I calculate mileage for a leased vehicle?',
    answer:
      'Estimate annual miles the same way and compare with your lease’s allowed annual miles.',
  },
  {
    question: 'How can I reduce annual vehicle mileage?',
    answer:
      'Remote work days, carpooling, transit, combining errands, and shorter routes help.',
  },
  {
    question: 'How do I estimate mileage if I work from home?',
    answer:
      'Use personal/errand miles only, or fewer commuting weeks in the schedule tool.',
  },
  {
    question: 'How does carpooling affect annual mileage?',
    answer:
      'Sharing rides can cut your driven miles if you are not always the driver.',
  },
  {
    question: 'How do I calculate annual mileage for multiple vehicles?',
    answer:
      'Estimate each vehicle separately; do not sum drivers across cars unless each is driven that much.',
  },
  {
    question: 'Can I estimate mileage without an odometer?',
    answer:
      'Yes — annualize a known period distance or commute schedule. Odometer deltas are still more accurate.',
  },
  {
    question: 'How often should I update my annual mileage estimate?',
    answer:
      'Update when your commute, remote schedule, or travel habits change, or at insurance renewal.',
  },
];
