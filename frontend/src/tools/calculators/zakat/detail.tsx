import type { ToolPageDetail } from '@/tools/page-detail';
import { ZakatGuideArticle } from './ZakatGuideArticle';
import { ZAKAT_FAQS, ZAKAT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate 2.5% Zakat on cash, metals, and trade assets after eligible liabilities and the Nisab you select. Hawl is a separate timing check. Not a fatwa.',
  asideAriaLabel: 'Zakat Calculator guide',
  tocItems: ZAKAT_TOC_ITEMS,
  GuideArticle: ZakatGuideArticle,
  faqs: ZAKAT_FAQS,
  countryRules: null,
};
