const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ID_LENGTH = 10;

/**
 * Generate a 10-character URL-safe alphanumeric share ID.
 * Uses crypto.getRandomValues() for cryptographic randomness.
 * 62^10 = ~839 quadrillion possibilities — effectively collision-proof.
 */
export function generateShareId(): string {
  const bytes = new Uint8Array(ID_LENGTH);
  crypto.getRandomValues(bytes);
  let id = "";
  for (let i = 0; i < ID_LENGTH; i++) {
    id += CHARS[bytes[i] % CHARS.length];
  }
  return id;
}
