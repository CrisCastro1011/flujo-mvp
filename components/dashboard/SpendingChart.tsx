'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SpendingChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#3B82F6', '#10B981', '#F97316', '#14B8A6', '#EC4899', '#F59E0B', '#EF4444', '#64748B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg border border-slate-100 rounded-xl px-3 py-2">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-bold text-slate-900">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function SpendingChart({ data }: SpendingChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 6);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Gastos por Categoría</h3>
          <p className="text-xs text-slate-400 mt-0.5">Este mes</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sorted} barSize={24} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC', radius: 4 }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {sorted.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
