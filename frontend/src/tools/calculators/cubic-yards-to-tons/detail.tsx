import type { ToolPageDetail } from '@/tools/page-detail';
import {
  CUBIC_YARDS_TO_TONS_FAQS,
  CUBIC_YARDS_TO_TONS_TOC_ITEMS,
} from './content';
import { CubicYardsToTonsGuideArticle } from './CubicYardsToTonsGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cubic yards to tons using material density. Metric tonnes, US short tons, and imperial long tons are clearly distinguished.',
  asideAriaLabel: 'Interactive cubic yards to tons calculator',
  tocItems: CUBIC_YARDS_TO_TONS_TOC_ITEMS,
  GuideArticle: CubicYardsToTonsGuideArticle,
  faqs: CUBIC_YARDS_TO_TONS_FAQS,
  countryRules: null,
};
