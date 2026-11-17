import type { ToolPageDetail } from '@/tools/page-detail';
import { CaliforniaStimulusCheckIiGuideArticle } from './CaliforniaStimulusCheckIiGuideArticle';
import {
  CALIFORNIA_STIMULUS_CHECK_II_FAQS,
  CALIFORNIA_STIMULUS_CHECK_II_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical Golden State Stimulus II eligibility and payment estimate for the completed 2021 California program.',
  asideAriaLabel: 'Interactive California Stimulus Check II Calculator',
  tocItems: CALIFORNIA_STIMULUS_CHECK_II_TOC_ITEMS,
  GuideArticle: CaliforniaStimulusCheckIiGuideArticle,
  faqs: CALIFORNIA_STIMULUS_CHECK_II_FAQS,
  countryRules: null,
};
