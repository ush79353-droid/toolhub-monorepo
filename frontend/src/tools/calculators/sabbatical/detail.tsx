import type { ToolPageDetail } from '@/tools/page-detail';
import { SabbaticalGuideArticle } from './SabbaticalGuideArticle';
import { SABBATICAL_FAQS, SABBATICAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how much to save and how long you can afford to step away from work. Currency changes formatting only.',
  asideAriaLabel: 'Sabbatical Calculator guide',
  tocItems: SABBATICAL_TOC_ITEMS,
  GuideArticle: SabbaticalGuideArticle,
  faqs: SABBATICAL_FAQS,
  countryRules: null,
};
