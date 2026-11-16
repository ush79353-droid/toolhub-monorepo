import type { ToolPageDetail } from '@/tools/page-detail';
import { PxToEmGuideArticle } from './PxToEmGuideArticle';
import { PX_TO_EM_FAQS, PX_TO_EM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert CSS px, em, pt, and % with a configurable base font size. Default base: 16px. 1px = 0.75pt.',
  asideAriaLabel: 'Interactive px to em converter',
  tocItems: PX_TO_EM_TOC_ITEMS,
  GuideArticle: PxToEmGuideArticle,
  faqs: PX_TO_EM_FAQS,
  countryRules: null,
};
