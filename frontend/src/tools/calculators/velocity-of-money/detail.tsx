import type { ToolPageDetail } from '@/tools/page-detail';
import { VelocityOfMoneyGuideArticle } from './VelocityOfMoneyGuideArticle';
import {
  VELOCITY_OF_MONEY_FAQS,
  VELOCITY_OF_MONEY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use this velocity of money calculator to estimate how frequently money circulates through an economy. Enter the price index, transaction volume, total transaction value, and money supply to calculate the velocity of money. You can also calculate velocity using nominal GDP and the money supply.',
  asideAriaLabel: 'Interactive Velocity of Money Calculator',
  tocItems: VELOCITY_OF_MONEY_TOC_ITEMS,
  GuideArticle: VelocityOfMoneyGuideArticle,
  faqs: VELOCITY_OF_MONEY_FAQS,
  countryRules: null,
};
