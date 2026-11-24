import type { ToolPageDetail } from '@/tools/page-detail';
import { SodiumInSaltGuideArticle } from './SodiumInSaltGuideArticle';
import { SODIUM_IN_SALT_FAQS, SODIUM_IN_SALT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert culinary salt amounts to sodium (and back) using salt-type teaspoon density and pure NaCl stoichiometry 22.99/58.44 — educational only.',
  asideAriaLabel: 'Interactive Sodium in Salt Calculator',
  tocItems: SODIUM_IN_SALT_TOC_ITEMS,
  GuideArticle: SodiumInSaltGuideArticle,
  faqs: SODIUM_IN_SALT_FAQS,
  countryRules: null,
};
