import type { ToolPageDetail } from '@/tools/page-detail';
import { AncWithoutBandsGuideArticle } from './AncWithoutBandsGuideArticle';
import { ANC_WITHOUT_BANDS_FAQS, ANC_WITHOUT_BANDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational absolute neutrophil count from WBC and lab-report differential % — cells/µL output, not a laboratory report.',
  asideAriaLabel: 'Interactive ANC Calculator without Bands',
  tocItems: ANC_WITHOUT_BANDS_TOC_ITEMS,
  GuideArticle: AncWithoutBandsGuideArticle,
  faqs: ANC_WITHOUT_BANDS_FAQS,
  countryRules: null,
};