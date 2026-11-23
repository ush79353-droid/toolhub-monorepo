import type { ToolPageDetail } from '@/tools/page-detail';
import { DaptGuideArticle } from './DaptGuideArticle';
import { DAPT_FAQS, DAPT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Yeh 2016 DAPT score (−2 to 10) after uneventful post-PCI dual antiplatelet therapy — not a medication order.',
  asideAriaLabel: 'Interactive DAPT Score Calculator',
  tocItems: DAPT_TOC_ITEMS,
  GuideArticle: DaptGuideArticle,
  faqs: DAPT_FAQS,
  countryRules: null,
};
