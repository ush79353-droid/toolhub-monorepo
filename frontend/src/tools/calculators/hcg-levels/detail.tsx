import type { ToolPageDetail } from '@/tools/page-detail';
import { HcgLevelsGuideArticle } from './HcgLevelsGuideArticle';
import { HCG_LEVELS_FAQS, HCG_LEVELS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare two β-hCG values over time: difference, percent change, doubling time when rising, and standardized 1-/2-day increases. Educational kinetics only.',
  asideAriaLabel: 'Interactive hCG Levels Calculator',
  tocItems: HCG_LEVELS_TOC_ITEMS,
  GuideArticle: HcgLevelsGuideArticle,
  faqs: HCG_LEVELS_FAQS,
  countryRules: null,
};
