import type { ToolPageDetail } from '@/tools/page-detail';
import { KsiToPsiGuideArticle } from './KsiToPsiGuideArticle';
import { KSI_TO_PSI_FAQS, KSI_TO_PSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert ksi to psi and psi to ksi instantly. Exact: 1 ksi = 1,000 psi.',
  asideAriaLabel: 'Interactive KSI to PSI converter',
  tocItems: KSI_TO_PSI_TOC_ITEMS,
  GuideArticle: KsiToPsiGuideArticle,
  faqs: KSI_TO_PSI_FAQS,
  countryRules: null,
};
