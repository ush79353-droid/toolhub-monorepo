import type { ToolPageDetail } from '@/tools/page-detail';
import { MipiGuideArticle } from './MipiGuideArticle';
import { MIPI_FAQS, MIPI_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Continuous MIPI / MIPI-b for mantle cell lymphoma — educational oncology index.',
  asideAriaLabel: 'Interactive MIPI Calculator',
  tocItems: MIPI_TOC,
  GuideArticle: MipiGuideArticle,
  faqs: MIPI_FAQS,
  countryRules: null,
};
