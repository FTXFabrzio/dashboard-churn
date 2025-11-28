import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TopFeature } from "../../types/churn";

type Props = {
  data: TopFeature[];
  modelo: string;
};

const prettifyFeature = (feature: string) => {
  return feature
    .replace(/^num__/, "")
    .replace(/^cat__/, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const TopFeatures = ({ data, modelo }: Props) => {
  const parsed = [...data]
    .map((item) => ({
      ...item,
      label: prettifyFeature(item.feature),
      coef: item["|coef|"],
    }))
    .sort((a, b) => b.coef - a.coef)
    .slice(0, 10);

  return (
    <div className="chart-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Importancia</p>
          <h3 className="text-xl font-semibold text-white">
            Variables más influyentes ({modelo})
          </h3>
        </div>
      </div>
      <div className="h-96">
        <ResponsiveContainer>
          <BarChart data={parsed} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" tick={{ fill: "#cbd5e1" }} stroke="#334155" />
            <YAxis
              dataKey="label"
              type="category"
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              width={160}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }}
              formatter={(value: number, _name, entry) => [value.toFixed(3), entry.payload.label]}
            />
            <Bar dataKey="coef" name="|coef|" fill="#22d3ee" radius={[0, 10, 10, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopFeatures;
