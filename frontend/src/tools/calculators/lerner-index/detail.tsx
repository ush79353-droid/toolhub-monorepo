import type { ToolPageDetail } from '@/tools/page-detail';
import { LernerIndexGuideArticle } from './LernerIndexGuideArticle';
import { LERNER_FAQS, LERNER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure markup over marginal cost relative to price with the Lerner Index. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive Lerner Index calculator',
  tocItems: LERNER_TOC_ITEMS,
  GuideArticle: LernerIndexGuideArticle,
  faqs: LERNER_FAQS,
  countryRules: null,
};
