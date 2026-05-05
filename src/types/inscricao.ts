export type StatusInscricao = 'pendente' | 'aprovado' | 'reprovado';

export interface Inscricao {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: StatusInscricao;
  created_at: string;
}
