/*
 * Living visuals for the Health page. Each one is an inline SVG whose shape and motion
 * come from a single number, `level` (0..1, where 1 is the healthy end):
 *
 *   flower   bud at 0, full bloom at 1                      (wellness / recovery)
 *   horse    stiff, halting walk at 0; smooth stride at 1   (mobility)
 *   ripples  large, uneven rings at 0; small, even at 1     (gut health)
 *   vessel   empty at 0, full at 1                          (hydration)
 *   flame    small and flickering at 0; tall, steady at 1   (stress: pass the calm level)
 *
 *   KK.visual('flower', 0.78) -> '<div class="visual visual--flower">...</div>'
 *
 * Shapes are computed here; looping motion is CSS (css/visuals.css) fed by custom properties.
 * The container sets the size; each kind's colour comes from its --c-visual-* token
 * (css/visuals.css), drawn for a navy .stage.
 */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});

  var uid = 0;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function n(v) {
    return Math.round(v * 100) / 100;
  }

  function svg(inner) {
    return '<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  // ── Flower ──────────────────────────────────────────────────────────
  function petalPath(cx, cy, len, wid) {
    return (
      'M' + cx + ' ' + cy +
      ' C' + n(cx - wid) + ' ' + n(cy - len * 0.3) + ' ' + n(cx - wid) + ' ' + n(cy - len * 0.8) + ' ' + cx + ' ' + n(cy - len) +
      ' C' + n(cx + wid) + ' ' + n(cy - len * 0.8) + ' ' + n(cx + wid) + ' ' + n(cy - len * 0.3) + ' ' + cx + ' ' + cy + ' Z'
    );
  }

  function petalFan(count, spread, len, wid, cls, cx, cy) {
    var petals = [];
    for (var i = 0; i < count; i++) {
      petals.push({ a: (i / (count - 1) - 0.5) * spread, i: i });
    }
    // Outermost first, so the middle petals sit on top (reads as a closed bud when the fan is tight).
    petals.sort(function (p, q) {
      return Math.abs(q.a) - Math.abs(p.a);
    });
    return petals
      .map(function (p) {
        return (
          '<g transform="rotate(' + n(p.a) + ' ' + cx + ' ' + cy + ')">' +
          '<path class="' + cls + '" style="--i:' + p.i + '" d="' + petalPath(cx, cy, len, wid) + '"/></g>'
        );
      })
      .join('');
  }

  function flower(l) {
    var cx = 100;
    var cy = 96;
    var leaf = lerp(0.6, 1, l);
    return svg(
      '<g class="flower__sway">' +
        '<path class="flower__stem" d="M100 190 C95 164 105 132 100 ' + cy + '"/>' +
        '<g transform="translate(99 158) scale(' + n(leaf) + ')"><path class="flower__leaf" d="M0 0 C-14 -4 -28 -16 -32 -30 C-16 -28 -4 -16 0 0 Z"/></g>' +
        '<g transform="translate(101 172) scale(' + n(leaf) + ')"><path class="flower__leaf" d="M0 0 C14 -4 26 -14 30 -26 C16 -25 4 -14 0 0 Z"/></g>' +
        '<g class="flower__head">' +
          petalFan(9, lerp(34, 328, l), lerp(44, 58, l), lerp(10, 17, l), 'flower__petal', cx, cy) +
          petalFan(6, lerp(20, 250, l), lerp(34, 38, l), lerp(8, 12, l), 'flower__petal flower__petal--inner', cx, cy) +
          '<circle class="flower__eye" cx="' + cx + '" cy="' + cy + '" r="' + n(lerp(0, 10, l)) + '"/>' +
          // Sepals hug the bud and fall away as it opens.
          '<g opacity="' + n(Math.max(0, 1 - l * 2.4)) + '">' +
            '<path class="flower__leaf" d="M100 ' + (cy + 4) + ' C92 ' + (cy - 6) + ' 91 ' + (cy - 20) + ' 95 ' + (cy - 30) + ' C99 ' + (cy - 18) + ' 101 ' + (cy - 8) + ' 100 ' + (cy + 4) + ' Z"/>' +
            '<path class="flower__leaf" d="M100 ' + (cy + 4) + ' C108 ' + (cy - 6) + ' 109 ' + (cy - 20) + ' 105 ' + (cy - 30) + ' C101 ' + (cy - 18) + ' 99 ' + (cy - 8) + ' 100 ' + (cy + 4) + ' Z"/>' +
          '</g>' +
        '</g>' +
      '</g>'
    );
  }

  // ── Vessel ──────────────────────────────────────────────────────────
  function wavePath(y, amp) {
    // A sine-like strip 600 wide with a 100px period, so shifting it by 100px loops seamlessly.
    var d = 'M-200 ' + n(y) + ' Q-175 ' + n(y - amp) + ' -150 ' + n(y);
    for (var x = -100; x <= 400; x += 50) d += ' T' + x + ' ' + n(y);
    return d + ' L400 200 L-200 200 Z';
  }

  function vessel(l) {
    var id = 'kk-vessel-' + ++uid;
    var glass = 'M60 34 L140 34 C140 34 150 148 130 168 C122 176 78 176 70 168 C50 148 60 34 60 34 Z';
    var top = lerp(164, 50, l);
    var amp = lerp(1.5, 5, l);
    var bubbles = '';
    if (l > 0.15) {
      [[84, 0], [104, 1], [120, 2]].forEach(function (b) {
        bubbles += '<circle class="vessel__bubble" style="--i:' + b[1] + ';--rise:' + n(-(164 - top) * 0.8) + 'px" cx="' + b[0] + '" cy="160" r="' + (2 + b[1] * 0.6) + '"/>';
      });
    }
    return svg(
      '<defs><clipPath id="' + id + '"><path d="' + glass + '"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')">' +
        '<path class="vessel__water vessel__water--back" d="' + wavePath(top - 2, amp) + '"/>' +
        '<path class="vessel__water" d="' + wavePath(top, amp) + '"/>' +
        bubbles +
      '</g>' +
      '<path class="vessel__glass" d="' + glass + '"/>' +
      '<path class="vessel__shine" d="M72 48 C70 84 70 118 76 146"/>'
    );
  }

  // ── Flame ───────────────────────────────────────────────────────────
  function flamePath(h, w) {
    return (
      'M0 0 C' + n(-w) + ' ' + n(-h * 0.28) + ' ' + n(-w * 0.85) + ' ' + n(-h * 0.62) + ' 0 ' + n(-h) +
      ' C' + n(w * 0.85) + ' ' + n(-h * 0.62) + ' ' + n(w) + ' ' + n(-h * 0.28) + ' 0 0 Z'
    );
  }

  function flame(calm) {
    var id = 'kk-glow-' + ++uid;
    var h = lerp(30, 66, calm);
    var w = lerp(12, 18, calm);
    var style = '--flick:' + n(lerp(1, 0.12, calm)) + ';--dur:' + n(lerp(0.26, 2.4, calm)) + 's';
    return svg(
      '<defs><radialGradient id="' + id + '"><stop offset="0" stop-color="currentColor" stop-opacity="' + n(lerp(0.3, 0.55, calm)) + '"/>' +
      '<stop offset="1" stop-color="currentColor" stop-opacity="0"/></radialGradient></defs>' +
      '<circle class="flame__glow" cx="100" cy="' + n(118 - h * 0.5) + '" r="' + n(lerp(40, 78, calm)) + '" fill="url(#' + id + ')"/>' +
      '<rect class="flame__wax" x="80" y="126" width="40" height="60" rx="7"/>' +
      '<ellipse class="flame__pool" cx="100" cy="127" rx="20" ry="4"/>' +
      '<path class="flame__wick" d="M100 127 L100 116"/>' +
      '<g transform="translate(100 119)"><g class="flame__body" style="' + style + '">' +
        '<path class="flame__outer" d="' + flamePath(h, w) + '"/>' +
        '<path class="flame__core" d="' + flamePath(h * 0.52, w * 0.5) + '"/>' +
      '</g></g>'
    );
  }

  // ── Ripples ─────────────────────────────────────────────────────────
  function ripples(l) {
    var u = 1 - l; // unevenness
    var rings = 4;
    var cy = 112;
    var jitterSize = [0.1, -0.28, 0.34, -0.12];
    var jitterX = [-16, 12, -5, 18];
    var jitterY = [3, -5, 6, -2];
    var jitterDur = [0, 0.4, -0.3, 0.55];
    var jitterDelay = [0, 0.45, -0.35, 0.25];
    var maxScale = lerp(1, 0.4, l);
    var baseDur = lerp(2.4, 4.4, l);
    var out = '<ellipse class="ripples__pool" cx="100" cy="' + cy + '" rx="88" ry="38"/>';
    for (var i = 0; i < rings; i++) {
      var s = maxScale * (1 + u * jitterSize[i]);
      var dur = baseDur * (1 + u * jitterDur[i]);
      var delay = -(i / rings) * dur * (1 + u * jitterDelay[i]);
      var x = 100 + u * jitterX[i];
      var y = cy + u * jitterY[i];
      out +=
        '<ellipse class="ripples__ring" cx="' + n(x) + '" cy="' + n(y) + '" rx="84" ry="35"' +
        ' style="--s:' + n(s) + ';--rest:' + n((s * (i + 1)) / rings) + ';--dur:' + n(dur) + 's;--delay:' + n(delay) + 's;' +
        'transform-origin:' + n(x) + 'px ' + n(y) + 'px;stroke-width:' + n(lerp(3.4, 1.4, l)) + '"/>';
    }
    return svg(out + '<circle class="ripples__drop" cx="100" cy="' + cy + '" r="' + n(lerp(4.5, 2.5, l)) + '"/>');
  }

  // ── Horse ───────────────────────────────────────────────────────────
  // Side view, facing right. Each leg is two segments that swing from the hip and the knee.
  function leg(x, y, phase, far, hind) {
    var upper = hind
      ? 'M-7 -4 C-9 10 -7 24 -4 34 L4 34 C7 24 9 10 7 -4 Z'
      : 'M-6 -4 C-7 10 -5 24 -4 34 L4 34 C5 24 7 10 6 -4 Z';
    return (
      '<g transform="translate(' + x + ' ' + y + ')" class="horse__leg' + (far ? ' horse__leg--far' : '') + '" style="--phase:' + phase + '">' +
        '<g class="horse__upper"><path d="' + upper + '"/>' +
          '<g transform="translate(0 32)"><g class="horse__lower">' +
            '<path d="M-3.6 -2 L-3 26 L3 26 L3.6 -2 Z"/>' +
            '<path class="horse__hoof" d="M-4.5 25 L-5.5 33 L5.5 33 L4 25 Z"/>' +
          '</g></g>' +
        '</g>' +
      '</g>'
    );
  }

  function horse(l) {
    var style =
      '--swing:' + n(lerp(7, 24, l)) + 'deg;--bend:' + n(lerp(8, 42, l)) + 'deg;--dur:' + n(lerp(2.6, 1.15, l)) + 's;' +
      '--bob:' + n(lerp(0.4, 2.2, l)) + 'px;--timing:' + (l < 0.4 ? 'steps(4, end)' : l < 0.65 ? 'steps(9, end)' : 'ease-in-out');
    return svg(
      '<g class="horse" style="' + style + '" transform="translate(-27 6)">' +
        '<path class="horse__ground" d="M32 173 L212 173"/>' +
        leg(92, 104, 0.5, true, true) +
        leg(152, 104, 0, true, false) +
        '<g class="horse__torso">' +
          '<path class="horse__tail" d="M72 80 C56 80 46 98 50 126 C56 110 62 98 78 92 Z"/>' +
          '<path d="M70 84 C68 62 94 58 120 62 C140 64 156 58 170 66 C180 76 178 100 166 108 C142 116 102 116 82 110 C70 104 68 94 70 84 Z"/>' +
          '<g class="horse__neck">' +
            '<path d="M146 74 C156 58 166 44 180 30 L200 44 C192 60 186 78 176 96 Z"/>' +
            '<path d="M178 30 C184 22 196 22 203 30 L221 52 C224 58 218 64 211 61 L190 50 Z"/>' +
            '<path d="M183 27 L184 13 L192 24 Z"/>' +
            '<path class="horse__mane" d="M180 28 C168 40 158 54 148 72"/>' +
            '<circle class="horse__eye" cx="200" cy="36" r="1.8"/>' +
          '</g>' +
        '</g>' +
        leg(84, 104, 0, false, true) +
        leg(160, 104, 0.5, false, false) +
      '</g>'
    );
  }

  var KINDS = { flower: flower, vessel: vessel, flame: flame, ripples: ripples, horse: horse };

  /** `level` is clamped to 0..1. Unknown kinds log an error and render an empty box. */
  KK.visual = function (kind, level) {
    var draw = KINDS[kind];
    var l = Math.max(0, Math.min(1, Number(level) || 0));
    if (!draw) console.error('KK.visual: unknown kind "' + kind + '"');
    return '<div class="visual visual--' + KK.esc(kind) + '">' + (draw ? draw(l) : '') + '</div>';
  };

  KK.visualKinds = Object.keys(KINDS);
})();
