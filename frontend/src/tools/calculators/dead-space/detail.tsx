import type { ToolPageDetail } from '@/tools/page-detail';
import { DeadSpaceGuideArticle } from './DeadSpaceGuideArticle';
import { DEAD_SPACE_FAQS, DEAD_SPACE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Bohr physiologic dead space (VD = VT × (PACO₂ − PECO₂) / PACO₂) — not a ventilator order.',
  asideAriaLabel: 'Interactive Dead Space Calculator',
  tocItems: DEAD_SPACE_TOC_ITEMS,
  GuideArticle: DeadSpaceGuideArticle,
  faqs: DEAD_SPACE_FAQS,
  countryRules: null,
};
