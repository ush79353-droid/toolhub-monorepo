import type { ToolPageDetail } from '@/tools/page-detail';
import { PagIbigHousingLoanGuideArticle } from './PagIbigHousingLoanGuideArticle';
import { PAG_IBIG_FAQS, PAG_IBIG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Pag-IBIG housing-loan principal and interest in ₱ using the reference fixed-pricing example — without inventing official LTV or insurance rules.',
  asideAriaLabel: 'Interactive Pag-IBIG Housing Loan Calculator',
  tocItems: PAG_IBIG_TOC_ITEMS,
  GuideArticle: PagIbigHousingLoanGuideArticle,
  faqs: PAG_IBIG_FAQS,
  countryRules: null,
};
