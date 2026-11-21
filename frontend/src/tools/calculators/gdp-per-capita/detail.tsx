import type { ToolPageDetail } from '@/tools/page-detail';
import { GdpPerCapitaGuideArticle } from './GdpPerCapitaGuideArticle';
import { GDP_PER_CAPITA_FAQS, GDP_PER_CAPITA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate GDP per capita from GDP and population with unit conversions, reverse calculations, formulas, and economic insights.',
  asideAriaLabel: 'Interactive GDP per Capita Calculator',
  tocItems: GDP_PER_CAPITA_TOC_ITEMS,
  GuideArticle: GdpPerCapitaGuideArticle,
  faqs: GDP_PER_CAPITA_FAQS,
  countryRules: null,
};
