import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Horsepower Calculator' },
  { id: 'what-is-hp', label: 'What Is Horsepower?' },
  { id: 'mechanical', label: 'What Is Mechanical Horsepower?' },
  { id: 'metric', label: 'What Is Metric Horsepower?' },
  { id: 'how-works', label: 'How Does This Calculator Work?' },
  { id: 'et-method', label: 'HP from Quarter-Mile Time' },
  { id: 'trap-method', label: 'HP from Trap Speed' },
  { id: 'formulas', label: 'Horsepower Formulas Explained' },
  { id: 'to-watts', label: 'Horsepower to Watts' },
  { id: 'to-kw', label: 'Horsepower to Kilowatts' },
  { id: 'torque', label: 'Horsepower vs. Torque' },
  { id: 'wheel-hp', label: 'Engine vs. Wheel Horsepower' },
  { id: 'bhp', label: 'Brake Horsepower vs. Horsepower' },
  { id: 'weight', label: 'How Weight Affects Performance' },
  { id: 'why-trap', label: 'Why Trap Speed Is Useful' },
  { id: 'why-differ', label: 'Why ET and Trap Differ' },
  { id: 'factors', label: 'Factors Affecting Estimates' },
  { id: 'examples', label: 'Horsepower Calculator Examples' },
  { id: 'accuracy', label: 'How Accurate Is This?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'hp-faq', label: 'Frequently Asked Questions' },
];

export const HP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is horsepower?',
    answer:
      'Horsepower is a unit of power — the rate of doing work. Mechanical horsepower equals about 745.7 watts.',
  },
  {
    question: 'How do I calculate horsepower?',
    answer:
      'From engine torque: HP ≈ (lb-ft × RPM) / 5252. This tool instead estimates from quarter-mile ET or trap speed and weight.',
  },
  {
    question: 'What is the horsepower formula?',
    answer:
      'ET method: HP = W / (ET/5.825)³. Trap method: HP = W × (V/234)³, with W in pounds and V in mph.',
  },
  {
    question: 'How do I calculate horsepower from quarter-mile time?',
    answer:
      'Convert weight to pounds, enter ET in seconds, then apply HP = W / (ET/5.825)³.',
  },
  {
    question: 'How do I calculate horsepower from trap speed?',
    answer:
      'Convert trap speed to mph, then HP = W × (V/234)³ with W in pounds.',
  },
  {
    question: 'What does horsepower measure?',
    answer:
      'Power output — how quickly energy is delivered — not the same as torque or vehicle top speed alone.',
  },
  {
    question: 'What is the difference between horsepower and torque?',
    answer:
      'Torque is rotational force; horsepower is torque applied over time (related by RPM). High torque aids launch; power sustains acceleration.',
  },
  {
    question: 'What is mechanical horsepower?',
    answer: 'The imperial unit where 1 hp = 745.699871582 W.',
  },
  {
    question: 'What is metric horsepower?',
    answer:
      'Often labeled PS or cv: 1 PS = 735.49875 W, slightly less than one mechanical horsepower.',
  },
  {
    question: 'What does PS mean in vehicle specifications?',
    answer:
      'Pferdestärke — metric horsepower used in many European specs. Convert carefully when comparing to SAE hp.',
  },
  {
    question: 'How many watts are in one horsepower?',
    answer: 'About 745.70 W per mechanical horsepower.',
  },
  {
    question: 'How many kilowatts are in one horsepower?',
    answer: 'About 0.7457 kW per mechanical horsepower.',
  },
  {
    question: 'How much horsepower is 100 kW?',
    answer: '100 / 0.745699871582 ≈ 134.1 mechanical hp.',
  },
  {
    question: 'How much horsepower is 150 kW?',
    answer: '150 / 0.745699871582 ≈ 201.2 mechanical hp.',
  },
  {
    question: 'What is the difference between hp and bhp?',
    answer:
      'Brake horsepower (bhp) historically means power measured at the crank with a brake/dynamometer. Marketing often uses hp/bhp loosely.',
  },
  {
    question: 'What is the difference between engine horsepower and wheel horsepower?',
    answer:
      'Wheel HP is measured at the driven wheels after drivetrain losses; crank/engine HP is higher before those losses.',
  },
  {
    question: 'How does vehicle weight affect horsepower calculations?',
    answer:
      'Both ET and trap formulas scale with weight. Heavier cars need more estimated HP to hit the same ET or trap speed.',
  },
  {
    question: 'What is quarter-mile elapsed time?',
    answer:
      'The time from launch to cover 1/4 mile. Sensitive to launch, traction, and shift quality as well as power.',
  },
  {
    question: 'What is quarter-mile trap speed?',
    answer:
      'Speed as the car finishes the 1/4 mile. Often correlates more with power than ET, which is launch-sensitive.',
  },
  {
    question: 'Is trap speed more useful than elapsed time for estimating horsepower?',
    answer:
      'Often yes for power estimates, because ET can be ruined by a poor launch while trap still reflects power. Both remain empirical.',
  },
  {
    question: 'Can quarter-mile time accurately determine engine horsepower?',
    answer:
      'No. It estimates performance power, not a certified dyno number. Conditions and technique matter.',
  },
  {
    question: 'Why do horsepower estimates vary?',
    answer:
      'Different methods, constants, weight assumptions, altitude, temperature, and tire grip all change results.',
  },
  {
    question: 'What affects quarter-mile acceleration?',
    answer:
      'Power, weight, traction, gearing, aero drag, altitude, temperature, and driver technique.',
  },
  {
    question: 'What is a good horsepower-to-weight ratio?',
    answer:
      'It depends on class and goals — there is no universal “good” ratio. Compare similar vehicles rather than chasing a single number.',
  },
  {
    question: 'How do I convert horsepower to metric horsepower?',
    answer: 'PS = (HP × 745.699871582) / 735.49875.',
  },
  {
    question: 'What is the relationship between horsepower and RPM?',
    answer:
      'With torque in lb-ft: HP = (Torque × RPM) / 5252 for mechanical horsepower.',
  },
  {
    question: 'How does torque affect horsepower?',
    answer:
      'At a given RPM, more torque means more horsepower via HP = TQ × RPM / 5252.',
  },
  {
    question: 'Does more horsepower always mean faster acceleration?',
    answer:
      'Not always — weight, gearing, traction, and torque curve shape also matter.',
  },
  {
    question: 'Can electric vehicles be measured in horsepower?',
    answer:
      'Yes. Power can be expressed in kW or converted to hp; the same unit conversions apply.',
  },
  {
    question: 'What is the difference between horsepower and kilowatts?',
    answer:
      'Both measure power. 1 mechanical hp ≈ 0.7457 kW. Many EV specs prefer kW.',
  },
];
