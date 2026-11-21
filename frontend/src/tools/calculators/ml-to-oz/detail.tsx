import type { ToolPageDetail } from '@/tools/page-detail';
import { MlToOzGuideArticle } from './MlToOzGuideArticle';
import { MLOZ_FAQS, MLOZ_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliliters to US or UK fluid ounces and other volume units. Fluid ounces are volume; not mass.',
  asideAriaLabel: 'Interactive mL to oz converter',
  tocItems: MLOZ_TOC_ITEMS,
  GuideArticle: MlToOzGuideArticle,
  faqs: MLOZ_FAQS,
  countryRules: null,
};
