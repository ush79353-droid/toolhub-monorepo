import type { ToolPageDetail } from '@/tools/page-detail';
import { GdpDeflatorGuideArticle } from './GdpDeflatorGuideArticle';
import { GDP_DEFLATOR_FAQS, GDP_DEFLATOR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the GDP deflator using nominal and real GDP, with formulas, examples, and price-level interpretations.',
  asideAriaLabel: 'Interactive GDP Deflator Formula Calculator',
  tocItems: GDP_DEFLATOR_TOC_ITEMS,
  GuideArticle: GdpDeflatorGuideArticle,
  faqs: GDP_DEFLATOR_FAQS,
  countryRules: null,
};
