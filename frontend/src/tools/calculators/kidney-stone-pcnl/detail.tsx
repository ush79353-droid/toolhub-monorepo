import type { ToolPageDetail } from '@/tools/page-detail';
import { KidneyStonePcnlGuideArticle } from './KidneyStonePcnlGuideArticle';
import {
  KIDNEY_STONE_PCNL_FAQS,
  KIDNEY_STONE_PCNL_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Okhunov S.T.O.N.E. nephrolithometry for approximate stone-free chance after first percutaneous nephrolithotomy — not a surgical plan.',
  asideAriaLabel:
    'Interactive Kidney STONE Calculator for Percutaneous Nephrolithotomy',
  tocItems: KIDNEY_STONE_PCNL_TOC_ITEMS,
  GuideArticle: KidneyStonePcnlGuideArticle,
  faqs: KIDNEY_STONE_PCNL_FAQS,
  countryRules: null,
};
