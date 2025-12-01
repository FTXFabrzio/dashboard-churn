const Conclusions = () => {
  const bullets = [
    "Los clientes con contrato mensual presentan mayor probabilidad de baja.",
    "La combinación de alta antigüedad y muchos tickets recientes se asocia con mayor churn.",
    "El modelo de Regresión Logística logra ROC-AUC ~ 0.89 y Recall ~ 0.83, permitiendo priorizar clientes en mayor riesgo.",
    "En internet Fibra se concentra la mayor tasa de cancelación, comparado con DSL o sin servicio fijo.",
  ];

  return (
    <div className="chart-card xl:col-span-2">
      <h3 className="mb-3 text-xl font-semibold text-white">Conclusiones rápidas</h3>
      <ul className="space-y-2 text-slate-200">
        {bullets.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
            <span className="leading-relaxed text-slate-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conclusions;
