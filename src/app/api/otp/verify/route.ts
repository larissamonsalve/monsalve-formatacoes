import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyOTP } from '@/lib/otp';

const prisma = new PrismaClient();
const MAX_ATTEMPTS = 3;

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    const record = await prisma.otpVerification.findUnique({ where: { email } });
    if (!record) return NextResponse.json({ error: 'Nenhum código encontrado' }, { status: 404 });

    // Regra: Limite de tentativas
    if (record.attempts >= MAX_ATTEMPTS) {
      await prisma.otpVerification.delete({ where: { email } });
      return NextResponse.json({ error: 'Limite de tentativas excedido. Solicite novo código.' }, { status: 429 });
    }

    // Regra: Expiração
    if (new Date() > record.expiresAt) {
      await prisma.otpVerification.delete({ where: { email } });
      return NextResponse.json({ error: 'Código expirado. Solicite novamente.' }, { status: 401 });
    }

    // Regra: Hash (Validação Criptográfica)
    const isValid = await verifyOTP(otp, record.otpHash);
    
    if (!isValid) {
      await prisma.otpVerification.update({
        where: { email },
        data: { attempts: record.attempts + 1 },
      });
      return NextResponse.json({ error: 'Código inválido' }, { status: 401 });
    }

    // Sucesso: Validação do e-mail confirmada, limpa o registo de segurança
    await prisma.otpVerification.delete({ where: { email } });

    // Aqui você atualizaria o status do Lead/Usuário para "emailVerified: true"
    return NextResponse.json({ message: 'E-mail validado com sucesso' });

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}