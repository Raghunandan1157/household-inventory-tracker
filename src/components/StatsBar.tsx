'use client';

import { useLanguage } from '@/context/LanguageContext';

interface StatsBarProps {
  total: number;
  ok: number;
  low: number;
  out: number;
}

export default function StatsBar({ total, ok, low, out }: StatsBarProps) {
  const { t } = useLanguage();

  const stats = [
    { label: t('totalItems'), value: total, color: 'text-amber-900' },
    { label: t('inStock'), value: ok, color: 'text-emerald-600' },
    { label: t('runningLow'), value: low, color: 'text-amber-600' },
    { label: t('outOfStock'), value: out, color: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border-2 border-amber-100 rounded-xl p-4 shadow-sm"
        >
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            {stat.label}
          </div>
          <div className={`text-2xl md:text-3xl font-bold mt-1 ${stat.color}`}>
            {total === 0 ? '—' : stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
