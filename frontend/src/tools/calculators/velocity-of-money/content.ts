import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const VELOCITY_OF_MONEY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Velocity of Money Calculator' },
  { id: 'what-is', label: 'What Is the Velocity of Money?' },
  { id: 'equation', label: 'Velocity of Money Equation' },
  { id: 'how-to-calculate', label: 'How to Calculate Velocity' },
  { id: 'example', label: 'Calculator Example' },
  { id: 'high-velocity', label: 'What Does High Velocity Mean?' },
  { id: 'low-velocity', label: 'What Does Low Velocity Mean?' },
  { id: 'factors', label: 'Factors Affecting Velocity' },
  { id: 'inflation', label: 'Velocity and Inflation' },
  { id: 'growth', label: 'Velocity and Economic Growth' },
  { id: 'quantity-theory', label: 'Quantity Theory of Money' },
  { id: 'transaction-vs-income', label: 'Transaction vs Income Velocity' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'velocity-of-money-faq', label: 'Frequently Asked Questions' },
];

export const VELOCITY_OF_MONEY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the velocity of money?',
    answer:
      'The velocity of money is the ratio of a nominal monetary flow (such as total transaction value or nominal GDP) to a selected money stock over a stated period. It is an aggregate turnover measure, not the physical speed of individual banknotes.',
  },
  {
    question: 'How do you calculate the velocity of money?',
    answer:
      'Divide the chosen nominal flow by the money stock: V = T_nominal / M for transactions, or V_GDP = Nominal GDP / M. Confirm the period (year, quarter, month) and that both amounts use the same currency and magnitude.',
  },
  {
    question: 'What does a velocity of money of 3 mean?',
    answer:
      'It means the nominal flow during the period was three times the money stock used in the calculation — for example, $1.5 million of transactions against a $500,000 money stock implies V = 3 turnovers per that period.',
  },
  {
    question: 'What is the formula for velocity of money?',
    answer:
      'From the equation of exchange, V = PT / M when PT is nominal transaction value, or V = PY / M when PY is nominal GDP. Equivalently, V = T_nominal / M when T_nominal is entered directly.',
  },
  {
    question: 'What is the Fisher equation of exchange?',
    answer:
      'MV = PT links money stock (M), transaction velocity (V), a price measure (P), and real transaction volume (T). A related income form is MV = PY, where PY is nominal GDP.',
  },
  {
    question: 'What is the quantity theory of money?',
    answer:
      'It is a family of models relating money, velocity, output, and prices. The equation of exchange is an identity; quantity-theory claims add assumptions about how V and Y behave when M changes. An identity alone does not prove that money growth always raises prices one-for-one.',
  },
  {
    question: 'What factors affect the velocity of money?',
    answer:
      'Spending and saving behavior, interest rates, inflation expectations, money demand, payment technology, banking conditions, confidence, monetary policy, and how monetary aggregates are defined can all move measured velocity.',
  },
  {
    question: 'What causes the velocity of money to increase?',
    answer:
      'Measured V rises when nominal flows grow faster than the selected money stock, or when the money stock falls relative to flows. Causes can include stronger spending, lower money demand, or definitional changes — context matters.',
  },
  {
    question: 'Why does the velocity of money decrease?',
    answer:
      'V falls when the money stock grows faster than nominal transactions or GDP, or when flows shrink. Higher precautionary money demand, more saving, uncertainty, or rapid monetary expansion relative to spending can contribute. Low V does not by itself prove a recession.',
  },
  {
    question: 'Is a higher velocity of money always better?',
    answer:
      'No. Higher V means more nominal activity relative to the money stock under the chosen definitions. Whether that is desirable depends on inflation, output, and financial conditions. High velocity is not automatically “healthy.”',
  },
  {
    question: 'How does velocity of money affect inflation?',
    answer:
      'In MV = PY, faster money growth or rising V can raise nominal spending. How that splits between prices (P) and real output (Y) depends on slack, expectations, and other factors. The identity does not force a mechanical inflation result.',
  },
  {
    question: 'What is the relationship between money supply and velocity?',
    answer:
      'For a given nominal flow, a larger money stock implies lower velocity (V = flow / M). Empirically, money and velocity often move together in more complex ways because flows and money demand also change.',
  },
  {
    question: 'Can velocity of money be negative?',
    answer:
      'Not under standard definitions with nonnegative flows and positive money stocks. This calculator rejects negative money stocks and negative nominal flows in normal modes.',
  },
  {
    question: 'What is the difference between transaction velocity and income velocity?',
    answer:
      'Transaction velocity uses a transactions numerator; income (GDP) velocity uses nominal GDP. Because many financial and intermediate transactions are outside GDP, the two measures can differ substantially.',
  },
  {
    question: 'How do you calculate velocity using nominal GDP?',
    answer:
      'V_GDP = Nominal GDP / M for the same period and currency. Example: $25 trillion GDP and $20 trillion money stock → V_GDP = 1.25 turnovers per year (illustrative).',
  },
  {
    question: 'What is the relationship between M1, M2, and money velocity?',
    answer:
      'Different aggregates produce different velocities because denominators differ. M1 velocity and M2 velocity are not interchangeable; always label which stock you used.',
  },
  {
    question: 'Can the velocity of money be zero?',
    answer:
      'Yes, if the nominal flow is zero while the money stock is positive. If the money stock is zero, velocity is undefined — division by zero is not allowed.',
  },
  {
    question: 'Why is velocity important in macroeconomics?',
    answer:
      'It summarizes how intensively a money stock supports nominal spending. Analysts use it alongside money growth, inflation, interest rates, and GDP to interpret monetary conditions — with careful attention to measurement.',
  },
];
