/* Account tab: /account. Also the hidden component gallery: /gallery */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  /** A value with an ellipsis means "in progress" (amber dot); anything else is a healthy state (green dot). */
  function toneOf(text) {
    return text.indexOf('…') >= 0 ? 'warning' : 'success';
  }

  function section(s, i) {
    var hasProducts = s.items.some(function (item) { return item.product; });
    var body;
    if (hasProducts) {
      // Kohler products are shown as device cards that open the device.
      body =
        '<div class="stack">' +
        s.items
          .map(function (item) {
            var product = KK.data.products[item.product];
            var status = item.badge ? item.value + ' · ' + item.badge : item.value;
            return ui.deviceCard(product, { status: status, tone: toneOf(item.value), href: '/devices/product/' + product.id });
          })
          .join('') +
        '</div>';
    } else {
      body =
        '<div class="card">' +
        s.items
          .map(function (item) {
            return (
              '<div class="list-row">' +
                '<span class="t-16 tone-secondary list-row__label">' + KK.esc(item.label) + '</span>' +
                '<span class="list-row__value">' + (item.badge ? ui.status({ label: item.badge, tone: toneOf(item.badge) }) : '') +
                '<span class="t-16">' + KK.esc(item.value) + '</span></span>' +
              '</div>'
            );
          })
          .join('') +
        '</div>';
    }
    return '<div class="enter-up" style="--d:' + (i + 1) + '">' + ui.sectionLabel(s.title) + body + '</div>';
  }

  KK.route('/account', {
    tab: 'account',
    render: function () {
      return (
        '<section class="screen account">' +
          ui.pageHeader({ eyebrow: 'Your profile', title: 'Account' }) +
          '<div class="enter-up"><div class="card profile">' +
            '<div class="avatar t-20">AK</div>' +
            '<div class="profile__text"><div class="t-20">Arnav</div><div class="t-16 tone-secondary">Personal account · Kohler Konnect</div></div>' +
            '<span class="tone-muted">' + KK.icon('chevron-right', 20) + '</span>' +
          '</div></div>' +
          KK.data.accountSections.map(section).join('') +
          '<div class="account__foot">' +
            ui.button({ label: 'Start over', icon: 'arrow-path', variant: 'secondary', href: '/onboarding', replace: true }) +
            ui.button({ label: 'Component gallery', icon: 'squares-2x2', variant: 'secondary', href: '/gallery' }) +
          '</div>' +
        '</section>'
      );
    },
  });

  // ── Component gallery: the design system on one page ──
  function block(title, inner) {
    return ui.sectionLabel(title) + inner;
  }

  var RAMP = ['100', '90', '80', '70', '60', '50', '40', '30', '20', '10'];

  function ramp(name) {
    return (
      '<div class="gallery__ramp">' +
      RAMP.map(function (step) { return '<span style="--swatch:var(--' + name + '-' + step + ')"></span>'; }).join('') +
      '</div>'
    );
  }

  var TYPE = [
    ['t-61', '61 Bold'],
    ['t-49', '49 Bold'],
    ['t-39', '39 Bold'],
    ['t-31', '31 SemiBold'],
    ['t-25', '25 SemiBold'],
    ['t-20', '20 Medium'],
    ['t-16', '16 Medium'],
    ['t-13', '13 Regular, uppercase'],
  ];

  var GALLERY_STEPS = [34, 36, 38, 40, 42, 44];
  var WEEK = [
    { label: 'M', value: 60 },
    { label: 'T', value: 45 },
    { label: 'W', value: 72 },
    { label: 'T', value: 55 },
    { label: 'F', value: 80 },
    { label: 'S', value: 38 },
    { label: 'S', value: 66 },
  ];

  function buttons() {
    return (
      ui.button({ label: 'Primary', block: true }) +
      ui.button({ label: 'Secondary', variant: 'secondary', block: true }) +
      ui.button({ label: 'Ghost', variant: 'ghost', block: true }) +
      '<div class="action-pair">' +
        ui.button({ label: 'With icon', icon: 'plus' }) +
        ui.button({ label: 'Disabled', disabled: true }) +
      '</div>'
    );
  }

  KK.route('/gallery', {
    render: function () {
      return (
        '<section class="screen screen--inset-bottom gallery">' +
          ui.topBar({ back: '/account', title: 'Component gallery' }) +
          block('Colour',
            '<div class="stack">' +
              '<div class="t-16 tone-secondary">Kohler Blue, 100 to 10</div>' + ramp('blue') +
              '<div class="t-16 tone-secondary">Greyscale, 100 to 10</div>' + ramp('grey') +
            '</div>') +
          block('Type',
            '<div class="stack">' +
              TYPE.map(function (t) { return '<div class="' + t[0] + '">' + t[1] + '</div>'; }).join('') +
            '</div>') +
          block('Headers and onboarding pieces',
            '<div class="stack">' +
              ui.pageHeader({ eyebrow: 'Eyebrow', title: 'Page title', trailingHtml: ui.iconButton({ icon: 'cog-6-tooth', label: 'Action (demo)' }) }) +
              ui.stepBar({ step: 2, total: 4 }) +
              '<div class="row gallery__centre">' + ui.heroMark({ icon: 'sparkles' }) + '</div>' +
            '</div>') +
          block('Buttons on the page',
            '<div class="stack">' + buttons() +
              '<div class="row gallery__wrap">' +
                ui.iconButton({ icon: 'chevron-left', label: 'Back (demo)' }) +
                ui.iconButton({ icon: 'cog-6-tooth', label: 'Settings (demo)' }) +
                ui.iconButton({ icon: 'plus', label: 'Add (demo)' }) +
                ui.iconButton({ icon: 'heart', label: 'Current of a row (demo)', attrs: { 'aria-current': 'true' } }) +
              '</div>' +
            '</div>') +
          block('Buttons on a card', '<div class="card stack">' + buttons() + '</div>') +
          block('Segmented switch',
            '<div class="stack" id="gallery-segments">' +
              ui.segment({ name: 'demo', label: 'View', active: 'a', items: [{ id: 'a', label: 'Today' }, { id: 'b', label: 'Over time' }] }) +
              ui.segment({
                name: 'demo-icons',
                label: 'Area',
                active: 'a',
                items: [{ id: 'a', label: 'Wellness', icon: 'heart' }, { id: 'b', label: 'Hydration', icon: 'beaker' }, { id: 'c', label: 'Stress', icon: 'bolt' }],
              }) +
            '</div>') +
          block('Chips and status',
            '<div class="card stack">' +
              '<div class="row gallery__wrap" id="gallery-chips">' +
                ui.chip({ label: 'On', on: true }) +
                ui.chip({ label: 'Off' }) +
                ui.chip({ label: 'With icon', icon: 'fire', on: true }) +
              '</div>' +
              '<div class="row gallery__wrap">' +
                ui.status({ label: 'Connected' }) +
                ui.status({ label: 'Updating…', tone: 'warning' }) +
                ui.status({ label: 'Offline', tone: 'danger' }) +
                ui.status({ label: 'Idle', tone: 'idle' }) +
              '</div>' +
            '</div>') +
          block('Rings',
            '<div class="card row gallery__rings">' +
              ui.statRing({ label: '85%', icon: 'bolt', progress: 0.85 }) +
              ui.statRing({ label: 'Done', icon: 'check', progress: 1, tone: 'success' }) +
              ui.statRing({ label: 'Busy', icon: 'arrow-path', progress: 0.5, tone: 'warning' }) +
              ui.statRing({ label: 'Low', icon: 'exclamation-triangle', progress: 0.25, tone: 'danger' }) +
            '</div>') +
          block('Stepper (drag)',
            '<div class="card">' + KK.tempControl.html({ steps: GALLERY_STEPS, value: 40, label: 'Temperature' }) + '</div>') +
          block('Bar chart', '<div class="card">' + ui.barChart({ data: WEEK, height: 120, activeIndex: 4 }) + '</div>') +
          block('Field and list rows',
            '<div class="card stack">' +
              '<input class="field" type="text" aria-label="Demo field" placeholder="Name your routine">' +
              '<div>' +
                '<div class="list-row"><span class="t-16 tone-secondary list-row__label">Sensing</span><span class="t-16">On</span></div>' +
                '<div class="list-row"><span class="t-16 tone-secondary list-row__label">Cameras</span><span class="t-16">None</span></div>' +
              '</div>' +
            '</div>') +
          block('Device card',
            '<div class="stack">' +
              ui.deviceCard(KK.data.products.shower) +
              ui.deviceCard(KK.data.products.toilet, { status: 'Bathroom · Updating…', tone: 'warning' }) +
            '</div>') +
          block('Photo with callouts (one selected)',
            '<div class="callout-stage on-light">' +
              ui.photo({ icon: 'beaker', iconSize: 100 }) +
              '<div class="callout-stage__layer" id="gallery-callouts">' +
                ui.callout({ id: 'a', label: 'Selected', icon: 'beaker', on: true, x: 22, y: 30 }) +
                ui.callout({ id: 'b', label: 'Other', icon: 'fire', on: false, x: 78, y: 72 }) +
              '</div>' +
            '</div>') +
          block('Health visuals (low · mid · high)',
            '<div class="gallery__visuals">' +
              KK.data.health.map(function (a) {
                return [0.15, 0.5, 0.9].map(function (level) {
                  return '<div class="stage gallery__visual">' + KK.visual(a.visual, level) +
                    '<span class="t-13 tone-muted">' + a.visual + ' ' + level + '</span></div>';
                }).join('');
              }).join('') +
            '</div>') +
        '</section>'
      );
    },
    mount: function (root) {
      KK.tempControl.mount(root.querySelector('.tempctl'), { steps: GALLERY_STEPS, value: 40 });
      // Segments, callouts and chips respond, so their states can be compared.
      root.querySelector('#gallery-segments').addEventListener('click', function (e) {
        var btn = e.target.closest('[data-seg]');
        if (btn) ui.setSegment(root, btn.getAttribute('data-seg'), btn.getAttribute('data-value'));
      });
      root.querySelector('#gallery-callouts').addEventListener('click', function (e) {
        var callout = e.target.closest('.callout');
        if (!callout) return;
        Array.prototype.forEach.call(root.querySelectorAll('#gallery-callouts .callout'), function (c) {
          c.setAttribute('aria-pressed', c === callout ? 'true' : 'false');
        });
      });
      root.querySelector('#gallery-chips').addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (chip) chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      });
    },
  });
})();
