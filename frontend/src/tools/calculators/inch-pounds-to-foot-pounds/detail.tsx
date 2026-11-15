import type { ToolPageDetail } from '@/tools/page-detail';
import { InchPoundsToFootPoundsGuideArticle } from './InchPoundsToFootPoundsGuideArticle';
import {
  INCH_POUNDS_TO_FOOT_POUNDS_FAQS,
  INCH_POUNDS_TO_FOOT_POUNDS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert inch-pounds to foot-pounds and foot-pounds to inch-pounds with the exact 12:1 torque ratio.',
  asideAriaLabel: 'Interactive inch-pounds to foot-pounds converter',
  tocItems: INCH_POUNDS_TO_FOOT_POUNDS_TOC_ITEMS,
  GuideArticle: InchPoundsToFootPoundsGuideArticle,
  faqs: INCH_POUNDS_TO_FOOT_POUNDS_FAQS,
  countryRules: null,
};
