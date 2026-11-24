import type { ToolPageDetail } from '@/tools/page-detail';
import { GfrEstimatedGuideArticle } from './GfrEstimatedGuideArticle';
import { GFR_ESTIMATED_FAQS, GFR_ESTIMATED_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate adult eGFR from creatinine and/or cystatin C with versioned CKD-EPI and MDRD equations — educational only.',
  asideAriaLabel: 'Interactive GFR Calculator - Estimated Glomerular Filtration Rate',
  tocItems: GFR_ESTIMATED_TOC_ITEMS,
  GuideArticle: GfrEstimatedGuideArticle,
  faqs: GFR_ESTIMATED_FAQS,
  countryRules: null,
};
