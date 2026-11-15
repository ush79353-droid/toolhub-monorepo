import type { ToolPageDetail } from '@/tools/page-detail';
import { MbpsGuideArticle } from './MbpsGuideArticle';
import { MBPS_CALC_FAQS, MBPS_CALC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Mbps to MB/s and related SI data-transfer rates. Bits (b) are not bytes (B); 1 MB/s = 8 Mbps.',
  asideAriaLabel: 'Interactive Mbps calculator',
  tocItems: MBPS_CALC_TOC_ITEMS,
  GuideArticle: MbpsGuideArticle,
  faqs: MBPS_CALC_FAQS,
  countryRules: null,
};
