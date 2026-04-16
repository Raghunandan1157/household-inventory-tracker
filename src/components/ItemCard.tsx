'use client';

import { useLanguage } from '@/context/LanguageContext';
import { InventoryItem, getStatus } from '@/lib/types';

interface ItemCardProps {
  item: InventoryItem;
  onChangeQty: (id: string, delta: number) => void;
  onEditThreshold: (id: string) => void;
}

function formatTime(iso: string, t: (key: string) => string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return t('justNow');
  if (mins < 60) return `${mins}${t('mAgo')}`;
  if (hrs < 24) return `${hrs}${t('hAgo')}`;
  if (days < 7) return `${days}${t('dAgo')}`;
  return d.toLocaleDateString();
}

export default function ItemCard({ item, onChangeQty, onEditThreshold }: ItemCardProps) {
  const { t } = useLanguage();
  const status = getStatus(item.qty, item.threshold);

  const borderColor =
    status === 'out' ? 'border-red-400 bg-red-50' :
    status === 'low' ? 'border-orange-300 bg-orange-50' :
    'border-amber-100 hover:border-amber-400';

  const badgeStyle =
    status === 'out' ? 'bg-red-100 text-red-800' :
    status === 'low' ? 'bg-orange-100 text-orange-800' :
    'bg-emerald-100 text-emerald-800';

  const badgeText =
    status === 'out' ? t('badgeOut') :
    status === 'low' ? t('badgeLow') :
    t('badgeOk');

  return (
    <div
      className={`bg-white border-2 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-100/50 ${borderColor}`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-2xl">{item.icon}</span>
        <span className="font-semibold text-amber-900 flex-1">{t(item.id)}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeStyle}`}>
          {badgeText}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          disabled={item.qty <= 0}
          onClick={() => onChangeQty(item.id, -1)}
          className="w-9 h-9 rounded-lg border-2 border-amber-400 bg-white text-amber-900 text-xl font-bold flex items-center justify-center transition-all hover:bg-amber-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          −
        </button>
        <div className="flex-1 text-center">
          <span className="text-2xl font-bold text-amber-900">{item.qty}</span>
          <span className="text-xs text-amber-700 ml-1">{t(item.unit)}</span>
        </div>
        <button
          onClick={() => onChangeQty(item.id, 1)}
          className="w-9 h-9 rounded-lg border-2 border-amber-400 bg-white text-amber-900 text-xl font-bold flex items-center justify-center transition-all hover:bg-amber-400 active:scale-95"
        >
          +
        </button>
      </div>

      <div className="flex justify-between items-center pt-2.5 border-t border-amber-100 text-[11px] text-amber-700">
        <span className="italic">
          {t('updated')} {formatTime(item.updated_at, t)}
        </span>
        <button
          onClick={() => onEditThreshold(item.id)}
          className="underline text-amber-600 hover:text-amber-900 transition-colors"
        >
          {t('alertAt')} ≤{item.threshold}
        </button>
      </div>
    </div>
  );
}
