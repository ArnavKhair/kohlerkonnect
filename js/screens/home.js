/* Home tab: /home (room cards), /home/room/:id (devices in a room) */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  function ringStat(label, icon, progress, color) {
    return (
      '<div class="ring-stat">' +
        ui.ring({ size: 58, stroke: 5, progress: progress, color: color, innerHtml: KK.icon(icon, 22, color) }) +
        '<span class="t-caption tone-secondary">' + KK.esc(label) + '</span>' +
      '</div>'
    );
  }

  function roomCard(room, i) {
    var accent = KK.c(room.accent);
    return (
      '<div class="enter-up" style="--d:' + i * 70 + 'ms">' +
        '<a class="pressable" href="#/home/room/' + room.id + '">' +
          '<article class="card room-card">' +
            '<div class="row room-card__top">' +
              '<div class="row room-card__name">' + KK.icon(room.icon, 20, accent) + '<h2 class="t-subheading" style="margin:0">' + KK.esc(room.name) + '</h2></div>' +
              '<span class="t-caption tone-secondary">' + KK.esc(room.headline) + '</span>' +
            '</div>' +
            '<div class="room-card__body">' +
              '<div class="dial" style="background:' + accent + '"><span class="dial__value">' + room.value + '</span><span class="dial__unit">' + KK.esc(room.unit) + '</span></div>' +
              '<div class="row room-card__rings">' +
                ringStat(room.energyLabel, 'flash', room.energy, KK.c('energy')) +
                ringStat(room.status, room.statusIcon, 1, KK.c('text')) +
              '</div>' +
            '</div>' +
          '</article>' +
        '</a>' +
      '</div>'
    );
  }

  KK.route('/home', {
    tab: 'home',
    render: function () {
      return (
        '<section class="screen home">' +
          '<header class="page-header">' +
            '<div><div class="t-label tone-secondary">YOUR HOME</div><h1 class="t-title">Good evening</h1></div>' +
            '<a class="icon-btn gear" href="#/account" aria-label="Account">' + KK.icon('settings-outline', 22, KK.c('text-secondary')) + '</a>' +
          '</header>' +
          '<div class="home__list">' + KK.data.rooms.map(roomCard).join('') + '</div>' +
          '<button type="button" class="fab" id="home-add" aria-label="Add">' + KK.icon('add', 26) + '</button>' +
        '</section>'
      );
    },
    mount: function (root) {
      // Placeholder action in the prototype: feedback only.
      root.querySelector('#home-add').addEventListener('click', function () {
        KK.haptic('light');
      });
    },
  });

  function productRow(pid, i) {
    var p = KK.data.products[pid];
    if (!p) return '';
    var accent = KK.c(p.accent);
    return (
      '<div class="enter-up" style="--d:' + (40 + i * 60) + 'ms">' +
        '<a class="pressable" href="#/home/product/' + p.id + '">' +
          '<div class="card product-row">' +
            ui.tile({ icon: p.icon || 'home-outline', color: accent, size: 46, radius: 14 }) +
            '<div class="product-row__text"><div class="t-subheading">' + KK.esc(p.name) + '</div>' +
            '<div class="t-caption tone-secondary">' + KK.esc(p.blurb) + '</div></div>' +
            KK.icon('chevron-forward', 20, KK.c('text-muted')) +
          '</div>' +
        '</a>' +
      '</div>'
    );
  }

  KK.route('/home/room/:id', {
    tab: 'home',
    render: function (ctx) {
      var room = KK.data.rooms.filter(function (r) { return r.id === ctx.params.id; })[0];
      if (!room) return { redirect: '/home' };
      var ids = KK.data.roomProducts[room.id] || [];
      return (
        '<section class="screen room">' +
          ui.topBar({ back: '/home', title: room.name, accent: KK.c(room.accent) }) +
          ui.sectionLabel('Devices in ' + room.name) +
          '<div class="room__list">' + ids.map(productRow).join('') + '</div>' +
          '<p class="room__hint t-caption tone-muted">Tap a device to open its quick controls and routines.</p>' +
        '</section>'
      );
    },
  });
})();
