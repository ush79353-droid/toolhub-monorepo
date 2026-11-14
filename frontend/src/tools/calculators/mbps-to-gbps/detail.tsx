import type { ToolPageDetail } from '@/tools/page-detail';
import { MbpsToGbpsGuideArticle } from './MbpsToGbpsGuideArticle';
import { MBPS_FAQS, MBPS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Mbps to Gbps and gigabytes per second with exact SI factors. Bits (b) are not bytes (B).',
  asideAriaLabel: 'Interactive Mbps to Gbps converter',
  tocItems: MBPS_TOC_ITEMS,
  GuideArticle: MbpsToGbpsGuideArticle,
  faqs: MBPS_FAQS,
  countryRules: null,
};
