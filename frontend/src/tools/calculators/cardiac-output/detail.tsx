import type { ToolPageDetail } from '@/tools/page-detail';
import { CardiacOutputGuideArticle } from './CardiacOutputGuideArticle';
import { CARDIAC_OUTPUT_FAQS, CARDIAC_OUTPUT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Fick cardiac output and cardiac index from estimated or entered oxygen consumption and arteriovenous oxygen content — not a bedside haemodynamic monitor.',
  asideAriaLabel: 'Interactive Cardiac Output Calculator',
  tocItems: CARDIAC_OUTPUT_TOC_ITEMS,
  GuideArticle: CardiacOutputGuideArticle,
  faqs: CARDIAC_OUTPUT_FAQS,
  countryRules: null,
};
