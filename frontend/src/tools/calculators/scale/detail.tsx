import type { ToolPageDetail } from '@/tools/page-detail';
import { ScaleGuideArticle } from './ScaleGuideArticle';
import { SCALE_FAQS, SCALE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate scale factors and convert scaled lengths, areas, or volumes for maps, drawings, and models.',
  asideAriaLabel: 'Interactive scale calculator',
  tocItems: SCALE_TOC_ITEMS,
  GuideArticle: ScaleGuideArticle,
  faqs: SCALE_FAQS,
  countryRules: null,
};
