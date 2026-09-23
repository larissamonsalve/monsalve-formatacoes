import bcrypt from 'bcrypt';
import crypto from 'crypto';

export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function hashOTP(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
}

export async function verifyOTP(otp: string, hashedOTP: string): Promise<boolean> {
  return bcrypt.compare(otp, hashedOTP);
}