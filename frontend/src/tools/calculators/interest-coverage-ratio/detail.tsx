import type { ToolPageDetail } from '@/tools/page-detail';
import { InterestCoverageRatioGuideArticle } from './InterestCoverageRatioGuideArticle';
import {
  INTEREST_COVERAGE_RATIO_FAQS,
  INTEREST_COVERAGE_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute interest coverage as EBIT divided by interest expense, with real currency conversion when the two amounts use different currencies.',
  asideAriaLabel: 'Interactive Interest Coverage Ratio Calculator',
  tocItems: INTEREST_COVERAGE_RATIO_TOC_ITEMS,
  GuideArticle: InterestCoverageRatioGuideArticle,
  faqs: INTEREST_COVERAGE_RATIO_FAQS,
  countryRules: null,
};
