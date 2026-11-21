import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EPF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'EPF Calculator' },
  { id: 'what-is-epf', label: 'What Is EPF?' },
  { id: 'how-epf-works', label: 'How Does EPF Work?' },
  { id: 'contribution-rate', label: 'EPF Contribution Rate' },
  { id: 'employee-vs-employer', label: 'Employee vs. Employer' },
  { id: 'what-is-eps', label: 'What Is EPS?' },
  { id: 'formula', label: 'EPF Calculation Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Contributions' },
  { id: 'interest', label: 'How Is EPF Interest Calculated?' },
  { id: 'maturity', label: 'EPF Maturity Amount' },
  { id: 'salary-growth', label: 'How Salary Increases Affect EPF' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'epf-vs-ppf', label: 'EPF vs. PPF' },
  { id: 'epf-vs-eps', label: 'EPF vs. EPS' },
  { id: 'withdrawal', label: 'EPF Withdrawal Rules' },
  { id: 'taxation', label: 'EPF Taxation' },
  { id: 'benefits', label: 'Benefits and Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'epf-faq', label: 'Frequently Asked Questions' },
];

export const EPF_FAQS: readonly FAQItem[] = [
  {
    question: 'What is EPF?',
    answer:
      'Employees’ Provident Fund is a retirement savings scheme in India where employees and employers contribute a percentage of eligible wages into a provident fund account that earns interest over time.',
  },
  {
    question: 'What is the full form of EPF?',
    answer: 'EPF stands for Employees’ Provident Fund.',
  },
  {
    question: 'How does EPF work?',
    answer:
      'Each month, a share of EPF wages (typically basic + DA) is contributed by the employee and employer. The employee share goes to EPF. Part of the employer share may go to EPS (pension), with the remainder credited to EPF. Interest is credited on the EPF balance under EPFO rules.',
  },
  {
    question: 'How do I calculate EPF?',
    answer:
      'Compute EPF salary = Basic + DA. Employee EPF = salary × employee rate. Employer total = salary × employer rate. If EPS-eligible, EPS ≈ 8.33% of the pensionable wage (often capped), and Employer EPF = employer total − EPS. Project monthly deposits with salary growth and interest for maturity.',
  },
  {
    question: 'What is the employee EPF contribution rate?',
    answer:
      'The commonly cited statutory employee rate is 12% of EPF wages for many establishments. Some categories use different rates. This calculator lets you edit the rate for simulation.',
  },
  {
    question: 'What is the employer EPF contribution rate?',
    answer:
      'Employers often contribute 12% of EPF wages in total. That 12% is typically split between EPS and EPF for eligible members, so not all of it lands in the EPF corpus.',
  },
  {
    question: 'How much of the employer contribution goes to EPS?',
    answer:
      'For many EPS members, about 8.33% of the applicable pensionable wage (subject to a wage ceiling) goes to EPS, and the rest of the employer’s contribution goes to EPF. Confirm current EPFO ceilings and eligibility.',
  },
  {
    question: 'How is EPF interest calculated?',
    answer:
      'EPF interest is generally computed on monthly running balances and credited annually for the financial year. This tool models monthly accrual at R/12 with yearly crediting as an educational projection assumption.',
  },
  {
    question: 'Is EPF interest compounded monthly or annually?',
    answer:
      'Interest typically accrues with reference to monthly balances and is credited annually. The effective growth resembles compounding, but the official accounting follows EPFO’s annual credit cycle.',
  },
  {
    question: 'How is the EPF maturity amount calculated?',
    answer:
      'Maturity ≈ opening EPF balance + future employee EPF + future employer EPF (+ VPF if any) + interest credited, excluding EPS pension contributions. Salary growth and rate assumptions change the projection.',
  },
  {
    question: 'What is the difference between EPF and EPS?',
    answer:
      'EPF is an accumulating provident fund balance you can withdraw under rules. EPS is a pension scheme funded by part of the employer contribution; it builds pension entitlement rather than an EPF-style corpus.',
  },
  {
    question: 'What is the difference between EPF and PPF?',
    answer:
      'EPF is employment-linked with employer contributions. PPF is an individual public provident fund with contribution limits and different tenure/tax rules. They are separate products.',
  },
  {
    question: 'What is VPF?',
    answer:
      'Voluntary Provident Fund lets employees contribute more than the mandatory EPF rate into the provident fund. VPF usually earns the same EPF interest rate as the mandatory portion.',
  },
  {
    question: 'Can employees contribute more than the standard EPF rate?',
    answer:
      'Yes, through VPF where the employer/EPFO process allows it. Use the optional VPF section in this calculator to model extra employee deposits.',
  },
  {
    question: 'What happens to EPF when salary increases?',
    answer:
      'Higher basic/DA raises monthly contributions (subject to contribution rules). Over decades, salary growth can substantially increase the projected corpus.',
  },
  {
    question: 'Can EPF be withdrawn before retirement?',
    answer:
      'Partial or full withdrawals may be allowed for specified reasons under EPFO rules (for example certain medical, housing, or unemployment situations). Always check current official guidance.',
  },
  {
    question: 'What happens to EPF after changing jobs?',
    answer:
      'Members can typically transfer the EPF account to the new employer using UAN-linked transfer, preserving continuity of service and balance.',
  },
  {
    question: 'Is EPF taxable?',
    answer:
      'Tax treatment depends on contribution levels, timing of withdrawal, and applicable Income Tax rules (which change). This calculator does not compute tax. Consult current law or a professional.',
  },
  {
    question: 'Can EPF contributions stop temporarily?',
    answer:
      'Contributions generally stop or reduce when wages stop (for example unemployment or certain leave). Modeling pauses requires adjusting your assumptions; this tool’s base mode assumes continuous contributions until retirement age.',
  },
  {
    question: 'What happens to EPF after leaving employment?',
    answer:
      'The balance remains and may continue earning interest under applicable rules until withdrawn or transferred. Unemployment-related withdrawal options may exist after a waiting period.',
  },
  {
    question: 'Does the EPF interest rate change every year?',
    answer:
      'EPFO recommends/announces interest rates that can change by financial year. Future rates in this calculator are user assumptions, not forecasts.',
  },
  {
    question: 'How do I check my EPF balance?',
    answer:
      'Use the official UMANG / EPFO member portal or passbook services linked to your UAN. Employer HR portals may also show balances.',
  },
  {
    question: 'Can I transfer EPF between employers?',
    answer:
      'Yes. Online transfer requests through the EPFO member interface are commonly used when UAN and KYC details are in order.',
  },
  {
    question: 'What happens to my EPF if I retire early?',
    answer:
      'You may still be able to withdraw or settle under EPFO conditions. Pension (EPS) eligibility and amount depend on service history and scheme rules, which this maturity projection does not replace.',
  },
  {
    question: 'Are employer contributions completely credited to EPF?',
    answer:
      'Not always. For EPS-eligible members, a portion of the employer contribution typically funds EPS. Only the residual employer share plus employee EPF (and VPF) builds the EPF balance.',
  },
];
