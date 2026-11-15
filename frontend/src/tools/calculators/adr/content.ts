import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ADR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-adr', label: 'What is average daily rate?' },
  { id: 'how-to-calculate-adr', label: 'How to calculate hotel ADR' },
  { id: 'adr-formula-examples', label: 'ADR formula and examples' },
  { id: 'room-revenue', label: 'Room revenue versus total hotel revenue' },
  { id: 'rooms-sold-vs-available', label: 'Rooms sold versus available room-nights' },
  { id: 'adr-vs-occupancy', label: 'ADR versus occupancy' },
  { id: 'adr-vs-revpar', label: 'ADR versus RevPAR' },
  { id: 'improve-adr', label: 'How hotels can raise ADR' },
  { id: 'adr-limitations', label: 'Limitations of ADR' },
  { id: 'adr-with-other-kpis', label: 'When to use ADR with other KPIs' },
  { id: 'adr-faq', label: 'Frequently asked questions' },
];

export interface AdrGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
}

export const ADR_GUIDE_SECTIONS: readonly AdrGuideSection[] = [
  {
    id: 'what-is-adr',
    title: 'What is average daily rate?',
    paragraphs: [
      'Average daily rate, or ADR, is the mean price a hotel actually collected for each room-night it sold. It answers a narrow question: of the rooms that were occupied, what did each sold night bring in as room revenue?',
      'ADR is a money amount per sold room-night. It is not an occupancy percentage, and it does not describe rooms that stayed empty. A hotel can post a high ADR and still have a weak month if too many rooms were vacant.',
    ],
  },
  {
    id: 'how-to-calculate-adr',
    title: 'How to calculate hotel ADR',
    paragraphs: [
      'Add the room revenue for the period you care about, then divide by the room-nights sold in that same period. One occupied room for one night is one room-night. A 3-night stay in one room is three room-nights if the room was sold each night.',
      'Choose Solve for ADR and enter those two figures. The other modes reverse the same relationship: revenue equals ADR times room-nights, and room-nights equal revenue divided by ADR. Currency only changes the symbol. It does not convert PKR into another currency.',
    ],
    formula: 'ADR = total room revenue ÷ room-nights sold',
  },
  {
    id: 'adr-formula-examples',
    title: 'ADR formula and examples',
    paragraphs: [
      'Room revenue of 150,000 and 100 room-nights sold produces an ADR of 1,500. That 1,500 is the average collected per sold night, not the rack rate and not the revenue per room in the building.',
      'If you already know an ADR of 1,500 and you sold 100 room-nights, room revenue is 150,000. Dividing 1,000 of revenue by an ADR of 300 produces 3.3333 room-nights. A night audit cannot sell a fraction of a night, so that result is a mathematical split, not a booking count, until you round it to a whole night.',
    ],
    formula: '1,500 = 150,000 ÷ 100',
    formulaNote: 'Zero room revenue with rooms sold is an ADR of zero. Zero room-nights sold cannot be divided into an ADR.',
  },
  {
    id: 'room-revenue',
    title: 'Room revenue versus total hotel revenue',
    paragraphs: [
      'Use revenue from selling rooms. Leave out restaurant, bar, spa, parking, and other charges that are not the room rate. Those amounts belong in total hotel revenue, not in ADR.',
      'Be consistent about taxes and mandatory fees. If one month’s room revenue is net of tax and the next month includes tax, the ADR change is an accounting change, not a rate change. This calculator does not strip tax for you. Enter the room-revenue definition you want the rate to follow.',
    ],
  },
  {
    id: 'rooms-sold-vs-available',
    title: 'Rooms sold versus available room-nights',
    paragraphs: [
      'Physical rooms are the keys in the hotel. Room-nights multiply those keys by the number of days in the report. A 80-room hotel over 2 nights has 160 available room-nights, even though it still has 80 physical rooms.',
      'Rooms sold in a multi-day report is the sum of room-nights sold, not the number of different room numbers that were used. Selling all 80 rooms on both nights is 160 sold room-nights. Sold room-nights cannot exceed available room-nights in this inventory model.',
    ],
    formula: 'Available room-nights = physical rooms × days in the period',
  },
  {
    id: 'adr-vs-occupancy',
    title: 'ADR versus occupancy',
    paragraphs: [
      'Occupancy is sold room-nights divided by available room-nights. ADR ignores the empty rooms. A hotel that sells 100 of 160 available room-nights is 62.5% occupied, whatever price those 100 nights fetched.',
      'Raising the rate can lift ADR and cut occupancy at the same time. The ADR figure alone does not say which effect was larger.',
    ],
    formula: 'Occupancy % = (sold room-nights ÷ available room-nights) × 100',
  },
  {
    id: 'adr-vs-revpar',
    title: 'ADR versus RevPAR',
    paragraphs: [
      'Revenue per available room, or RevPAR, spreads room revenue across every available room-night, including the empty ones. With 150,000 of room revenue and 160 available room-nights, RevPAR is 937.50. The same hotel’s ADR is still 1,500 because only the 100 sold nights enter that average.',
      'RevPAR also equals ADR times occupancy written as a decimal. 1,500 times 0.625 is 937.50. That identity holds when both figures use the same room revenue and the same inventory. It is a check, not a second source of revenue.',
    ],
    formula: 'RevPAR = room revenue ÷ available room-nights',
    formulaNote: 'Equivalently, RevPAR = ADR × occupancy rate as a decimal.',
  },
  {
    id: 'improve-adr',
    title: 'How hotels can raise ADR',
    paragraphs: [
      'Hotels raise ADR by selling a richer mix of room types, shortening discounts, packaging breakfast or parking only when that package is still counted as room revenue under their definition, and holding rate on dates that are already filling. The calculator does not model those tactics. It only prices the revenue and the nights you enter.',
      'A higher ADR that comes from refusing low-rated demand can shrink RevPAR. Compare the two before treating an ADR increase as a win.',
    ],
  },
  {
    id: 'adr-limitations',
    title: 'Limitations of ADR',
    paragraphs: [
      'ADR says nothing about profit. Two hotels with the same ADR can have very different wage, energy, and commission costs. It also ignores empty rooms, so it can look strong in a month that lost money.',
      'Group contracts, complimentary rooms, and out-of-order rooms change both the revenue and the night count. If those nights are omitted from “rooms sold” in one report and included in another, the ADR is not comparable. This page does not apply a uniform system of accounts for you.',
    ],
  },
  {
    id: 'adr-with-other-kpis',
    title: 'When to use ADR with other KPIs',
    paragraphs: [
      'Use ADR when you want the average price of nights that actually sold. Add occupancy when you need to see how full the hotel was. Add RevPAR when you need one figure that combines price and fill. None of the three is a profit measure.',
      'For a pricing review, read ADR, occupancy, and RevPAR for the same dates and the same room-revenue definition. A rate decision that lifts only one of them can still be the wrong commercial result.',
    ],
  },
];

export const ADR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the ADR formula for a hotel?',
    answer:
      'Divide total room revenue by the number of room-nights sold in the same period. Revenue of 150,000 and 100 sold room-nights is an ADR of 1,500.',
  },
  {
    question: 'Is ADR a percentage?',
    answer:
      'No. ADR is money per sold room-night. Occupancy is the percentage. RevPAR is money per available room-night, including vacant rooms.',
  },
  {
    question: 'Should food and beverage go into ADR?',
    answer:
      'No. Keep ADR to room revenue. Restaurant, bar, spa, and similar charges belong in total hotel revenue, not in this rate.',
  },
  {
    question: 'What is the difference between rooms and room-nights?',
    answer:
      'Physical rooms are the keys in the building. A room-night is one of those rooms for one night. Over several days, rooms sold means the sum of room-nights sold, not the number of unique room numbers.',
  },
  {
    question: 'Why can solved room-nights be a fraction?',
    answer:
      'Revenue divided by ADR is exact arithmetic. A night audit still needs a whole number of room-nights. The calculator keeps the fraction and tells you when the result is not a whole night.',
  },
  {
    question: 'Does changing the currency convert my revenue?',
    answer:
      'No. The currency control changes the symbol and the decimal format. Enter room revenue and ADR in the same currency. Room-night counts and occupancy are not converted.',
  },
];
