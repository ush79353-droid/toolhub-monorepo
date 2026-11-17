import type { ToolPageDetail } from '@/tools/page-detail';
import { LbsToKgGuideArticle } from './LbsToKgGuideArticle';
import { LBS_TO_KG_FAQS, LBS_TO_KG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pounds to kilograms and kilograms to pounds instantly. Exact: 1 lb = 0.45359237 kg.',
  asideAriaLabel: 'Interactive lbs to kg converter',
  tocItems: LBS_TO_KG_TOC_ITEMS,
  GuideArticle: LbsToKgGuideArticle,
  faqs: LBS_TO_KG_FAQS,
  countryRules: null,
};
