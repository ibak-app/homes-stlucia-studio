/**
 * stlucia.studio -- Shared Super-Nav
 * Injects the ecosystem navigation bar at the top of every page.
 * Update this ONE file to change the super-nav across all properties.
 *
 * Usage: Add <script src="assets/js/super-nav.js"></script> to the page.
 * Mount: Optionally place <div id="super-nav-mount"></div> where the bar
 *        should appear. Without a mount point the bar replaces any existing
 *        .super-nav element, or is prepended to <body> as a last resort.
 */

(function () {
  'use strict';

  // 1. Properties list ---------------------------------------------------------
  var PROPERTIES = [
    { label: 'Business', href: 'https://business.stlucia.studio', host: 'business.stlucia.studio' },
    { label: 'Living',   href: 'https://living.stlucia.studio',   host: 'living.stlucia.studio'   },
    { label: 'Expat',    href: 'https://expat.stlucia.studio',    host: 'expat.stlucia.studio'    },
    { label: 'Remote',   href: 'https://remote.stlucia.studio',   host: 'remote.stlucia.studio'   },
    { label: 'Visit',    href: 'https://visit.stlucia.studio',    host: 'visit.stlucia.studio'    },
    { label: 'Retire',   href: 'https://retire.stlucia.studio',   host: 'retire.stlucia.studio'   },
    { label: 'Talent',   href: 'https://talent.stlucia.studio',   host: 'talent.stlucia.studio'   },
    { label: 'Hire',     href: 'https://hire.stlucia.studio',     host: 'hire.stlucia.studio'     },
    { label: 'Homes',    href: 'https://homes.stlucia.studio',    host: 'homes.stlucia.studio'    }
  ];

  // 2. Detect active property --------------------------------------------------
  var currentHost = (window.location.hostname || '').toLowerCase();

  function getActiveHost() {
    // Exact host match
    for (var i = 0; i < PROPERTIES.length; i++) {
      if (currentHost === PROPERTIES[i].host) return PROPERTIES[i].host;
    }
    // Localhost: guess from pathname
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      var path = window.location.pathname.toLowerCase();
      if (path.indexOf('hire') !== -1)         return 'hire.stlucia.studio';
      if (path.indexOf('homes') !== -1)        return 'homes.stlucia.studio';
      if (path.indexOf('hr-stlucia') !== -1)   return 'talent.stlucia.studio';
      if (path.indexOf('talent') !== -1)       return 'talent.stlucia.studio';
      if (path.indexOf('living') !== -1)       return 'living.stlucia.studio';
      if (path.indexOf('expat') !== -1)        return 'expat.stlucia.studio';
      if (path.indexOf('remote') !== -1)       return 'remote.stlucia.studio';
      if (path.indexOf('visit') !== -1)        return 'visit.stlucia.studio';
      if (path.indexOf('retire') !== -1)       return 'retire.stlucia.studio';
    }
    // Hub (stlucia.studio) or unknown: no active link
    return null;
  }

  var activeHost = getActiveHost();

  // 3. Inject CSS --------------------------------------------------------------
  var CSS = [
    '.super-nav{background:#0a0f1a;color:#8892a8;font-size:12px;line-height:1;position:relative;z-index:1000;}',
    '.super-nav__inner{max-width:1200px;margin:0 auto;padding:6px 16px;display:flex;align-items:center;gap:12px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}',
    '.super-nav__inner::-webkit-scrollbar{display:none;}',
    '.super-nav__label{color:#fff;font-weight:700;font-size:11px;white-space:nowrap;letter-spacing:0.03em;flex-shrink:0;}',
    '.super-nav__links{display:flex;gap:4px;overflow-x:auto;-webkit-overflow-scrolling:touch;}',
    '.super-nav__link{color:#8892a8;text-decoration:none;padding:2px 8px;border-radius:4px;white-space:nowrap;font-size:12px;transition:color 0.2s,background 0.2s;}',
    '.super-nav__link:hover{color:#fff;}',
    '.super-nav__link--active{color:#fff;background:rgba(255,255,255,0.1);}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.id = 'super-nav-styles';
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // 4. Build nav element using DOM methods (no innerHTML) ----------------------
  function buildNav() {
    // Outer wrapper
    var nav = document.createElement('div');
    nav.className = 'super-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'stlucia.studio network');

    // Inner container
    var inner = document.createElement('div');
    inner.className = 'super-nav__inner';

    // Brand label
    var label = document.createElement('span');
    label.className = 'super-nav__label';
    label.textContent = 'stlucia.studio';
    inner.appendChild(label);

    // Links container
    var linksNav = document.createElement('nav');
    linksNav.className = 'super-nav__links';

    for (var i = 0; i < PROPERTIES.length; i++) {
      var p = PROPERTIES[i];
      var isActive = (p.host === activeHost);

      var a = document.createElement('a');
      a.href = p.href;
      a.className = 'super-nav__link' + (isActive ? ' super-nav__link--active' : '');
      a.textContent = p.label;
      if (isActive) {
        a.setAttribute('aria-current', 'page');
      }
      linksNav.appendChild(a);
    }

    inner.appendChild(linksNav);
    nav.appendChild(inner);
    return nav;
  }

  // 5. Inject into page --------------------------------------------------------
  function inject() {
    var nav = buildNav();

    // Option A: dedicated mount point
    var mount = document.getElementById('super-nav-mount');
    if (mount) {
      mount.parentNode.replaceChild(nav, mount);
      return;
    }

    // Option B: replace existing static super-nav
    var existing = document.querySelector('.super-nav');
    if (existing) {
      existing.parentNode.replaceChild(nav, existing);
      return;
    }

    // Option C: insert after skip-link if present, otherwise prepend to body
    var skipLink = document.querySelector('.skip-link, a[href="#main-content"]');
    if (skipLink && skipLink.parentNode === document.body) {
      document.body.insertBefore(nav, skipLink.nextSibling);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
