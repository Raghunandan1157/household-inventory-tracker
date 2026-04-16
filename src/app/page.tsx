'use client';

import { useEffect, useState, useCallback } from 'react';
import { InventoryItem, getStatus, SEED_ITEMS } from '@/lib/types';
import { supabase, getItems, updateItemQty, updateItemThreshold, resetAllItems, seedDatabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import ItemCard from '@/components/ItemCard';
import ThresholdModal from '@/components/ThresholdModal';
import GraphSidebar from '@/components/GraphSidebar';

export default function Home() {
  const { t } = useLanguage();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalItem, setModalItem] = useState<InventoryItem | null>(null);

  const loadItems = useCallback(async () => {
    try {
      await seedDatabase();
      const data = await getItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();

    const channel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
        loadItems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadItems]);

  const handleChangeQty = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.qty + delta);
    if (newQty === item.qty) return;

    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: newQty, updated_at: new Date().toISOString() } : i
      )
    );

    try {
      await updateItemQty(id, newQty);
    } catch (err) {
      console.error('Failed to update qty:', err);
      loadItems();
    }
  };

  const handleEditThreshold = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) setModalItem(item);
  };

  const handleSaveThreshold = async (value: number) => {
    if (!modalItem) return;
    try {
      await updateItemThreshold(modalItem.id, value);
      setItems((prev) =>
        prev.map((i) =>
          i.id === modalItem.id ? { ...i, threshold: value, updated_at: new Date().toISOString() } : i
        )
      );
    } catch (err) {
      console.error('Failed to update threshold:', err);
    }
    setModalItem(null);
  };

  const handleReset = async () => {
    if (!confirm(t('confirmReset'))) return;
    try {
      await resetAllItems();
      await loadItems();
    } catch (err) {
      console.error('Failed to reset:', err);
    }
  };

  const handleExport = () => {
    const data = {
      exported: new Date().toISOString(),
      items: items.map((i) => ({
        name: i.name,
        quantity: i.qty,
        unit: i.unit,
        threshold: i.threshold,
        updated: i.updated_at,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ok = items.filter((i) => getStatus(i.qty, i.threshold) === 'ok').length;
  const low = items.filter((i) => getStatus(i.qty, i.threshold) === 'low').length;
  const out = items.filter((i) => getStatus(i.qty, i.threshold) === 'out').length;

  return (
    <div className="flex min-h-screen">
      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
        <Header />
        <StatsBar total={items.length} ok={ok} low={low} out={out} />

        {loading ? (
          <div className="text-center py-10 text-amber-700">{t('loading')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onChangeQty={handleChangeQty}
                onEditThreshold={handleEditThreshold}
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-6 mb-8">
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl border-2 border-amber-400 bg-white text-amber-900 font-semibold hover:bg-amber-400 transition-colors text-sm"
          >
            {t('resetAll')}
          </button>
          <button
            onClick={handleExport}
            className="px-5 py-2.5 rounded-xl border-2 border-amber-400 bg-amber-400 text-amber-900 font-semibold hover:bg-amber-500 transition-colors text-sm"
          >
            {t('exportJson')}
          </button>
        </div>
      </main>

      {/* Graph Sidebar */}
      <GraphSidebar
        items={items}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Threshold Modal */}
      <ThresholdModal
        isOpen={!!modalItem}
        itemName={modalItem ? t(modalItem.id) : ''}
        currentThreshold={modalItem?.threshold ?? 0}
        onSave={handleSaveThreshold}
        onClose={() => setModalItem(null)}
      />
    </div>
  );
}
