/* Onboarding flow: /onboarding → /account → /connect → /other → /devices */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  function screen(inner, cls) {
    return '<section class="screen screen--slide screen--inset-bottom ' + (cls || '') + '" style="--pad:28px">' + inner + '</section>';
  }

  // The app opens on onboarding.
  KK.route('/', {
    render: function () {
      return { redirect: '/onboarding' };
    },
  });

  // 1 of 4: Let's Konnect
  KK.route('/onboarding', {
    render: function () {
      return screen(
        '<div class="onb">' +
          '<div class="enter-down">' + ui.stepBar({ step: 1, total: 4 }) + '</div>' +
          '<div class="onb__hero enter-up" style="--d:90ms">' +
            ui.heroMark({ icon: 'sparkles' }) +
            '<h1 class="t-31 center" style="margin-top:24px">Let’s Konnect</h1>' +
            '<p class="t-16 tone-secondary center" style="margin-top:10px">One home for your Kohler bathroom — control, comfort, and the health signal it senses, all in your pocket.</p>' +
          '</div>' +
          '<div class="enter-up" style="--d:180ms">' + ui.button({ label: 'Continue', block: true, href: '/onboarding/account' }) + '</div>' +
        '</div>'
      );
    },
  });

  // 2 of 4: Create your account
  KK.route('/onboarding/account', {
    render: function () {
      var next = '/onboarding/connect';
      return screen(
        '<div class="onb">' +
          ui.stepBar({ step: 2, total: 4, back: '/onboarding' }) +
          '<div class="onb__hero enter-up">' +
            ui.heroMark({ icon: 'person-circle', size: 96 }) +
            '<h1 class="t-31" style="margin-top:16px">Create your account</h1>' +
            '<p class="t-16 tone-secondary" style="margin-top:10px">Sign in with Apple or Google, or continue as a guest to explore the prototype.</p>' +
          '</div>' +
          '<div class="enter-up" style="--d:90ms"><div class="onb__actions">' +
            ui.button({ label: 'Continue with Apple', icon: 'logo-apple', variant: 'secondary', block: true, href: next }) +
            ui.button({ label: 'Continue with Google', icon: 'logo-google', variant: 'secondary', block: true, href: next }) +
            ui.button({ label: 'Continue as guest', variant: 'ghost', block: true, href: next }) +
          '</div></div>' +
          '<p class="onb__footnote t-13 tone-muted">Prototype only — no real account or data is created.</p>' +
        '</div>'
      );
    },
  });

  // 3 of 4: Connect your Kohler devices
  KK.route('/onboarding/connect', {
    render: function () {
      var primary = KK.c('primary');
      var devices = KK.data.onboardingDevices
        .map(function (d, i) {
          var on = d.state === 'connected';
          var color = KK.c(on ? 'success' : 'energy');
          return (
            '<div class="enter-up" style="--d:' + i * 60 + 'ms"><div class="card device">' +
              ui.photo({ src: (KK.data.products[d.product] || {}).image, icon: d.icon, color: primary, cls: 'photo--thumb', iconSize: 22 }) +
              '<div class="device__text"><div class="t-20">' + KK.esc(d.name) + '</div>' +
              '<div class="t-16 tone-secondary">' + KK.esc(d.room) + '</div></div>' +
              '<span class="pill t-13" style="color:' + color + ';border-color:' + color + ';background:' + KK.alpha(color, '1F') + '">' +
              '<span class="pill__dot"></span>' + (on ? 'Connected' : 'Updating…') + '</span>' +
            '</div></div>'
          );
        })
        .join('');
      return screen(
        ui.stepBar({ step: 3, total: 4, back: '/onboarding/account' }) +
        '<h1 class="t-31 connect__title">Connect your Kohler devices</h1>' +
        '<p class="t-16 tone-secondary connect__copy">We found these near your network. Everything is shown as ready for this prototype.</p>' +
        '<div class="connect__list">' + devices + '</div>' +
        '<div class="onb__actions" style="gap:12px">' +
          ui.button({ label: 'Scan for more', icon: 'scan-outline', variant: 'secondary', block: true }) +
          ui.button({ label: 'Continue', block: true, href: '/onboarding/other' }) +
        '</div>'
      );
    },
  });

  // 4 of 4: Connect other devices?
  KK.route('/onboarding/other', {
    render: function () {
      return screen(
        '<div class="onb">' +
          ui.stepBar({ step: 4, total: 4, back: '/onboarding/connect' }) +
          '<div class="onb__hero enter-up">' +
            ui.heroMark({ icon: 'watch-outline', size: 116 }) +
            '<h1 class="t-31 center" style="margin-top:20px">Connect other devices?</h1>' +
            '<p class="t-16 tone-secondary center" style="margin-top:10px">Add an Apple Watch or another health device to enrich your Health insights. You can always do this later from Account.</p>' +
          '</div>' +
          '<div class="enter-up" style="--d:90ms"><div class="onb__actions">' +
            // Both finish onboarding; "replace" so Back from Devices does not return here.
            ui.button({ label: 'Yes, connect later', block: true, href: '/devices', replace: true }) +
            ui.button({ label: 'Skip for now', variant: 'secondary', block: true, href: '/devices', replace: true }) +
          '</div></div>' +
        '</div>'
      );
    },
  });
})();
