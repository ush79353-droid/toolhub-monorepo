import type { ToolPageDetail } from '@/tools/page-detail';
import { CurtainPanelGuideArticle } from './CurtainPanelGuideArticle';
import { CURTAIN_PANEL_FAQS, CURTAIN_PANEL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate curtain coverage, panel cut sizes, fabric drops, and purchase yardage from rod width, fullness, and sewing allowances.',
  asideAriaLabel: 'Interactive Curtain Panel Calculator',
  tocItems: CURTAIN_PANEL_TOC_ITEMS,
  GuideArticle: CurtainPanelGuideArticle,
  faqs: CURTAIN_PANEL_FAQS,
  countryRules: null,
};
