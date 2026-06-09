document.addEventListener('DOMContentLoaded', function() {
  console.log("HostMakedonija App: Initialized.");

  // ============================================
  // 1. DARK MODE THEME TOGGLER
  // ============================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sunIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sun-icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  const moonIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  function getSavedTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = sunIconSVG;
    } else {
      themeToggleBtn.innerHTML = moonIconSVG;
    }
  }

  // Initial apply
  applyTheme(getSavedTheme());

  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });


  // ============================================
  // 2. DYNAMIC CARD SORTING
  // ============================================
  const cardsContainer = document.getElementById('hosting-cards-list');
  const sortButtons = document.querySelectorAll('.sort-btn');

  if (cardsContainer) {
    const originalCards = Array.from(cardsContainer.querySelectorAll('.hosting-card'));

    sortButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Active states
        sortButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const metric = this.getAttribute('data-sort');
        const sorted = [...originalCards];

        if (metric === 'rank') {
          // Rank ascending
          sorted.sort((a, b) => parseInt(a.getAttribute('data-rank')) - parseInt(b.getAttribute('data-rank')));
        } else if (metric === 'price') {
          // Price ascending
          sorted.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
        } else if (metric === 'speed') {
          // Speed ascending (lower ms is better/faster)
          sorted.sort((a, b) => parseInt(a.getAttribute('data-speed')) - parseInt(b.getAttribute('data-speed')));
        } else if (metric === 'rating') {
          // Rating descending
          sorted.sort((a, b) => parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating')));
        }

        // Render sorted cards with a smooth fade-in reveal
        cardsContainer.innerHTML = '';
        sorted.forEach(card => {
          cardsContainer.appendChild(card);
        });
      });
    });
  }


  // ============================================
  // 3. INTERACTIVE CHART SYNC
  // ============================================
  const chartRows = document.querySelectorAll('.chart-row');
  const cards = document.querySelectorAll('.hosting-card');

  chartRows.forEach(row => {
    const targetId = row.getAttribute('data-target');
    const targetCard = document.getElementById(targetId);

    // Synchronize hover state: Chart row hover highlights Card
    row.addEventListener('mouseenter', () => {
      if (targetCard) targetCard.classList.add('featured');
    });
    row.addEventListener('mouseleave', () => {
      // Keep #1 hostinger featured by default as per layout design
      if (targetCard && targetId !== 'hostinger') {
        targetCard.classList.remove('featured');
      }
    });

    // Chart row click scrolls to Card and triggers flash pulse
    row.addEventListener('click', () => {
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '3px solid var(--accent-indigo)';
        targetCard.style.outlineOffset = '6px';
        setTimeout(() => {
          targetCard.style.outline = 'none';
        }, 1500);
      }
    });
  });

  cards.forEach(card => {
    const cardId = card.id;
    const correspondingRow = document.querySelector(`.chart-row[data-target="${cardId}"]`);

    if (correspondingRow) {
      card.addEventListener('mouseenter', () => {
        correspondingRow.classList.add('active');
      });
      card.addEventListener('mouseleave', () => {
        correspondingRow.classList.remove('active');
      });
    }
  });


  // ============================================
  // 4. FAQ ACCORDION
  // ============================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', function() {
      const parent = this.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle current FAQ
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });


  // ============================================
  // 5. GOOGLE ADS & AFFILIATE CLICK TRACKER
  // ============================================
  const trackerVars = {
    ajax_url: "https://hostmakedonija.com/wp-admin/admin-ajax.php"
  };

  // Cookie Utility
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
    return null;
  }

  // 1. Detect Google Ads parameters
  const urlParams = new URLSearchParams(window.location.search);
  const gclid = urlParams.get('gclid');
  const gbraid = urlParams.get('gbraid');
  const wbraid = urlParams.get('wbraid');
  const utmSource = urlParams.get('utm_source');

  let isGads = gclid || gbraid || wbraid;
  if (!isGads && utmSource && utmSource.toLowerCase() === 'google') {
    isGads = 'true';
  }

  if (isGads) {
    const cookieValue = gclid ? gclid : (gbraid ? gbraid : (wbraid ? wbraid : 'true'));
    console.log("Google Ads Lead Detected. Setting cookie: " + cookieValue);

    // Set 30-day cookie client-side
    const date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    const secureStr = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = "gads_lead=" + encodeURIComponent(cookieValue) + "; expires=" + date.toUTCString() + "; path=/; SameSite=Lax" + secureStr;

    // Send Landing AJAX statistics
    const landingData = new FormData();
    landingData.append('action', 'hostingmk_log_gads_landing_ajax');
    landingData.append('gclid', cookieValue);
    landingData.append('url', window.location.pathname + window.location.search);
    landingData.append('referrer', document.referrer || '');

    if (navigator.sendBeacon) {
      navigator.sendBeacon(trackerVars.ajax_url, landingData);
    } else {
      fetch(trackerVars.ajax_url, {
        method: 'POST',
        body: landingData,
        keepalive: true
      });
    }
  }

  // 2. Click out click listener
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-hosting');
    if (!btn) return;

    const gadsLead = getCookie('gads_lead');
    console.log("CTA Button Clicked. Cookie presence check: " + (gadsLead ? "Found" : "Not Found"));

    // Skip if there is no ads lead cookie (same behavior as original)
    if (!gadsLead) return;

    const href = btn.getAttribute('href');
    const id = btn.getAttribute('id') || '';

    let hostingName = 'Unknown';
    if (id.startsWith('cta-')) {
      const rawName = id.replace('cta-', '');
      if (rawName === 'hostinger') hostingName = 'Hostinger';
      else if (rawName === 'siteground') hostingName = 'SiteGround';
      else if (rawName === 'bluehost') hostingName = 'Bluehost';
      else if (rawName === 'namecheap') hostingName = 'Namecheap';
      else if (rawName === 'dreamhost') hostingName = 'DreamHost';
      else if (rawName === 'a2hosting') hostingName = 'A2 Hosting';
      else if (rawName === 'greengeeks') hostingName = 'GreenGeeks';
      else if (rawName === 'hostgator') hostingName = 'HostGator';
      else hostingName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    } else {
      let text = btn.textContent || btn.innerText || '';
      text = text.replace('Get', '').replace('→', '').trim();
      if (text) hostingName = text;
    }

    console.log("Tracking outclick for: " + hostingName);
    const data = new FormData();
    data.append('action', 'hostingmk_log_affiliate_click');
    data.append('hosting_name', hostingName);
    data.append('outbound_url', href || '');
    data.append('gads_lead', gadsLead);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(trackerVars.ajax_url, data);
    } else {
      fetch(trackerVars.ajax_url, {
        method: 'POST',
        body: data,
        keepalive: true
      });
    }
  }, true); // capturing phase ensures tracking fires before redirecting
});
