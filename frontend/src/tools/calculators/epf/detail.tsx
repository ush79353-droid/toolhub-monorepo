import type { ToolPageDetail } from '@/tools/page-detail';
import { EpfGuideArticle } from './EpfGuideArticle';
import { EPF_FAQS, EPF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Estimate Employees' Provident Fund contributions, employer EPF vs EPS allocation, interest, and projected retirement maturity.",
  asideAriaLabel: 'Interactive EPF Calculator',
  tocItems: EPF_TOC_ITEMS,
  GuideArticle: EpfGuideArticle,
  faqs: EPF_FAQS,
  countryRules: null,
};
