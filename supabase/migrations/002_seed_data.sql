-- ============================================
-- Homes Seed Data — Sample Agents & Listings
-- Run once to populate demo content
-- ============================================

-- Sample agents (no real user_id — these are display-only until real agents register)
INSERT INTO homes_agents (id, company_name, contact_name, email, phone, district, bio, license_number, subscription_tier, status) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Island Realty Ltd', 'Michelle Joseph', 'info@stlucia.studio', '+1 758 452-1000', 'Castries', 'Leading real estate agency in Saint Lucia with over 15 years experience. Specialising in residential, commercial, and CBI-approved properties across the island.', 'SL-RE-2019-0045', 'pro', 'active'),
  ('a1000000-0000-0000-0000-000000000002', 'Pitons Property Group', 'David Charlemagne', 'info@stlucia.studio', '+1 758 459-2000', 'Soufriere', 'Boutique agency focused on Soufriere and the South. Experts in luxury villas, beachfront properties, and CBI investment opportunities near the Pitons UNESCO site.', 'SL-RE-2020-0112', 'pro', 'active'),
  ('a1000000-0000-0000-0000-000000000003', 'Caribbean Home Finders', 'Keisha Williams', 'info@stlucia.studio', '+1 758 450-3000', 'Gros Islet', 'Full-service agency covering Gros Islet, Rodney Bay, and Cap Estate. Helping buyers find their dream Caribbean home since 2017.', 'SL-RE-2017-0078', 'free', 'active')
ON CONFLICT (id) DO NOTHING;

-- Sample listings — realistic Saint Lucia properties
INSERT INTO homes_listings (id, agent_id, title, description, property_type, listing_type, price_ec, bedrooms, bathrooms, sqft, lot_sqft, district, area, features, cbi_eligible, is_featured, status) VALUES
  -- Castries
  ('b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001',
   'Modern 3-Bed Townhouse in Bois d''Orange',
   'Spacious modern townhouse in the sought-after Bois d''Orange neighbourhood. Open-plan living and dining area, fully fitted kitchen with granite countertops, private patio garden, covered parking for 2 vehicles. Walking distance to schools and shopping. Ideal for a young professional family.',
   'house', 'sale', 1350000, 3, 2, 1800, 3500,
   'Castries', 'Bois d''Orange',
   ARRAY['Covered parking', 'Private garden', 'Granite kitchen', 'Security system', 'Water tank'],
   false, true, 'active'),

  -- Gros Islet / Rodney Bay
  ('b1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000003',
   'Luxury 4-Bed Villa with Ocean Views — Cap Estate',
   'Stunning hilltop villa in Cap Estate with panoramic views of the Caribbean Sea and Pigeon Island. Infinity pool, outdoor entertaining pavilion, Italian marble floors, chef''s kitchen, home office, and maid''s quarters. Gated community with 24-hour security.',
   'villa', 'sale', 5400000, 4, 4, 4500, 12000,
   'Gros Islet', 'Cap Estate',
   ARRAY['Infinity pool', 'Ocean views', 'Gated community', '24hr security', 'Marble floors', 'Maid quarters', 'Home office', 'Generator'],
   true, true, 'active'),

  ('b1000000-0000-0000-0000-000000000003',
   'a1000000-0000-0000-0000-000000000003',
   '2-Bed Apartment Near Rodney Bay Marina',
   'Turn-key furnished apartment just minutes from Rodney Bay Marina, restaurants, and nightlife. Modern finishes, balcony with partial sea views, communal pool. Excellent rental income potential — currently generating EC$3,500/month on short-term lets.',
   'apartment', 'sale', 810000, 2, 2, 1100, 0,
   'Gros Islet', 'Rodney Bay',
   ARRAY['Furnished', 'Communal pool', 'Balcony', 'Sea views', 'Rental income', 'Air conditioning'],
   false, true, 'active'),

  ('b1000000-0000-0000-0000-000000000004',
   'a1000000-0000-0000-0000-000000000003',
   'Modern 1-Bed Rental — Rodney Bay Village',
   'Bright, air-conditioned 1-bedroom apartment in the heart of Rodney Bay Village. Fully furnished, fast WiFi, walking distance to beach, restaurants, and JQ Mall. Perfect for digital nomads or young professionals.',
   'apartment', 'rent', 3200, 1, 1, 650, 0,
   'Gros Islet', 'Rodney Bay',
   ARRAY['Furnished', 'WiFi included', 'Air conditioning', 'Walk to beach', 'Laundry'],
   false, false, 'active'),

  -- Soufriere
  ('b1000000-0000-0000-0000-000000000005',
   'a1000000-0000-0000-0000-000000000002',
   'Pitons View Estate — CBI Approved Luxury Villa',
   'Exceptional 5-bedroom luxury estate with unobstructed views of the Pitons. This CBI-approved property qualifies for Saint Lucia citizenship by investment (sole ownership). Tropical gardens, 60-foot lap pool, outdoor kitchen, wine cellar, and private beach access. Recently renovated with hurricane-rated windows and backup solar.',
   'villa', 'sale', 10800000, 5, 5, 6200, 25000,
   'Soufriere', 'Soufriere',
   ARRAY['CBI approved', 'Pitons view', 'Lap pool', 'Private beach access', 'Wine cellar', 'Solar power', 'Hurricane rated', 'Tropical gardens'],
   true, true, 'active'),

  ('b1000000-0000-0000-0000-000000000006',
   'a1000000-0000-0000-0000-000000000002',
   'Charming 2-Bed Cottage — Fond Doux',
   'Authentic stone cottage on the historic Fond Doux Estate. Surrounded by cocoa groves and tropical fruit trees. Two bedrooms, open-air veranda, outdoor shower, and full kitchen. Income-producing vacation rental with established booking history.',
   'house', 'sale', 675000, 2, 1, 950, 5000,
   'Soufriere', 'Fond Doux',
   ARRAY['Historic estate', 'Tropical garden', 'Vacation rental', 'Veranda', 'Mountain views'],
   false, false, 'active'),

  -- Vieux Fort
  ('b1000000-0000-0000-0000-000000000007',
   'a1000000-0000-0000-0000-000000000001',
   'Commercial Lot Near Hewanorra International Airport',
   'Prime 0.75-acre commercial lot on the Vieux Fort highway, 5 minutes from Hewanorra International Airport. Flat, cleared, and ready for development. Ideal for hotel, warehouse, retail, or mixed-use project. All utilities available. Zoned commercial.',
   'land', 'sale', 1620000, NULL, NULL, NULL, 32670,
   'Vieux Fort', 'Vieux Fort',
   ARRAY['Commercial zoned', 'Near airport', 'Flat terrain', 'Utilities available', 'Highway frontage'],
   false, false, 'active'),

  -- Dennery
  ('b1000000-0000-0000-0000-000000000008',
   'a1000000-0000-0000-0000-000000000001',
   'Oceanfront 3-Bed Home — Dennery Village',
   'Solid concrete home directly on the Atlantic coast with dramatic ocean views. Three bedrooms, two bathrooms, large balcony, and detached garage. Great value for a waterfront property. Some renovation recommended to maximise potential.',
   'house', 'sale', 540000, 3, 2, 1600, 4000,
   'Dennery', 'Dennery',
   ARRAY['Oceanfront', 'Balcony', 'Garage', 'Concrete construction', 'Atlantic views'],
   false, false, 'active'),

  -- CBI shared ownership
  ('b1000000-0000-0000-0000-000000000009',
   'a1000000-0000-0000-0000-000000000002',
   'Canelles Resort — CBI Shared Ownership from US$200K',
   'Brand new luxury resort residence in Canelles, South Coast. CBI-approved for shared ownership at US$200,000 minimum investment. Fully managed by international hotel operator. Guaranteed rental returns for 5 years. Choose from 1-bed or 2-bed units with sea views.',
   'condo', 'sale', 540000, 1, 1, 800, 0,
   'Laborie', 'Canelles',
   ARRAY['CBI approved', 'Shared ownership', 'Hotel managed', 'Guaranteed returns', 'Sea views', 'Resort amenities', 'Concierge'],
   true, true, 'active'),

  -- Choiseul
  ('b1000000-0000-0000-0000-000000000010',
   'a1000000-0000-0000-0000-000000000002',
   'Half-Acre Hillside Lot — Choiseul with Sunset Views',
   'Build your dream Caribbean home on this gently sloping half-acre lot in Choiseul. Spectacular westward views over the Caribbean Sea — perfect for sunset living. Water and electricity at the boundary. Quiet, safe neighbourhood. 20 minutes from Soufriere.',
   'land', 'sale', 270000, NULL, NULL, NULL, 21780,
   'Choiseul', 'Choiseul',
   ARRAY['Sunset views', 'Sea views', 'Utilities available', 'Quiet area', 'Near Soufriere'],
   false, false, 'active'),

  -- Micoud rental
  ('b1000000-0000-0000-0000-000000000011',
   'a1000000-0000-0000-0000-000000000001',
   '2-Bed Furnished Rental — Micoud Town',
   'Comfortable 2-bedroom rental in Micoud centre. Fully furnished, air-conditioned master bedroom, tiled throughout, water tank, and covered carport. Close to schools, health centre, and public transport. Available immediately, 6-month minimum.',
   'house', 'rent', 2000, 2, 1, 900, 2500,
   'Micoud', 'Micoud',
   ARRAY['Furnished', 'Air conditioning', 'Water tank', 'Carport', 'Near transport'],
   false, false, 'active'),

  -- Anse La Raye
  ('b1000000-0000-0000-0000-000000000012',
   'a1000000-0000-0000-0000-000000000001',
   'Beachfront Restaurant Property — Anse La Raye',
   'Turnkey beachfront commercial property in the heart of Anse La Raye''s famous Friday Night Fish Fry strip. Currently operating as restaurant/bar with all equipment included. 40 covers inside, 20 on the beach deck. Incredible foot traffic every Friday.',
   'commercial', 'sale', 1080000, NULL, NULL, 2000, 3000,
   'Anse La Raye', 'Anse La Raye',
   ARRAY['Beachfront', 'Operating business', 'Equipment included', 'High foot traffic', 'Liquor license', 'Beach deck'],
   false, false, 'active')
ON CONFLICT (id) DO NOTHING;
