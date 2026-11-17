import type { ToolPageDetail } from '@/tools/page-detail';
import { MgToLbsGuideArticle } from './MgToLbsGuideArticle';
import { MG_TO_LBS_FAQS, MG_TO_LBS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milligrams to pounds and pounds to milligrams instantly. Exact: 1 lb = 453,592.37 mg.',
  asideAriaLabel: 'Interactive mg to lbs converter',
  tocItems: MG_TO_LBS_TOC_ITEMS,
  GuideArticle: MgToLbsGuideArticle,
  faqs: MG_TO_LBS_FAQS,
  countryRules: null,
};
