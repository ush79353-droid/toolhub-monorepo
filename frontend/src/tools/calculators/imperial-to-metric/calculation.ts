/** Re-export shared Imperial measurement engine — do not duplicate constants. */
export {
  calculateImperial,
  celsiusToFahrenheit,
  convertImperialField,
  fahrenheitToCelsius,
  formatImperial,
  imperialGallonsToLiters,
  inchesToFeet,
  poundsToKilograms,
  shareResultText,
  usGallonsToLiters,
} from '../imperial/calculation';

export type { ImperialInput, ImperialResult } from '../imperial/types';
