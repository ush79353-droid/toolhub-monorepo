import type { ToolPageDetail } from '@/tools/page-detail';
import { SocialSecurityGuideArticle } from './SocialSecurityGuideArticle';
import {
  SOCIAL_SECURITY_FAQS,
  SOCIAL_SECURITY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare Social Security claiming ages 62–70 with SSA full retirement age, early reduction, and delayed credits. Enter your own estimated benefit at FRA; results are educational estimates in fixed USD—not advice.',
  asideAriaLabel: 'Interactive Social Security Calculator',
  tocItems: SOCIAL_SECURITY_TOC_ITEMS,
  GuideArticle: SocialSecurityGuideArticle,
  faqs: SOCIAL_SECURITY_FAQS,
  countryRules: null,
};
