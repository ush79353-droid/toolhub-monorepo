import type { ToolPageDetail } from '@/tools/page-detail';
import { DeadweightLossGuideArticle } from './DeadweightLossGuideArticle';
import {
  DEADWEIGHT_LOSS_FAQS,
  DEADWEIGHT_LOSS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate estimated deadweight loss from changes in prices and quantities, with formulas, examples, and economic explanations.',
  asideAriaLabel: 'Interactive Deadweight Loss Calculator',
  tocItems: DEADWEIGHT_LOSS_TOC_ITEMS,
  GuideArticle: DeadweightLossGuideArticle,
  faqs: DEADWEIGHT_LOSS_FAQS,
  countryRules: null,
};
