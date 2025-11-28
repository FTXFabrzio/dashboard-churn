import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ProbBin } from "../../types/churn";

type Props = {
  data: ProbBin[];
};

const formatRange = (start: number, end: number) => `${start.toFixed(1)}–${end.toFixed(1)}`;

const ProbHistogram = ({ data }: Props) => {
  const prepared = data.map((bin) => ({
    ...bin,
    label: formatRange(bin.bin_start, bin.bin_end),
  }));

  return (
    <div className="chart-card xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Probabilidades</p>
          <h3 className="text-xl font-semibold text-white">
            Distribución de probabilidades de baja (lote de producción)
          </h3>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer>
          <BarChart data={prepared} barSize={42}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" tick={{ fill: "#cbd5e1" }} stroke="#334155" />
            <YAxis tick={{ fill: "#cbd5e1" }} stroke="#334155" />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }}
              formatter={(value: number, _name, entry) => [value, `Rango ${entry.payload.label}`]}
            />
            <Bar dataKey="count" name="Cantidad" fill="#38bdf8" radius={[10, 10, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProbHistogram;
