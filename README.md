# 🎓 Monsalve Formatações

<div align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img alt="Mercado Pago" src="https://img.shields.io/badge/Mercado_Pago-00B1EA?style=for-the-badge&logo=mercadopago&logoColor=white">
</div>

<br>

> **Landing Page e Sistema de Vendas para Serviço de Formatação Acadêmica (Normas ABNT).**

Projeto desenvolvido como requisito para a disciplina de **Projeto Integrador** do **Instituto Federal do Amazonas (IFAM) - Campus Parintins**.

---

## 📋 Visão Geral

A **Monsalve Formatações** é uma aplicação web full stack voltada para a comercialização de serviços de consultoria e formatação de trabalhos acadêmicos. O sistema abrange todo o funil de vendas: desde a apresentação do serviço, captação de leads, verificação de segurança (OTP), até o processamento financeiro e notificação de compra aprovada.

## ✨ Funcionalidades (Fluxo de Venda)

O sistema segue rigorosamente o fluxo de 9 etapas:
1. **Landing Page:** Apresentação visual e persuasiva dos pacotes de formatação.
2. **Captação de Lead:** Formulário para captura de Nome, E-mail e WhatsApp.
3. **Verificação de E-mail (OTP):** Envio de código temporário de 6 dígitos para validar o e-mail do cliente.
4. **Checkout Seguro:** Resumo da compra com as informações da formatação.
5. **Integração Mercado Pago:** Pagamento em ambiente seguro (Pix e Cartão de Crédito).
6. **Webhooks:** O backend escuta as atualizações de pagamento via Mercado Pago.
7. **Gestão de Pedido:** Atualização automática do status do pedido no banco de dados para "PAGO".
8. **E-mail de Confirmação:** Disparo automático de e-mail ao cliente com instruções para envio do arquivo `.docx`.

## 🚀 Tecnologias Utilizadas

- **Front-end:** Next.js 14 (App Router), React, Tailwind CSS.
- **Back-end:** Next.js API Routes (Node.js).
- **Linguagem:** TypeScript (Tipagem estática ponta a ponta).
- **Integrações:** Mercado Pago (Checkout e Webhooks), Serviço SMTP (Envio de E-mails).
- **Infraestrutura:** Docker e Docker Compose.
- **Controle de Versão:** Git e GitHub Actions (CI/CD).

## 🛠️ Como executar o projeto localmente

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/) (Versão 18+ recomendada)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (Opcional para ambiente containerizado)

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone [https://github.com/SEU_USUARIO/monsalve-formatacoes.git](https://github.com/SEU_USUARIO/monsalve-formatacoes.git)
cd monsalve-formatacoes