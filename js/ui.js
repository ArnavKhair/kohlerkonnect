/*
 * Template helpers. Each returns an HTML string styled by css/components.css.
 * Text passed in is escaped unless the option name ends in "Html".
 * Helpers take no colours: fills are the brand blue and ink follows the surface the
 * component sits on (see the ink contexts in css/tokens.css).
 */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});
  var ui = (KK.ui = {});

  var ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** Escape text for use in HTML content or attribute values. */
  KK.esc = function (value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ESCAPES[ch];
    });
  };

  var colorCache = {};

  /**
   * Resolve a colour token from css/tokens.css to its value, e.g. KK.c('primary').
   * Only for values that must be computed in JS; ink and fills belong in CSS.
   */
  KK.c = function (token) {
    if (!(token in colorCache)) {
      var value = getComputedStyle(document.documentElement).getPropertyValue('--c-' + token).trim();
      if (!value) console.error('KK.c: unknown colour token "' + token + '"');
      colorCache[token] = value;
    }
    return colorCache[token];
  };

  /** Light feedback where the browser supports it (Android); a no-op elsewhere. */
  KK.haptic = function (kind) {
    if (typeof navigator.vibrate !== 'function') return;
    try {
      navigator.vibrate(kind === 'success' ? [12, 40, 18] : 8);
    } catch (err) {
      /* vibration is optional */
    }
  };

  function attrs(map) {
    var out = '';
    Object.keys(map || {}).forEach(function (key) {
      var value = map[key];
      if (value === false || value == null) return;
      out += ' ' + key + (value === true ? '' : '="' + KK.esc(value) + '"');
    });
    return out;
  }

  /**
   * Button. opts: label, icon, variant ('primary' | 'secondary' | 'ghost'), block, disabled,
   * href (renders a link: '/devices'), replace (link replaces history), cls, attrs.
   */
  ui.button = function (opts) {
    var variant = opts.variant || 'primary';
    var cls = 'btn' + (variant !== 'primary' ? ' btn--' + variant : '') + (opts.block ? ' btn--block' : '') + (opts.cls ? ' ' + opts.cls : '');
    var inner = (opts.icon ? KK.icon(opts.icon, 20) : '') + '<span>' + KK.esc(opts.label) + '</span>';
    if (opts.href) {
      return '<a class="' + cls + '" href="#' + KK.esc(opts.href) + '"' + (opts.replace ? ' data-replace' : '') + attrs(opts.attrs) + '>' + inner + '</a>';
    }
    return '<button type="button" class="' + cls + '"' + (opts.disabled ? ' disabled' : '') + attrs(opts.attrs) + '>' + inner + '</button>';
  };

  /**
   * Icon-only button. opts: icon, label (for screen readers), then one of
   * href (a link), back (a Back button; the value is the fallback route) or neither (a plain button); cls, attrs.
   * With attrs { 'aria-current': 'true' } it shows as the current one of a row (the light pill).
   */
  ui.iconButton = function (opts) {
    var cls = 'icon-btn' + (opts.cls ? ' ' + opts.cls : '');
    var inner = KK.icon(opts.icon, 20);
    var label = ' aria-label="' + KK.esc(opts.label) + '"';
    if (opts.href) {
      return '<a class="' + cls + '" href="#' + KK.esc(opts.href) + '"' + label + attrs(opts.attrs) + '>' + inner + '</a>';
    }
    return (
      '<button type="button" class="' + cls + '"' + (opts.back ? ' data-back="' + KK.esc(opts.back) + '"' : '') + label + attrs(opts.attrs) + '>' +
      inner + '</button>'
    );
  };

  /** Round back button. `fallback` is the route used when there is no in-app history. */
  ui.backButton = function (fallback) {
    return ui.iconButton({ icon: 'chevron-left', label: 'Back', back: fallback });
  };

  /** Chip toggle. opts: label, icon, on, attrs. */
  ui.chip = function (opts) {
    return (
      '<button type="button" class="chip" aria-pressed="' + (opts.on ? 'true' : 'false') + '"' + attrs(opts.attrs) + '>' +
      (opts.icon ? KK.icon(opts.icon, 20) : '') + '<span>' + KK.esc(opts.label) + '</span></button>'
    );
  };

  /** Header of a tab's root page. opts: eyebrow, title, trailingHtml. */
  ui.pageHeader = function (opts) {
    return (
      '<header class="page-header"><div>' +
      (opts.eyebrow ? '<div class="t-13 tone-secondary">' + KK.esc(opts.eyebrow) + '</div>' : '') +
      '<h1 class="t-31 page-header__title">' + KK.esc(opts.title) + '</h1></div>' +
      (opts.trailingHtml || '') +
      '</header>'
    );
  };

  /** Header of a drill-down page. opts: title, back (fallback route), trailingHtml. */
  ui.topBar = function (opts) {
    var spacer = '<div class="topbar__spacer"></div>';
    return (
      '<header class="topbar">' +
      (opts.back ? ui.backButton(opts.back) : spacer) +
      '<h1 class="topbar__title t-20">' + KK.esc(opts.title || '') + '</h1>' +
      (opts.trailingHtml || spacer) +
      '</header>'
    );
  };

  /** Onboarding progress. opts: step, total, back (fallback route; omit for no back button). */
  ui.stepBar = function (opts) {
    return (
      '<div class="stepbar"><div class="stepbar__row">' +
      (opts.back ? ui.backButton(opts.back) : '<div class="topbar__spacer"></div>') +
      '<span class="t-13 tone-secondary">' + opts.step + ' of ' + opts.total + '</span></div>' +
      '<div class="stepbar__track" role="progressbar" aria-valuemin="0" aria-valuemax="' + opts.total + '" aria-valuenow="' + opts.step + '">' +
      '<div class="stepbar__fill" style="width:' + (opts.step / opts.total) * 100 + '%"></div></div></div>'
    );
  };

  /** Large icon on a brand-blue disc. opts: icon. */
  ui.heroMark = function (opts) {
    return '<div class="hero-mark">' + KK.icon(opts.icon, 50) + '</div>';
  };

  /**
   * Circular progress ring. opts: size, stroke, progress (0..1),
   * tone ('success' | 'warning' | 'danger'; omit for the brand blue), innerHtml.
   */
  ui.ring = function (opts) {
    var size = opts.size || 60;
    var stroke = opts.stroke || 5;
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var clamped = Math.max(0, Math.min(1, opts.progress || 0));
    var half = size / 2;
    return (
      '<div class="ring' + (opts.tone ? ' ring--' + opts.tone : '') + '" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg class="ring__svg" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<circle class="ring__track" cx="' + half + '" cy="' + half + '" r="' + r + '" stroke-width="' + stroke + '" fill="none"/>' +
      '<circle class="ring__value" cx="' + half + '" cy="' + half + '" r="' + r + '" stroke-width="' + stroke + '" fill="none" stroke-linecap="round"' +
      ' stroke-dasharray="' + c + ' ' + c + '" stroke-dashoffset="' + c * (1 - clamped) + '" transform="rotate(-90 ' + half + ' ' + half + ')"/>' +
      '</svg>' + (opts.innerHtml || '') + '</div>'
    );
  };

  /** Ring with an icon inside and a caption under it. opts: label, icon, progress, tone, size. */
  ui.statRing = function (opts) {
    return (
      '<div class="stat-ring">' +
      ui.ring({ size: opts.size || 50, stroke: 5, progress: opts.progress, tone: opts.tone, innerHtml: KK.icon(opts.icon, 20) }) +
      '<span class="t-13 tone-secondary">' + KK.esc(opts.label) + '</span></div>'
    );
  };

  /** Bar chart. opts: data [{label, value}], height, activeIndex. Bars grow in on render. */
  ui.barChart = function (opts) {
    var data = opts.data;
    var max = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    var bars = '';
    var labels = '';
    data.forEach(function (d, i) {
      var active = i === opts.activeIndex;
      var h = Math.max(0.06, d.value / max) * 100;
      bars += '<div class="barchart__wrap"><div class="barchart__bar' + (active ? ' is-active' : '') + '" style="height:' + h + '%;--i:' + i + '"></div></div>';
      labels += '<span class="barchart__label t-13' + (active ? ' is-active' : '') + '">' + KK.esc(d.label) + '</span>';
    });
    var summary = data.map(function (d) { return d.label + ' ' + d.value; }).join(', ');
    return (
      '<div class="barchart" role="img" aria-label="' + KK.esc('Bar chart: ' + summary) + '">' +
      '<div class="barchart__bars" style="height:' + (opts.height || 150) + 'px">' + bars + '</div>' +
      '<div class="barchart__labels" aria-hidden="true">' + labels + '</div></div>'
    );
  };

  /**
   * Segmented switch (room switcher, health areas, Today / Over time, chart range): the nav toggle in a pill track.
   * opts: name, items [{id, label, icon}], active (id), label (for screen readers).
   * Buttons carry data-seg="<name>" and data-value="<id>"; move the selection with ui.setSegment.
   * It scrolls sideways when the items do not fit.
   */
  ui.segment = function (opts) {
    var icons = opts.items.some(function (item) { return item.icon; });
    var buttons = opts.items
      .map(function (item) {
        return (
          '<button type="button" class="segment__btn" data-seg="' + KK.esc(opts.name) + '" data-value="' + KK.esc(item.id) + '"' +
          ' aria-pressed="' + (item.id === opts.active ? 'true' : 'false') + '">' +
          (item.icon ? KK.icon(item.icon, 20) : '') + '<span>' + KK.esc(item.label) + '</span></button>'
        );
      })
      .join('');
    return (
      '<div class="segment' + (icons ? ' segment--icons' : '') + '" role="group" aria-label="' + KK.esc(opts.label || opts.name) + '">' + buttons + '</div>'
    );
  };

  /** Mark `value` as the pressed button of the segment named `name` inside `root`, and bring it into view. */
  ui.setSegment = function (root, name, value) {
    Array.prototype.forEach.call(root.querySelectorAll('[data-seg="' + name + '"]'), function (btn) {
      var on = btn.getAttribute('data-value') === value;
      var track = btn.parentNode;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on && track.scrollWidth > track.clientWidth) {
        var b = btn.getBoundingClientRect();
        var t = track.getBoundingClientRect();
        track.scrollLeft += b.left + b.width / 2 - (t.left + t.width / 2);
      }
    });
  };

  /**
   * Product photo with a built-in fallback (the device icon on the photo panel).
   * The fallback always renders; the image covers it once loaded and removes itself if it fails,
   * so a missing address, no network or a moved image never shows a broken picture.
   * opts: src, alt, icon, cls, iconSize.
   */
  ui.photo = function (opts) {
    return (
      '<div class="photo' + (opts.cls ? ' ' + opts.cls : '') + '">' +
      '<div class="photo__fallback">' + KK.icon(opts.icon || 'home', opts.iconSize || 40) + '</div>' +
      (opts.src
        ? '<img class="photo__img" src="' + KK.esc(opts.src) + '" alt="' + KK.esc(opts.alt || '') + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">'
        : '') +
      '</div>'
    );
  };

  /**
   * Device card (the Figma Card): photo on the left, name, status line.
   * opts: status (text; defaults to the product's own), tone (adds a state dot: 'success' | 'warning' | 'danger' | 'idle'),
   * href (makes the card a link, e.g. '/devices/product/shower').
   */
  ui.deviceCard = function (product, opts) {
    opts = opts || {};
    var status = opts.status != null ? opts.status : product.status || '';
    var statusHtml = opts.tone
      ? ui.status({ label: status, tone: opts.tone, cls: 't-16 tone-secondary' })
      : '<div class="t-16 tone-secondary">' + KK.esc(status) + '</div>';
    var inner =
      ui.photo({ src: product.image, alt: product.name, icon: product.icon, cls: 'device-card__photo' }) +
      '<div class="device-card__text"><div class="t-20">' + KK.esc(product.name) + '</div>' + statusHtml + '</div>';
    if (opts.href) return '<a class="card device-card pressable" href="#' + KK.esc(opts.href) + '">' + inner + '</a>';
    return '<div class="card device-card">' + inner + '</div>';
  };

  /**
   * Callout on a photo: a dot at x / y (percent) joined by a short line to a label.
   * `on` marks the selected one (aria-pressed); the screen keeps exactly one selected.
   * The label sits on whichever side has more room.
   * opts: id, label, icon, on, x, y.
   */
  ui.callout = function (opts) {
    return (
      '<button type="button" class="callout' + (opts.x > 50 ? ' callout--left' : '') + '" data-callout="' + KK.esc(opts.id) + '"' +
      ' aria-pressed="' + (opts.on ? 'true' : 'false') + '" style="left:' + opts.x + '%;top:' + opts.y + '%">' +
      '<span class="callout__dot"></span><span class="callout__line"></span>' +
      '<span class="callout__label t-13">' + (opts.icon ? KK.icon(opts.icon, 15) : '') + '<span>' + KK.esc(opts.label) + '</span></span>' +
      '</button>'
    );
  };

  /**
   * State label: a coloured dot and text. The dot carries the colour; the text stays ink.
   * opts: label, tone ('success' default | 'warning' | 'danger' | 'idle'), cls (type classes; default small label).
   */
  ui.status = function (opts) {
    var tone = opts.tone && opts.tone !== 'success' ? ' status--' + opts.tone : '';
    return (
      '<span class="status' + tone + ' ' + (opts.cls || 't-13 tone-secondary') + '"><span class="status__dot"></span><span>' + KK.esc(opts.label) + '</span></span>'
    );
  };

  /** Uppercase section label. */
  ui.sectionLabel = function (text) {
    return '<h2 class="section-label t-13 tone-secondary">' + KK.esc(text) + '</h2>';
  };
})();
