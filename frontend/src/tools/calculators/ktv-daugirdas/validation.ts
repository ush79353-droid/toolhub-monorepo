import {
  buildResult,
  bunToMgDl,
  daugirdasKtv,
  durationToHours,
  urrPercentFromR,
  volumeToLiters,
  weightToKg,
} from './calculation';
import type {
  KtvDaugirdasFieldErrors,
  KtvDaugirdasInput,
  KtvDaugirdasResult,
} from './types';

function parseFinite(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function validateKtvDaugirdasInput(input: KtvDaugirdasInput): {
  errors: KtvDaugirdasFieldErrors;
  result: KtvDaugirdasResult | null;
} {
  const errors: KtvDaugirdasFieldErrors = {};

  const preRaw = parseFinite(input.preBun);
  const postRaw = parseFinite(input.postBun);
  const durRaw = parseFinite(input.duration);
  const ufRaw = parseFinite(input.ultrafiltrate);
  const wRaw = parseFinite(input.postWeight);

  if (input.preBun.trim()) {
    if (preRaw == null || preRaw <= 0) errors.preBun = 'Enter a positive pre-dialysis BUN.';
  }
  if (input.postBun.trim()) {
    if (postRaw == null || postRaw < 0) errors.postBun = 'Enter a non-negative post-dialysis BUN.';
  }
  if (input.duration.trim()) {
    if (durRaw == null || durRaw <= 0) errors.duration = 'Enter a positive duration.';
  }
  if (input.ultrafiltrate.trim()) {
    if (ufRaw == null || ufRaw < 0) errors.ultrafiltrate = 'Enter a non-negative ultrafiltrate volume.';
  }
  if (input.postWeight.trim()) {
    if (wRaw == null || wRaw <= 0) errors.postWeight = 'Enter a positive post-dialysis weight.';
  }

  const incomplete =
    !input.preBun.trim() ||
    !input.postBun.trim() ||
    !input.duration.trim() ||
    !input.ultrafiltrate.trim() ||
    !input.postWeight.trim();

  if (
    incomplete ||
    errors.preBun ||
    errors.postBun ||
    errors.duration ||
    errors.ultrafiltrate ||
    errors.postWeight
  ) {
    return { errors, result: null };
  }

  const pre = bunToMgDl(preRaw!, input.preBunUnit);
  const post = bunToMgDl(postRaw!, input.postBunUnit);
  if (!(pre > 0)) {
    errors.preBun = 'Enter a positive pre-dialysis BUN.';
    return { errors, result: null };
  }

  const r = post / pre;
  if (!(r > 0) || r >= 1) {
    // R can be <1 typically; allow R>=1 as math edge with URR≤0 but still compute if ln ok
  }

  const tHours = durationToHours(durRaw!, input.durationUnit);
  const ufL = volumeToLiters(ufRaw!, input.ultrafiltrateUnit);
  const wKg = weightToKg(wRaw!, input.postWeightUnit);

  const ktv = daugirdasKtv(r, tHours, ufL, wKg);
  if (ktv == null || !Number.isFinite(ktv)) {
    errors.form =
      'Kt/V undefined: require R − 0.008×t > 0 and positive post-dialysis weight.';
    return { errors, result: null };
  }

  return {
    errors,
    result: buildResult(r, ktv, urrPercentFromR(r)),
  };
}
