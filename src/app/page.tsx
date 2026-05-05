'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nome || !formData.email || !formData.telefone) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const { data: existing, error: fetchError } = await supabase
        .from('inscricoes')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        setError('Este e-mail já está cadastrado.');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('inscricoes')
        .insert([{
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          status: 'pendente'
        }]);

      if (insertError) throw insertError;

      router.push('/sucesso');
    } catch (err: any) {
      console.error('Erro ao submeter:', err);
      setError('Ocorreu um erro ao enviar sua inscrição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] p-12 px-6 md:p-20 md:px-32 max-w-[1200px] mx-auto overflow-hidden">
      {/* ZONA 1 — TOPO */}
      <header className="space-y-6">
        <div className="badge inline-block fade-up">
          <span className="dot" />
          <span className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
            Vagas Limitadas
          </span>
        </div>
        
        <h1 className="title text-[clamp(52px,14vw,96px)] font-black leading-[0.95] tracking-[-0.04em] text-white uppercase fade-up delay-1">
          Master<br />class
        </h1>
        
        <p className="subtitle text-sm text-muted font-normal max-w-[280px] leading-relaxed fade-up delay-2">
          Preencha o formulário para solicitar sua vaga.
        </p>
      </header>

      {/* ZONA 2 — FORMULÁRIO */}
      <div className="form py-12 fade-up delay-3">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-[480px]">
          <div className="field">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Gabriel Silva"
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="gabriel@exemplo.com"
            />
          </div>

          <div className="field">
            <label htmlFor="telefone">Telefone / WhatsApp</label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              required
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
            />
          </div>

          {error && (
            <p className="error-msg">{error}</p>
          )}
        </form>
      </div>

      {/* ZONA 3 — CTA E RODAPÉ */}
      <footer className="fade-up" style={{ animationDelay: '0.4s' }}>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="btn-cta"
        >
          {loading ? (
            <span className="flex justify-center items-center h-full">
              <span className="dot-loading dot-1" />
              <span className="dot-loading dot-2" />
              <span className="dot-loading dot-3" />
            </span>
          ) : (
            'Solicitar Inscrição'
          )}
        </button>
        
        <div className="mt-12 text-center space-y-2">
          <p className="text-[10px] text-[#2E2E2E] tracking-wider uppercase">
            &copy; {new Date().getFullYear()} Kiconecta · Todos os direitos reservados
          </p>
          <p className="text-[9px] text-[#2E2E2E] tracking-widest uppercase">
            Desenvolvido por{' '}
            <a 
              href="https://www.instagram.com/onzy.company/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              Onzy Company
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
