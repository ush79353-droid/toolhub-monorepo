import type { ToolPageDetail } from '@/tools/page-detail';
import { HorsepowerGuideArticle } from './HorsepowerGuideArticle';
import { HP_FAQS, HP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate vehicle horsepower from quarter-mile elapsed time or trap speed — with weight and speed unit conversions plus hp, PS, W, and kW outputs.',
  asideAriaLabel: 'Interactive Horsepower Calculator',
  tocItems: HP_TOC_ITEMS,
  GuideArticle: HorsepowerGuideArticle,
  faqs: HP_FAQS,
  countryRules: null,
};
