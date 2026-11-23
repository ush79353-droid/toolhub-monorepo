import type { ToolPageDetail } from '@/tools/page-detail';
import { QtcGuideArticle } from './QtcGuideArticle';
import { QTC_FAQS, QTC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Bazett QT correction from QT and heart rate or RR. Optional Fridericia, Framingham, and Hodges comparisons. Not a diagnosis.',
  asideAriaLabel: 'Interactive QTc Calculator',
  tocItems: QTC_TOC_ITEMS,
  GuideArticle: QtcGuideArticle,
  faqs: QTC_FAQS,
  countryRules: null,
};
