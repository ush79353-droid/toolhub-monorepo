import type { ToolPageDetail } from '@/tools/page-detail';
import { ExpectedReturnGuideArticle } from './ExpectedReturnGuideArticle';
import { EXPECTED_RETURN_FAQS, EXPECTED_RETURN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Estimate probability-weighted expected returns for two stocks across scenarios.',
  asideAriaLabel: 'Interactive Expected Return Calculator',
  tocItems: EXPECTED_RETURN_TOC_ITEMS,
  GuideArticle: ExpectedReturnGuideArticle,
  faqs: EXPECTED_RETURN_FAQS,
  countryRules: null,
};
