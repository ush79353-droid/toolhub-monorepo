import type { ToolPageDetail } from '@/tools/page-detail';
import { BunCreatinineRatioGuideArticle } from './BunCreatinineRatioGuideArticle';
import {
  BUN_CREATININE_RATIO_FAQS,
  BUN_CREATININE_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational BUN/creatinine ratio from paired labs — convert to mg/dL, then divide. Not a diagnosis.',
  asideAriaLabel: 'Interactive BUN Creatinine Ratio Calculator',
  tocItems: BUN_CREATININE_RATIO_TOC_ITEMS,
  GuideArticle: BunCreatinineRatioGuideArticle,
  faqs: BUN_CREATININE_RATIO_FAQS,
  countryRules: null,
};
