import type { ToolPageDetail } from '@/tools/page-detail';
import { RfmGuideArticle } from './RfmGuideArticle';
import { RFM_FAQS, RFM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Relative Fat Mass (%) from height, waist, and sex — educational only.',
  asideAriaLabel: 'Interactive RFM Calculator',
  tocItems: RFM_TOC_ITEMS,
  GuideArticle: RfmGuideArticle,
  faqs: RFM_FAQS,
  countryRules: null,
};
