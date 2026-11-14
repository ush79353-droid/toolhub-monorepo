import type { ToolPageDetail } from '@/tools/page-detail';
import { CpmGuideArticle } from './CpmGuideArticle';
import { CPM_FAQS, CPM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve campaign cost, CPM, or impressions from any two inputs. Optionally compare a second campaign. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive CPM calculator',
  tocItems: CPM_TOC_ITEMS,
  GuideArticle: CpmGuideArticle,
  faqs: CPM_FAQS,
  countryRules: null,
};
