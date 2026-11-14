/*
 * Health tab: /health (and /health/:area to open on a given area).
 * One living visual at the top for the selected area, chips to switch area,
 * then Today | Over time with a chart and what it means.
 */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  var WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  var LONG = {
    '30D': { count: 10, labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '30'], title: 'Last 30 days' },
    '90D': { count: 12, labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], title: 'Last 12 weeks' },
  };

  function findArea(id) {
    return KK.data.health.filter(function (a) { return a.id === id; })[0];
  }

  /** 0..1 for the visual, where 1 is always the healthy end. */
  function levelOf(area) {
    var v = Math.max(0, Math.min(100, area.value)) / 100;
    return area.lowerIsBetter ? 1 - v : v;
  }

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

  function chart(values, labels, color) {
    var data = values.map(function (v, i) {
      return { label: labels[i] || '', value: v };
    });
    return ui.barChart({ data: data, height: 140, color: color, activeIndex: data.length - 1 });
  }

  function mini(label, value) {
    return '<div class="mini"><span class="mini__value">' + value + '</span><span class="mini__label t-13 tone-secondary">' + label + '</span></div>';
  }

  function meaning(text, color) {
    return (
      '<div class="meaning">' + KK.icon('checkmark-circle', 18, color) +
      '<div><div class="t-13 tone-secondary caps">What this means</div><p class="t-16 meaning__text">' + KK.esc(text) + '</p></div></div>'
    );
  }

  // ── The parts that change with the selected area ──
  function heroHtml(area) {
    var color = KK.c(area.color);
    var moving = area.delta.indexOf('Up') === 0 || area.delta.indexOf('Down') === 0;
    return (
      '<div class="health-hero card" style="--tint:' + color + '">' +
        '<div class="health-hero__visual" role="img" aria-label="' + KK.esc(area.visualCaption) + '">' + KK.visual(area.visual, levelOf(area)) + '</div>' +
        '<div class="health-hero__read">' +
          '<div class="t-13 tone-secondary caps">' + KK.esc(area.name) + '</div>' +
          '<div class="health-hero__value" style="color:' + color + '">' + area.value +
            (area.unit ? '<span class="health-hero__unit"> ' + KK.esc(area.unit) + '</span>' : '') + '</div>' +
          '<div class="row health-hero__delta">' + KK.icon(moving ? 'trending-up' : 'remove', 14, color) +
            '<span class="t-16" style="color:' + color + '">' + KK.esc(area.delta) + '</span></div>' +
        '</div>' +
        '<p class="health-hero__caption t-16 tone-secondary">' + KK.esc(area.visualCaption) + '</p>' +
      '</div>'
    );
  }

  function panelHtml(area, state) {
    var color = KK.c(area.color);
    if (state.tab === 'today') {
      return (
        '<div class="card health-chart"><div class="t-13 tone-secondary health-chart__title">This week</div>' + chart(area.series, WEEK, color) + '</div>' +
        '<div class="row stat__minis">' +
          mini('Today', area.series[area.series.length - 1]) + '<div class="mini-divider"></div>' +
          mini('7-day avg', average(area.series)) + '<div class="mini-divider"></div>' +
          mini('30-day avg', average(expandSeries(area.series, 30))) +
        '</div>' +
        meaning(area.todayNote, color)
      );
    }
    var range = LONG[state.range];
    return (
      ui.segment({ name: 'range', label: 'Range', active: state.range, items: [{ id: '30D', label: '30 days' }, { id: '90D', label: '90 days' }] }) +
      '<div class="card health-chart"><div class="t-13 tone-secondary health-chart__title">' + range.title + '</div>' +
        chart(expandSeries(area.series, range.count), range.labels, color) + '</div>' +
      meaning(area.trendNote, color)
    );
  }

  function detailHtml(area, state) {
    var sources = area.sources
      .map(function (s) {
        return '<div class="row source-row">' + KK.icon('layers-outline', 16, KK.c('text-secondary')) + '<span class="t-16 tone-secondary">' + KK.esc(s) + '</span></div>';
      })
      .join('');
    return (
      ui.segment({ name: 'tab', label: 'View', active: state.tab, items: [{ id: 'today', label: 'Today' }, { id: 'time', label: 'Over time' }] }) +
      '<div id="health-panel" class="health__panel">' + panelHtml(area, state) + '</div>' +
      ui.sectionLabel('How this is measured') +
      '<div class="card sources">' + sources + '</div>'
    );
  }

  function render(ctx, initialArea) {
    var state = ctx.state;
    if (!state.area) {
      state.area = initialArea || KK.data.health[0].id;
      state.tab = 'today';
      state.range = '30D';
    }
    var area = findArea(state.area);

    var chips = KK.data.health
      .map(function (a) {
        return ui.chip({ label: a.name, icon: a.icon, on: a.id === area.id, tint: KK.c(a.color), attrs: { 'data-area': a.id } });
      })
      .join('');

    return (
      '<section class="screen health">' +
        '<header class="page-header">' +
          '<div><div class="t-13 tone-secondary">YOUR HEALTH</div><h1 class="t-31">Today</h1></div>' +
          KK.icon('shield-checkmark-outline', 24, KK.c('text-secondary')) +
        '</header>' +
        '<div id="health-hero">' + heroHtml(area) + '</div>' +
        '<div class="health__chips" id="health-chips" role="group" aria-label="Health area">' + chips + '</div>' +
        '<div id="health-detail" class="health__detail">' + detailHtml(area, state) + '</div>' +
        ui.sectionLabel('Daily insight') +
        '<div class="card insight">' +
          '<p class="t-16 tone-secondary">Your recovery is trending up. A calm evening — Restore soak and a warm floor — matches your best mornings.</p>' +
          ui.button({ label: 'Try Restore tonight', icon: 'sparkles-outline', tint: KK.c('success') }) +
        '</div>' +
      '</section>'
    );
  }

  function mount(root, ctx) {
    var state = ctx.state;
    var hero = root.querySelector('#health-hero');
    var detail = root.querySelector('#health-detail');

    root.querySelector('#health-chips').addEventListener('click', function (e) {
      var chip = e.target.closest('[data-area]');
      if (!chip || chip.getAttribute('data-area') === state.area) return;
      state.area = chip.getAttribute('data-area');
      Array.prototype.forEach.call(root.querySelectorAll('[data-area]'), function (c) {
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      var area = findArea(state.area);
      hero.innerHTML = heroHtml(area);
      detail.innerHTML = detailHtml(area, state);
      KK.haptic('light');
    });

    detail.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-seg]');
      if (!btn) return;
      var name = btn.getAttribute('data-seg');
      var value = btn.getAttribute('data-value');
      if (state[name] === value) return;
      state[name] = value;
      ui.setSegment(detail, name, value);
      detail.querySelector('#health-panel').innerHTML = panelHtml(findArea(state.area), state);
    });
  }

  KK.route('/health', {
    tab: 'health',
    render: function (ctx) {
      return render(ctx);
    },
    mount: mount,
  });

  KK.route('/health/:area', {
    tab: 'health',
    render: function (ctx) {
      if (!findArea(ctx.params.area)) return { redirect: '/health' };
      return render(ctx, ctx.params.area);
    },
    mount: mount,
  });

  // Paths from before the score cards became areas.
  var RENAMED = { recovery: 'wellness', steadiness: 'mobility' };
  KK.route('/health/stat/:id', {
    render: function (ctx) {
      return { redirect: '/health/' + (RENAMED[ctx.params.id] || ctx.params.id) };
    },
  });
})();
