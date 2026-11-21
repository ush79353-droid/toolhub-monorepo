import type { ToolPageDetail } from '@/tools/page-detail';
import { PhillipsCurveGuideArticle } from './PhillipsCurveGuideArticle';
import { PHILLIPS_CURVE_FAQS, PHILLIPS_CURVE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Explore inflation, unemployment, wage growth, and expectations with Traditional, New Classical, and New Keynesian Phillips Curve models.',
  asideAriaLabel: 'Interactive Phillips Curve Calculator',
  tocItems: PHILLIPS_CURVE_TOC_ITEMS,
  GuideArticle: PhillipsCurveGuideArticle,
  faqs: PHILLIPS_CURVE_FAQS,
  countryRules: null,
};
