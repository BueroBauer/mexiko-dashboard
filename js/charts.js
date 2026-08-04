// js/charts.js
// Chart.js 4.4 Infografiken — Mexiko Reise-Dashboard
// Liest: window.MEXIKO.charts.* + window.MEXIKO.meta.*
// Schreibt: window.chartsModule

window.chartsModule = (function () {
  'use strict';

  var _charts = {};

  function _renderBudgetCounter() {
    var c = document.getElementById('budget-counter-container');
    if (!c) return;

    var daily = window.MEXIKO.meta.dailyBudget;
    var budget = window.MEXIKO.meta.budget;

    var html = '<div class="budget-counter">'
      + '<div class="budget-item budget-item--comfort">'
      +   '<span class="budget-amount">\u20AC' + daily.comfort + '</span>'
      +   '<span class="budget-label">pro Tag \u00B7 Komfort</span>'
      + '</div>'
      + '<div class="budget-vs">vs.</div>'
      + '<div class="budget-item budget-item--backpacker">'
      +   '<span class="budget-amount">\u20AC' + daily.backpacker + '</span>'
      +   '<span class="budget-label">pro Tag \u00B7 Backpacker-Realit\u00E4t</span>'
      + '</div>'
      + '<div class="budget-total">'
      +   'Gesamtbudget: \u20AC' + budget.low + '\u2013\u20AC' + budget.high
      + '</div>'
      + '</div>';

    c.innerHTML = html;
  }

  function _initCosts() {
    var canvas = document.getElementById('chart-costs');
    if (!canvas) return;
    if (_charts.costs) { _charts.costs.destroy(); }

    var d = window.MEXIKO.charts.costs;
    _charts.costs = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: d.labels,
        datasets: [{ data: d.values, backgroundColor: d.colors, borderColor: '#0D0F12', borderWidth: 2, hoverOffset: 6 }]
      },
      options: {
        cutout: '62%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#9CA3AF', font: { size: 11 }, padding: 12 } },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                var total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                var pct = Math.round(ctx.parsed / total * 100);
                return ctx.label + ': \u20AC' + ctx.parsed + ' (' + pct + '%)';
              }
            }
          }
        }
      }
    });
  }

  function _initNights() {
    var canvas = document.getElementById('chart-nights');
    if (!canvas) return;
    if (_charts.nights) { _charts.nights.destroy(); }

    var d = window.MEXIKO.charts.nights;
    _charts.nights = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [{ data: d.values, backgroundColor: d.colors, borderWidth: 0, borderRadius: 4 }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#9CA3AF' }, grid: { color: '#1F2937' } },
          y: { ticks: { color: '#9CA3AF', stepSize: 5 }, grid: { color: '#1F2937' } }
        }
      }
    });
  }

  function _initTemp() {
    var canvas = document.getElementById('chart-temp');
    if (!canvas) return;
    if (_charts.temp) { _charts.temp.destroy(); }

    var d = window.MEXIKO.charts.temp;
    _charts.temp = new Chart(canvas, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [
          { label: 'Min', data: d.tempMin, borderColor: '#06B6D4', backgroundColor: 'rgba(6,182,212,0.15)', fill: '+1', tension: 0.3 },
          { label: 'Max', data: d.tempMax, borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.15)', fill: '-1', tension: 0.3 }
        ]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#9CA3AF', font: { size: 11 } } },
          tooltip: { callbacks: { label: function(ctx) { return ctx.dataset.label + ': ' + ctx.parsed.y + '\u00B0C'; } } }
        },
        scales: {
          x: { ticks: { color: '#9CA3AF', font: { size: 10 }, maxRotation: 30 }, grid: { color: '#1F2937' } },
          y: { ticks: { color: '#9CA3AF', callback: function(v) { return v + '\u00B0C'; } }, grid: { color: '#1F2937' } }
        }
      }
    });
  }

  function _initEntries() {
    var canvas = document.getElementById('chart-entries');
    if (!canvas) return;
    if (_charts.entries) { _charts.entries.destroy(); }

    var entries = window.MEXIKO.charts.entries.data;
    var gratisData = [];
    var paidData = [];

    entries.forEach(function (d, i) {
      if (d.gratis) { gratisData.push({ x: i, y: 0, label: d.label }); }
      else          { paidData.push({ x: i, y: d.eur, label: d.label }); }
    });

    _charts.entries = new Chart(canvas, {
      type: 'scatter',
      data: {
        datasets: [
          { label: 'Gratis', data: gratisData, backgroundColor: '#10B981', pointRadius: 8 },
          { label: 'Eintritt', data: paidData, backgroundColor: '#F59E0B', pointRadius: 8 }
        ]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#9CA3AF', font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                var d = ctx.raw;
                return d.label + (ctx.dataset.label === 'Gratis' ? ' (gratis)' : ' \u20AC' + d.y);
              }
            }
          }
        },
        scales: {
          x: { display: false },
          y: { ticks: { color: '#9CA3AF', callback: function(v) { return v === 0 ? 'gratis' : '\u20AC' + v; } }, grid: { color: '#1F2937' } }
        }
      }
    });
  }

  return {
    init: function () {
      if (!window.MEXIKO) return;

      Chart.defaults.color = '#9CA3AF';
      Chart.defaults.borderColor = '#1F2937';

      _renderBudgetCounter();
      _initCosts();
      _initNights();
      _initTemp();
      _initEntries();

      console.log('[charts.js] initialisiert');
    }
  };

})();
