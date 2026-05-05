import { StatusInscricao } from '@/types/inscricao';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeStatusProps {
  status: StatusInscricao;
}

export function BadgeStatus({ status }: BadgeStatusProps) {
  const styles = {
    pendente: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    aprovado: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    reprovado: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
      styles[status]
    )}>
      {status.toUpperCase()}
    </span>
  );
}
