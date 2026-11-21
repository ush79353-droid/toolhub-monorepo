import type { ToolPageDetail } from '@/tools/page-detail';
import { GrossToNetGuideArticle } from './GrossToNetGuideArticle';
import { GROSS_TO_NET_FAQS, GROSS_TO_NET_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert gross↔net with tax deducted as a percent of gross, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Gross to Net Calculator',
  tocItems: GROSS_TO_NET_TOC_ITEMS,
  GuideArticle: GrossToNetGuideArticle,
  faqs: GROSS_TO_NET_FAQS,
  countryRules: null,
};
