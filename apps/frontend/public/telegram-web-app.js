/*
 * Minimal, self-hosted Telegram Mini Apps bridge (a subset of the official SDK).
 *
 * Why: the official SDK is normally loaded from https://telegram.org/js/telegram-web-app.js.
 * On filtered networks that host can be unreachable, and without the SDK an app cannot read
 * `initData` at all -> the whole game would be unusable. Telegram passes everything the app
 * needs in the URL of the WebView itself, so a tiny local parser is enough:
 *
 *   <mini app url>#tq=<url-encoded JSON: { initParams: {...}, initDataRaw: "..." }>
 *
 * This file implements only what World War uses: initData (+parsed user), ready(), expand(),
 * color/theme handoff, BackButton, HapticFeedback and MainButton. If telegram.org IS reachable
 * you may load the official SDK instead - it overwrites window.Telegram.WebApp with the full API
 * and everything below simply becomes unused.
 *
 * Nothing here performs any network request.
 */
(function () {
  'use strict';
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) return;

  function decodeRaw(value) {
    try {
      return decodeURIComponent(value.replace(/\+/g, ' '));
    } catch (e) {
      return value;
    }
  }

  function parseInitData(raw) {
    var out = {};
    if (!raw) return out;
    String(raw)
      .split('&')
      .forEach(function (pair) {
        if (!pair) return;
        var i = pair.indexOf('=');
        var key = i < 0 ? pair : pair.slice(0, i);
        var val = i < 0 ? '' : decodeRaw(pair.slice(i + 1));
        if (key === 'user' || key === 'chat' || key === 'receiver' || key === 'start_param') {
          try {
            out[key] = JSON.parse(val);
          } catch (e) {
            out[key] = val;
          }
        } else {
          out[key] = val;
        }
      });
    return out;
  }

  function readFromHash() {
    var hash = String(location.hash || '').replace(/^#/, '');
    var result = { initDataRaw: '', initParams: {} };
    if (!hash) return result;
    if (hash.indexOf('tq=') === 0) {
      try {
        var payload = JSON.parse(decodeRaw(hash.slice(3)));
        result.initDataRaw = payload.initDataRaw || payload.initData || '';
        result.initParams = payload.initParams || {};
        return result;
      } catch (e) {
        /* fall through to the plain key=value form */
      }
    }
    var params = {};
    hash.split('&').forEach(function (pair) {
      var i = pair.indexOf('=');
      if (i > 0) params[pair.slice(0, i)] = decodeRaw(pair.slice(i + 1));
    });
    result.initDataRaw = params.initData || params.tq || '';
    result.initParams = params;
    return result;
  }

  function readFromSearch() {
    var q = new URLSearchParams(location.search);
    return { initDataRaw: q.get('initData') || q.get('tq') || '', initParams: {} };
  }

  var source = readFromHash();
  if (!source.initDataRaw) source = readFromSearch();

  var initData = parseInitData(source.initDataRaw);
  var theme = (source.initParams && source.initParams.theme_params) || {};

  function noop() {}
  function makeEventTarget() {
    var listeners = {};
    return {
      on: function (name, fn) {
        (listeners[name] = listeners[name] || []).push(fn);
      },
      off: function (name, fn) {
        listeners[name] = (listeners[name] || []).filter(function (f) {
          return f !== fn;
        });
      },
      emit: function (name) {
        (listeners[name] || []).forEach(function (f) {
          try {
            f();
          } catch (e) {}
        });
      },
    };
  }

  var WebApp = {
    initData: source.initDataRaw,
    initDataUnsafe: initData,
    platform: (source.initParams && source.initParams.platform) || 'web',
    colorScheme: (source.initParams && source.initParams.color_scheme) || 'dark',
    themeParams: theme,
    version: (source.initParams && source.initParams.version) || '7.0',
    isExpanded: false,
    isActive: true,
    ready: noop,
    expand: function () {
      WebApp.isExpanded = true;
    },
    collapse: noop,
    disableVerticalSwipes: noop,
    setBackgroundColor: noop,
    setHeaderColor: noop,
    setColorScheme: noop,
    enableClosingConfirmation: noop,
    disableConfirmation: noop,
    showPopup: function (params, cb) {
      var ok = window.confirm(String((params && params.message) || ''));
      if (cb) cb(ok ? (params.buttons && params.buttons[0] && params.buttons[0].id) || 'default' : '');
    },
    showAlert: function (message, cb) {
      window.alert(String(message));
      if (cb) cb();
    },
    showConfirm: function (message, cb) {
      if (cb) cb(window.confirm(String(message)));
    },
    sendData: function (data) {
      try {
        // the bot webhook listens for WebAppData messages
        if (window.Telegram && typeof window.Telegram.WebApp.postMessage === 'function') {
          window.Telegram.WebApp.postMessage({ data: data });
        }
      } catch (e) {}
    },
    postEvent: function (event, params) {
      try {
        if (window.parent && window.parent !== window) window.parent.postMessage({ event: event, params: params || {} }, '*');
      } catch (e) {}
    },
    MainButton: {
      text: '',
      isVisible: false,
      show: function () {
        WebApp.MainButton.isVisible = true;
      },
      hide: function () {
        WebApp.MainButton.isVisible = false;
      },
      setText: function (t) {
        WebApp.MainButton.text = t;
      },
      onClick: noop,
      offClick: noop,
    },
    HapticFeedback: {
      impactOccurred: noop,
      notificationOccurred: noop,
      selectionChanged: noop,
    },
  };

  ['BackButton', 'SettingsButton', 'CloudStorage', 'Webview']
    .concat(['SafeArea', 'ContentSafeArea'])
    .forEach(function (name) {
      WebApp[name] = { show: noop, hide: noop, isVisible: false, on: noop, off: noop };
    });

  var events = makeEventTarget();
  WebApp.on = events.on;
  WebApp.off = events.off;
  WebApp._events = events;

  window.Telegram = window.Telegram || {};
  // never overwrite a real SDK that was loaded first
  if (!window.Telegram.WebApp) window.Telegram.WebApp = WebApp;
  else window.Telegram.WebApp.initData = window.Telegram.WebApp.initData || WebApp.initData;
})();
