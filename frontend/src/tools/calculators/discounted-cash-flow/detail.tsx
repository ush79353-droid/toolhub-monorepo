import type { ToolPageDetail } from '@/tools/page-detail';
import { DcfGuideArticle } from './DcfGuideArticle';
import { DCF_FAQS, DCF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate enterprise, equity, and share value with a simplified two-year FCFF or EPS DCF.',
  asideAriaLabel: 'Interactive Discounted Cash Flow Calculator',
  tocItems: DCF_TOC_ITEMS,
  GuideArticle: DcfGuideArticle,
  faqs: DCF_FAQS,
  countryRules: null,
};
