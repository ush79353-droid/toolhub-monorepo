import type { ToolPageDetail } from '@/tools/page-detail';
import { EarGuideArticle } from './EarGuideArticle';
import { EAR_FAQS, EAR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Convert a nominal annual rate into periodic rate and effective annual rate.',
  asideAriaLabel: 'Interactive EAR Calculator',
  tocItems: EAR_TOC_ITEMS,
  GuideArticle: EarGuideArticle,
  faqs: EAR_FAQS,
  countryRules: null,
};
