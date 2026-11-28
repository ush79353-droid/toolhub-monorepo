import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Traffic Density Calculator' },
  { id: 'flow', label: 'What Is Traffic Flow?' },
  { id: 'flow-formula', label: 'Traffic Flow Formula' },
  { id: 'density', label: 'What Is Traffic Density?' },
  { id: 'density-formula', label: 'Traffic Density Formula' },
  { id: 'speed', label: 'Average Travel Speed' },
  { id: 'flow-vs-density', label: 'Flow vs Density' },
  { id: 'headway', label: 'Traffic Headway' },
  { id: 'spacing', label: 'Vehicle Spacing' },
  { id: 'fundamental', label: 'Fundamental Relationship' },
  { id: 'how-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'congestion', label: 'Congestion Effects' },
  { id: 'capacity', label: 'Road Capacity' },
  { id: 'applications', label: 'Engineering Applications' },
  { id: 'limits', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'td-faq', label: 'Frequently Asked Questions' },
];

export const TD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is traffic density?',
    answer:
      'The number of vehicles occupying a unit length of roadway at an instant, often expressed as vehicles per kilometer.',
  },
  {
    question: 'What is traffic flow?',
    answer:
      'The number of vehicles passing a fixed point per unit time, commonly vehicles per hour.',
  },
  {
    question: 'How do you calculate traffic density?',
    answer: 'k = N / L, where N is vehicles on the segment and L is segment length.',
  },
  {
    question: 'How do you calculate traffic flow?',
    answer: 'q = N / t for vehicles passing a point during observation time t.',
  },
  {
    question: 'What is the formula for traffic density?',
    answer: 'k = N / L (use consistent length units, e.g. vehicles/km).',
  },
  {
    question: 'What is the formula for traffic flow?',
    answer: 'q = N / t (e.g. vehicles/hour when t is in hours).',
  },
  {
    question: 'What is the relationship between traffic flow and density?',
    answer:
      'Under consistent conditions, q = k × v. Flow is the product of density and stream speed.',
  },
  {
    question: 'How do you calculate average traffic speed?',
    answer: 'v = q / k when density is greater than zero.',
  },
  {
    question: 'What is traffic headway?',
    answer:
      'The average time between consecutive vehicles passing a point; h = 1/q (or 3600/q seconds when q is veh/h).',
  },
  {
    question: 'How do you calculate traffic headway?',
    answer: 'For q in vehicles/hour, h_seconds = 3600 / q when q > 0.',
  },
  {
    question: 'What is vehicle spacing?',
    answer:
      'Average longitudinal distance per vehicle along the road; s = 1/k (e.g. 1000/k meters when k is veh/km).',
  },
  {
    question: 'How do you calculate vehicle spacing?',
    answer: 's_m = 1000 / k for density in vehicles/km.',
  },
  {
    question: 'What units are used for traffic density?',
    answer: 'Commonly vehicles/km, vehicles/mi, or vehicles/m.',
  },
  {
    question: 'What units are used for traffic flow?',
    answer: 'Vehicles/hour, vehicles/minute, or vehicles/second.',
  },
  {
    question: 'How many vehicles per hour is one vehicle per minute?',
    answer: '60 vehicles/hour.',
  },
  {
    question: 'How do you convert vehicles per second to vehicles per hour?',
    answer: 'Multiply by 3,600.',
  },
  {
    question: 'What is the difference between traffic density and traffic volume?',
    answer:
      'Density is vehicles per length at an instant; volume/flow is vehicles per time past a point.',
  },
  {
    question: 'How does traffic density affect speed?',
    answer:
      'Higher density often accompanies lower speeds in congested regimes, but the q–k–v link alone does not define the full fundamental diagram shape.',
  },
  {
    question: 'What happens when traffic density increases?',
    answer:
      'Spacing shrinks; speed and throughput may fall once the facility is congested.',
  },
  {
    question: 'Can traffic flow be zero?',
    answer: 'Yes — no vehicles passing. Headway is then undefined.',
  },
  {
    question: 'Can traffic density be zero?',
    answer: 'Yes — empty segment. Speed from q/k is undefined if k = 0.',
  },
  {
    question: 'Can average traffic speed be zero?',
    answer:
      'Theoretically if flow is zero while density is positive (stopped queue). Measurement quality still matters.',
  },
  {
    question: 'How do you calculate traffic speed from flow and density?',
    answer: 'v = q / k with consistent units (e.g. veh/h and veh/km → km/h).',
  },
  {
    question: 'What is the fundamental traffic flow equation?',
    answer: 'q = k × v.',
  },
  {
    question: 'How do traffic engineers measure traffic density?',
    answer:
      'From aerial/video counts on a segment, detector estimates, or derived relations — methods vary by study.',
  },
  {
    question: 'What is a traffic observation period?',
    answer: 'The time window used to count vehicles past a point when computing flow.',
  },
  {
    question: 'How can traffic density help identify congestion?',
    answer:
      'Elevated density with reduced speed is a common congestion signature when measured consistently.',
  },
  {
    question: 'What is the difference between average speed and travel speed?',
    answer:
      'Here “travel speed” means macroscopic stream speed from q/k (related to space-mean speed), not necessarily the arithmetic mean of spot speeds.',
  },
  {
    question: 'What is the difference between time headway and spacing?',
    answer: 'Headway is time between vehicles; spacing is distance along the roadway per vehicle.',
  },
  {
    question: 'What is highway traffic density?',
    answer: 'Density measured on a highway segment, often in vehicles per lane-kilometer or per kilometer.',
  },
  {
    question: 'How many vehicles can occupy one kilometer of roadway?',
    answer:
      'It depends on vehicle lengths and gaps. Density k states the observed count per km, not a universal maximum.',
  },
  {
    question: 'What is the difference between traffic flow and road capacity?',
    answer:
      'Flow is observed throughput; capacity is a maximum sustainable flow under defined conditions.',
  },
  {
    question: 'Does high traffic density always mean high traffic flow?',
    answer: 'No. Dense congested traffic can have low speed and reduced flow.',
  },
  {
    question: 'How does road length affect measured traffic density?',
    answer: 'For the same vehicle count, longer L lowers k = N/L.',
  },
  {
    question: 'Can traffic density be calculated for multiple lanes?',
    answer:
      'Yes if N and L (or lane-km) use the same aggregation. Do not mix per-lane flow with all-lanes density.',
  },
  {
    question: 'What is the difference between space-mean and time-mean speed?',
    answer:
      'Space-mean emphasizes travel times over a segment; time-mean averages spot speeds. q = k × v uses space-mean speed conceptually.',
  },
  {
    question: 'How do you calculate vehicles per kilometer?',
    answer: 'Divide segment vehicle count by length in kilometers.',
  },
  {
    question: 'How do you calculate vehicles per mile?',
    answer: 'Divide segment vehicle count by length in miles, or convert from vehicles/km.',
  },
  {
    question: 'Why is traffic density important?',
    answer:
      'It describes how packed a roadway is and pairs with flow and speed for operations analysis.',
  },
  {
    question: 'Is a traffic density calculator accurate?',
    answer:
      'It is exact for the entered counts and the q–k–v identities. Real networks add lane changes, bottlenecks, and measurement error.',
  },
];
