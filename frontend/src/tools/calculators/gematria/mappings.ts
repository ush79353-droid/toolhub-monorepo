/** Simple ordinal A=1 … Z=26. */
export const SIMPLE_GEMATRIA: Readonly<Record<string, number>> = Object.freeze(
  Object.fromEntries(
    Array.from({ length: 26 }, (_, index) => {
      const letter = String.fromCharCode(65 + index);
      return [letter, index + 1] as const;
    })
  )
);

/** English gematria = simple × 6 (A=6 … Z=156). */
export const ENGLISH_GEMATRIA: Readonly<Record<string, number>> = Object.freeze(
  Object.fromEntries(
    Object.entries(SIMPLE_GEMATRIA).map(([letter, value]) => [letter, value * 6])
  )
);

/**
 * English-letter “Jewish” convention used by some English-language calculators.
 * Not the traditional Hebrew alphabet mapping.
 */
export const JEWISH_ENGLISH_GEMATRIA: Readonly<Record<string, number>> = Object.freeze({
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 600,
  K: 10,
  L: 20,
  M: 30,
  N: 40,
  O: 50,
  P: 60,
  Q: 70,
  R: 80,
  S: 90,
  T: 100,
  U: 200,
  V: 700,
  W: 900,
  X: 300,
  Y: 400,
  Z: 500,
});

/** Mispar Hechrechi — standard Hebrew letter values (including final forms). */
export const HEBREW_STANDARD_GEMATRIA: Readonly<Record<string, number>> = Object.freeze({
  א: 1,
  ב: 2,
  ג: 3,
  ד: 4,
  ה: 5,
  ו: 6,
  ז: 7,
  ח: 8,
  ט: 9,
  י: 10,
  כ: 20,
  ך: 20,
  ל: 30,
  מ: 40,
  ם: 40,
  נ: 50,
  ן: 50,
  ס: 60,
  ע: 70,
  פ: 80,
  ף: 80,
  צ: 90,
  ץ: 90,
  ק: 100,
  ר: 200,
  ש: 300,
  ת: 400,
});
