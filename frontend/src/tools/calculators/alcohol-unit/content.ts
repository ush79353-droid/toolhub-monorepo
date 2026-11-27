import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'UK units: NHS alcohol units (volume ml × ABV% ÷ 1000; 1 unit ≈ 10 ml / 8 g ethanol). Country grams: UK 8 g (NHS); Australia/NZ/Ireland/France/Germany/Japan drink 10 g; Denmark 12 g; Canada 13.45 g (Health Canada); USA 14 g (CDC). Preset ABVs/volumes: low beer 3.5%, standard 5%, strong 8%; wine 12% (125/175/250 ml); champagne 150 ml 12%; alcopop 275 ml 4.6% (NHS table); spirit 25 ml 40%. Cocktails: alcoholunits.com UK spirit measures (margarita/mojito 50 ml @ 40%; rum & coke / vodka tonic 25 ml @ 40%; martini spirit-equivalent 65 ml @ 40%).';

export const DISCLAIMER =
  'Educational alcohol-unit worksheet only. It does not estimate blood alcohol concentration, clearance time, or fitness to drive. Guidelines and standard-drink sizes vary by country. Not medical advice — seek a clinician for personal health questions.';

export const ALCOHOL_UNIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Alcohol Unit Calculator' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'uk-formula', label: 'UK Unit Formula' },
  { id: 'countries', label: 'Country Standards' },
  { id: 'presets', label: 'Preset Drinks' },
  { id: 'limits', label: 'Limits' },
  { id: 'alcohol-unit-faq', label: 'Frequently Asked Questions' },
];

export const ALCOHOL_UNIT_FAQS: readonly FAQItem[] = [
  {
    question: 'How are UK alcohol units calculated?',
    answer:
      'For each drink, UK units = volume in millilitres × ABV percentage ÷ 1000. Totals are the sum of all servings. Example: 500 ml at 5% ABV = 2.5 UK units.',
  },
  {
    question: 'What changes when I pick another country?',
    answer:
      'The worksheet still builds ethanol from the UK unit definition (8 g per UK unit), then divides by that country’s grams per standard drink (for example Australia 10 g, USA 14 g). Labels say “standard drinks” outside the UK.',
  },
  {
    question: 'Does this estimate BAC or when I can drive?',
    answer:
      'No. Share and copy use only the public page URL. Drink counts stay in your browser and are never put in the URL.',
  },
];
