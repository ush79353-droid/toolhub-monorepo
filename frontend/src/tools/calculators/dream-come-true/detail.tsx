import type { ToolPageDetail } from '@/tools/page-detail';
import {
  DREAM_COME_TRUE_FAQS,
  DREAM_COME_TRUE_TOC_ITEMS,
} from './content';
import { DreamComeTrueGuideArticle } from './DreamComeTrueGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how long it takes to fund a purchase or goal with initial savings, monthly contributions, and monthly compound interest. Currency changes formatting only.',
  asideAriaLabel: 'Dream Come True Calculator guide',
  tocItems: DREAM_COME_TRUE_TOC_ITEMS,
  GuideArticle: DreamComeTrueGuideArticle,
  faqs: DREAM_COME_TRUE_FAQS,
  countryRules: null,
};
