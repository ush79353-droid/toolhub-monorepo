import type { ToolPageDetail } from '@/tools/page-detail';
import { DebtServiceCoverageRatioGuideArticle } from './DebtServiceCoverageRatioGuideArticle';
import {
  DEBT_SERVICE_COVERAGE_RATIO_FAQS,
  DEBT_SERVICE_COVERAGE_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate DSCR from amortizing debt service and NOI, with real currency conversion across loan, payment, and income fields.',
  asideAriaLabel: 'Interactive Debt Service Coverage Ratio Calculator',
  tocItems: DEBT_SERVICE_COVERAGE_RATIO_TOC_ITEMS,
  GuideArticle: DebtServiceCoverageRatioGuideArticle,
  faqs: DEBT_SERVICE_COVERAGE_RATIO_FAQS,
  countryRules: null,
};
