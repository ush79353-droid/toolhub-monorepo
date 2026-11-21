import type { ToolPageDetail } from '@/tools/page-detail';
import { PowerGuideArticle } from './PowerGuideArticle';
import { POWER_FAQS, POWER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert watts, kilowatts, milliwatts, mechanical and metric horsepower, foot-pound force rates, and BTU/h; synchronized through watts.',
  asideAriaLabel: 'Interactive power converter',
  tocItems: POWER_TOC_ITEMS,
  GuideArticle: PowerGuideArticle,
  faqs: POWER_FAQS,
  countryRules: null,
};
