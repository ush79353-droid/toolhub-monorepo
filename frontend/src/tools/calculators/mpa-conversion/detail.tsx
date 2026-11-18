import type { ToolPageDetail } from '@/tools/page-detail';
import { MpaConversionGuideArticle } from './MpaConversionGuideArticle';
import { MPA_FAQS, MPA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert MPa to bar, psi, atm, and Torr instantly. Exact: 1 MPa = 10 bar; 1 atm = 0.101325 MPa.',
  asideAriaLabel: 'Interactive MPa conversion calculator',
  tocItems: MPA_TOC_ITEMS,
  GuideArticle: MpaConversionGuideArticle,
  faqs: MPA_FAQS,
  countryRules: null,
};
