import type { ToolPageDetail } from '@/tools/page-detail';
import { FishOilGuideArticle } from './FishOilGuideArticle';
import { FISH_OIL_FAQS, FISH_OIL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational EPA/DHA and ALA guidance by screenshot age bands and primary-source special requirements—not a prescription fish-oil dose.',
  asideAriaLabel: 'Interactive Fish Oil Calculator',
  tocItems: FISH_OIL_TOC_ITEMS,
  GuideArticle: FishOilGuideArticle,
  faqs: FISH_OIL_FAQS,
  countryRules: null,
};
