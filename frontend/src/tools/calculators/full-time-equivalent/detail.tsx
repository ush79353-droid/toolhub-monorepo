import type { ToolPageDetail } from '@/tools/page-detail';
import { FullTimeEquivalentGuideArticle } from './FullTimeEquivalentGuideArticle';
import { FTE_FAQS, FTE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert full-time and part-time headcount into a single full-time equivalent (FTE) using consistent weekly hours.',
  asideAriaLabel: 'Interactive full-time equivalent calculator',
  tocItems: FTE_TOC_ITEMS,
  GuideArticle: FullTimeEquivalentGuideArticle,
  faqs: FTE_FAQS,
  countryRules: null,
};
