import type { ToolPageDetail } from '@/tools/page-detail';
import { MeanSacDiameterGuideArticle } from './MeanSacDiameterGuideArticle';
import { MSD_FAQS, MSD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Average three orthogonal gestational-sac diameters and see approximate early menstrual age (MSD + 30 days) when in range. Educational — not viability or due-date advice.',
  asideAriaLabel: 'Interactive Mean Sac Diameter Calculator',
  tocItems: MSD_TOC_ITEMS,
  GuideArticle: MeanSacDiameterGuideArticle,
  faqs: MSD_FAQS,
  countryRules: null,
};
