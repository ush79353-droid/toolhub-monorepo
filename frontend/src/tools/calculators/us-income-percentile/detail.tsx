import type { ToolPageDetail } from '@/tools/page-detail';
import { UsIncomePercentileGuideArticle } from './UsIncomePercentileGuideArticle';
import {
  US_INCOME_PERCENTILE_FAQS,
  US_INCOME_PERCENTILE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'See where an annual income sits in the 2024 Census CPS money-income tables for people with income or for households. Ranks use published thresholds only.',
  asideAriaLabel: 'US Income Percentile Calculator guide',
  tocItems: US_INCOME_PERCENTILE_TOC_ITEMS,
  GuideArticle: UsIncomePercentileGuideArticle,
  faqs: US_INCOME_PERCENTILE_FAQS,
  countryRules: null,
};
