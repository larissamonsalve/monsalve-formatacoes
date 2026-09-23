import { describe, it, expect } from 'vitest';
import { generateOTP, hashOTP, verifyOTP } from '../src/lib/otp';

describe('Módulo de Segurança OTP', () => {
  it('Deve gerar um código numérico de 6 dígitos', () => {
    const otp = generateOTP();
    expect(otp).toHaveLength(6);
    expect(Number(otp)).not.toBeNaN();
  });

  it('Deve gerar um hash criptográfico a partir do OTP', async () => {
    const otp = '123456';
    const hash = await hashOTP(otp);
    expect(hash).not.toBe(otp);
    expect(hash.length).toBeGreaterThan(20);
  });

  it('Deve validar corretamente um OTP contra o hash', async () => {
    const otp = '654321';
    const hash = await hashOTP(otp);
    
    const isValid = await verifyOTP(otp, hash);
    const isInvalid = await verifyOTP('000000', hash);

    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
  });
});