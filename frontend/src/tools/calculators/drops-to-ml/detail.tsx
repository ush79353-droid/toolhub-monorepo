import type { ToolPageDetail } from '@/tools/page-detail';
import { DROPS_TO_ML_FAQS, DROPS_TO_ML_TOC_ITEMS } from './content';
import { DropsToMlGuideArticle } from './DropsToMlGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert drops to milliliters and milliliters to drops using an adjustable drop factor. The default 20 drops/mL assumption is a reference, not a universal constant.',
  asideAriaLabel: 'Interactive drops to mL conversion calculator',
  tocItems: DROPS_TO_ML_TOC_ITEMS,
  GuideArticle: DropsToMlGuideArticle,
  faqs: DROPS_TO_ML_FAQS,
  countryRules: null,
};
