import {
  bsaToM2,
  buildCardiacOutputResult,
  contentToMlPerL,
  deriveDisplayPatches,
  estimateVo2MlPerMin,
  heightToCm,
  hemoglobinToGPerDl,
  mostellerBsaM2,
  oxygenContentMlPerL,
  tensionToTorr,
  vo2ToMlPerMin,
  weightToKg,
} from './calculation';
import type {
  CardiacOutputFieldErrors,
  CardiacOutputInput,
  CardiacOutputResult,
} from './types';

export interface CardiacOutputValidation {
  isValid: boolean;
  errors: CardiacOutputFieldErrors;
  result: CardiacOutputResult | null;
  /** Suggested derived field display values (when not manual). */
  derived: Partial<CardiacOutputInput>;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function parseSaturation(
  raw: string,
  errors: CardiacOutputFieldErrors,
  key: keyof CardiacOutputFieldErrors
): number | null {
  const parsed = parseNumber(raw);
  if (parsed.blank) return null;
  if (parsed.invalid || parsed.value == null) {
    errors[key] = 'Enter a valid saturation percentage.';
    return null;
  }
  if (parsed.value < 0 || parsed.value > 100) {
    errors[key] = 'Saturation must be between 0% and 100%.';
    return null;
  }
  return parsed.value;
}

/**
 * Results require VO₂ and a positive arteriovenous O₂ content difference,
 * plus BSA for cardiac index. Height/weight optional when BSA is manual.
 */
export function validateCardiacOutputInput(
  input: CardiacOutputInput
): CardiacOutputValidation {
  const errors: CardiacOutputFieldErrors = {};

  const heightParsed = parseNumber(input.heightValue);
  const weightParsed = parseNumber(input.weightValue);
  const bsaParsed = parseNumber(input.bsaValue);
  const vo2Parsed = parseNumber(input.vo2Value);
  const hbParsed = parseNumber(input.hemoglobinValue);
  const artTensionParsed = parseNumber(input.arterialTension);
  const venTensionParsed = parseNumber(input.venousTension);
  const artContentParsed = parseNumber(input.arterialContent);
  const venContentParsed = parseNumber(input.venousContent);

  let heightCm: number | null = null;
  if (!heightParsed.blank) {
    if (heightParsed.invalid || heightParsed.value == null) {
      errors.heightValue = 'Enter a valid height.';
    } else {
      heightCm = heightToCm(heightParsed.value, input.heightUnit);
      if (heightCm == null) errors.heightValue = 'Height must be positive.';
    }
  }

  let weightKg: number | null = null;
  if (!weightParsed.blank) {
    if (weightParsed.invalid || weightParsed.value == null) {
      errors.weightValue = 'Enter a valid weight.';
    } else {
      weightKg = weightToKg(weightParsed.value, input.weightUnit);
      if (weightKg == null) errors.weightValue = 'Weight must be positive.';
    }
  }

  let bsaM2: number | null = null;
  if (input.bsaManual) {
    if (bsaParsed.blank) {
      // wait for entry
    } else if (bsaParsed.invalid || bsaParsed.value == null) {
      errors.bsaValue = 'Enter a valid body surface area.';
    } else {
      bsaM2 = bsaToM2(bsaParsed.value, input.bsaUnit);
      if (bsaM2 == null) errors.bsaValue = 'Body surface area must be positive.';
    }
  } else if (heightCm != null && weightKg != null) {
    bsaM2 = mostellerBsaM2(heightCm, weightKg);
  }

  let vo2MlPerMin: number | null = null;
  let vo2Estimated = false;
  if (input.vo2Manual) {
    if (vo2Parsed.blank) {
      // incomplete
    } else if (vo2Parsed.invalid || vo2Parsed.value == null) {
      errors.vo2Value = 'Enter a valid O₂ consumption.';
    } else {
      vo2MlPerMin = vo2ToMlPerMin(vo2Parsed.value, input.vo2Unit);
      if (vo2MlPerMin == null) {
        errors.vo2Value = 'O₂ consumption must be positive.';
      }
    }
  } else if (bsaM2 != null) {
    vo2MlPerMin = estimateVo2MlPerMin(bsaM2);
    vo2Estimated = true;
  }

  let hbGPerDl: number | null = null;
  if (!hbParsed.blank) {
    if (hbParsed.invalid || hbParsed.value == null) {
      errors.hemoglobinValue = 'Enter a valid hemoglobin.';
    } else {
      hbGPerDl = hemoglobinToGPerDl(hbParsed.value, input.hemoglobinUnit);
      if (hbGPerDl == null) {
        errors.hemoglobinValue = 'Hemoglobin must be positive.';
      }
    }
  }

  const artSat = parseSaturation(
    input.arterialSaturation,
    errors,
    'arterialSaturation'
  );
  const venSat = parseSaturation(
    input.venousSaturation,
    errors,
    'venousSaturation'
  );

  let artTorr: number | null = null;
  if (!artTensionParsed.blank) {
    if (artTensionParsed.invalid || artTensionParsed.value == null) {
      errors.arterialTension = 'Enter a valid oxygen tension.';
    } else {
      artTorr = tensionToTorr(
        artTensionParsed.value,
        input.arterialTensionUnit
      );
      if (artTorr == null) {
        errors.arterialTension = 'Oxygen tension cannot be negative.';
      }
    }
  } else if (
    !input.arterialContentManual &&
    hbGPerDl != null &&
    artSat != null
  ) {
    // Dissolved term needs tension for derived content; treat missing as 0 Torr.
    artTorr = 0;
  }

  let venTorr: number | null = null;
  if (!venTensionParsed.blank) {
    if (venTensionParsed.invalid || venTensionParsed.value == null) {
      errors.venousTension = 'Enter a valid oxygen tension.';
    } else {
      venTorr = tensionToTorr(venTensionParsed.value, input.venousTensionUnit);
      if (venTorr == null) {
        errors.venousTension = 'Oxygen tension cannot be negative.';
      }
    }
  } else if (
    !input.venousContentManual &&
    hbGPerDl != null &&
    venSat != null
  ) {
    venTorr = 0;
  }

  let arterialContentMlPerL: number | null = null;
  if (input.arterialContentManual) {
    if (artContentParsed.blank) {
      // incomplete
    } else if (artContentParsed.invalid || artContentParsed.value == null) {
      errors.arterialContent = 'Enter a valid oxygen concentration.';
    } else {
      arterialContentMlPerL = contentToMlPerL(
        artContentParsed.value,
        input.arterialContentUnit
      );
      if (arterialContentMlPerL == null) {
        errors.arterialContent = 'Oxygen concentration cannot be negative.';
      }
    }
  } else if (hbGPerDl != null && artSat != null && artTorr != null) {
    arterialContentMlPerL = oxygenContentMlPerL(hbGPerDl, artSat, artTorr);
  }

  let venousContentMlPerL: number | null = null;
  if (input.venousContentManual) {
    if (venContentParsed.blank) {
      // incomplete
    } else if (venContentParsed.invalid || venContentParsed.value == null) {
      errors.venousContent = 'Enter a valid oxygen concentration.';
    } else {
      venousContentMlPerL = contentToMlPerL(
        venContentParsed.value,
        input.venousContentUnit
      );
      if (venousContentMlPerL == null) {
        errors.venousContent = 'Oxygen concentration cannot be negative.';
      }
    }
  } else if (hbGPerDl != null && venSat != null && venTorr != null) {
    venousContentMlPerL = oxygenContentMlPerL(hbGPerDl, venSat, venTorr);
  }

  const derivedPatches = deriveDisplayPatches(input, {
    heightCm,
    weightKg,
    bsaM2,
    hbGPerDl,
    artSat,
    artTorr,
    venSat,
    venTorr,
  });

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null, derived: derivedPatches };
  }

  if (
    vo2MlPerMin == null ||
    arterialContentMlPerL == null ||
    venousContentMlPerL == null ||
    bsaM2 == null
  ) {
    return { isValid: false, errors, result: null, derived: derivedPatches };
  }

  if (!(arterialContentMlPerL > venousContentMlPerL)) {
    errors.form =
      'Arterial oxygen content must be greater than venous content (positive AV difference required).';
    return { isValid: false, errors, result: null, derived: derivedPatches };
  }

  const result = buildCardiacOutputResult({
    bsaM2,
    vo2MlPerMin,
    vo2Estimated,
    arterialContentMlPerL,
    venousContentMlPerL,
    coUnit: input.coUnit,
  });

  if (!result) {
    errors.form = 'Unable to compute cardiac output from the entered values.';
    return { isValid: false, errors, result: null, derived: derivedPatches };
  }

  return { isValid: true, errors, result, derived: derivedPatches };
}
