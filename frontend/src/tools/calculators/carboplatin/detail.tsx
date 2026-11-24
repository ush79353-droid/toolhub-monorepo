import type { ToolPageDetail } from '@/tools/page-detail';
import { CarboplatinGuideArticle } from './CarboplatinGuideArticle';
import { CARBOPLATIN_FAQS, CARBOPLATIN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Calvert carboplatin dosing from Cockcroft–Gault GFR and target AUC.',
  asideAriaLabel: 'Interactive Carboplatin Calculator',
  tocItems: CARBOPLATIN_TOC_ITEMS,
  GuideArticle: CarboplatinGuideArticle,
  faqs: CARBOPLATIN_FAQS,
  countryRules: null,
};