/* Routines for a product: /devices/routines/:id (current, recommended, create my own) */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  function chosenCount(state) {
    return Object.keys(state.chosen).filter(function (id) { return state.chosen[id]; }).length;
  }

  function recommendedHtml() {
    return (
      '<div class="card rec-card" id="routine-rec">' +
        '<div class="row rec-card__header tone-accent">' + KK.icon('sparkles', 20) + '<span class="t-13">Recommended</span></div>' +
        '<h3 class="t-20">Calm evenings</h3>' +
        '<p class="t-16 tone-secondary">Restore soak, dim the mirror, warm the seat — suggested from your last 7 nights.</p>' +
        '<div class="action-pair">' +
          ui.button({ label: 'Approve', attrs: { 'data-action': 'approve' } }) +
          ui.button({ label: 'Dismiss', variant: 'secondary', attrs: { 'data-action': 'dismiss' } }) +
        '</div>' +
      '</div>'
    );
  }

  /** The bottom of the creator card: either the Preview button or the preview itself. */
  function creatorFootHtml(state) {
    if (!state.previewing) {
      return ui.button({ label: 'Preview routine', icon: 'eye', variant: 'secondary', block: true, attrs: { 'data-action': 'preview' } });
    }
    var n = chosenCount(state);
    return (
      '<div class="creator__preview">' +
        '<p class="t-16 tone-secondary">“' + KK.esc(state.name) + '” — ' + n + ' action' + (n === 1 ? '' : 's') + ' scheduled daily.</p>' +
        '<div class="action-pair">' +
          ui.button({ label: 'Approve', attrs: { 'data-action': 'approve' } }) +
          ui.button({ label: 'Edit', variant: 'secondary', attrs: { 'data-action': 'edit' } }) +
        '</div>' +
      '</div>'
    );
  }

  KK.route('/devices/routines/:id', {
    tab: 'devices',
    render: function (ctx) {
      var product = KK.data.products[ctx.params.id];
      if (!product) return { redirect: '/devices' };

      var state = ctx.state;
      if (!state.active) {
        state.active = {};
        KK.data.routines.forEach(function (r) {
          state.active[r.id] = r.active;
        });
        state.recommended = true;
        state.name = 'My morning';
        state.chosen = { warm: true, shower: true };
        state.previewing = false;
      }

      var rows = KK.data.routines
        .map(function (r, i) {
          return (
            '<div class="enter-up" style="--d:' + i + '">' +
              '<button type="button" class="card pressable routine-row" data-routine="' + r.id + '" aria-pressed="' + (state.active[r.id] ? 'true' : 'false') + '">' +
                '<span class="routine-row__check">' + KK.icon('check', 20) + '</span>' +
                '<span class="routine-row__body"><span class="t-20">' + KK.esc(r.name) + '</span>' +
                '<span class="t-16 tone-secondary">' + KK.esc(r.when + ' · ' + r.desc) + '</span></span>' +
              '</button>' +
            '</div>'
          );
        })
        .join('');

      var steps = KK.data.routineSteps
        .map(function (s) {
          return ui.chip({ label: s.label, icon: s.icon, on: !!state.chosen[s.id], attrs: { 'data-step': s.id } });
        })
        .join('');

      return (
        '<section class="screen routines">' +
          ui.topBar({ back: '/devices/product/' + product.id, title: 'Routines · ' + product.name }) +
          ui.sectionLabel('Current routines') +
          '<div class="stack">' + rows + (state.recommended ? recommendedHtml() : '') + '</div>' +
          ui.sectionLabel('Create my own') +
          '<div class="card creator">' +
            '<input class="field" id="routine-name" type="text" autocomplete="off" aria-label="Routine name" placeholder="Name your routine" value="' + KK.esc(state.name) + '">' +
            '<div class="row creator__steps">' + steps + '</div>' +
            '<div id="creator-foot">' + creatorFootHtml(state) + '</div>' +
          '</div>' +
        '</section>'
      );
    },
    mount: function (root, ctx) {
      var state = ctx.state;
      var foot = root.querySelector('#creator-foot');

      function drawFoot() {
        foot.innerHTML = creatorFootHtml(state);
      }

      root.querySelector('#routine-name').addEventListener('input', function (e) {
        state.name = e.target.value;
        if (state.previewing) drawFoot();
      });

      root.addEventListener('click', function (e) {
        var row = e.target.closest('[data-routine]');
        if (row) {
          var rid = row.getAttribute('data-routine');
          state.active[rid] = !state.active[rid];
          row.setAttribute('aria-pressed', state.active[rid] ? 'true' : 'false');
          KK.haptic('light');
          return;
        }

        var step = e.target.closest('[data-step]');
        if (step) {
          var sid = step.getAttribute('data-step');
          state.chosen[sid] = !state.chosen[sid];
          step.setAttribute('aria-pressed', state.chosen[sid] ? 'true' : 'false');
          KK.haptic('light');
          if (state.previewing) drawFoot();
          return;
        }

        var action = e.target.closest('[data-action]');
        if (!action) return;
        var name = action.getAttribute('data-action');
        if (name === 'preview') state.previewing = true;
        if (name === 'edit') state.previewing = false;
        if (name === 'approve' || name === 'dismiss') {
          // Approving (from either card) also clears the recommendation, as in the native build.
          if (name === 'approve') {
            KK.haptic('success');
            state.previewing = false;
          }
          state.recommended = false;
          var rec = root.querySelector('#routine-rec');
          if (rec) rec.remove();
        }
        drawFoot();
      });
    },
  });
})();
