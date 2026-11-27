import type { ToolPageDetail } from '@/tools/page-detail';
import { UagGuideArticle } from './UagGuideArticle';
import { UAG_FAQS, UAG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational urine anion gap from urinary Na⁺, K⁺, and Cl⁻ — not a serum AG or diagnosis.',
  asideAriaLabel: 'Interactive Urine Anion Gap Calculator',
  tocItems: UAG_TOC_ITEMS,
  GuideArticle: UagGuideArticle,
  faqs: UAG_FAQS,
  countryRules: null,
};
