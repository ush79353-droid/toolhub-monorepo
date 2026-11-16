import type { ToolPageDetail } from '@/tools/page-detail';
import { NaturalGasGuideArticle } from './NaturalGasGuideArticle';
import { NATURAL_GAS_FAQS, NATURAL_GAS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert natural gas volume and energy units with an adjustable heating value. Default 1038 BTU/ft³ is illustrative — use your utility factor when available.',
  asideAriaLabel: 'Interactive natural gas converter',
  tocItems: NATURAL_GAS_TOC_ITEMS,
  GuideArticle: NaturalGasGuideArticle,
  faqs: NATURAL_GAS_FAQS,
  countryRules: null,
};
