import type { ToolPageDetail } from '@/tools/page-detail';
import { TrumpAccountsGuideArticle } from './TrumpAccountsGuideArticle';
import { TRUMP_ACCOUNTS_FAQS, TRUMP_ACCOUNTS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project how a child’s account could grow with starting balance, annual contributions, and investment return scenarios. Currency changes formatting only.',
  asideAriaLabel: 'Trump Accounts Calculator guide',
  tocItems: TRUMP_ACCOUNTS_TOC_ITEMS,
  GuideArticle: TrumpAccountsGuideArticle,
  faqs: TRUMP_ACCOUNTS_FAQS,
  countryRules: null,
};
