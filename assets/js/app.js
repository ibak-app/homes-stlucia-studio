/* ============================================
   Homes by St. Lucia Studio — Core App Logic
   ============================================ */

(function() {
'use strict';

/* ========================================
   MOBILE NAV
   ======================================== */
var navToggle = document.querySelector('.nav__toggle');
var mobileMenu = document.getElementById('mobile-menu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', function() {
    var open = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ========================================
   NAV SCROLL EFFECT
   ======================================== */
var nav = document.getElementById('nav');
if (nav) {
  var scrollThreshold = 10;
  window.addEventListener('scroll', function() {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });
}

/* ========================================
   TOAST NOTIFICATIONS
   ======================================== */
window.showToast = function(message, type) {
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'toast' + (type ? ' toast--' + type : '');
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  document.body.appendChild(toast);
  requestAnimationFrame(function() { toast.classList.add('show'); });
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3500);
};

/* ========================================
   PROPERTY SEARCH (Landing Page)
   ======================================== */
var searchForm = document.getElementById('hero-search-form');
if (searchForm) {
  /* Buy/Rent tab switching */
  document.querySelectorAll('.hero-search__tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.hero-search__tab').forEach(function(t) {
        t.classList.remove('hero-search__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('hero-search__tab--active');
      this.setAttribute('aria-selected', 'true');
      updatePriceOptions();
    });
  });

  /* CBI toggle */
  var cbiCheckbox = document.getElementById('search-cbi');
  if (cbiCheckbox) {
    cbiCheckbox.addEventListener('change', function() {
      document.getElementById('hero-search')
        .classList.toggle('hero-search--cbi-active', this.checked);
      updatePriceOptions();
    });
  }

  /* Update price options based on listing type + CBI state */
  function updatePriceOptions() {
    var activeTab = document.querySelector('.hero-search__tab--active');
    var listingType = activeTab ? activeTab.dataset.listingType : 'sale';
    var isCBI = document.getElementById('search-cbi') && document.getElementById('search-cbi').checked;
    var priceSelect = document.getElementById('search-price');
    var priceLabel = document.getElementById('search-price-label');
    if (!priceSelect) return;

    while (priceSelect.firstChild) priceSelect.removeChild(priceSelect.firstChild);
    addOption(priceSelect, '', 'Any Price');

    if (listingType === 'rent') {
      if (priceLabel) priceLabel.textContent = 'Monthly Rent (EC$)';
      addOption(priceSelect, '0-2000', 'Under EC$2,000/mo');
      addOption(priceSelect, '2000-5000', 'EC$2,000 - EC$5,000/mo');
      addOption(priceSelect, '5000-10000', 'EC$5,000 - EC$10,000/mo');
      addOption(priceSelect, '10000-', 'EC$10,000+/mo');
    } else if (isCBI) {
      if (priceLabel) priceLabel.textContent = 'Investment Range (US$)';
      addOption(priceSelect, '200000-300000', 'US$200K - US$300K');
      addOption(priceSelect, '300000-500000', 'US$300K - US$500K');
      addOption(priceSelect, '500000-1000000', 'US$500K - US$1M');
      addOption(priceSelect, '1000000-', 'US$1M+');
    } else {
      if (priceLabel) priceLabel.textContent = 'Price Range (EC$)';
      addOption(priceSelect, '0-500000', 'Under EC$500K');
      addOption(priceSelect, '500000-1000000', 'EC$500K - EC$1M');
      addOption(priceSelect, '1000000-2500000', 'EC$1M - EC$2.5M');
      addOption(priceSelect, '2500000-5000000', 'EC$2.5M - EC$5M');
      addOption(priceSelect, '5000000-', 'EC$5M+');
    }
  }

  function addOption(select, value, text) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.textContent = text;
    select.appendChild(opt);
  }

  /* Form submit — builds URL with all filters */
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var params = new URLSearchParams();
    var activeTab = document.querySelector('.hero-search__tab--active');
    params.set('listing_type', activeTab ? activeTab.dataset.listingType : 'sale');

    var district = document.getElementById('search-district');
    var type = document.getElementById('search-type');
    var beds = document.getElementById('search-beds');
    var price = document.getElementById('search-price');
    var cbi = document.getElementById('search-cbi');

    if (district && district.value) params.set('district', district.value);
    if (type && type.value) params.set('type', type.value);
    if (beds && beds.value) params.set('beds', beds.value);
    if (price && price.value) params.set('price', price.value);
    if (cbi && cbi.checked) params.set('cbi', 'true');

    window.location.href = 'listings.html?' + params.toString();
  });
}

/* ========================================
   MORTGAGE CALCULATOR
   ======================================== */
window.calculateMortgage = function() {
  var priceInput = document.getElementById('calc-price');
  var downInput = document.getElementById('calc-down');
  var rateInput = document.getElementById('calc-rate');
  var termInput = document.getElementById('calc-term');
  if (!priceInput || !downInput || !rateInput || !termInput) return;

  var price = parseFloat(priceInput.value) || 0;
  var downPercent = parseFloat(downInput.value) || 20;
  var rate = parseFloat(rateInput.value) || 7;
  var years = parseInt(termInput.value) || 25;

  var down = price * (downPercent / 100);
  var principal = price - down;
  var monthlyRate = (rate / 100) / 12;
  var months = years * 12;
  var monthly = 0;

  if (monthlyRate > 0) {
    monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  } else {
    monthly = principal / months;
  }

  var totalPaid = monthly * months;
  var totalInterest = totalPaid - principal;

  var resultEl = document.getElementById('calc-result');
  if (resultEl) {
    var monthlyEl = resultEl.querySelector('.calc__monthly');
    var monthlyUsdEl = resultEl.querySelector('.calc__monthly-usd');
    if (monthlyEl) monthlyEl.textContent = 'EC$' + Math.round(monthly).toLocaleString() + '/mo';
    if (monthlyUsdEl) monthlyUsdEl.textContent = '~US$' + Math.round(monthly / 2.70).toLocaleString() + '/mo';

    var items = resultEl.querySelectorAll('.calc__item-val');
    if (items[0]) items[0].textContent = 'EC$' + Math.round(down).toLocaleString();
    if (items[1]) items[1].textContent = 'EC$' + Math.round(principal).toLocaleString();
    if (items[2]) items[2].textContent = 'EC$' + Math.round(totalInterest).toLocaleString();
    if (items[3]) items[3].textContent = 'EC$' + Math.round(totalPaid).toLocaleString();

    resultEl.style.display = '';
  }
};

/* ========================================
   LISTING CARD RENDERER
   ======================================== */
window.renderListingCard = function(listing) {
  var card = document.createElement('div');
  card.className = 'listing-card';

  var photoUrl = (listing.photo_urls && listing.photo_urls[0]) || '';
  var photoCount = (listing.photo_urls && listing.photo_urls.length) || 0;
  var priceEC = listing.price_ec ? formatEC(listing.price_ec) : 'Price on request';
  var priceUSD = listing.price_usd ? formatUSD(listing.price_usd) : '';

  var badges = '';
  if (listing.listing_type === 'sale') badges += '<span class="listing-card__badge listing-card__badge--sale">For Sale</span>';
  else if (listing.listing_type === 'rent') badges += '<span class="listing-card__badge listing-card__badge--rent">For Rent</span>';
  if (listing.cbi_eligible) badges += '<span class="listing-card__badge listing-card__badge--cbi">CBI</span>';
  if (listing.is_featured) badges += '<span class="listing-card__badge listing-card__badge--featured">Featured</span>';

  var imgSection = document.createElement('div');
  imgSection.className = 'listing-card__img';
  if (photoUrl) {
    var img = document.createElement('img');
    img.src = photoUrl;
    img.alt = escapeHtml(listing.title);
    img.loading = 'lazy';
    imgSection.appendChild(img);
  } else {
    var placeholder = document.createElement('div');
    placeholder.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e8f4f5,#d1ecee);color:var(--primary);';
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '48');
    svg.setAttribute('height', '48');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M3 9l4-4 4 4M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9M21 9l-4-4-4 4M9 21v-6a1 1 0 011-1h4a1 1 0 011 1v6');
    svg.appendChild(path);
    placeholder.appendChild(svg);
    imgSection.appendChild(placeholder);
  }

  var badgesDiv = document.createElement('div');
  badgesDiv.className = 'listing-card__badges';
  if (listing.listing_type === 'sale') {
    var saleBadge = document.createElement('span');
    saleBadge.className = 'listing-card__badge listing-card__badge--sale';
    saleBadge.textContent = 'For Sale';
    badgesDiv.appendChild(saleBadge);
  } else if (listing.listing_type === 'rent') {
    var rentBadge = document.createElement('span');
    rentBadge.className = 'listing-card__badge listing-card__badge--rent';
    rentBadge.textContent = 'For Rent';
    badgesDiv.appendChild(rentBadge);
  }
  if (listing.cbi_eligible) {
    var cbiBadge = document.createElement('span');
    cbiBadge.className = 'listing-card__badge listing-card__badge--cbi';
    cbiBadge.textContent = 'CBI';
    badgesDiv.appendChild(cbiBadge);
  }
  imgSection.appendChild(badgesDiv);

  if (photoCount > 1) {
    var photoCountEl = document.createElement('span');
    photoCountEl.className = 'listing-card__photos';
    photoCountEl.textContent = photoCount + ' photos';
    imgSection.appendChild(photoCountEl);
  }

  var body = document.createElement('div');
  body.className = 'listing-card__body';

  var priceEl = document.createElement('div');
  priceEl.className = 'listing-card__price';
  priceEl.textContent = priceEC;
  body.appendChild(priceEl);

  if (priceUSD) {
    var priceUsdEl = document.createElement('div');
    priceUsdEl.className = 'listing-card__price-usd';
    priceUsdEl.textContent = priceUSD;
    body.appendChild(priceUsdEl);
  }

  var titleEl = document.createElement('div');
  titleEl.className = 'listing-card__title';
  var titleLink = document.createElement('a');
  titleLink.href = 'listing.html?id=' + listing.id;
  titleLink.textContent = listing.title;
  titleLink.style.color = 'inherit';
  titleEl.appendChild(titleLink);
  body.appendChild(titleEl);

  var locEl = document.createElement('div');
  locEl.className = 'listing-card__location';
  locEl.textContent = [listing.area, listing.district].filter(Boolean).join(', ');
  body.appendChild(locEl);

  var specs = document.createElement('div');
  specs.className = 'listing-card__specs';
  if (listing.bedrooms != null) {
    var bedSpec = document.createElement('span');
    bedSpec.className = 'listing-card__spec';
    bedSpec.textContent = listing.bedrooms + ' bed';
    specs.appendChild(bedSpec);
  }
  if (listing.bathrooms != null) {
    var bathSpec = document.createElement('span');
    bathSpec.className = 'listing-card__spec';
    bathSpec.textContent = listing.bathrooms + ' bath';
    specs.appendChild(bathSpec);
  }
  if (listing.sqft) {
    var sqftSpec = document.createElement('span');
    sqftSpec.className = 'listing-card__spec';
    sqftSpec.textContent = Number(listing.sqft).toLocaleString() + ' sqft';
    specs.appendChild(sqftSpec);
  }
  body.appendChild(specs);

  card.appendChild(imgSection);
  card.appendChild(body);

  card.addEventListener('click', function(e) {
    if (e.target.tagName !== 'A') {
      window.location.href = 'listing.html?id=' + listing.id;
    }
  });
  card.style.cursor = 'pointer';

  return card;
};

/* ========================================
   LOAD FEATURED LISTINGS (Landing)
   ======================================== */
var featuredGrid = document.getElementById('featured-grid');
if (featuredGrid && typeof Listings !== 'undefined') {
  Listings.getFeatured(6).then(function(result) {
    if (result.data && result.data.length) {
      featuredGrid.textContent = '';
      result.data.forEach(function(listing) {
        featuredGrid.appendChild(renderListingCard(listing));
      });
    }
  });
}

/* ========================================
   LOAD CBI LISTINGS (Landing)
   ======================================== */
var cbiGrid = document.getElementById('cbi-grid');
if (cbiGrid && typeof Listings !== 'undefined') {
  Listings.getCBI(3).then(function(result) {
    if (result.data && result.data.length) {
      cbiGrid.textContent = '';
      result.data.forEach(function(listing) {
        cbiGrid.appendChild(renderListingCard(listing));
      });
    }
  });
}

/* ========================================
   LOAD STATS (Landing)
   ======================================== */
var statListings = document.getElementById('stat-listings');
var statAgents = document.getElementById('stat-agents');
if (statListings && typeof Listings !== 'undefined') {
  Listings.getStats().then(function(stats) {
    if (statListings) statListings.textContent = stats.listings || '0';
    if (statAgents) statAgents.textContent = stats.agents || '0';
  });
}

/* ========================================
   AUTH STATE (shared across pages)
   ======================================== */
window.App = {
  user: null,
  session: null,

  async init() {
    if (typeof Auth === 'undefined') return;
    var session = await Auth.getSession();
    if (session) {
      this.session = session;
      this.user = session.user;
    }
    this.updateNav();

    Auth.onAuthChange(function(event, session) {
      App.session = session;
      App.user = session ? session.user : null;
      App.updateNav();
    });
  },

  updateNav() {
    var loginLinks = document.querySelectorAll('[data-auth="login"]');
    var userLinks = document.querySelectorAll('[data-auth="user"]');
    loginLinks.forEach(function(el) { el.style.display = this.user ? 'none' : ''; }.bind(this));
    userLinks.forEach(function(el) { el.style.display = this.user ? '' : 'none'; }.bind(this));
  },

  isAdmin() {
    return this.user && this.user.app_metadata && this.user.app_metadata.role === 'admin';
  }
};

// Boot
if (typeof Auth !== 'undefined') {
  App.init();
}

// Track page view
if (typeof Track !== 'undefined') {
  Track.event('page_view');
}

})();
