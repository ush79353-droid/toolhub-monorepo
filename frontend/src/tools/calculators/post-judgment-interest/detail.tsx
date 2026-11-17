import type { ToolPageDetail } from '@/tools/page-detail';
import { PostJudgmentInterestGuideArticle } from './PostJudgmentInterestGuideArticle';
import {
  POST_JUDGMENT_INTEREST_FAQS,
  POST_JUDGMENT_INTEREST_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate simple post-judgment interest in USD from the judgment amount, annual rate, and days between judgment and writ.',
  asideAriaLabel: 'Interactive Post Judgment Interest Calculator',
  tocItems: POST_JUDGMENT_INTEREST_TOC_ITEMS,
  GuideArticle: PostJudgmentInterestGuideArticle,
  faqs: POST_JUDGMENT_INTEREST_FAQS,
  countryRules: null,
};
