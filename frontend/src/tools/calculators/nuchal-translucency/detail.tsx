import type { ToolPageDetail } from '@/tools/page-detail';
import { NuchalTranslucencyGuideArticle } from './NuchalTranslucencyGuideArticle';
import { NT_FAQS, NT_TOC_ITEMS } from './content';

/** componentKey: NuchalTranslucencyCalculator */

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational nuchal translucency estimate and centile chart from CRL and measured NT. Not genetic screening or diagnosis.',
  asideAriaLabel: 'Interactive Nuchal Translucency Calculator',
  tocItems: NT_TOC_ITEMS,
  GuideArticle: NuchalTranslucencyGuideArticle,
  faqs: NT_FAQS,
  countryRules: null,
};