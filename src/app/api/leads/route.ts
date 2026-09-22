// src/app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Desestruturando todos os dados enviados pelo Front-end
    const { 
      nome, email, whatsapp, 
      norma, paginas, prazo, 
      revisao, plagio, ia, 
      valorEstimado, comentarios 
    } = body;

    // Validação de segurança dos campos obrigatórios
    if (!nome || !email || !whatsapp || !norma || !paginas || !prazo || valorEstimado === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes.' },
        { status: 400 }
      );
    }

    // Salva o Lead completo no PostgreSQL
    const lead = await prisma.lead.create({
      data: {
        nome,
        email,
        whatsapp,
        norma,
        paginas: Number(paginas),
        prazo: Number(prazo),
        revisao: Boolean(revisao),
        plagio: Boolean(plagio),
        ia: Boolean(ia),
        valorEstimado: Number(valorEstimado),
        comentarios: comentarios || '',
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}