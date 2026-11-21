import type { ToolPageDetail } from '@/tools/page-detail';
import { NsfrGuideArticle } from './NsfrGuideArticle';
import { NSFR_FAQS, NSFR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the Net Stable Funding Ratio (NSFR) using available and required stable funding. Learn the Basel III NSFR formula and 100% threshold.',
  asideAriaLabel: 'Interactive NSFR Calculator',
  tocItems: NSFR_TOC_ITEMS,
  GuideArticle: NsfrGuideArticle,
  faqs: NSFR_FAQS,
  countryRules: null,
};
