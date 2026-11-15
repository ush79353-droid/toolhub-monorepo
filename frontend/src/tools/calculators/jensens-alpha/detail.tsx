import type { ToolPageDetail } from '@/tools/page-detail';
import { JensensAlphaGuideArticle } from './JensensAlphaGuideArticle';
import { JENSENS_ALPHA_FAQS, JENSENS_ALPHA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: "Measure portfolio excess return versus CAPM expected return (Jensen's alpha).",
  asideAriaLabel: "Interactive Jensen's Alpha Calculator",
  tocItems: JENSENS_ALPHA_TOC_ITEMS,
  GuideArticle: JensensAlphaGuideArticle,
  faqs: JENSENS_ALPHA_FAQS,
  countryRules: null,
};
