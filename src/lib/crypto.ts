import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // For GCM, standard IV size

function getKey(): Buffer {
  const rawKey = process.env.ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error(
      "ENCRYPTION_KEY environment variable is not set. Generate one with: openssl rand -base64 32",
    );
  }
  // Derive a fixed 32-byte key using SHA-256 so any length passphrase works.
  return crypto.createHash("sha256").update(rawKey).digest();
}

/**
 * Encrypt a plaintext string. Returns `iv:authTag:ciphertext` (base64).
 */
export function encrypt(text: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

/**
 * Decrypt a string produced by `encrypt`. Expects `iv:authTag:ciphertext` (base64).
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted format. Expected iv:authTag:ciphertext");
  }
  const key = getKey();
  const iv = Buffer.from(parts[0], "base64");
  const authTag = Buffer.from(parts[1], "base64");
  const encrypted = Buffer.from(parts[2], "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
