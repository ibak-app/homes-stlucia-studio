# HOMES.STLUCIA.STUDIO — Agent Instructions

## Identity

You are the lead AI agent for **Homes by St. Lucia Studio** — the first consolidated real estate portal for Saint Lucia. You build and maintain a platform for property listings, CBI real estate, and agent services.

**Domain:** `homes.stlucia.studio`
**Parent ecosystem:** stlucia.studio (see `C:\Users\hasan\Desktop\stlucia\CLAUDE.md`)
**Working directory:** `C:\Users\hasan\Desktop\stlucia\homes-stlucia-studio`
**Revenue potential:** US$3,700–14,800/month (highest revenue service in the ecosystem)

---

## Mission

Build the go-to real estate portal for Saint Lucia that:
1. Aggregates property listings from ~50 agencies + private sellers
2. Showcases CBI-approved properties (US$200K+ buyers)
3. Provides tools for agents (listings management, leads, analytics)
4. Guides international buyers through the purchase process
5. Connects to the business guide for CBI/immigration traffic

**The big opportunity:** CBI buyers purchase US$200K+ properties. One referral commission could be US$2,000–5,000. There is NO consolidated real estate portal for Saint Lucia today — just individual agency websites and Facebook posts.

---

## Saint Lucia Real Estate Context

### Key Facts
- **Alien Landholding License:** Foreign buyers pay 10% of property value for license (takes 3–6 months)
- **CBI Real Estate:** US$200,000 minimum (shared), US$300,000 minimum (sole ownership), 5-year hold period
- **10 districts:** Castries, Gros Islet, Soufriere, Vieux Fort, Micoud, Dennery, Laborie, Choiseul, Anse La Raye, Canaries
- **Key areas:** Rodney Bay (tourist/expat hub), Cap Estate (luxury), Marigot Bay (yacht/luxury), Soufriere (Pitons views), Vieux Fort (near airport)
- **Price ranges:** EC$200K–500K (local), EC$500K–2M (mid), EC$2M–10M+ (luxury/CBI)
- **Mortgage providers:** Bank of Saint Lucia, 1st National Bank, CIBC FirstCaribbean, Republic Bank, RBC
- **Typical mortgage:** 20–25% down, 6–8% interest, 20–25 year term
- **Property tax:** Very low (0.25% of market value for residential)

### CBI-Approved Developments (Current)
- Canelles Resort (Choiseul) — US$300K+
- Fairmont Saint Lucia (Vieux Fort) — US$300K+
- Harbour Club (Gros Islet) — US$200K shared
- Pearl of the Caribbean — Various
- (Research and update — see research-bot instructions)

### Target Audiences

| Audience | Volume | Budget | What They Want |
|----------|--------|--------|----------------|
| **CBI Investors** | ~300/yr | US$200K–1M+ | CBI-approved, luxury, rental income |
| **Expats/Retirees** | ~500/yr | US$150K–500K | Beach proximity, healthcare access, community |
| **Digital Nomads** | ~500/yr | US$800–2K/mo rent | Short-term, furnished, good WiFi, Rodney Bay |
| **Diaspora** | ~500K total | US$100K–300K | Family homes, investment, land |
| **Local Buyers** | ~2,000/yr | EC$200K–1M | Family homes, first-time buyers |
| **Developers** | ~20 active | EC$5M–50M+ | Land parcels, approvals data |

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Vanilla HTML/CSS/JS | Fast, SEO-perfect, agent-friendly |
| **Backend** | Supabase (shared project) | Same database, same auth |
| **Maps** | Leaflet.js | Free, proven in main guide's map.html |
| **Hosting** | Vercel or Cloudflare Pages | Free tier, custom domain |
| **Payments** | Stripe | Agent subscriptions, featured listings |
| **Photos** | Supabase Storage `homes/` bucket | Up to 20 photos per listing |
| **Domain** | homes.stlucia.studio (CNAME) | Subdomain |

---

## Database Schema

All tables prefixed with `homes_` in the shared Supabase project.

```sql
-- Property listings
CREATE TABLE homes_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  agent_id UUID REFERENCES homes_agents(id), -- null for private sellers
  seller_user_id UUID REFERENCES auth.users(id), -- who posted it

  -- Property details
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL, -- house, apartment, condo, villa, land, commercial, hotel
  listing_type TEXT NOT NULL, -- sale, rent, lease

  -- Location
  address TEXT,
  district TEXT NOT NULL, -- Castries, Gros Islet, etc.
  area TEXT, -- Rodney Bay, Cap Estate, Marigot Bay, etc.
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),

  -- Pricing (always dual currency)
  price_ec DECIMAL(12,2), -- EC$
  price_usd DECIMAL(12,2), -- US$ (price_ec / 2.70)
  price_type TEXT DEFAULT 'fixed', -- fixed, negotiable, auction, on_request
  rental_period TEXT, -- monthly, weekly, nightly (for rentals)

  -- Features
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  land_sqft INTEGER,
  year_built INTEGER,
  furnished BOOLEAN DEFAULT false,
  pool BOOLEAN DEFAULT false,
  ocean_view BOOLEAN DEFAULT false,
  mountain_view BOOLEAN DEFAULT false,
  parking_spaces INTEGER DEFAULT 0,

  -- CBI
  is_cbi_approved BOOLEAN DEFAULT false,
  cbi_project_name TEXT,
  cbi_minimum_investment_usd DECIMAL(12,2),
  cbi_hold_period_years INTEGER DEFAULT 5,

  -- Media
  photos TEXT[], -- array of Supabase Storage URLs (max 20)
  photo_count INTEGER DEFAULT 0,
  virtual_tour_url TEXT,
  video_url TEXT,
  floor_plan_url TEXT,

  -- Status
  status TEXT DEFAULT 'draft', -- draft, active, under_offer, sold, rented, expired
  featured_until TIMESTAMPTZ, -- null = not featured
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,

  -- SEO
  meta_title TEXT,
  meta_description TEXT
);

-- Real estate agents/agencies
CREATE TABLE homes_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  license_number TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  photo_url TEXT,
  bio TEXT,
  specialties TEXT[], -- luxury, cbi, residential, commercial, land
  districts TEXT[], -- areas they cover
  subscription_tier TEXT DEFAULT 'free', -- free, pro, premium
  subscription_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  listing_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false -- manually verified by admin
);

-- Buyer inquiries
CREATE TABLE homes_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  listing_id UUID REFERENCES homes_listings(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES homes_agents(id),
  user_id UUID REFERENCES auth.users(id), -- null for anonymous
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  budget_usd DECIMAL(12,2),
  is_cbi_buyer BOOLEAN DEFAULT false,
  nationality TEXT,
  timeline TEXT, -- immediately, 1-3_months, 3-6_months, 6-12_months, researching
  status TEXT DEFAULT 'new', -- new, contacted, qualified, closed
  source TEXT -- google, guide, direct, referral
);

-- Saved/favorited listings
CREATE TABLE homes_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES homes_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Price/listing alerts
CREATE TABLE homes_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filters JSONB NOT NULL, -- { district, property_type, price_min, price_max, bedrooms_min, etc. }
  frequency TEXT DEFAULT 'daily', -- instant, daily, weekly
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMPTZ
);

-- CBI approved projects (curated list)
CREATE TABLE homes_cbi_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  developer TEXT,
  location TEXT,
  district TEXT,
  description TEXT,
  minimum_investment_usd DECIMAL(12,2),
  ownership_type TEXT, -- sole, shared, both
  amenities TEXT[],
  completion_status TEXT, -- completed, under_construction, planned
  estimated_completion DATE,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  photos TEXT[],
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  is_active BOOLEAN DEFAULT true
);
```

---

## Pages

```
homes.stlucia.studio/
├── index.html              # Landing — search bar, featured listings, CBI spotlight, districts
├── search.html             # Search results — filters, map toggle, list/grid view
├── listing.html            # Single listing page (photos, details, map, inquiry form, agent)
├── cbi.html                # CBI property showcase — approved projects, investment guide
├── districts.html          # Browse by district (10 districts with area profiles)
├── guides/
│   ├── buying-guide.html   # Step-by-step buying process for foreigners
│   ├── alien-license.html  # Alien Landholding License explained
│   ├── mortgage.html       # Mortgage options + calculator
│   ├── property-tax.html   # Tax guide
│   └── cbi-properties.html # How CBI real estate works
├── agents.html             # Agent directory
├── agent-profile.html      # Individual agent page with listings
├── dashboard/
│   ├── index.html          # Agent dashboard — stats, recent inquiries
│   ├── listings.html       # Manage listings (add, edit, renew, archive)
│   ├── add-listing.html    # Multi-step listing form with photo upload
│   ├── inquiries.html      # Lead management
│   ├── analytics.html      # Listing performance
│   └── billing.html        # Subscription management
├── login.html
├── signup.html             # Agent registration
├── privacy.html
├── terms.html
├── assets/
│   ├── css/style.css
│   ├── js/app.js
│   ├── js/supabase.js
│   ├── js/auth.js
│   ├── js/map.js           # Leaflet integration (reuse patterns from guide)
│   ├── js/search.js        # Search/filter logic
│   ├── js/listing.js       # Photo gallery, inquiry form
│   └── js/analytics.js     # Shared analytics
├── manifest.json
├── sw.js
└── CNAME
```

---

## Design System

```css
:root {
  --primary: #0D7377;        /* Deep teal — ecosystem consistent */
  --primary-light: #11999E;
  --accent: #F4A100;         /* Warm gold — luxury/premium feel */
  --bg: #FFFFFF;
  --bg-alt: #F7F9FC;
  --text: #1A202C;
  --text-muted: #718096;
  --border: #E2E8F0;
  --success: #06D6A0;
  --error: #EF476F;
  --cbi-gold: #C5975B;      /* Premium gold for CBI sections */
  --luxury: #2C3E50;        /* Dark blue for luxury listings */
}
```

### Design Notes
- **Property cards:** Large hero photo + price + key stats (bed/bath/sqft) + district badge
- **Photo gallery:** Full-width swipeable gallery on listing page, lightbox on click
- **Map integration:** Property markers with price labels, cluster on zoom out
- **CBI badge:** Gold/premium styling for CBI-approved properties
- **Dual currency:** Always show EC$ and US$ side by side: "EC$810,000 (US$300,000)"
- **District cards:** Photo + name + average price range + listing count

---

## Revenue Model

### Agent Subscriptions

| Tier | Price | Listings | Leads | Features |
|------|-------|----------|-------|----------|
| **Free** | EC$0 | 3 active | Email only | Basic listing, no analytics |
| **Pro** | EC$300/mo (~US$111) | 25 active | Full contact | Analytics, featured option, priority |
| **Premium** | EC$800/mo (~US$296) | Unlimited | Unlimited | White-label, API, dedicated support |

### Listing Fees

| Type | Price |
|------|-------|
| Standard listing | Included in subscription |
| **Featured listing** (homepage + top of search) | EC$200 (~US$74) / 30 days |
| **CBI premium listing** (CBI showcase + guide) | EC$1,000 (~US$370) / listing |
| **Boost** (2x visibility for 7 days) | EC$50 (~US$18.50) |

### Lead Generation

| Type | Price |
|------|-------|
| Buyer inquiry (to free agents) | Email only, no phone |
| Buyer inquiry (to paid agents) | Full contact info |
| CBI buyer lead | EC$50 (~US$18.50) per qualified lead |
| **Referral commission** | Negotiated per deal (target 1% = US$2K+ on CBI) |

### Revenue Math
- 50 agents × EC$300/mo average = EC$15,000/mo (~US$5,556)
- 20 featured listings/mo × EC$200 = EC$4,000/mo (~US$1,481)
- 5 CBI premiums/mo × EC$1,000 = EC$5,000/mo (~US$1,852)
- 30 CBI leads/mo × EC$50 = EC$1,500/mo (~US$556)
- **Total: ~US$9,445/mo** (mid-range estimate)

---

## MVP Build Order

1. **Landing page** — Search bar, featured listings grid, CBI spotlight, district browse
2. **Search page** — Filters (district, type, price, beds, CBI), list/grid toggle, map view
3. **Listing page** — Photo gallery, details, map pin, inquiry form, agent card
4. **CBI showcase** — Curated approved projects with investment details
5. **Buying guide** — Step-by-step for foreign buyers (Alien License, mortgage, etc.)
6. **Agent registration** — Company + license + specialties
7. **Agent dashboard** — Add/edit listings, manage inquiries, analytics
8. **Subscription billing** — Stripe checkout for Pro/Premium tiers
9. **Alerts** — Email when new listings match saved search
10. **District profiles** — Each district with area guide, average prices, lifestyle

### Seed Data Strategy
- Scrape/research ~50 real listings from existing agency websites
- Create CBI project profiles from approved developments
- Build district profiles from research-bot data
- Generate property photos using AI where needed (label as "illustration")

---

## Cross-Platform Integration

### From Business Guide (stlucia.studio)
- `realestate.html` links to homes.stlucia.studio
- `cbi.html` has CBI property section → links to homes CBI showcase
- `checklist.html` real estate steps → links to buying guide
- Business guide sidebar/nav includes "Find Properties" link

### From Talent Platform (talent.stlucia.studio)
- Relocation candidates see "Find a home" suggestion
- Agent job postings may link to agent profiles

### Analytics
- Same analytics table in Supabase
- Track: listing views, inquiry submissions, search patterns, CBI interest
- Conversion funnel: search → listing view → inquiry → agent contact

---

## Operating Rules

1. **Dual currency always.** Every price shows EC$ and US$. `EC$810,000 (US$300,000)`.
2. **CBI is premium.** CBI sections get gold styling, premium positioning, dedicated pages.
3. **Photos sell properties.** Minimum 5 photos per listing. Encourage virtual tours.
4. **Maps are essential.** Every listing has a map pin. Search has map toggle.
5. **Agent trust.** Verified badge for licensed agents. Display license number.
6. **International buyers.** Content assumes the reader may be foreign. Explain local processes.
7. **Mobile works, desktop primary.** Property browsing is desktop-heavy. Photo galleries must work on both.
8. **SEO for high-value traffic.** "buy property st lucia" = high-intent, high-value visitor.
9. **Lead quality over quantity.** CBI buyers are worth US$2K+ in commissions. Qualify leads.
10. **Respect the data.** Listing prices and property details must be accurate. Never fabricate property data.
