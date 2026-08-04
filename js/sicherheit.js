// js/sicherheit.js
// Mexiko Reise-Dashboard — Sicherheit: Kriminalität + Erdbeben + Hurrikan
// Liest:    window.MEXIKO.kriminalitaet, window.MEXIKO.seismik, window.MEXIKO.hurrikan
// Schreibt: window.sicherheitModule, window.seismikBadge(phaseId)

window.sicherheitModule = (function() {
  'use strict';

  // -------------------------------------------------------
  // Hilfsfunktionen
  // -------------------------------------------------------

  function _fmtDate(iso) {
    if (!iso) return '–';
    try {
      return new Date(iso).toLocaleDateString('de-AT', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch(e) { return iso; }
  }

  function _krimLevelDef(k) {
    var scale = window.MEXIKO.kriminalitaet.scale;
    for (var i = 0; i < scale.length; i++) {
      if (scale[i].key === k) return scale[i];
    }
    return scale[0];
  }

  function _seismikScaleDef(k) {
    var scale = window.MEXIKO.seismik.scale;
    for (var i = 0; i < scale.length; i++) {
      if (scale[i].key === k) return scale[i];
    }
    return scale[0];
  }

  // -------------------------------------------------------
  // Block 1: Kriminalitätslage
  // -------------------------------------------------------

  function _renderKriminalitaet() {
    var k = window.MEXIKO.kriminalitaet;
    var html = '<div class="sec-block">';
    html += '<h3 class="sec-block-title">&#x1F6A8; Kriminalit&#xE4;tslage</h3>';
    html += '<p class="sec-block-intro">' + k.intro + '</p>';

    // Bundesstaat-Karten
    html += '<div class="krim-grid">';
    k.bundesstaaten.forEach(function(b) {
      var def = _krimLevelDef(b.level);
      html += '<div class="krim-card" style="--lvl:' + def.color + '; border-left-color:' + def.color + '">';
      html += '<div class="krim-head">';
      html += '<span class="krim-icon">' + def.icon + '</span>';
      html += '<span class="krim-name">' + b.name + '</span>';
      html += '<span class="krim-badge" style="color:' + def.color + ';border-color:' + def.color + '">' + def.label + '</span>';
      html += '</div>';
      html += '<div class="krim-note">' + b.note + '</div>';
      var phaseStr = b.phaseIds.map(function(id) { return 'Phase ' + id; }).join(', ');
      html += '<div class="krim-phases">Betrifft: ' + phaseStr + '</div>';
      html += '</div>';
    });
    html += '</div>';

    // Tipps
    html += '<h4 class="sec-sub">Sicherheitstipps</h4>';
    html += '<ul class="sk-list">';
    k.tipps.forEach(function(t) { html += '<li>' + t + '</li>'; });
    html += '</ul>';

    // Quellen
    html += '<div class="wd-sources">';
    k.sources.forEach(function(s) {
      html += '<a class="wd-source" href="' + s.url + '" target="_blank" rel="noopener">' + s.label + ' &#x2197;</a>';
    });
    html += '</div>';

    html += '<p class="wd-lastcheck">Letzter Check: ' + _fmtDate(k.lastCheck) + '</p>';
    html += '</div>';
    return html;
  }

  // -------------------------------------------------------
  // Block 2: Seismik (Mexiko = Ring of Fire!)
  // -------------------------------------------------------

  function _renderSeismik() {
    var s = window.MEXIKO.seismik;
    var html = '<div class="sec-block">';
    html += '<h3 class="sec-block-title">&#x26A1; Erdbeben (Ring of Fire)</h3>';
    html += '<p class="sec-block-intro">' + s.intro + '</p>';

    // Fakten
    html += '<div class="wd-metrics">';
    s.facts.forEach(function(f) {
      html += '<div class="wd-metric"><span class="wd-metric-value">' + f.value + '</span><span class="wd-metric-label">' + f.label + '</span></div>';
    });
    html += '</div>';

    // Kontext
    html += '<p class="sec-block-intro" style="margin-top:1rem">' + s.context + '</p>';

    // Skala
    html += '<h4 class="sec-sub">Bebenskala — Regionalrisiko</h4>';
    html += '<div class="sk-scale">';
    s.scale.forEach(function(sc) {
      html += '<div class="sk-scale-item" style="--lvl:' + sc.color + '">';
      html += '<div class="sk-scale-head"><span class="sk-bar">' + sc.icon + '</span><strong>' + sc.label + '</strong></div>';
      html += '<div class="sk-scale-meaning">' + sc.meaning + '</div>';
      html += '</div>';
    });
    html += '</div>';

    // Pro Phase
    html += '<h4 class="sec-sub">Risikoniveau pro Phase</h4>';
    html += '<div class="sk-phases">';
    window.MEXIKO.phases.forEach(function(phase) {
      var entry = s.phases[phase.id];
      if (!entry) return;
      var sc = _seismikScaleDef(entry.level);
      html += '<div class="sk-phase" style="--lvl:' + sc.color + '; --phase-color:' + phase.color + '">';
      html += '<div class="sk-phase-head">';
      html += '<span class="sk-phase-name">' + phase.emoji + ' Phase ' + phase.id + ' — ' + phase.name + '</span>';
      html += '<span class="sk-badge" style="color:' + sc.color + ';border-color:' + sc.color + '">' + sc.label + '</span>';
      html += '</div>';
      html += '<div class="sk-phase-headline">' + entry.headline + '</div>';
      html += '<div class="sk-phase-note">' + entry.note + '</div>';
      html += '</div>';
    });
    html += '</div>';

    // Apps
    html += '<h4 class="sec-sub">Warn-Apps</h4>';
    html += '<div class="sk-apps">';
    s.apps.forEach(function(app) {
      html += '<div class="sk-app">';
      html += '<div class="sk-app-head"><strong>' + app.name + '</strong><span class="badge">' + app.note + '</span></div>';
      html += '<div class="sk-app-what">' + app.what + '</div>';
      html += '</div>';
    });
    html += '</div>';

    html += '<p class="sec-block-intro" style="margin-top:1rem;font-size:0.8rem">' + s.limits + '</p>';
    html += '</div>';
    return html;
  }

  // -------------------------------------------------------
  // Block 3: Hurrikan
  // -------------------------------------------------------

  function _renderHurrikan() {
    var h = window.MEXIKO.hurrikan;
    var html = '<div class="sec-block">';
    html += '<h3 class="sec-block-title">&#x1F300; Hurrikan-Saison</h3>';

    html += '<div class="wd-status" style="--lvl:' + (h.statusColor || '#4a9e4a') + '">';
    html += '<div class="wd-status-main">';
    html += '<span class="wd-status-icon" style="font-size:1.5rem">&#x2705;</span>';
    html += '<div>';
    html += '<div class="wd-status-label">Status: ' + h.status + '</div>';
    html += '<div class="wd-status-date">Reisefenster: ' + h.reiseFenster + '</div>';
    html += '</div></div>';
    html += '<div class="wd-metrics">';
    html += '<div class="wd-metric"><span class="wd-metric-value">' + h.saison + '</span><span class="wd-metric-label">Hurrikan-Saison (offiziell)</span></div>';
    html += '</div>';
    html += '</div>';

    html += '<p class="sec-block-intro" style="margin-top:1rem">' + h.intro + '</p>';

    // Regionen
    html += '<div class="krim-grid">';
    h.regions.forEach(function(r) {
      html += '<div class="krim-card" style="--lvl:#4a9e4a; border-left-color:#4a9e4a">';
      html += '<div class="krim-head">';
      html += '<span class="krim-icon">&#x2705;</span>';
      html += '<span class="krim-name">' + r.name + '</span>';
      html += '<span class="krim-badge" style="color:#4a9e4a;border-color:#4a9e4a">Au&#xDF;erhalb</span>';
      html += '</div>';
      html += '<div class="krim-note">' + r.note + '</div>';
      html += '<div class="krim-phases">Saison: ' + r.saison + '</div>';
      html += '</div>';
    });
    html += '</div>';

    html += '<p class="sec-block-intro" style="font-size:0.82rem">' + h.note + '</p>';
    html += '</div>';
    return html;
  }

  // -------------------------------------------------------
  // Public API + seismikBadge für Timeline
  // -------------------------------------------------------

  // Timeline-Badge für Phase (Kriminalität + Seismik)
  window.seismikBadge = function(phaseId) {
    if (!window.MEXIKO || !window.MEXIKO.seismik) return '';
    var entry = window.MEXIKO.seismik.phases[phaseId];
    if (!entry) return '';
    var sc = window.MEXIKO.seismik.scale.find(function(s) { return s.key === entry.level; });
    if (!sc) return '';

    var html = '<div class="tl-seismik" style="--lvl:' + sc.color + '">';
    html += '<div class="tl-seismik-head"><span class="sk-bar">' + sc.icon + '</span>';
    html += '<strong>Erdbeben: ' + sc.label + '</strong> · ' + entry.headline + '</div>';
    html += '<div class="tl-seismik-note">' + entry.note + '</div>';
    html += '<a class="tl-seismik-link" href="#sicherheit">Ganze Skala ansehen →</a>';
    html += '</div>';
    return html;
  };

  return {
    init: function() {
      if (!window.MEXIKO || !window.MEXIKO.kriminalitaet) return;

      var el = document.getElementById('sicherheit-content');
      if (!el) return;

      el.classList.remove('placeholder');
      el.innerHTML = _renderKriminalitaet() + _renderSeismik() + _renderHurrikan();

      // Kriminalitäts-Ampel in Hero-Stats hängen
      var bar = document.querySelector('.stats-bar');
      if (bar && !document.getElementById('hero-krim')) {
        var k = window.MEXIKO.kriminalitaet;
        var stat = document.createElement('a');
        stat.id = 'hero-krim';
        stat.className = 'stat';
        stat.href = '#sicherheit';
        stat.style.textDecoration = 'none';
        // Overall level: niedrig für die meisten Phasen
        stat.innerHTML = '<span class="stat-value">🟢 Niedrig</span>'
          + '<span class="stat-label">Sicherheit Yucatán/Oaxaca</span>';
        bar.appendChild(stat);
      }

      console.log('[sicherheit.js] initialisiert (Mexiko: Kriminalität + Erdbeben + Hurrikan)');
    }
  };

})();
