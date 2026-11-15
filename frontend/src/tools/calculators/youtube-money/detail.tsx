import type { ToolPageDetail } from '@/tools/page-detail';
import { YoutubeMoneyGuideArticle } from './YoutubeMoneyGuideArticle';
import { YOUTUBE_MONEY_FAQS, YOUTUBE_MONEY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate YouTube creator revenue from RPM and views. Currency changes the symbol only.',
  asideAriaLabel: 'Interactive YouTube Money Calculator',
  tocItems: YOUTUBE_MONEY_TOC_ITEMS,
  GuideArticle: YoutubeMoneyGuideArticle,
  faqs: YOUTUBE_MONEY_FAQS,
  countryRules: null,
};
