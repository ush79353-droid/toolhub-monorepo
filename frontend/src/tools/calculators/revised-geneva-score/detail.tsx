import type { ToolPageDetail } from '@/tools/page-detail';
import { RevisedGenevaGuideArticle } from './RevisedGenevaGuideArticle';
import { REVISED_GENEVA_FAQS, REVISED_GENEVA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational revised Geneva PE pretest score (Le Gal 2006) with two- and three-level probability bands. Does not diagnose PE or order imaging.',
  asideAriaLabel: 'Interactive Revised Geneva Score Calculator',
  tocItems: REVISED_GENEVA_TOC_ITEMS,
  GuideArticle: RevisedGenevaGuideArticle,
  faqs: REVISED_GENEVA_FAQS,
  countryRules: null,
};
