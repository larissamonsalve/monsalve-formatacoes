'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

function AcessoContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estado para o cronômetro de reenvio
  const [timer, setTimer] = useState(0);

  // Efeito que preenche o e-mail vindo da URL
  useEffect(() => {
    const emailDaUrl = searchParams.get('email');
    if (emailDaUrl) {
      setEmail(emailDaUrl);
    }
  }, [searchParams]);

  // Efeito do cronômetro (1 segundo por vez)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Falha ao enviar o código. Tente novamente.');
      
      setStatus('idle');
      setStep(2); 
      setTimer(60); // Inicia a contagem de 60 segundos
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Código inválido ou expirado.');
      
      setStatus('idle');
      setStep(3); 
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className={styles.container}>
      {/* Elementos Decorativos de Fundo */}
      <div className={styles.bgGradient}></div>
      <div className={styles.blurTop}></div>
      <div className={styles.blurBottom}></div>

      <Link href="/" className={styles.logoLink}>
        <Image 
          src="/logo2.jpg" 
          alt="Monsalve Formatações" 
          width={80} 
          height={80} 
          className={styles.logoImage} 
          priority
        />
      </Link>

      <div className={styles.card}>
        
        {/* ETAPA 1: SOLICITAR CÓDIGO */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className={styles.formFadeIn}>
            <div className={styles.headerText}>
              <h1 className={styles.title}>Validação de E-mail</h1>
              <p className={styles.subtitle}>Confirme ou introduza o seu e-mail para receber o código de validação.</p>
            </div>

            <div>
              <label className={styles.label}>E-mail Acadêmico ou Pessoal</label>
              <input 
                type="email" 
                required 
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputEmail}
              />
            </div>

            {status === 'error' && <p className={styles.errorText}>{errorMessage}</p>}

            <button type="submit" disabled={status === 'loading'} className={styles.btnPrimary}>
              {status === 'loading' ? 'A enviar...' : 'Enviar Código'}
            </button>
          </form>
        )}

        {/* ETAPA 2: DIGITAR O CÓDIGO */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className={styles.formFadeIn}>
            <div className={styles.headerText}>
              <h1 className={styles.title}>Validação de E-mail</h1>
              <p className={styles.subtitle}>Enviámos um código de 6 dígitos para <br/><strong className={styles.textPurple}>{email}</strong></p>
            </div>

            <div>
              <label className={styles.labelCenter}>Código de Segurança</label>
              <input 
                type="text" 
                required 
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className={styles.inputOtp}
              />
            </div>

            {status === 'error' && <p className={styles.errorText}>{errorMessage}</p>}

            <button type="submit" disabled={status === 'loading' || otp.length < 6} className={styles.btnSecondary}>
              {status === 'loading' ? 'Verificando...' : 'Validar'}
            </button>
            
            {/* LÓGICA VISUAL DO CRONÓMETRO E REENVIO */}
            <div className={styles.timerContainer}>
              {timer > 0 ? (
                <p className={styles.timerText}>
                  Não recebeu? Aguarde <strong className={styles.textPurple}>{timer}s</strong>
                </p>
              ) : (
                <button 
                  type="button" 
                  onClick={() => handleSendOtp()} 
                  className={styles.resendButton}
                >
                  Reenviar código agora
                </button>
              )}
              
              <button type="button" onClick={() => setStep(1)} className={styles.btnText}>
                Usar outro e-mail
              </button>
            </div>
          </form>
        )}

        {/* ETAPA 3: SUCESSO */}
        {step === 3 && (
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.title}>E-mail Validado!</h1>
            <p className={styles.successText}>A sua identidade foi confirmada com sucesso. O seu e-mail é válido.</p>
            <Link href="/" className={styles.btnOutline}>
              Voltar ao Início
            </Link>
          </div>
        )}
      </div>
      
      <p className={styles.footerText}>
        © 2026 Monsalve Formatações. Validação de e-mail.
      </p>
    </div>
  );
}

// O componente principal exportado envolve o formulário em Suspense
export default function AcessoCliente() {
  return (
    <Suspense fallback={
      <div className={styles.loadingScreen}>
        Carregando...
      </div>
    }>
      <AcessoContent />
    </Suspense>
  );
}