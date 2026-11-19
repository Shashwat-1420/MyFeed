export const INITIAL_SCHEMA = `
  CREATE TABLE IF NOT EXISTS saves (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,

    url TEXT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    domain TEXT,
    source_platform TEXT,

    category TEXT NOT NULL,
    tags_json TEXT NOT NULL DEFAULT '[]',
    embedding_json TEXT,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    next_resurface_at TEXT,

    resurface_count INTEGER NOT NULL DEFAULT 0,
    times_viewed INTEGER NOT NULL DEFAULT 0,
    easiness REAL,
    interval_days INTEGER,

    is_archived INTEGER NOT NULL DEFAULT 0,
    is_favourite INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_saves_created_at
    ON saves(created_at DESC);

  CREATE INDEX IF NOT EXISTS idx_saves_category
    ON saves(category);

  CREATE INDEX IF NOT EXISTS idx_saves_resurface
    ON saves(next_resurface_at);

  CREATE INDEX IF NOT EXISTS idx_saves_user_id
    ON saves(user_id);

  CREATE INDEX IF NOT EXISTS idx_saves_archived
    ON saves(is_archived);

  CREATE INDEX IF NOT EXISTS idx_saves_favourite
    ON saves(is_favourite);

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;