import type { ToolPageDetail } from '@/tools/page-detail';
import { PisaGuideArticle } from './PisaGuideArticle';
import { PISA_FAQS, PISA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational proximal isovelocity surface area (PISA) worksheet with optional α/180 leaflet correction — MVA, VFR, EROA, RVol. Not a valve-disease grade.',
  asideAriaLabel: 'Interactive PISA Calculator',
  tocItems: PISA_TOC_ITEMS,
  GuideArticle: PisaGuideArticle,
  faqs: PISA_FAQS,
  countryRules: null,
};
