import { FormEvent, useMemo, useState } from "react";
import { predictChurn } from "../lib/api";
import { ClientePayload, PrediccionResponse } from "../types/churnApi";

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: ClientePayload = {
  genero: "",
  adulto_mayor: "",
  pareja: "",
  dependientes: "",
  lineas_multiples: "",
  distrito: "",
  tipo_contrato: "",
  facturacion_sin_papel: "",
  metodo_pago: "",
  canal_contratacion: "",
  servicio_telefonia: "",
  internet: "",
  seguridad_en_linea: "",
  copia_respaldo: "",
  proteccion_equipos: "",
  soporte_tecnico: "",
  streaming_tv: "",
  streaming_peliculas: "",
  descuento_reciente: "",
  antiguedad_meses: Number.NaN,
  cargo_mensual: Number.NaN,
  cargos_acumulados: Number.NaN,
  num_tickets_ult_90d: Number.NaN,
  uso_streaming_horas_sem: Number.NaN,
  riesgo_morosidad: Number.NaN,
};

const yesNoOptions = [
  { label: "Si", value: "Si" },
  { label: "No", value: "No" },
];

const distritos = [
  "Barranco",
  "San Martin de Porres",
  "Villa Maria del Triunfo",
  "Miraflores",
  "San Borja",
  "Surco",
];

const NewClientModal = ({ isOpen, onClose }: NewClientModalProps) => {
  const [formData, setFormData] = useState<ClientePayload>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PrediccionResponse | null>(null);

  const stringFields: Array<keyof ClientePayload> = useMemo(
    () => [
      "genero",
      "adulto_mayor",
      "pareja",
      "dependientes",
      "lineas_multiples",
      "distrito",
      "tipo_contrato",
      "facturacion_sin_papel",
      "metodo_pago",
      "canal_contratacion",
      "servicio_telefonia",
      "internet",
      "seguridad_en_linea",
      "copia_respaldo",
      "proteccion_equipos",
      "soporte_tecnico",
      "streaming_tv",
      "streaming_peliculas",
      "descuento_reciente",
    ],
    [],
  );

  const numberFields: Array<keyof ClientePayload> = useMemo(
    () => [
      "antiguedad_meses",
      "cargo_mensual",
      "cargos_acumulados",
      "num_tickets_ult_90d",
      "uso_streaming_horas_sem",
      "riesgo_morosidad",
    ],
    [],
  );

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setFormData(initialFormData);
    setError(null);
    setResult(null);
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const missingText = stringFields.some((key) => !formData[key].toString().trim());
    const missingNumbers = numberFields.some((key) => Number.isNaN(formData[key] as number));

    if (missingText || missingNumbers) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await predictChurn(formData);
      setResult(response);
    } catch (err) {
      console.error("Predict churn error", err);
      setError("No se pudo obtener la prediccion, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (key: keyof ClientePayload) => (value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNumberChange = (key: keyof ClientePayload) => (value: string) => {
    const parsed = value === "" ? Number.NaN : Number(value);
    setFormData((prev) => ({ ...prev, [key]: parsed }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200 hover:bg-slate-700"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-white">Simulacion de baja de cliente</h2>
        <p className="mt-1 text-sm text-slate-300">
          Completa los datos del cliente y calcula la probabilidad de baja.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Genero</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.genero}
                onChange={(e) => handleTextChange("genero")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Adulto mayor</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.adulto_mayor}
                onChange={(e) => handleTextChange("adulto_mayor")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Pareja</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.pareja}
                onChange={(e) => handleTextChange("pareja")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Dependientes</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.dependientes}
                onChange={(e) => handleTextChange("dependientes")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Lineas multiples</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.lineas_multiples}
                onChange={(e) => handleTextChange("lineas_multiples")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Distrito</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.distrito}
                onChange={(e) => handleTextChange("distrito")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {distritos.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Tipo de contrato</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.tipo_contrato}
                onChange={(e) => handleTextChange("tipo_contrato")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                <option value="Mensual">Mensual</option>
                <option value="1 Año">1 Año</option>
                <option value="2 Años">2 Años</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Facturacion sin papel</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.facturacion_sin_papel}
                onChange={(e) => handleTextChange("facturacion_sin_papel")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Metodo de pago</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.metodo_pago}
                onChange={(e) => handleTextChange("metodo_pago")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Amex">Amex</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Canal de contratacion</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.canal_contratacion}
                onChange={(e) => handleTextChange("canal_contratacion")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                <option value="Online">Online</option>
                <option value="Tienda">Tienda</option>
                <option value="Call Center">Call Center</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Servicio de telefonia</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.servicio_telefonia}
                onChange={(e) => handleTextChange("servicio_telefonia")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Internet</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.internet}
                onChange={(e) => handleTextChange("internet")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                <option value="DSL">DSL</option>
                <option value="Fibra">Fibra</option>
                <option value="Ninguno">Ninguno</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Seguridad en linea</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.seguridad_en_linea}
                onChange={(e) => handleTextChange("seguridad_en_linea")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Copia de respaldo</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.copia_respaldo}
                onChange={(e) => handleTextChange("copia_respaldo")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Proteccion de equipos</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.proteccion_equipos}
                onChange={(e) => handleTextChange("proteccion_equipos")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Soporte tecnico</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.soporte_tecnico}
                onChange={(e) => handleTextChange("soporte_tecnico")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Streaming TV</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.streaming_tv}
                onChange={(e) => handleTextChange("streaming_tv")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Streaming peliculas</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.streaming_peliculas}
                onChange={(e) => handleTextChange("streaming_peliculas")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Descuento reciente</label>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={formData.descuento_reciente}
                onChange={(e) => handleTextChange("descuento_reciente")(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {yesNoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Antiguedad (meses)</label>
              <input
                type="number"
                min={0}
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={Number.isNaN(formData.antiguedad_meses) ? "" : formData.antiguedad_meses}
                onChange={(e) => handleNumberChange("antiguedad_meses")(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Cargo mensual</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={Number.isNaN(formData.cargo_mensual) ? "" : formData.cargo_mensual}
                onChange={(e) => handleNumberChange("cargo_mensual")(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Cargos acumulados</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={Number.isNaN(formData.cargos_acumulados) ? "" : formData.cargos_acumulados}
                onChange={(e) => handleNumberChange("cargos_acumulados")(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Tickets ultimos 90 dias</label>
              <input
                type="number"
                min={0}
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={Number.isNaN(formData.num_tickets_ult_90d) ? "" : formData.num_tickets_ult_90d}
                onChange={(e) => handleNumberChange("num_tickets_ult_90d")(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Uso streaming (horas/sem)</label>
              <input
                type="number"
                min={0}
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={Number.isNaN(formData.uso_streaming_horas_sem) ? "" : formData.uso_streaming_horas_sem}
                onChange={(e) => handleNumberChange("uso_streaming_horas_sem")(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Riesgo de morosidad</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                value={Number.isNaN(formData.riesgo_morosidad) ? "" : formData.riesgo_morosidad}
                onChange={(e) => handleNumberChange("riesgo_morosidad")(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Calculando..." : "Calcular riesgo"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
            <h3 className="text-lg font-semibold text-slate-100">Resultado de la prediccion</h3>
            <p className="mt-2 text-sm text-slate-300">
              Probabilidad de baja: <span className="font-bold">{(result.prob_baja * 100).toFixed(1)}%</span> – Riesgo{" "}
              <span className="font-bold">{result.riesgo}</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">Umbral de decision: {result.umbral}.</p>
            <h4 className="mt-4 text-sm font-semibold text-slate-200">Factores relevantes:</h4>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-300">
              {result.factores.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewClientModal;
