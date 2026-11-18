import type { ToolPageDetail } from '@/tools/page-detail';
import { FlOzToLbGuideArticle } from './FlOzToLbGuideArticle';
import { FL_OZ_TO_LB_FAQS, FL_OZ_TO_LB_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert fluid ounces to pounds using substance density. Select water, oil, or another material — or enter a custom density — for accurate volume-to-weight conversion.',
  asideAriaLabel: 'Interactive fluid ounces to pounds converter',
  tocItems: FL_OZ_TO_LB_TOC_ITEMS,
  GuideArticle: FlOzToLbGuideArticle,
  faqs: FL_OZ_TO_LB_FAQS,
  countryRules: null,
};
