// src/app/page.tsx
'use client';

import { useState } from 'react';
import styles from './page.module.css'; // Importando os estilos separados

export default function LandingPage() {
  const [formData, setFormData] = useState({ nome: '', email: '', whatsapp: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao cadastrar');
      }
      
      setStatus('success');
      setFormData({ nome: '', email: '', whatsapp: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <main className={styles.mainContainer}>
      
      {/* Seção Principal (Hero) */}
      <section className={styles.heroSection}>
        <h1 className={styles.mainTitle}>
          Sua Formatação ABNT <br className="hidden md:block"/>
          <span className={styles.highlightText}>Sem Estresse e no Prazo</span>
        </h1>
        <p className={styles.subtitle}>
          Cuidamos de todas as normas (margens, citações, sumário) do seu TCC, artigo ou dissertação para você focar apenas no conteúdo.
        </p>

        {/* Caixa do Formulário */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Inicie seu orçamento</h2>
          
          {status === 'success' && (
            <div className={styles.successMessage}>
              ✅ Cadastro realizado com sucesso! Em breve entraremos em contato.
            </div>
          )}

          {status === 'error' && (
            <div className={styles.errorMessage}>
              ❌ Ocorreu um erro ao tentar cadastrar. Tente novamente.
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formGroup}>
            <div>
              <label className={styles.inputLabel}>Nome Completo</label>
              <input
                type="text"
                required
                className={styles.inputField}
                placeholder="Ex: João da Silva"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            
            <div>
              <label className={styles.inputLabel}>E-mail Acadêmico ou Pessoal</label>
              <input
                type="email"
                required
                className={styles.inputField}
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className={styles.inputLabel}>WhatsApp</label>
              <input
                type="tel"
                required
                placeholder="(92) 90000-0000"
                className={styles.inputField}
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className={styles.submitButton}
            >
              {status === 'loading' ? 'Enviando...' : 'Quero Formatar Meu Trabalho'}
            </button>
          </form>
        </div>
      </section>

      {/* Botão Flutuante do WhatsApp */}
      <a
        href="https://wa.me/5592994737897?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20formatação%20ABNT."
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappButton}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
        Fale Conosco
      </a>
    </main>
  );
}