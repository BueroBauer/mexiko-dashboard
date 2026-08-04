// js/app.js
// Mexiko Dashboard — App-Initialisierung
// Läuft nach allen anderen Scripts (letzter script-Tag in index.html)

(function() {
  'use strict';

  var PASSWORD    = 'sri30';
  var SESSION_KEY = 'mexiko_unlocked';

  // --- Passwort-Gate ---
  function initGate() {
    var overlay = document.getElementById('gate-overlay');
    var app     = document.getElementById('app');
    var input   = document.getElementById('gate-input');
    var btn     = document.getElementById('gate-btn');
    var errMsg  = document.getElementById('gate-error');

    function unlock() {
      overlay.classList.add('hidden');
      app.classList.remove('hidden');
      localStorage.setItem(SESSION_KEY, '1');
    }

    if (localStorage.getItem(SESSION_KEY) === '1') {
      unlock();
      return;
    }

    var isLocal = location.hostname === 'localhost' ||
                  location.hostname === '127.0.0.1' ||
                  location.protocol === 'file:';

    if (isLocal) {
      input.value = PASSWORD;
      setTimeout(function() { unlock(); }, 100);
      return;
    }

    overlay.classList.remove('hidden');

    function checkPassword() {
      if (input.value === PASSWORD) {
        errMsg.classList.remove('visible');
        input.classList.remove('error');
        unlock();
      } else {
        errMsg.classList.add('visible');
        input.classList.add('error');
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', checkPassword);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') checkPassword();
    });
  }

  // --- Nav: Active-Link beim Scrollen ---
  function initNav() {
    var links = document.querySelectorAll('.nav-link');
    var sections = [];
    links.forEach(function(link) {
      var id = link.getAttribute('href').replace('#', '');
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el, link: link });
    });

    function onScroll() {
      var scrollY = window.scrollY || window.pageYOffset;
      var active = null;
      sections.forEach(function(s) {
        if (s.el.offsetTop - 80 <= scrollY) active = s;
      });
      links.forEach(function(l) { l.classList.remove('active'); });
      if (active) active.link.classList.add('active');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Phase-Farbe (für map.js + sicherheit.js) ---
  window.getPhaseColor = function(phaseId) {
    if (!window.MEXIKO || !window.MEXIKO.phases) return '#6366F1';
    var phase = window.MEXIKO.phases.find(function(p) { return p.id === phaseId; });
    return phase ? phase.color : '#6366F1';
  };

  // --- Timeline ---
  function renderPhaseCard(phase, index) {
    var isOpen = false;

    var tempBadge = '';
    if (phase.avgTempC) {
      tempBadge = '<span class="tl-badge tl-temp-badge">'
                + phase.avgTempC.min + '–' + phase.avgTempC.max + '°C</span>';
    }

    var seismikBadge = '';
    if (window.seismikBadge) {
      seismikBadge = window.seismikBadge(phase.id);
    }

    var flightBadge = '';
    if (phase.flightIn) {
      var isIntl = phase.flightIn.type === 'international';
      flightBadge += '<span class="tl-flight-badge tl-flight-badge--' + phase.flightIn.type + '">'
        + (isIntl ? '🌍' : '✈') + ' ' + phase.flightIn.route
        + ' <span class="tl-flight-date">' + phase.flightIn.date + '</span></span>';
    }
    if (phase.flightOut) {
      var isIntlOut = phase.flightOut.type === 'international';
      flightBadge += '<span class="tl-flight-badge tl-flight-badge--' + phase.flightOut.type + '">'
        + (isIntlOut ? '🌍' : '✈') + ' ' + phase.flightOut.route
        + ' <span class="tl-flight-date">' + phase.flightOut.date + '</span></span>';
    }

    var highlights = '';
    if (phase.highlights && phase.highlights.length) {
      highlights = '<div class="tl-highlights">';
      phase.highlights.forEach(function(h) {
        highlights += '<span class="tl-highlight-tag">' + h + '</span>';
      });
      highlights += '</div>';
    }

    var days = '';
    if (phase.days && phase.days.length) {
      phase.days.forEach(function(day) {
        var dateStr = day.date ? new Date(day.date).toLocaleDateString('de-AT', { weekday: 'short', day: '2-digit', month: 'short' }) : '';
        days += '<div class="tl-day">';
        days += '<div class="tl-day-header">' + dateStr + '</div>';
        day.slots.forEach(function(slot) {
          if (!slot.label && !slot.items.length) return;
          days += '<div class="tl-slot' + (slot.label && slot.label.toLowerCase().indexOf('mittagsschlaf') !== -1 ? ' tl-slot--nap' : '') + '">';
          if (slot.label) {
            days += '<div class="tl-slot-label">' + slot.label + '</div>';
          }
          if (slot.items && slot.items.length) {
            days += '<ul class="tl-sight-list">';
            slot.items.forEach(function(item) {
              var priceStr = '';
              if (item.gratis === true) {
                priceStr = '<span class="tl-badge tl-badge--gratis">gratis</span>';
              } else if (item.price && item.price.eur) {
                priceStr = '<span class="tl-badge tl-badge--price">~€' + item.price.eur + '</span>';
              }
              var gmaps = item.googleMapsUrl
                ? '<a class="tl-gmaps-link" href="' + item.googleMapsUrl + '" target="_blank" rel="noopener">Maps ↗</a>'
                : '';
              days += '<li class="tl-sight-name">' + item.name + priceStr + gmaps + '</li>';
            });
            days += '</ul>';
          }
          days += '</div>';
        });
        days += '</div>';
      });
    } else {
      days = '<div style="padding:1rem">Keine Tages-Daten vorhanden</div>';
    }

    var html = '<div class="tl-card' + (isOpen ? ' tl-card--open' : '') + '">';
    html += '<div class="tl-card-header" style="--phase-color:' + phase.color + '" tabindex="0" role="button" aria-expanded="' + isOpen + '">';
    html += '<div class="tl-phase-bar" style="background:' + phase.color + '"></div>';
    html += '<div class="tl-header-content">';
    html += '<div class="tl-header-top">';
    html += '<span class="tl-phase-emoji">' + phase.emoji + '</span>';
    html += '<span class="tl-phase-name">Phase ' + phase.id + ' · ' + phase.name + '</span>';
    html += '<span class="tl-badge tl-badge--nights">' + phase.nights + ' Nächte</span>';
    html += tempBadge;
    html += seismikBadge;
    html += '</div>';
    if (flightBadge) {
      html += '<div class="tl-flight-row">' + flightBadge + '</div>';
    }
    html += highlights;
    if (phase.buggyNote) {
      html += '<div class="tl-buggy-note">🚶 ' + phase.buggyNote + '</div>';
    }
    html += '</div>';
    html += '</div>';
    html += '<div class="tl-card-body">';
    html += days;
    html += '</div>';
    html += '</div>';
    return html;
  }

  function renderTimeline() {
    var container = document.getElementById('timeline-container');
    if (!container) return;
    if (!window.MEXIKO || !window.MEXIKO.phases) return;

    var html = '';
    window.MEXIKO.phases.forEach(function(phase, index) {
      html += renderPhaseCard(phase, index);
    });
    container.innerHTML = html;

    container.addEventListener('click', function(e) {
      var header = e.target.closest('.tl-card-header');
      if (!header) return;
      var card = header.closest('.tl-card');
      if (!card) return;
      var isOpen = card.classList.contains('tl-card--open');
      card.classList.toggle('tl-card--open', !isOpen);
      header.setAttribute('aria-expanded', !isOpen);
    });

    container.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var header = e.target.closest('.tl-card-header');
        if (header) { e.preventDefault(); header.click(); }
      }
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function() {
    initGate();
    initNav();
    if (window.mapModule)         { window.mapModule.init(); }
    if (window.chartsModule)      { window.chartsModule.init(); }
    if (window.videosModule)      { window.videosModule.init(); }
    if (window.restaurantsModule) { window.restaurantsModule.init(); }
    if (window.bookingModule)     { window.bookingModule.init(); }
    if (window.faqModule)         { window.faqModule.init(); }
    if (window.sicherheitModule)  { window.sicherheitModule.init(); }
    renderTimeline();
  });

})();
