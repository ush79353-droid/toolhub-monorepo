import type { ToolPageDetail } from '@/tools/page-detail';
import { PrivateSavingsGuideArticle } from './PrivateSavingsGuideArticle';
import {
  PRIVATE_SAVINGS_FAQS,
  PRIVATE_SAVINGS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate private savings from total income, taxes, and consumption with Sp = Y − T − C, including independent FX on each money field and clear labeling when savings are negative (dissaving).',
  asideAriaLabel: 'Interactive Private Savings Calculator',
  tocItems: PRIVATE_SAVINGS_TOC_ITEMS,
  GuideArticle: PrivateSavingsGuideArticle,
  faqs: PRIVATE_SAVINGS_FAQS,
  countryRules: null,
};
