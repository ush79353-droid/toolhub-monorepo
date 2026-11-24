import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NET_CARBS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Net Carbs Calculator' },
  { id: 'formula', label: 'Formula' },
  { id: 'labels', label: 'US/Canada vs elsewhere' },
  { id: 'polyols', label: 'Sugar alcohols' },
  { id: 'net-carbs-faq', label: 'Frequently Asked Questions' },
];

export const NET_CARBS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do you calculate net carbs?',
    answer:
      'On US/Canada labels: net carbs = total carbohydrates − fiber − (sugar alcohols × factor). Elsewhere, fiber is already excluded from the carbohydrate figure, so fiber is not subtracted again. The polyol factor is 1 for erythritol/xylitol/mannitol/lactitol-only products and ½ for other sugar alcohols.',
  },
  {
    question: 'Why does USA or Canada matter?',
    answer:
      'US and Canadian Nutrition Facts include dietary fiber inside Total Carbohydrate. Many other regions list carbohydrate already excluding fiber. Subtracting fiber twice undercounts carbs.',
  },
  {
    question: 'How are calories from net carbs estimated?',
    answer:
      'Meal calories ≈ total net carbohydrates (g) × 4 kcal/g. That is a simplified digestible-carbohydrate estimate, not a full Atwater analysis of every polyol.',
  },
  {
    question: 'Are my entries stored?',
    answer:
      'No. Values stay in your browser. Share uses the public page URL only — never your label numbers.',
  },
];
