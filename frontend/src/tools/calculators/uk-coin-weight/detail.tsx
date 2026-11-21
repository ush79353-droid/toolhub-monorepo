import type { ToolPageDetail } from '@/tools/page-detail';
import { UkCoinWeightGuideArticle } from './UkCoinWeightGuideArticle';
import { UK_COIN_WEIGHT_FAQS, UK_COIN_WEIGHT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the total mass of UK 1p–£2 coins from Royal Mint standard weights, with grams or kilograms display.',
  asideAriaLabel: 'Interactive UK Coin Weight Calculator',
  tocItems: UK_COIN_WEIGHT_TOC_ITEMS,
  GuideArticle: UkCoinWeightGuideArticle,
  faqs: UK_COIN_WEIGHT_FAQS,
  countryRules: null,
};
