type HeaderProps = {
  onOpenNewClient: () => void;
};

const Header = ({ onOpenNewClient }: HeaderProps) => {
  return (
    <header className="relative overflow-hidden bg-header-gradient text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">AndesTel Hogar</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Diagnóstico de Baja (Churn) - AndesTel Hogar</h1>
          <p className="max-w-2xl text-lg text-white/80">
            Panel resumen del modelo de baja de clientes residenciales.
          </p>
        </div>
        <button
          onClick={onOpenNewClient}
          className="self-start rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-emerald-400"
        >
          Simular nuevo cliente
        </button>
      </div>
    </header>
  );
};

export default Header;
