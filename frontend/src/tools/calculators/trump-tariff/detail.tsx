import type { ToolPageDetail } from '@/tools/page-detail';
import { TrumpTariffGuideArticle } from './TrumpTariffGuideArticle';
import { TRUMP_TARIFF_FAQS, TRUMP_TARIFF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how U.S. import tariffs affect the cost of products imported from different countries. Choose a product category or country of origin, enter a product value and applicable tariff rates, and calculate estimated import duties and total costs.',
  asideAriaLabel: 'Interactive Trump Tariff Calculator',
  tocItems: TRUMP_TARIFF_TOC_ITEMS,
  GuideArticle: TrumpTariffGuideArticle,
  faqs: TRUMP_TARIFF_FAQS,
  countryRules: null,
};
