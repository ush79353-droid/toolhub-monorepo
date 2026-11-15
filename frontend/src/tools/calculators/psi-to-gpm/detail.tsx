import type { ToolPageDetail } from '@/tools/page-detail';
import { PsiToGpmGuideArticle } from './PsiToGpmGuideArticle';
import { PSI_TO_GPM_FAQS, PSI_TO_GPM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate liquid flow in US gpm from pressure difference, pipe diameter, and fluid density.',
  asideAriaLabel: 'Interactive PSI to GPM calculator',
  tocItems: PSI_TO_GPM_TOC_ITEMS,
  GuideArticle: PsiToGpmGuideArticle,
  faqs: PSI_TO_GPM_FAQS,
  countryRules: null,
};
