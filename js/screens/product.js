/*
 * Device page: /devices/product/:id
 * Product photo with feature callouts (the quick controls), then the value stepper and Set.
 */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  function setButtonInner(justSet) {
    return (justSet ? KK.icon('checkmark', 18) : '') + '<span>' + (justSet ? 'Set ✓' : 'Set') + '</span>';
  }

  function featureSummary(product, state) {
    var on = product.quick.filter(function (q) { return state.quick[q.id]; }).length;
    return on + ' of ' + product.quick.length + ' features on';
  }

  KK.route('/devices/product/:id', {
    tab: 'devices',
    render: function (ctx) {
      var product = KK.data.products[ctx.params.id];
      if (!product) return { redirect: '/devices' };

      var state = ctx.state;
      if (state.value == null) {
        state.value = product.steps[Math.floor(product.steps.length / 2)];
        state.quick = {};
        product.quick.forEach(function (q) {
          state.quick[q.id] = q.on;
        });
      }

      var room = KK.data.rooms.filter(function (r) { return r.id === product.roomId; })[0];
      var accent = KK.c(product.accent);
      var label = product.unit === '%' ? 'Brightness' : 'Set point';

      var callouts = product.quick
        .map(function (q) {
          return ui.callout({ id: q.id, label: q.label, icon: q.icon, on: state.quick[q.id], x: q.x, y: q.y, tint: accent });
        })
        .join('');

      return (
        '<section class="screen product">' +
          ui.topBar({
            back: '/devices/room/' + product.roomId,
            title: product.name,
            trailingHtml:
              '<a class="icon-btn" href="#/devices/routines/' + product.id + '" aria-label="Routines">' +
              KK.icon('list-outline', 22, KK.c('text-secondary')) + '</a>',
          }) +
          '<div class="product__stage enter-up">' +
            ui.photo({ src: product.image, alt: product.name, icon: product.icon, color: accent, cls: 'product__photo', iconSize: 96 }) +
            '<div class="product__callouts" id="product-callouts">' + callouts + '</div>' +
          '</div>' +
          '<div class="product__meta">' +
            '<span class="t-caption tone-secondary">' + KK.esc((room ? room.name + ' · ' : '') + (product.status || '')) + '</span>' +
            '<span class="t-caption tone-muted" id="product-features">' + featureSummary(product, state) + '</span>' +
          '</div>' +
          '<div class="card product__control enter-up" style="--d:80ms">' +
            '<p class="product__control-label t-label tone-secondary">' + label.toUpperCase() + ' · ' + KK.esc(product.unit) + '</p>' +
            KK.tempControl.html({ steps: product.steps, value: state.value, accent: accent, label: label + ' (' + product.unit + ')', compact: true }) +
            '<button type="button" class="btn btn--block product__set" id="product-set" style="--tint:' + accent + '">' + setButtonInner(false) + '</button>' +
          '</div>' +
          '<p class="product__hint t-caption tone-muted">Tap a feature on the photo to switch it on or off.</p>' +
        '</section>'
      );
    },
    mount: function (root, ctx) {
      var product = KK.data.products[ctx.params.id];
      var state = ctx.state;

      KK.tempControl.mount(root.querySelector('.tempctl'), {
        steps: product.steps,
        value: state.value,
        onChange: function (v) {
          state.value = v;
        },
      });

      var summary = root.querySelector('#product-features');
      root.querySelector('#product-callouts').addEventListener('click', function (e) {
        var callout = e.target.closest('[data-callout]');
        if (!callout) return;
        var id = callout.getAttribute('data-callout');
        state.quick[id] = !state.quick[id];
        callout.setAttribute('aria-pressed', state.quick[id] ? 'true' : 'false');
        summary.textContent = featureSummary(product, state);
        KK.haptic('light');
      });

      var setBtn = root.querySelector('#product-set');
      var timer = 0;
      setBtn.addEventListener('click', function () {
        KK.haptic('success');
        setBtn.innerHTML = setButtonInner(true);
        clearTimeout(timer);
        timer = setTimeout(function () {
          setBtn.innerHTML = setButtonInner(false);
        }, 1300);
      });
    },
  });
})();
