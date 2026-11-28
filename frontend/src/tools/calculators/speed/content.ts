import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SPEED_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Speed Calculator' },
  { id: 'what-speed', label: 'What Is Speed?' },
  { id: 'sdt', label: 'Speed, Distance, and Time' },
  { id: 'formula', label: 'Speed Formula' },
  { id: 'how-speed', label: 'How to Calculate Speed' },
  { id: 'how-distance', label: 'How to Calculate Distance' },
  { id: 'how-time', label: 'How to Calculate Travel Time' },
  { id: 'avg', label: 'What Is Average Speed?' },
  { id: 'avg-how', label: 'How to Calculate Average Speed' },
  { id: 'velocity', label: 'Average Speed vs Velocity' },
  { id: 'instant', label: 'Instantaneous vs Average' },
  { id: 'units', label: 'Common Speed Units' },
  { id: 'kmh-mph', label: 'km/h to mph' },
  { id: 'mph-kmh', label: 'mph to km/h' },
  { id: 'ms-kmh', label: 'm/s to km/h' },
  { id: 'kn-kmh', label: 'Knots to km/h' },
  { id: 'sound', label: 'Speed of Sound' },
  { id: 'light', label: 'Speed of Light' },
  { id: 'road', label: 'Speed and Road Travel' },
  { id: 'transport', label: 'Speed and Transportation' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'speed-faq', label: 'Frequently Asked Questions' },
];

export const SPEED_FAQS: readonly FAQItem[] = [
  {
    question: 'What is speed?',
    answer:
      'Speed is how fast something moves: distance traveled per unit of time. It is a scalar (no direction).',
  },
  {
    question: 'What is the formula for speed?',
    answer: 'Speed = Distance ÷ Time.',
  },
  {
    question: 'How do I calculate speed?',
    answer:
      'Divide distance by elapsed time in matching units. Example: 150 km ÷ 3 h = 50 km/h.',
  },
  {
    question: 'How do I calculate distance?',
    answer: 'Distance = Speed × Time. Example: 80 km/h × 2.5 h = 200 km.',
  },
  {
    question: 'How do I calculate time?',
    answer: 'Time = Distance ÷ Speed. Example: 240 km ÷ 60 km/h = 4 h.',
  },
  {
    question: 'What are the units of speed?',
    answer:
      'Common units include m/s, km/h, mph, ft/s, and knots (nautical miles per hour).',
  },
  {
    question: 'What is average speed?',
    answer:
      'Total distance divided by total elapsed time for a trip or set of segments.',
  },
  {
    question: 'How do you calculate average speed?',
    answer:
      'Add all distances, add all times, then divide. Do not average speeds unless the times are equal.',
  },
  {
    question: 'What is the difference between speed and velocity?',
    answer:
      'Speed is scalar. Velocity is a vector: displacement per time, including direction.',
  },
  {
    question: 'What is instantaneous speed?',
    answer:
      'Speed at a particular instant. A single overall distance/time pair only gives average speed.',
  },
  {
    question: 'What is the difference between instantaneous and average speed?',
    answer:
      'Average covers a duration; instantaneous is the limiting rate over a very short interval.',
  },
  {
    question: 'How do you calculate speed in meters per second?',
    answer: 'Convert distance to meters and time to seconds, then divide.',
  },
  {
    question: 'How do you calculate speed in kilometers per hour?',
    answer: 'Use km and hours, or convert m/s with × 3.6.',
  },
  {
    question: 'How do you calculate speed in miles per hour?',
    answer: 'Use miles and hours, or convert from other units with the unit selector.',
  },
  {
    question: 'How do I convert km/h to mph?',
    answer: 'Divide by 1.609344 (or multiply by ≈0.621371). 100 km/h ≈ 62.14 mph.',
  },
  {
    question: 'How do I convert mph to km/h?',
    answer: 'Multiply by 1.609344. 60 mph = 96.56064 km/h.',
  },
  {
    question: 'How do I convert m/s to km/h?',
    answer: 'Multiply by 3.6. 20 m/s = 72 km/h.',
  },
  {
    question: 'How do I convert km/h to m/s?',
    answer: 'Divide by 3.6. 90 km/h = 25 m/s.',
  },
  {
    question: 'What is a knot?',
    answer: 'One nautical mile per hour. 1 kn = 1.852 km/h exactly.',
  },
  {
    question: 'How do I convert knots to mph?',
    answer: '1 kn ≈ 1.15078 mph (nmi/h → statute mi/h).',
  },
  {
    question: 'How do I convert knots to km/h?',
    answer: 'Multiply by 1.852. 10 kn = 18.52 km/h.',
  },
  {
    question: 'How fast is the speed of sound?',
    answer:
      'In dry air near 20°C it is about 343 m/s (~1,235 km/h). It depends on temperature and medium.',
  },
  {
    question: 'What is the speed of light?',
    answer: 'In vacuum, c = 299,792,458 m/s exactly (defined).',
  },
  {
    question: 'Can speed be negative?',
    answer:
      'In this scalar calculator, no. Direction belongs to velocity, not speed.',
  },
  {
    question: 'Can speed be zero?',
    answer: 'Yes—zero distance in positive time means stationary (speed 0).',
  },
  {
    question: 'What happens when time is zero?',
    answer:
      'Positive distance over zero time has no finite speed; zero over zero is indeterminate.',
  },
  {
    question: 'How do I calculate travel time for 100 miles?',
    answer: 'Divide 100 miles by your speed in mph. At 50 mph: 2 hours.',
  },
  {
    question: 'How long does it take to travel 240 miles at 60 mph?',
    answer: '240 ÷ 60 = 4 hours.',
  },
  {
    question: 'How far can I travel in two hours at 80 km/h?',
    answer: '80 × 2 = 160 km (constant average speed).',
  },
  {
    question: 'How do I calculate average driving speed?',
    answer:
      'Total odometer distance divided by total elapsed driving time, including or excluding stops as you choose.',
  },
  {
    question: 'What is the difference between speed and acceleration?',
    answer:
      'Speed is how fast you move; acceleration is how quickly speed (or velocity) changes.',
  },
  {
    question: 'How does distance affect travel time?',
    answer: 'At constant speed, time rises in proportion to distance.',
  },
  {
    question: 'How does speed affect travel time?',
    answer: 'At fixed distance, higher average speed shortens travel time.',
  },
  {
    question: 'What is the speed of a walking person?',
    answer: 'Often around 5 km/h as a rough reference—actual pace varies.',
  },
  {
    question: 'What is the average speed of a commercial airplane?',
    answer:
      'Cruise is often near ~900 km/h as a rough comparison figure; flights vary.',
  },
  {
    question: 'How do I compare two speeds?',
    answer:
      'Convert both to the same unit and divide. 100 km/h is 20× a 5 km/h walking reference.',
  },
  {
    question: 'Is average speed always the arithmetic mean of two speeds?',
    answer:
      'No. Only when the times at each speed are equal. Otherwise use total distance ÷ total time.',
  },
  {
    question: 'What is the difference between distance and displacement?',
    answer:
      'Distance is path length. Displacement is straight-line change in position (a vector).',
  },
  {
    question: 'How do I calculate speed with multiple travel segments?',
    answer:
      'Sum each segment’s distance and time, then divide totals—use the multi-segment mode.',
  },
  {
    question: 'Does the calculator account for traffic or stops?',
    answer:
      'No. It uses the distances and times you enter. Include stop time in elapsed time if you want trip-average speed.',
  },
];
