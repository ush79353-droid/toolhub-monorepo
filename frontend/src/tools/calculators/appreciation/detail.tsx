import type { ToolPageDetail } from '@/tools/page-detail';
import { AppreciationGuideArticle } from './AppreciationGuideArticle';
import { APPRECIATION_FAQS, APPRECIATION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compound a starting value by a daily, monthly, or yearly appreciation rate over years and months.',
  asideAriaLabel: 'Interactive Appreciation Calculator',
  tocItems: APPRECIATION_TOC_ITEMS,
  GuideArticle: AppreciationGuideArticle,
  faqs: APPRECIATION_FAQS,
  countryRules: null,
};
