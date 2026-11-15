import type { ToolPageDetail } from '@/tools/page-detail';
import { ExitRateGuideArticle } from './ExitRateGuideArticle';
import { EXIT_RATE_FAQS, EXIT_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Calculate exit rate from pageviews and exits.',
  asideAriaLabel: 'Interactive Exit Rate Calculator',
  tocItems: EXIT_RATE_TOC_ITEMS,
  GuideArticle: ExitRateGuideArticle,
  faqs: EXIT_RATE_FAQS,
  countryRules: null,
};
