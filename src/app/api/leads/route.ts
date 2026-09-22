// src/app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, whatsapp } = body;

    // Validação de segurança básica
    if (!nome || !email || !whatsapp) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    // Salva o Lead no banco de dados do Docker
    const lead = await prisma.lead.create({
      data: {
        nome,
        email,
        whatsapp,
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor ao tentar salvar o lead.' },
      { status: 500 }
    );
  }
}