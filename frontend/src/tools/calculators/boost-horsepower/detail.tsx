import type { ToolPageDetail } from '@/tools/page-detail';
import { BoostHorsepowerGuideArticle } from './BoostHorsepowerGuideArticle';
import { BOOST_HP_FAQS, BOOST_HP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate ideal boosted engine horsepower from baseline power and turbo/supercharger boost — with pressure ratios, unit conversions, and reverse solves.',
  asideAriaLabel: 'Interactive Boost Horsepower Calculator',
  tocItems: BOOST_HP_TOC_ITEMS,
  GuideArticle: BoostHorsepowerGuideArticle,
  faqs: BOOST_HP_FAQS,
  countryRules: null,
};
