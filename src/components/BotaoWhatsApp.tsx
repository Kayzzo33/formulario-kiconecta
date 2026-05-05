'use client';

import { gerarLinkWhatsApp } from '@/lib/whatsapp';
import { MessageCircle } from 'lucide-react';

interface BotaoWhatsAppProps {
  telefone: string;
  nome: string;
  communityLink?: string;
}

export function BotaoWhatsApp({ telefone, nome, communityLink }: BotaoWhatsAppProps) {
  const link = gerarLinkWhatsApp(telefone, nome, communityLink);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
    >
      <MessageCircle className="w-5 h-5" />
      Enviar no WhatsApp
    </a>
  );
}
