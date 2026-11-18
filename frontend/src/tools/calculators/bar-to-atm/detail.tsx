import type { ToolPageDetail } from '@/tools/page-detail';
import { BarToAtmGuideArticle } from './BarToAtmGuideArticle';
import { BAR_TO_ATM_FAQS, BAR_TO_ATM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert bar to atmospheres and atmospheres to bar with exact pascal-based factors (1 bar = 100,000 Pa, 1 atm = 101,325 Pa).',
  asideAriaLabel: 'Interactive bar to atm conversion calculator',
  tocItems: BAR_TO_ATM_TOC_ITEMS,
  GuideArticle: BarToAtmGuideArticle,
  faqs: BAR_TO_ATM_FAQS,
  countryRules: null,
};
