import type { ToolPageDetail } from '@/tools/page-detail';
import { PpfGuideArticle } from './PpfGuideArticle';
import { PPF_FAQS, PPF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Public Provident Fund maturity value, FY interest credits, total investment, and inflation-adjusted purchasing power in INR.',
  asideAriaLabel: 'Interactive PPF Calculator',
  tocItems: PPF_TOC_ITEMS,
  GuideArticle: PpfGuideArticle,
  faqs: PPF_FAQS,
  countryRules: null,
};
