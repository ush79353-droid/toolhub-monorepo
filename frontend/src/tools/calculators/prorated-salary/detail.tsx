import type { ToolPageDetail } from '@/tools/page-detail';
import { ProratedSalaryGuideArticle } from './ProratedSalaryGuideArticle';
import { PRORATED_SALARY_FAQS, PRORATED_SALARY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Prorate monthly salary for a partial month from calendar working days, paid holidays, and approved leave — with independent currency conversion on gross and result amounts.',
  asideAriaLabel: 'Interactive Prorated Salary Calculator',
  tocItems: PRORATED_SALARY_TOC_ITEMS,
  GuideArticle: ProratedSalaryGuideArticle,
  faqs: PRORATED_SALARY_FAQS,
  countryRules: null,
};
