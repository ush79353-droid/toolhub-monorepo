import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MTH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Miles to Hours Converter' },
  { id: 'what-is', label: 'What Is a Miles to Hours Converter?' },
  { id: 'how-works', label: 'How the Calculator Works' },
  { id: 'formula', label: 'Miles to Hours Formula' },
  { id: 'how-convert', label: 'How to Convert Miles to Hours' },
  { id: 'mph', label: 'Hours From Miles and MPH' },
  { id: 'minutes', label: 'Miles to Minutes' },
  { id: 'distance', label: 'Distance From Speed and Time' },
  { id: 'speed', label: 'Required Speed' },
  { id: 'mph-kmh', label: 'MPH vs KM/H' },
  { id: 'examples', label: 'Conversion Examples' },
  { id: 'table', label: 'Conversion Table' },
  { id: 'when', label: 'When to Estimate Travel Time' },
  { id: 'differ', label: 'Why Actual Time Differs' },
  { id: 'tips', label: 'Tips for Accurate Estimates' },
  { id: 'arrival', label: 'Travel Time vs Arrival Time' },
  { id: 'dst', label: 'Distance, Speed, and Time' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'mth-faq', label: 'Frequently Asked Questions' },
];

export const MTH_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I convert miles directly into hours?',
    answer:
      'No. Hours = miles ÷ speed. Without an average speed (for example mph), miles alone do not define travel time.',
  },
  {
    question: 'What is the formula for converting miles to hours?',
    answer: 'Time (hours) = Distance (miles) ÷ Speed (mph).',
  },
  {
    question: 'How do I calculate travel time from distance and speed?',
    answer:
      'Divide distance by average speed in matching units. Example: 150 mi ÷ 50 mph = 3 hours.',
  },
  {
    question: 'How many hours does it take to travel 10 miles?',
    answer: 'At 50 mph: 10 ÷ 50 = 0.2 hours (12 minutes). At 60 mph: 10 minutes.',
  },
  {
    question: 'How many hours does it take to travel 20 miles?',
    answer: 'At 40 mph: 0.5 hours. At 60 mph: ⅓ hour (20 minutes).',
  },
  {
    question: 'How long does it take to drive 30 miles at 60 mph?',
    answer: '30 ÷ 60 = 0.5 hours (30 minutes).',
  },
  {
    question: 'How long does it take to drive 40 miles at 50 mph?',
    answer: '40 ÷ 50 = 0.8 hours (48 minutes).',
  },
  {
    question: 'How long does it take to drive 50 miles at 60 mph?',
    answer: '50 ÷ 60 ≈ 0.833 hours (50 minutes).',
  },
  {
    question: 'How long does it take to drive 60 miles at 30 mph?',
    answer: '60 ÷ 30 = 2 hours.',
  },
  {
    question: 'How long does it take to drive 100 miles at 50 mph?',
    answer: '100 ÷ 50 = 2 hours.',
  },
  {
    question: 'How long does it take to drive 100 miles at 60 mph?',
    answer: '100 ÷ 60 ≈ 1.667 hours (1 hour 40 minutes).',
  },
  {
    question: 'How long does it take to drive 120 miles at 60 mph?',
    answer: '120 ÷ 60 = 2 hours.',
  },
  {
    question: 'How long does it take to drive 150 miles at 50 mph?',
    answer: '150 ÷ 50 = 3 hours.',
  },
  {
    question: 'How long does it take to drive 180 miles at 60 mph?',
    answer: '180 ÷ 60 = 3 hours.',
  },
  {
    question: 'How many hours does 200 miles take at 50 mph?',
    answer: '200 ÷ 50 = 4 hours.',
  },
  {
    question: 'How many hours does it take to travel 240 miles at 60 mph?',
    answer: '240 ÷ 60 = 4 hours.',
  },
  {
    question: 'How long does it take to drive 300 miles at 60 mph?',
    answer: '300 ÷ 60 = 5 hours.',
  },
  {
    question: 'How long does it take to travel 500 miles at 70 mph?',
    answer: '500 ÷ 70 ≈ 7.143 hours (about 7 hours 9 minutes).',
  },
  {
    question: 'How do I convert miles into minutes?',
    answer: 'Minutes = (miles ÷ mph) × 60. Example: 30 mi at 60 mph → 30 minutes.',
  },
  {
    question: 'How do I convert hours into miles?',
    answer:
      'Miles = mph × hours. Example: 60 mph × 2.5 h = 150 miles. You need a speed.',
  },
  {
    question: 'How do I calculate speed from distance and time?',
    answer: 'Speed = Distance ÷ Time. Example: 240 mi ÷ 4 h = 60 mph.',
  },
  {
    question: 'How do I calculate distance from speed and time?',
    answer: 'Distance = Speed × Time. Example: 50 mph × 3 h = 150 miles.',
  },
  {
    question: 'What is the difference between speed and average speed?',
    answer:
      'Instantaneous speed is the reading at a moment. Average speed is total distance ÷ total time for the trip.',
  },
  {
    question: 'What does mph mean?',
    answer: 'Miles per hour — distance in miles traveled in one hour at that rate.',
  },
  {
    question: 'How do I convert mph to km/h?',
    answer: 'Multiply by 1.609344. Example: 60 mph ≈ 96.56064 km/h.',
  },
  {
    question: 'How do I convert kilometers into travel hours?',
    answer: 'Hours = km ÷ (km/h). Example: 150 km ÷ 75 km/h = 2 hours.',
  },
  {
    question: 'How do I calculate travel time in seconds?',
    answer: 'Seconds = (distance ÷ speed) × 3600 when speed is per hour.',
  },
  {
    question: 'How do I calculate travel time in minutes?',
    answer: 'Minutes = (distance ÷ speed) × 60 for hourly speed units.',
  },
  {
    question: 'Why does my actual driving time differ from the calculated time?',
    answer:
      'Traffic, stops, hills, weather, speed limits, and routing change average speed from a constant assumption.',
  },
  {
    question: 'How do I include breaks in travel time?',
    answer:
      'Add total break time: driving time + (breaks × break duration). Example: 4 h + 2 × 15 min = 4.5 h.',
  },
  {
    question: 'How do I estimate travel time with traffic?',
    answer:
      'Use a lower average speed that reflects congestion, or add buffer time. This tool does not pull live traffic.',
  },
  {
    question: 'How do I calculate the required speed for a journey?',
    answer:
      'Required average speed = Distance ÷ available time. Stay within legal limits.',
  },
  {
    question: 'How many miles can I travel in one hour?',
    answer:
      'Equal to your average mph. At 60 mph average you cover about 60 miles in one hour.',
  },
  {
    question: 'How far can I travel in two hours at 60 mph?',
    answer: '60 × 2 = 120 miles at a constant 60 mph average.',
  },
  {
    question: 'How do I calculate time saved by driving at different average speeds?',
    answer:
      'Time saved = Time_A − Time_B. Reduction % = (Time_A − Time_B) / Time_A × 100.',
  },
  {
    question: 'Can I use the calculator for walking or cycling?',
    answer:
      'Yes — enter a realistic average speed for that mode (for example 3–4 mph walking).',
  },
  {
    question: 'Can I use kilometers instead of miles?',
    answer: 'Yes. Switch distance to km and speed to km/h (or convert units).',
  },
  {
    question: 'Can I calculate time using knots?',
    answer:
      'Yes. Select kn for speed and a compatible distance unit (often nmi for marine trips).',
  },
  {
    question: 'How do I calculate average speed during a road trip?',
    answer: 'Average speed = total distance ÷ total elapsed time (including or excluding stops, consistently).',
  },
  {
    question: 'Is travel time proportional to distance?',
    answer:
      'At constant average speed, yes — double the distance doubles the time. Changing speed breaks that simple proportion.',
  },
];
