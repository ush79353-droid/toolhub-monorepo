import type { ToolPageDetail } from '@/tools/page-detail';
import { ZERO_TO_SIXTY_FAQS, ZERO_TO_SIXTY_TOC_ITEMS } from './content';
import { ZeroToSixtyGuideArticle } from './ZeroToSixtyGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate 0–60 mph and 0–100 km/h acceleration times based on engine horsepower, vehicle weight, drivetrain layout, transmission type, tire compound, and road conditions.',
  asideAriaLabel: 'Interactive 0-60 acceleration calculator',
  tocItems: ZERO_TO_SIXTY_TOC_ITEMS,
  GuideArticle: ZeroToSixtyGuideArticle,
  faqs: ZERO_TO_SIXTY_FAQS,
  countryRules: null,
};
