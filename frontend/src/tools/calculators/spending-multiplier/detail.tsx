import type { ToolPageDetail } from '@/tools/page-detail';
import { SpendingMultiplierGuideArticle } from './SpendingMultiplierGuideArticle';
import {
  SPENDING_MULTIPLIER_FAQS,
  SPENDING_MULTIPLIER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the Keynesian spending multiplier using the marginal propensity to consume or save. Estimate how changes in autonomous spending may affect aggregate output in a simplified economic model.',
  asideAriaLabel: 'Interactive Spending Multiplier Calculator',
  tocItems: SPENDING_MULTIPLIER_TOC_ITEMS,
  GuideArticle: SpendingMultiplierGuideArticle,
  faqs: SPENDING_MULTIPLIER_FAQS,
  countryRules: null,
};
