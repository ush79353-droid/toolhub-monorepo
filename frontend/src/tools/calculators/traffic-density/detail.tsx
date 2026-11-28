import type { ToolPageDetail } from '@/tools/page-detail';
import { TrafficDensityGuideArticle } from './TrafficDensityGuideArticle';
import { TD_FAQS, TD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate traffic flow, density, average stream speed, headway, and spacing from vehicle counts or direct q–k–v solves.',
  asideAriaLabel: 'Interactive Traffic Density Calculator',
  tocItems: TD_TOC_ITEMS,
  GuideArticle: TrafficDensityGuideArticle,
  faqs: TD_FAQS,
  countryRules: null,
};
