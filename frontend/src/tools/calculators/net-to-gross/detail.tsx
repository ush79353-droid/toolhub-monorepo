import type { ToolPageDetail } from '@/tools/page-detail';
import { NetToGrossGuideArticle } from './NetToGrossGuideArticle';
import { NET_TO_GROSS_FAQS, NET_TO_GROSS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert between net and gross using tax as a percent of net or of gross (equivalent rates), with independent FX on money fields.',
  asideAriaLabel: 'Interactive Net to Gross Calculator',
  tocItems: NET_TO_GROSS_TOC_ITEMS,
  GuideArticle: NetToGrossGuideArticle,
  faqs: NET_TO_GROSS_FAQS,
  countryRules: null,
};
