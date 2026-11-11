import argon2 from 'argon2';

/**
 * Maximum password length to prevent computational exhaustion (DoS attack)
 */
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Hash a plaintext password using Argon2id with memory-hard parameters.
 */
export async function hashPassword(password: string): Promise<string> {
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(
      `Password length exceeds maximum allowed limit of ${MAX_PASSWORD_LENGTH} characters.`
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3, // 3 iterations
    parallelism: 1,
  });
}

/**
 * Verifies a plaintext password against an Argon2id hash.
 * Always returns false if the hash is malformed or invalid to prevent timing attacks.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash || password.length > MAX_PASSWORD_LENGTH) {
    return false;
  }

  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
