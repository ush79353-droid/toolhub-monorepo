import type { ToolPageDetail } from '@/tools/page-detail';
import { BbtGuideArticle } from './BbtGuideArticle';
import { BBT_FAQS, BBT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Adjust a basal body temperature reading when you wake earlier or later than usual, using a validated educational timing rule.',
  asideAriaLabel: 'Interactive BBT Calculator',
  tocItems: BBT_TOC_ITEMS,
  GuideArticle: BbtGuideArticle,
  faqs: BBT_FAQS,
  countryRules: null,
};
