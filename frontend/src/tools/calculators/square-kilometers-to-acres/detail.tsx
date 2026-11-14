import type { ToolPageDetail } from '@/tools/page-detail';
import {
  SQUARE_KILOMETERS_TO_ACRES_FAQS,
  SQUARE_KILOMETERS_TO_ACRES_TOC_ITEMS,
} from './content';
import { SquareKilometersToAcresGuideArticle } from './SquareKilometersToAcresGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert square kilometers to acres and acres to square kilometers instantly using exact international acre and SI definitions.',
  asideAriaLabel: 'Interactive square kilometers to acres converter',
  tocItems: SQUARE_KILOMETERS_TO_ACRES_TOC_ITEMS,
  GuideArticle: SquareKilometersToAcresGuideArticle,
  faqs: SQUARE_KILOMETERS_TO_ACRES_FAQS,
  countryRules: null,
};
