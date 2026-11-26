import type { ToolPageDetail } from '@/tools/page-detail';
import { AnionGapGuideArticle } from './AnionGapGuideArticle';
import { ANION_GAP_FAQS, ANION_GAP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute serum anion gap from Na, Cl, and HCO₃ with optional Figge albumin correction — educational only.',
  asideAriaLabel: 'Interactive Anion Gap Calculator',
  tocItems: ANION_GAP_TOC_ITEMS,
  GuideArticle: AnionGapGuideArticle,
  faqs: ANION_GAP_FAQS,
  countryRules: null,
};
