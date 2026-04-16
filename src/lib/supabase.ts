import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { InventoryItem, SEED_ITEMS } from './types';

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as unknown as Record<string, unknown>)[prop as string];
  },
});

export async function getItems(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('id');

  if (error) throw error;
  return data || [];
}

export async function updateItemQty(id: string, qty: number): Promise<void> {
  const { error } = await supabase
    .from('inventory')
    .update({ qty, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function updateItemThreshold(id: string, threshold: number): Promise<void> {
  const { error } = await supabase
    .from('inventory')
    .update({ threshold, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function resetAllItems(): Promise<void> {
  for (const item of SEED_ITEMS) {
    const { error } = await supabase
      .from('inventory')
      .update({
        qty: item.default_qty,
        threshold: item.threshold,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    if (error) throw error;
  }
}

export async function seedDatabase(): Promise<void> {
  const { data: existing } = await supabase
    .from('inventory')
    .select('id')
    .limit(1);

  if (existing && existing.length > 0) return;

  const rows = SEED_ITEMS.map((item) => ({
    ...item,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('inventory').insert(rows);
  if (error) throw error;
}
