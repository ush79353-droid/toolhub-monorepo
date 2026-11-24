import type { ToolPageDetail } from '@/tools/page-detail';
import { MMOLL_TO_MGDL_FAQS, MMOLL_TO_MGDL_TOC_ITEMS } from './content';
import { MmollToMgdlGuideArticle } from './MmollToMgdlGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mmol/L ↔ mg/dL for common lab analytes using published molar masses (mg/dL = mmol/L × MW ÷ 10). Educational unit conversion only.',
  asideAriaLabel: 'Interactive mmol/L to mg/dL calculator',
  tocItems: MMOLL_TO_MGDL_TOC_ITEMS,
  GuideArticle: MmollToMgdlGuideArticle,
  faqs: MMOLL_TO_MGDL_FAQS,
  countryRules: null,
};
