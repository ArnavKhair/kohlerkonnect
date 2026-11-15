/* Onboarding flow: /onboarding → /account → /connect → /other → /devices */
(function () {
  'use strict';
  var KK = window.KK;
  var ui = KK.ui;

  function screen(inner) {
    return '<section class="screen screen--slide screen--inset-bottom onboarding">' + inner + '</section>';
  }

  /** Centred mark, headline and one paragraph: the middle of steps 1, 2 and 4. */
  function hero(icon, title, copy) {
    return (
      '<div class="onb__hero enter-up" style="--d:1">' +
        ui.heroMark({ icon: icon }) +
        '<h1 class="t-39">' + title + '</h1>' +
        '<p class="t-16 tone-secondary">' + copy + '</p>' +
      '</div>'
    );
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
          ui.stepBar({ step: 1, total: 4 }) +
          hero('sparkles', 'Let’s Konnect', 'One home for your Kohler bathroom — control, comfort, and the health signal it senses, all in your pocket.') +
          '<div class="stack enter-up" style="--d:2">' + ui.button({ label: 'Continue', block: true, href: '/onboarding/account' }) + '</div>' +
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
          hero('user-circle', 'Create your account', 'Sign in with Apple or Google, or continue as a guest to explore the prototype.') +
          '<div class="stack enter-up" style="--d:2">' +
            ui.button({ label: 'Continue with Apple', icon: 'logo-apple', variant: 'secondary', block: true, href: next }) +
            ui.button({ label: 'Continue with Google', icon: 'logo-google', variant: 'secondary', block: true, href: next }) +
            ui.button({ label: 'Continue as guest', variant: 'ghost', block: true, href: next }) +
            '<p class="t-13 tone-muted center onb__footnote">Prototype only — no real account or data is created.</p>' +
          '</div>' +
        '</div>'
      );
    },
  });

  // 3 of 4: Connect your Kohler devices
  KK.route('/onboarding/connect', {
    render: function () {
      var devices = KK.data.onboardingDevices
        .map(function (d, i) {
          var product = KK.data.products[d.product];
          var on = d.state === 'connected';
          return (
            '<div class="enter-up" style="--d:' + i + '">' +
            ui.deviceCard(product, { status: d.room + ' · ' + (on ? 'Connected' : 'Updating…'), tone: on ? 'success' : 'warning' }) +
            '</div>'
          );
        })
        .join('');
      return screen(
        ui.stepBar({ step: 3, total: 4, back: '/onboarding/account' }) +
        '<h1 class="t-31">Connect your Kohler devices</h1>' +
        '<p class="t-16 tone-secondary connect__copy">We found these near your network. Everything is shown as ready for this prototype.</p>' +
        '<div class="stack connect__list">' + devices + '</div>' +
        '<div class="stack">' +
          ui.button({ label: 'Scan for more', icon: 'viewfinder-circle', variant: 'secondary', block: true }) +
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
          hero('clock', 'Connect other devices?', 'Add an Apple Watch or another health device to enrich your Health insights. You can always do this later from Account.') +
          '<div class="stack enter-up" style="--d:2">' +
            // Both finish onboarding; "replace" so Back from Devices does not return here.
            ui.button({ label: 'Yes, connect later', block: true, href: '/devices', replace: true }) +
            ui.button({ label: 'Skip for now', variant: 'secondary', block: true, href: '/devices', replace: true }) +
          '</div>' +
        '</div>'
      );
    },
  });
})();
