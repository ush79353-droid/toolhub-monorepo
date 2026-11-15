import type { ToolPageDetail } from '@/tools/page-detail';
import { GmroiGuideArticle } from './GmroiGuideArticle';
import { GMROI_FAQS, GMROI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate GMROI from average inventory cost and gross profit. Average defaults to (starting + final) ÷ 2 and can be overridden. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive GMROI calculator',
  tocItems: GMROI_TOC_ITEMS,
  GuideArticle: GmroiGuideArticle,
  faqs: GMROI_FAQS,
  countryRules: null,
};
