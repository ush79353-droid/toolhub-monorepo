import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ENGINE_HOURS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Engine Hours to Miles Converter' },
  { id: 'what-are-engine-hours', label: 'What Are Engine Hours?' },
  { id: 'hours-vs-odometer', label: 'Engine Hours vs. Odometer Miles' },
  { id: 'how-to-convert', label: 'How to Convert Engine Hours to Miles' },
  { id: 'formula-miles', label: 'Engine Hours to Miles Formula' },
  { id: 'formula-km', label: 'How to Convert to Kilometers' },
  { id: 'miles-to-hours', label: 'How to Convert Miles to Engine Hours' },
  { id: 'driving-vs-idle', label: 'Driving vs. Idle Engine Hours' },
  { id: 'miles-per-hour', label: 'How Many Miles Equal One Engine Hour?' },
  { id: 'maintenance', label: 'Why Engine Hours Matter for Maintenance' },
  { id: 'idling-wear', label: 'How Engine Idling Affects Wear' },
  { id: 'maintenance-equiv', label: 'What Is Maintenance-Equivalent Mileage?' },
  { id: 'trucks', label: 'Engine Hours for Trucks & Fleets' },
  { id: 'agriculture', label: 'Engine Hours for Agricultural Equipment' },
  { id: 'construction', label: 'Engine Hours for Construction Equipment' },
  { id: 'inspection', label: 'Engine Hours and Used Vehicle Inspection' },
  { id: 'estimate-speed', label: 'How to Estimate Average Vehicle Speed' },
  { id: 'cannot-exact', label: 'Why Hours Cannot Determine Exact Mileage' },
  { id: 'examples', label: 'Engine Hours Conversion Examples' },
  { id: 'limitations', label: 'Limitations of These Calculators' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'eh-faq', label: 'Frequently Asked Questions' },
];

export const ENGINE_HOURS_FAQS: readonly FAQItem[] = [
  {
    question: 'What are engine hours?',
    answer:
      'Engine hours measure cumulative time the engine has been running, recorded by an hour meter. They track operating time regardless of how far the vehicle or machine travels.',
  },
  {
    question: 'How do I convert engine hours to miles?',
    answer:
      'Multiply engine hours by an assumed average driving speed: Miles ≈ Engine Hours × Average Speed (mph). The result is an estimate, not odometer mileage.',
  },
  {
    question: 'What is the engine hours to miles formula?',
    answer:
      'Distance = Time × Speed. With hours and mph: Miles = Engine Hours × Average Speed.',
  },
  {
    question: 'How many miles equal one engine hour?',
    answer:
      'There is no universal answer. One hour at 30 mph suggests about 30 miles; at 60 mph about 60 miles. Idle hours correspond to zero actual road miles.',
  },
  {
    question: 'How many miles are 100 engine hours?',
    answer:
      'At 30 mph average: 100 × 30 = 3,000 estimated miles. Change the speed assumption to match your use case.',
  },
  {
    question: 'How many miles are 500 engine hours?',
    answer:
      'At 30 mph: 15,000 estimated miles. At 50 km/h: 25,000 estimated kilometers (about 15,534 miles).',
  },
  {
    question: 'How many miles are 1,000 engine hours?',
    answer:
      'At 30 mph: 30,000 estimated miles. Always state the average-speed assumption when sharing results.',
  },
  {
    question: 'How many miles are 2,000 engine hours?',
    answer: 'At 30 mph: 60,000 estimated miles. At 40 mph: 80,000 estimated miles.',
  },
  {
    question: 'How many miles are 5,000 engine hours?',
    answer:
      'At 30 mph: 150,000 estimated miles. High hour counts on low-mileage vehicles often signal heavy idle or PTO use.',
  },
  {
    question: 'How do I convert engine hours to kilometers?',
    answer:
      'Use Kilometers = Engine Hours × Average Speed in km/h, or convert estimated miles with 1 mi = 1.609344 km.',
  },
  {
    question: 'How do I convert miles to engine hours?',
    answer:
      'Engine Hours ≈ Distance ÷ Average Speed. Example: 60,000 mi ÷ 30 mph = 2,000 h of estimated driving time.',
  },
  {
    question: 'What is the difference between engine hours and mileage?',
    answer:
      'Mileage (odometer) counts distance traveled. Engine hours count running time, including idle. A vehicle can accumulate hours with little or no odometer change.',
  },
  {
    question: 'Do engine hours include idle time?',
    answer:
      'Yes, when the hour meter runs whenever the engine is on. Some systems separate idle and moving hours; many consumer meters do not.',
  },
  {
    question: 'Do engine hours increase while a vehicle is stationary?',
    answer:
      'If the engine is running while parked or idling, the hour meter typically continues to accumulate.',
  },
  {
    question: 'Why are engine hours important?',
    answer:
      'They help schedule oil changes, inspections, and overhauls for equipment that works hard without covering many road miles — trucks, tractors, generators, and boats.',
  },
  {
    question: 'How do engine hours affect engine maintenance?',
    answer:
      'Manufacturers and fleets often specify service intervals by hours, by miles, or whichever comes first. High idle time can advance hour-based service even when mileage is low.',
  },
  {
    question: 'Are engine hours more important than mileage?',
    answer:
      'It depends on the machine. Highway cars often emphasize miles; commercial, agricultural, and stationary engines often emphasize hours.',
  },
  {
    question: 'How many engine hours are considered high?',
    answer:
      'Context matters: duty cycle, rebuild history, and equipment type. Compare against manufacturer guidance and similar assets — avoid one-size-fits-all thresholds.',
  },
  {
    question: 'How can I check engine hours on a vehicle?',
    answer:
      'Look for an hour meter on the dash, instrument cluster menus, telematics reports, or diagnostic tools. Not every passenger car exposes a simple hour reading.',
  },
  {
    question: 'Do all vehicles record engine hours?',
    answer:
      'No. Many passenger cars focus on odometer and trip computers. Commercial trucks, equipment, and marine engines more commonly display hour meters.',
  },
  {
    question: 'What is maintenance-equivalent mileage?',
    answer:
      'A policy conversion that maps idle hours to “as if” miles for scheduling. It is an organizational assumption, not actual distance traveled.',
  },
  {
    question: 'How many miles does one hour of idling equal?',
    answer:
      'Actual road miles: zero. Some maintenance policies assign an equivalent factor (for example 20–50 “miles” per idle hour), but there is no universal automotive standard.',
  },
  {
    question: 'Is there a standard conversion for idle hours to miles?',
    answer:
      'No single industry-wide standard applies to all engines. Use the factor your manufacturer, fleet, or maintenance plan specifies — or leave equivalent mileage blank.',
  },
  {
    question: 'How do fleet operators use engine hours?',
    answer:
      'For preventive maintenance, utilization reporting, warranty tracking, and comparing idle versus moving time across vehicles.',
  },
  {
    question: 'How do I calculate average speed from engine hours?',
    answer:
      'If you know distance and driving hours: Average Speed = Distance ÷ Driving Hours. Do not divide by total hour-meter time if that includes substantial idle.',
  },
  {
    question: 'Can engine hours predict engine lifespan?',
    answer:
      'Hours help gauge use intensity but cannot alone predict remaining life. Load, maintenance quality, fuel, and operating environment also matter.',
  },
  {
    question: 'How do engine hours affect resale value?',
    answer:
      'Buyers of commercial and specialty equipment often weigh hours heavily. High hours with low miles can signal idle-heavy duty cycles that affect value.',
  },
  {
    question: 'What is the difference between driving hours and stationary hours?',
    answer:
      'Driving hours accumulate while the vehicle moves; stationary hours accumulate while the engine runs without road travel. Distance estimates apply to driving; stationary actual distance is zero.',
  },
  {
    question: 'Can I calculate exact mileage from engine hours?',
    answer:
      'No. Without distance or a known average speed, hours alone cannot recover exact odometer miles. Any conversion is an estimate under stated assumptions.',
  },
  {
    question: 'Why does average speed affect engine-hours conversion?',
    answer:
      'Distance equals speed × time. Doubling average speed doubles estimated miles for the same driving hours.',
  },
];
