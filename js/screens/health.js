/* Health tab: /health (score cards), /health/stat/:id (chart, highlights, sources) */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  function statTile(stat, i) {
    var color = KK.toneColor(stat.tone);
    var moving = stat.delta.indexOf('Up') === 0 || stat.delta.indexOf('Down') === 0;
    return (
      '<div class="enter-up" style="--d:' + (40 + i * 60) + 'ms">' +
        '<a class="pressable" href="#/health/stat/' + stat.id + '">' +
          '<div class="card stat-tile">' +
            '<div class="row stat-tile__head">' + KK.icon(stat.icon, 16, color) + '<span class="t-label tone-secondary">' + KK.esc(stat.name) + '</span></div>' +
            '<div class="t-title stat-tile__value" style="color:' + color + '">' + stat.value +
              (stat.unit ? '<span class="stat-tile__unit"> ' + KK.esc(stat.unit) + '</span>' : '') + '</div>' +
            '<div class="row stat-tile__delta">' + KK.icon(moving ? 'trending-up' : 'remove', 13, color) +
              '<span class="t-caption" style="color:' + color + '">' + KK.esc(stat.delta) + '</span></div>' +
          '</div>' +
        '</a>' +
      '</div>'
    );
  }

  KK.route('/health', {
    tab: 'health',
    render: function () {
      var stats = KK.data.stats;
      var recovery = stats.filter(function (s) { return s.id === 'recovery'; })[0];
      var color = KK.toneColor(recovery.tone);
      return (
        '<section class="screen health">' +
          '<header class="page-header">' +
            '<div><div class="t-label tone-secondary">YOUR HEALTH</div><h1 class="t-title">Today</h1></div>' +
            KK.icon('shield-checkmark-outline', 24, KK.c('text-secondary')) +
          '</header>' +
          '<div class="enter-up">' +
            '<a class="pressable" href="#/health/stat/recovery">' +
              '<div class="card health-hero" style="border-color:' + KK.alpha(color, '44') + '">' +
                ui.tile({ icon: recovery.icon, color: color, size: 48, radius: 16 }) +
                '<div class="health-hero__text">' +
                  '<div class="t-caption tone-secondary">Recovery · morning read</div>' +
                  '<div class="t-title" style="color:' + color + '">' + recovery.value + '</div>' +
                  '<div class="t-caption tone-secondary">' + KK.esc(recovery.delta + ' · from ' + recovery.source) + '</div>' +
                '</div>' +
                KK.icon('chevron-forward', 20, KK.c('text-muted')) +
              '</div>' +
            '</a>' +
          '</div>' +
          ui.sectionLabel('Score cards') +
          '<div class="health__grid">' + stats.map(statTile).join('') + '</div>' +
          ui.sectionLabel('Daily insight') +
          '<div class="card insight">' +
            '<p class="t-body tone-secondary">Your recovery is trending up. A calm evening — Restore soak and a warm floor — matches your best mornings.</p>' +
            ui.button({ label: 'Try Restore tonight', icon: 'sparkles-outline', tint: color }) +
          '</div>' +
        '</section>'
      );
    },
  });

  // ── Stat detail ──
  var RANGES = ['7D', '30D', '90D'];
  var LABELS = {
    '7D': ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    '30D': ['1', '4', '7', '10', '13', '16', '19', '22', '25', '30'],
    '90D': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  };
  var COUNTS = { '7D': 7, '30D': 10, '90D': 12 };

  /** Stretch the 7-day series to n points along its trend, with a fixed wobble (mock data). */
  function expandSeries(base, n) {
    var first = base[0];
    var last = base[base.length - 1];
    var out = [];
    for (var i = 0; i < n; i++) {
      var t = i / (n - 1);
      var trend = first + (last - first) * t;
      var wob = Math.sin(i * 0.9) * 2.5 + Math.sin(i * 0.37) * 1.5;
      out.push(Math.max(0, Math.round(trend + wob)));
    }
    out[n - 1] = last;
    return out;
  }

  function average(values) {
    return Math.round(values.reduce(function (a, b) { return a + b; }, 0) / values.length);
  }

  function chartHtml(stat, range, color) {
    var values = range === '7D' ? stat.series : expandSeries(stat.series, COUNTS[range]);
    var data = values.map(function (v, i) {
      return { label: LABELS[range][i] || '', value: v };
    });
    return ui.barChart({ data: data, height: 150, color: color, activeIndex: data.length - 1 });
  }

  function mini(label, value) {
    return '<div class="mini"><span class="mini__value">' + value + '</span><span class="mini__label t-label tone-secondary">' + label + '</span></div>';
  }

  KK.route('/health/stat/:id', {
    tab: 'health',
    render: function (ctx) {
      var stat = KK.data.stats.filter(function (s) { return s.id === ctx.params.id; })[0];
      if (!stat) return { redirect: '/health' };

      var state = ctx.state;
      if (!state.range) state.range = '7D';
      var color = KK.toneColor(stat.tone);

      var segment = RANGES.map(function (r) {
        return '<button type="button" class="segment__btn t-caption" data-range="' + r + '" aria-pressed="' + (r === state.range ? 'true' : 'false') + '">' + r + '</button>';
      }).join('');

      var highlights = stat.highlights
        .map(function (h) {
          return '<div class="row highlight">' + KK.icon('checkmark-circle', 18, color) + '<span class="t-caption tone-secondary highlight__text">' + KK.esc(h) + '</span></div>';
        })
        .join('');

      var sources = stat.sources.items
        .map(function (s) {
          return '<div class="row source-row">' + KK.icon('layers-outline', 16, KK.c('text-secondary')) + '<span class="t-caption tone-secondary">' + KK.esc(s) + '</span></div>';
        })
        .join('');

      return (
        '<section class="screen stat">' +
          ui.topBar({ back: '/health', title: stat.name }) +
          '<div class="stat__readout enter-up">' +
            '<div class="row stat__readout-top">' + ui.tile({ icon: stat.icon, color: color, size: 40, radius: 13 }) +
              '<span class="t-caption tone-secondary">' + KK.esc(stat.source) + '</span></div>' +
            '<div class="t-display stat__value" style="color:' + color + '">' + stat.value +
              (stat.unit ? '<span class="stat__unit"> ' + KK.esc(stat.unit) + '</span>' : '') + '</div>' +
            '<div class="row stat__delta">' + KK.icon('trending-up', 15, color) + '<span class="t-caption" style="color:' + color + '">' + KK.esc(stat.delta) + '</span></div>' +
          '</div>' +
          '<div class="segment" role="group" aria-label="Range">' + segment + '</div>' +
          '<div class="card stat__chart" id="stat-chart">' + chartHtml(stat, state.range, color) + '</div>' +
          '<div class="row stat__minis">' +
            mini('Today', stat.series[stat.series.length - 1]) + '<div class="mini-divider"></div>' +
            mini('7-day avg', average(stat.series)) + '<div class="mini-divider"></div>' +
            mini('30-day avg', average(expandSeries(stat.series, 30))) +
          '</div>' +
          ui.sectionLabel('Highlights') +
          '<div class="stat__highlights">' + highlights + '</div>' +
          ui.sectionLabel(stat.sources.group) +
          '<div class="card sources">' + sources + '</div>' +
        '</section>'
      );
    },
    mount: function (root, ctx) {
      var stat = KK.data.stats.filter(function (s) { return s.id === ctx.params.id; })[0];
      var color = KK.toneColor(stat.tone);
      var chart = root.querySelector('#stat-chart');

      root.querySelector('.segment').addEventListener('click', function (e) {
        var btn = e.target.closest('[data-range]');
        if (!btn) return;
        var range = btn.getAttribute('data-range');
        if (range === ctx.state.range) return;
        ctx.state.range = range;
        Array.prototype.forEach.call(root.querySelectorAll('[data-range]'), function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        chart.innerHTML = chartHtml(stat, range, color); // bars grow in again
      });
    },
  });
})();
