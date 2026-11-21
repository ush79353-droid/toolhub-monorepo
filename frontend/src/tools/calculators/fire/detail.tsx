import type { ToolPageDetail } from '@/tools/page-detail';
import { FIRE_FAQS, FIRE_TOC_ITEMS } from './content';
import { FireGuideArticle } from './FireGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate your financial independence number, required savings rate, and early-retirement timeline. Currency changes formatting only.',
  asideAriaLabel: 'FIRE Calculator guide',
  tocItems: FIRE_TOC_ITEMS,
  GuideArticle: FireGuideArticle,
  faqs: FIRE_FAQS,
  countryRules: null,
};
