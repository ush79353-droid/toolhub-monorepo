import type { ToolPageDetail } from '@/tools/page-detail';
import { CompoundGrowthGuideArticle } from './CompoundGrowthGuideArticle';
import { COMPOUND_GROWTH_FAQS, COMPOUND_GROWTH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Project compound growth with optional recurring contributions.',
  asideAriaLabel: 'Interactive Compound Growth Calculator',
  tocItems: COMPOUND_GROWTH_TOC_ITEMS,
  GuideArticle: CompoundGrowthGuideArticle,
  faqs: COMPOUND_GROWTH_FAQS,
  countryRules: null,
};
