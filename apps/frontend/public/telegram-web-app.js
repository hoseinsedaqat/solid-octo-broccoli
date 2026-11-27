/*
 * Self-hosted Telegram Mini Apps bridge — a small, dependency-free subset of the official SDK.
 *
 * Why this file exists: the official SDK lives at https://telegram.org/js/telegram-web-app.js and on
 * filtered networks that host can be unreachable. Without it an app cannot read `initData`, so login
 * silently fails and the whole game is unusable. Telegram hands every Mini App its launch data in
 * TWO places, and this file understands both:
 *
 *   1. query string of the WebView URL (all current clients):
 *        ?tgWebAppInitData=…&tgWebAppVersion=7.0&tgWebAppPlatform=android
 *        &tgWebAppColorScheme=dark&tgWebAppThemeParams={…}&tgWebAppStartParam=admin
 *   2. the postMessage / window.external bridge (older clients, and the only channel for
 *        `web_app_data`, haptics, BackButton clicks, …):
 *        request  → {method:'web_view_data_request', data:{url, location}}
 *        answer   → {event:'web_view_data', data:{initData, …}}   (or Telegram.WebAppReceive on mobile)
 *
 * If the official SDK is loaded by other means it wins: this file never overwrites an existing
 * window.Telegram.WebApp, it only fills in what is missing. Nothing here performs a network request.
 */
(function () {
  'use strict';

  var win = window;
  win.Telegram = win.Telegram || {};
  // a real SDK that already produced initData wins — we only fill gaps in that case
  if (win.Telegram.WebApp && win.Telegram.WebApp.initData) return;
  var WEBAPP = win.Telegram.WebApp && typeof win.Telegram.WebApp === 'object' ? win.Telegram.WebApp : {};
  var listeners = {};
  var actionCounter = 0;

  /* ------------------------------ helpers ------------------------------ */

  function decodeRaw(value) {
    if (value == null) return '';
    try {
      return decodeURIComponent(String(value).replace(/\+/g, ' '));
    } catch (e) {
      return String(value);
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

  function parseJsonMaybe(value) {
    if (!value) return {};
    if (typeof value === 'object') return value;
    // bridge payloads arrive as plain JSON; only URL-encoded forms need decoding first
    try {
      return JSON.parse(String(value));
    } catch (e) {}
    try {
      return JSON.parse(decodeRaw(value));
    } catch (e) {
      return {};
    }
  }

  function emit(name) {
    var list = (listeners[name] || []).slice();
    for (var i = 0; i < list.length; i++) {
      try {
        list[i]();
      } catch (e) {}
    }
    try {
      win.dispatchEvent(new Event('ww:telegram-' + name));
    } catch (e) {}
  }

  /* --------------------------- 1. launch params --------------------------- */

  /*
   * Telegram appends its launch data to the Mini App URL and — this is the part that is easy to get
   * wrong — it splits it across BOTH separators: everything after the first "?" or "#" is one flat
   * query, and initData arrives as `tgWebAppData` (not tgWebAppInitData) inside the *hash*:
   *
   *   /app/player#tgWebAppData=user%3D%7B…%7D%26auth_date%3D…%26hash%3D…&tgWebAppPlatform=android
   *
   * Clients are free to strip the hash again (our own router does), so the query is additionally
   * recovered from the navigation entry and from sessionStorage — the same three sources, in the
   * same order, the official SDK uses.
   */
  var STORAGE_KEY = 'ww.launchParamsQuery';

  function extractQuery(href) {
    return String(href || '').replace(/^[^?#]*[?#]/, '').replace(/[?#]/g, '&');
  }

  function looksLikeLaunchQuery(q) {
    return /(^|&)(tgWebAppData|tgWebAppInitData|tgWebAppPlatform|initData|tq)=/.test(String(q || ''));
  }

  function storageGet(key) {
    try {
      return globalThis.sessionStorage ? globalThis.sessionStorage.getItem(key) : '';
    } catch (e) {
      return ''; // blocked storage (private mode / some webviews) — the other sources still work
    }
  }

  function storageSet(key, value) {
    try {
      if (globalThis.sessionStorage) globalThis.sessionStorage.setItem(key, value);
    } catch (e) {}
  }

  function navigationHref() {
    try {
      var entries = win.performance && win.performance.getEntriesByType && win.performance.getEntriesByType('navigation');
      return entries && entries[0] ? entries[0].name : '';
    } catch (e) {
      return '';
    }
  }

  var LAUNCH_SOURCES = [
    ['url', function () { return extractQuery(win.location && win.location.href); }],
    ['navigation', function () { return extractQuery(navigationHref()); }],
    ['storage', function () { return storageGet(STORAGE_KEY); }],
  ];

  /** the query plus where it came from — the login screen shows this when nothing works */
  var LAUNCH = { query: '', source: 'none' };

  function findLaunchQuery() {
    for (var i = 0; i < LAUNCH_SOURCES.length; i++) {
      var q = '';
      try {
        q = LAUNCH_SOURCES[i][1]();
      } catch (e) {}
      if (q && looksLikeLaunchQuery(q)) {
        storageSet(STORAGE_KEY, q); // survive the reload after the hash got dropped
        LAUNCH = { query: q, source: LAUNCH_SOURCES[i][0] };
        return q;
      }
    }
    return '';
  }

  function readLaunchParams() {
    var out = { initData: '', version: '', platform: '', colorScheme: '', themeParams: {}, startParam: '' };
    var search = new URLSearchParams(findLaunchQuery());

    out.initData = search.get('tgWebAppData') || search.get('tgWebAppInitData') || search.get('initData') || '';
    out.version = search.get('tgWebAppVersion') || '';
    out.platform = search.get('tgWebAppPlatform') || '';
    out.colorScheme = search.get('tgWebAppColorScheme') || '';
    out.themeParams = parseJsonMaybe(search.get('tgWebAppThemeParams'));
    out.startParam = search.get('tgWebAppStartParam') || search.get('startapp') || '';

    // debug/preview links hand the whole bundle over as one encoded object: #tq={...}
    if (!out.initData) {
      var rawTq = search.get('tq');
      if (rawTq) {
        var payload = parseJsonMaybe(rawTq);
        out.initData = payload.initDataRaw || payload.initData || '';
        var p = payload.initParams || {};
        out.version = out.version || p.version || '';
        out.platform = out.platform || p.platform || '';
        out.colorScheme = out.colorScheme || p.color_scheme || '';
        out.themeParams = p.theme_params || out.themeParams;
        out.startParam = out.startParam || p.start_param || '';
      }
    }

    // a native client may also have injected the string before any script ran
    var injected = (win.Telegram && (win.Telegram.WebAppInitData || (win.Telegram.WebView && win.Telegram.WebView.initDataRaw))) || '';
    if (!out.initData && injected) {
      out.initData = String(injected);
      LAUNCH.source = 'native';
    }
    // 'url' only counts when data actually came with it, so a later bridge answer can say where it came from
    out.source = out.initData ? LAUNCH.source : 'none';
    return out;
  }

  /* ------------------------------ 2. bridge ------------------------------ */

  function postToParent(payload) {
    try {
      if (win.parent && win.parent !== win) win.parent.postMessage(payload, '*');
    } catch (e) {}
  }

  function postToNative(payload) {
    var raw = JSON.stringify(payload);
    try {
      if (win.external && typeof win.external.invoke === 'function') win.external.invoke(raw);
    } catch (e) {}
    // iOS uses the WebKit script-message handler instead of window.external
    try {
      var handler = win.webkit && win.webkit.messageHandlers && win.webkit.messageHandlers.telegram;
      if (handler && typeof handler.postMessage === 'function') handler.postMessage(raw);
    } catch (e) {}
  }

  /** speaks both dialects: the iframe protocol ({event}) and the mobile one ({method,_action}) */
  function postEvent(event, data) {
    var payload = data || {};
    // the iframe channel speaks {event,data} (legacy) and {eventType,eventData} (v2 SDK)
    postToParent({ event: event, data: payload, eventType: event, eventData: payload });
    actionCounter += 1;
    postToNative({ _action: actionCounter, data: { method: event, data: payload, params: payload } });
    postToNative({ method: event, data: payload, params: payload });
  }

  function applyData(data) {
    if (!data) return false;
    var changed = false;
    var raw = data.initData || data.initDataRaw || data.tgWebAppInitData || '';
    if (raw && raw !== WEBAPP.initData) {
      WEBAPP.initData = raw;
      WEBAPP.initDataUnsafe = parseInitData(raw);
      WEBAPP.isDataRecovered = true;
      changed = true;
    }
    if (data.version) WEBAPP.version = data.version;
    if (data.platform) WEBAPP.platform = data.platform;
    if (data.colorScheme || data.color_scheme) WEBAPP.colorScheme = data.colorScheme || data.color_scheme;
    if (data.themeParams || data.theme_params) WEBAPP.themeParams = parseJsonMaybe(data.themeParams || data.theme_params);
    if (data.startParam || data.start_param) WEBAPP.startParam = String(data.startParam || data.start_param);
    if (changed) {
      if (!WEBAPP.launchSource || WEBAPP.launchSource === 'none') WEBAPP.launchSource = 'bridge';
      emit('init');
    }
    return changed;
  }

  // the native side calls this global directly on iOS/Android
  win.Telegram.WebAppReceive = function (payload) {
    var msg = typeof payload === 'string' ? parseJsonMaybe(payload) : payload || {};
    msg = msg || {};
    if (msg.eventData && !msg.data) msg = { data: msg.eventData, event: msg.eventType };
    if (
      msg.event === 'web_view_data' ||
      msg.event === 'web_view_data_changed' ||
      msg.method === 'web_view_data' ||
      msg.eventType === 'web_view_data'
    ) {
      applyData(msg.data || msg.params || msg);
    } else if (msg.event === 'back_button_click' || msg.eventType === 'back_button_click') {
      emit('backButtonClicked');
    } else if (msg.event === 'settings_button_clicked' || msg.eventType === 'settings_button_clicked') {
      emit('settingsButtonClicked');
    } else if (msg.event === 'main_button_clicked' || msg.event === 'web_app_main_button_click' || msg.eventType === 'main_button_clicked') {
      emit('mainButtonClicked');
    } else if (msg.initData || msg.initDataRaw) {
      applyData(msg);
    }
  };

  function named(msg, names) {
    var got = String(msg.event || msg.eventType || msg.method || '');
    for (var i = 0; i < names.length; i++) if (got === names[i]) return true;
    return false;
  }

  function onMessage(msg) {
    if (!msg || typeof msg !== 'object') return;
    if (named(msg, ['web_view_data', 'web_view_data_changed', 'set_inline_mode', 'theme_changed'])) {
      applyData(msg.data || msg.params || msg.eventData || {});
    } else if (named(msg, ['back_button_click'])) {
      emit('backButtonClicked');
    } else if (named(msg, ['web_app_main_button_click', 'main_button_clicked'])) {
      emit('mainButtonClicked');
    }
  }

  win.addEventListener('message', function (e) {
    onMessage(e && e.data);
  });

  /* ------------------------------ 3. the API ------------------------------ */

  var params = readLaunchParams();

  WEBAPP.initData = params.initData;
  WEBAPP.initDataUnsafe = parseInitData(params.initData);
  WEBAPP.platform = params.platform || 'web';
  WEBAPP.version = params.version || '7.0';
  WEBAPP.colorScheme = params.colorScheme || 'dark';
  WEBAPP.themeParams = params.themeParams || {};
  WEBAPP.startParam = params.startParam || '';
  /** 'url' | 'navigation' | 'storage' | 'native' | 'bridge' | 'none' — diagnostics only */
  WEBAPP.launchSource = params.source || 'none';
  WEBAPP.isExpanded = false;
  WEBAPP.isActive = true;
  WEBAPP.isDataRecovered = false;
  WEBAPP.ready = function () {};
  WEBAPP.expand = function () {
    WEBAPP.isExpanded = true;
    postEvent('web_app_expand', {});
  };
  WEBAPP.collapse = function () {
    WEBAPP.isExpanded = false;
  };
  WEBAPP.close = function () {
    postEvent('close_web_app', {});
  };
  WEBAPP.disableVerticalSwipes = function () {};
  WEBAPP.setBackgroundColor = function (color) {
    postEvent('web_app_set_background_color', { color: color });
  };
  WEBAPP.setHeaderColor = function (color) {
    postEvent('web_app_set_header_color', { color: color });
  };
  WEBAPP.setColorScheme = function (scheme) {
    WEBAPP.colorScheme = scheme;
    postEvent('web_app_set_color_scheme', { color_scheme: scheme });
  };
  WEBAPP.openLink = function (url) {
    postEvent('open_link', { url: url });
    try {
      win.open(url, '_blank');
    } catch (e) {}
  };
  WEBAPP.sendData = function (data) {
    postEvent('web_app_data', { data: String(data == null ? '' : data) });
  };
  WEBAPP.postEvent = postEvent;
  WEBAPP.on = function (name, fn) {
    (listeners[name] = listeners[name] || []).push(fn);
  };
  WEBAPP.off = function (name, fn) {
    listeners[name] = (listeners[name] || []).filter(function (f) {
      return f !== fn;
    });
  };
  WEBAPP.MainButton = {
    text: '',
    isActive: true,
    isVisible: false,
    show: function () {
      WEBAPP.MainButton.isVisible = true;
      postEvent('web_app_setup_main_button', { is_visible: true, is_active: WEBAPP.MainButton.isActive, text: WEBAPP.MainButton.text });
    },
    hide: function () {
      WEBAPP.MainButton.isVisible = false;
      postEvent('web_app_setup_main_button', { is_visible: false });
    },
    setText: function (t) {
      WEBAPP.MainButton.text = t;
      postEvent('web_app_setup_main_button', { text: t });
    },
    enable: function () {
      WEBAPP.MainButton.isActive = true;
    },
    disable: function () {
      WEBAPP.MainButton.isActive = false;
    },
    onClick: function (fn) {
      WEBAPP.on('mainButtonClicked', fn);
    },
    offClick: function (fn) {
      WEBAPP.off('mainButtonClicked', fn);
    },
  };
  WEBAPP.HapticFeedback = {
    impactOccurred: function (style) {
      postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: String(style || 'light') });
    },
    notificationOccurred: function (kind) {
      postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: String(kind || 'error') });
    },
    selectionChanged: function () {
      postEvent('web_app_trigger_haptic_feedback', { type: 'selection', impact_style: 'light' });
    },
  };

  ['BackButton', 'SettingsButton', 'CloudStorage', 'Webview', 'SafeArea', 'ContentSafeArea', 'SecondaryButton'].forEach(function (name) {
    WEBAPP[name] = {
      show: function () {
        postEvent('web_app_setup_back_button', { is_visible: true });
      },
      hide: function () {
        postEvent('web_app_setup_back_button', { is_visible: false });
      },
      isVisible: false,
      on: function (fn) {
        WEBAPP.on(name === 'BackButton' ? 'backButtonClicked' : 'settingsButtonClicked', fn);
      },
      off: function (fn) {
        WEBAPP.off(name === 'BackButton' ? 'backButtonClicked' : 'settingsButtonClicked', fn);
      },
      onClick: function (fn) {
        WEBAPP.on(name === 'BackButton' ? 'backButtonClicked' : 'settingsButtonClicked', fn);
      },
      offClick: function () {},
      setData: function () {
        return Promise.resolve({ ok: true });
      },
      getData: function () {
        return Promise.resolve({ result: {} });
      },
    };
  });

  win.Telegram.WebApp = WEBAPP;

  // ask the client for the launch data if the URL did not carry it
  if (!WEBAPP.initData) {
    postEvent('web_view_data_request', {
      url: String(win.location && win.location.href ? win.location.href : ''),
      location: String(win.location && win.location.search ? win.location.search : ''),
    });
  }
})();
