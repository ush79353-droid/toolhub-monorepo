import type { ToolPageDetail } from '@/tools/page-detail';
import { FabricGuideArticle } from './FabricGuideArticle';
import { FABRIC_FAQS, FABRIC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate fabric yardage, pieces per row, cutting rows, and material requirements for sewing and craft projects.',
  asideAriaLabel: 'Interactive Fabric Calculator',
  tocItems: FABRIC_TOC_ITEMS,
  GuideArticle: FabricGuideArticle,
  faqs: FABRIC_FAQS,
  countryRules: null,
};
