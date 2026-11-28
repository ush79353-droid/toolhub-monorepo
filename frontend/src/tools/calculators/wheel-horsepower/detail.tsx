import type { ToolPageDetail } from '@/tools/page-detail';
import { WheelHorsepowerGuideArticle } from './WheelHorsepowerGuideArticle';
import { WHP_FAQS, WHP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate wheel horsepower from engine power (or the reverse), apply overall or component drivetrain efficiency, and see power loss — presets are editable estimates, not OEM specs.',
  asideAriaLabel: 'Interactive Wheel Horsepower Calculator',
  tocItems: WHP_TOC_ITEMS,
  GuideArticle: WheelHorsepowerGuideArticle,
  faqs: WHP_FAQS,
  countryRules: null,
};
