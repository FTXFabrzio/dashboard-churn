import Header from "./components/layout/Header";
import PageShell from "./components/layout/PageShell";
import MetricCard from "./components/common/MetricCard";
import ChurnByContract from "./components/charts/ChurnByContract";
import ChurnByInternet from "./components/charts/ChurnByInternet";
import SeniorityByChurn from "./components/charts/SeniorityByChurn";
import TopFeatures from "./components/charts/TopFeatures";
import ProbHistogram from "./components/charts/ProbHistogram";
import Conclusions from "./components/Conclusions";
import dataJson from "./data/churnDashboardData.json";
import { ChurnDashboardData } from "./types/churn";

const data = dataJson as ChurnDashboardData;

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
const formatInteger = (value: number) => value.toLocaleString("es-PE");

function App() {
  const { meta } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <PageShell>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Nº de clientes"
            value={formatInteger(meta.n_clientes)}
            helper="Base de clientes evaluada"
          />
          <MetricCard
            title="Tasa global de baja"
            value={formatPercent(meta.tasa_baja_global)}
            helper="Porcentaje de churn en el lote"
          />
          <MetricCard
            title="Modelo final"
            value={meta.modelo_final}
            helper="Algoritmo seleccionado"
          />
          <MetricCard
            title="Métrica principal"
            value={`ROC-AUC ${meta.metricas_test.roc_auc.toFixed(2)} · Recall ${meta.metricas_test.recall.toFixed(2)}`}
            helper="Rendimiento en test"
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <ChurnByContract data={data.churnByContract} />
          <ChurnByInternet data={data.churnByInternet} />
          <SeniorityByChurn data={data.seniorityByChurn} />
          <TopFeatures data={data.topFeatures} modelo={meta.modelo_final} />
          <ProbHistogram data={data.probHistogram} />
          <Conclusions />
        </section>
      </PageShell>
    </div>
  );
}

export default App;
