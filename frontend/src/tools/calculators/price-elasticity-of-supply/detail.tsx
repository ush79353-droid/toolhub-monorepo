import type { ToolPageDetail } from '@/tools/page-detail';
import { PriceElasticityOfSupplyGuideArticle } from './PriceElasticityOfSupplyGuideArticle';
import { PES_FAQS, PES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate how quantity supplied responds to price changes with standard and midpoint elasticity methods.',
  asideAriaLabel: 'Interactive Price Elasticity of Supply Calculator',
  tocItems: PES_TOC_ITEMS,
  GuideArticle: PriceElasticityOfSupplyGuideArticle,
  faqs: PES_FAQS,
  countryRules: null,
};
