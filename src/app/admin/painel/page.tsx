'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Inscricao, StatusInscricao } from '@/types/inscricao';
import { CardInscricao } from '@/components/CardInscricao';
import { Toast, ToastType } from '@/components/Toast';
import { LogOut, Users, Clock, CheckCircle2, Link as LinkIcon, Save, Loader2 } from 'lucide-react';

export default function AdminPainel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [filter, setFilter] = useState<StatusInscricao | 'todos'>('todos');
  const [communityLink, setCommunityLink] = useState('');
  const [savingLink, setSavingLink] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, visible: true });
  };

  const fetchInscricoes = useCallback(async () => {
    const { data, error } = await supabase
      .from('inscricoes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast('Erro ao carregar inscrições', 'error');
      return;
    }

    setInscricoes(data || []);
  }, []);

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('id', 'whatsapp_link_comunidade')
      .single();

    if (error) {
      console.error('Erro ao carregar link:', error);
    } else if (data) {
      setCommunityLink(data.valor);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      await Promise.all([fetchInscricoes(), fetchSettings()]);
      setLoading(false);
    };

    init();

    // Setup real-time updates
    const channel = supabase
      .channel('inscricoes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inscricoes' }, () => {
        fetchInscricoes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, fetchInscricoes, fetchSettings]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleApprove = async (id: string) => {
    // Atualização otimista
    const prevInscricoes = [...inscricoes];
    setInscricoes(current => current.map(i => i.id === id ? { ...i, status: 'aprovado' } : i));

    const { error } = await supabase
      .from('inscricoes')
      .update({ status: 'aprovado' })
      .eq('id', id);

    if (error) {
      setInscricoes(prevInscricoes);
      showToast('Erro ao aprovar inscrição', 'error');
    } else {
      showToast('Inscrição aprovada!');
    }
  };

  const handleReject = async (id: string) => {
    // Atualização otimista
    const prevInscricoes = [...inscricoes];
    setInscricoes(current => current.map(i => i.id === id ? { ...i, status: 'reprovado' } : i));

    const { error } = await supabase
      .from('inscricoes')
      .update({ status: 'reprovado' })
      .eq('id', id);

    if (error) {
      setInscricoes(prevInscricoes);
      showToast('Erro ao reprovar inscrição', 'error');
    } else {
      showToast('Inscrição reprovada.');
    }
  };

  const handleSaveLink = async () => {
    setSavingLink(true);
    const { error } = await supabase
      .from('configuracoes')
      .upsert({ id: 'whatsapp_link_comunidade', valor: communityLink });

    if (error) {
      showToast('Erro ao salvar link', 'error');
    } else {
      showToast('Link da comunidade atualizado!');
    }
    setSavingLink(false);
  };

  const metrics = {
    total: inscricoes.length,
    pendentes: inscricoes.filter(i => i.status === 'pendente').length,
    aprovados: inscricoes.filter(i => i.status === 'aprovado').length,
  };

  const filteredInscricoes = filter === 'todos' 
    ? inscricoes 
    : inscricoes.filter(i => i.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <Loader2 className="w-12 h-12 text-[#7B2FBE] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative z-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 fade-up">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Painel de Inscrições</h1>
          <p className="text-[#6B6B6B] mt-1">Gerencie os pedidos de entrada no Masterclass</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-rose-500/10 text-[#6B6B6B] hover:text-rose-500 border border-[#222222] rounded transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </header>

      {/* Community Link Settings */}
      <div className="bg-[#111111] border border-[#222222] p-6 rounded-lg fade-up delay-1">
        <div className="flex items-center gap-3 mb-4 text-white">
          <LinkIcon className="w-5 h-5 text-[#7B2FBE]" />
          <h2 className="font-bold uppercase text-sm tracking-widest">Link da Comunidade (WhatsApp)</h2>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={communityLink}
            onChange={(e) => setCommunityLink(e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
            className="flex-1 bg-[#080808] border border-[#222222] rounded px-4 py-2 text-white outline-none focus:border-[#7B2FBE] transition-colors"
          />
          <button
            onClick={handleSaveLink}
            disabled={savingLink}
            className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#9B4FDE] text-white px-6 py-2 rounded font-bold text-xs uppercase tracking-widest disabled:opacity-50 transition-all"
          >
            {savingLink ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-up delay-2">
        <MetricCard 
          title="Inscritos" 
          value={metrics.total} 
          icon={<Users className="w-5 h-5" />} 
          color="white"
        />
        <MetricCard 
          title="Pendentes" 
          value={metrics.pendentes} 
          icon={<Clock className="w-5 h-5" />} 
          color="amber"
        />
        <MetricCard 
          title="Aprovados" 
          value={metrics.aprovados} 
          icon={<CheckCircle2 className="w-5 h-5" />} 
          color="emerald"
        />
      </div>

      {/* Filters and List */}
      <div className="space-y-6 fade-up delay-3">
        <div className="flex flex-wrap items-center gap-2 p-1 bg-[#111111] rounded border border-[#222222] w-fit">
          {(['todos', 'pendente', 'aprovado', 'reprovado'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === status 
                ? 'bg-[#7B2FBE] text-white' 
                : 'text-[#6B6B6B] hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredInscricoes.length > 0 ? (
            filteredInscricoes.map((inscricao) => (
              <CardInscricao
                key={inscricao.id}
                inscricao={inscricao}
                onApprove={handleApprove}
                onReject={handleReject}
                communityLink={communityLink}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-[#111111]/30 border border-dashed border-[#222222] rounded">
              <p className="text-[#6B6B6B] text-sm uppercase tracking-widest">Vazio</p>
            </div>
          )}
        </div>
      </div>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.visible} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />
    </div>
  );
}

function MetricCard({ title, value, icon, color }: any) {
  const colors: any = {
    white: 'text-white border-white/10',
    amber: 'text-amber-500 border-amber-500/10',
    emerald: 'text-emerald-500 border-emerald-500/10',
  };

  return (
    <div className={`bg-[#111111] border ${colors[color]} rounded-lg p-6 flex items-center justify-between`}>
      <div>
        <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-[0.2em]">{title}</p>
        <p className="text-3xl font-black mt-2">{value}</p>
      </div>
      <div className={`p-3 bg-[#080808] rounded border border-inherit`}>
        {icon}
      </div>
    </div>
  );
}