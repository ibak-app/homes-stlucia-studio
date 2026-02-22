-- ============================================
-- Homes by St. Lucia Studio — Database Schema
-- Tables: homes_agents, homes_listings, homes_inquiries, homes_favorites, homes_alerts
-- ============================================

-- Real estate agents
CREATE TABLE IF NOT EXISTS homes_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  district TEXT,
  bio TEXT,
  logo_url TEXT,
  website TEXT,
  license_number TEXT,
  subscription_tier TEXT DEFAULT 'free', -- free, pro, premium
  status TEXT DEFAULT 'pending' -- pending, active, suspended
);

-- Property listings
CREATE TABLE IF NOT EXISTS homes_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  agent_id UUID REFERENCES homes_agents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  property_type TEXT NOT NULL DEFAULT 'house', -- house, villa, apartment, condo, land, commercial
  listing_type TEXT NOT NULL DEFAULT 'sale', -- sale, rent
  price_ec INTEGER,
  price_usd INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  sqft INTEGER,
  lot_sqft INTEGER,
  year_built INTEGER,
  address TEXT,
  area TEXT,
  district TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  photo_urls TEXT[],
  features TEXT[],
  cbi_eligible BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active', -- active, sold, rented, pending, archived
  views INTEGER DEFAULT 0
);

-- Buyer inquiries
CREATE TABLE IF NOT EXISTS homes_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  listing_id UUID REFERENCES homes_listings(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES homes_agents(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' -- new, read, replied
);

-- Saved/favorite listings
CREATE TABLE IF NOT EXISTS homes_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES homes_listings(id) ON DELETE CASCADE,
  UNIQUE(user_id, listing_id)
);

-- Price/listing alerts
CREATE TABLE IF NOT EXISTS homes_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  district TEXT,
  property_type TEXT,
  listing_type TEXT,
  min_price INTEGER,
  max_price INTEGER,
  bedrooms INTEGER,
  is_active BOOLEAN DEFAULT true
);

-- CBI-approved projects tracking
CREATE TABLE IF NOT EXISTS homes_cbi_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  developer TEXT,
  district TEXT,
  min_investment_usd INTEGER,
  ownership_type TEXT, -- shared, sole
  description TEXT,
  photo_url TEXT,
  website TEXT,
  ciu_approved BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' -- active, sold_out, coming_soon
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_homes_listings_district ON homes_listings(district);
CREATE INDEX IF NOT EXISTS idx_homes_listings_type ON homes_listings(property_type);
CREATE INDEX IF NOT EXISTS idx_homes_listings_listing_type ON homes_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_homes_listings_status ON homes_listings(status);
CREATE INDEX IF NOT EXISTS idx_homes_listings_cbi ON homes_listings(cbi_eligible) WHERE cbi_eligible = true;
CREATE INDEX IF NOT EXISTS idx_homes_listings_featured ON homes_listings(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_homes_listings_agent ON homes_listings(agent_id);
CREATE INDEX IF NOT EXISTS idx_homes_agents_user ON homes_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_homes_agents_status ON homes_agents(status);
CREATE INDEX IF NOT EXISTS idx_homes_inquiries_agent ON homes_inquiries(agent_id);
CREATE INDEX IF NOT EXISTS idx_homes_favorites_user ON homes_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_homes_alerts_user ON homes_alerts(user_id);

-- RLS Policies
ALTER TABLE homes_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE homes_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homes_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE homes_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE homes_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE homes_cbi_projects ENABLE ROW LEVEL SECURITY;

-- Agents: public read for active, owners can update
CREATE POLICY "Public can view active agents" ON homes_agents FOR SELECT USING (status = 'active');
CREATE POLICY "Agents can update own profile" ON homes_agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can register as agent" ON homes_agents FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Listings: public read for active, agents can manage their own
CREATE POLICY "Public can view active listings" ON homes_listings FOR SELECT USING (status = 'active');
CREATE POLICY "Agents can insert listings" ON homes_listings FOR INSERT WITH CHECK (
  agent_id IN (SELECT id FROM homes_agents WHERE user_id = auth.uid())
);
CREATE POLICY "Agents can update own listings" ON homes_listings FOR UPDATE USING (
  agent_id IN (SELECT id FROM homes_agents WHERE user_id = auth.uid())
);
CREATE POLICY "Agents can delete own listings" ON homes_listings FOR DELETE USING (
  agent_id IN (SELECT id FROM homes_agents WHERE user_id = auth.uid())
);

-- Inquiries: anyone can insert, agents can read their own
CREATE POLICY "Anyone can submit inquiry" ON homes_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Agents can read their inquiries" ON homes_inquiries FOR SELECT USING (
  agent_id IN (SELECT id FROM homes_agents WHERE user_id = auth.uid())
);

-- Favorites: users manage their own
CREATE POLICY "Users can view own favorites" ON homes_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON homes_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON homes_favorites FOR DELETE USING (auth.uid() = user_id);

-- Alerts: users manage their own
CREATE POLICY "Users can view own alerts" ON homes_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create alerts" ON homes_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete alerts" ON homes_alerts FOR DELETE USING (auth.uid() = user_id);

-- CBI projects: public read
CREATE POLICY "Public can view CBI projects" ON homes_cbi_projects FOR SELECT USING (true);

-- Slug generation trigger
CREATE OR REPLACE FUNCTION homes_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS homes_listings_slug_trigger ON homes_listings;
CREATE TRIGGER homes_listings_slug_trigger
  BEFORE INSERT ON homes_listings
  FOR EACH ROW EXECUTE FUNCTION homes_generate_slug();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION homes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS homes_listings_updated ON homes_listings;
CREATE TRIGGER homes_listings_updated BEFORE UPDATE ON homes_listings FOR EACH ROW EXECUTE FUNCTION homes_updated_at();

DROP TRIGGER IF EXISTS homes_agents_updated ON homes_agents;
CREATE TRIGGER homes_agents_updated BEFORE UPDATE ON homes_agents FOR EACH ROW EXECUTE FUNCTION homes_updated_at();
