/** Re-export shared Imperial measurement types — same engine, distinct catalog tool. */
export type {
  ImperialCategory,
  ImperialFieldDef,
  ImperialFieldErrors,
  ImperialInput,
  ImperialResult,
  ImperialSection,
} from '../imperial/types';

export {
  AREA_FIELDS,
  IMPERIAL_CATEGORIES,
  LENGTH_FIELDS,
  MASS_FIELDS,
  TEMPERATURE_FIELDS,
  VOLUME_FIELDS,
  fieldsForCategory,
  sectionTitle,
} from '../imperial/types';
