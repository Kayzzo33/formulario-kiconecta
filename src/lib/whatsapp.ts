export function gerarLinkWhatsApp(telefone: string, nome: string, communityLink?: string): string {
  const numeroLimpo = telefone.replace(/\D/g, '');
  const link = communityLink || 'LINK_NAO_CONFIGURADO';
  
  const mensagem = `Olá, ${nome}! 🎉\n\nSua inscrição foi *APROVADA* para o nosso Masterclass!\n\nAqui está o link da nossa comunidade privada para você acessar:\n${link}\n\n⚠️ *Nota de Privacidade:* Nossa comunidade é configurada para que seu número fique oculto. Apenas os administradores conseguem visualizar seu contato, garantindo sua total segurança e privacidade. 🔒\n\nClique no link acima, entre no grupo e nos vemos lá! 🚀`;
  
  return `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
}
