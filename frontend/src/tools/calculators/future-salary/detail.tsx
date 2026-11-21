import type { ToolPageDetail } from '@/tools/page-detail';
import { FutureSalaryGuideArticle } from './FutureSalaryGuideArticle';
import { FUTURE_SALARY_FAQS, FUTURE_SALARY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project nominal future salary with compound annual growth, then adjust for inflation to see real purchasing power — with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Future Salary Calculator',
  tocItems: FUTURE_SALARY_TOC_ITEMS,
  GuideArticle: FutureSalaryGuideArticle,
  faqs: FUTURE_SALARY_FAQS,
  countryRules: null,
};
