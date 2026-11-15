import type { ToolPageDetail } from '@/tools/page-detail';
import { MvaGuideArticle } from './MvaGuideArticle';
import { MVA_FAQS, MVA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate equity market value and market value added from share price, shares outstanding, and capital invested.',
  asideAriaLabel: 'Interactive MVA Calculator',
  tocItems: MVA_TOC_ITEMS,
  GuideArticle: MvaGuideArticle,
  faqs: MVA_FAQS,
  countryRules: null,
};
