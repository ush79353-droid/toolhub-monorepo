import type { ToolPageDetail } from '@/tools/page-detail';
import {
  CELL_PHONE_PLAN_FAQS,
  CELL_PHONE_PLAN_TOC_ITEMS,
} from './content';
import { CellPhonePlanGuideArticle } from './CellPhonePlanGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare buying a phone outright with a carrier phone-buying plan, including monthly-compounded interest earned by investing the phone price. Currency changes formatting only.',
  asideAriaLabel: 'Cell Phone Plan Calculator guide',
  tocItems: CELL_PHONE_PLAN_TOC_ITEMS,
  GuideArticle: CellPhonePlanGuideArticle,
  faqs: CELL_PHONE_PLAN_FAQS,
  countryRules: null,
};
