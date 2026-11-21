import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEADWEIGHT_LOSS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Deadweight Loss Calculator' },
  { id: 'what-is', label: 'What Is Deadweight Loss?' },
  { id: 'causes', label: 'What Causes Deadweight Loss?' },
  { id: 'formula', label: 'Deadweight Loss Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Deadweight Loss' },
  { id: 'graph', label: 'Deadweight Loss Graph Explained' },
  { id: 'taxes', label: 'Deadweight Loss From Taxes' },
  { id: 'monopoly', label: 'Deadweight Loss From Monopoly' },
  { id: 'price-controls', label: 'Deadweight Loss From Price Controls' },
  { id: 'surplus-compare', label: 'Surplus vs. Deadweight Loss' },
  { id: 'elasticity', label: 'Deadweight Loss and Elasticity' },
  { id: 'reduce', label: 'How to Reduce Deadweight Loss' },
  { id: 'limitations', label: 'Limitations of the Formula' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'deadweight-loss-faq', label: 'Frequently Asked Questions' },
];

export const DEADWEIGHT_LOSS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is deadweight loss?',
    answer:
      'Deadweight loss is the reduction in total economic surplus when market quantity differs from the efficient quantity: the value of mutually beneficial trades that no longer occur.',
  },
  {
    question: 'How do you calculate deadweight loss?',
    answer:
      'A common triangle estimate is DWL = ½ × |price wedge| × |quantity change|. Advanced modes use a tax wedge or integrate between linear supply and demand.',
  },
  {
    question: 'What is the deadweight loss formula?',
    answer:
      'Triangle: DWL = ½ |P₂ − P₁| |Q₂ − Q₁|. Tax: DWL = ½ t |Qe − Qt|. Linear S&D: DWL = ½(b+d)(Qe − Qd)².',
  },
  {
    question: 'What causes deadweight loss?',
    answer:
      'Taxes, subsidies, price ceilings and floors, monopoly output restriction, externalities, quotas, and other distortions that move quantity away from the efficient level.',
  },
  {
    question: 'Is deadweight loss always negative?',
    answer:
      'DWL is a loss of surplus, so its economic meaning is a reduction in welfare. The calculator reports a non-negative estimated area.',
  },
  {
    question: 'Can deadweight loss be zero?',
    answer:
      'Yes. If the price wedge or quantity gap is zero under the triangle model, estimated DWL is zero.',
  },
  {
    question: 'What is deadweight loss from taxation?',
    answer:
      'A per-unit tax can create a wedge between buyer and seller prices, reducing traded quantity. The triangular area between the curves over that quantity gap is the tax DWL.',
  },
  {
    question: 'How does a tax create deadweight loss?',
    answer:
      'Some trades that would have occurred when willingness to pay exceeds marginal cost no longer happen once the wedge is introduced.',
  },
  {
    question: 'How does a subsidy create deadweight loss?',
    answer:
      'A subsidy can push quantity above the efficient level so that some units have social cost above social benefit; another form of welfare loss.',
  },
  {
    question: 'Why does monopoly cause deadweight loss?',
    answer:
      'A monopolist typically sets MR = MC at a lower output than the competitive Q where P = MC, leaving mutually beneficial trades unrealized.',
  },
  {
    question: 'How do price ceilings create deadweight loss?',
    answer:
      'A binding ceiling can create shortages and reduce quantity below the efficient level, eliminating surplus from trades that no longer clear.',
  },
  {
    question: 'How do price floors create deadweight loss?',
    answer:
      'A binding floor can create surplus and reduce transactions below the competitive quantity, generating a welfare-loss triangle.',
  },
  {
    question: 'What does the deadweight loss triangle represent?',
    answer:
      'The geometric area approximating the value of lost mutually beneficial transactions under linear (or locally linear) supply and demand.',
  },
  {
    question: 'How does elasticity affect deadweight loss?',
    answer:
      'More elastic supply or demand usually implies a larger quantity response to a given wedge, which tends to increase DWL; holding other factors fixed.',
  },
  {
    question: 'What is the difference between deadweight loss and tax revenue?',
    answer:
      'Tax revenue is a transfer from buyers/sellers to government. Deadweight loss is surplus that disappears entirely; not captured by anyone.',
  },
  {
    question: 'What is consumer surplus?',
    answer:
      'Consumer surplus is the gap between willingness to pay and the price actually paid, summed across units purchased.',
  },
  {
    question: 'What is producer surplus?',
    answer:
      'Producer surplus is the gap between the price received and marginal cost (or willingness to sell) for units sold.',
  },
  {
    question: 'What is total economic surplus?',
    answer:
      'Total surplus is consumer surplus plus producer surplus (and, when relevant, government surplus such as tax revenue).',
  },
  {
    question: 'Why is deadweight loss considered inefficient?',
    answer:
      'Because potential gains from trade remain unrealized: someone values a unit more than it costs to produce, yet the trade does not occur.',
  },
  {
    question: 'How can governments reduce deadweight loss?',
    answer:
      'Improve competition, target externalities directly, avoid poorly designed price controls, and design taxes/subsidies that minimize inefficient quantity gaps.',
  },
  {
    question: 'Does every tax create deadweight loss?',
    answer:
      'Not necessarily in every model (e.g. correcting a negative externality can raise efficiency). Many distortionary taxes do create DWL relative to the laissez-faire private optimum.',
  },
  {
    question: 'Can subsidies improve economic efficiency?',
    answer:
      'Yes when they correct under-production from positive externalities. Unwarranted subsidies can create DWL by over-expanding quantity.',
  },
  {
    question: 'How is deadweight loss related to market equilibrium?',
    answer:
      'Competitive equilibrium (absent market failures) maximizes total surplus. Distortions that move quantity away from that point can create DWL.',
  },
  {
    question: 'Can deadweight loss be calculated for nonlinear curves?',
    answer:
      'Yes, by integrating the gap between marginal benefit and marginal cost between Qe and Qd. This calculator’s closed forms assume linear (or triangle) geometry.',
  },
  {
    question: 'What are the limitations of the deadweight loss calculator?',
    answer:
      'Triangle mode does not recover true curves from four numbers alone; tax and linear modes use their stated assumptions. Results are estimates, not audited welfare audits.',
  },
];
