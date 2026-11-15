import type { ToolPageDetail } from '@/tools/page-detail';
import { SinkingFundGuideArticle } from './SinkingFundGuideArticle';
import { SINKING_FUND_FAQS, SINKING_FUND_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find the uniform series sinking fund factor and the required periodic contribution to reach a target amount.',
  asideAriaLabel: 'Interactive Sinking Fund Calculator',
  tocItems: SINKING_FUND_TOC_ITEMS,
  GuideArticle: SinkingFundGuideArticle,
  faqs: SINKING_FUND_FAQS,
  countryRules: null,
};
