-- ============================================================
-- EatClean Tracker — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. PROFILES ──────────────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID    REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  height      INTEGER NOT NULL DEFAULT 174,
  weight      NUMERIC(5,2) NOT NULL DEFAULT 70,
  age         INTEGER NOT NULL DEFAULT 21,
  goal        TEXT    NOT NULL DEFAULT 'recomp'
                CHECK (goal IN ('recomp', 'bulk', 'cut')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 2. MEAL TRACKING ─────────────────────────────────────────
CREATE TABLE public.meal_tracking (
  id            UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID    REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date          DATE    NOT NULL,
  plan_key      TEXT,   -- gym_work | gym_sat | pickle_work | pickle_sun (or override)

  -- Meals (maps to timeline entries, index-based)
  meal_0_done   BOOLEAN DEFAULT false,
  meal_1_done   BOOLEAN DEFAULT false,
  meal_2_done   BOOLEAN DEFAULT false,
  meal_3_done   BOOLEAN DEFAULT false,
  meal_4_done   BOOLEAN DEFAULT false,
  meal_5_done   BOOLEAN DEFAULT false,
  meal_6_done   BOOLEAN DEFAULT false,

  -- Supplements
  creatine_done BOOLEAN DEFAULT false,
  omega3_done   BOOLEAN DEFAULT false,
  whey_done     BOOLEAN DEFAULT false,
  magie_done    BOOLEAN DEFAULT false,
  zinc_done     BOOLEAN DEFAULT false,

  -- Water (cups of 300ml)
  water_cups    INTEGER DEFAULT 0 CHECK (water_cups BETWEEN 0 AND 15),

  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, date)
);

-- ── 3. WEIGHT LOGS ───────────────────────────────────────────
CREATE TABLE public.weight_logs (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID    REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date        DATE    NOT NULL,
  weight      NUMERIC(5,2) NOT NULL CHECK (weight > 0),
  created_at  TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, date)
);

-- ── 4. DAY OVERRIDES ─────────────────────────────────────────
-- Lets user override the auto-detected plan for a specific date
CREATE TABLE public.day_overrides (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID    REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date        DATE    NOT NULL,
  plan_key    TEXT    NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, date)
);

-- ── 5. UPDATED_AT TRIGGER ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_meal_tracking_updated_at
  BEFORE UPDATE ON public.meal_tracking
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ── 6. AUTO-CREATE PROFILE ON SIGNUP ─────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── 7. ROW LEVEL SECURITY ────────────────────────────────────
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_overrides ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Own profile only" ON public.profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- meal_tracking
CREATE POLICY "Own meal tracking only" ON public.meal_tracking
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- weight_logs
CREATE POLICY "Own weight logs only" ON public.weight_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- day_overrides
CREATE POLICY "Own day overrides only" ON public.day_overrides
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── 8. REALTIME (enable for live sync across devices) ─────────
-- Run in Supabase Dashboard → Database → Replication
-- Or uncomment below:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.meal_tracking;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.weight_logs;
