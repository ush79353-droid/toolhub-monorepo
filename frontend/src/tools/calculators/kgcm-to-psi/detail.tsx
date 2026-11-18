import type { ToolPageDetail } from '@/tools/page-detail';
import { KgCmToPsiGuideArticle } from './KgCmToPsiGuideArticle';
import { KGCM_TO_PSI_FAQS, KGCM_TO_PSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kgf/cm² to PSI and PSI to kgf/cm² instantly. Exact factor via 98,066.5 Pa and 6,894.757293168 Pa.',
  asideAriaLabel: 'Interactive kg/cm² to PSI converter',
  tocItems: KGCM_TO_PSI_TOC_ITEMS,
  GuideArticle: KgCmToPsiGuideArticle,
  faqs: KGCM_TO_PSI_FAQS,
  countryRules: null,
};
