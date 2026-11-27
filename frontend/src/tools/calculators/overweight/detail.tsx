import type { ToolPageDetail } from '@/tools/page-detail';
import { OverweightGuideArticle } from './OverweightGuideArticle';
import { OVERWEIGHT_FAQS, OVERWEIGHT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational BMI and adult ponderal index, with optional CDC BMI-for-age for ages 2–19 — not a diagnosis.',
  asideAriaLabel: 'Interactive Overweight Calculator',
  tocItems: OVERWEIGHT_TOC_ITEMS,
  GuideArticle: OverweightGuideArticle,
  faqs: OVERWEIGHT_FAQS,
  countryRules: null,
};
