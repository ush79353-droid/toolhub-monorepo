import type { ToolPageDetail } from '@/tools/page-detail';
import { MILLIONAIRE_FAQS, MILLIONAIRE_TOC_ITEMS } from './content';
import { MillionaireGuideArticle } from './MillionaireGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how long it takes to reach a million-dollar — or any — savings goal with compound interest, periodic deposits, and inflation-adjusted purchasing power. Currency changes formatting only.',
  asideAriaLabel: 'Millionaire Calculator guide',
  tocItems: MILLIONAIRE_TOC_ITEMS,
  GuideArticle: MillionaireGuideArticle,
  faqs: MILLIONAIRE_FAQS,
  countryRules: null,
};
