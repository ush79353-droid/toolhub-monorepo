import type { ToolPageDetail } from '@/tools/page-detail';
import { BaiGuideArticle } from './BaiGuideArticle';
import { BAI_FAQS, BAI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Body Adiposity Index (percent) from height and hip circumference — educational only.',
  asideAriaLabel: 'Interactive BAI Calculator',
  tocItems: BAI_TOC_ITEMS,
  GuideArticle: BaiGuideArticle,
  faqs: BAI_FAQS,
  countryRules: null,
};
