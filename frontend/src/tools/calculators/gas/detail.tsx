import type { ToolPageDetail } from '@/tools/page-detail';
import { GasGuideArticle } from './GasGuideArticle';
import { GAS_FAQS, GAS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate fuel required, trip cost, cost per person, and driving range from distance, fuel economy, and pump price — with round-trip toggle and denomination-only currency labeling.',
  asideAriaLabel: 'Interactive Gas Calculator',
  tocItems: GAS_TOC_ITEMS,
  GuideArticle: GasGuideArticle,
  faqs: GAS_FAQS,
  countryRules: null,
};
