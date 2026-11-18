import type { ToolPageDetail } from '@/tools/page-detail';
import { CentigradeToCelsiusGuideArticle } from './CentigradeToCelsiusGuideArticle';
import {
  CENTIGRADE_TO_CELSIUS_FAQS,
  CENTIGRADE_TO_CELSIUS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Centigrade and Celsius are the same temperature scale. Enter either name — the numerical value is identical.',
  asideAriaLabel: 'Interactive Centigrade to Celsius converter',
  tocItems: CENTIGRADE_TO_CELSIUS_TOC_ITEMS,
  GuideArticle: CentigradeToCelsiusGuideArticle,
  faqs: CENTIGRADE_TO_CELSIUS_FAQS,
  countryRules: null,
};
