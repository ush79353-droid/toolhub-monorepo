import type { ToolPageDetail } from '@/tools/page-detail';
import { LutealPhaseGuideArticle } from './LutealPhaseGuideArticle';
import { LUTEAL_PHASE_FAQS, LUTEAL_PHASE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational luteal phase length from ovulation date and the first day of the next menstrual period. Not ovulation testing or medical advice.',
  asideAriaLabel: 'Interactive Luteal Phase Calculator',
  tocItems: LUTEAL_PHASE_TOC_ITEMS,
  GuideArticle: LutealPhaseGuideArticle,
  faqs: LUTEAL_PHASE_FAQS,
  countryRules: null,
};