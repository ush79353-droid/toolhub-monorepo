import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ACREAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-an-acreage-calculator', label: 'What is an Acreage Calculator?' },
  { id: 'how-to-calculate-acreage', label: 'How to Calculate Acreage' },
  { id: 'acreage-calculation-formula', label: 'Acreage Calculation Formula' },
  { id: 'acres-to-square-feet', label: 'Acres to Square Feet' },
  { id: 'acres-to-hectares', label: 'Acres to Hectares' },
  { id: 'acres-to-square-meters', label: 'Acres to Square Meters' },
  { id: 'how-to-estimate-land-price', label: 'How to Estimate Land Price' },
  { id: 'acreage-faq', label: 'Frequently Asked Questions' },
];

export interface AcreageGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
}

export const ACREAGE_GUIDE_SECTIONS: readonly AcreageGuideSection[] = [
  {
    id: 'what-is-an-acreage-calculator',
    title: 'What is an Acreage Calculator?',
    paragraphs: [
      'An acreage calculator turns the width and length of a rectangular plot into an area, usually in acres, and converts that area into other land units such as square feet, square meters, and hectares. Omega Calculators also multiplies the area by an optional price per unit so you can sketch a land cost in the same session.',
      'The tool is for rectangular parcels. Real lots can be L-shaped, curved, or cut by easements. Survey plats, GIS maps, and local deed descriptions remain the source of truth for legal boundaries. Use this page for planning, homework, and quick comparisons, not as a substitute for a survey.',
    ],
  },
  {
    id: 'how-to-calculate-acreage',
    title: 'How to Calculate Acreage',
    paragraphs: [
      'Measure or look up one side of the rectangle as width and the perpendicular side as length. Pick matching length units for each side, or let each side use its own unit. The calculator converts both sides to meters, multiplies them, and then expresses the product in the area unit you choose.',
      'If you already know the area and only need unit conversion, switch to Area conversion. Enter the area and pick a unit. The page lists the same physical area in acres, square feet, hectares, and the other supported units. It does not invent a width and length, because many different rectangles share one area.',
      'A worked rectangular example: 220 yards by 220 yards is 48,400 square yards. Dividing by 4,840 square yards per acre gives 10 acres.',
    ],
  },
  {
    id: 'acreage-calculation-formula',
    title: 'Acreage Calculation Formula',
    paragraphs: [
      'Convert each side to meters using exact SI relationships: 1 yard is 0.9144 meters, 1 foot is 0.3048 meters, and 1 mile is 1,609.344 meters. Multiply the meter widths to get square meters. Divide by 4,046.8564224 to get acres, or by 10,000 to get hectares.',
      'Keeping everything in meters first avoids mixing feet with yards or acres with hectares inside the same product. Display rounding happens only after the SI area is known.',
    ],
    formula: 'Area (m²) = Width (m) × Length (m)  |  Acres = Area (m²) ÷ 4,046.8564224',
    formulaNote: '1 acre = 43,560 ft² = 4,840 yd² = 4,046.8564224 m². 1 hectare = 10,000 m² ≈ 2.47105 acres.',
  },
  {
    id: 'acres-to-square-feet',
    title: 'Acres to Square Feet',
    paragraphs: [
      'One acre is defined as 43,560 square feet. Ten acres are therefore 435,600 square feet. Going the other way, divide square feet by 43,560 to recover acres.',
      'Surveyors still work in feet and acres in many US jurisdictions. When a listing quotes both, check that the square-footage figure matches 43,560 times the acreage within ordinary rounding.',
    ],
  },
  {
    id: 'acres-to-hectares',
    title: 'Acres to Hectares',
    paragraphs: [
      'A hectare is 10,000 square meters, the metric land unit used in much of the world. One hectare is about 2.47105 acres, so one acre is about 0.404686 hectares.',
      'To convert acres to hectares without a calculator, multiply acres by 0.404686. To convert hectares to acres, multiply by 2.47105. Omega Calculators uses the exact square-meter definitions instead of short approximations.',
    ],
  },
  {
    id: 'acres-to-square-meters',
    title: 'Acres to Square Meters',
    paragraphs: [
      'One acre equals 4,046.8564224 square meters by international agreement on the yard and meter. That same constant is the bridge between imperial and metric land units on this page.',
      'Square kilometers are useful for very large holdings: one square kilometer is 100 hectares, or about 247.105 acres.',
    ],
  },
  {
    id: 'how-to-estimate-land-price',
    title: 'How to Estimate Land Price',
    paragraphs: [
      'Open Unit and total price, enter a price per acre (or per square foot, hectare, or another supported unit), and keep the same currency symbol you use for the quote. Total price is area in that pricing unit times the unit price.',
      'Example: 5 acres at 15,000 per acre is 75,000 in the selected currency. Changing the display currency only changes the symbol and grouping. It does not apply a live foreign-exchange rate.',
      'List prices can exclude closing costs, taxes, commissions, and improvements. Treat the total as a quick estimate of the quoted land cost, not a closing statement.',
    ],
  },
];

export const ACREAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate acreage from length and width?',
    answer:
      'Convert width and length to the same base unit, multiply them to get area, then convert that area into acres. On this page both sides are converted to meters first. Acres equal square meters divided by 4,046.8564224. A 220 yd by 220 yd rectangle is 10 acres.',
  },
  {
    question: 'How many square feet are in one acre?',
    answer:
      'One acre contains exactly 43,560 square feet. Multiply acres by 43,560 for square feet, or divide square feet by 43,560 for acres.',
  },
  {
    question: 'How many square yards are in an acre?',
    answer:
      'One acre contains exactly 4,840 square yards. That is why a 220 yd by 220 yd square equals 10 acres: 48,400 ÷ 4,840 = 10.',
  },
  {
    question: 'How many hectares are in one acre?',
    answer:
      'One acre is 4,046.8564224 square meters, and one hectare is 10,000 square meters, so one acre is about 0.404686 hectares. One hectare is about 2.47105 acres.',
  },
  {
    question: 'How do I calculate the price of land per acre?',
    answer:
      'Enter or compute the area, choose a pricing unit such as per acre, and multiply by the quoted unit price. Five acres at 15,000 per acre is 75,000. Currency selection on this calculator changes the symbol only; it does not convert between currencies.',
  },
  {
    question: 'Can I calculate acreage for irregularly shaped land?',
    answer:
      'Not with a single width × length product. Irregular parcels need triangles, trapezoids, coordinate geometry, or a survey. Area conversion mode can still convert a known total area into acres and other units once you already know that total.',
  },
];
