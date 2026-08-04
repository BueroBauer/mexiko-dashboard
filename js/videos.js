// js/videos.js
// YouTube-Video-Grid mit Tab-Filter und Lazy-Load
// ES5 — kein const/let, keine Arrow Functions, keine Template Literals

window.videosModule = (function () {
  'use strict';

  var _currentCat = 'alle';

  function _getCategories() {
    var cats = [];
    var videos = window.MEXIKO.videos;
    for (var i = 0; i < videos.length; i++) {
      var vcat = videos[i].category;
      if (vcat && cats.indexOf(vcat) === -1) { cats.push(vcat); }
    }
    return cats;
  }

  function _renderTabs(container) {
    var cats = _getCategories();
    var all = ['alle'].concat(cats);
    var html = '<div class="vid-tabs">';
    for (var i = 0; i < all.length; i++) {
      var cat = all[i];
      var active = cat === _currentCat ? ' vid-tab--active' : '';
      html += '<button class="vid-tab' + active + '" data-cat="' + cat + '">' + cat + '</button>';
    }
    html += '</div>';
    container.insertAdjacentHTML('beforeend', html);
  }

  function _makeCard(video) {
    var isPlaceholder = video.youtubeId.indexOf('PLACEHOLDER') !== -1;
    var thumbHtml;
    if (isPlaceholder) {
      thumbHtml = '<div class="vid-thumb-placeholder"><span class="vid-placeholder-label">Noch kein Video gefunden</span></div>';
    } else {
      thumbHtml = '<img class="vid-thumb" src="https://img.youtube.com/vi/' + video.youtubeId + '/hqdefault.jpg" alt="' + video.title + '" loading="lazy" />';
    }
    return '<div class="vid-card" data-youtube-id="' + video.youtubeId + '">'
      + '<div class="vid-thumb-wrap">'
      + thumbHtml
      + '<div class="vid-play-btn' + (isPlaceholder ? ' vid-play-btn--search' : '') + '" aria-label="' + (isPlaceholder ? 'Auf YouTube suchen' : 'Video abspielen') + '">'
      + (isPlaceholder ? '\uD83D\uDD0D auf YouTube suchen' : '\u25B6')
      + '</div>'
      + '</div>'
      + '<div class="vid-title">' + video.title + '</div>'
      + '</div>';
  }

  function _renderGrid(container, cat) {
    var old = container.querySelector('.vid-grid');
    if (old) { old.parentNode.removeChild(old); }
    var videos = window.MEXIKO.videos;
    var filtered = [];
    for (var i = 0; i < videos.length; i++) {
      if (cat === 'alle' || videos[i].category === cat) { filtered.push(videos[i]); }
    }
    var html = '<div class="vid-grid">';
    for (var j = 0; j < filtered.length; j++) { html += _makeCard(filtered[j]); }
    html += '</div>';
    container.insertAdjacentHTML('beforeend', html);
  }

  function _bindEvents(container) {
    container.addEventListener('click', function(e) {
      var tab = e.target.closest('.vid-tab');
      if (tab) {
        _currentCat = tab.getAttribute('data-cat');
        var allTabs = container.querySelectorAll('.vid-tab');
        Array.prototype.forEach.call(allTabs, function(t) { t.classList.remove('vid-tab--active'); });
        tab.classList.add('vid-tab--active');
        _renderGrid(container, _currentCat);
        return;
      }

      var card = e.target.closest('[data-youtube-id]');
      if (!card) { return; }
      var id = card.getAttribute('data-youtube-id');

      if (id.indexOf('PLACEHOLDER') !== -1) {
        var titleEl = card.querySelector('.vid-title');
        var q = titleEl ? titleEl.textContent.trim() : 'Mexiko Reise';
        window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(q), '_blank');
        return;
      }

      var wrap = card.querySelector('.vid-thumb-wrap');
      if (!wrap) return;
      wrap.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1" frameborder="0" allowfullscreen allow="autoplay; encrypted-media" style="width:100%;height:100%;position:absolute;top:0;left:0"></iframe>';
    });
  }

  return {
    init: function () {
      if (!window.MEXIKO || !window.MEXIKO.videos) { return; }
      var el = document.getElementById('videos-content');
      if (!el) { return; }
      el.innerHTML = '';
      _renderTabs(el);
      _renderGrid(el, 'alle');
      _bindEvents(el);
      console.log('[videos.js] initialisiert');
    }
  };
})();
