import type { ToolPageDetail } from '@/tools/page-detail';
import { KpaToPsiGuideArticle } from './KpaToPsiGuideArticle';
import { KPA_TO_PSI_FAQS, KPA_TO_PSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kPa to psi and psi to kPa instantly. Exact via Pa from international pound-force and inch.',
  asideAriaLabel: 'Interactive kPa to psi converter',
  tocItems: KPA_TO_PSI_TOC_ITEMS,
  GuideArticle: KpaToPsiGuideArticle,
  faqs: KPA_TO_PSI_FAQS,
  countryRules: null,
};
