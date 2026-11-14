/*
 * Hash router. Paths mirror the old Expo Router paths: #/devices/room/bathroom.
 *
 * Register a screen:
 *   KK.route('/devices/room/:id', {
 *     tab: 'devices',                      // which tab is highlighted; omit to hide the tab bar
 *     render: function (ctx) {...},     // returns an HTML string, or { redirect: '/devices' }
 *     mount: function (root, ctx) {...} // optional: wire events after the HTML is in the page
 *   });
 *
 * ctx = { path, params, state }. `state` is a plain object kept for as long as the screen
 * stays in the back stack (like component state on a native stack): it survives going
 * forward and coming back, and is dropped once you navigate back past the screen.
 *
 * Navigate: <a href="#/devices">, <a href="#/devices" data-replace>, <button data-back="/devices">,
 * or KK.router.go(path) / .replace(path) / .back(fallbackPath).
 */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});

  var routes = [];
  var TAB_ROOTS = { devices: '/devices', health: '/health', account: '/account' };
  var lastInTab = { devices: '/devices', health: '/health', account: '/account' };
  var entryState = {}; // history index -> screen state
  var entryScroll = {}; // history index -> scroll position
  var index = 0; // position of the current entry in this session's history
  var current = null; // { path, tab }
  var app, tabbar;

  KK.route = function (pattern, screen) {
    var keys = [];
    var source = pattern.replace(/:([a-z]+)/gi, function (_, key) {
      keys.push(key);
      return '([^/]+)';
    });
    routes.push({ regex: new RegExp('^' + source + '/?$'), keys: keys, screen: screen });
  };

  function match(path) {
    for (var i = 0; i < routes.length; i++) {
      var m = routes[i].regex.exec(path);
      if (!m) continue;
      var params = {};
      routes[i].keys.forEach(function (key, k) {
        params[key] = decodeURIComponent(m[k + 1]);
      });
      return { screen: routes[i].screen, params: params };
    }
    return null;
  }

  function currentPath() {
    var hash = location.hash.replace(/^#/, '');
    return hash && hash.charAt(0) === '/' ? hash : '/';
  }

  function render(restoreScroll) {
    var path = currentPath();
    var found = match(path);
    if (!found) {
      replace('/');
      return;
    }
    var state = entryState[index] || (entryState[index] = {});
    var ctx = { path: path, params: found.params, state: state };
    var out = found.screen.render(ctx);
    if (out && typeof out === 'object' && out.redirect) {
      replace(out.redirect);
      return;
    }

    var tab = found.screen.tab || null;
    if (tab) lastInTab[tab] = path;
    current = { path: path, tab: tab };

    app.innerHTML = out;
    app.scrollTop = restoreScroll ? entryScroll[index] || 0 : 0;

    tabbar.hidden = !tab;
    Array.prototype.forEach.call(tabbar.querySelectorAll('[data-tab]'), function (item) {
      if (item.getAttribute('data-tab') === tab) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });

    if (found.screen.mount) found.screen.mount(app.firstElementChild, ctx);
  }

  function rememberScroll() {
    entryScroll[index] = app.scrollTop;
  }

  /** Drop the state of every entry at or after `from` (those screens left the stack). */
  function forget(from) {
    [entryState, entryScroll].forEach(function (store) {
      Object.keys(store).forEach(function (key) {
        if (Number(key) >= from) delete store[key];
      });
    });
  }

  function go(path) {
    if (current && path === current.path) return;
    rememberScroll();
    index += 1;
    forget(index);
    history.pushState({ kk: index }, '', '#' + path);
    render(false);
  }

  function replace(path) {
    forget(index);
    history.replaceState({ kk: index }, '', '#' + path);
    render(false);
  }

  function back(fallback) {
    if (index > 0) history.back();
    else replace(fallback || '/devices');
  }

  function onPopState(e) {
    // Back/forward inside the app carries our index; a hand-edited URL has no state.
    rememberScroll();
    var known = e.state && typeof e.state.kk === 'number';
    if (known) {
      index = e.state.kk;
    } else {
      index += 1;
      forget(index);
      history.replaceState({ kk: index }, '', location.href);
    }
    render(known);
  }

  function onClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var target = e.target.closest ? e.target.closest('a[href^="#/"], [data-back], [data-tab]') : null;
    if (!target) return;
    e.preventDefault();

    if (target.hasAttribute('data-tab')) {
      var tab = target.getAttribute('data-tab');
      // Like native tabs: a second tap on the active tab returns to its first screen;
      // switching tabs returns to where that tab was left.
      go(current && current.tab === tab ? TAB_ROOTS[tab] : lastInTab[tab]);
    } else if (target.hasAttribute('data-back')) {
      back(target.getAttribute('data-back'));
    } else {
      var path = target.getAttribute('href').slice(1);
      if (target.hasAttribute('data-replace')) replace(path);
      else go(path);
    }
  }

  function start() {
    app = document.getElementById('app');
    tabbar = document.getElementById('tabbar');
    Array.prototype.forEach.call(tabbar.querySelectorAll('[data-icon]'), function (slot) {
      slot.outerHTML = KK.icon(slot.getAttribute('data-icon'), 20);
    });
    index = history.state && typeof history.state.kk === 'number' ? history.state.kk : 0;
    history.replaceState({ kk: index }, '', location.href);
    window.addEventListener('popstate', onPopState);
    document.addEventListener('click', onClick);
    render(false);
  }

  KK.router = { go: go, replace: replace, back: back, start: start };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
