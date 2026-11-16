import type { ToolPageDetail } from '@/tools/page-detail';
import { BarToPsiGuideArticle } from './BarToPsiGuideArticle';
import { BAR_TO_PSI_FAQS, BAR_TO_PSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert bar to PSI and PSI to bar instantly using exact pascal-based factors (1 bar ≈ 14.503774 psi).',
  asideAriaLabel: 'Interactive bar to PSI conversion calculator',
  tocItems: BAR_TO_PSI_TOC_ITEMS,
  GuideArticle: BarToPsiGuideArticle,
  faqs: BAR_TO_PSI_FAQS,
  countryRules: null,
};
