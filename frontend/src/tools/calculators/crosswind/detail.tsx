import type { ToolPageDetail } from '@/tools/page-detail';
import { CrosswindGuideArticle } from './CrosswindGuideArticle';
import { CROSSWIND_FAQS, CROSSWIND_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate crosswind, headwind, and tailwind components from runway number, wind direction, and wind speed — with relative angle, left/right indication, and a runway diagram.',
  asideAriaLabel: 'Interactive Crosswind Calculator',
  tocItems: CROSSWIND_TOC_ITEMS,
  GuideArticle: CrosswindGuideArticle,
  faqs: CROSSWIND_FAQS,
  countryRules: null,
};
