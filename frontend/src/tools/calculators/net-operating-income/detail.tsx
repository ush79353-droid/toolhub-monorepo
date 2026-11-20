import type { ToolPageDetail } from '@/tools/page-detail';
import { NoiGuideArticle } from './NoiGuideArticle';
import { NOI_FAQS, NOI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate annual net operating income from rentable area, occupancy-based vacancy on rental income, and operating expenses — with manual or itemized expense modes and debt service excluded.',
  asideAriaLabel: 'Interactive Net Operating Income Calculator',
  tocItems: NOI_TOC_ITEMS,
  GuideArticle: NoiGuideArticle,
  faqs: NOI_FAQS,
  countryRules: null,
};
