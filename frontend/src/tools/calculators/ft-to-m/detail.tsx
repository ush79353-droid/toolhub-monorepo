import type { ToolPageDetail } from '@/tools/page-detail';
import { FtToMGuideArticle } from './FtToMGuideArticle';
import { FT_TO_M_FAQS, FT_TO_M_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert feet to meters and meters to feet instantly; 1 ft equals exactly 0.3048 m.',
  asideAriaLabel: 'Interactive feet to meters converter',
  tocItems: FT_TO_M_TOC_ITEMS,
  GuideArticle: FtToMGuideArticle,
  faqs: FT_TO_M_FAQS,
  countryRules: null,
};
