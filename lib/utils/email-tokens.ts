import { createHmac, timingSafeEqual } from "crypto";

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) throw new Error("UNSUBSCRIBE_SECRET is not set");
  return secret;
}

export function generateEmailToken(email: string): string {
  return createHmac("sha256", getSecret()).update(email).digest("hex");
}

export function verifyEmailToken(email: string, token: string): boolean {
  const expected = generateEmailToken(email);
  const expectedBuf = Buffer.from(expected, "hex");
  const tokenBuf = Buffer.from(token, "hex");
  return (
    expectedBuf.length === tokenBuf.length &&
    timingSafeEqual(expectedBuf, tokenBuf)
  );
}
