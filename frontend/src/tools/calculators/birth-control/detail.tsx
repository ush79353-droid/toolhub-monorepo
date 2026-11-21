import type { ToolPageDetail } from '@/tools/page-detail';
import { BirthControlGuideArticle } from './BirthControlGuideArticle';
import { BIRTH_CONTROL_FAQS, BIRTH_CONTROL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare contraceptive costs over time for females and males. Enter cycle or procedure prices, optional condom packs, and an independent result currency.',
  asideAriaLabel: 'Interactive Birth Control Calculator',
  tocItems: BIRTH_CONTROL_TOC_ITEMS,
  GuideArticle: BirthControlGuideArticle,
  faqs: BIRTH_CONTROL_FAQS,
  countryRules: null,
};
