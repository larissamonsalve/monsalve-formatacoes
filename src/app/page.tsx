// src/app/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import styles from './page.module.css';

export default function LandingPage() {
  const [step, setStep] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '', email: '', whatsapp: '',
    norma: 'ABNT', paginas: 10,
    prazo: 2, revisao: false, plagio: false, ia: false, comentarios: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Controle do Header no Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const total = useMemo(() => {
    let precoPorPagina = Number(formData.prazo);
    if (formData.revisao) precoPorPagina += 2;
    if (formData.plagio) precoPorPagina += 1;
    if (formData.ia) precoPorPagina += 2;
    return formData.paginas * precoPorPagina;
  }, [formData.prazo, formData.revisao, formData.plagio, formData.ia, formData.paginas]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, valorEstimado: total }),
      });
      if (!response.ok) throw new Error('Falha ao cadastrar');
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.mainContainer}>
      
      {/* Header Dinâmico */}
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : styles.headerTop}`}>
        <div className={styles.headerContent}>
          <div className={styles.logoArea} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className={styles.logoIcon}>F</div>
            SimpleFormat ABNT
          </div>
          <nav className={styles.navLinks}>
            <span className={styles.navLink} onClick={() => scrollToSection('servicos')}>Serviços</span>
            <span className={styles.navLink} onClick={() => scrollToSection('como-funciona')}>Como Funciona</span>
            <span className={styles.navLink} onClick={() => scrollToSection('depoimentos')}>Depoimentos</span>
          </nav>
          <button onClick={() => scrollToSection('orcamento')} className={styles.headerBtn}>
            Solicitar Orçamento
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        
        {/* Coluna da Esquerda (Entra primeiro) */}
        <div className={`lg:pr-8 ${styles.animateUp}`}>
          <span className={styles.heroTag}>✨ Mais de 15.000 TCCs Aprovados</span>
          <h1 className={styles.mainTitle}>
            Aprovação sem estresse. Seu trabalho na formatação ideal.
          </h1>
          <p className={styles.subtitle}>
            Economize semanas de esforço e garanta nota máxima na banca. Formatamos seu TCC, artigo ou dissertação seguindo estritamente todas as normas ABNT vigentes.
          </p>
          <button onClick={() => scrollToSection('orcamento')} className={styles.heroBtn}>
            Fazer Orçamento 
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        {/* Coluna da Direita (Entra com leve atraso) */}
        <div id="orcamento" className={`${styles.wizardCard} ${styles.animateUp} ${styles.delay1}`}>
          <div className={styles.wizardHeader}>
            <span className={`${styles.stepIndicator} ${step >= 1 ? styles.stepIndicatorActive : styles.stepIndicatorInactive}`}>1. Documento</span>
            <span className={`${styles.stepIndicator} ${step >= 2 ? styles.stepIndicatorActive : styles.stepIndicatorInactive}`}>2. Serviços</span>
            <span className={`${styles.stepIndicator} ${step >= 3 ? styles.stepIndicatorActive : styles.stepIndicatorInactive}`}>3. Dados</span>
          </div>

          {status === 'success' ? (
            <div className={`text-center py-8 ${styles.animateUp}`}>
              <div className="w-20 h-20 bg-[#F3EBFF] text-[#5B3196] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
              <h2 className="text-2xl font-bold text-[#2D1B4E] mb-3">Pedido Registrado!</h2>
              <p className="text-slate-600 text-sm max-w-sm mx-auto">Em breve um especialista chamará você no WhatsApp para confirmar os dados e iniciar a formatação.</p>
            </div>
          ) : (
            <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
              {/* PASSO 1 */}
              {step === 1 && (
                <div className={`${styles.formGroup} ${styles.animateUp}`}>
                  <div>
                    <label className={styles.inputLabel}>Norma Desejada</label>
                    <select className={styles.inputField} value={formData.norma} onChange={(e) => setFormData({...formData, norma: e.target.value})}>
                      <option value="ABNT">ABNT</option>
                      <option value="APA">APA</option>
                      <option value="Vancouver">Vancouver</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.inputLabel}>Quantidade de Páginas (Estimada)</label>
                    <input type="number" min="1" required className={styles.inputField} value={formData.paginas} onChange={(e) => setFormData({...formData, paginas: Number(e.target.value)})} />
                  </div>
                </div>
              )}

              {/* PASSO 2 */}
              {step === 2 && (
                <div className={`${styles.formGroup} ${styles.animateUp}`}>
                  <label className={styles.inputLabel}>Prazo de Entrega (Preço base por pág.)</label>
                  <div className={styles.radioGrid}>
                    {[
                      { label: '72 horas', preco: 2 },
                      { label: '48 horas', preco: 3 },
                      { label: '24 horas', preco: 4 },
                      { label: '12 horas', preco: 6 },
                    ].map((opcao) => (
                      <label key={opcao.preco} className={styles.radioOption}>
                        <input type="radio" name="prazo" className={styles.radioInput} value={opcao.preco} checked={formData.prazo == opcao.preco} onChange={(e) => setFormData({...formData, prazo: Number(e.target.value)})} />
                        <span className="font-medium text-slate-700 text-sm">{opcao.label} <span className="text-[#D4AF37] font-bold block md:inline">(R$ {opcao.preco})</span></span>
                      </label>
                    ))}
                  </div>
                  <label className="block text-sm font-bold text-[#2D1B4E] mt-2 mb-1">Serviços Extras</label>
                  <div className="flex flex-col gap-2">
                    <label className={styles.radioOption}>
                      <input type="checkbox" className={styles.radioInput} checked={formData.revisao} onChange={(e) => setFormData({...formData, revisao: e.target.checked})} />
                      <span className="text-slate-700 text-sm">Revisão Ortográfica <span className="text-[#D4AF37] font-bold">(+ R$ 2/pág)</span></span>
                    </label>
                  </div>
                </div>
              )}

              {/* PASSO 3 */}
              {step === 3 && (
                <div className={`${styles.formGroup} ${styles.animateUp}`}>
                  <div>
                    <label className={styles.inputLabel}>Nome Completo</label>
                    <input type="text" required className={styles.inputField} placeholder="Ex: Mariana Silva" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
                  </div>
                  <div>
                    <label className={styles.inputLabel}>E-mail Acadêmico</label>
                    <input type="email" required className={styles.inputField} placeholder="mariana@universidade.edu.br" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className={styles.inputLabel}>WhatsApp</label>
                    <input type="tel" required className={styles.inputField} placeholder="(11) 98765-4321" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                  </div>
                </div>
              )}

              <div className={styles.wizardFooter}>
                <div>
                  {step > 1 && <button type="button" onClick={prevStep} className={styles.btnSecondary}>Voltar</button>}
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="text-right hidden sm:block">
                    <span className="block text-[10px] text-[#5B3196] uppercase font-bold tracking-widest">Valor Estimado</span>
                    <span className={styles.totalPrice}>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {step < 3 ? (
                    <button type="button" onClick={nextStep} className={styles.btnPrimary}>Avançar</button>
                  ) : (
                    <button type="submit" disabled={status === 'loading'} className={styles.btnPrimary}>
                      {status === 'loading' ? 'Enviando...' : 'Finalizar'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* NOVA SEÇÃO: Nossos Serviços */}
      <section id="servicos" className={`${styles.section} bg-white border-y border-[#E7D6FF]`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nossos Serviços Acadêmicos</h2>
          <p className={styles.sectionSubtitle}>
            Tratamos cada documento de forma manual e personalizada. Entenda o que fazemos para garantir a sua aprovação na banca.
          </p>
        </div>
        
        <div className={styles.servicesGrid}>
          <div className={`${styles.serviceCard} ${styles.animateUp}`}>
            <div className={styles.serviceIcon}>📐</div>
            <h3 className={styles.serviceTitle}>Formatação Estrutural</h3>
            <p className={styles.serviceText}>
              Ajuste de margens, espaçamento entrelinhas, fontes, paginação, sumário automático e criação de listas (figuras, tabelas, abreviaturas).
            </p>
          </div>
          
          <div className={`${styles.serviceCard} ${styles.animateUp} ${styles.delay1}`}>
            <div className={styles.serviceIcon}>📚</div>
            <h3 className={styles.serviceTitle}>Citações e Referências</h3>
            <p className={styles.serviceText}>
              Adequação rigorosa de todas as citações no corpo do texto e padronização completa das referências bibliográficas.
            </p>
          </div>
          
          <div className={`${styles.serviceCard} ${styles.animateUp} ${styles.delay2}`}>
            <div className={styles.serviceIcon}>✍️</div>
            <h3 className={styles.serviceTitle}>Revisão Ortográfica</h3>
            <p className={styles.serviceText}>
              Análise completa da gramática, concordância, coesão, coerência e correção de vícios de linguagem (Serviço extra opcional).
            </p>
          </div>
          
          <div className={`${styles.serviceCard} ${styles.animateUp} ${styles.delay3}`}>
            <div className={styles.serviceIcon}>🔍</div>
            <h3 className={styles.serviceTitle}>Manuais Específicos</h3>
            <p className={styles.serviceText}>
              Adaptação do seu TCC ou artigo científico de acordo com os manuais de publicação específicos da sua universidade.
            </p>
          </div>
        </div>
      </section>

      {/* Secção Vantagens (Como Funciona) */}
      <section id="como-funciona" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Tudo o que você precisa para passar na <br/> banca sem problemas</h2>
        </div>
        <div className={styles.featuresGrid}>
          <div className={`${styles.featureCard} ${styles.animateUp}`}>
            <div className={styles.featureIcon}>📄</div>
            <h3 className={styles.featureTitle}>Formatação Completa</h3>
            <p className={styles.featureText}>Margens, espaçamentos, sumário automático, referências bibliográficas, citações e listas de ilustrações revisadas.</p>
          </div>
          <div className={`${styles.featureCard} ${styles.animateUp} ${styles.delay1}`}>
            <div className={styles.featureIcon}>⏱️</div>
            <h3 className={styles.featureTitle}>Entrega Rápida</h3>
            <p className={styles.featureText}>Trabalho concluído em até 48 horas úteis. Ideal para prazos finais apertados sem perder a qualidade.</p>
          </div>
          <div className={`${styles.featureCard} ${styles.animateUp} ${styles.delay2}`}>
            <div className={styles.featureIcon}>🛡️</div>
            <h3 className={styles.featureTitle}>Revisão Inclusa</h3>
            <p className={styles.featureText}>Garantia de conformidade com reajustes gratuitos caso seu orientador sugira qualquer alteração de formato.</p>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className={`${styles.section} bg-white mt-4 border-t border-[#E7D6FF]`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>O que dizem os estudantes aprovados</h2>
        </div>
        <div className={styles.testimonialsGrid}>
          <div className={`${styles.testimonialCard} ${styles.animateUp}`}>
            <div className={styles.stars}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <p className={styles.testimonialText}>"Eu estava desesperada com as referências bibliográficas do meu TCC. A equipe formatou tudo perfeitamente em 2 dias. Nota 10 na apresentação!"</p>
            <p className={styles.testimonialAuthor}>Mariana Silva</p>
            <p className={styles.testimonialRole}>Graduada em Direito - USP</p>
          </div>
          <div className={`${styles.testimonialCard} ${styles.animateUp} ${styles.delay1}`}>
            <div className={styles.stars}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <p className={styles.testimonialText}>"Trabalho acadêmico impecável. Economizei o tempo que usaria batendo cabeça com as margens do Word para me preparar para a banca."</p>
            <p className={styles.testimonialAuthor}>Carlos Eduardo</p>
            <p className={styles.testimonialRole}>Mestre em Engenharia - Unicamp</p>
          </div>
          <div className={`${styles.testimonialCard} ${styles.animateUp} ${styles.delay2}`}>
            <div className={styles.stars}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <p className={styles.testimonialText}>"Serviço essencial para quem trabalha e estuda ao mesmo tempo. Suporte atencioso e entrega antes do prazo combinado."</p>
            <p className={styles.testimonialAuthor}>Juliana Pires</p>
            <p className={styles.testimonialRole}>Graduada em Administração - FGV</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className={styles.logoIcon}>F</div>
              SimpleFormat ABNT
            </div>
            <p className={styles.footerText}>
              Sua aprovação garantida através de formatação profissional rigorosa, revisada de acordo com as normas ABNT vigentes.
            </p>
          </div>
          <div>
            <h4 className={styles.footerTitle}>Serviços</h4>
            <div className={styles.footerLinks}>
              <span className={styles.footerLink}>Trabalhos Acadêmicos</span>
              <span className={styles.footerLink}>TCC & Monografias</span>
              <span className={styles.footerLink}>Artigos Científicos</span>
            </div>
          </div>
          <div>
            <h4 className={styles.footerTitle}>Suporte</h4>
            <div className={styles.footerLinks}>
              <span className={styles.footerLink}>Contato</span>
              <span className={styles.footerLink}>Termos de Uso</span>
              <span className={styles.footerLink}>Privacidade</span>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 SimpleFormat ABNT. Todos os direitos reservados.</p>
          <p>Desenvolvido com excelência acadêmica.</p>
        </div>
      </footer>

      {/* Botão Flutuante do WhatsApp */}
      <a href="https://wa.me/5592900000000" target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
        Fale Conosco
      </a>
    </div>
  );
}