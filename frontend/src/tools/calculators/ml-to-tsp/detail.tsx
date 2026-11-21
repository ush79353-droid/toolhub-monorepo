import type { ToolPageDetail } from '@/tools/page-detail';
import { MlToTspGuideArticle } from './MlToTspGuideArticle';
import { MLTSP_FAQS, MLTSP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliliters to teaspoons. Defaults to US tsp (not exactly 5 mL); switch metric or Imperial.',
  asideAriaLabel: 'Interactive mL to tsp converter',
  tocItems: MLTSP_TOC_ITEMS,
  GuideArticle: MlToTspGuideArticle,
  faqs: MLTSP_FAQS,
  countryRules: null,
};
