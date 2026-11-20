import type { ToolPageDetail } from '@/tools/page-detail';
import { DegreeOfOperatingLeverageGuideArticle } from './DegreeOfOperatingLeverageGuideArticle';
import { DOL_FAQS, DOL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure how sensitive EBIT is to sales changes — DOL = %ΔEBIT / %ΔSales — with optional reverse modes and a contribution-margin CVP method.',
  asideAriaLabel: 'Interactive Degree of Operating Leverage Calculator',
  tocItems: DOL_TOC_ITEMS,
  GuideArticle: DegreeOfOperatingLeverageGuideArticle,
  faqs: DOL_FAQS,
  countryRules: null,
};
