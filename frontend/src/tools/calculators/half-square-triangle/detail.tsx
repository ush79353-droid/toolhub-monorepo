import type { ToolPageDetail } from '@/tools/page-detail';
import { HSTGuideArticle } from './HSTGuideArticle';
import { HST_FAQS, HST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate finished and unfinished HST sizes, fabric cutting dimensions, diagonals, and quilting seam allowances.',
  asideAriaLabel: 'Interactive Half Square Triangle Calculator',
  tocItems: HST_TOC_ITEMS,
  GuideArticle: HSTGuideArticle,
  faqs: HST_FAQS,
  countryRules: null,
};
