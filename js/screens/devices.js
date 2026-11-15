/*
 * Devices tab: /devices. A room switcher at the top, then that room's devices as cards.
 * /devices/room/:id opens the page on a given room. Older /home paths redirect here.
 */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  function findRoom(id) {
    return KK.data.rooms.filter(function (r) { return r.id === id; })[0];
  }

  /** Everything below the switcher: summary strip and device cards for one room. */
  function roomHtml(room) {
    var ids = KK.data.roomProducts[room.id] || [];
    var cards = ids
      .map(function (pid, i) {
        var p = KK.data.products[pid];
        return p ? '<div class="enter-up" style="--d:' + (i + 1) + '">' + ui.deviceCard(p, { href: '/devices/product/' + p.id }) + '</div>' : '';
      })
      .join('');
    return (
      '<div class="card room-summary enter-up">' +
        '<div class="dial"><span class="t-25">' + room.value + '</span><span class="t-13">' + KK.esc(room.unit) + '</span></div>' +
        '<div class="room-summary__text"><div class="t-20">' + KK.esc(room.headline) + '</div>' +
        '<div class="t-16 tone-secondary">' + ids.length + ' device' + (ids.length === 1 ? '' : 's') + '</div></div>' +
        ui.statRing({ label: room.energyLabel, icon: 'bolt', progress: room.energy }) +
        ui.statRing({ label: room.status, icon: room.statusIcon, progress: 1 }) +
      '</div>' +
      '<div class="stack">' + cards + '</div>'
    );
  }

  function render(ctx, initialRoom) {
    var state = ctx.state;
    if (!state.room) state.room = initialRoom || KK.data.rooms[0].id;
    var room = findRoom(state.room);
    return (
      '<section class="screen devices">' +
        ui.pageHeader({
          eyebrow: 'Your home',
          title: 'Devices',
          trailingHtml: ui.iconButton({ icon: 'cog-6-tooth', label: 'Account', href: '/account' }),
        }) +
        '<div id="room-switch">' +
          ui.segment({
            name: 'room',
            label: 'Room',
            active: room.id,
            items: KK.data.rooms.map(function (r) { return { id: r.id, label: r.name }; }),
          }) +
        '</div>' +
        '<div id="room-body" class="stack devices__body">' + roomHtml(room) + '</div>' +
        '<p class="devices__hint t-16 tone-muted center">Tap a device to open its controls and routines.</p>' +
        ui.iconButton({ icon: 'plus', label: 'Add a device', cls: 'devices__add', attrs: { id: 'device-add' } }) +
      '</section>'
    );
  }

  function mount(root, ctx) {
    var body = root.querySelector('#room-body');

    root.querySelector('#room-switch').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-seg="room"]');
      if (!btn) return;
      var room = findRoom(btn.getAttribute('data-value'));
      if (!room || room.id === ctx.state.room) return;
      ctx.state.room = room.id;
      ui.setSegment(root, 'room', room.id);
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
