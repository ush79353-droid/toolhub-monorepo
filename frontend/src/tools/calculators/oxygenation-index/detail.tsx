import type { ToolPageDetail } from '@/tools/page-detail';
import { OxygenationIndexGuideArticle } from './OxygenationIndexGuideArticle';
import {
  OXYGENATION_INDEX_FAQS,
  OXYGENATION_INDEX_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational PaO₂/FiO₂ and oxygenation index from FiO₂ %, ventilator mean airway pressure, and arterial PaO₂ — not a ventilator order.',
  asideAriaLabel: 'Interactive Oxygenation Index Calculator',
  tocItems: OXYGENATION_INDEX_TOC_ITEMS,
  GuideArticle: OxygenationIndexGuideArticle,
  faqs: OXYGENATION_INDEX_FAQS,
  countryRules: null,
};
