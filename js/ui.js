/*
 * Template helpers. Each returns an HTML string styled by css/components.css.
 * Text passed in is escaped unless the option name ends in "Html".
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

  /** Resolve a colour token from css/tokens.css to its hex value, e.g. KK.c('primary'). */
  KK.c = function (token) {
    if (!(token in colorCache)) {
      var value = getComputedStyle(document.documentElement).getPropertyValue('--c-' + token).trim();
      if (!value) console.error('KK.c: unknown colour token "' + token + '"');
      colorCache[token] = value;
    }
    return colorCache[token];
  };

  /** Append a two-digit hex alpha to a 6-digit hex colour: KK.alpha('#4a6ba9', '1F'). */
  KK.alpha = function (hex, aa) {
    return hex + aa;
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
   * Button. opts: label, icon, variant ('primary' | 'secondary' | 'ghost'), tint, block,
   * disabled, href (renders a link: '/devices'), replace (link replaces history), cls, attrs.
   */
  ui.button = function (opts) {
    var variant = opts.variant || 'primary';
    var cls = 'btn' + (variant !== 'primary' ? ' btn--' + variant : '') + (opts.block ? ' btn--block' : '') + (opts.cls ? ' ' + opts.cls : '');
    var style = opts.tint ? ' style="--tint:' + opts.tint + '"' : '';
    var inner = (opts.icon ? KK.icon(opts.icon, 20) : '') + '<span>' + KK.esc(opts.label) + '</span>';
    if (opts.href) {
      return '<a class="' + cls + '"' + style + ' href="#' + opts.href + '"' + (opts.replace ? ' data-replace' : '') + attrs(opts.attrs) + '>' + inner + '</a>';
    }
    return '<button type="button" class="' + cls + '"' + style + (opts.disabled ? ' disabled' : '') + attrs(opts.attrs) + '>' + inner + '</button>';
  };

  /** Chip toggle. opts: label, icon, on, tint, attrs. */
  ui.chip = function (opts) {
    return (
      '<button type="button" class="chip" aria-pressed="' + (opts.on ? 'true' : 'false') + '"' +
      (opts.tint ? ' style="--tint:' + opts.tint + '"' : '') + attrs(opts.attrs) + '>' +
      (opts.icon ? KK.icon(opts.icon, 16) : '') + '<span>' + KK.esc(opts.label) + '</span></button>'
    );
  };

  /** Icon on a tinted square. opts: icon, color, size (px), radius (px), iconSize, alpha. */
  ui.tile = function (opts) {
    var size = opts.size || 44;
    return (
      '<div class="tile" style="--size:' + size + 'px;' + (opts.radius ? '--radius:' + opts.radius + 'px;' : '') +
      'background:' + KK.alpha(opts.color, opts.alpha || '1F') + '">' + KK.icon(opts.icon, opts.iconSize || 22, opts.color) + '</div>'
    );
  };

  /** Round back button. `fallback` is the route used when there is no in-app history. */
  ui.backButton = function (fallback, color) {
    return (
      '<button type="button" class="icon-btn" data-back="' + KK.esc(fallback) + '" aria-label="Back">' +
      KK.icon('chevron-left', 22, color || KK.c('text')) + '</button>'
    );
  };

  /** Header bar. opts: title, accent, back (fallback route), trailingHtml. */
  ui.topBar = function (opts) {
    var spacer = '<div class="topbar__spacer"></div>';
    return (
      '<header class="topbar">' +
      (opts.back ? ui.backButton(opts.back, opts.accent) : '') +
      (opts.title ? '<h1 class="topbar__title"' + (opts.accent ? ' style="color:' + opts.accent + '"' : '') + '>' + KK.esc(opts.title) + '</h1>' : spacer) +
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

  /** Icon in an accent ring. opts: icon, tint, size. */
  ui.heroMark = function (opts) {
    var tint = opts.tint || KK.c('primary');
    var size = opts.size || 120;
    return (
      '<div class="hero-mark" style="width:' + size + 'px;height:' + size + 'px;border-color:' + tint + ';background:' + KK.alpha(tint, '1A') + '">' +
      KK.icon(opts.icon, Math.round(size * 0.42), tint) + '</div>'
    );
  };

  /** Circular progress ring. opts: size, stroke, progress (0..1), color, track, innerHtml. */
  ui.ring = function (opts) {
    var size = opts.size || 64;
    var stroke = opts.stroke || 6;
    var color = opts.color || KK.c('energy');
    var track = opts.track || KK.c('ring-track');
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var clamped = Math.max(0, Math.min(1, opts.progress || 0));
    var half = size / 2;
    return (
      '<div class="ring" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg class="ring__svg" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<circle cx="' + half + '" cy="' + half + '" r="' + r + '" stroke="' + track + '" stroke-width="' + stroke + '" fill="none"/>' +
      '<circle cx="' + half + '" cy="' + half + '" r="' + r + '" stroke="' + color + '" stroke-width="' + stroke + '" fill="none" stroke-linecap="round"' +
      ' stroke-dasharray="' + c + ' ' + c + '" stroke-dashoffset="' + c * (1 - clamped) + '" transform="rotate(-90 ' + half + ' ' + half + ')"/>' +
      '</svg>' + (opts.innerHtml || '') + '</div>'
    );
  };

  /** Bar chart. opts: data [{label, value}], height, color, activeIndex. Bars grow in on render. */
  ui.barChart = function (opts) {
    var data = opts.data;
    var max = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    var bars = '';
    var labels = '';
    data.forEach(function (d, i) {
      var active = i === opts.activeIndex;
      var h = Math.max(0.06, d.value / max) * 100;
      bars += '<div class="barchart__wrap"><div class="barchart__bar' + (active ? ' is-active' : '') + '" style="height:' + h + '%;--i:' + i + '"></div></div>';
      labels += '<span class="barchart__label' + (active ? ' is-active' : '') + '">' + KK.esc(d.label) + '</span>';
    });
    var summary = data.map(function (d) { return d.label + ' ' + d.value; }).join(', ');
    return (
      '<div class="barchart" role="img" aria-label="' + KK.esc('Bar chart: ' + summary) + '" style="--tint:' + (opts.color || KK.c('primary')) + '">' +
      '<div class="barchart__bars" style="height:' + (opts.height || 150) + 'px">' + bars + '</div>' +
      '<div class="barchart__labels" aria-hidden="true">' + labels + '</div></div>'
    );
  };

  /**
   * Segmented switch (room switcher, Today / Over time, chart range).
   * opts: name, items [{id, label}], active (id), label (for screen readers), tint, nav (larger, tinted style).
   * Buttons carry data-seg="<name>" and data-value="<id>"; move the selection with ui.setSegment.
   */
  ui.segment = function (opts) {
    var buttons = opts.items
      .map(function (item) {
        return (
          '<button type="button" class="segment__btn t-16" data-seg="' + KK.esc(opts.name) + '" data-value="' + KK.esc(item.id) + '"' +
          ' aria-pressed="' + (item.id === opts.active ? 'true' : 'false') + '">' + KK.esc(item.label) + '</button>'
        );
      })
      .join('');
    return (
      '<div class="segment' + (opts.nav ? ' segment--nav' : '') + '" role="group" aria-label="' + KK.esc(opts.label || opts.name) + '"' +
      (opts.tint ? ' style="--tint:' + opts.tint + '"' : '') + '>' + buttons + '</div>'
    );
  };

  /** Mark `value` as the pressed button of the segment named `name` inside `root`. */
  ui.setSegment = function (root, name, value) {
    Array.prototype.forEach.call(root.querySelectorAll('[data-seg="' + name + '"]'), function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-value') === value ? 'true' : 'false');
    });
  };

  /**
   * Product photo with a built-in fallback (the device icon on a tinted panel).
   * The fallback always renders; the image covers it once loaded and removes itself if it fails,
   * so a missing address, no network or a moved image never shows a broken picture.
   * opts: src, alt, icon, color, cls, iconSize.
   */
  ui.photo = function (opts) {
    var color = opts.color || KK.c('primary');
    return (
      '<div class="photo' + (opts.cls ? ' ' + opts.cls : '') + '" style="--tint:' + color + '">' +
      '<div class="photo__fallback">' + KK.icon(opts.icon || 'home', opts.iconSize || 44, color) + '</div>' +
      (opts.src
        ? '<img class="photo__img" src="' + KK.esc(opts.src) + '" alt="' + KK.esc(opts.alt || '') + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">'
        : '') +
      '</div>'
    );
  };

  /** Device tile for the Devices grid: photo, name, status line. Links to the device page. */
  ui.deviceTile = function (product) {
    var accent = KK.c(product.accent);
    return (
      '<a class="pressable device-tile card" href="#/devices/product/' + KK.esc(product.id) + '">' +
      ui.photo({ src: product.image, alt: product.name, icon: product.icon, color: accent, cls: 'device-tile__photo' }) +
      '<div class="device-tile__text"><div class="device-tile__name">' + KK.esc(product.name) + '</div>' +
      '<div class="t-16 tone-secondary">' + KK.esc(product.status || '') + '</div></div>' +
      '</a>'
    );
  };

  /**
   * Feature callout on a photo: a dot at x / y (percent) joined by a short line to a label.
   * It is a toggle (aria-pressed). The label sits on whichever side has more room.
   * opts: id, label, icon, on, x, y, tint.
   */
  ui.callout = function (opts) {
    return (
      '<button type="button" class="callout' + (opts.x > 50 ? ' callout--left' : '') + '" data-callout="' + KK.esc(opts.id) + '"' +
      ' aria-pressed="' + (opts.on ? 'true' : 'false') + '" style="left:' + opts.x + '%;top:' + opts.y + '%;--tint:' + (opts.tint || KK.c('primary')) + '">' +
      '<span class="callout__dot"></span><span class="callout__line"></span>' +
      '<span class="callout__label">' + (opts.icon ? KK.icon(opts.icon, 14) : '') + '<span>' + KK.esc(opts.label) + '</span></span>' +
      '</button>'
    );
  };

  /** Uppercase section label. */
  ui.sectionLabel = function (text) {
    return '<h2 class="section-label t-13 tone-secondary">' + KK.esc(text) + '</h2>';
  };
})();
