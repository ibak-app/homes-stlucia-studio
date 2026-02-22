/* ============================================
   Homes by St. Lucia Studio — Supabase Client
   Shared project: edybhgkuttsyoouizwcw.supabase.co
   ============================================ */

var SUPABASE_URL = 'https://edybhgkuttsyoouizwcw.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkeWJoZ2t1dHRzeW9vdWl6d2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDI2MTQsImV4cCI6MjA4NjU3ODYxNH0.qaLYTfJQDz8Tp2WBqCLhKKaSs_lBSAvQ3W2h4v2L0xA';

var db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey: 'homes-stlucia-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/* ========================================
   AUTH HELPERS
   ======================================== */
var Auth = {
  async getSession() {
    var result = await db.auth.getSession();
    return (result.data && result.data.session) ? result.data.session : null;
  },

  async getUser() {
    var result = await db.auth.getUser();
    return (result.data && result.data.user) ? result.data.user : null;
  },

  async signUp(email, password, meta) {
    return await db.auth.signUp({
      email: email,
      password: password,
      options: { data: meta || {} }
    });
  },

  async signIn(email, password) {
    return await db.auth.signInWithPassword({ email: email, password: password });
  },

  async signOut() {
    return await db.auth.signOut();
  },

  async resetPassword(email) {
    return await db.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://homes.stlucia.studio/reset-password.html'
    });
  },

  onAuthChange(callback) {
    return db.auth.onAuthStateChange(callback);
  },

  async requireAuth() {
    var session = await this.getSession();
    if (!session) {
      var returnTo = encodeURIComponent(window.location.href);
      window.location.href = 'https://talent.stlucia.studio/login.html?redirect=' + returnTo;
      return null;
    }
    return session;
  }
};

/* ========================================
   LISTINGS
   ======================================== */
var Listings = {
  async getAll(filters) {
    var query = db.from('homes_listings')
      .select('*, homes_agents(company_name, logo_url)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters) {
      if (filters.district) query = query.eq('district', filters.district);
      if (filters.type) query = query.eq('property_type', filters.type);
      if (filters.listing_type) query = query.eq('listing_type', filters.listing_type);
      if (filters.min_price) query = query.gte('price_ec', filters.min_price);
      if (filters.max_price) query = query.lte('price_ec', filters.max_price);
      if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms);
      if (filters.cbi_eligible) query = query.eq('cbi_eligible', true);
      if (filters.limit) query = query.limit(filters.limit);
    }

    return await query;
  },

  async getById(id) {
    return await db.from('homes_listings')
      .select('*, homes_agents(id, company_name, contact_name, phone, email, logo_url, district)')
      .eq('id', id)
      .single();
  },

  async getBySlug(slug) {
    return await db.from('homes_listings')
      .select('*, homes_agents(id, company_name, contact_name, phone, email, logo_url, district)')
      .eq('slug', slug)
      .single();
  },

  async getFeatured(limit) {
    return await db.from('homes_listings')
      .select('*, homes_agents(company_name)')
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit || 6);
  },

  async getCBI(limit) {
    return await db.from('homes_listings')
      .select('*, homes_agents(company_name)')
      .eq('status', 'active')
      .eq('cbi_eligible', true)
      .order('price_usd', { ascending: true })
      .limit(limit || 6);
  },

  async search(term) {
    return await db.from('homes_listings')
      .select('id, title, slug, district, area, price_ec, price_usd, property_type, listing_type, bedrooms, bathrooms, photo_urls')
      .eq('status', 'active')
      .or('title.ilike.%' + term + '%,district.ilike.%' + term + '%,area.ilike.%' + term + '%,description.ilike.%' + term + '%')
      .order('is_featured', { ascending: false })
      .limit(20);
  },

  async create(listing) {
    return await db.from('homes_listings').insert(listing).select().single();
  },

  async update(id, data) {
    return await db.from('homes_listings').update(data).eq('id', id).select().single();
  },

  async getByAgent(agentId, limit) {
    var query = db.from('homes_listings')
      .select('id, title, slug, district, area, price_ec, price_usd, property_type, listing_type, bedrooms, bathrooms, photo_urls, cbi_eligible')
      .eq('agent_id', agentId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (limit) query = query.limit(limit);
    return await query;
  },

  async getStats() {
    var results = await Promise.all([
      db.from('homes_listings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      db.from('homes_agents').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      db.from('homes_listings').select('id', { count: 'exact', head: true }).eq('status', 'active').eq('cbi_eligible', true)
    ]);
    return {
      listings: (results[0] && results[0].count) || 0,
      agents: (results[1] && results[1].count) || 0,
      cbi: (results[2] && results[2].count) || 0
    };
  }
};

/* ========================================
   AGENTS (Real Estate Agents)
   ======================================== */
var Agents = {
  async getAll() {
    return await db.from('homes_agents')
      .select('*')
      .eq('status', 'active')
      .order('company_name');
  },

  async getById(id) {
    return await db.from('homes_agents')
      .select('*')
      .eq('id', id)
      .single();
  },

  async getProfile(userId) {
    return await db.from('homes_agents')
      .select('*')
      .eq('user_id', userId)
      .single();
  },

  async register(agent) {
    return await db.from('homes_agents').insert(agent).select().single();
  },

  async update(id, data) {
    return await db.from('homes_agents').update(data).eq('id', id).select().single();
  }
};

/* ========================================
   INQUIRIES
   ======================================== */
var Inquiries = {
  async create(inquiry) {
    return await db.from('homes_inquiries').insert(inquiry).select().single();
  },

  async getForAgent(agentId) {
    return await db.from('homes_inquiries')
      .select('*, homes_listings(title, slug)')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
  }
};

/* ========================================
   FAVORITES / SAVED
   ======================================== */
var Favorites = {
  async getAll(userId) {
    return await db.from('homes_favorites')
      .select('*, homes_listings(id, title, slug, price_ec, price_usd, district, photo_urls, property_type)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async add(userId, listingId) {
    return await db.from('homes_favorites')
      .insert({ user_id: userId, listing_id: listingId })
      .select().single();
  },

  async remove(userId, listingId) {
    return await db.from('homes_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);
  },

  async check(userId, listingId) {
    var result = await db.from('homes_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .single();
    return !!(result.data);
  }
};

/* ========================================
   ALERTS
   ======================================== */
var Alerts = {
  async create(alert) {
    return await db.from('homes_alerts').insert(alert).select().single();
  },

  async getForUser(userId) {
    return await db.from('homes_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async remove(id) {
    return await db.from('homes_alerts').delete().eq('id', id);
  }
};

/* ========================================
   ANALYTICS
   ======================================== */
var Track = {
  async event(type, meta) {
    try {
      await db.from('analytics').insert({
        event_type: type,
        hostname: 'homes.stlucia.studio',
        pathname: window.location.pathname,
        referrer: document.referrer || null,
        metadata: meta || {},
        created_at: new Date().toISOString()
      });
    } catch (e) { /* silent */ }
  }
};

/* ========================================
   PHOTO UPLOAD
   ======================================== */
var Photos = {
  async upload(file, listingId) {
    var ext = file.name.split('.').pop().toLowerCase();
    var path = listingId + '/' + Date.now() + '.' + ext;
    var result = await db.storage.from('homes').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });
    if (result.error) return { error: result.error };
    var publicUrl = db.storage.from('homes').getPublicUrl(path);
    return { data: { path: path, url: publicUrl.data.publicUrl } };
  },

  async remove(path) {
    return await db.storage.from('homes').remove([path]);
  },

  getUrl(path) {
    return db.storage.from('homes').getPublicUrl(path).data.publicUrl;
  }
};

/* ========================================
   HELPERS
   ======================================== */
function escapeHtml(str) {
  var d = document.createElement('div');
  d.textContent = String(str || '');
  return d.innerHTML;
}

function formatEC(amount) {
  if (!amount) return 'Price on request';
  return 'EC$' + Number(amount).toLocaleString();
}

function formatUSD(amount) {
  if (!amount) return '';
  return 'US$' + Number(amount).toLocaleString();
}

function ecToUsd(ec) {
  return Math.round(ec / 2.70);
}
