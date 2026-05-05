'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    info: <AlertCircle className="w-5 h-5 text-amber-500" />,
  };

  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    error: 'bg-rose-500/10 border-rose-500/20',
    info: 'bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border backdrop-blur-md animate-in slide-in-from-right-full",
      bgColors[type]
    )}>
      {icons[type]}
      <p className="text-sm font-medium text-white">{message}</p>
      <button 
        onClick={onClose}
        className="ml-2 text-white/50 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
