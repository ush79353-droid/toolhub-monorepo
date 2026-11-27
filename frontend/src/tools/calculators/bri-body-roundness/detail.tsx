import type { ToolPageDetail } from '@/tools/page-detail';
import { BriGuideArticle } from './BriGuideArticle';
import { BRI_FAQS, BRI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Thomas Body Roundness Index from height and waist — not a clinical diagnosis.',
  asideAriaLabel: 'Interactive BRI Calculator',
  tocItems: BRI_TOC_ITEMS,
  GuideArticle: BriGuideArticle,
  faqs: BRI_FAQS,
  countryRules: null,
};
