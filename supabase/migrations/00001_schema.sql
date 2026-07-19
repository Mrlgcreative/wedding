-- ============================================================
-- E-Wedding — Schéma de base de données (PostgreSQL)
-- Compatible Supabase / PostgreSQL 15+
-- ============================================================

-- 1. ENUMS
-- ============================================================

CREATE TYPE template_type AS ENUM ('classic', 'boho', 'minimalist');
CREATE TYPE event_type   AS ENUM ('mairie', 'ceremonie', 'reception');
CREATE TYPE guest_status AS ENUM ('pending', 'confirmed', 'declined');
CREATE TYPE photo_type   AS ENUM ('hero', 'gallery');

-- 2. TABLES
-- ============================================================

CREATE TABLE weddings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template          template_type NOT NULL DEFAULT 'classic',
  partner1          TEXT NOT NULL,
  partner2          TEXT NOT NULL,
  date              TIMESTAMPTZ NOT NULL,
  countdown_enabled BOOLEAN NOT NULL DEFAULT true,
  story             TEXT,
  website           TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dress_codes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id        UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  theme             TEXT NOT NULL,
  instructions      TEXT NOT NULL DEFAULT '',
  palette_primary   TEXT NOT NULL DEFAULT '#1a3c34',
  palette_secondary TEXT NOT NULL DEFAULT '#d4af37',
  palette_accent    TEXT NOT NULL DEFAULT '#e8d5c4',
  palette_background TEXT NOT NULL DEFAULT '#faf6f1',
  palette_text      TEXT NOT NULL DEFAULT '#2d2d2d',
  UNIQUE (wedding_id)
);

CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  type        event_type NOT NULL,
  name        TEXT NOT NULL,
  address     TEXT NOT NULL,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  notes       TEXT,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  type        photo_type NOT NULL DEFAULT 'gallery',
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE guests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  invited_plus_one BOOLEAN NOT NULL DEFAULT false,
  status          guest_status NOT NULL DEFAULT 'pending'
);

CREATE TABLE rsvps (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id            UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  confirmed           BOOLEAN NOT NULL,
  plus_one            BOOLEAN NOT NULL DEFAULT false,
  plus_one_name       TEXT,
  dietary_restrictions TEXT,
  allergies           TEXT,
  message             TEXT,
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (guest_id)
);

-- 3. INDEXES
-- ============================================================

CREATE INDEX idx_events_wedding_id     ON events(wedding_id);
CREATE INDEX idx_events_sort_order     ON events(wedding_id, sort_order);
CREATE INDEX idx_photos_wedding_id     ON photos(wedding_id);
CREATE INDEX idx_photos_type           ON photos(wedding_id, type);
CREATE INDEX idx_guests_wedding_id     ON guests(wedding_id);
CREATE INDEX idx_guests_email          ON guests(email);
CREATE INDEX idx_guests_status         ON guests(wedding_id, status);
CREATE INDEX idx_rsvps_guest_id        ON rsvps(guest_id);

-- 4. TRIGGER updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON weddings
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 5. ROW LEVEL SECURITY (Supabase)
-- ============================================================

ALTER TABLE weddings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE dress_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps     ENABLE ROW LEVEL SECURITY;

-- Organisateur : accès complet à ses propres wedding
CREATE POLICY "owners_select" ON weddings
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "owners_insert" ON weddings
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "owners_update" ON weddings
  FOR UPDATE USING (auth.uid() = id);

-- Invités : lecture seule sur les données du mariage (via un token guest)
-- (à adapter selon le système d'auth invité)
