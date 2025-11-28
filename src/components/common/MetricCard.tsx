import { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string | number;
  helper?: ReactNode;
};

const MetricCard = ({ title, value, helper }: MetricCardProps) => {
  return (
    <div className="glass rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <p className="text-sm uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {helper && <p className="mt-1 text-sm text-slate-400">{helper}</p>}
    </div>
  );
};

export default MetricCard;
