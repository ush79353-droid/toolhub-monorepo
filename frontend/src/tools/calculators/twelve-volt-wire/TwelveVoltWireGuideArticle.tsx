import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TWELVE_VOLT_FAQS } from './content';

const sections: { id: string; title: string; body: string[] }[] = [
  {
    id: 'what-is-12v-wire',
    title: 'What Is a 12 Volt Wire Size Calculator?',
    body: [
      'A 12 volt wire size calculator estimates how much conductor metal is needed so a direct-current run does not lose more than a chosen fraction of 12 V. Omega Calculators does that estimate in the browser from current, one-way length, material, and conductor temperature.',
      'The result is a voltage-drop area. It is not a certificate that the wire is safe to install.',
    ],
  },
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Wire Size for 12V DC',
    body: [
      'Resistance of one conductor is R = ρ × L / A. In a conventional two-wire circuit the current travels out and back, so the loop resistance is twice that when both wires match. Voltage drop is I times loop resistance: 2 × I × ρ × L / A.',
      'The smallest area that stays inside a drop limit is A = 2 × ρ × I × L / Vdrop. Vdrop is the source voltage times the percentage you allow. At 12 V and 3%, that limit is 0.36 V.',
    ],
  },
  {
    id: 'why-size-matters',
    title: 'Why Wire Size Matters at 12 Volts',
    body: [
      'A 0.36 V loss is only 3% of 12 V, but it is a large share of the margin many 12 V devices have. The same absolute loss on a 120 V circuit would be 0.3%. Low-voltage runs therefore grow in cross-section quickly as current or length increases.',
    ],
  },
  {
    id: 'distance',
    title: 'How Distance Affects 12V Wire Size',
    body: [
      'Enter the one-way path length. The formula already adds the return path of the same length. Doubling the one-way distance doubles the required area for the same drop. A chassis or unequal return is not modeled, because that path needs its own resistance.',
    ],
  },
  {
    id: 'copper-aluminum',
    title: 'Copper vs. Aluminum',
    body: [
      'The resistivity values are the IEC 60228 figures at 20°C: copper 0.017241 Ω·mm²/m and aluminium 0.028264 Ω·mm²/m. Aluminum needs more area for the same drop. Terminations, corrosion, and mechanical support are separate design choices this resistance model does not score.',
    ],
  },
  {
    id: 'awg-mm2',
    title: 'AWG and mm²',
    body: [
      'American Wire Gauge diameters follow ASTM B258: d = 0.127 mm × 92^((36−n)/39), and the solid area is πd²/4. Metric rows use common nominal sizes from 0.5 mm² through 300 mm². The calculator picks the smallest size in each list whose area is at least the voltage-drop minimum. Those two picks are not sold as matching cables.',
    ],
  },
  {
    id: 'allowable-drop',
    title: 'What Is Allowable Voltage Drop?',
    body: [
      'Allowable drop is the loss you decide to tolerate, entered as a percentage of the source. Three percent is the form default so the example is repeatable. It is not presented as an NEC or IEC mandate. The permitted volts are shown next to the percentage.',
    ],
  },
  {
    id: 'worked-example',
    title: 'Worked 12V Voltage-Drop Example',
    body: [
      'Take 12 V, 3% (0.36 V), copper, 10 A, 5 m one way, and 50°C. The temperature factor from 20°C is 1 + 0.00393 × 30 = 1.1179. Resistivity becomes 1.7241×10⁻⁸ × 1.1179 ohm-metres.',
      'Minimum area = 2 × that resistivity × 10 × 5 / 0.36 = 5.354×10⁻⁶ m², or 5.354 mm². The next listed metric size is 6 mm². ASTM 10 AWG is about 5.261 mm², just under that area, and 9 AWG is the next gauge in the series that clears it. On 6 mm² the loop drop is about 0.321 V, leaving about 11.68 V at the load, and the I²R loss is about 3.21 W. That still says nothing about ampacity.',
    ],
  },
  {
    id: 'temperature',
    title: 'How Temperature Affects Resistance',
    body: [
      'Metal resistance rises as it warms. The linear correction is R(T) = R(20°C) × [1 + α(T − 20)], with α = 0.00393 /°C for copper and 0.00403 /°C for aluminium, the coefficients used with IEC 60228. The temperature you enter is the assumed conductor temperature for that correction. It is not the insulation rating and not the ambient temperature by itself.',
    ],
  },
  {
    id: 'automotive',
    title: 'Automotive 12V Wiring',
    body: [
      'Vehicle circuits are often 12 V nominal and may use the body as part of the return. This calculator does not set body resistance to zero. Fuse rating, starter inrush, voltage while cranking, and the vehicle maker’s wire table can all demand a larger conductor than a steady voltage-drop area.',
    ],
  },
  {
    id: 'solar',
    title: 'Solar and Battery Systems',
    body: [
      'A 12 V solar or battery run still follows the same DC drop formula when both conductors are in the cable. Array current, charge-controller limits, fuse or breaker rating, and where the cable is installed are additional constraints. Use the voltage-drop figure as one input to that design, not as the whole design.',
    ],
  },
  {
    id: 'ampacity',
    title: 'Voltage Drop vs. Ampacity',
    body: [
      'Voltage drop asks whether the far end still has enough volts. Ampacity asks whether the conductor and its insulation can carry the current without overheating in that installation. A wire can pass one test and fail the other. No ampacity table is built into this tool, so it never labels a size as safe or code-compliant.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Calculator',
    body: [
      'Leave the voltage at 12 V, or open Advanced settings to enter another value up to 60 V. Set the drop percentage, copper or aluminum, current, one-way distance, and conductor temperature. Switching metres and feet, or Celsius and Fahrenheit, converts the number so the physical length or temperature stays the same. Calculate refreshes the estimate. Reset restores 12 V, 3%, copper, 10 A, 5 m, and 50°C.',
      'The headline area is the voltage-drop minimum. The metric and AWG lines are the smallest listed standard sizes at or above that area, with the drop, load voltage, loop resistance, and heating loss of each. Equivalent solid diameter is √(4A/π) and is not the outside diameter of a jacketed cable.',
    ],
  },
  {
    id: 'mistakes',
    title: 'Common Mistakes',
    body: [
      'Counting only the outgoing wire underestimates drop by about half on a two-wire circuit. Choosing a size from current alone ignores length. Mixing feet and metres, or treating an AWG number as a mm² value, moves the area by a large factor.',
      'Skipping temperature underestimates resistance on a warm conductor. Ignoring the fuse or breaker can leave a wire that meets a 3% drop and still cannot be protected. A chassis return still has resistance.',
    ],
  },
];

export function TwelveVoltWireGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
        <article id="twelve-volt-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...TWELVE_VOLT_FAQS]} />
          </div>
        </article>
      </div>
    </div>
  );
}
