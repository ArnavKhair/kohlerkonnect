/*
 * Device page: /devices/product/:id
 * The product photo carries one callout per setting. One setting is selected at a time,
 * and the stepper under the photo edits that setting with its own values and unit.
 */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  function findQuick(product, id) {
    return product.quick.filter(function (q) { return q.id === id; })[0];
  }

  /** What the values of a setting are: its unit ('°C') or, for word values, its scale ('Strength'). */
  function kindOf(q) {
    return q.unit || q.scale || '';
  }

  /** A value as text: 39 °C, 70%, Medium. */
  function valueText(q, value) {
    if (typeof value !== 'number' || !q.unit) return String(value);
    return value + (q.unit === '%' ? '%' : ' ' + q.unit);
  }

  function currentText(q, value) {
    return q.label + ' · ' + valueText(q, value);
  }

  /** Heading and stepper for one setting. */
  function controlHtml(q, value) {
    var kind = kindOf(q);
    return (
      '<p class="t-13 tone-secondary center">' + KK.esc(q.label + (kind ? ' · ' + kind : '')) + '</p>' +
      KK.tempControl.html({ steps: q.steps, value: value, label: q.label + (kind ? ' (' + kind + ')' : ''), compact: true })
    );
  }

  function setButtonInner(justSet) {
    return (justSet ? KK.icon('check', 20) : '') + '<span>Set</span>';
  }

  KK.route('/devices/product/:id', {
    tab: 'devices',
    render: function (ctx) {
      var product = KK.data.products[ctx.params.id];
      if (!product) return { redirect: '/devices' };

      var state = ctx.state;
      if (!state.values) {
        // The first setting is the product's main one.
        state.selected = product.quick[0].id;
        state.values = {};
        product.quick.forEach(function (q) {
          state.values[q.id] = q.value;
        });
      }

      var room = KK.data.rooms.filter(function (r) { return r.id === product.roomId; })[0];
      var selected = findQuick(product, state.selected);

      var callouts = product.quick
        .map(function (q) {
          return ui.callout({ id: q.id, label: q.label, icon: q.icon, on: q.id === state.selected, x: q.x, y: q.y });
        })
        .join('');

      return (
        '<section class="screen product">' +
          ui.topBar({
            back: '/devices/room/' + product.roomId,
            title: product.name,
            trailingHtml: ui.iconButton({ icon: 'list-bullet', label: 'Routines', href: '/devices/routines/' + product.id }),
          }) +
          '<div class="callout-stage on-light enter-up">' +
            ui.photo({ src: product.image, alt: product.name, icon: product.icon, iconSize: 100 }) +
            '<div class="callout-stage__layer" id="product-callouts" role="group" aria-label="Setting to change">' + callouts + '</div>' +
          '</div>' +
          '<div class="product__meta">' +
            '<span class="t-16 tone-secondary">' + KK.esc((room ? room.name + ' · ' : '') + (product.status || '')) + '</span>' +
            '<span class="t-16 tone-muted" id="product-current">' + KK.esc(currentText(selected, state.values[selected.id])) + '</span>' +
          '</div>' +
          '<div class="card product__control enter-up" style="--d:1">' +
            '<div class="product__control-body" id="product-control-body">' + controlHtml(selected, state.values[selected.id]) + '</div>' +
            '<button type="button" class="btn btn--block" id="product-set">' + setButtonInner(false) + '</button>' +
          '</div>' +
          '<p class="product__hint t-16 tone-muted center">Tap a setting on the photo to change it.</p>' +
        '</section>'
      );
    },
    mount: function (root, ctx) {
      var product = KK.data.products[ctx.params.id];
      var state = ctx.state;
      var body = root.querySelector('#product-control-body');
      var current = root.querySelector('#product-current');
      var setBtn = root.querySelector('#product-set');
      var timer = 0;

      /** Wire the stepper that is in the control card to the selected setting. */
      function mountControl() {
        var q = findQuick(product, state.selected);
        KK.tempControl.mount(body.querySelector('.tempctl'), {
          steps: q.steps,
          value: state.values[q.id],
          onChange: function (v) {
            state.values[q.id] = v;
            current.textContent = currentText(q, v);
          },
        });
      }

      mountControl();

      root.querySelector('#product-callouts').addEventListener('click', function (e) {
        var callout = e.target.closest('[data-callout]');
        if (!callout) return;
        var id = callout.getAttribute('data-callout');
        if (id === state.selected) return; // one setting is always selected
        state.selected = id;
        Array.prototype.forEach.call(root.querySelectorAll('[data-callout]'), function (c) {
          c.setAttribute('aria-pressed', c === callout ? 'true' : 'false');
        });
        var q = findQuick(product, id);
        body.innerHTML = controlHtml(q, state.values[id]);
        mountControl();
        current.textContent = currentText(q, state.values[id]);
        clearTimeout(timer);
        setBtn.innerHTML = setButtonInner(false);
        KK.haptic('light');
      });

      // The button's content changes for a moment after a press, so it is built here rather than by ui.button.
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
