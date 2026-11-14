/*
 * Devices tab: /devices. A room switcher at the top, then that room's devices as tiles.
 * /devices/room/:id opens the page on a given room. Older /home paths redirect here.
 */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  function findRoom(id) {
    return KK.data.rooms.filter(function (r) { return r.id === id; })[0];
  }

  function ringStat(label, icon, progress, color) {
    return (
      '<div class="ring-stat">' +
        ui.ring({ size: 44, stroke: 4, progress: progress, color: color, innerHtml: KK.icon(icon, 18, color) }) +
        '<span class="t-13 tone-secondary">' + KK.esc(label) + '</span>' +
      '</div>'
    );
  }

  /** Everything below the switcher: summary strip and device tiles for one room. */
  function roomHtml(room) {
    var accent = KK.c(room.accent);
    var ids = KK.data.roomProducts[room.id] || [];
    var tiles = ids
      .map(function (pid, i) {
        var p = KK.data.products[pid];
        return p ? '<div class="enter-up" style="--d:' + (40 + i * 60) + 'ms">' + ui.deviceTile(p) + '</div>' : '';
      })
      .join('');
    return (
      '<div class="card room-summary enter-up">' +
        '<div class="dial" style="background:' + accent + '"><span class="dial__value">' + room.value + '</span><span class="dial__unit">' + KK.esc(room.unit) + '</span></div>' +
        '<div class="room-summary__text"><div class="t-20">' + KK.esc(room.headline) + '</div>' +
        '<div class="t-16 tone-secondary">' + ids.length + ' device' + (ids.length === 1 ? '' : 's') + '</div></div>' +
        ringStat(room.energyLabel, 'bolt', room.energy, KK.c('energy')) +
        ringStat(room.status, room.statusIcon, 1, KK.c('text')) +
      '</div>' +
      '<div class="devices__grid">' + tiles + '</div>'
    );
  }

  function render(ctx, initialRoom) {
    var state = ctx.state;
    if (!state.room) state.room = initialRoom || KK.data.rooms[0].id;
    var room = findRoom(state.room);
    return (
      '<section class="screen devices">' +
        '<header class="page-header">' +
          '<div><div class="t-13 tone-secondary">YOUR HOME</div><h1 class="t-31">Devices</h1></div>' +
          '<a class="icon-btn gear" href="#/account" aria-label="Account">' + KK.icon('cog-6-tooth', 22, KK.c('text-secondary')) + '</a>' +
        '</header>' +
        '<div id="room-switch">' +
          ui.segment({
            name: 'room',
            nav: true,
            label: 'Room',
            active: room.id,
            tint: KK.c(room.accent),
            items: KK.data.rooms.map(function (r) { return { id: r.id, label: r.name }; }),
          }) +
        '</div>' +
        '<div id="room-body" class="devices__body">' + roomHtml(room) + '</div>' +
        '<p class="devices__hint t-16 tone-muted">Tap a device to open its controls and routines.</p>' +
        '<button type="button" class="fab" id="device-add" aria-label="Add a device">' + KK.icon('plus', 26) + '</button>' +
      '</section>'
    );
  }

  function mount(root, ctx) {
    var body = root.querySelector('#room-body');
    var nav = root.querySelector('.segment');

    root.querySelector('#room-switch').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-seg="room"]');
      if (!btn) return;
      var room = findRoom(btn.getAttribute('data-value'));
      if (!room || room.id === ctx.state.room) return;
      ctx.state.room = room.id;
      ui.setSegment(root, 'room', room.id);
      nav.style.setProperty('--tint', KK.c(room.accent));
      body.innerHTML = roomHtml(room);
    });

    // Placeholder action in the prototype: feedback only.
    root.querySelector('#device-add').addEventListener('click', function () {
      KK.haptic('light');
    });
  }

  KK.route('/devices', {
    tab: 'devices',
    render: function (ctx) {
      return render(ctx);
    },
    mount: mount,
  });

  KK.route('/devices/room/:id', {
    tab: 'devices',
    render: function (ctx) {
      if (!findRoom(ctx.params.id)) return { redirect: '/devices' };
      return render(ctx, ctx.params.id);
    },
    mount: mount,
  });

  // Paths from before the Home tab became Devices.
  KK.route('/home', { render: function () { return { redirect: '/devices' }; } });
  KK.route('/home/room/:id', { render: function (ctx) { return { redirect: '/devices/room/' + ctx.params.id }; } });
  KK.route('/home/product/:id', { render: function (ctx) { return { redirect: '/devices/product/' + ctx.params.id }; } });
  KK.route('/home/routines/:id', { render: function (ctx) { return { redirect: '/devices/routines/' + ctx.params.id }; } });
})();
