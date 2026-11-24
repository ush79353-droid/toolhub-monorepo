import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STEROID_CONVERSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Steroid Conversion' },
  { id: 'equivalents', label: 'Duration Groups' },
  { id: 'steroid-faq', label: 'Frequently Asked Questions' },
];

export const STEROID_CONVERSION_FAQS: readonly FAQItem[] = [
  {
    question: 'Which routes does this table cover?',
    answer:
      'Systemic oral and parenteral anti-inflammatory equivalence only. Topical, inhaled, and intra-articular doses are not comparable with this table.',
  },
  {
    question: 'Can I use this to switch or taper steroids?',
    answer:
      'No. Values are educational anti-inflammatory equivalents from published tables. Duration of action and mineralocorticoid effects differ; this tool does not provide taper or substitution advice.',
  },
  {
    question: 'Why do short, intermediate, and long groups matter?',
    answer:
      'Agents differ in biologic half-life (roughly 8–12 h, 12–36 h, and 36–54 h). Equivalent milligram mass does not mean identical clinical duration or mineralocorticoid effect.',
  },
];
