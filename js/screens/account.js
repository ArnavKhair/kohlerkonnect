/* Account tab: /account. Also the hidden component gallery: /gallery */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  function badge(label, color) {
    return '<span class="badge t-13" style="color:' + color + ';background:' + KK.alpha(color, '1F') + ';border-color:' + KK.alpha(color, '44') + '">' + KK.esc(label) + '</span>';
  }

  function section(s, i) {
    var items = s.items
      .map(function (item) {
        // A badge with an ellipsis means "in progress" (amber); any other badge is a healthy state (green).
        var tone = item.badge && item.badge.indexOf('…') >= 0 ? 'energy' : 'success';
        var product = item.product ? KK.data.products[item.product] : null;
        var thumb = product
          ? ui.photo({ src: product.image, icon: product.icon, color: KK.c(product.accent), cls: 'photo--thumb', iconSize: 18 })
          : '';
        return (
          '<div class="row account-item"' + (product ? ' style="--size:36px;--radius:10px"' : '') + '>' + thumb +
            '<span class="t-16 tone-secondary account-item__label">' + KK.esc(item.label) + '</span>' +
            '<span class="account-item__right">' + (item.badge ? badge(item.badge, KK.c(tone)) : '') +
            '<span class="t-16' + (item.badge ? ' tone-secondary' : '') + '">' + KK.esc(item.value) + '</span></span>' +
          '</div>'
        );
      })
      .join('');
    return (
      '<div class="enter-up" style="--d:' + (40 + i * 60) + 'ms"><div class="card account-section">' +
        '<div class="row account-section__header">' + ui.tile({ icon: s.icon, color: KK.c('primary'), size: 38, iconSize: 20, alpha: '1A' }) +
        '<h2 class="t-20" style="margin:0">' + KK.esc(s.title) + '</h2></div>' + items +
      '</div></div>'
    );
  }

  KK.route('/account', {
    tab: 'account',
    render: function () {
      return (
        '<section class="screen account">' +
          ui.topBar({ title: 'Account' }) +
          '<div class="enter-up"><div class="card profile">' +
            '<div class="avatar t-20">AK</div>' +
            '<div class="profile__text"><div class="t-20">Arnav</div><div class="t-16 tone-secondary">Personal account · Kohler Konnect</div></div>' +
            KK.icon('chevron-forward', 20, KK.c('text-muted')) +
          '</div></div>' +
          '<div class="account__list">' + KK.data.accountSections.map(section).join('') + '</div>' +
          '<div class="account__foot">' +
            '<a class="foot-btn" href="#/onboarding" data-replace>' + KK.icon('refresh', 18) + 'Start over</a>' +
            '<a class="foot-btn" href="#/gallery">' + KK.icon('apps-outline', 18) + 'Component gallery</a>' +
          '</div>' +
        '</section>'
      );
    },
  });

  // ── Component gallery: every shared component on one page ──
  function block(title, inner) {
    return ui.sectionLabel(title) + '<div class="gallery__block">' + inner + '</div>';
  }

  function galleryRing(progress, token, icon, label) {
    var color = KK.c(token);
    return '<div class="gallery__ring">' + ui.ring({ size: 64, stroke: 6, progress: progress, color: color, innerHtml: KK.icon(icon, 22, color) }) +
      '<span class="t-16 tone-secondary">' + label + '</span></div>';
  }

  var GALLERY_STEPS = [34, 36, 38, 40, 42, 44];

  KK.route('/gallery', {
    render: function () {
      var primary = KK.c('primary');
      return (
        '<section class="screen screen--inset-bottom gallery">' +
          ui.topBar({ back: '/account', title: 'Component gallery' }) +
          block('Type',
            '<div class="t-61" style="margin-bottom:4px">Display</div>' +
            '<div class="t-31">Title — a heading</div>' +
            '<div class="t-20">Subheading</div>' +
            '<div class="t-16 tone-secondary">Body text in the secondary tone.</div>' +
            '<div class="t-16 tone-muted">Caption / muted text.</div>') +
          block('Buttons',
            '<div class="gallery__stack">' +
              ui.button({ label: 'Primary', block: true, attrs: { 'data-back': '/account' } }) +
              ui.button({ label: 'Secondary', variant: 'secondary', block: true }) +
              ui.button({ label: 'Ghost', variant: 'ghost', block: true }) +
              '<div class="action-pair">' +
                ui.button({ label: 'With icon', icon: 'add', tint: KK.c('success') }) +
                ui.button({ label: 'Disabled', variant: 'secondary', disabled: true }) +
              '</div>' +
            '</div>') +
          block('Chips',
            '<div class="row gallery__chips">' +
              ui.chip({ label: 'On', on: true, tint: primary }) +
              ui.chip({ label: 'Off' }) +
              ui.chip({ label: 'Success', icon: 'checkmark', on: true, tint: KK.c('success') }) +
            '</div>') +
          block('Rings',
            '<div class="row gallery__rings">' +
              galleryRing(0.85, 'energy', 'flash', '85%') +
              galleryRing(0.5, 'primary', 'water', '50%') +
              galleryRing(1, 'success', 'checkmark', '100%') +
              galleryRing(0.25, 'danger', 'warning', '25%') +
            '</div>') +
          block('Temperature control (drag)',
            '<div class="card">' + KK.tempControl.html({ steps: GALLERY_STEPS, value: 40, accent: primary, label: 'Temperature' }) + '</div>') +
          block('Bar chart',
            '<div class="card gallery__pad">' +
              ui.barChart({
                data: [
                  { label: 'M', value: 60 },
                  { label: 'T', value: 45 },
                  { label: 'W', value: 72 },
                  { label: 'T', value: 55 },
                  { label: 'F', value: 80 },
                  { label: 'S', value: 38 },
                  { label: 'S', value: 66 },
                ],
                height: 120,
                color: KK.c('success'),
                activeIndex: 4,
              }) +
            '</div>') +
          block('Segmented switch',
            '<div class="gallery__stack" id="gallery-segments">' +
              ui.segment({ name: 'demo-nav', nav: true, label: 'Room', active: 'a', tint: KK.c('room-bathroom'), items: [{ id: 'a', label: 'Bathroom' }, { id: 'b', label: 'Kitchen' }] }) +
              ui.segment({ name: 'demo', label: 'View', active: 'a', items: [{ id: 'a', label: 'Today' }, { id: 'b', label: 'Over time' }] }) +
            '</div>') +
          block('Device tile + feature callouts',
            '<div class="gallery__pair">' +
              ui.deviceTile(KK.data.products.shower) +
              '<div class="gallery__stage">' +
                ui.photo({ icon: 'water-outline', color: KK.c('room-bathroom'), cls: 'gallery__photo' }) +
                '<div class="product__callouts" id="gallery-callouts">' +
                  ui.callout({ id: 'on', label: 'On', icon: 'water-outline', on: true, x: 22, y: 30, tint: KK.c('room-bathroom') }) +
                  ui.callout({ id: 'off', label: 'Off', on: false, x: 78, y: 72, tint: KK.c('room-bathroom') }) +
                '</div>' +
              '</div>' +
            '</div>') +
          block('Health visuals (low · mid · high)',
            '<div class="gallery__visuals">' +
              KK.data.health.map(function (a) {
                return [0.15, 0.5, 0.9].map(function (level) {
                  return '<div class="gallery__visual" style="--tint:' + KK.c(a.color) + '">' + KK.visual(a.visual, level) +
                    '<span class="t-13 tone-muted">' + a.visual + ' ' + level + '</span></div>';
                }).join('');
              }).join('') +
            '</div>') +
          block('Card + badge',
            '<div class="card gallery__pad"><div class="row gallery__demo-row">' +
              ui.tile({ icon: 'home', color: primary, size: 40, iconSize: 20 }) +
              '<span class="t-20">Sample card</span>' +
              '<span class="t-13" style="color:' + KK.c('success') + '">Active</span>' +
            '</div></div>') +
        '</section>'
      );
    },
    mount: function (root) {
      KK.tempControl.mount(root.querySelector('.tempctl'), { steps: GALLERY_STEPS, value: 40 });
      // Segments and callouts respond, so their states can be compared.
      root.querySelector('#gallery-segments').addEventListener('click', function (e) {
        var btn = e.target.closest('[data-seg]');
        if (btn) ui.setSegment(root, btn.getAttribute('data-seg'), btn.getAttribute('data-value'));
      });
      root.querySelector('#gallery-callouts').addEventListener('click', function (e) {
        var callout = e.target.closest('.callout');
        if (callout) callout.setAttribute('aria-pressed', callout.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      });
      // Chips in the gallery toggle so their two states can be compared.
      root.querySelector('.gallery__chips').addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (chip) chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      });
    },
  });
})();
