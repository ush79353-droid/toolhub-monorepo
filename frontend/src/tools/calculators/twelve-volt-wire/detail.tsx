import type { ToolPageDetail } from '@/tools/page-detail';
import { TWELVE_VOLT_FAQS, TWELVE_VOLT_TOC_ITEMS } from './content';
import { TwelveVoltWireGuideArticle } from './TwelveVoltWireGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the 12 V DC conductor area for a two-wire voltage-drop limit from current, one-way length, material, and temperature.',
  asideAriaLabel: 'Interactive 12 volt wire size calculator',
  tocItems: TWELVE_VOLT_TOC_ITEMS,
  GuideArticle: TwelveVoltWireGuideArticle,
  faqs: TWELVE_VOLT_FAQS,
  countryRules: null,
};
