import type { ToolPageDetail } from '@/tools/page-detail';
import { EcgHeartRateGuideArticle } from './EcgHeartRateGuideArticle';
import { ECG_HR_FAQS, ECG_HR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational R–R interval → BPM from strip distance or ECG boxes at 25 or 50 mm/s. Single-interval estimate for regular rhythms only.',
  asideAriaLabel: 'Interactive ECG Heart Rate Calculator',
  tocItems: ECG_HR_TOC_ITEMS,
  GuideArticle: EcgHeartRateGuideArticle,
  faqs: ECG_HR_FAQS,
  countryRules: null,
};
