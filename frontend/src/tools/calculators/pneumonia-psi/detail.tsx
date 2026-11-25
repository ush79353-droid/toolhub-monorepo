import type { ToolPageDetail } from '@/tools/page-detail';
import { PsiPortGuideArticle } from './PsiPortGuideArticle';
import { PSI_FAQS, PSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational PSI/PORT (Fine rule) for community-acquired pneumonia risk class — not a hospitalization order.',
  asideAriaLabel: 'Interactive PSI Calculator',
  tocItems: PSI_TOC_ITEMS,
  GuideArticle: PsiPortGuideArticle,
  faqs: PSI_FAQS,
  countryRules: null,
};