import type { ToolPageDetail } from '@/tools/page-detail';
import { BrexitGuideArticle } from './BrexitGuideArticle';
import { BREXIT_FAQS, BREXIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Illustrative running estimate of Brexit-related GDP-loss assumptions plus opportunity-cost comparisons in pounds sterling.',
  asideAriaLabel: 'Interactive Brexit Calculator',
  tocItems: BREXIT_TOC_ITEMS,
  GuideArticle: BrexitGuideArticle,
  faqs: BREXIT_FAQS,
  countryRules: null,
};
