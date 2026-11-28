import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Ticket Optimizer' },
  { id: 'how-works', label: 'How It Works' },
  { id: 'step-travel', label: 'Step 1: Travel Style' },
  { id: 'step-prices', label: 'Step 2: Ticket Prices' },
  { id: 'step-cheapest', label: 'Step 3: Cheapest Option' },
  { id: 'step-enjoy', label: 'Step 4: Enjoy Travel' },
  { id: 'formula', label: 'Optimizer Formula' },
  { id: 'how-calc', label: 'How to Calculate Costs' },
  { id: 'single-vs-pass', label: 'Singles vs Passes' },
  { id: 'short-vs-long', label: 'Short vs Long Passes' },
  { id: 'savings', label: 'Transportation Savings' },
  { id: 'validity', label: 'Why Validity Matters' },
  { id: 'tips', label: 'Save on Public Transport' },
  { id: 'weekly', label: 'When Weekly Passes Help' },
  { id: 'monthly', label: 'When Monthly Passes Help' },
  { id: 'tourists', label: 'For Tourists' },
  { id: 'commuters', label: 'For Commuters' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'to-faq', label: 'Frequently Asked Questions' },
];

export const TO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a ticket optimizer?',
    answer:
      'A tool that compares single fares and travel passes for your trip schedule and recommends a low-cost combination that still covers every journey.',
  },
  {
    question: 'How does a ticket optimizer work?',
    answer:
      'It builds an assumed trip timeline from frequency and duration, then searches valid ticket purchases (dynamic programming) for the minimum total cost.',
  },
  {
    question: 'How do I calculate public transportation ticket costs?',
    answer:
      'Multiply trips by the single fare for a baseline, then compare passes whose validity windows cover stretches of your schedule.',
  },
  {
    question: 'How do I find the cheapest ticket combination?',
    answer:
      'Enter trips, duration, and prices for singles plus any short- or long-term passes you want to compare. The optimizer returns quantities and total cost.',
  },
  {
    question: 'Are daily tickets cheaper than single tickets?',
    answer:
      'Often when you take several trips inside the pass window. If you travel rarely, singles can still win.',
  },
  {
    question: 'Are weekly transport passes worth buying?',
    answer:
      'Compare pass price with singles for your weekly trip count. Break-even is roughly pass price ÷ single fare trips covered.',
  },
  {
    question: 'Are monthly public transport passes cheaper?',
    answer:
      'For frequent riders, a long validity pass can beat stacks of singles or short passes. Use your actual prices and trip count.',
  },
  {
    question: 'How many tickets do I need for a 10-day trip?',
    answer:
      'Depends on trips per day and which passes you enable. Example: 2 trips/day for 10 days is 20 journeys; two 5-day passes may cover them.',
  },
  {
    question: 'How do I compare single tickets and travel passes?',
    answer:
      'Compute the all-singles baseline, then enable short- and/or long-term passes so the optimizer can mix types.',
  },
  {
    question: 'What is a short-term transport ticket?',
    answer:
      'A pass valid for a limited window (hours, days, or weeks) that covers eligible trips while active.',
  },
  {
    question: 'What is a long-term transport pass?',
    answer:
      'A longer window pass (days, weeks, or fixed 30-day months in this tool) meant for extended travel or commuting.',
  },
  {
    question: 'How does ticket validity affect total cost?',
    answer:
      'A pass only covers trips whose timestamps fall inside its activation window. Misaligned validity can force extra singles or another pass.',
  },
  {
    question: 'Can I combine single tickets with daily passes?',
    answer:
      'Yes. The optimizer may buy a short pass for a dense stretch and singles for leftover trips outside that window.',
  },
  {
    question: 'Can I combine weekly and monthly transport passes?',
    answer:
      'When both short- and long-term options are enabled, mixed plans are considered alongside singles.',
  },
  {
    question: 'How do I calculate transportation savings?',
    answer:
      'Savings S = cost of all singles − minimum optimized cost. Percentage is S ÷ singles cost × 100 when the baseline is positive.',
  },
  {
    question: 'How do I calculate savings percentage?',
    answer:
      'S% = (Cs − Cmin) / Cs × 100. If Cs is zero, percentage is not applicable.',
  },
  {
    question: 'How much can I save using travel passes?',
    answer:
      'It depends on fares and frequency. The worked example saves 42.00 (75%) with two 5-day passes versus 20 singles at 2.80.',
  },
  {
    question: 'What is the cheapest option for daily commuting?',
    answer:
      'Often a long validity pass when you ride most weekdays. Enter your commute frequency and local pass prices to confirm.',
  },
  {
    question: 'What is the cheapest option for occasional travel?',
    answer:
      'Usually individual tickets, unless a short pass is priced low enough to cover a cluster of trips.',
  },
  {
    question: 'How do I estimate the number of trips I need?',
    answer:
      'Trips per day × travel days, or trips per week distributed across the travel window (labeled as an estimate).',
  },
  {
    question: 'Can I calculate tickets for multiple weeks?',
    answer:
      'Yes — set duration in weeks or many days. Multiple passes may be purchased when one validity window is not enough.',
  },
  {
    question: 'Can I compare more than one travel pass?',
    answer:
      'Enable short-term and long-term sections to compare both pass types against singles in one run.',
  },
  {
    question: 'Does the calculator support different currencies?',
    answer:
      'Yes for display denomination. Enter prices already in that currency — selecting another currency does not convert amounts.',
  },
  {
    question: 'Can I use this calculator for bus tickets?',
    answer:
      'Yes, if your system sells single fares and time-based passes with known prices and validity.',
  },
  {
    question: 'Can I use this calculator for train tickets?',
    answer:
      'For simple single vs pass comparisons. It does not model seat reservations, zones, or peak surcharges.',
  },
  {
    question: 'Can I compare subway and metro passes?',
    answer:
      'Yes when passes grant unlimited eligible rides for a validity period comparable to the model used here.',
  },
  {
    question: 'What happens if ticket prices are equal?',
    answer:
      'The optimizer still picks a valid cover. Ties use fewer tickets, then fewer types, then prefer singles over passes.',
  },
  {
    question: 'How does the calculator choose between equally priced options?',
    answer:
      'Deterministic tie-break: lowest cost, then fewer purchases, then fewer ticket types, then stable type order.',
  },
  {
    question: 'Does the calculator consider ticket expiration?',
    answer:
      'Yes via validity windows on an assumed timeline. It does not model agency-specific activation rules or calendar-month boundaries.',
  },
  {
    question: 'How do I calculate average ticket cost per trip?',
    answer:
      'Divide the optimized total cost by the number of required trips.',
  },
  {
    question: 'When should I buy individual tickets instead of a pass?',
    answer:
      'When your trip count is low enough that singles cost less than any covering pass combination.',
  },
  {
    question: 'How can tourists save money on transport tickets?',
    answer:
      'Cluster sightseeing days so short passes cover dense periods, and avoid buying long passes you will not fully use.',
  },
  {
    question: 'How can students reduce transportation expenses?',
    answer:
      'Compare student discounts (entered as your actual prices) and pick the pass that matches class-week patterns.',
  },
  {
    question: 'Does the calculator account for public holidays?',
    answer:
      'No. Adjust trip counts or duration yourself if holidays change your travel days.',
  },
  {
    question: 'Can I use this calculator for irregular travel schedules?',
    answer:
      'Results are estimates from a regular assumed schedule. Highly irregular patterns may need manual day-by-day planning.',
  },
  {
    question: 'Do all travel passes cover unlimited journeys?',
    answer:
      'No. This tool models unlimited trips during validity. Limited-ride products need a different approach.',
  },
  {
    question: 'What happens if a pass expires during my trip?',
    answer:
      'Trips after the validity end are uncovered; the optimizer may buy another pass or singles for those journeys.',
  },
  {
    question: 'Does the calculator include transport fare zones?',
    answer:
      'No. Enter prices that already match the zones you need, or run separate scenarios per zone product.',
  },
  {
    question: 'How accurate are ticket optimizer results?',
    answer:
      'Mathematically exact for the assumed schedule and unlimited-pass model. Real networks may add rules this tool does not encode.',
  },
  {
    question: 'Can the calculator help me plan a travel budget?',
    answer:
      'Yes — use the minimum cost and savings versus singles as a planning estimate in your chosen currency denomination.',
  },
];
