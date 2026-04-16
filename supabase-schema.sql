-- Household Inventory Tracker - Supabase Schema
-- Run this in the Supabase SQL Editor to create the table

CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  unit TEXT NOT NULL,
  default_qty INTEGER NOT NULL DEFAULT 1,
  qty INTEGER NOT NULL DEFAULT 0,
  threshold INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON inventory
  FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert" ON inventory
  FOR INSERT WITH CHECK (true);

-- Allow public update
CREATE POLICY "Allow public update" ON inventory
  FOR UPDATE USING (true);

-- Allow public delete
CREATE POLICY "Allow public delete" ON inventory
  FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;

-- Seed data
INSERT INTO inventory (id, name, icon, unit, default_qty, qty, threshold, updated_at) VALUES
  ('sugar',        'Sugar',         '🍬', 'kg',     2, 2, 1, NOW()),
  ('tea_powder',   'Tea Powder',    '🍃', 'packs',  2, 2, 1, NOW()),
  ('coffee_powder','Coffee Powder', '☕', 'packs',  1, 1, 1, NOW()),
  ('tea_bag',      'Tea Bags',      '🫖', 'boxes',  1, 1, 1, NOW()),
  ('tissue',       'Tissue',        '🧻', 'rolls',  4, 4, 2, NOW()),
  ('oil',          'Oil',           '🛢️', 'L',      2, 2, 1, NOW()),
  ('match_box',    'Match Box',     '🔥', 'boxes',  2, 2, 1, NOW()),
  ('cotton',       'Cotton',        '☁️', 'packs',  1, 1, 1, NOW()),
  ('colin',        'Colin',         '🧴', 'bottle', 1, 1, 1, NOW()),
  ('exo',          'Exo',           '🧽', 'bars',   2, 2, 1, NOW()),
  ('water',        'Water',         '💧', 'cans',   2, 2, 1, NOW()),
  ('curd',         'Curd',          '🥛', 'packs',  2, 2, 1, NOW()),
  ('milk',         'Milk',          '🥛', 'L',      2, 2, 1, NOW())
ON CONFLICT (id) DO NOTHING;
