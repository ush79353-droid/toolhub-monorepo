import type { ToolPageDetail } from '@/tools/page-detail';
import { PaToPsiGuideArticle } from './PaToPsiGuideArticle';
import { PA_TO_PSI_FAQS, PA_TO_PSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pascals (Pa) to PSI and PSI to pascals instantly. Exact via international pound-force and inch.',
  asideAriaLabel: 'Interactive Pa to PSI converter',
  tocItems: PA_TO_PSI_TOC_ITEMS,
  GuideArticle: PaToPsiGuideArticle,
  faqs: PA_TO_PSI_FAQS,
  countryRules: null,
};
