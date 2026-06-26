-- Запустить в Supabase Dashboard → SQL Editor

-- 1. Добавить статус и заметки к заявкам (contacts)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status text DEFAULT 'new';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS notes text DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. Таблица для CMS-правок каталога
CREATE TABLE IF NOT EXISTS catalog_cms (
  id bigserial PRIMARY KEY,
  item_id integer UNIQUE,        -- ID из catalog.js (NULL = новый товар)
  category text NOT NULL,
  sub text,
  title text,
  description text,
  unit text DEFAULT 'шт',
  photo text,
  is_hidden boolean DEFAULT false,
  is_custom boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS: только service_role может читать/писать (API использует service key)
ALTER TABLE catalog_cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Политика для service key (bypass RLS)
-- Service role автоматически обходит RLS, дополнительных политик не нужно