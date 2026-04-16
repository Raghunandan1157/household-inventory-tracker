export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  unit: string;
  default_qty: number;
  qty: number;
  threshold: number;
  updated_at: string;
}

export type StockStatus = 'ok' | 'low' | 'out';

export function getStatus(qty: number, threshold: number): StockStatus {
  if (qty <= 0) return 'out';
  if (qty <= threshold) return 'low';
  return 'ok';
}

export const SEED_ITEMS: Omit<InventoryItem, 'updated_at'>[] = [
  { id: 'sugar', name: 'Sugar', icon: '🍬', unit: 'kg', default_qty: 2, qty: 2, threshold: 1 },
  { id: 'tea_powder', name: 'Tea Powder', icon: '🍃', unit: 'packs', default_qty: 2, qty: 2, threshold: 1 },
  { id: 'coffee_powder', name: 'Coffee Powder', icon: '☕', unit: 'packs', default_qty: 1, qty: 1, threshold: 1 },
  { id: 'tea_bag', name: 'Tea Bags', icon: '🫖', unit: 'boxes', default_qty: 1, qty: 1, threshold: 1 },
  { id: 'tissue', name: 'Tissue', icon: '🧻', unit: 'rolls', default_qty: 4, qty: 4, threshold: 2 },
  { id: 'oil', name: 'Oil', icon: '🛢️', unit: 'L', default_qty: 2, qty: 2, threshold: 1 },
  { id: 'match_box', name: 'Match Box', icon: '🔥', unit: 'boxes', default_qty: 2, qty: 2, threshold: 1 },
  { id: 'cotton', name: 'Cotton', icon: '☁️', unit: 'packs', default_qty: 1, qty: 1, threshold: 1 },
  { id: 'colin', name: 'Colin', icon: '🧴', unit: 'bottle', default_qty: 1, qty: 1, threshold: 1 },
  { id: 'exo', name: 'Exo', icon: '🧽', unit: 'bars', default_qty: 2, qty: 2, threshold: 1 },
  { id: 'water', name: 'Water', icon: '💧', unit: 'cans', default_qty: 2, qty: 2, threshold: 1 },
  { id: 'curd', name: 'Curd', icon: '🥛', unit: 'packs', default_qty: 2, qty: 2, threshold: 1 },
  { id: 'milk', name: 'Milk', icon: '🥛', unit: 'L', default_qty: 2, qty: 2, threshold: 1 },
];
