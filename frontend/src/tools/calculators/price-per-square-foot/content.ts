import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PPSF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-calculate', label: 'How Do I Calculate Price Per Square Foot?' },
  { id: 'what-is-sqft', label: 'How Much Is a Square Foot?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'formula', label: 'Price Per Square Foot Formula' },
  { id: 'comparison-examples', label: 'Comparing Properties' },
  { id: 'total-vs-unit', label: 'Unit Price vs. Total Price' },
  { id: 'rental-ppsf', label: 'Rental Price Per Square Foot' },
  { id: 'factors', label: 'Factors Affecting Price Per Area' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'sqft-vs-sqm', label: 'Square Foot vs. Square Meter' },
  { id: 'ppsf-faq', label: 'Frequently Asked Questions' },
];

export const PPSF_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I determine square footage from a given price?',
    answer:
      'Area = Total Price ÷ Price Per Square Foot. Example: $600,000 ÷ $300/ft² = 2,000 ft². The price-per-area value must be greater than zero.',
  },
  {
    question: 'How do I compare two properties with different square footage?',
    answer:
      'Calculate each property’s price per unit area (price ÷ area), normalize to the same area unit and pricing context, then compare the unit prices; not only the total prices.',
  },
  {
    question: 'How do I calculate price per square foot?',
    answer:
      'Price Per Sqft = Total Property Price ÷ Area in Square Feet. Example: $500,000 ÷ 2,500 ft² = $200/ft².',
  },
  {
    question:
      'What is the price per square foot of a $500,000 home with 2,000 square feet?',
    answer: '$500,000 ÷ 2,000 ft² = $250/ft².',
  },
  {
    question: 'Is a lower price per square foot always better?',
    answer:
      'No. Location, condition, amenities, layout, and measurement conventions all matter. A lower unit price can reflect trade-offs rather than a bargain.',
  },
  {
    question: 'How do I convert price per square meter to price per square foot?',
    answer:
      'Because 1 m² = 10.7639104167 ft², price per ft² = price per m² ÷ 10.7639104167 (equivalently, price per m² = price per ft² × 10.7639104167). Keep the total property value unchanged.',
  },
  {
    question: 'Can I calculate rental price per square foot?',
    answer:
      'Yes. Monthly rent per area = monthly rent ÷ area; annual rent per area = annual rent ÷ area. Keep the period explicit (per month vs per year).',
  },
  {
    question: 'Does square footage include garages and basements?',
    answer:
      'It depends on listing and measurement conventions for the market and property type. Compare properties only when their area definitions are consistent.',
  },
  {
    question: 'Why do similar houses have different prices per square foot?',
    answer:
      'Differences in location, condition, finishes, lot attributes, demand, and how area is measured can change unit prices even when homes look similar.',
  },
  {
    question: 'What is the difference between square feet and square meters?',
    answer:
      'Both measure area. 1 m² = 10.7639104167 ft², and 1 ft² ≈ 0.09290304 m². This calculator converts area and price-per-area together so total value stays consistent.',
  },
];
