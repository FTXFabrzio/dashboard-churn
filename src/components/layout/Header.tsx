const Header = () => {
  return (
    <header className="relative overflow-hidden bg-header-gradient text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 sm:px-10">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">AndesTel Hogar</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Diagnóstico de Baja (Churn) – AndesTel Hogar</h1>
        <p className="max-w-2xl text-lg text-white/80">
          Panel resumen del modelo de baja de clientes residenciales.
        </p>
      </div>
    </header>
  );
};

export default Header;
