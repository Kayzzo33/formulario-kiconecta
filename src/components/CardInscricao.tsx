'use client';

import { Inscricao } from '@/types/inscricao';
import { BadgeStatus } from './BadgeStatus';
import { BotaoWhatsApp } from './BotaoWhatsApp';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X, Phone } from 'lucide-react';
import { useState } from 'react';

interface CardInscricaoProps {
  inscricao: Inscricao;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  communityLink?: string;
}

export function CardInscricao({ inscricao, onApprove, onReject, communityLink }: CardInscricaoProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (action === 'reject') {
      if (!confirm('Tem certeza que deseja reprovar esta inscrição?')) return;
    }

    setLoading(true);
    try {
      if (action === 'approve') await onApprove(inscricao.id);
      else await onReject(inscricao.id);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = format(new Date(inscricao.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR });

  return (
    <div className="bg-card border border-border rounded-xl p-6 transition-all hover:border-white/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">{inscricao.nome}</h3>
            <BadgeStatus status={inscricao.status} />
          </div>
          <p className="text-sm text-gray-400">{inscricao.email}</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Phone className="w-4 h-4" />
            <a 
              href={`https://wa.me/55${inscricao.telefone.replace(/\D/g, '')}`} 
              target="_blank" 
              className="hover:text-amber-500 transition-colors"
            >
              {inscricao.telefone}
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-2">Inscrito em: {formattedDate}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {inscricao.status === 'pendente' && (
            <>
              <button
                onClick={() => handleAction('approve')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-600/20 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Aprovar
              </button>
              <button
                onClick={() => handleAction('reject')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600/20 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Reprovar
              </button>
            </>
          )}

          {inscricao.status === 'aprovado' && (
            <BotaoWhatsApp telefone={inscricao.telefone} nome={inscricao.nome} communityLink={communityLink} />
          )}
        </div>
      </div>
    </div>
  );
}
