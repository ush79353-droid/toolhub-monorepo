import type { ToolPageDetail } from '@/tools/page-detail';
import { MpaToPsiGuideArticle } from './MpaToPsiGuideArticle';
import { MPA_TO_PSI_FAQS, MPA_TO_PSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert MPa to psi and psi to MPa instantly. Exact via Pa from international pound-force and inch.',
  asideAriaLabel: 'Interactive MPa to PSI converter',
  tocItems: MPA_TO_PSI_TOC_ITEMS,
  GuideArticle: MpaToPsiGuideArticle,
  faqs: MPA_TO_PSI_FAQS,
  countryRules: null,
};
