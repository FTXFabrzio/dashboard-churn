import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SeniorityByChurn as SeniorityByChurnType } from "../../types/churn";

type Props = {
  data: SeniorityByChurnType[];
};

const SeniorityByChurn = ({ data }: Props) => {
  return (
    <div className="chart-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Antigüedad</p>
          <h3 className="text-xl font-semibold text-white">Distribución de baja por antigüedad</h3>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="rango_antiguedad" tick={{ fill: "#cbd5e1" }} stroke="#334155" />
            <YAxis tick={{ fill: "#cbd5e1" }} stroke="#334155" />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }}
              labelFormatter={(label) => `Antigüedad: ${label} meses`}
            />
            <Legend wrapperStyle={{ color: "#cbd5e1" }} />
            <Bar dataKey="no_baja" name="No baja" fill="#22d3ee" radius={[10, 10, 6, 6]} />
            <Bar dataKey="baja" name="Baja" fill="#fb7185" radius={[10, 10, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeniorityByChurn;
