import type { ToolPageDetail } from '@/tools/page-detail';
import { KsiToMpaGuideArticle } from './KsiToMpaGuideArticle';
import { KSI_TO_MPA_FAQS, KSI_TO_MPA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert ksi to MPa and MPa to ksi instantly. Exact: 1 ksi = 1,000 psi via international pound-force and inch.',
  asideAriaLabel: 'Interactive KSI to MPa converter',
  tocItems: KSI_TO_MPA_TOC_ITEMS,
  GuideArticle: KsiToMpaGuideArticle,
  faqs: KSI_TO_MPA_FAQS,
  countryRules: null,
};
