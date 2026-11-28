import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Compression Ratio Calculator' },
  { id: 'what-is', label: 'What Is a Compression Ratio?' },
  { id: 'engine-cr', label: 'What Is Engine Compression Ratio?' },
  { id: 'formula', label: 'Compression Ratio Formula' },
  { id: 'how-to', label: 'How to Calculate Compression Ratio' },
  { id: 'displacement', label: 'How to Calculate Engine Displacement' },
  { id: 'swept', label: 'What Is Swept Volume?' },
  { id: 'clearance', label: 'What Is Clearance Volume?' },
  { id: 'bore', label: 'How Does Bore Affect CR?' },
  { id: 'stroke', label: 'How Does Stroke Affect CR?' },
  { id: 'static', label: 'What Is Static Compression Ratio?' },
  { id: 'dynamic', label: 'What Is Dynamic Compression Ratio?' },
  { id: 'static-vs-dynamic', label: 'Static vs. Dynamic CR' },
  { id: 'good-cr', label: 'What Is a Good Compression Ratio?' },
  { id: 'too-high', label: 'If Compression Ratio Is Too High' },
  { id: 'efficiency', label: 'Does Higher CR Improve Efficiency?' },
  { id: 'petrol', label: 'CR in Petrol Engines' },
  { id: 'diesel', label: 'CR in Diesel Engines' },
  { id: 'turbo', label: 'Turbochargers and CR' },
  { id: 'pressure', label: 'CR vs. Cylinder Pressure' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cr-faq', label: 'Frequently Asked Questions' },
];

export const CR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is engine compression ratio?',
    answer:
      'The ratio of cylinder volume at BDC to volume at TDC: CR = (Vs + Vc) / Vc.',
  },
  {
    question: 'How do I calculate compression ratio?',
    answer:
      'Find swept volume from bore and stroke, sum clearance volumes at TDC, then apply CR = (Vs + Vc) / Vc.',
  },
  {
    question: 'What is the compression ratio formula?',
    answer: 'CR = (Vs + Vc) / Vc = VBDC / VTDC. It is dimensionless (e.g., 10:1).',
  },
  {
    question: 'How do I calculate compression ratio from bore and stroke?',
    answer:
      'Vs(cc) = π D² L / 4000 with D and L in mm, then divide (Vs + Vc) by Vc.',
  },
  {
    question: 'What is swept volume?',
    answer:
      'The volume displaced by the piston between TDC and BDC — cylinder displacement per cylinder.',
  },
  {
    question: 'What is clearance volume?',
    answer:
      'Volume remaining above the piston at TDC: chamber + gasket + deck + signed piston crown volume.',
  },
  {
    question: 'How do I calculate engine displacement?',
    answer: 'Engine displacement = swept volume per cylinder × number of cylinders.',
  },
  {
    question: 'What is a good compression ratio?',
    answer:
      'It depends on fuel, boost, combustion chamber design, and calibration — there is no universal optimum.',
  },
  {
    question: 'Is a higher compression ratio better?',
    answer:
      'Higher CR can improve thermal efficiency in theory, but may increase knock risk and require suitable fuel and tuning.',
  },
  {
    question: 'What happens if compression ratio is too high?',
    answer:
      'Unwanted knock, higher temperatures/pressures, and possible damage if not designed and fueled for it.',
  },
  {
    question: 'Can compression ratio be lower than 1?',
    answer:
      'No for a normal four-stroke geometric CR; CR must be greater than 1 because VBDC > VTDC.',
  },
  {
    question: 'What is the difference between static and dynamic compression ratio?',
    answer:
      'Static uses full stroke. Dynamic uses effective stroke after the intake valve closes (IVC).',
  },
  {
    question: 'How does intake valve closing affect dynamic compression ratio?',
    answer:
      'Later IVC (more ABDC) typically shortens effective compression stroke and lowers calculated DCR.',
  },
  {
    question: 'How does piston stroke affect compression ratio?',
    answer:
      'Longer stroke increases Vs; if Vc is fixed, CR rises. Changing stroke also changes engine character.',
  },
  {
    question: 'How does cylinder bore affect compression ratio?',
    answer:
      'Larger bore increases Vs (and often deck/gasket volumes). Net CR depends on how Vc changes with bore.',
  },
  {
    question: 'How does head gasket thickness affect compression ratio?',
    answer:
      'Thicker gaskets usually increase Vc and lower CR, all else equal.',
  },
  {
    question: 'How does piston dome volume affect compression ratio?',
    answer:
      'A dome (negative piston volume in this tool) reduces Vc and raises CR; a dish increases Vc and lowers CR.',
  },
  {
    question: 'How does deck clearance affect compression ratio?',
    answer:
      'Positive deck (piston below deck) adds volume and can lower CR; negative deck reduces volume and can raise CR.',
  },
  {
    question: 'What is the compression ratio of a petrol engine?',
    answer:
      'Spark-ignition engines span a wide range depending on design and fuel — use manufacturer data, not a single figure.',
  },
  {
    question: 'What is the compression ratio of a diesel engine?',
    answer:
      'Compression-ignition engines often use higher geometric ratios than many petrol engines to enable auto-ignition.',
  },
  {
    question: 'How does compression ratio affect engine efficiency?',
    answer:
      'Ideal Otto-cycle efficiency rises with CR, but real engines face friction, heat loss, and knock limits.',
  },
  {
    question: 'Does compression ratio affect horsepower?',
    answer:
      'Indirectly — higher CR can improve power potential with proper fueling and timing, but many other factors dominate.',
  },
  {
    question: 'Does higher compression cause engine knocking?',
    answer:
      'It can increase knock tendency, especially on lower-octane fuel or with aggressive timing.',
  },
  {
    question: 'Can turbocharged engines have high compression ratios?',
    answer:
      'Yes, but boost raises effective cylinder pressure; many boosted engines use carefully chosen geometric CR.',
  },
  {
    question: 'What is the difference between compression ratio and compression pressure?',
    answer:
      'CR is a volume ratio. Compression pressure is a measured pressure and depends on sealing, timing, and conditions.',
  },
  {
    question: 'Can I calculate compression ratio without engine dimensions?',
    answer:
      'Yes — use known Vs and Vc (Known volumes mode), or solve Vc from Vs and target CR.',
  },
  {
    question: 'How do I calculate clearance volume from a known compression ratio?',
    answer: 'Vc = Vs / (CR − 1) for CR > 1.',
  },
  {
    question: 'Can two engines have the same compression ratio but different displacements?',
    answer:
      'Yes. CR depends on the ratio of volumes, not absolute displacement alone.',
  },
];
