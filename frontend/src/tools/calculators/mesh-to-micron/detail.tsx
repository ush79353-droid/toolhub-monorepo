import type { ToolPageDetail } from '@/tools/page-detail';
import { MeshToMicronGuideArticle } from './MeshToMicronGuideArticle';
import { MESH_TO_MICRON_FAQS, MESH_TO_MICRON_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert ASTM E11 sieve designations to nominal openings in microns, estimate woven-mesh apertures, and reverse-lookup nearest sieves.',
  asideAriaLabel: 'Interactive mesh to micron converter',
  tocItems: MESH_TO_MICRON_TOC_ITEMS,
  GuideArticle: MeshToMicronGuideArticle,
  faqs: MESH_TO_MICRON_FAQS,
  countryRules: null,
};
