import type { ToolPageDetail } from '@/tools/page-detail';
import { EbitdaMarginGuideArticle } from './EbitdaMarginGuideArticle';
import { EBITDA_MARGIN_FAQS, EBITDA_MARGIN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute EBITDA margin as EBITDA divided by total revenues, with real currency conversion when the two amounts use different currencies.',
  asideAriaLabel: 'Interactive EBITDA Margin Calculator',
  tocItems: EBITDA_MARGIN_TOC_ITEMS,
  GuideArticle: EbitdaMarginGuideArticle,
  faqs: EBITDA_MARGIN_FAQS,
  countryRules: null,
};
