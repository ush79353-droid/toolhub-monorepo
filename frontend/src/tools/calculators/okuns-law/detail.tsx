import type { ToolPageDetail } from '@/tools/page-detail';
import { OkunsLawGuideArticle } from './OkunsLawGuideArticle';
import { OKUNS_LAW_FAQS, OKUNS_LAW_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Estimate unemployment changes, GDP growth gaps, and output gaps with Okun's Law formulas, examples, and clear coefficient conventions.",
  asideAriaLabel: "Interactive Okun's Law Calculator",
  tocItems: OKUNS_LAW_TOC_ITEMS,
  GuideArticle: OkunsLawGuideArticle,
  faqs: OKUNS_LAW_FAQS,
  countryRules: null,
};
