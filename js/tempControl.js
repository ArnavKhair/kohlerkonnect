/*
 * Vertical "pan to set" value stepper (the Figma Thermostat frame).
 * A column of values: drag up/down, tap a value, or use the arrow keys.
 * The value in the middle is the selected one; on release it snaps with a spring.
 *
 *   html:  KK.tempControl.html({ steps, value, label, compact })   compact = 3 rows tall
 *   wire:  KK.tempControl.mount(element, { steps, value, onChange })
 */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});

  var ROW = 65; // px between steps; matches .tempctl__item in css/components.css
  var SNAP = { stiffness: 260, damping: 15, mass: 0.7 }; // "snappy" preset of the native build
  var GENTLE = { stiffness: 120, damping: 20, mass: 0.9 };

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  /** Piecewise-linear interpolation, clamped at both ends. */
  function interpolate(x, xs, ys) {
    if (x <= xs[0]) return ys[0];
    for (var i = 1; i < xs.length; i++) {
      if (x <= xs[i]) {
        var t = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
        return ys[i - 1] + (ys[i] - ys[i - 1]) * t;
      }
    }
    return ys[ys.length - 1];
  }

  function html(opts) {
    var index = Math.max(0, opts.steps.indexOf(opts.value));
    var items = opts.steps
      .map(function (step, i) {
        return '<div class="tempctl__item" data-index="' + i + '">' + KK.esc(step) + '</div>';
      })
      .join('');
    return (
      '<div class="tempctl' + (opts.compact ? ' tempctl--compact' : '') + '" role="slider" tabindex="0" aria-orientation="vertical"' +
      ' aria-label="' + KK.esc(opts.label || 'Value') + '"' +
      ' aria-valuemin="' + opts.steps[0] + '" aria-valuemax="' + opts.steps[opts.steps.length - 1] + '"' +
      ' aria-valuenow="' + opts.steps[index] + '">' + items + '</div>'
    );
  }

  function mount(el, opts) {
    var steps = opts.steps;
    var last = steps.length - 1;
    var items = Array.prototype.slice.call(el.querySelectorAll('.tempctl__item'));
    var pos = Math.max(0, steps.indexOf(opts.value)); // fractional index of the centred value
    var committed = Math.round(pos);
    var frame = 0;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw() {
      var active = Math.round(pos);
      items.forEach(function (item, i) {
        var d = pos - i;
        var scale = interpolate(pos, [i - 4, i - 2, i, i + 2, i + 4], [0.55, 0.78, 1, 0.78, 0.55]);
        var opacity = interpolate(pos, [i - 4, i - 1, i, i + 1, i + 4], [0.15, 0.5, 1, 0.5, 0.15]);
        // Larger values sit above the centre, as in the native build.
        item.style.transform = 'translateY(' + d * ROW + 'px) scale(' + scale + ')';
        item.style.opacity = opacity;
        item.classList.toggle('is-active', i === active);
      });
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    function springTo(target, cfg) {
      stop();
      if (reduced) {
        pos = target;
        draw();
        return;
      }
      var velocity = 0;
      var prev = performance.now();
      function tick(now) {
        var dt = Math.min(0.032, (now - prev) / 1000);
        prev = now;
        // Fixed 4ms sub-steps keep the integration stable at any frame rate.
        for (var t = dt; t > 0; t -= 0.004) {
          var h = Math.min(0.004, t);
          var accel = (-cfg.stiffness * (pos - target) - cfg.damping * velocity) / cfg.mass;
          velocity += accel * h;
          pos += velocity * h;
        }
        if (Math.abs(pos - target) < 0.001 && Math.abs(velocity) < 0.01) {
          pos = target;
          frame = 0;
        } else {
          frame = requestAnimationFrame(tick);
        }
        draw();
      }
      frame = requestAnimationFrame(tick);
    }

    function commit(index, cfg) {
      var target = clamp(index, 0, last);
      springTo(target, cfg || SNAP);
      el.setAttribute('aria-valuenow', steps[target]);
      if (target !== committed) {
        committed = target;
        KK.haptic('light');
        if (opts.onChange) opts.onChange(steps[target]);
      }
    }

    // ── Pointer: drag, or tap a value ──
    var drag = null;

    el.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button !== 0) return;
      stop();
      drag = { id: e.pointerId, y: e.clientY, base: pos, moved: false, target: e.target };
      try {
        el.setPointerCapture(e.pointerId); // keep receiving moves when the pointer leaves the control
      } catch (err) {
        /* capture is an enhancement; dragging inside the control works without it */
      }
    });

    el.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dy = e.clientY - drag.y;
      if (!drag.moved && Math.abs(dy) < 8) return;
      drag.moved = true;
      el.classList.add('is-dragging');
      // The column follows the finger: dragging down brings a larger value to the centre.
      pos = clamp(drag.base + dy / ROW, 0, last);
      draw();
    });

    function end(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag;
      drag = null;
      el.classList.remove('is-dragging');
      if (d.moved) {
        commit(Math.round(pos));
        return;
      }
      var item = d.target.closest ? d.target.closest('.tempctl__item') : null;
      commit(item && e.type === 'pointerup' ? Number(item.getAttribute('data-index')) : Math.round(pos));
    }

    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);

    // ── Keyboard ──
    el.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') next = committed + 1;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') next = committed - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      else if (e.key === 'PageUp') next = committed + 3;
      else if (e.key === 'PageDown') next = committed - 3;
      if (next === null) return;
      e.preventDefault();
      commit(next);
    });

    draw();

    return {
      /** Move to a value set from outside the control. */
      setValue: function (value) {
        var i = steps.indexOf(value);
        if (i < 0 || i === committed) return;
        committed = i;
        el.setAttribute('aria-valuenow', steps[i]);
        springTo(i, GENTLE);
      },
    };
  }

  KK.tempControl = { html: html, mount: mount };
})();
