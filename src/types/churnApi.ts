export interface ClientePayload {
  genero: string;
  adulto_mayor: string;
  pareja: string;
  dependientes: string;
  lineas_multiples: string;
  distrito: string;
  tipo_contrato: string;
  facturacion_sin_papel: string;
  metodo_pago: string;
  canal_contratacion: string;
  servicio_telefonia: string;
  internet: string;
  seguridad_en_linea: string;
  copia_respaldo: string;
  proteccion_equipos: string;
  soporte_tecnico: string;
  streaming_tv: string;
  streaming_peliculas: string;
  descuento_reciente: string;
  antiguedad_meses: number;
  cargo_mensual: number;
  cargos_acumulados: number;
  num_tickets_ult_90d: number;
  uso_streaming_horas_sem: number;
  riesgo_morosidad: number;
}

export interface PrediccionResponse {
  prob_baja: number;
  pred_baja: number;
  umbral: number;
  riesgo: string;
  factores: string[];
}
