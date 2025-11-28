import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChurnByInternet as ChurnByInternetType } from "../../types/churn";

type Props = {
  data: ChurnByInternetType[];
};

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

const ChurnByInternet = ({ data }: Props) => {
  return (
    <div className="chart-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Internet</p>
          <h3 className="text-xl font-semibold text-white">Tasa de baja por tipo de internet</h3>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer>
          <BarChart data={data} barSize={38}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="internet" tick={{ fill: "#cbd5e1" }} stroke="#334155" />
            <YAxis
              tick={{ fill: "#cbd5e1" }}
              stroke="#334155"
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }}
              formatter={(value: number) => formatPercent(value)}
              labelFormatter={(label) => `Internet: ${label}`}
            />
            <Bar dataKey="tasa_baja" fill="#a78bfa" radius={[10, 10, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChurnByInternet;
