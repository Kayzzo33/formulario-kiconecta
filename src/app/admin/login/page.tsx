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
        return;
      }

      router.push('/admin/painel');
    } catch (err) {
      setError('Ocorreu um erro no login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-2xl fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Área Administrativa</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="admin@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-rose-500 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
