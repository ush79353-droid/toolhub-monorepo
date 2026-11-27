import type { ToolPageDetail } from '@/tools/page-detail';
import { ParklandFormulaGuideArticle } from './ParklandFormulaGuideArticle';
import { PARKLAND_FAQS, PARKLAND_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate burn TBSA with Rule of Nines and Parkland 24-hour crystalloid volumes — educational only.',
  asideAriaLabel: 'Interactive Parkland Formula Calculator',
  tocItems: PARKLAND_TOC_ITEMS,
  GuideArticle: ParklandFormulaGuideArticle,
  faqs: PARKLAND_FAQS,
  countryRules: null,
};
