'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        setError('Credenciais inválidas');
        setLoading(false);
        return;
      }

      router.push('/admin/painel');
    } catch (err) {
      setError('Ocorreu um erro no login.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808]">
      <div className="w-full max-w-md bg-[#111111] border border-[#222222] p-10 rounded-lg shadow-2xl fade-up">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-[#7B2FBE]/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-[#7B2FBE]" />
          </div>
          <h1 className="text-xl font-bold text-white uppercase tracking-widest">Área Administrativa</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-b border-[#222222] focus:border-[#7B2FBE] py-2 text-white outline-none transition-colors"
                placeholder="admin@exemplo.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest">Senha</label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="bg-transparent border-b border-[#222222] focus:border-[#7B2FBE] py-2 text-white outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-[#E05555] text-xs font-medium text-center tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7B2FBE] hover:bg-[#9B4FDE] disabled:opacity-50 text-white font-bold py-4 rounded text-xs uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
