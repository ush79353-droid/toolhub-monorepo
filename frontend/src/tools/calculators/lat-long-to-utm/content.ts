import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  EXAMPLE_LONDON,
  EXAMPLE_NYC,
  EXAMPLE_SYDNEY,
  formatDd,
  formatUtmMeters,
  getUtmCentralMeridian,
  latLongToUTM,
} from './calculation';

export const LAT_LONG_TO_UTM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-utm', label: 'What Is UTM?' },
  { id: 'utm-zones', label: 'UTM Zones Explained' },
  { id: 'easting-northing', label: 'Easting and Northing' },
  { id: 'latitude-bands', label: 'Latitude Band Letters' },
  { id: 'how-to-convert', label: 'How to Convert' },
  { id: 'worked-example', label: 'Worked Example' },
  { id: 'accuracy', label: 'Understanding Accuracy' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'lat-long-to-utm-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
  tableNote?: string;
}

const nyc = latLongToUTM(EXAMPLE_NYC.latitude, EXAMPLE_NYC.longitude);
const london = latLongToUTM(EXAMPLE_LONDON.latitude, EXAMPLE_LONDON.longitude);
const sydney = latLongToUTM(EXAMPLE_SYDNEY.latitude, EXAMPLE_SYDNEY.longitude);

export const LAT_LONG_TO_UTM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'Latitude and longitude locate a point on Earth as angular geographic coordinates. UTM (Universal Transverse Mercator) expresses that same position as projected meters within a numbered zone.',
      'This converter takes WGS84 GPS coordinates in Decimal Degrees or Degrees, Minutes, Seconds and computes the matching UTM zone, hemisphere, easting, and northing. It does not reverse-edit UTM into latitude and longitude in the main form.',
      'WGS84 is the global geodetic datum commonly used with GPS. The projection uses an ellipsoidal Transverse Mercator definition for the selected zone—not a simple degrees-to-meters approximation.',
    ],
  },
  {
    id: 'what-is-utm',
    title: 'What Is Universal Transverse Mercator (UTM)?',
    paragraphs: [
      'UTM divides most of the Earth into 60 longitudinal zones. Each ordinary zone spans 6° of longitude and uses a Transverse Mercator projection centered on that zone’s central meridian.',
      'Easting and northing are measured in meters. Northern and southern hemispheres use different false-northing conventions so that northing stays positive in common practice.',
      'Standard UTM coverage runs from 80° South to 84° North. Locations nearer the poles generally use another system such as UPS (Universal Polar Stereographic) instead of standard UTM.',
    ],
    formula: 'Coverage: 80°S ≤ latitude ≤ 84°N',
  },
  {
    id: 'utm-zones',
    title: 'UTM Zones Explained',
    paragraphs: [
      'Zones are numbered 1 through 60 from west to east. For ordinary longitudes the zone is floor((longitude + 180) / 6) + 1, with longitude +180° treated as zone 60 rather than 61.',
      'The central meridian of a zone is 6 × zone − 183. For example, zone 18 has central meridian −75°.',
      'Norway and Svalbard use special longitudinal exceptions. Between roughly 56°N and 64°N and 3°E–12°E, zone 32 is used. In Svalbard (about 72°N–84°N), selected longitudes map to zones 31, 33, 35, or 37 instead of the ordinary six-degree grid.',
    ],
    formula: 'zone = floor((longitude + 180) / 6) + 1   (then apply Norway / Svalbard rules)',
  },
  {
    id: 'easting-northing',
    title: 'Easting and Northing',
    paragraphs: [
      'Easting is the projected east–west coordinate in meters relative to the zone’s false easting of 500,000 m on the central meridian.',
      'Northing is the projected north–south coordinate in meters. In the northern hemisphere the false northing is 0 m; in the southern hemisphere it is 10,000,000 m so that northing remains positive south of the equator.',
      'Hemisphere (N or S) comes from the latitude sign (equator uses northern convention). Do not infer hemisphere from northing alone when reading UTM values.',
    ],
    formula: 'False easting = 500,000 m · False northing = 0 m (N) or 10,000,000 m (S)',
  },
  {
    id: 'latitude-bands',
    title: 'Latitude Band Letters',
    paragraphs: [
      'Some maps and the Military Grid Reference System (MGRS) also use latitude-band letters: C D E F G H J K L M N P Q R S T U V W X (I and O are skipped). Most bands span 8° of latitude; band X is wider.',
      'A label such as 18N in this calculator means zone 18 in the northern hemisphere for EPSG/UTM purposes. That is not the same as an MGRS grid-zone designator that pairs a zone number with a latitude-band letter.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Latitude and Longitude to UTM',
    paragraphs: [
      'Obtain WGS84 latitude and longitude. If you have DMS, convert to signed Decimal Degrees (degrees + minutes/60 + seconds/3600, then apply N/S or E/W to the full magnitude).',
      'Validate ranges (−90…90 for latitude, −180…180 for longitude) and UTM coverage. Determine the zone (including Norway/Svalbard rules), identify the hemisphere, select the matching EPSG UTM CRS, and apply the ellipsoidal Transverse Mercator transform to read easting and northing.',
    ],
    formula: 'DD = ±(Degrees + Minutes/60 + Seconds/3600)',
  },
  {
    id: 'worked-example',
    title: 'Worked Conversion Example (New York)',
    paragraphs: [
      `Using latitude ${formatDd(EXAMPLE_NYC.latitude)}° and longitude ${formatDd(EXAMPLE_NYC.longitude)}°, the converter selects UTM zone ${nyc.zone} North (${nyc.epsg}).`,
      `Projected results from the WGS84 UTM engine: easting ${formatUtmMeters(nyc.easting)} m, northing ${formatUtmMeters(nyc.northing)} m. Central meridian for zone ${nyc.zone} is ${getUtmCentralMeridian(nyc.zone)}°.`,
      'Displayed decimals are for readability; the calculation keeps full internal precision from the projection library.',
    ],
    table: [
      {
        left: `${formatDd(EXAMPLE_NYC.latitude)}, ${formatDd(EXAMPLE_NYC.longitude)}`,
        right: `${nyc.zone}${nyc.hemisphere}`,
        third: `${formatUtmMeters(nyc.easting)} / ${formatUtmMeters(nyc.northing)}`,
      },
      {
        left: `${formatDd(EXAMPLE_LONDON.latitude)}, ${formatDd(EXAMPLE_LONDON.longitude)}`,
        right: `${london.zone}${london.hemisphere}`,
        third: `${formatUtmMeters(london.easting)} / ${formatUtmMeters(london.northing)}`,
      },
      {
        left: `${formatDd(EXAMPLE_SYDNEY.latitude)}, ${formatDd(EXAMPLE_SYDNEY.longitude)}`,
        right: `${sydney.zone}${sydney.hemisphere}`,
        third: `${formatUtmMeters(sydney.easting)} / ${formatUtmMeters(sydney.northing)}`,
      },
    ],
    tableHeaders: ['Lat, Lon (°)', 'Zone', 'Easting / Northing (m)'],
    tableNote: 'Values computed with proj4 WGS84 UTM for this page’s examples.',
  },
  {
    id: 'accuracy',
    title: 'Understanding UTM Accuracy',
    paragraphs: [
      'Projection mathematics on WGS84 can be very precise for a given input. That is not the same as the accuracy of the original GPS observation, which depends on the receiver, conditions, and datum realization.',
      'Rounding for display (for example three decimal places in meters) does not create survey-grade certainty. Near zone boundaries, small longitude changes can change the selected zone; always confirm the intended CRS for engineering work.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'UTM coordinates are widely used in surveying, cartography, GIS, construction layout, civil engineering, land mapping, environmental fieldwork, and any workflow that prefers local metric distances over angular geographic coordinates.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Calculator',
    paragraphs: [
      'Select Decimal Degrees or Degrees, Minutes, Seconds. Enter latitude and longitude (and hemispheres in DMS mode). Review the calculated zone, easting, and northing. Copy or share the result, or reload/clear to start over.',
    ],
  },
];

export const LAT_LONG_TO_UTM_FAQS: readonly FAQItem[] = [
  {
    question: 'What does UTM stand for?',
    answer: 'UTM stands for Universal Transverse Mercator.',
  },
  {
    question: 'What is the difference between latitude/longitude and UTM?',
    answer:
      'Latitude and longitude are geographic angular coordinates. UTM expresses the same location as projected coordinates in meters within a numbered zone.',
  },
  {
    question: 'How many UTM zones are there?',
    answer: 'There are 60 longitudinal UTM zones numbered 1 through 60.',
  },
  {
    question: 'How wide is a UTM zone?',
    answer:
      'Most UTM zones span 6° of longitude. Norway and Svalbard use special longitudinal exceptions.',
  },
  {
    question: 'What is UTM easting?',
    answer:
      'Easting is the projected east–west coordinate in meters, referenced to a 500,000 m false easting on the zone’s central meridian.',
  },
  {
    question: 'What is UTM northing?',
    answer:
      'Northing is the projected north–south coordinate in meters. The southern hemisphere uses a 10,000,000 m false northing.',
  },
  {
    question: 'What is the UTM zone for New York City?',
    answer: `Central New York City is in UTM Zone ${nyc.zone} North (${nyc.epsg}).`,
  },
  {
    question: 'What is the UTM zone for London?',
    answer: `Central London is in UTM Zone ${london.zone} North (${london.epsg}).`,
  },
  {
    question: 'What is the UTM zone for Sydney?',
    answer: `Central Sydney is in UTM Zone ${sydney.zone} South (${sydney.epsg}).`,
  },
  {
    question: 'Can negative latitude be converted to UTM?',
    answer:
      'Yes. Negative latitude is south of the equator and uses southern-hemisphere UTM conventions.',
  },
  {
    question: 'Can negative longitude be converted to UTM?',
    answer:
      'Yes. Negative longitude is west of the prime meridian and still maps into zones 1–60.',
  },
  {
    question: 'Does UTM use meters?',
    answer: 'Yes. Standard UTM easting and northing are expressed in meters.',
  },
  {
    question: 'What is WGS84?',
    answer:
      'WGS84 is a global geodetic reference system commonly used with GPS latitude and longitude.',
  },
  {
    question: 'What is the difference between UTM and MGRS?',
    answer:
      'UTM provides projected meter coordinates within a zone and hemisphere. MGRS builds a grid-based location notation on UTM (and UPS) that includes latitude-band letters.',
  },
  {
    question: 'What happens near the North or South Pole?',
    answer:
      'Standard UTM ends at 84°N and 80°S. Polar regions typically use the UPS system instead.',
  },
  {
    question: 'Can I use DMS coordinates in this converter?',
    answer:
      'Yes. DMS inputs are converted to signed Decimal Degrees before the UTM projection runs.',
  },
  {
    question: 'Does converting to UTM change my geographic location?',
    answer:
      'No. It changes the coordinate representation and projection, not the underlying place on Earth.',
  },
];
