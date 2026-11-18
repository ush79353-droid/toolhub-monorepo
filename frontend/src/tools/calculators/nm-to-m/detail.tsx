import type { ToolPageDetail } from '@/tools/page-detail';
import { NmToMGuideArticle } from './NmToMGuideArticle';
import { NM_TO_M_FAQS, NM_TO_M_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert nanometers to meters and meters to nanometers — exact SI: 1 nm = 10⁻⁹ m.',
  asideAriaLabel: 'Interactive nanometers to meters converter',
  tocItems: NM_TO_M_TOC_ITEMS,
  GuideArticle: NmToMGuideArticle,
  faqs: NM_TO_M_FAQS,
  countryRules: null,
};
