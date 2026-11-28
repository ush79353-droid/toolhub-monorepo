import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DRIVE_TIME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Drive Time Calculator' },
  { id: 'what-is', label: 'What Is a Drive Time Calculator?' },
  { id: 'how-drive-time', label: 'How to Calculate Drive Time' },
  { id: 'formula', label: 'Drive Time Formula' },
  { id: 'arrival', label: 'How to Estimate Arrival Time' },
  { id: 'departure', label: 'How to Calculate Departure Time' },
  { id: 'breaks', label: 'How to Include Rest Stops' },
  { id: 'with-breaks', label: 'Driving Time with Breaks' },
  { id: 'avg-speed', label: 'Average vs Instantaneous Speed' },
  { id: 'fuel', label: 'How to Calculate Fuel Consumption' },
  { id: 'fuel-cost', label: 'How to Estimate Fuel Costs' },
  { id: 'total-cost', label: 'How to Calculate Total Trip Cost' },
  { id: 'split', label: 'How to Split Driving Costs' },
  { id: 'per-mile', label: 'Cost Per Mile' },
  { id: 'per-km', label: 'Cost Per Kilometer' },
  { id: 'faster', label: 'Does Driving Faster Save Time?' },
  { id: 'traffic', label: 'How Traffic Affects Driving Time' },
  { id: 'why-avg', label: 'Why Average Speed Matters' },
  { id: 'road-trip', label: 'How to Plan a Long Road Trip' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'examples', label: 'Drive Time Calculator Examples' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'drive-time-faq', label: 'Frequently Asked Questions' },
];

export const DRIVE_TIME_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate driving time?',
    answer:
      'Divide distance by average speed using consistent units: Time = Distance / Speed. Example: 300 km ÷ 60 km/h = 5 hours.',
  },
  {
    question: 'What is the driving time formula?',
    answer: 'DrivingTime = Distance / AverageSpeed. Add break time for total trip duration.',
  },
  {
    question: 'How long does it take to drive 100 km?',
    answer:
      'At 50 km/h → 2 h; at 100 km/h → 1 h. Always use your expected average speed, not the speed limit alone.',
  },
  {
    question: 'How long does it take to drive 200 km?',
    answer: 'At 80 km/h average: 200 / 80 = 2.5 hours (2 h 30 min), before breaks.',
  },
  {
    question: 'How long does it take to drive 300 km?',
    answer: 'At 60 km/h: 5 hours driving. With a 45-minute break: 5 h 45 min total.',
  },
  {
    question: 'How long does it take to drive 500 miles?',
    answer:
      'At 50 mph average: 500 / 50 = 10 hours driving, plus any planned stops.',
  },
  {
    question: 'How long does it take to drive 100 miles at 60 mph?',
    answer: '100 / 60 ≈ 1.667 hours ≈ 1 h 40 min.',
  },
  {
    question: 'How do I calculate arrival time?',
    answer:
      'Arrival = Departure + TotalTripTime, where TotalTripTime = driving time + breaks.',
  },
  {
    question: 'How do I calculate departure time?',
    answer:
      'Departure = DesiredArrival − TotalTripTime. This calculator supports that reverse mode.',
  },
  {
    question: 'How do I add breaks to driving time?',
    answer:
      'Enter total break duration (minutes, hours, or days). Total trip = driving hours + break hours.',
  },
  {
    question: 'How do I calculate average speed?',
    answer:
      'Average speed = total distance / total moving time. It is usually lower than cruise speed because of traffic and slowdowns.',
  },
  {
    question: 'What is the difference between speed and average speed?',
    answer:
      'Instantaneous speed is the speedometer reading at a moment. Average speed is distance over the whole trip duration (excluding or including stops depending on definition). This tool uses average moving speed, then adds breaks separately.',
  },
  {
    question: 'Does driving faster always save time?',
    answer:
      'Higher average speed shortens Time = Distance/Speed, but traffic, limits, fuel use, and safety constrain real gains.',
  },
  {
    question: 'How do I estimate fuel consumption?',
    answer:
      'With L/100 km: FuelUsed(L) = Distance(km) × (L/100 km) / 100. Example: 300 × 7 / 100 = 21 L.',
  },
  {
    question: 'How do I calculate fuel cost?',
    answer: 'FuelCost = FuelUsed × FuelPrice (matching volume units).',
  },
  {
    question: 'How do I calculate cost per kilometer?',
    answer: 'CostPerKm = TotalTripCost / DistanceKm when distance > 0.',
  },
  {
    question: 'How do I calculate cost per mile?',
    answer:
      'Convert total cost and distance to miles, or divide CostPerKm by km-per-mile (≈1.609344).',
  },
  {
    question: 'How do I split fuel costs among passengers?',
    answer:
      'CostPerPerson = TotalTripCost / Passengers (integer ≥ 1), typically including the driver in the count.',
  },
  {
    question: 'What is the difference between km/L and L/100 km?',
    answer:
      'km/L is distance per liter (higher is better). L/100 km is liters per 100 km (lower is better). They are reciprocals scaled by 100.',
  },
  {
    question: 'How do I convert mpg to L/100 km?',
    answer:
      'Approx. L/100 km = 235.215 / mpg (US) or 282.481 / mpg (UK). This calculator converts when you change units.',
  },
  {
    question: 'Does the calculator consider traffic?',
    answer:
      'No. Enter a realistic average speed that already reflects expected congestion. There is no live traffic feed.',
  },
  {
    question: 'Does the calculator consider road conditions?',
    answer:
      'No. Adjust average speed and break plans yourself for weather, construction, or terrain.',
  },
  {
    question: 'Can the calculator estimate arrival time across midnight?',
    answer:
      'Yes. Durations are added as elapsed time, so the calendar date rolls forward when needed.',
  },
  {
    question: 'Can I calculate a trip lasting multiple days?',
    answer:
      'Yes. Long durations format with days, hours, and minutes, and schedules advance across dates.',
  },
  {
    question: 'How do rest stops affect arrival time?',
    answer:
      'Each break minute is added to total trip time, which pushes arrival later (or requires an earlier departure).',
  },
  {
    question: 'How do I calculate total road-trip cost?',
    answer:
      'Total = FuelCost + Parking + Tolls + Other. Then optionally divide by passengers.',
  },
  {
    question: 'How can I reduce my driving expenses?',
    answer:
      'Improve average economy, share costs, avoid unnecessary tolls, and plan efficient routes — this tool only estimates from your inputs.',
  },
  {
    question: 'How do toll roads affect trip costs?',
    answer:
      'Enter toll amounts under additional expenses so they are included in total and per-person cost.',
  },
  {
    question: 'How do I calculate fuel cost for a round trip?',
    answer:
      'Use round-trip distance (or double one-way distance) with the same economy and price formulas.',
  },
  {
    question: 'How accurate is a drive time calculator?',
    answer:
      'It is only as accurate as your average speed, breaks, and economy assumptions. It is not a GPS ETA with live traffic.',
  },
];
