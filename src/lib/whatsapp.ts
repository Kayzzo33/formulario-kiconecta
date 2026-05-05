export function gerarLinkWhatsApp(telefone: string, nome: string, communityLink?: string): string {
  const numeroLimpo = telefone.replace(/\D/g, '');
  const linkComunidade = communityLink || process.env.NEXT_PUBLIC_WHATSAPP_LINK_COMUNIDADE || '';
  
  const mensagem = `Olá, ${nome}! 🎉\n\nSua inscrição foi *APROVADA* para o nosso Masterclass!\n\nAqui está o link da nossa comunidade para você acessar:\n${linkComunidade}\n\nClique no link acima, entre na comunidade e nos vemos lá! 🚀\n\nQualquer dúvida, é só responder aqui. 😊`;
  
  return `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
}
