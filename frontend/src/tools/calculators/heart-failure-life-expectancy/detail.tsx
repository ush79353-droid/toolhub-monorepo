import type { ToolPageDetail } from '@/tools/page-detail';
import { HeartFailureLifeExpectancyGuideArticle } from './HeartFailureLifeExpectancyGuideArticle';
import {
  HEART_FAILURE_LIFE_EXPECTANCY_FAQS,
  HEART_FAILURE_LIFE_EXPECTANCY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational MAGGIC integer risk score and published 1- and 3-year survival probabilities (100% minus table mortality) — not years of life remaining.',
  asideAriaLabel: 'Interactive Heart Failure Life Expectancy Calculator',
  tocItems: HEART_FAILURE_LIFE_EXPECTANCY_TOC_ITEMS,
  GuideArticle: HeartFailureLifeExpectancyGuideArticle,
  faqs: HEART_FAILURE_LIFE_EXPECTANCY_FAQS,
  countryRules: null,
};