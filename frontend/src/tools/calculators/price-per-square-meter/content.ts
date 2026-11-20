import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PPSM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-calculate', label: 'How to Calculate Price Per Square Meter' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'comparison-examples', label: 'Comparing Properties' },
  { id: 'formula', label: 'Price Per Square Meter Formula' },
  { id: 'sqm-vs-sqft', label: 'Square Meter vs. Square Foot' },
  { id: 'rental', label: 'Rental Price Per Square Meter' },
  { id: 'why-area-matters', label: 'Why Property Area Matters' },
  { id: 'factors', label: 'Factors Affecting Price Per m²' },
  { id: 'misleading', label: 'When Unit Price Misleads' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'ppsm-faq', label: 'Frequently Asked Questions' },
];

export const PPSM_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate a price per square meter?',
    answer:
      'Price Per m² = Total Property Price ÷ Floor Area in m². Example: $500,000 ÷ 250 m² = $2,000/m².',
  },
  {
    question: 'What is a 100 square meter house price?',
    answer:
      'Total price = price per m² × 100. Example: at $2,500/m², a 100 m² home would be $250,000. Actual prices vary by market and property.',
  },
  {
    question: 'Where is the most expensive square meter in the world?',
    answer:
      'Rankings change with market, property type, data source, and date. This calculator does not publish a current global ranking.',
  },
  {
    question: 'What is a $400,000 house surface area?',
    answer:
      'Area = Total Price ÷ Price Per m². Example: $400,000 ÷ $2,500/m² = 160 m².',
  },
  {
    question: 'How do I calculate rental price per m²?',
    answer:
      'Monthly rent per m² = monthly rent ÷ area; annual rent per m² = annual rent ÷ area. Keep the period explicit when comparing.',
  },
  {
    question: 'How do I convert price per square foot to price per square meter?',
    answer:
      'Because 1 m² ≈ 10.7639104167 ft², price per m² ≈ price per ft² × 10.7639104167 (and price per ft² ≈ price per m² × 0.09290304). Keep total property value unchanged.',
  },
  {
    question: 'Is a lower price per m² always better?',
    answer:
      'No. Location, condition, amenities, layout, and how area is measured all matter. Unit price is only one comparison metric.',
  },
  {
    question: 'How do I compare two properties with different floor areas?',
    answer:
      'Compute each property’s price per m² (or normalize to the same unit), then compare unit prices rather than total prices alone.',
  },
  {
    question: 'What is the difference between gross floor area and usable floor area?',
    answer:
      'Gross area often includes walls and common elements; usable or net area focuses on occupied space. Mixing definitions can distort price-per-m² comparisons.',
  },
  {
    question: 'Can this calculator estimate the total price of a property?',
    answer:
      'Yes. In total-price mode: Total Price = Price Per Area × Area. Example: $2,500/m² × 200 m² = $500,000.',
  },
];
