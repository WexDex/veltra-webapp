-- Veltra — PostgreSQL Schema
-- Run once before starting Plan 2:
--   psql -U postgres -d veltra -f docs/schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- categories
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL       PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- users
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             SERIAL       PRIMARY KEY,
  email          VARCHAR(255) NOT NULL UNIQUE,
  password_hash  TEXT         NOT NULL,
  name           VARCHAR(100) NOT NULL,
  role           VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- products
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           SERIAL       PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  description  TEXT,
  image_url    TEXT,
  category_id  INTEGER      NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- employees
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id          SERIAL      PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  role        VARCHAR(100) NOT NULL,
  phone       VARCHAR(50),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- friendships
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS friendships (
  id          SERIAL      PRIMARY KEY,
  user_id     INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id   INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, friend_id)
);

-- ─────────────────────────────────────────────
-- messages
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id           SERIAL      PRIMARY KEY,
  sender_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id  INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content      TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at      TIMESTAMPTZ
);

-- ─────────────────────────────────────────────
-- contacts
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id          SERIAL       PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  message     TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- notifications
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id           SERIAL      PRIMARY KEY,
  user_id      INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         VARCHAR(50) NOT NULL,
  from_user_id INTEGER     REFERENCES users(id) ON DELETE SET NULL,
  ref_id       INTEGER,
  read         BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
