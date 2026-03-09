import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHash,
} from "crypto";

const ALGORITHM = "aes-256-cbc";
// On récupère la clé brute du .env
const RAW_KEY =
  process.env.ENCRYPTION_KEY || "fallback-secret-key-32-chars-min";

// SÉCURITÉ : On crée un hash SHA-256 de la clé pour garantir
// qu'on a TOUJOURS exactement 32 octets, peu importe la chaîne dans le .env
const ENCRYPTION_KEY = createHash("sha256").update(RAW_KEY).digest();

export function encrypt(text: string) {
  const iv = randomBytes(16);
  // On utilise directement le Buffer ENCRYPTION_KEY ici
  const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

export function decrypt(encryptedText: string, iv: string) {
  const decipher = createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(iv, "hex"),
  );

  let decrypted = decipher.update(Buffer.from(encryptedText, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}
