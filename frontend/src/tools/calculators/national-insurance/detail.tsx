import type { ToolPageDetail } from '@/tools/page-detail';
import { NationalInsuranceGuideArticle } from './NationalInsuranceGuideArticle';
import { NI_FAQS, NI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate UK employee Class 1 and self-employed Class 4 National Insurance for tax years 2024/25–2026/27 using HMRC thresholds and rates. Employment and self-employment bases are calculated separately, then totalled. Fixed pounds sterling.',
  asideAriaLabel: 'Interactive National Insurance Calculator',
  tocItems: NI_TOC_ITEMS,
  GuideArticle: NationalInsuranceGuideArticle,
  faqs: NI_FAQS,
  countryRules: null,
};
