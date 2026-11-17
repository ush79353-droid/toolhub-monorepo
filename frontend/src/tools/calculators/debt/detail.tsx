import type { ToolPageDetail } from '@/tools/page-detail';
import { DebtGuideArticle } from './DebtGuideArticle';
import { DEBT_FAQS, DEBT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare minimum-payment, snowball, avalanche, and consolidation strategies with independent FX on every money field.',
  asideAriaLabel: 'Interactive Debt Calculator',
  tocItems: DEBT_TOC_ITEMS,
  GuideArticle: DebtGuideArticle,
  faqs: DEBT_FAQS,
  countryRules: null,
};
