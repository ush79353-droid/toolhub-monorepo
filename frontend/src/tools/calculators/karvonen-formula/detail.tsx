import type { ToolPageDetail } from '@/tools/page-detail';
import { KarvonenGuideArticle } from './KarvonenGuideArticle';
import { KARVONEN_FAQS, KARVONEN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate target heart rate and heart rate reserve with the Karvonen method — educational only.',
  asideAriaLabel: 'Interactive Karvonen Formula Calculator',
  tocItems: KARVONEN_TOC_ITEMS,
  GuideArticle: KarvonenGuideArticle,
  faqs: KARVONEN_FAQS,
  countryRules: null,
};
