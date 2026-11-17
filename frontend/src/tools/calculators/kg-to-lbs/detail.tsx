import type { ToolPageDetail } from '@/tools/page-detail';
import { KgToLbsGuideArticle } from './KgToLbsGuideArticle';
import { KG_TO_LBS_FAQS, KG_TO_LBS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilograms to pounds and pounds to kilograms instantly. Exact: 1 lb = 0.45359237 kg.',
  asideAriaLabel: 'Interactive kg to lbs converter',
  tocItems: KG_TO_LBS_TOC_ITEMS,
  GuideArticle: KgToLbsGuideArticle,
  faqs: KG_TO_LBS_FAQS,
  countryRules: null,
};
