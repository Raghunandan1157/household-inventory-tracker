'use client';

import { InventoryItem, getStatus } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';

interface GraphSidebarProps {
  items: InventoryItem[];
  isOpen: boolean;
  onToggle: () => void;
}

const STATUS_COLORS = {
  ok: '#059669',
  low: '#d97706',
  out: '#ef4444',
};

export default function GraphSidebar({ items, isOpen, onToggle }: GraphSidebarProps) {
  const { t } = useLanguage();

  const barData = items.map((item) => ({
    name: t(item.id),
    qty: item.qty,
    status: getStatus(item.qty, item.threshold),
  }));

  const okCount = items.filter((i) => getStatus(i.qty, i.threshold) === 'ok').length;
  const lowCount = items.filter((i) => getStatus(i.qty, i.threshold) === 'low').length;
  const outCount = items.filter((i) => getStatus(i.qty, i.threshold) === 'out').length;

  const pieData = [
    { name: t('inStock'), value: okCount, color: STATUS_COLORS.ok },
    { name: t('runningLow'), value: lowCount, color: STATUS_COLORS.low },
    { name: t('outOfStock'), value: outCount, color: STATUS_COLORS.out },
  ].filter((d) => d.value > 0);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-amber-400 text-amber-900 shadow-lg shadow-amber-300/50 flex items-center justify-center text-2xl hover:bg-amber-500 transition-colors"
        aria-label="Toggle charts"
      >
        📊
      </button>

      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 lg:right-auto h-full lg:h-auto z-50 lg:z-0
          w-80 lg:w-72 xl:w-80 bg-white border-l-2 lg:border-l-0 lg:border-2 border-amber-200 lg:rounded-2xl
          shadow-xl lg:shadow-sm overflow-y-auto transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          lg:self-start`}
      >
        {/* Close button on mobile */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-amber-100">
          <h2 className="font-bold text-amber-900">{t('sidebarTitle')}</h2>
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-lg hover:bg-amber-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <h2 className="hidden lg:block font-bold text-amber-900 text-lg mb-4">
            📊 {t('sidebarTitle')}
          </h2>

          {/* Bar Chart */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-amber-700 mb-3 uppercase tracking-wide">
              {t('stockLevels')}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#92400e' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={70}
                    tick={{ fontSize: 10, fill: '#92400e' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fffbeb',
                      border: '2px solid #fcd34d',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="qty" radius={[0, 6, 6, 0]} barSize={14}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={STATUS_COLORS[entry.status]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div>
            <h3 className="text-sm font-semibold text-amber-700 mb-3 uppercase tracking-wide">
              {t('categoryDist')}
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
