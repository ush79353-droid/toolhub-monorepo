import type { ToolPageDetail } from '@/tools/page-detail';
import { CpaGuideArticle } from './CpaGuideArticle';
import { CPA_FAQS, CPA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate total ad spend from clicks and CPC, then cost per acquisition from attributed conversions. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive CPA calculator',
  tocItems: CPA_TOC_ITEMS,
  GuideArticle: CpaGuideArticle,
  faqs: CPA_FAQS,
  countryRules: null,
};
