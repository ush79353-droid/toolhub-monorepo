import type { ToolPageDetail } from '@/tools/page-detail';
import { TurboSizeGuideArticle } from './TurboSizeGuideArticle';
import { TU_FAQS, TU_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate turbocharger airflow from engine capacity and target power, with optional advanced mass-flow and pressure-ratio calculations.',
  asideAriaLabel: 'Interactive Turbo Size Calculator',
  tocItems: TU_TOC_ITEMS,
  GuideArticle: TurboSizeGuideArticle,
  faqs: TU_FAQS,
  countryRules: null,
};
