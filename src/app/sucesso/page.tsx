import Link from 'next/link';

export default function Sucesso() {
  return (
    <div className="flex flex-col justify-center min-h-[100dvh] p-12 px-6 md:p-20 md:px-32 max-w-[1200px] mx-auto overflow-hidden">
      <div className="max-w-[400px]">
        {/* Line Accent */}
        <div className="line-accent" />
        
        {/* Title */}
        <h1 className="text-[clamp(48px,12vw,80px)] font-black leading-[0.95] tracking-[-0.04em] text-white uppercase fade-up">
          Inscrição<br />recebida.
        </h1>
        
        {/* Message */}
        <p className="text-[15px] text-muted font-normal leading-relaxed mt-6 fade-up delay-1">
          Estamos avaliando sua solicitação. Em breve você receberá uma mensagem no WhatsApp com a confirmação.
        </p>
        
        {/* Back Link */}
        <Link 
          href="/"
          className="inline-block mt-10 text-[12px] font-semibold tracking-[0.1em] text-muted uppercase hover:text-white transition-colors fade-up delay-2"
        >
          &larr; voltar
        </Link>
      </div>
    </div>
  );
}
