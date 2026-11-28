import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GVWR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'GVWR Calculator' },
  { id: 'what-is-gvwr', label: 'What Is GVWR?' },
  { id: 'what-is-gvw', label: 'What Is Gross Vehicle Weight?' },
  { id: 'gvwr-vs-gvw', label: 'GVWR vs. Gross Vehicle Weight' },
  { id: 'tare', label: 'What Is Vehicle Tare Weight?' },
  { id: 'curb', label: 'What Is Vehicle Curb Weight?' },
  { id: 'payload', label: 'What Is Vehicle Payload?' },
  { id: 'how-gvw', label: 'How to Calculate Gross Vehicle Weight' },
  { id: 'how-check', label: 'How to Check Against GVWR' },
  { id: 'max-payload', label: 'How to Calculate Maximum Payload' },
  { id: 'remaining', label: 'How to Calculate Remaining Capacity' },
  { id: 'exceed', label: 'What Happens If You Exceed GVWR?' },
  { id: 'gcwr', label: 'GVWR vs. GCWR' },
  { id: 'gawr', label: 'GVWR vs. GAWR' },
  { id: 'towing', label: 'GVWR vs. Towing Capacity' },
  { id: 'tongue', label: 'Does Tongue Weight Count?' },
  { id: 'pickups', label: 'GVWR for Pickup Trucks' },
  { id: 'suvs', label: 'GVWR for SUVs and Cars' },
  { id: 'commercial', label: 'GVWR for Commercial Trucks' },
  { id: 'trailers', label: 'GVWR for Trailers' },
  { id: 'find-gvwr', label: 'How to Find Your Vehicle’s GVWR' },
  { id: 'measure', label: 'How to Measure Actual Weight' },
  { id: 'safety', label: 'Why GVWR Matters for Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gvwr-faq', label: 'Frequently Asked Questions' },
];

export const GVWR_FAQS: readonly FAQItem[] = [
  {
    question: 'What does GVWR stand for?',
    answer: 'Gross Vehicle Weight Rating — the manufacturer’s maximum permitted loaded vehicle weight.',
  },
  {
    question: 'What is GVWR?',
    answer:
      'A manufacturer-assigned limit for the vehicle’s total loaded weight including passengers, cargo, and fluids as defined by the rating.',
  },
  {
    question: 'How do I calculate gross vehicle weight?',
    answer: 'Estimated GVW ≈ tare (unloaded) weight + payload weight.',
  },
  {
    question: 'Can GVWR be calculated from tare weight and payload?',
    answer:
      'No. Tare + payload estimates actual or proposed GVW. Official GVWR comes only from the manufacturer label or documentation.',
  },
  {
    question: 'What is the difference between GVWR and GVW?',
    answer:
      'GVW is the current or estimated loaded weight. GVWR is the maximum allowed loaded weight rating.',
  },
  {
    question: 'What is vehicle tare weight?',
    answer:
      'The weight of an unloaded vehicle under a stated weighing convention. Exact inclusions vary by context.',
  },
  {
    question: 'What is vehicle curb weight?',
    answer:
      'Typically the weight of a vehicle with standard equipment and fluids, without passengers or cargo. Related to — but not always identical to — tare.',
  },
  {
    question: 'What is rated payload?',
    answer:
      'How much passenger and cargo weight the vehicle is designed to carry under manufacturer rules, often published separately from GVWR.',
  },
  {
    question: 'How do I calculate maximum vehicle payload?',
    answer:
      'A rough estimate is GVWR − unloaded weight. Prefer the manufacturer’s published payload when available.',
  },
  {
    question: 'What happens if I exceed GVWR?',
    answer:
      'Handling, braking, and tire loads can degrade; you may face legal or insurance issues depending on jurisdiction. Reduce load before driving.',
  },
  {
    question: 'Can GVWR be negative?',
    answer: 'No. Manufacturer GVWR is a positive mass rating.',
  },
  {
    question: 'Can gross vehicle weight be zero?',
    answer:
      'A real vehicle cannot weigh zero. A zero payload on a known tare is valid mathematically for estimates.',
  },
  {
    question: 'Does GVWR include passengers?',
    answer:
      'Yes — passengers are part of the loaded vehicle mass that must stay at or below GVWR.',
  },
  {
    question: 'Does GVWR include cargo?',
    answer: 'Yes. Cargo and luggage count toward loaded weight against GVWR.',
  },
  {
    question: 'Does GVWR include fuel?',
    answer:
      'Fuel mass is part of the vehicle’s real weight. How curb/tare are defined can vary; scale weight includes fuel present at weighing.',
  },
  {
    question: 'Does GVWR include trailer weight?',
    answer:
      'The trailer has its own GVWR. Trailer mass is not simply “added into” the tow vehicle’s GVWR; tongue weight does load the tow vehicle.',
  },
  {
    question: 'Does trailer tongue weight affect GVWR?',
    answer:
      'Yes — tongue weight imposed on the hitch counts toward the towing vehicle’s loaded weight.',
  },
  {
    question: 'What is the difference between GVWR and GCWR?',
    answer:
      'GCWR (Gross Combined Weight Rating) limits the combined weight of tow vehicle plus trailer (and loads) as specified by the manufacturer.',
  },
  {
    question: 'What is the difference between GVWR and GAWR?',
    answer:
      'GAWR is the Gross Axle Weight Rating for a specific axle. You can be under GVWR and still overload an axle.',
  },
  {
    question: 'Is GVWR the same as towing capacity?',
    answer: 'No. Towing capacity and GVWR are separate manufacturer specifications.',
  },
  {
    question: 'Can GVWR change after vehicle modifications?',
    answer:
      'The certified GVWR on the label generally stays as rated unless the vehicle is re-certified. Modifications can still reduce safe payload in practice.',
  },
  {
    question: 'Where can I find my vehicle’s GVWR?',
    answer:
      'Usually on the driver’s door jamb certification label, and in the owner’s manual or manufacturer specs.',
  },
  {
    question: 'Is GVWR measured in pounds or kilograms?',
    answer:
      'Labels may use lb, kg, or both depending on market. Convert carefully (1 kg ≈ 2.20462 lb).',
  },
  {
    question: 'How do I convert GVWR from kilograms to pounds?',
    answer: 'Multiply kilograms by ≈2.2046226218 to get pounds.',
  },
  {
    question: 'How do I calculate the gross weight of a truck and trailer?',
    answer:
      'Use GCWR for the combination and each unit’s GVWR separately; weigh when possible rather than estimating alone.',
  },
  {
    question: 'What does a 3,500 kg GVWR mean?',
    answer:
      'The manufacturer rates that vehicle’s maximum loaded weight at 3,500 kg.',
  },
  {
    question: 'How much payload can a 3,500 kg GVWR vehicle carry?',
    answer:
      'Roughly 3,500 kg minus its unloaded weight — and never more than the published payload rating if one is given.',
  },
  {
    question: 'Does adding passengers reduce cargo capacity?',
    answer:
      'Yes. Passenger mass uses payload budget that would otherwise be available for cargo.',
  },
  {
    question: 'Does a roof rack affect vehicle payload?',
    answer:
      'Installed accessories add mass and reduce remaining payload within GVWR and other limits.',
  },
  {
    question: 'Is it possible to be under GVWR but exceed an axle rating?',
    answer:
      'Yes. Check GAWR and tire load ratings as well as GVWR.',
  },
  {
    question: 'What is the difference between tare weight and payload?',
    answer:
      'Tare is the unloaded vehicle; payload is the added load (people, cargo, etc.).',
  },
  {
    question: 'How do I measure my vehicle’s actual loaded weight?',
    answer:
      'Use a certified scale or weighbridge with the vehicle loaded as it will be driven.',
  },
  {
    question: 'Can I use this calculator for a pickup truck?',
    answer: 'Yes — for estimating GVW and comparing against the truck’s labeled GVWR.',
  },
  {
    question: 'Can I use it for a trailer?',
    answer:
      'Yes for trailer tare + cargo versus the trailer’s own GVWR. Do not confuse that with the tow vehicle’s GVWR.',
  },
  {
    question: 'Can I use it for a commercial vehicle?',
    answer:
      'Yes for the same mass math. Commercial operation may involve additional regulatory limits beyond this educational tool.',
  },
  {
    question: 'What is the difference between GVWR and unladen weight?',
    answer:
      'Unladen/tare is empty (per definition); GVWR is the maximum allowed loaded rating.',
  },
  {
    question: 'Is GVWR the same worldwide?',
    answer:
      'The concept is similar, but labeling, units, and related rules vary by market.',
  },
  {
    question: 'How do I know if my vehicle is overloaded?',
    answer:
      'Compare measured or carefully estimated GVW to the labeled GVWR, and check axles and tires.',
  },
  {
    question: 'Why is GVWR important for braking?',
    answer:
      'Braking systems are designed around rated loads. Excess mass increases stopping distance and heat.',
  },
  {
    question: 'How accurate is the GVWR calculator?',
    answer:
      'The arithmetic is exact for the numbers you enter. Real accuracy depends on measured weights and using the true manufacturer GVWR.',
  },
];
