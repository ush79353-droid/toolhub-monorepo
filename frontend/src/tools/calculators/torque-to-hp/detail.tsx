import type { ToolPageDetail } from '@/tools/page-detail';
import { TorqueToHpGuideArticle } from './TorqueToHpGuideArticle';
import { TORQUE_TO_HP_FAQS, TORQUE_TO_HP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate shaft power and horsepower from torque and RPM — or solve reverse when speed is known.',
  asideAriaLabel: 'Interactive torque to HP calculator',
  tocItems: TORQUE_TO_HP_TOC_ITEMS,
  GuideArticle: TorqueToHpGuideArticle,
  faqs: TORQUE_TO_HP_FAQS,
  countryRules: null,
};
