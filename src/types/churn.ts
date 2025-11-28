export type MetricasTest = {
  roc_auc: number;
  precision: number;
  recall: number;
  f1: number;
};

export type Meta = {
  n_clientes: number;
  tasa_baja_global: number;
  modelo_final: string;
  metricas_test: MetricasTest;
};

export type ChurnByContract = {
  tipo_contrato: string;
  tasa_baja: number;
};

export type ChurnByInternet = {
  internet: string;
  tasa_baja: number;
};

export type SeniorityByChurn = {
  rango_antiguedad: string;
  no_baja: number;
  baja: number;
};

export type TopFeature = {
  feature: string;
  "|coef|": number;
};

export type ProbBin = {
  bin_start: number;
  bin_end: number;
  count: number;
};

export type ChurnDashboardData = {
  meta: Meta;
  churnByContract: ChurnByContract[];
  churnByInternet: ChurnByInternet[];
  seniorityByChurn: SeniorityByChurn[];
  topFeatures: TopFeature[];
  probHistogram: ProbBin[];
};
