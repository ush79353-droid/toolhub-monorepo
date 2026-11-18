import type { ToolPageDetail } from '@/tools/page-detail';
import { KmToFeetGuideArticle } from './KmToFeetGuideArticle';
import { KM_TO_FEET_FAQS, KM_TO_FEET_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilometers to feet and feet to kilometers instantly. Exact: 1 ft = 0.3048 m, so 1 km ≈ 3,280.839895 ft.',
  asideAriaLabel: 'Interactive km to feet conversion calculator',
  tocItems: KM_TO_FEET_TOC_ITEMS,
  GuideArticle: KmToFeetGuideArticle,
  faqs: KM_TO_FEET_FAQS,
  countryRules: null,
};
