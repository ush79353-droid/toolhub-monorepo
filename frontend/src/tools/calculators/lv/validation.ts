import { calculateLv, mostellerBsaM2, toCm } from './calculation';
import type { LvFieldErrors, LvInput, LvResult } from './types';

export interface LvValidation {
  isValid: boolean;
  errors: LvFieldErrors;
  result: LvResult | null;
}

function parsePositive(raw: string, label: string): { value?: number; error?: string } {
  const t = raw.trim();
  if (t === '') return {};
  if (!/^\d+(\.\d+)?$/.test(t)) return { error: `${label} must be a positive number.` };
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return { error: `${label} must be greater than 0.` };
  return { value: n };
}

export function validateLvInput(input: LvInput): LvValidation {
  const errors: LvFieldErrors = {};

  let bsa: number | undefined;
  if (input.knowBsa === 'yes') {
    const p = parsePositive(input.bsaM2, 'Body surface area');
    if (p.error) errors.bsaM2 = p.error;
    else bsa = p.value;
  } else {
    const h = parsePositive(input.heightCm, 'Height');
    const w = parsePositive(input.weightKg, 'Weight');
    if (h.error) errors.heightCm = h.error;
    if (w.error) errors.weightKg = w.error;
    if (h.value !== undefined && w.value !== undefined) {
      bsa = mostellerBsaM2(h.value, w.value);
    }
  }

  const lvedd = parsePositive(input.lvedd, 'LVEDD');
  if (lvedd.error) errors.lvedd = lvedd.error;
  const ivsd = parsePositive(input.ivsd, 'IVSd');
  if (ivsd.error) errors.ivsd = ivsd.error;
  const pwd = parsePositive(input.pwd, 'PWd');
  if (pwd.error) errors.pwd = pwd.error;

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    bsa === undefined ||
    lvedd.value === undefined ||
    ivsd.value === undefined ||
    pwd.value === undefined
  ) {
    return { isValid: false, errors, result: null };
  }

  const lveddCm = toCm(lvedd.value, input.dimensionUnit);
  const ivsdCm = toCm(ivsd.value, input.dimensionUnit);
  const pwdCm = toCm(pwd.value, input.dimensionUnit);

  return {
    isValid: true,
    errors,
    result: calculateLv({
      sex: input.sex,
      bsaM2: Math.round(bsa * 1000) / 1000,
      lveddCm,
      ivsdCm,
      pwdCm,
    }),
  };
}
