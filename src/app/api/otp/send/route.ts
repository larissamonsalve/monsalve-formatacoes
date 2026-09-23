import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateOTP, hashOTP } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/mail';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'E-mail obrigatório' }, { status: 400 });

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    
    // Expiração: 10 minutos a partir de agora
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Lógica de Reenvio: O 'upsert' cria um novo ou atualiza se já existir, zerando as tentativas
    await prisma.otpVerification.upsert({
      where: { email },
      update: { otpHash, expiresAt, attempts: 0 },
      create: { email, otpHash, expiresAt },
    });

    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: 'Código OTP enviado com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar envio' }, { status: 500 });
  }
}