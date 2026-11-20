import type { ToolPageDetail } from '@/tools/page-detail';
import { PitiGuideArticle } from './PitiGuideArticle';
import { PITI_FAQS, PITI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate your total monthly mortgage payment including principal, interest, property taxes, and homeowners insurance (PITI).',
  asideAriaLabel: 'Interactive PITI Calculator',
  tocItems: PITI_TOC_ITEMS,
  GuideArticle: PitiGuideArticle,
  faqs: PITI_FAQS,
  countryRules: null,
};
