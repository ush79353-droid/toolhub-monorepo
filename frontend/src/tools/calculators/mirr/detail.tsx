import type { ToolPageDetail } from '@/tools/page-detail';
import { MirrGuideArticle } from './MirrGuideArticle';
import { MIRR_FAQS, MIRR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate MIRR from financing and reinvestment rates, an initial outlay, and annual cash flows.',
  asideAriaLabel: 'Interactive MIRR Calculator',
  tocItems: MIRR_TOC_ITEMS,
  GuideArticle: MirrGuideArticle,
  faqs: MIRR_FAQS,
  countryRules: null,
};
