import type { ToolPageDetail } from '@/tools/page-detail';
import { WhrGuideArticle } from './WhrGuideArticle';
import { WHR_FAQS, WHR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute waist-to-hip ratio (waist ÷ hip) — educational only.',
  asideAriaLabel: 'Interactive Waist to Hip Ratio Calculator',
  tocItems: WHR_TOC_ITEMS,
  GuideArticle: WhrGuideArticle,
  faqs: WHR_FAQS,
  countryRules: null,
};
