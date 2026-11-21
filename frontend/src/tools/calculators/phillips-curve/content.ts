import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PHILLIPS_CURVE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Phillips Curve Calculator' },
  { id: 'what-is', label: 'What Is the Phillips Curve?' },
  { id: 'traditional', label: 'Traditional Phillips Curve' },
  { id: 'traditional-formula', label: 'Traditional Formula' },
  { id: 'new-classical', label: 'New Classical Equation' },
  { id: 'new-keynesian', label: 'New Keynesian Model' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'examples', label: 'Phillips Curve Examples' },
  { id: 'short-long', label: 'Short-Run vs Long-Run' },
  { id: 'nairu', label: 'Phillips Curve and NAIRU' },
  { id: 'shifts', label: 'What Causes Shifts?' },
  { id: 'stagflation', label: 'Phillips Curve and Stagflation' },
  { id: 'central-banks', label: 'How Central Banks Use It' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'phillips-curve-faq', label: 'Frequently Asked Questions' },
];

export const PHILLIPS_CURVE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Phillips Curve?',
    answer:
      'A family of empirical and theoretical relationships linking inflation (or wage growth) to unemployment, economic slack, expectations, and sometimes supply shocks.',
  },
  {
    question: 'Who developed the Phillips Curve?',
    answer:
      'A. W. Phillips documented a wage–unemployment association in U.K. data (1958). Later work reframed it in inflation–unemployment and expectations-augmented forms.',
  },
  {
    question: 'What is the Phillips Curve formula?',
    answer:
      'There is no single formula. This calculator supports w = w_T − βΔu (traditional wage-change), π = πᵉ − α(u − uₙ) + s (New Classical), and πₜ = βE[πₜ₊₁] + κxₜ + sₜ (simplified NKPC).',
  },
  {
    question: 'What is the relationship between inflation and unemployment?',
    answer:
      'In many short-run models, lower unemployment (or a positive output gap) is associated with higher inflation given expectations, but the link can flatten, shift, or break down.',
  },
  {
    question: 'What is the traditional Phillips Curve?',
    answer:
      'Historically a wage–unemployment level relationship (e.g. w = a − bu). Here Traditional mode uses a simplified wage-change form w = w_T − βΔu with an explicit β.',
  },
  {
    question: 'What is the New Classical Phillips Curve?',
    answer:
      'An expectations-augmented curve emphasizing that only unexpected inflation relates to unemployment gaps; the long-run trade-off is typically not stably exploitable.',
  },
  {
    question: 'What is the New Keynesian Phillips Curve?',
    answer:
      'A forward-looking inflation equation linking current inflation to expected future inflation, an output (or marginal-cost) gap, and cost-push shocks, often derived under sticky prices.',
  },
  {
    question: 'What is the difference between short-run and long-run Phillips Curves?',
    answer:
      'Short-run curves hold expectations fixed; long-run standard models often become vertical at natural unemployment once expectations adjust.',
  },
  {
    question: 'What is NAIRU?',
    answer:
      'The non-accelerating inflation rate of unemployment: a unemployment rate consistent with stable inflation under a chosen empirical model. It is estimated, not known exactly.',
  },
  {
    question: 'Is NAIRU the same as the natural unemployment rate?',
    answer:
      'Related but not identical. Natural rate is a theoretical concept; NAIRU is an empirical inflation-stability construct. Estimates of both move over time.',
  },
  {
    question: 'Why does the Phillips Curve slope downward?',
    answer:
      'Under positive slope conventions here, higher unemployment (or a more negative gap) reduces wage growth or inflation for given expectations; reflecting weaker labor/product market pressure.',
  },
  {
    question: 'Can the Phillips Curve slope upward?',
    answer:
      'Empirical estimates can change sign or flatten. This calculator uses the conventional positive coefficient with a negative unemployment/gap term in the equation.',
  },
  {
    question: 'What causes the Phillips Curve to shift?',
    answer:
      'Changes in inflation expectations, oil and import prices, productivity, wage bargaining, monetary regimes, and labor-market structure.',
  },
  {
    question: 'How does expected inflation affect the Phillips Curve?',
    answer:
      'Higher expected inflation typically shifts the short-run curve upward so that the same unemployment gap maps to higher actual inflation.',
  },
  {
    question: 'Why did stagflation challenge the Phillips Curve?',
    answer:
      '1970s episodes combined high inflation and high unemployment, undermining a stable, exploitable inverse trade-off when shocks and expectations shifted.',
  },
  {
    question: 'How do supply shocks affect inflation and unemployment?',
    answer:
      'Adverse supply shocks can raise inflation while weakening activity, moving economies off a simple demand-driven Phillips trade-off.',
  },
  {
    question: 'Is the Phillips Curve still relevant?',
    answer:
      'Yes as a organizing framework with uncertainty (especially around expectations, slack measures, and time-varying slopes) not as a fixed forecasting law.',
  },
  {
    question: 'How do central banks use the Phillips Curve?',
    answer:
      'As one input among many for inflation forecasting and assessing labor-market slack, always with model uncertainty and judgment.',
  },
  {
    question: 'How do you calculate inflation using the Phillips Curve?',
    answer:
      'In New Classical mode: π = πᵉ − α(u − uₙ) + s. In NKPC mode: πₜ = βE[πₜ₊₁] + κxₜ + sₜ.',
  },
  {
    question: 'How do you calculate unemployment using the Phillips Curve?',
    answer:
      'Rearrange the New Classical equation: u = uₙ + (πᵉ + s − π) / α, requiring α > 0.',
  },
  {
    question: 'What is the output gap in the New Keynesian Phillips Curve?',
    answer:
      'A measure of demand pressure relative to potential (here entered in percent). Positive gaps raise inflation when κ > 0 in this simplified form.',
  },
  {
    question: 'What is the Phillips Curve slope coefficient?',
    answer:
      'The sensitivity of inflation or wage growth to unemployment gaps or output gaps. It is model-specific and estimated, not universal.',
  },
  {
    question: 'Why is the long-run Phillips Curve vertical in standard models?',
    answer:
      'Once expectations fully adjust, unemployment returns to its natural rate and inflation can settle at any rate consistent with monetary policy; no permanent trade-off.',
  },
  {
    question: 'Can high inflation and high unemployment occur together?',
    answer:
      'Yes: especially with adverse supply shocks or rising expectations (stagflation).',
  },
  {
    question: 'What are the limitations of the Phillips Curve?',
    answer:
      'Unstable slopes, hard-to-measure expectations and natural rates, structural change, flat recent estimates, and country differences limit forecasting accuracy.',
  },
];
