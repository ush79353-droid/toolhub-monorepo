import type { ToolPageDetail } from '@/tools/page-detail';
import { EmvGuideArticle } from './EmvGuideArticle';
import { EMV_FAQS, EMV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Sum probability-weighted risk impacts to get expected monetary value. Positive impact means expected loss; use negative impact for gain. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive EMV calculator',
  tocItems: EMV_TOC_ITEMS,
  GuideArticle: EmvGuideArticle,
  faqs: EMV_FAQS,
  countryRules: null,
};
