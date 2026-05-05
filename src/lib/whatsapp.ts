export function gerarLinkWhatsApp(telefone: string, nome: string, communityLink?: string): string {
  const numeroLimpo = telefone.replace(/\D/g, '');
  const link = communityLink || 'LINK_NAO_CONFIGURADO';
  
  const mensagem = `Olá, ${nome}.

Sua inscrição foi APROVADA para o Masterclass.

Link da comunidade privada:
${link}

Nota de Privacidade: A nossa comunidade é configurada para que seu número fique oculto. Apenas os administradores conseguem visualizar seu contato, garantindo sua total segurança e privacidade.

Clique no link acima para entrar no grupo. Até breve.`;
  
  return `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
}
