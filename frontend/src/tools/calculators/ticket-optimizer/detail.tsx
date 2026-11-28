import type { ToolPageDetail } from '@/tools/page-detail';
import { TicketOptimizerGuideArticle } from './TicketOptimizerGuideArticle';
import { TO_FAQS, TO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare single fares with short- and long-term travel passes and find the cheapest combination for your trip schedule.',
  asideAriaLabel: 'Interactive Ticket Optimizer',
  tocItems: TO_TOC_ITEMS,
  GuideArticle: TicketOptimizerGuideArticle,
  faqs: TO_FAQS,
  countryRules: null,
};
