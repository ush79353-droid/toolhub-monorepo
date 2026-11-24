import type { ToolPageDetail } from '@/tools/page-detail';
import { ChancesOfHavingTwinsGuideArticle } from './ChancesOfHavingTwinsGuideArticle';
import { TWINS_FAQS, TWINS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational 2024 US twin birth rate lookup by maternal age or race and Hispanic origin (CDC/NVSS) — twin deliveries per 1,000 births, share page URL only.',
  asideAriaLabel: 'Interactive Chances of Having Twins Calculator',
  tocItems: TWINS_TOC_ITEMS,
  GuideArticle: ChancesOfHavingTwinsGuideArticle,
  faqs: TWINS_FAQS,
  countryRules: null,
};