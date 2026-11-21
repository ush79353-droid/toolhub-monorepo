import type { ToolPageDetail } from '@/tools/page-detail';
import { APC_FAQS, APC_TOC_ITEMS } from './content';
import { ApcGuideArticle } from './ApcGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Average Propensity to Consume from total consumption and disposable income, with APC ratio, percentage, implied savings, and APS. Currency changes formatting only.',
  asideAriaLabel: 'APC Calculator guide',
  tocItems: APC_TOC_ITEMS,
  GuideArticle: ApcGuideArticle,
  faqs: APC_FAQS,
  countryRules: null,
};
