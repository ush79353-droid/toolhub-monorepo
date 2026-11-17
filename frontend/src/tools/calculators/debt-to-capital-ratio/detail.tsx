import type { ToolPageDetail } from '@/tools/page-detail';
import { DebtToCapitalRatioGuideArticle } from './DebtToCapitalRatioGuideArticle';
import {
  DEBT_TO_CAPITAL_RATIO_FAQS,
  DEBT_TO_CAPITAL_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute debt-to-capital as interest-bearing debt divided by debt plus equity, with real currency conversion when the two amounts use different currencies.',
  asideAriaLabel: 'Interactive Debt-to-Capital Ratio Calculator',
  tocItems: DEBT_TO_CAPITAL_RATIO_TOC_ITEMS,
  GuideArticle: DebtToCapitalRatioGuideArticle,
  faqs: DEBT_TO_CAPITAL_RATIO_FAQS,
  countryRules: null,
};
