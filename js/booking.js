// js/booking.js
// Mexiko Reise-Dashboard — Booking-Cards mit Deeplinks und Viator/GYG-Touren
// Liest: window.MEXIKO.booking, window.MEXIKO.tours

window.bookingModule = (function() {
  'use strict';

  function _renderExampleHotels(hotels) {
    if (!hotels || hotels.length === 0) {
      return '<div class="bkg-hotels-empty">Hotels noch nicht eingetragen</div>';
    }
    var html = '<div class="bkg-hotels">';
    hotels.forEach(function(h) {
      html += '<div class="bkg-hotel">'
        + '<span class="bkg-hotel-name">' + h.name + '</span>'
        + (h.priceEur ? '<span class="bkg-hotel-price">ab &euro;' + h.priceEur + '</span>' : '')
        + (h.url ? ' <a class="bkg-hotel-link" href="' + h.url + '" target="_blank" rel="noopener">Ansehen &#x2197;</a>' : '')
        + '</div>';
    });
    html += '</div>';
    return html;
  }

  function _renderTours(phaseId) {
    if (!window.MEXIKO || !window.MEXIKO.tours) return '';
    var tours = window.MEXIKO.tours.filter(function(t) { return t.phaseId === phaseId; });
    if (!tours.length) return '';

    var html = '<div class="bkg-tours">';
    tours.forEach(function(t) {
      var isPlaceholder = !/\d/.test(t.url);
      var linkHtml = isPlaceholder
        ? '<span class="bkg-tour-placeholder">&#x26A0; URL Platzhalter &mdash; Viator/GYG URL in data.js eintragen</span>'
        : '<a class="bkg-tour-link" href="' + t.url + '" target="_blank" rel="noopener">Buchen &#x2197;</a>';
      var buggyIcon = t.buggyFriendly ? '&#x1F6BC;' : '&#x1F6BC;&#x26A0;';

      html += '<div class="bkg-tour">'
        + '<div class="bkg-tour-name">' + t.name + '</div>'
        + '<div class="bkg-tour-meta">'
          + '<span>' + t.provider + '</span>'
          + '<span>ab &euro;' + t.priceEur + '</span>'
          + '<span>' + buggyIcon + '</span>'
          + linkHtml
        + '</div>'
        + (t.note ? '<div class="bkg-tour-note">' + t.note + '</div>' : '')
        + '</div>';
    });
    html += '</div>';
    return html;
  }

  function _makeBookingCard(b) {
    var earlyBadge = b.earlyBook === true
      ? '<span class="bkg-badge bkg-badge--warn">&#x26A0;&#xFE0F; Fr&#xFC;h buchen!</span>'
      : '';

    return '<div class="bkg-card">'
      + '<div class="bkg-phase-header">'
        + '<span class="bkg-phase-num">Phase ' + b.phaseId + '</span>'
        + '<span class="bkg-region">' + b.region + '</span>'
        + earlyBadge
      + '</div>'
      + '<div class="bkg-dates">' + b.checkIn + ' &ndash; ' + b.checkOut + ' (' + b.nights + ' N&#xE4;chte)</div>'
      + (b.criteria && b.criteria.notes ? '<div class="bkg-criteria">' + b.criteria.notes + '</div>' : '')
      + '<div class="bkg-links">'
        + '<a class="bkg-link bkg-link--primary" href="' + b.bookingUrl + '" target="_blank" rel="noopener">Booking.com &#x2197;</a>'
        + '<a class="bkg-link bkg-link--secondary" href="' + b.airbnbUrl + '" target="_blank" rel="noopener">&#x1F3E0; Airbnb &#x2197;</a>'
      + '</div>'
      + _renderExampleHotels(b.exampleHotels)
      + _renderTours(b.phaseId)
      + '</div>';
  }

  function _render(container) {
    var html = '<div class="bkg-grid">';
    window.MEXIKO.booking.forEach(function(b) { html += _makeBookingCard(b); });
    html += '</div>';
    container.insertAdjacentHTML('beforeend', html);
  }

  return {
    init: function() {
      if (!window.MEXIKO || !window.MEXIKO.booking) return;
      var el = document.getElementById('booking-content');
      if (!el) return;
      el.innerHTML = '';
      _render(el);
      console.log('[booking.js] initialisiert');
    }
  };

})();
