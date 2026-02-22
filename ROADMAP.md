# Homes Platform Roadmap

## Phase 1: MVP (Weeks 1-3)
- [ ] Landing page with search bar, featured listings, CBI spotlight
- [ ] Search page with filters (district, type, price, beds, CBI)
- [ ] Listing detail page (photo gallery, details, map, inquiry form)
- [ ] CBI property showcase page
- [ ] Buying guide for foreign buyers
- [ ] Alien Landholding License explainer
- [ ] Agent registration + basic profile
- [ ] Seed 50+ real listings from research
- [ ] Vercel/Cloudflare deployment + CNAME
- [ ] Privacy policy + terms

## Phase 2: Agent Tools (Weeks 4-5)
- [ ] Agent dashboard (stats, recent inquiries)
- [ ] Listing management (add, edit, renew, archive)
- [ ] Multi-photo upload (up to 20 per listing)
- [ ] Lead/inquiry management
- [ ] Listing performance analytics

## Phase 3: Revenue (Weeks 6-7)
- [ ] Stripe subscription for agents (Free/Pro/Premium)
- [ ] Featured listing purchase
- [ ] CBI premium listing option
- [ ] Billing page with Stripe portal
- [ ] District area profiles (10 districts)

## Phase 4: Buyer Tools (Weeks 8-10)
- [ ] Saved searches + listing alerts
- [ ] Favorites/wishlist
- [ ] Mortgage calculator
- [ ] Price history/trends
- [ ] Map search view (Leaflet with property markers)

## Phase 5: Scale (Weeks 11+)
- [ ] Virtual tour integration
- [ ] Agent verified badge system
- [ ] CBI concierge service
- [ ] International buyer landing pages (by nationality)
- [ ] Integration with CBI page on stlucia.studio

## Key Decisions

| Decision | Options | Chosen | Why |
|----------|---------|--------|-----|
| Frontend | Vanilla HTML, Next.js | Vanilla HTML | SEO-critical, match ecosystem |
| Maps | Google Maps, Leaflet | Leaflet | Free, already used in guide |
| Photos | Cloudinary, Supabase | Supabase Storage | Already integrated |
| Seed data | Manual, scrape, AI | Research + manual | Accuracy critical for RE |
