(function(e, t) {
  typeof module == "object" && typeof module.exports == "object" ? module.exports = e.document ? t(e, !0) : function(e) {
    if (!e.document) throw new Error("jQuery requires a window with a document");
    return t(e)
  } : t(e)
})(typeof window != "undefined" ? window : this, function(window, noGlobal) {
  function isArraylike(e) {
    var t = e.length,
      n = jQuery.type(e);
    return n === "function" || jQuery.isWindow(e) ? !1 : e.nodeType === 1 && t ? !0 : n === "array" || t === 0 || typeof t == "number" && t > 0 && t - 1 in e
  }

  function winnow(e, t, n) {
    if (jQuery.isFunction(t)) return jQuery.grep(e, function(e, r) {
      return !!t.call(e, r, e) !== n
    });
    if (t.nodeType) return jQuery.grep(e, function(e) {
      return e === t !== n
    });
    if (typeof t == "string") {
      if (risSimple.test(t)) return jQuery.filter(t, e, n);
      t = jQuery.filter(t, e)
    }
    return jQuery.grep(e, function(e) {
      return indexOf.call(t, e) >= 0 !== n
    })
  }

  function sibling(e, t) {
    while ((e = e[t]) && e.nodeType !== 1);
    return e
  }

  function createOptions(e) {
    var t = optionsCache[e] = {};
    return jQuery.each(e.match(rnotwhite) || [], function(e, n) {
      t[n] = !0
    }), t
  }

  function completed() {
    document.removeEventListener("DOMContentLoaded", completed, !1), window.removeEventListener("load", completed, !1), jQuery.ready()
  }

  function Data() {
    Object.defineProperty(this.cache = {}, 0, {
      get: function() {
        return {}
      }
    }), this.expando = jQuery.expando + Math.random()
  }

  function dataAttr(e, t, n) {
    var r;
    if (n === undefined && e.nodeType === 1) {
      r = "data-" + t.replace(rmultiDash, "-$1").toLowerCase(), n = e.getAttribute(r);
      if (typeof n == "string") {
        try {
          n = n === "true" ? !0 : n === "false" ? !1 : n === "null" ? null : +n + "" === n ? +n : rbrace.test(n) ? jQuery.parseJSON(n) : n
        } catch (i) {}
        data_user.set(e, t, n)
      } else n = undefined
    }
    return n
  }

  function returnTrue() {
    return !0
  }

  function returnFalse() {
    return !1
  }

  function safeActiveElement() {
    try {
      return document.activeElement
    } catch (e) {}
  }

  function manipulationTarget(e, t) {
    return jQuery.nodeName(e, "table") && jQuery.nodeName(t.nodeType !== 11 ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
  }

  function disableScript(e) {
    return e.type = (e.getAttribute("type") !== null) + "/" + e.type, e
  }

  function restoreScript(e) {
    var t = rscriptTypeMasked.exec(e.type);
    return t ? e.type = t[1] : e.removeAttribute("type"), e
  }

  function setGlobalEval(e, t) {
    var n = 0,
      r = e.length;
    for (; n < r; n++) data_priv.set(e[n], "globalEval", !t || data_priv.get(t[n], "globalEval"))
  }

  function cloneCopyEvent(e, t) {
    var n, r, i, s, o, u, a, f;
    if (t.nodeType !== 1) return;
    if (data_priv.hasData(e)) {
      s = data_priv.access(e), o = data_priv.set(t, s), f = s.events;
      if (f) {
        delete o.handle, o.events = {};
        for (i in f)
          for (n = 0, r = f[i].length; n < r; n++) jQuery.event.add(t, i, f[i][n])
      }
    }
    data_user.hasData(e) && (u = data_user.access(e), a = jQuery.extend({}, u), data_user.set(t, a))
  }

  function getAll(e, t) {
    var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
    return t === undefined || t && jQuery.nodeName(e, t) ? jQuery.merge([e], n) : n
  }

  function fixInput(e, t) {
    var n = t.nodeName.toLowerCase();
    if (n === "input" && rcheckableType.test(e.type)) t.checked = e.checked;
    else if (n === "input" || n === "textarea") t.defaultValue = e.defaultValue
  }

  function actualDisplay(e, t) {
    var n, r = jQuery(t.createElement(e)).appendTo(t.body),
      i = window.getDefaultComputedStyle && (n = window.getDefaultComputedStyle(r[0])) ? n.display : jQuery.css(r[0], "display");
    return r.detach(), i
  }

  function defaultDisplay(e) {
    var t = document,
      n = elemdisplay[e];
    if (!n) {
      n = actualDisplay(e, t);
      if (n === "none" || !n) iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = iframe[0].contentDocument, t.write(), t.close(), n = actualDisplay(e, t), iframe.detach();
      elemdisplay[e] = n
    }
    return n
  }

  function curCSS(e, t, n) {
    var r, i, s, o, u = e.style;
    return n = n || getStyles(e), n && (o = n.getPropertyValue(t) || n[t]), n && (o === "" && !jQuery.contains(e.ownerDocument, e) && (o = jQuery.style(e, t)), rnumnonpx.test(o) && rmargin.test(t) && (r = u.width, i = u.minWidth, s = u.maxWidth, u.minWidth = u.maxWidth = u.width = o, o = n.width, u.width = r, u.minWidth = i, u.maxWidth = s)), o !== undefined ? o + "" : o
  }

  function addGetHookIf(e, t) {
    return {
      get: function() {
        if (e()) {
          delete this.get;
          return
        }
        return (this.get = t).apply(this, arguments)
      }
    }
  }

  function vendorPropName(e, t) {
    if (t in e) return t;
    var n = t[0].toUpperCase() + t.slice(1),
      r = t,
      i = cssPrefixes.length;
    while (i--) {
      t = cssPrefixes[i] + n;
      if (t in e) return t
    }
    return r
  }

  function setPositiveNumber(e, t, n) {
    var r = rnumsplit.exec(t);
    return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
  }

  function augmentWidthOrHeight(e, t, n, r, i) {
    var s = n === (r ? "border" : "content") ? 4 : t === "width" ? 1 : 0,
      o = 0;
    for (; s < 4; s += 2) n === "margin" && (o += jQuery.css(e, n + cssExpand[s], !0, i)), r ? (n === "content" && (o -= jQuery.css(e, "padding" + cssExpand[s], !0, i)), n !== "margin" && (o -= jQuery.css(e, "border" + cssExpand[s] + "Width", !0, i))) : (o += jQuery.css(e, "padding" + cssExpand[s], !0, i), n !== "padding" && (o += jQuery.css(e, "border" + cssExpand[s] + "Width", !0, i)));
    return o
  }

  function getWidthOrHeight(e, t, n) {
    var r = !0,
      i = t === "width" ? e.offsetWidth : e.offsetHeight,
      s = getStyles(e),
      o = jQuery.css(e, "boxSizing", !1, s) === "border-box";
    if (i <= 0 || i == null) {
      i = curCSS(e, t, s);
      if (i < 0 || i == null) i = e.style[t];
      if (rnumnonpx.test(i)) return i;
      r = o && (support.boxSizingReliable() || i === e.style[t]), i = parseFloat(i) || 0
    }
    return i + augmentWidthOrHeight(e, t, n || (o ? "border" : "content"), r, s) + "px"
  }

  function showHide(e, t) {
    var n, r, i, s = [],
      o = 0,
      u = e.length;
    for (; o < u; o++) {
      r = e[o];
      if (!r.style) continue;
      s[o] = data_priv.get(r, "olddisplay"), n = r.style.display, t ? (!s[o] && n === "none" && (r.style.display = ""), r.style.display === "" && isHidden(r) && (s[o] = data_priv.access(r, "olddisplay", defaultDisplay(r.nodeName)))) : (i = isHidden(r), (n !== "none" || !i) && data_priv.set(r, "olddisplay", i ? n : jQuery.css(r, "display")))
    }
    for (o = 0; o < u; o++) {
      r = e[o];
      if (!r.style) continue;
      if (!t || r.style.display === "none" || r.style.display === "") r.style.display = t ? s[o] || "" : "none"
    }
    return e
  }

  function Tween(e, t, n, r, i) {
    return new Tween.prototype.init(e, t, n, r, i)
  }

  function createFxNow() {
    return setTimeout(function() {
      fxNow = undefined
    }), fxNow = jQuery.now()
  }

  function genFx(e, t) {
    var n, r = 0,
      i = {
        height: e
      };
    t = t ? 1 : 0;
    for (; r < 4; r += 2 - t) n = cssExpand[r], i["margin" + n] = i["padding" + n] = e;
    return t && (i.opacity = i.width = e), i
  }

  function createTween(e, t, n) {
    var r, i = (tweeners[t] || []).concat(tweeners["*"]),
      s = 0,
      o = i.length;
    for (; s < o; s++)
      if (r = i[s].call(n, t, e)) return r
  }

  function defaultPrefilter(e, t, n) {
    var r, i, s, o, u, a, f, l, c = this,
      h = {},
      p = e.style,
      d = e.nodeType && isHidden(e),
      v = data_priv.get(e, "fxshow");
    n.queue || (u = jQuery._queueHooks(e, "fx"), u.unqueued == null && (u.unqueued = 0, a = u.empty.fire, u.empty.fire = function() {
      u.unqueued || a()
    }), u.unqueued++, c.always(function() {
      c.always(function() {
        u.unqueued--, jQuery.queue(e, "fx").length || u.empty.fire()
      })
    })), e.nodeType === 1 && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], f = jQuery.css(e, "display"), l = f === "none" ? data_priv.get(e, "olddisplay") || defaultDisplay(e.nodeName) : f, l === "inline" && jQuery.css(e, "float") === "none" && (p.display = "inline-block")), n.overflow && (p.overflow = "hidden", c.always(function() {
      p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
    }));
    for (r in t) {
      i = t[r];
      if (rfxtypes.exec(i)) {
        delete t[r], s = s || i === "toggle";
        if (i === (d ? "hide" : "show")) {
          if (i !== "show" || !v || v[r] === undefined) continue;
          d = !0
        }
        h[r] = v && v[r] || jQuery.style(e, r)
      } else f = undefined
    }
    if (!jQuery.isEmptyObject(h)) {
      v ? "hidden" in v && (d = v.hidden) : v = data_priv.access(e, "fxshow", {}), s && (v.hidden = !d), d ? jQuery(e).show() : c.done(function() {
        jQuery(e).hide()
      }), c.done(function() {
        var t;
        data_priv.remove(e, "fxshow");
        for (t in h) jQuery.style(e, t, h[t])
      });
      for (r in h) o = createTween(d ? v[r] : 0, r, c), r in v || (v[r] = o.start, d && (o.end = o.start, o.start = r === "width" || r === "height" ? 1 : 0))
    } else(f === "none" ? defaultDisplay(e.nodeName) : f) === "inline" && (p.display = f)
  }

  function propFilter(e, t) {
    var n, r, i, s, o;
    for (n in e) {
      r = jQuery.camelCase(n), i = t[r], s = e[n], jQuery.isArray(s) && (i = s[1], s = e[n] = s[0]), n !== r && (e[r] = s, delete e[n]), o = jQuery.cssHooks[r];
      if (o && "expand" in o) {
        s = o.expand(s), delete e[r];
        for (n in s) n in e || (e[n] = s[n], t[n] = i)
      } else t[r] = i
    }
  }

  function Animation(e, t, n) {
    var r, i, s = 0,
      o = animationPrefilters.length,
      u = jQuery.Deferred().always(function() {
        delete a.elem
      }),
      a = function() {
        if (i) return !1;
        var t = fxNow || createFxNow(),
          n = Math.max(0, f.startTime + f.duration - t),
          r = n / f.duration || 0,
          s = 1 - r,
          o = 0,
          a = f.tweens.length;
        for (; o < a; o++) f.tweens[o].run(s);
        return u.notifyWith(e, [f, s, n]), s < 1 && a ? n : (u.resolveWith(e, [f]), !1)
      },
      f = u.promise({
        elem: e,
        props: jQuery.extend({}, t),
        opts: jQuery.extend(!0, {
          specialEasing: {}
        }, n),
        originalProperties: t,
        originalOptions: n,
        startTime: fxNow || createFxNow(),
        duration: n.duration,
        tweens: [],
        createTween: function(t, n) {
          var r = jQuery.Tween(e, f.opts, t, n, f.opts.specialEasing[t] || f.opts.easing);
          return f.tweens.push(r), r
        },
        stop: function(t) {
          var n = 0,
            r = t ? f.tweens.length : 0;
          if (i) return this;
          i = !0;
          for (; n < r; n++) f.tweens[n].run(1);
          return t ? u.resolveWith(e, [f, t]) : u.rejectWith(e, [f, t]), this
        }
      }),
      l = f.props;
    propFilter(l, f.opts.specialEasing);
    for (; s < o; s++) {
      r = animationPrefilters[s].call(f, e, l, f.opts);
      if (r) return r
    }
    return jQuery.map(l, createTween, f), jQuery.isFunction(f.opts.start) && f.opts.start.call(e, f), jQuery.fx.timer(jQuery.extend(a, {
      elem: e,
      anim: f,
      queue: f.opts.queue
    })), f.progress(f.opts.progress).done(f.opts.done, f.opts.complete).fail(f.opts.fail).always(f.opts.always)
  }

  function addToPrefiltersOrTransports(e) {
    return function(t, n) {
      typeof t != "string" && (n = t, t = "*");
      var r, i = 0,
        s = t.toLowerCase().match(rnotwhite) || [];
      if (jQuery.isFunction(n))
        while (r = s[i++]) r[0] === "+" ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
    }
  }

  function inspectPrefiltersOrTransports(e, t, n, r) {
    function o(u) {
      var a;
      return i[u] = !0, jQuery.each(e[u] || [], function(e, u) {
        var f = u(t, n, r);
        if (typeof f == "string" && !s && !i[f]) return t.dataTypes.unshift(f), o(f), !1;
        if (s) return !(a = f)
      }), a
    }
    var i = {},
      s = e === transports;
    return o(t.dataTypes[0]) || !i["*"] && o("*")
  }

  function ajaxExtend(e, t) {
    var n, r, i = jQuery.ajaxSettings.flatOptions || {};
    for (n in t) t[n] !== undefined && ((i[n] ? e : r || (r = {}))[n] = t[n]);
    return r && jQuery.extend(!0, e, r), e
  }

  function ajaxHandleResponses(e, t, n) {
    var r, i, s, o, u = e.contents,
      a = e.dataTypes;
    while (a[0] === "*") a.shift(), r === undefined && (r = e.mimeType || t.getResponseHeader("Content-Type"));
    if (r)
      for (i in u)
        if (u[i] && u[i].test(r)) {
          a.unshift(i);
          break
        }
    if (a[0] in n) s = a[0];
    else {
      for (i in n) {
        if (!a[0] || e.converters[i + " " + a[0]]) {
          s = i;
          break
        }
        o || (o = i)
      }
      s = s || o
    }
    if (s) return s !== a[0] && a.unshift(s), n[s]
  }

  function ajaxConvert(e, t, n, r) {
    var i, s, o, u, a, f = {},
      l = e.dataTypes.slice();
    if (l[1])
      for (o in e.converters) f[o.toLowerCase()] = e.converters[o];
    s = l.shift();
    while (s) {
      e.responseFields[s] && (n[e.responseFields[s]] = t), !a && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), a = s, s = l.shift();
      if (s)
        if (s === "*") s = a;
        else if (a !== "*" && a !== s) {
        o = f[a + " " + s] || f["* " + s];
        if (!o)
          for (i in f) {
            u = i.split(" ");
            if (u[1] === s) {
              o = f[a + " " + u[0]] || f["* " + u[0]];
              if (o) {
                o === !0 ? o = f[i] : f[i] !== !0 && (s = u[0], l.unshift(u[1]));
                break
              }
            }
          }
        if (o !== !0)
          if (o && e["throws"]) t = o(t);
          else try {
            t = o(t)
          } catch (c) {
            return {
              state: "parsererror",
              error: o ? c : "No conversion from " + a + " to " + s
            }
          }
      }
    }
    return {
      state: "success",
      data: t
    }
  }

  function buildParams(e, t, n, r) {
    var i;
    if (jQuery.isArray(t)) jQuery.each(t, function(t, i) {
      n || rbracket.test(e) ? r(e, i) : buildParams(e + "[" + (typeof i == "object" ? t : "") + "]", i, n, r)
    });
    else if (!n && jQuery.type(t) === "object")
      for (i in t) buildParams(e + "[" + i + "]", t[i], n, r);
    else r(e, t)
  }

  function getWindow(e) {
    return jQuery.isWindow(e) ? e : e.nodeType === 9 && e.defaultView
  }
  var arr = [],
    slice = arr.slice,
    concat = arr.concat,
    push = arr.push,
    indexOf = arr.indexOf,
    class2type = {},
    toString = class2type.toString,
    hasOwn = class2type.hasOwnProperty,
    support = {},
    document = window.document,
    version = "2.1.1",
    jQuery = function(e, t) {
      return new jQuery.fn.init(e, t)
    },
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    rmsPrefix = /^-ms-/,
    rdashAlpha = /-([\da-z])/gi,
    fcamelCase = function(e, t) {
      return t.toUpperCase()
    };
  jQuery.fn = jQuery.prototype = {
    jquery: version,
    constructor: jQuery,
    selector: "",
    length: 0,
    toArray: function() {
      return slice.call(this)
    },
    get: function(e) {
      return e != null ? e < 0 ? this[e + this.length] : this[e] : slice.call(this)
    },
    pushStack: function(e) {
      var t = jQuery.merge(this.constructor(), e);
      return t.prevObject = this, t.context = this.context, t
    },
    each: function(e, t) {
      return jQuery.each(this, e, t)
    },
    map: function(e) {
      return this.pushStack(jQuery.map(this, function(t, n) {
        return e.call(t, n, t)
      }))
    },
    slice: function() {
      return this.pushStack(slice.apply(this, arguments))
    },
    first: function() {
      return this.eq(0)
    },
    last: function() {
      return this.eq(-1)
    },
    eq: function(e) {
      var t = this.length,
        n = +e + (e < 0 ? t : 0);
      return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
    },
    end: function() {
      return this.prevObject || this.constructor(null)
    },
    push: push,
    sort: arr.sort,
    splice: arr.splice
  }, jQuery.extend = jQuery.fn.extend = function() {
    var e, t, n, r, i, s, o = arguments[0] || {},
      u = 1,
      a = arguments.length,
      f = !1;
    typeof o == "boolean" && (f = o, o = arguments[u] || {}, u++), typeof o != "object" && !jQuery.isFunction(o) && (o = {}), u === a && (o = this, u--);
    for (; u < a; u++)
      if ((e = arguments[u]) != null)
        for (t in e) {
          n = o[t], r = e[t];
          if (o === r) continue;
          f && r && (jQuery.isPlainObject(r) || (i = jQuery.isArray(r))) ? (i ? (i = !1, s = n && jQuery.isArray(n) ? n : []) : s = n && jQuery.isPlainObject(n) ? n : {}, o[t] = jQuery.extend(f, s, r)) : r !== undefined && (o[t] = r)
        }
      return o
  }, jQuery.extend({
    expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
    isReady: !0,
    error: function(e) {
      throw new Error(e)
    },
    noop: function() {},
    isFunction: function(e) {
      return jQuery.type(e) === "function"
    },
    isArray: Array.isArray,
    isWindow: function(e) {
      return e != null && e === e.window
    },
    isNumeric: function(e) {
      return !jQuery.isArray(e) && e - parseFloat(e) >= 0
    },
    isPlainObject: function(e) {
      return jQuery.type(e) !== "object" || e.nodeType || jQuery.isWindow(e) ? !1 : e.constructor && !hasOwn.call(e.constructor.prototype, "isPrototypeOf") ? !1 : !0
    },
    isEmptyObject: function(e) {
      var t;
      for (t in e) return !1;
      return !0
    },
    type: function(e) {
      return e == null ? e + "" : typeof e == "object" || typeof e == "function" ? class2type[toString.call(e)] || "object" : typeof e
    },
    globalEval: function(code) {
      var script, indirect = eval;
      code = jQuery.trim(code), code && (code.indexOf("use strict") === 1 ? (script = document.createElement("script"), script.text = code, document.head.appendChild(script).parentNode.removeChild(script)) : indirect(code))
    },
    camelCase: function(e) {
      return e.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase)
    },
    nodeName: function(e, t) {
      return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    },
    each: function(e, t, n) {
      var r, i = 0,
        s = e.length,
        o = isArraylike(e);
      if (n)
        if (o)
          for (; i < s; i++) {
            r = t.apply(e[i], n);
            if (r === !1) break
          } else
            for (i in e) {
              r = t.apply(e[i], n);
              if (r === !1) break
            } else if (o)
              for (; i < s; i++) {
                r = t.call(e[i], i, e[i]);
                if (r === !1) break
              } else
                for (i in e) {
                  r = t.call(e[i], i, e[i]);
                  if (r === !1) break
                }
            return e
    },
    trim: function(e) {
      return e == null ? "" : (e + "").replace(rtrim, "")
    },
    makeArray: function(e, t) {
      var n = t || [];
      return e != null && (isArraylike(Object(e)) ? jQuery.merge(n, typeof e == "string" ? [e] : e) : push.call(n, e)), n
    },
    inArray: function(e, t, n) {
      return t == null ? -1 : indexOf.call(t, e, n)
    },
    merge: function(e, t) {
      var n = +t.length,
        r = 0,
        i = e.length;
      for (; r < n; r++) e[i++] = t[r];
      return e.length = i, e
    },
    grep: function(e, t, n) {
      var r, i = [],
        s = 0,
        o = e.length,
        u = !n;
      for (; s < o; s++) r = !t(e[s], s), r !== u && i.push(e[s]);
      return i
    },
    map: function(e, t, n) {
      var r, i = 0,
        s = e.length,
        o = isArraylike(e),
        u = [];
      if (o)
        for (; i < s; i++) r = t(e[i], i, n), r != null && u.push(r);
      else
        for (i in e) r = t(e[i], i, n), r != null && u.push(r);
      return concat.apply([], u)
    },
    guid: 1,
    proxy: function(e, t) {
      var n, r, i;
      return typeof t == "string" && (n = e[t], t = e, e = n), jQuery.isFunction(e) ? (r = slice.call(arguments, 2), i = function() {
        return e.apply(t || this, r.concat(slice.call(arguments)))
      }, i.guid = e.guid = e.guid || jQuery.guid++, i) : undefined
    },
    now: Date.now,
    support: support
  }), jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
    class2type["[object " + t + "]"] = t.toLowerCase()
  });
  var Sizzle = function(e) {
    function st(e, t, r, i) {
      var s, u, f, l, c, d, g, y, S, x;
      (t ? t.ownerDocument || t : E) !== p && h(t), t = t || p, r = r || [];
      if (!e || typeof e != "string") return r;
      if ((l = t.nodeType) !== 1 && l !== 9) return [];
      if (v && !i) {
        if (s = Z.exec(e))
          if (f = s[1]) {
            if (l === 9) {
              u = t.getElementById(f);
              if (!u || !u.parentNode) return r;
              if (u.id === f) return r.push(u), r
            } else if (t.ownerDocument && (u = t.ownerDocument.getElementById(f)) && b(t, u) && u.id === f) return r.push(u), r
          } else {
            if (s[2]) return P.apply(r, t.getElementsByTagName(e)), r;
            if ((f = s[3]) && n.getElementsByClassName && t.getElementsByClassName) return P.apply(r, t.getElementsByClassName(f)), r
          }
        if (n.qsa && (!m || !m.test(e))) {
          y = g = w, S = t, x = l === 9 && e;
          if (l === 1 && t.nodeName.toLowerCase() !== "object") {
            d = o(e), (g = t.getAttribute("id")) ? y = g.replace(tt, "\\$&") : t.setAttribute("id", y), y = "[id='" + y + "'] ", c = d.length;
            while (c--) d[c] = y + mt(d[c]);
            S = et.test(e) && dt(t.parentNode) || t, x = d.join(",")
          }
          if (x) try {
            return P.apply(r, S.querySelectorAll(x)), r
          } catch (T) {} finally {
            g || t.removeAttribute("id")
          }
        }
      }
      return a(e.replace(z, "$1"), t, r, i)
    }

    function ot() {
      function t(n, i) {
        return e.push(n + " ") > r.cacheLength && delete t[e.shift()], t[n + " "] = i
      }
      var e = [];
      return t
    }

    function ut(e) {
      return e[w] = !0, e
    }

    function at(e) {
      var t = p.createElement("div");
      try {
        return !!e(t)
      } catch (n) {
        return !1
      } finally {
        t.parentNode && t.parentNode.removeChild(t), t = null
      }
    }

    function ft(e, t) {
      var n = e.split("|"),
        i = e.length;
      while (i--) r.attrHandle[n[i]] = t
    }

    function lt(e, t) {
      var n = t && e,
        r = n && e.nodeType === 1 && t.nodeType === 1 && (~t.sourceIndex || A) - (~e.sourceIndex || A);
      if (r) return r;
      if (n)
        while (n = n.nextSibling)
          if (n === t) return -1;
      return e ? 1 : -1
    }

    function ct(e) {
      return function(t) {
        var n = t.nodeName.toLowerCase();
        return n === "input" && t.type === e
      }
    }

    function ht(e) {
      return function(t) {
        var n = t.nodeName.toLowerCase();
        return (n === "input" || n === "button") && t.type === e
      }
    }

    function pt(e) {
      return ut(function(t) {
        return t = +t, ut(function(n, r) {
          var i, s = e([], n.length, t),
            o = s.length;
          while (o--) n[i = s[o]] && (n[i] = !(r[i] = n[i]))
        })
      })
    }

    function dt(e) {
      return e && typeof e.getElementsByTagName !== L && e
    }

    function vt() {}

    function mt(e) {
      var t = 0,
        n = e.length,
        r = "";
      for (; t < n; t++) r += e[t].value;
      return r
    }

    function gt(e, t, n) {
      var r = t.dir,
        i = n && r === "parentNode",
        s = x++;
      return t.first ? function(t, n, s) {
        while (t = t[r])
          if (t.nodeType === 1 || i) return e(t, n, s)
      } : function(t, n, o) {
        var u, a, f = [S, s];
        if (o) {
          while (t = t[r])
            if (t.nodeType === 1 || i)
              if (e(t, n, o)) return !0
        } else
          while (t = t[r])
            if (t.nodeType === 1 || i) {
              a = t[w] || (t[w] = {});
              if ((u = a[r]) && u[0] === S && u[1] === s) return f[2] = u[2];
              a[r] = f;
              if (f[2] = e(t, n, o)) return !0
            }
      }
    }

    function yt(e) {
      return e.length > 1 ? function(t, n, r) {
        var i = e.length;
        while (i--)
          if (!e[i](t, n, r)) return !1;
        return !0
      } : e[0]
    }

    function bt(e, t, n) {
      var r = 0,
        i = t.length;
      for (; r < i; r++) st(e, t[r], n);
      return n
    }

    function wt(e, t, n, r, i) {
      var s, o = [],
        u = 0,
        a = e.length,
        f = t != null;
      for (; u < a; u++)
        if (s = e[u])
          if (!n || n(s, r, i)) o.push(s), f && t.push(u);
      return o
    }

    function Et(e, t, n, r, i, s) {
      return r && !r[w] && (r = Et(r)), i && !i[w] && (i = Et(i, s)), ut(function(s, o, u, a) {
        var f, l, c, h = [],
          p = [],
          d = o.length,
          v = s || bt(t || "*", u.nodeType ? [u] : u, []),
          m = e && (s || !t) ? wt(v, h, e, u, a) : v,
          g = n ? i || (s ? e : d || r) ? [] : o : m;
        n && n(m, g, u, a);
        if (r) {
          f = wt(g, p), r(f, [], u, a), l = f.length;
          while (l--)
            if (c = f[l]) g[p[l]] = !(m[p[l]] = c)
        }
        if (s) {
          if (i || e) {
            if (i) {
              f = [], l = g.length;
              while (l--)(c = g[l]) && f.push(m[l] = c);
              i(null, g = [], f, a)
            }
            l = g.length;
            while (l--)(c = g[l]) && (f = i ? B.call(s, c) : h[l]) > -1 && (s[f] = !(o[f] = c))
          }
        } else g = wt(g === o ? g.splice(d, g.length) : g), i ? i(null, o, g, a) : P.apply(o, g)
      })
    }

    function St(e) {
      var t, n, i, s = e.length,
        o = r.relative[e[0].type],
        u = o || r.relative[" "],
        a = o ? 1 : 0,
        l = gt(function(e) {
          return e === t
        }, u, !0),
        c = gt(function(e) {
          return B.call(t, e) > -1
        }, u, !0),
        h = [function(e, n, r) {
          return !o && (r || n !== f) || ((t = n).nodeType ? l(e, n, r) : c(e, n, r))
        }];
      for (; a < s; a++)
        if (n = r.relative[e[a].type]) h = [gt(yt(h), n)];
        else {
          n = r.filter[e[a].type].apply(null, e[a].matches);
          if (n[w]) {
            i = ++a;
            for (; i < s; i++)
              if (r.relative[e[i].type]) break;
            return Et(a > 1 && yt(h), a > 1 && mt(e.slice(0, a - 1).concat({
              value: e[a - 2].type === " " ? "*" : ""
            })).replace(z, "$1"), n, a < i && St(e.slice(a, i)), i < s && St(e = e.slice(i)), i < s && mt(e))
          }
          h.push(n)
        }
      return yt(h)
    }

    function xt(e, t) {
      var n = t.length > 0,
        i = e.length > 0,
        s = function(s, o, u, a, l) {
          var c, h, d, v = 0,
            m = "0",
            g = s && [],
            y = [],
            b = f,
            w = s || i && r.find.TAG("*", l),
            E = S += b == null ? 1 : Math.random() || .1,
            x = w.length;
          l && (f = o !== p && o);
          for (; m !== x && (c = w[m]) != null; m++) {
            if (i && c) {
              h = 0;
              while (d = e[h++])
                if (d(c, o, u)) {
                  a.push(c);
                  break
                }
              l && (S = E)
            }
            n && ((c = !d && c) && v--, s && g.push(c))
          }
          v += m;
          if (n && m !== v) {
            h = 0;
            while (d = t[h++]) d(g, y, o, u);
            if (s) {
              if (v > 0)
                while (m--) !g[m] && !y[m] && (y[m] = _.call(a));
              y = wt(y)
            }
            P.apply(a, y), l && !s && y.length > 0 && v + t.length > 1 && st.uniqueSort(a)
          }
          return l && (S = E, f = b), g
        };
      return n ? ut(s) : s
    }
    var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w = "sizzle" + -(new Date),
      E = e.document,
      S = 0,
      x = 0,
      T = ot(),
      N = ot(),
      C = ot(),
      k = function(e, t) {
        return e === t && (c = !0), 0
      },
      L = typeof undefined,
      A = 1 << 31,
      O = {}.hasOwnProperty,
      M = [],
      _ = M.pop,
      D = M.push,
      P = M.push,
      H = M.slice,
      B = M.indexOf || function(e) {
        var t = 0,
          n = this.length;
        for (; t < n; t++)
          if (this[t] === e) return t;
        return -1
      },
      j = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      F = "[\\x20\\t\\r\\n\\f]",
      I = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
      q = I.replace("w", "w#"),
      R = "\\[" + F + "*(" + I + ")(?:" + F + "*([*^$|!~]?=)" + F + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + q + "))|)" + F + "*\\]",
      U = ":(" + I + ")(?:\\((" + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + "((?:\\\\.|[^\\\\()[\\]]|" + R + ")*)|" + ".*" + ")\\)|)",
      z = new RegExp("^" + F + "+|((?:^|[^\\\\])(?:\\\\.)*)" + F + "+$", "g"),
      W = new RegExp("^" + F + "*," + F + "*"),
      X = new RegExp("^" + F + "*([>+~]|" + F + ")" + F + "*"),
      V = new RegExp("=" + F + "*([^\\]'\"]*?)" + F + "*\\]", "g"),
      $ = new RegExp(U),
      J = new RegExp("^" + q + "$"),
      K = {
        ID: new RegExp("^#(" + I + ")"),
        CLASS: new RegExp("^\\.(" + I + ")"),
        TAG: new RegExp("^(" + I.replace("w", "w*") + ")"),
        ATTR: new RegExp("^" + R),
        PSEUDO: new RegExp("^" + U),
        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + F + "*(even|odd|(([+-]|)(\\d*)n|)" + F + "*(?:([+-]|)" + F + "*(\\d+)|))" + F + "*\\)|)", "i"),
        bool: new RegExp("^(?:" + j + ")$", "i"),
        needsContext: new RegExp("^" + F + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + F + "*((?:-\\d)?\\d*)" + F + "*\\)|)(?=[^-]|$)", "i")
      },
      Q = /^(?:input|select|textarea|button)$/i,
      G = /^h\d$/i,
      Y = /^[^{]+\{\s*\[native \w/,
      Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      et = /[+~]/,
      tt = /'|\\/g,
      nt = new RegExp("\\\\([\\da-f]{1,6}" + F + "?|(" + F + ")|.)", "ig"),
      rt = function(e, t, n) {
        var r = "0x" + t - 65536;
        return r !== r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, r & 1023 | 56320)
      };
    try {
      P.apply(M = H.call(E.childNodes), E.childNodes), M[E.childNodes.length].nodeType
    } catch (it) {
      P = {
        apply: M.length ? function(e, t) {
          D.apply(e, H.call(t))
        } : function(e, t) {
          var n = e.length,
            r = 0;
          while (e[n++] = t[r++]);
          e.length = n - 1
        }
      }
    }
    n = st.support = {}, s = st.isXML = function(e) {
      var t = e && (e.ownerDocument || e).documentElement;
      return t ? t.nodeName !== "HTML" : !1
    }, h = st.setDocument = function(e) {
      var t, i = e ? e.ownerDocument || e : E,
        o = i.defaultView;
      if (i === p || i.nodeType !== 9 || !i.documentElement) return p;
      p = i, d = i.documentElement, v = !s(i), o && o !== o.top && (o.addEventListener ? o.addEventListener("unload", function() {
        h()
      }, !1) : o.attachEvent && o.attachEvent("onunload", function() {
        h()
      })), n.attributes = at(function(e) {
        return e.className = "i", !e.getAttribute("className")
      }), n.getElementsByTagName = at(function(e) {
        return e.appendChild(i.createComment("")), !e.getElementsByTagName("*").length
      }), n.getElementsByClassName = Y.test(i.getElementsByClassName) && at(function(e) {
        return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", e.getElementsByClassName("i").length === 2
      }), n.getById = at(function(e) {
        return d.appendChild(e).id = w, !i.getElementsByName || !i.getElementsByName(w).length
      }), n.getById ? (r.find.ID = function(e, t) {
        if (typeof t.getElementById !== L && v) {
          var n = t.getElementById(e);
          return n && n.parentNode ? [n] : []
        }
      }, r.filter.ID = function(e) {
        var t = e.replace(nt, rt);
        return function(e) {
          return e.getAttribute("id") === t
        }
      }) : (delete r.find.ID, r.filter.ID = function(e) {
        var t = e.replace(nt, rt);
        return function(e) {
          var n = typeof e.getAttributeNode !== L && e.getAttributeNode("id");
          return n && n.value === t
        }
      }), r.find.TAG = n.getElementsByTagName ? function(e, t) {
        if (typeof t.getElementsByTagName !== L) return t.getElementsByTagName(e)
      } : function(e, t) {
        var n, r = [],
          i = 0,
          s = t.getElementsByTagName(e);
        if (e === "*") {
          while (n = s[i++]) n.nodeType === 1 && r.push(n);
          return r
        }
        return s
      }, r.find.CLASS = n.getElementsByClassName && function(e, t) {
        if (typeof t.getElementsByClassName !== L && v) return t.getElementsByClassName(e)
      }, g = [], m = [];
      if (n.qsa = Y.test(i.querySelectorAll)) at(function(e) {
        e.innerHTML = "<select msallowclip=''><option selected=''></option></select>", e.querySelectorAll("[msallowclip^='']").length && m.push("[*^$]=" + F + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || m.push("\\[" + F + "*(?:value|" + j + ")"), e.querySelectorAll(":checked").length || m.push(":checked")
      }), at(function(e) {
        var t = i.createElement("input");
        t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && m.push("name" + F + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || m.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), m.push(",.*:")
      });
      return (n.matchesSelector = Y.test(y = d.matches || d.webkitMatchesSelector || d.mozMatchesSelector || d.oMatchesSelector || d.msMatchesSelector)) && at(function(e) {
        n.disconnectedMatch = y.call(e, "div"), y.call(e, "[s!='']:x"), g.push("!=", U)
      }), m = m.length && new RegExp(m.join("|")), g = g.length && new RegExp(g.join("|")), t = Y.test(d.compareDocumentPosition), b = t || Y.test(d.contains) ? function(e, t) {
        var n = e.nodeType === 9 ? e.documentElement : e,
          r = t && t.parentNode;
        return e === r || !!r && r.nodeType === 1 && !!(n.contains ? n.contains(r) : e.compareDocumentPosition && e.compareDocumentPosition(r) & 16)
      } : function(e, t) {
        if (t)
          while (t = t.parentNode)
            if (t === e) return !0;
        return !1
      }, k = t ? function(e, t) {
        if (e === t) return c = !0, 0;
        var r = !e.compareDocumentPosition - !t.compareDocumentPosition;
        return r ? r : (r = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, r & 1 || !n.sortDetached && t.compareDocumentPosition(e) === r ? e === i || e.ownerDocument === E && b(E, e) ? -1 : t === i || t.ownerDocument === E && b(E, t) ? 1 : l ? B.call(l, e) - B.call(l, t) : 0 : r & 4 ? -1 : 1)
      } : function(e, t) {
        if (e === t) return c = !0, 0;
        var n, r = 0,
          s = e.parentNode,
          o = t.parentNode,
          u = [e],
          a = [t];
        if (!s || !o) return e === i ? -1 : t === i ? 1 : s ? -1 : o ? 1 : l ? B.call(l, e) - B.call(l, t) : 0;
        if (s === o) return lt(e, t);
        n = e;
        while (n = n.parentNode) u.unshift(n);
        n = t;
        while (n = n.parentNode) a.unshift(n);
        while (u[r] === a[r]) r++;
        return r ? lt(u[r], a[r]) : u[r] === E ? -1 : a[r] === E ? 1 : 0
      }, i
    }, st.matches = function(e, t) {
      return st(e, null, null, t)
    }, st.matchesSelector = function(e, t) {
      (e.ownerDocument || e) !== p && h(e), t = t.replace(V, "='$1']");
      if (n.matchesSelector && v && (!g || !g.test(t)) && (!m || !m.test(t))) try {
        var r = y.call(e, t);
        if (r || n.disconnectedMatch || e.document && e.document.nodeType !== 11) return r
      } catch (i) {}
      return st(t, p, null, [e]).length > 0
    }, st.contains = function(e, t) {
      return (e.ownerDocument || e) !== p && h(e), b(e, t)
    }, st.attr = function(e, t) {
      (e.ownerDocument || e) !== p && h(e);
      var i = r.attrHandle[t.toLowerCase()],
        s = i && O.call(r.attrHandle, t.toLowerCase()) ? i(e, t, !v) : undefined;
      return s !== undefined ? s : n.attributes || !v ? e.getAttribute(t) : (s = e.getAttributeNode(t)) && s.specified ? s.value : null
    }, st.error = function(e) {
      throw new Error("Syntax error, unrecognized expression: " + e)
    }, st.uniqueSort = function(e) {
      var t, r = [],
        i = 0,
        s = 0;
      c = !n.detectDuplicates, l = !n.sortStable && e.slice(0), e.sort(k);
      if (c) {
        while (t = e[s++]) t === e[s] && (i = r.push(s));
        while (i--) e.splice(r[i], 1)
      }
      return l = null, e
    }, i = st.getText = function(e) {
      var t, n = "",
        r = 0,
        s = e.nodeType;
      if (!s)
        while (t = e[r++]) n += i(t);
      else if (s === 1 || s === 9 || s === 11) {
        if (typeof e.textContent == "string") return e.textContent;
        for (e = e.firstChild; e; e = e.nextSibling) n += i(e)
      } else if (s === 3 || s === 4) return e.nodeValue;
      return n
    }, r = st.selectors = {
      cacheLength: 50,
      createPseudo: ut,
      match: K,
      attrHandle: {},
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: !0
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: !0
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        ATTR: function(e) {
          return e[1] = e[1].replace(nt, rt), e[3] = (e[3] || e[4] || e[5] || "").replace(nt, rt), e[2] === "~=" && (e[3] = " " + e[3] + " "), e.slice(0, 4)
        },
        CHILD: function(e) {
          return e[1] = e[1].toLowerCase(), e[1].slice(0, 3) === "nth" ? (e[3] || st.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === "even" || e[3] === "odd")), e[5] = +(e[7] + e[8] || e[3] === "odd")) : e[3] && st.error(e[0]), e
        },
        PSEUDO: function(e) {
          var t, n = !e[6] && e[2];
          return K.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && $.test(n) && (t = o(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
        }
      },
      filter: {
        TAG: function(e) {
          var t = e.replace(nt, rt).toLowerCase();
          return e === "*" ? function() {
            return !0
          } : function(e) {
            return e.nodeName && e.nodeName.toLowerCase() === t
          }
        },
        CLASS: function(e) {
          var t = T[e + " "];
          return t || (t = new RegExp("(^|" + F + ")" + e + "(" + F + "|$)")) && T(e, function(e) {
            return t.test(typeof e.className == "string" && e.className || typeof e.getAttribute !== L && e.getAttribute("class") || "")
          })
        },
        ATTR: function(e, t, n) {
          return function(r) {
            var i = st.attr(r, e);
            return i == null ? t === "!=" : t ? (i += "", t === "=" ? i === n : t === "!=" ? i !== n : t === "^=" ? n && i.indexOf(n) === 0 : t === "*=" ? n && i.indexOf(n) > -1 : t === "$=" ? n && i.slice(-n.length) === n : t === "~=" ? (" " + i + " ").indexOf(n) > -1 : t === "|=" ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0
          }
        },
        CHILD: function(e, t, n, r, i) {
          var s = e.slice(0, 3) !== "nth",
            o = e.slice(-4) !== "last",
            u = t === "of-type";
          return r === 1 && i === 0 ? function(e) {
            return !!e.parentNode
          } : function(t, n, a) {
            var f, l, c, h, p, d, v = s !== o ? "nextSibling" : "previousSibling",
              m = t.parentNode,
              g = u && t.nodeName.toLowerCase(),
              y = !a && !u;
            if (m) {
              if (s) {
                while (v) {
                  c = t;
                  while (c = c[v])
                    if (u ? c.nodeName.toLowerCase() === g : c.nodeType === 1) return !1;
                  d = v = e === "only" && !d && "nextSibling"
                }
                return !0
              }
              d = [o ? m.firstChild : m.lastChild];
              if (o && y) {
                l = m[w] || (m[w] = {}), f = l[e] || [], p = f[0] === S && f[1], h = f[0] === S && f[2], c = p && m.childNodes[p];
                while (c = ++p && c && c[v] || (h = p = 0) || d.pop())
                  if (c.nodeType === 1 && ++h && c === t) {
                    l[e] = [S, p, h];
                    break
                  }
              } else if (y && (f = (t[w] || (t[w] = {}))[e]) && f[0] === S) h = f[1];
              else
                while (c = ++p && c && c[v] || (h = p = 0) || d.pop())
                  if ((u ? c.nodeName.toLowerCase() === g : c.nodeType === 1) && ++h) {
                    y && ((c[w] || (c[w] = {}))[e] = [S, h]);
                    if (c === t) break
                  }
              return h -= i, h === r || h % r === 0 && h / r >= 0
            }
          }
        },
        PSEUDO: function(e, t) {
          var n, i = r.pseudos[e] || r.setFilters[e.toLowerCase()] || st.error("unsupported pseudo: " + e);
          return i[w] ? i(t) : i.length > 1 ? (n = [e, e, "", t], r.setFilters.hasOwnProperty(e.toLowerCase()) ? ut(function(e, n) {
            var r, s = i(e, t),
              o = s.length;
            while (o--) r = B.call(e, s[o]), e[r] = !(n[r] = s[o])
          }) : function(e) {
            return i(e, 0, n)
          }) : i
        }
      },
      pseudos: {
        not: ut(function(e) {
          var t = [],
            n = [],
            r = u(e.replace(z, "$1"));
          return r[w] ? ut(function(e, t, n, i) {
            var s, o = r(e, null, i, []),
              u = e.length;
            while (u--)
              if (s = o[u]) e[u] = !(t[u] = s)
          }) : function(e, i, s) {
            return t[0] = e, r(t, null, s, n), !n.pop()
          }
        }),
        has: ut(function(e) {
          return function(t) {
            return st(e, t).length > 0
          }
        }),
        contains: ut(function(e) {
          return function(t) {
            return (t.textContent || t.innerText || i(t)).indexOf(e) > -1
          }
        }),
        lang: ut(function(e) {
          return J.test(e || "") || st.error("unsupported lang: " + e), e = e.replace(nt, rt).toLowerCase(),
            function(t) {
              var n;
              do
                if (n = v ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || n.indexOf(e + "-") === 0;
              while ((t = t.parentNode) && t.nodeType === 1);
              return !1
            }
        }),
        target: function(t) {
          var n = e.location && e.location.hash;
          return n && n.slice(1) === t.id
        },
        root: function(e) {
          return e === d
        },
        focus: function(e) {
          return e === p.activeElement && (!p.hasFocus || p.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
        },
        enabled: function(e) {
          return e.disabled === !1
        },
        disabled: function(e) {
          return e.disabled === !0
        },
        checked: function(e) {
          var t = e.nodeName.toLowerCase();
          return t === "input" && !!e.checked || t === "option" && !!e.selected
        },
        selected: function(e) {
          return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
        },
        empty: function(e) {
          for (e = e.firstChild; e; e = e.nextSibling)
            if (e.nodeType < 6) return !1;
          return !0
        },
        parent: function(e) {
          return !r.pseudos.empty(e)
        },
        header: function(e) {
          return G.test(e.nodeName)
        },
        input: function(e) {
          return Q.test(e.nodeName)
        },
        button: function(e) {
          var t = e.nodeName.toLowerCase();
          return t === "input" && e.type === "button" || t === "button"
        },
        text: function(e) {
          var t;
          return e.nodeName.toLowerCase() === "input" && e.type === "text" && ((t = e.getAttribute("type")) == null || t.toLowerCase() === "text")
        },
        first: pt(function() {
          return [0]
        }),
        last: pt(function(e, t) {
          return [t - 1]
        }),
        eq: pt(function(e, t, n) {
          return [n < 0 ? n + t : n]
        }),
        even: pt(function(e, t) {
          var n = 0;
          for (; n < t; n += 2) e.push(n);
          return e
        }),
        odd: pt(function(e, t) {
          var n = 1;
          for (; n < t; n += 2) e.push(n);
          return e
        }),
        lt: pt(function(e, t, n) {
          var r = n < 0 ? n + t : n;
          for (; --r >= 0;) e.push(r);
          return e
        }),
        gt: pt(function(e, t, n) {
          var r = n < 0 ? n + t : n;
          for (; ++r < t;) e.push(r);
          return e
        })
      }
    }, r.pseudos.nth = r.pseudos.eq;
    for (t in {
        radio: !0,
        checkbox: !0,
        file: !0,
        password: !0,
        image: !0
      }) r.pseudos[t] = ct(t);
    for (t in {
        submit: !0,
        reset: !0
      }) r.pseudos[t] = ht(t);
    return vt.prototype = r.filters = r.pseudos, r.setFilters = new vt, o = st.tokenize = function(e, t) {
      var n, i, s, o, u, a, f, l = N[e + " "];
      if (l) return t ? 0 : l.slice(0);
      u = e, a = [], f = r.preFilter;
      while (u) {
        if (!n || (i = W.exec(u))) i && (u = u.slice(i[0].length) || u), a.push(s = []);
        n = !1;
        if (i = X.exec(u)) n = i.shift(), s.push({
          value: n,
          type: i[0].replace(z, " ")
        }), u = u.slice(n.length);
        for (o in r.filter)(i = K[o].exec(u)) && (!f[o] || (i = f[o](i))) && (n = i.shift(), s.push({
          value: n,
          type: o,
          matches: i
        }), u = u.slice(n.length));
        if (!n) break
      }
      return t ? u.length : u ? st.error(e) : N(e, a).slice(0)
    }, u = st.compile = function(e, t) {
      var n, r = [],
        i = [],
        s = C[e + " "];
      if (!s) {
        t || (t = o(e)), n = t.length;
        while (n--) s = St(t[n]), s[w] ? r.push(s) : i.push(s);
        s = C(e, xt(i, r)), s.selector = e
      }
      return s
    }, a = st.select = function(e, t, i, s) {
      var a, f, l, c, h, p = typeof e == "function" && e,
        d = !s && o(e = p.selector || e);
      i = i || [];
      if (d.length === 1) {
        f = d[0] = d[0].slice(0);
        if (f.length > 2 && (l = f[0]).type === "ID" && n.getById && t.nodeType === 9 && v && r.relative[f[1].type]) {
          t = (r.find.ID(l.matches[0].replace(nt, rt), t) || [])[0];
          if (!t) return i;
          p && (t = t.parentNode), e = e.slice(f.shift().value.length)
        }
        a = K.needsContext.test(e) ? 0 : f.length;
        while (a--) {
          l = f[a];
          if (r.relative[c = l.type]) break;
          if (h = r.find[c])
            if (s = h(l.matches[0].replace(nt, rt), et.test(f[0].type) && dt(t.parentNode) || t)) {
              f.splice(a, 1), e = s.length && mt(f);
              if (!e) return P.apply(i, s), i;
              break
            }
        }
      }
      return (p || u(e, d))(s, t, !v, i, et.test(e) && dt(t.parentNode) || t), i
    }, n.sortStable = w.split("").sort(k).join("") === w, n.detectDuplicates = !!c, h(), n.sortDetached = at(function(e) {
      return e.compareDocumentPosition(p.createElement("div")) & 1
    }), at(function(e) {
      return e.innerHTML = "<a href='#'></a>", e.firstChild.getAttribute("href") === "#"
    }) || ft("type|href|height|width", function(e, t, n) {
      if (!n) return e.getAttribute(t, t.toLowerCase() === "type" ? 1 : 2)
    }), (!n.attributes || !at(function(e) {
      return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), e.firstChild.getAttribute("value") === ""
    })) && ft("value", function(e, t, n) {
      if (!n && e.nodeName.toLowerCase() === "input") return e.defaultValue
    }), at(function(e) {
      return e.getAttribute("disabled") == null
    }) || ft(j, function(e, t, n) {
      var r;
      if (!n) return e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
    }), st
  }(window);
  jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains;
  var rneedsContext = jQuery.expr.match.needsContext,
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    risSimple = /^.[^:#\[\.,]*$/;
  jQuery.filter = function(e, t, n) {
    var r = t[0];
    return n && (e = ":not(" + e + ")"), t.length === 1 && r.nodeType === 1 ? jQuery.find.matchesSelector(r, e) ? [r] : [] : jQuery.find.matches(e, jQuery.grep(t, function(e) {
      return e.nodeType === 1
    }))
  }, jQuery.fn.extend({
    find: function(e) {
      var t, n = this.length,
        r = [],
        i = this;
      if (typeof e != "string") return this.pushStack(jQuery(e).filter(function() {
        for (t = 0; t < n; t++)
          if (jQuery.contains(i[t], this)) return !0
      }));
      for (t = 0; t < n; t++) jQuery.find(e, i[t], r);
      return r = this.pushStack(n > 1 ? jQuery.unique(r) : r), r.selector = this.selector ? this.selector + " " + e : e, r
    },
    filter: function(e) {
      return this.pushStack(winnow(this, e || [], !1))
    },
    not: function(e) {
      return this.pushStack(winnow(this, e || [], !0))
    },
    is: function(e) {
      return !!winnow(this, typeof e == "string" && rneedsContext.test(e) ? jQuery(e) : e || [], !1).length
    }
  });
  var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    init = jQuery.fn.init = function(e, t) {
      var n, r;
      if (!e) return this;
      if (typeof e == "string") {
        e[0] === "<" && e[e.length - 1] === ">" && e.length >= 3 ? n = [null, e, null] : n = rquickExpr.exec(e);
        if (n && (n[1] || !t)) {
          if (n[1]) {
            t = t instanceof jQuery ? t[0] : t, jQuery.merge(this, jQuery.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : document, !0));
            if (rsingleTag.test(n[1]) && jQuery.isPlainObject(t))
              for (n in t) jQuery.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
            return this
          }
          return r = document.getElementById(n[2]), r && r.parentNode && (this.length = 1, this[0] = r), this.context = document, this.selector = e, this
        }
        return !t || t.jquery ? (t || rootjQuery).find(e) : this.constructor(t).find(e)
      }
      return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : jQuery.isFunction(e) ? typeof rootjQuery.ready != "undefined" ? rootjQuery.ready(e) : e(jQuery) : (e.selector !== undefined && (this.selector = e.selector, this.context = e.context), jQuery.makeArray(e, this))
    };
  init.prototype = jQuery.fn, rootjQuery = jQuery(document);
  var rparentsprev = /^(?:parents|prev(?:Until|All))/,
    guaranteedUnique = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
  jQuery.extend({
    dir: function(e, t, n) {
      var r = [],
        i = n !== undefined;
      while ((e = e[t]) && e.nodeType !== 9)
        if (e.nodeType === 1) {
          if (i && jQuery(e).is(n)) break;
          r.push(e)
        }
      return r
    },
    sibling: function(e, t) {
      var n = [];
      for (; e; e = e.nextSibling) e.nodeType === 1 && e !== t && n.push(e);
      return n
    }
  }), jQuery.fn.extend({
    has: function(e) {
      var t = jQuery(e, this),
        n = t.length;
      return this.filter(function() {
        var e = 0;
        for (; e < n; e++)
          if (jQuery.contains(this, t[e])) return !0
      })
    },
    closest: function(e, t) {
      var n, r = 0,
        i = this.length,
        s = [],
        o = rneedsContext.test(e) || typeof e != "string" ? jQuery(e, t || this.context) : 0;
      for (; r < i; r++)
        for (n = this[r]; n && n !== t; n = n.parentNode)
          if (n.nodeType < 11 && (o ? o.index(n) > -1 : n.nodeType === 1 && jQuery.find.matchesSelector(n, e))) {
            s.push(n);
            break
          }
      return this.pushStack(s.length > 1 ? jQuery.unique(s) : s)
    },
    index: function(e) {
      return e ? typeof e == "string" ? indexOf.call(jQuery(e), this[0]) : indexOf.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
    },
    add: function(e, t) {
      return this.pushStack(jQuery.unique(jQuery.merge(this.get(), jQuery(e, t))))
    },
    addBack: function(e) {
      return this.add(e == null ? this.prevObject : this.prevObject.filter(e))
    }
  }), jQuery.each({
    parent: function(e) {
      var t = e.parentNode;
      return t && t.nodeType !== 11 ? t : null
    },
    parents: function(e) {
      return jQuery.dir(e, "parentNode")
    },
    parentsUntil: function(e, t, n) {
      return jQuery.dir(e, "parentNode", n)
    },
    next: function(e) {
      return sibling(e, "nextSibling")
    },
    prev: function(e) {
      return sibling(e, "previousSibling")
    },
    nextAll: function(e) {
      return jQuery.dir(e, "nextSibling")
    },
    prevAll: function(e) {
      return jQuery.dir(e, "previousSibling")
    },
    nextUntil: function(e, t, n) {
      return jQuery.dir(e, "nextSibling", n)
    },
    prevUntil: function(e, t, n) {
      return jQuery.dir(e, "previousSibling", n)
    },
    siblings: function(e) {
      return jQuery.sibling((e.parentNode || {}).firstChild, e)
    },
    children: function(e) {
      return jQuery.sibling(e.firstChild)
    },
    contents: function(e) {
      return e.contentDocument || jQuery.merge([], e.childNodes)
    }
  }, function(e, t) {
    jQuery.fn[e] = function(n, r) {
      var i = jQuery.map(this, t, n);
      return e.slice(-5) !== "Until" && (r = n), r && typeof r == "string" && (i = jQuery.filter(r, i)), this.length > 1 && (guaranteedUnique[e] || jQuery.unique(i), rparentsprev.test(e) && i.reverse()), this.pushStack(i)
    }
  });
  var rnotwhite = /\S+/g,
    optionsCache = {};
  jQuery.Callbacks = function(e) {
    e = typeof e == "string" ? optionsCache[e] || createOptions(e) : jQuery.extend({}, e);
    var t, n, r, i, s, o, u = [],
      a = !e.once && [],
      f = function(c) {
        t = e.memory && c, n = !0, o = i || 0, i = 0, s = u.length, r = !0;
        for (; u && o < s; o++)
          if (u[o].apply(c[0], c[1]) === !1 && e.stopOnFalse) {
            t = !1;
            break
          }
        r = !1, u && (a ? a.length && f(a.shift()) : t ? u = [] : l.disable())
      },
      l = {
        add: function() {
          if (u) {
            var n = u.length;
            (function o(t) {
              jQuery.each(t, function(t, n) {
                var r = jQuery.type(n);
                r === "function" ? (!e.unique || !l.has(n)) && u.push(n) : n && n.length && r !== "string" && o(n)
              })
            })(arguments), r ? s = u.length : t && (i = n, f(t))
          }
          return this
        },
        remove: function() {
          return u && jQuery.each(arguments, function(e, t) {
            var n;
            while ((n = jQuery.inArray(t, u, n)) > -1) u.splice(n, 1), r && (n <= s && s--, n <= o && o--)
          }), this
        },
        has: function(e) {
          return e ? jQuery.inArray(e, u) > -1 : !!u && !!u.length
        },
        empty: function() {
          return u = [], s = 0, this
        },
        disable: function() {
          return u = a = t = undefined, this
        },
        disabled: function() {
          return !u
        },
        lock: function() {
          return a = undefined, t || l.disable(), this
        },
        locked: function() {
          return !a
        },
        fireWith: function(e, t) {
          return u && (!n || a) && (t = t || [], t = [e, t.slice ? t.slice() : t], r ? a.push(t) : f(t)), this
        },
        fire: function() {
          return l.fireWith(this, arguments), this
        },
        fired: function() {
          return !!n
        }
      };
    return l
  }, jQuery.extend({
    Deferred: function(e) {
      var t = [
          ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
          ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
          ["notify", "progress", jQuery.Callbacks("memory")]
        ],
        n = "pending",
        r = {
          state: function() {
            return n
          },
          always: function() {
            return i.done(arguments).fail(arguments), this
          },
          then: function() {
            var e = arguments;
            return jQuery.Deferred(function(n) {
              jQuery.each(t, function(t, s) {
                var o = jQuery.isFunction(e[t]) && e[t];
                i[s[1]](function() {
                  var e = o && o.apply(this, arguments);
                  e && jQuery.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[s[0] + "With"](this === r ? n.promise() : this, o ? [e] : arguments)
                })
              }), e = null
            }).promise()
          },
          promise: function(e) {
            return e != null ? jQuery.extend(e, r) : r
          }
        },
        i = {};
      return r.pipe = r.then, jQuery.each(t, function(e, s) {
        var o = s[2],
          u = s[3];
        r[s[1]] = o.add, u && o.add(function() {
          n = u
        }, t[e ^ 1][2].disable, t[2][2].lock), i[s[0]] = function() {
          return i[s[0] + "With"](this === i ? r : this, arguments), this
        }, i[s[0] + "With"] = o.fireWith
      }), r.promise(i), e && e.call(i, i), i
    },
    when: function(e) {
      var t = 0,
        n = slice.call(arguments),
        r = n.length,
        i = r !== 1 || e && jQuery.isFunction(e.promise) ? r : 0,
        s = i === 1 ? e : jQuery.Deferred(),
        o = function(e, t, n) {
          return function(r) {
            t[e] = this, n[e] = arguments.length > 1 ? slice.call(arguments) : r, n === u ? s.notifyWith(t, n) : --i || s.resolveWith(t, n)
          }
        },
        u, a, f;
      if (r > 1) {
        u = new Array(r), a = new Array(r), f = new Array(r);
        for (; t < r; t++) n[t] && jQuery.isFunction(n[t].promise) ? n[t].promise().done(o(t, f, n)).fail(s.reject).progress(o(t, a, u)) : --i
      }
      return i || s.resolveWith(f, n), s.promise()
    }
  });
  var readyList;
  jQuery.fn.ready = function(e) {
    return jQuery.ready.promise().done(e), this
  }, jQuery.extend({
    isReady: !1,
    readyWait: 1,
    holdReady: function(e) {
      e ? jQuery.readyWait++ : jQuery.ready(!0)
    },
    ready: function(e) {
      if (e === !0 ? --jQuery.readyWait : jQuery.isReady) return;
      jQuery.isReady = !0;
      if (e !== !0 && --jQuery.readyWait > 0) return;
      readyList.resolveWith(document, [jQuery]), jQuery.fn.triggerHandler && (jQuery(document).triggerHandler("ready"), jQuery(document).off("ready"))
    }
  }), jQuery.ready.promise = function(e) {
    return readyList || (readyList = jQuery.Deferred(), document.readyState === "complete" ? setTimeout(jQuery.ready) : (document.addEventListener("DOMContentLoaded", completed, !1), window.addEventListener("load", completed, !1))), readyList.promise(e)
  }, jQuery.ready.promise();
  var access = jQuery.access = function(e, t, n, r, i, s, o) {
    var u = 0,
      a = e.length,
      f = n == null;
    if (jQuery.type(n) === "object") {
      i = !0;
      for (u in n) jQuery.access(e, t, u, n[u], !0, s, o)
    } else if (r !== undefined) {
      i = !0, jQuery.isFunction(r) || (o = !0), f && (o ? (t.call(e, r), t = null) : (f = t, t = function(e, t, n) {
        return f.call(jQuery(e), n)
      }));
      if (t)
        for (; u < a; u++) t(e[u], n, o ? r : r.call(e[u], u, t(e[u], n)))
    }
    return i ? e : f ? t.call(e) : a ? t(e[0], n) : s
  };
  jQuery.acceptData = function(e) {
    return e.nodeType === 1 || e.nodeType === 9 || !+e.nodeType
  }, Data.uid = 1, Data.accepts = jQuery.acceptData, Data.prototype = {
    key: function(e) {
      if (!Data.accepts(e)) return 0;
      var t = {},
        n = e[this.expando];
      if (!n) {
        n = Data.uid++;
        try {
          t[this.expando] = {
            value: n
          }, Object.defineProperties(e, t)
        } catch (r) {
          t[this.expando] = n, jQuery.extend(e, t)
        }
      }
      return this.cache[n] || (this.cache[n] = {}), n
    },
    set: function(e, t, n) {
      var r, i = this.key(e),
        s = this.cache[i];
      if (typeof t == "string") s[t] = n;
      else if (jQuery.isEmptyObject(s)) jQuery.extend(this.cache[i], t);
      else
        for (r in t) s[r] = t[r];
      return s
    },
    get: function(e, t) {
      var n = this.cache[this.key(e)];
      return t === undefined ? n : n[t]
    },
    access: function(e, t, n) {
      var r;
      return t === undefined || t && typeof t == "string" && n === undefined ? (r = this.get(e, t), r !== undefined ? r : this.get(e, jQuery.camelCase(t))) : (this.set(e, t, n), n !== undefined ? n : t)
    },
    remove: function(e, t) {
      var n, r, i, s = this.key(e),
        o = this.cache[s];
      if (t === undefined) this.cache[s] = {};
      else {
        jQuery.isArray(t) ? r = t.concat(t.map(jQuery.camelCase)) : (i = jQuery.camelCase(t), t in o ? r = [t, i] : (r = i, r = r in o ? [r] : r.match(rnotwhite) || [])), n = r.length;
        while (n--) delete o[r[n]]
      }
    },
    hasData: function(e) {
      return !jQuery.isEmptyObject(this.cache[e[this.expando]] || {})
    },
    discard: function(e) {
      e[this.expando] && delete this.cache[e[this.expando]]
    }
  };
  var data_priv = new Data,
    data_user = new Data,
    rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    rmultiDash = /([A-Z])/g;
  jQuery.extend({
    hasData: function(e) {
      return data_user.hasData(e) || data_priv.hasData(e)
    },
    data: function(e, t, n) {
      return data_user.access(e, t, n)
    },
    removeData: function(e, t) {
      data_user.remove(e, t)
    },
    _data: function(e, t, n) {
      return data_priv.access(e, t, n)
    },
    _removeData: function(e, t) {
      data_priv.remove(e, t)
    }
  }), jQuery.fn.extend({
    data: function(e, t) {
      var n, r, i, s = this[0],
        o = s && s.attributes;
      if (e === undefined) {
        if (this.length) {
          i = data_user.get(s);
          if (s.nodeType === 1 && !data_priv.get(s, "hasDataAttrs")) {
            n = o.length;
            while (n--) o[n] && (r = o[n].name, r.indexOf("data-") === 0 && (r = jQuery.camelCase(r.slice(5)), dataAttr(s, r, i[r])));
            data_priv.set(s, "hasDataAttrs", !0)
          }
        }
        return i
      }
      return typeof e == "object" ? this.each(function() {
        data_user.set(this, e)
      }) : access(this, function(t) {
        var n, r = jQuery.camelCase(e);
        if (s && t === undefined) {
          n = data_user.get(s, e);
          if (n !== undefined) return n;
          n = data_user.get(s, r);
          if (n !== undefined) return n;
          n = dataAttr(s, r, undefined);
          if (n !== undefined) return n;
          return
        }
        this.each(function() {
          var n = data_user.get(this, r);
          data_user.set(this, r, t), e.indexOf("-") !== -1 && n !== undefined && data_user.set(this, e, t)
        })
      }, null, t, arguments.length > 1, null, !0)
    },
    removeData: function(e) {
      return this.each(function() {
        data_user.remove(this, e)
      })
    }
  }), jQuery.extend({
    queue: function(e, t, n) {
      var r;
      if (e) return t = (t || "fx") + "queue", r = data_priv.get(e, t), n && (!r || jQuery.isArray(n) ? r = data_priv.access(e, t, jQuery.makeArray(n)) : r.push(n)), r || []
    },
    dequeue: function(e, t) {
      t = t || "fx";
      var n = jQuery.queue(e, t),
        r = n.length,
        i = n.shift(),
        s = jQuery._queueHooks(e, t),
        o = function() {
          jQuery.dequeue(e, t)
        };
      i === "inprogress" && (i = n.shift(), r--), i && (t === "fx" && n.unshift("inprogress"), delete s.stop, i.call(e, o, s)), !r && s && s.empty.fire()
    },
    _queueHooks: function(e, t) {
      var n = t + "queueHooks";
      return data_priv.get(e, n) || data_priv.access(e, n, {
        empty: jQuery.Callbacks("once memory").add(function() {
          data_priv.remove(e, [t + "queue", n])
        })
      })
    }
  }), jQuery.fn.extend({
    queue: function(e, t) {
      var n = 2;
      return typeof e != "string" && (t = e, e = "fx", n--), arguments.length < n ? jQuery.queue(this[0], e) : t === undefined ? this : this.each(function() {
        var n = jQuery.queue(this, e, t);
        jQuery._queueHooks(this, e), e === "fx" && n[0] !== "inprogress" && jQuery.dequeue(this, e)
      })
    },
    dequeue: function(e) {
      return this.each(function() {
        jQuery.dequeue(this, e)
      })
    },
    clearQueue: function(e) {
      return this.queue(e || "fx", [])
    },
    promise: function(e, t) {
      var n, r = 1,
        i = jQuery.Deferred(),
        s = this,
        o = this.length,
        u = function() {
          --r || i.resolveWith(s, [s])
        };
      typeof e != "string" && (t = e, e = undefined), e = e || "fx";
      while (o--) n = data_priv.get(s[o], e + "queueHooks"), n && n.empty && (r++, n.empty.add(u));
      return u(), i.promise(t)
    }
  });
  var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    cssExpand = ["Top", "Right", "Bottom", "Left"],
    isHidden = function(e, t) {
      return e = t || e, jQuery.css(e, "display") === "none" || !jQuery.contains(e.ownerDocument, e)
    },
    rcheckableType = /^(?:checkbox|radio)$/i;
  (function() {
    var e = document.createDocumentFragment(),
      t = e.appendChild(document.createElement("div")),
      n = document.createElement("input");
    n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), t.appendChild(n), support.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, t.innerHTML = "<textarea>x</textarea>", support.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
  })();
  var strundefined = typeof undefined;
  support.focusinBubbles = "onfocusin" in window;
  var rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
  jQuery.event = {
    global: {},
    add: function(e, t, n, r, i) {
      var s, o, u, a, f, l, c, h, p, d, v, m = data_priv.get(e);
      if (!m) return;
      n.handler && (s = n, n = s.handler, i = s.selector), n.guid || (n.guid = jQuery.guid++), (a = m.events) || (a = m.events = {}), (o = m.handle) || (o = m.handle = function(t) {
        return typeof jQuery !== strundefined && jQuery.event.triggered !== t.type ? jQuery.event.dispatch.apply(e, arguments) : undefined
      }), t = (t || "").match(rnotwhite) || [""], f = t.length;
      while (f--) {
        u = rtypenamespace.exec(t[f]) || [], p = v = u[1], d = (u[2] || "").split(".").sort();
        if (!p) continue;
        c = jQuery.event.special[p] || {}, p = (i ? c.delegateType : c.bindType) || p, c = jQuery.event.special[p] || {}, l = jQuery.extend({
          type: p,
          origType: v,
          data: r,
          handler: n,
          guid: n.guid,
          selector: i,
          needsContext: i && jQuery.expr.match.needsContext.test(i),
          namespace: d.join(".")
        }, s), (h = a[p]) || (h = a[p] = [], h.delegateCount = 0, (!c.setup || c.setup.call(e, r, d, o) === !1) && e.addEventListener && e.addEventListener(p, o, !1)), c.add && (c.add.call(e, l), l.handler.guid || (l.handler.guid = n.guid)), i ? h.splice(h.delegateCount++, 0, l) : h.push(l), jQuery.event.global[p] = !0
      }
    },
    remove: function(e, t, n, r, i) {
      var s, o, u, a, f, l, c, h, p, d, v, m = data_priv.hasData(e) && data_priv.get(e);
      if (!m || !(a = m.events)) return;
      t = (t || "").match(rnotwhite) || [""], f = t.length;
      while (f--) {
        u = rtypenamespace.exec(t[f]) || [], p = v = u[1], d = (u[2] || "").split(".").sort();
        if (!p) {
          for (p in a) jQuery.event.remove(e, p + t[f], n, r, !0);
          continue
        }
        c = jQuery.event.special[p] || {}, p = (r ? c.delegateType : c.bindType) || p, h = a[p] || [], u = u[2] && new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)"), o = s = h.length;
        while (s--) l = h[s], (i || v === l.origType) && (!n || n.guid === l.guid) && (!u || u.test(l.namespace)) && (!r || r === l.selector || r === "**" && l.selector) && (h.splice(s, 1), l.selector && h.delegateCount--, c.remove && c.remove.call(e, l));
        o && !h.length && ((!c.teardown || c.teardown.call(e, d, m.handle) === !1) && jQuery.removeEvent(e, p, m.handle), delete a[p])
      }
      jQuery.isEmptyObject(a) && (delete m.handle, data_priv.remove(e, "events"))
    },
    trigger: function(e, t, n, r) {
      var i, s, o, u, a, f, l, c = [n || document],
        h = hasOwn.call(e, "type") ? e.type : e,
        p = hasOwn.call(e, "namespace") ? e.namespace.split(".") : [];
      s = o = n = n || document;
      if (n.nodeType === 3 || n.nodeType === 8) return;
      if (rfocusMorph.test(h + jQuery.event.triggered)) return;
      h.indexOf(".") >= 0 && (p = h.split("."), h = p.shift(), p.sort()), a = h.indexOf(":") < 0 && "on" + h, e = e[jQuery.expando] ? e : new jQuery.Event(h, typeof e == "object" && e), e.isTrigger = r ? 2 : 3, e.namespace = p.join("."), e.namespace_re = e.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = undefined, e.target || (e.target = n), t = t == null ? [e] : jQuery.makeArray(t, [e]), l = jQuery.event.special[h] || {};
      if (!r && l.trigger && l.trigger.apply(n, t) === !1) return;
      if (!r && !l.noBubble && !jQuery.isWindow(n)) {
        u = l.delegateType || h, rfocusMorph.test(u + h) || (s = s.parentNode);
        for (; s; s = s.parentNode) c.push(s), o = s;
        o === (n.ownerDocument || document) && c.push(o.defaultView || o.parentWindow || window)
      }
      i = 0;
      while ((s = c[i++]) && !e.isPropagationStopped()) e.type = i > 1 ? u : l.bindType || h, f = (data_priv.get(s, "events") || {})[e.type] && data_priv.get(s, "handle"), f && f.apply(s, t), f = a && s[a], f && f.apply && jQuery.acceptData(s) && (e.result = f.apply(s, t), e.result === !1 && e.preventDefault());
      return e.type = h, !r && !e.isDefaultPrevented() && (!l._default || l._default.apply(c.pop(), t) === !1) && jQuery.acceptData(n) && a && jQuery.isFunction(n[h]) && !jQuery.isWindow(n) && (o = n[a], o && (n[a] = null), jQuery.event.triggered = h, n[h](), jQuery.event.triggered = undefined, o && (n[a] = o)), e.result
    },
    dispatch: function(e) {
      e = jQuery.event.fix(e);
      var t, n, r, i, s, o = [],
        u = slice.call(arguments),
        a = (data_priv.get(this, "events") || {})[e.type] || [],
        f = jQuery.event.special[e.type] || {};
      u[0] = e, e.delegateTarget = this;
      if (f.preDispatch && f.preDispatch.call(this, e) === !1) return;
      o = jQuery.event.handlers.call(this, e, a), t = 0;
      while ((i = o[t++]) && !e.isPropagationStopped()) {
        e.currentTarget = i.elem, n = 0;
        while ((s = i.handlers[n++]) && !e.isImmediatePropagationStopped())
          if (!e.namespace_re || e.namespace_re.test(s.namespace)) e.handleObj = s, e.data = s.data, r = ((jQuery.event.special[s.origType] || {}).handle || s.handler).apply(i.elem, u), r !== undefined && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation())
      }
      return f.postDispatch && f.postDispatch.call(this, e), e.result
    },
    handlers: function(e, t) {
      var n, r, i, s, o = [],
        u = t.delegateCount,
        a = e.target;
      if (u && a.nodeType && (!e.button || e.type !== "click"))
        for (; a !== this; a = a.parentNode || this)
          if (a.disabled !== !0 || e.type !== "click") {
            r = [];
            for (n = 0; n < u; n++) s = t[n], i = s.selector + " ", r[i] === undefined && (r[i] = s.needsContext ? jQuery(i, this).index(a) >= 0 : jQuery.find(i, this, null, [a]).length), r[i] && r.push(s);
            r.length && o.push({
              elem: a,
              handlers: r
            })
          }
      return u < t.length && o.push({
        elem: this,
        handlers: t.slice(u)
      }), o
    },
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function(e, t) {
        return e.which == null && (e.which = t.charCode != null ? t.charCode : t.keyCode), e
      }
    },
    mouseHooks: {
      props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function(e, t) {
        var n, r, i, s = t.button;
        return e.pageX == null && t.clientX != null && (n = e.target.ownerDocument || document, r = n.documentElement, i = n.body, e.pageX = t.clientX + (r && r.scrollLeft || i && i.scrollLeft || 0) - (r && r.clientLeft || i && i.clientLeft || 0), e.pageY = t.clientY + (r && r.scrollTop || i && i.scrollTop || 0) - (r && r.clientTop || i && i.clientTop || 0)), !e.which && s !== undefined && (e.which = s & 1 ? 1 : s & 2 ? 3 : s & 4 ? 2 : 0), e
      }
    },
    fix: function(e) {
      if (e[jQuery.expando]) return e;
      var t, n, r, i = e.type,
        s = e,
        o = this.fixHooks[i];
      o || (this.fixHooks[i] = o = rmouseEvent.test(i) ? this.mouseHooks : rkeyEvent.test(i) ? this.keyHooks : {}), r = o.props ? this.props.concat(o.props) : this.props, e = new jQuery.Event(s), t = r.length;
      while (t--) n = r[t], e[n] = s[n];
      return e.target || (e.target = document), e.target.nodeType === 3 && (e.target = e.target.parentNode), o.filter ? o.filter(e, s) : e
    },
    special: {
      load: {
        noBubble: !0
      },
      focus: {
        trigger: function() {
          if (this !== safeActiveElement() && this.focus) return this.focus(), !1
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function() {
          if (this === safeActiveElement() && this.blur) return this.blur(), !1
        },
        delegateType: "focusout"
      },
      click: {
        trigger: function() {
          if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) return this.click(), !1
        },
        _default: function(e) {
          return jQuery.nodeName(e.target, "a")
        }
      },
      beforeunload: {
        postDispatch: function(e) {
          e.result !== undefined && e.originalEvent && (e.originalEvent.returnValue = e.result)
        }
      }
    },
    simulate: function(e, t, n, r) {
      var i = jQuery.extend(new jQuery.Event, n, {
        type: e,
        isSimulated: !0,
        originalEvent: {}
      });
      r ? jQuery.event.trigger(i, null, t) : jQuery.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
    }
  }, jQuery.removeEvent = function(e, t, n) {
    e.removeEventListener && e.removeEventListener(t, n, !1)
  }, jQuery.Event = function(e, t) {
    if (!(this instanceof jQuery.Event)) return new jQuery.Event(e, t);
    e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && e.returnValue === !1 ? returnTrue : returnFalse) : this.type = e, t && jQuery.extend(this, t), this.timeStamp = e && e.timeStamp || jQuery.now(), this[jQuery.expando] = !0
  }, jQuery.Event.prototype = {
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    preventDefault: function() {
      var e = this.originalEvent;
      this.isDefaultPrevented = returnTrue, e && e.preventDefault && e.preventDefault()
    },
    stopPropagation: function() {
      var e = this.originalEvent;
      this.isPropagationStopped = returnTrue, e && e.stopPropagation && e.stopPropagation()
    },
    stopImmediatePropagation: function() {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = returnTrue, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
    }
  }, jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
  }, function(e, t) {
    jQuery.event.special[e] = {
      delegateType: t,
      bindType: t,
      handle: function(e) {
        var n, r = this,
          i = e.relatedTarget,
          s = e.handleObj;
        if (!i || i !== r && !jQuery.contains(r, i)) e.type = s.origType, n = s.handler.apply(this, arguments), e.type = t;
        return n
      }
    }
  }), support.focusinBubbles || jQuery.each({
    focus: "focusin",
    blur: "focusout"
  }, function(e, t) {
    var n = function(e) {
      jQuery.event.simulate(t, e.target, jQuery.event.fix(e), !0)
    };
    jQuery.event.special[t] = {
      setup: function() {
        var r = this.ownerDocument || this,
          i = data_priv.access(r, t);
        i || r.addEventListener(e, n, !0), data_priv.access(r, t, (i || 0) + 1)
      },
      teardown: function() {
        var r = this.ownerDocument || this,
          i = data_priv.access(r, t) - 1;
        i ? data_priv.access(r, t, i) : (r.removeEventListener(e, n, !0), data_priv.remove(r, t))
      }
    }
  }), jQuery.fn.extend({
    on: function(e, t, n, r, i) {
      var s, o;
      if (typeof e == "object") {
        typeof t != "string" && (n = n || t, t = undefined);
        for (o in e) this.on(o, t, n, e[o], i);
        return this
      }
      n == null && r == null ? (r = t, n = t = undefined) : r == null && (typeof t == "string" ? (r = n, n = undefined) : (r = n, n = t, t = undefined));
      if (r === !1) r = returnFalse;
      else if (!r) return this;
      return i === 1 && (s = r, r = function(e) {
        return jQuery().off(e), s.apply(this, arguments)
      }, r.guid = s.guid || (s.guid = jQuery.guid++)), this.each(function() {
        jQuery.event.add(this, e, r, n, t)
      })
    },
    one: function(e, t, n, r) {
      return this.on(e, t, n, r, 1)
    },
    off: function(e, t, n) {
      var r, i;
      if (e && e.preventDefault && e.handleObj) return r = e.handleObj, jQuery(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
      if (typeof e == "object") {
        for (i in e) this.off(i, t, e[i]);
        return this
      }
      if (t === !1 || typeof t == "function") n = t, t = undefined;
      return n === !1 && (n = returnFalse), this.each(function() {
        jQuery.event.remove(this, e, n, t)
      })
    },
    trigger: function(e, t) {
      return this.each(function() {
        jQuery.event.trigger(e, t, this)
      })
    },
    triggerHandler: function(e, t) {
      var n = this[0];
      if (n) return jQuery.event.trigger(e, t, n, !0)
    }
  });
  var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    rtagName = /<([\w:]+)/,
    rhtml = /<|&#?\w+;/,
    rnoInnerhtml = /<(?:script|style|link)/i,
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptType = /^$|\/(?:java|ecma)script/i,
    rscriptTypeMasked = /^true\/(.*)/,
    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    wrapMap = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""]
    };
  wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td, jQuery.extend({
    clone: function(e, t, n) {
      var r, i, s, o, u = e.cloneNode(!0),
        a = jQuery.contains(e.ownerDocument, e);
      if (!support.noCloneChecked && (e.nodeType === 1 || e.nodeType === 11) && !jQuery.isXMLDoc(e)) {
        o = getAll(u), s = getAll(e);
        for (r = 0, i = s.length; r < i; r++) fixInput(s[r], o[r])
      }
      if (t)
        if (n) {
          s = s || getAll(e), o = o || getAll(u);
          for (r = 0, i = s.length; r < i; r++) cloneCopyEvent(s[r], o[r])
        } else cloneCopyEvent(e, u);
      return o = getAll(u, "script"), o.length > 0 && setGlobalEval(o, !a && getAll(e, "script")), u
    },
    buildFragment: function(e, t, n, r) {
      var i, s, o, u, a, f, l = t.createDocumentFragment(),
        c = [],
        h = 0,
        p = e.length;
      for (; h < p; h++) {
        i = e[h];
        if (i || i === 0)
          if (jQuery.type(i) === "object") jQuery.merge(c, i.nodeType ? [i] : i);
          else if (!rhtml.test(i)) c.push(t.createTextNode(i));
        else {
          s = s || l.appendChild(t.createElement("div")), o = (rtagName.exec(i) || ["", ""])[1].toLowerCase(), u = wrapMap[o] || wrapMap._default, s.innerHTML = u[1] + i.replace(rxhtmlTag, "<$1></$2>") + u[2], f = u[0];
          while (f--) s = s.lastChild;
          jQuery.merge(c, s.childNodes), s = l.firstChild, s.textContent = ""
        }
      }
      l.textContent = "", h = 0;
      while (i = c[h++]) {
        if (r && jQuery.inArray(i, r) !== -1) continue;
        a = jQuery.contains(i.ownerDocument, i), s = getAll(l.appendChild(i), "script"), a && setGlobalEval(s);
        if (n) {
          f = 0;
          while (i = s[f++]) rscriptType.test(i.type || "") && n.push(i)
        }
      }
      return l
    },
    cleanData: function(e) {
      var t, n, r, i, s = jQuery.event.special,
        o = 0;
      for (;
        (n = e[o]) !== undefined; o++) {
        if (jQuery.acceptData(n)) {
          i = n[data_priv.expando];
          if (i && (t = data_priv.cache[i])) {
            if (t.events)
              for (r in t.events) s[r] ? jQuery.event.remove(n, r) : jQuery.removeEvent(n, r, t.handle);
            data_priv.cache[i] && delete data_priv.cache[i]
          }
        }
        delete data_user.cache[n[data_user.expando]]
      }
    }
  }), jQuery.fn.extend({
    text: function(e) {
      return access(this, function(e) {
        return e === undefined ? jQuery.text(this) : this.empty().each(function() {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) this.textContent = e
        })
      }, null, e, arguments.length)
    },
    append: function() {
      return this.domManip(arguments, function(e) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var t = manipulationTarget(this, e);
          t.appendChild(e)
        }
      })
    },
    prepend: function() {
      return this.domManip(arguments, function(e) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var t = manipulationTarget(this, e);
          t.insertBefore(e, t.firstChild)
        }
      })
    },
    before: function() {
      return this.domManip(arguments, function(e) {
        this.parentNode && this.parentNode.insertBefore(e, this)
      })
    },
    after: function() {
      return this.domManip(arguments, function(e) {
        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
      })
    },
    remove: function(e, t) {
      var n, r = e ? jQuery.filter(e, this) : this,
        i = 0;
      for (;
        (n = r[i]) != null; i++) !t && n.nodeType === 1 && jQuery.cleanData(getAll(n)), n.parentNode && (t && jQuery.contains(n.ownerDocument, n) && setGlobalEval(getAll(n, "script")), n.parentNode.removeChild(n));
      return this
    },
    empty: function() {
      var e, t = 0;
      for (;
        (e = this[t]) != null; t++) e.nodeType === 1 && (jQuery.cleanData(getAll(e, !1)), e.textContent = "");
      return this
    },
    clone: function(e, t) {
      return e = e == null ? !1 : e, t = t == null ? e : t, this.map(function() {
        return jQuery.clone(this, e, t)
      })
    },
    html: function(e) {
      return access(this, function(e) {
        var t = this[0] || {},
          n = 0,
          r = this.length;
        if (e === undefined && t.nodeType === 1) return t.innerHTML;
        if (typeof e == "string" && !rnoInnerhtml.test(e) && !wrapMap[(rtagName.exec(e) || ["", ""])[1].toLowerCase()]) {
          e = e.replace(rxhtmlTag, "<$1></$2>");
          try {
            for (; n < r; n++) t = this[n] || {}, t.nodeType === 1 && (jQuery.cleanData(getAll(t, !1)), t.innerHTML = e);
            t = 0
          } catch (i) {}
        }
        t && this.empty().append(e)
      }, null, e, arguments.length)
    },
    replaceWith: function() {
      var e = arguments[0];
      return this.domManip(arguments, function(t) {
        e = this.parentNode, jQuery.cleanData(getAll(this)), e && e.replaceChild(t, this)
      }), e && (e.length || e.nodeType) ? this : this.remove()
    },
    detach: function(e) {
      return this.remove(e, !0)
    },
    domManip: function(e, t) {
      e = concat.apply([], e);
      var n, r, i, s, o, u, a = 0,
        f = this.length,
        l = this,
        c = f - 1,
        h = e[0],
        p = jQuery.isFunction(h);
      if (p || f > 1 && typeof h == "string" && !support.checkClone && rchecked.test(h)) return this.each(function(n) {
        var r = l.eq(n);
        p && (e[0] = h.call(this, n, r.html())), r.domManip(e, t)
      });
      if (f) {
        n = jQuery.buildFragment(e, this[0].ownerDocument, !1, this), r = n.firstChild, n.childNodes.length === 1 && (n = r);
        if (r) {
          i = jQuery.map(getAll(n, "script"), disableScript), s = i.length;
          for (; a < f; a++) o = n, a !== c && (o = jQuery.clone(o, !0, !0), s && jQuery.merge(i, getAll(o, "script"))), t.call(this[a], o, a);
          if (s) {
            u = i[i.length - 1].ownerDocument, jQuery.map(i, restoreScript);
            for (a = 0; a < s; a++) o = i[a], rscriptType.test(o.type || "") && !data_priv.access(o, "globalEval") && jQuery.contains(u, o) && (o.src ? jQuery._evalUrl && jQuery._evalUrl(o.src) : jQuery.globalEval(o.textContent.replace(rcleanScript, "")))
          }
        }
      }
      return this
    }
  }), jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function(e, t) {
    jQuery.fn[e] = function(e) {
      var n, r = [],
        i = jQuery(e),
        s = i.length - 1,
        o = 0;
      for (; o <= s; o++) n = o === s ? this : this.clone(!0), jQuery(i[o])[t](n), push.apply(r, n.get());
      return this.pushStack(r)
    }
  });
  var iframe, elemdisplay = {},
    rmargin = /^margin/,
    rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i"),
    getStyles = function(e) {
      return e.ownerDocument.defaultView.getComputedStyle(e, null)
    };
  (function() {
    function s() {
      i.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", i.innerHTML = "", n.appendChild(r);
      var s = window.getComputedStyle(i, null);
      e = s.top !== "1%", t = s.width === "4px", n.removeChild(r)
    }
    var e, t, n = document.documentElement,
      r = document.createElement("div"),
      i = document.createElement("div");
    if (!i.style) return;
    i.style.backgroundClip = "content-box", i.cloneNode(!0).style.backgroundClip = "", support.clearCloneStyle = i.style.backgroundClip === "content-box", r.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", r.appendChild(i), window.getComputedStyle && jQuery.extend(support, {
      pixelPosition: function() {
        return s(), e
      },
      boxSizingReliable: function() {
        return t == null && s(), t
      },
      reliableMarginRight: function() {
        var e, t = i.appendChild(document.createElement("div"));
        return t.style.cssText = i.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", t.style.marginRight = t.style.width = "0", i.style.width = "1px", n.appendChild(r), e = !parseFloat(window.getComputedStyle(t, null).marginRight), n.removeChild(r), e
      }
    })
  })(), jQuery.swap = function(e, t, n, r) {
    var i, s, o = {};
    for (s in t) o[s] = e.style[s], e.style[s] = t[s];
    i = n.apply(e, r || []);
    for (s in t) e.style[s] = o[s];
    return i
  };
  var rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"),
    rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"),
    cssShow = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    },
    cssNormalTransform = {
      letterSpacing: "0",
      fontWeight: "400"
    },
    cssPrefixes = ["Webkit", "O", "Moz", "ms"];
  jQuery.extend({
    cssHooks: {
      opacity: {
        get: function(e, t) {
          if (t) {
            var n = curCSS(e, "opacity");
            return n === "" ? "1" : n
          }
        }
      }
    },
    cssNumber: {
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: {
      "float": "cssFloat"
    },
    style: function(e, t, n, r) {
      if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) return;
      var i, s, o, u = jQuery.camelCase(t),
        a = e.style;
      t = jQuery.cssProps[u] || (jQuery.cssProps[u] = vendorPropName(a, u)), o = jQuery.cssHooks[t] || jQuery.cssHooks[u];
      if (n === undefined) return o && "get" in o && (i = o.get(e, !1, r)) !== undefined ? i : a[t];
      s = typeof n, s === "string" && (i = rrelNum.exec(n)) && (n = (i[1] + 1) * i[2] + parseFloat(jQuery.css(e, t)), s = "number");
      if (n == null || n !== n) return;
      s === "number" && !jQuery.cssNumber[u] && (n += "px"), !support.clearCloneStyle && n === "" && t.indexOf("background") === 0 && (a[t] = "inherit");
      if (!o || !("set" in o) || (n = o.set(e, n, r)) !== undefined) a[t] = n
    },
    css: function(e, t, n, r) {
      var i, s, o, u = jQuery.camelCase(t);
      return t = jQuery.cssProps[u] || (jQuery.cssProps[u] = vendorPropName(e.style, u)), o = jQuery.cssHooks[t] || jQuery.cssHooks[u], o && "get" in o && (i = o.get(e, !0, n)), i === undefined && (i = curCSS(e, t, r)), i === "normal" && t in cssNormalTransform && (i = cssNormalTransform[t]), n === "" || n ? (s = parseFloat(i), n === !0 || jQuery.isNumeric(s) ? s || 0 : i) : i
    }
  }), jQuery.each(["height", "width"], function(e, t) {
    jQuery.cssHooks[t] = {
      get: function(e, n, r) {
        if (n) return rdisplayswap.test(jQuery.css(e, "display")) && e.offsetWidth === 0 ? jQuery.swap(e, cssShow, function() {
          return getWidthOrHeight(e, t, r)
        }) : getWidthOrHeight(e, t, r)
      },
      set: function(e, n, r) {
        var i = r && getStyles(e);
        return setPositiveNumber(e, n, r ? augmentWidthOrHeight(e, t, r, jQuery.css(e, "boxSizing", !1, i) === "border-box", i) : 0)
      }
    }
  }), jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(e, t) {
    if (t) return jQuery.swap(e, {
      display: "inline-block"
    }, curCSS, [e, "marginRight"])
  }), jQuery.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function(e, t) {
    jQuery.cssHooks[e + t] = {
      expand: function(n) {
        var r = 0,
          i = {},
          s = typeof n == "string" ? n.split(" ") : [n];
        for (; r < 4; r++) i[e + cssExpand[r] + t] = s[r] || s[r - 2] || s[0];
        return i
      }
    }, rmargin.test(e) || (jQuery.cssHooks[e + t].set = setPositiveNumber)
  }), jQuery.fn.extend({
    css: function(e, t) {
      return access(this, function(e, t, n) {
        var r, i, s = {},
          o = 0;
        if (jQuery.isArray(t)) {
          r = getStyles(e), i = t.length;
          for (; o < i; o++) s[t[o]] = jQuery.css(e, t[o], !1, r);
          return s
        }
        return n !== undefined ? jQuery.style(e, t, n) : jQuery.css(e, t)
      }, e, t, arguments.length > 1)
    },
    show: function() {
      return showHide(this, !0)
    },
    hide: function() {
      return showHide(this)
    },
    toggle: function(e) {
      return typeof e == "boolean" ? e ? this.show() : this.hide() : this.each(function() {
        isHidden(this) ? jQuery(this).show() : jQuery(this).hide()
      })
    }
  }), jQuery.Tween = Tween, Tween.prototype = {
    constructor: Tween,
    init: function(e, t, n, r, i, s) {
      this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = s || (jQuery.cssNumber[n] ? "" : "px")
    },
    cur: function() {
      var e = Tween.propHooks[this.prop];
      return e && e.get ? e.get(this) : Tween.propHooks._default.get(this)
    },
    run: function(e) {
      var t, n = Tween.propHooks[this.prop];
      return this.options.duration ? this.pos = t = jQuery.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : Tween.propHooks._default.set(this), this
    }
  }, Tween.prototype.init.prototype = Tween.prototype, Tween.propHooks = {
    _default: {
      get: function(e) {
        var t;
        return e.elem[e.prop] == null || !!e.elem.style && e.elem.style[e.prop] != null ? (t = jQuery.css(e.elem, e.prop, ""), !t || t === "auto" ? 0 : t) : e.elem[e.prop]
      },
      set: function(e) {
        jQuery.fx.step[e.prop] ? jQuery.fx.step[e.prop](e) : e.elem.style && (e.elem.style[jQuery.cssProps[e.prop]] != null || jQuery.cssHooks[e.prop]) ? jQuery.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
      }
    }
  }, Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set: function(e) {
      e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
    }
  }, jQuery.easing = {
    linear: function(e) {
      return e
    },
    swing: function(e) {
      return .5 - Math.cos(e * Math.PI) / 2
    }
  }, jQuery.fx = Tween.prototype.init, jQuery.fx.step = {};
  var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/,
    rfxnum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"),
    rrun = /queueHooks$/,
    animationPrefilters = [defaultPrefilter],
    tweeners = {
      "*": [function(e, t) {
        var n = this.createTween(e, t),
          r = n.cur(),
          i = rfxnum.exec(t),
          s = i && i[3] || (jQuery.cssNumber[e] ? "" : "px"),
          o = (jQuery.cssNumber[e] || s !== "px" && +r) && rfxnum.exec(jQuery.css(n.elem, e)),
          u = 1,
          a = 20;
        if (o && o[3] !== s) {
          s = s || o[3], i = i || [], o = +r || 1;
          do u = u || ".5", o /= u, jQuery.style(n.elem, e, o + s); while (u !== (u = n.cur() / r) && u !== 1 && --a)
        }
        return i && (o = n.start = +o || +r || 0, n.unit = s, n.end = i[1] ? o + (i[1] + 1) * i[2] : +i[2]), n
      }]
    };
  jQuery.Animation = jQuery.extend(Animation, {
      tweener: function(e, t) {
        jQuery.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
        var n, r = 0,
          i = e.length;
        for (; r < i; r++) n = e[r], tweeners[n] = tweeners[n] || [], tweeners[n].unshift(t)
      },
      prefilter: function(e, t) {
        t ? animationPrefilters.unshift(e) : animationPrefilters.push(e)
      }
    }), jQuery.speed = function(e, t, n) {
      var r = e && typeof e == "object" ? jQuery.extend({}, e) : {
        complete: n || !n && t || jQuery.isFunction(e) && e,
        duration: e,
        easing: n && t || t && !jQuery.isFunction(t) && t
      };
      r.duration = jQuery.fx.off ? 0 : typeof r.duration == "number" ? r.duration : r.duration in jQuery.fx.speeds ? jQuery.fx.speeds[r.duration] : jQuery.fx.speeds._default;
      if (r.queue == null || r.queue === !0) r.queue = "fx";
      return r.old = r.complete, r.complete = function() {
        jQuery.isFunction(r.old) && r.old.call(this), r.queue && jQuery.dequeue(this, r.queue)
      }, r
    }, jQuery.fn.extend({
      fadeTo: function(e, t, n, r) {
        return this.filter(isHidden).css("opacity", 0).show().end().animate({
          opacity: t
        }, e, n, r)
      },
      animate: function(e, t, n, r) {
        var i = jQuery.isEmptyObject(e),
          s = jQuery.speed(t, n, r),
          o = function() {
            var t = Animation(this, jQuery.extend({}, e), s);
            (i || data_priv.get(this, "finish")) && t.stop(!0)
          };
        return o.finish = o, i || s.queue === !1 ? this.each(o) : this.queue(s.queue, o)
      },
      stop: function(e, t, n) {
        var r = function(e) {
          var t = e.stop;
          delete e.stop, t(n)
        };
        return typeof e != "string" && (n = t, t = e, e = undefined), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
          var t = !0,
            i = e != null && e + "queueHooks",
            s = jQuery.timers,
            o = data_priv.get(this);
          if (i) o[i] && o[i].stop && r(o[i]);
          else
            for (i in o) o[i] && o[i].stop && rrun.test(i) && r(o[i]);
          for (i = s.length; i--;) s[i].elem === this && (e == null || s[i].queue === e) && (s[i].anim.stop(n), t = !1, s.splice(i, 1));
          (t || !n) && jQuery.dequeue(this, e)
        })
      },
      finish: function(e) {
        return e !== !1 && (e = e || "fx"), this.each(function() {
          var t, n = data_priv.get(this),
            r = n[e + "queue"],
            i = n[e + "queueHooks"],
            s = jQuery.timers,
            o = r ? r.length : 0;
          n.finish = !0, jQuery.queue(this, e, []), i && i.stop && i.stop.call(this, !0);
          for (t = s.length; t--;) s[t].elem === this && s[t].queue === e && (s[t].anim.stop(!0), s.splice(t, 1));
          for (t = 0; t < o; t++) r[t] && r[t].finish && r[t].finish.call(this);
          delete n.finish
        })
      }
    }), jQuery.each(["toggle", "show", "hide"], function(e, t) {
      var n = jQuery.fn[t];
      jQuery.fn[t] = function(e, r, i) {
        return e == null || typeof e == "boolean" ? n.apply(this, arguments) : this.animate(genFx(t, !0), e, r, i)
      }
    }), jQuery.each({
      slideDown: genFx("show"),
      slideUp: genFx("hide"),
      slideToggle: genFx("toggle"),
      fadeIn: {
        opacity: "show"
      },
      fadeOut: {
        opacity: "hide"
      },
      fadeToggle: {
        opacity: "toggle"
      }
    }, function(e, t) {
      jQuery.fn[e] = function(e, n, r) {
        return this.animate(t, e, n, r)
      }
    }), jQuery.timers = [], jQuery.fx.tick = function() {
      var e, t = 0,
        n = jQuery.timers;
      fxNow = jQuery.now();
      for (; t < n.length; t++) e = n[t], !e() && n[t] === e && n.splice(t--, 1);
      n.length || jQuery.fx.stop(), fxNow = undefined
    }, jQuery.fx.timer = function(e) {
      jQuery.timers.push(e), e() ? jQuery.fx.start() : jQuery.timers.pop()
    }, jQuery.fx.interval = 13, jQuery.fx.start = function() {
      timerId || (timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval))
    }, jQuery.fx.stop = function() {
      clearInterval(timerId), timerId = null
    }, jQuery.fx.speeds = {
      slow: 600,
      fast: 200,
      _default: 400
    }, jQuery.fn.delay = function(e, t) {
      return e = jQuery.fx ? jQuery.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
        var r = setTimeout(t, e);
        n.stop = function() {
          clearTimeout(r)
        }
      })
    },
    function() {
      var e = document.createElement("input"),
        t = document.createElement("select"),
        n = t.appendChild(document.createElement("option"));
      e.type = "checkbox", support.checkOn = e.value !== "", support.optSelected = n.selected, t.disabled = !0, support.optDisabled = !n.disabled, e = document.createElement("input"), e.value = "t", e.type = "radio", support.radioValue = e.value === "t"
    }();
  var nodeHook, boolHook, attrHandle = jQuery.expr.attrHandle;
  jQuery.fn.extend({
    attr: function(e, t) {
      return access(this, jQuery.attr, e, t, arguments.length > 1)
    },
    removeAttr: function(e) {
      return this.each(function() {
        jQuery.removeAttr(this, e)
      })
    }
  }), jQuery.extend({
    attr: function(e, t, n) {
      var r, i, s = e.nodeType;
      if (!e || s === 3 || s === 8 || s === 2) return;
      if (typeof e.getAttribute === strundefined) return jQuery.prop(e, t, n);
      if (s !== 1 || !jQuery.isXMLDoc(e)) t = t.toLowerCase(), r = jQuery.attrHooks[t] || (jQuery.expr.match.bool.test(t) ? boolHook : nodeHook);
      if (n === undefined) return r && "get" in r && (i = r.get(e, t)) !== null ? i : (i = jQuery.find.attr(e, t), i == null ? undefined : i);
      if (n !== null) return r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : (e.setAttribute(t, n + ""), n);
      jQuery.removeAttr(e, t)
    },
    removeAttr: function(e, t) {
      var n, r, i = 0,
        s = t && t.match(rnotwhite);
      if (s && e.nodeType === 1)
        while (n = s[i++]) r = jQuery.propFix[n] || n, jQuery.expr.match.bool.test(n) && (e[r] = !1), e.removeAttribute(n)
    },
    attrHooks: {
      type: {
        set: function(e, t) {
          if (!support.radioValue && t === "radio" && jQuery.nodeName(e, "input")) {
            var n = e.value;
            return e.setAttribute("type", t), n && (e.value = n), t
          }
        }
      }
    }
  }), boolHook = {
    set: function(e, t, n) {
      return t === !1 ? jQuery.removeAttr(e, n) : e.setAttribute(n, n), n
    }
  }, jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(e, t) {
    var n = attrHandle[t] || jQuery.find.attr;
    attrHandle[t] = function(e, t, r) {
      var i, s;
      return r || (s = attrHandle[t], attrHandle[t] = i, i = n(e, t, r) != null ? t.toLowerCase() : null, attrHandle[t] = s), i
    }
  });
  var rfocusable = /^(?:input|select|textarea|button)$/i;
  jQuery.fn.extend({
    prop: function(e, t) {
      return access(this, jQuery.prop, e, t, arguments.length > 1)
    },
    removeProp: function(e) {
      return this.each(function() {
        delete this[jQuery.propFix[e] || e]
      })
    }
  }), jQuery.extend({
    propFix: {
      "for": "htmlFor",
      "class": "className"
    },
    prop: function(e, t, n) {
      var r, i, s, o = e.nodeType;
      if (!e || o === 3 || o === 8 || o === 2) return;
      return s = o !== 1 || !jQuery.isXMLDoc(e), s && (t = jQuery.propFix[t] || t, i = jQuery.propHooks[t]), n !== undefined ? i && "set" in i && (r = i.set(e, n, t)) !== undefined ? r : e[t] = n : i && "get" in i && (r = i.get(e, t)) !== null ? r : e[t]
    },
    propHooks: {
      tabIndex: {
        get: function(e) {
          return e.hasAttribute("tabindex") || rfocusable.test(e.nodeName) || e.href ? e.tabIndex : -1
        }
      }
    }
  }), support.optSelected || (jQuery.propHooks.selected = {
    get: function(e) {
      var t = e.parentNode;
      return t && t.parentNode && t.parentNode.selectedIndex, null
    }
  }), jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
    jQuery.propFix[this.toLowerCase()] = this
  });
  var rclass = /[\t\r\n\f]/g;
  jQuery.fn.extend({
    addClass: function(e) {
      var t, n, r, i, s, o, u = typeof e == "string" && e,
        a = 0,
        f = this.length;
      if (jQuery.isFunction(e)) return this.each(function(t) {
        jQuery(this).addClass(e.call(this, t, this.className))
      });
      if (u) {
        t = (e || "").match(rnotwhite) || [];
        for (; a < f; a++) {
          n = this[a], r = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(rclass, " ") : " ");
          if (r) {
            s = 0;
            while (i = t[s++]) r.indexOf(" " + i + " ") < 0 && (r += i + " ");
            o = jQuery.trim(r), n.className !== o && (n.className = o)
          }
        }
      }
      return this
    },
    removeClass: function(e) {
      var t, n, r, i, s, o, u = arguments.length === 0 || typeof e == "string" && e,
        a = 0,
        f = this.length;
      if (jQuery.isFunction(e)) return this.each(function(t) {
        jQuery(this).removeClass(e.call(this, t, this.className))
      });
      if (u) {
        t = (e || "").match(rnotwhite) || [];
        for (; a < f; a++) {
          n = this[a], r = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(rclass, " ") : "");
          if (r) {
            s = 0;
            while (i = t[s++])
              while (r.indexOf(" " + i + " ") >= 0) r = r.replace(" " + i + " ", " ");
            o = e ? jQuery.trim(r) : "", n.className !== o && (n.className = o)
          }
        }
      }
      return this
    },
    toggleClass: function(e, t) {
      var n = typeof e;
      return typeof t == "boolean" && n === "string" ? t ? this.addClass(e) : this.removeClass(e) : jQuery.isFunction(e) ? this.each(function(n) {
        jQuery(this).toggleClass(e.call(this, n, this.className, t), t)
      }) : this.each(function() {
        if (n === "string") {
          var t, r = 0,
            i = jQuery(this),
            s = e.match(rnotwhite) || [];
          while (t = s[r++]) i.hasClass(t) ? i.removeClass(t) : i.addClass(t)
        } else if (n === strundefined || n === "boolean") this.className && data_priv.set(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : data_priv.get(this, "__className__") || ""
      })
    },
    hasClass: function(e) {
      var t = " " + e + " ",
        n = 0,
        r = this.length;
      for (; n < r; n++)
        if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(rclass, " ").indexOf(t) >= 0) return !0;
      return !1
    }
  });
  var rreturn = /\r/g;
  jQuery.fn.extend({
    val: function(e) {
      var t, n, r, i = this[0];
      if (!arguments.length) {
        if (i) return t = jQuery.valHooks[i.type] || jQuery.valHooks[i.nodeName.toLowerCase()], t && "get" in t && (n = t.get(i, "value")) !== undefined ? n : (n = i.value, typeof n == "string" ? n.replace(rreturn, "") : n == null ? "" : n);
        return
      }
      return r = jQuery.isFunction(e), this.each(function(n) {
        var i;
        if (this.nodeType !== 1) return;
        r ? i = e.call(this, n, jQuery(this).val()) : i = e, i == null ? i = "" : typeof i == "number" ? i += "" : jQuery.isArray(i) && (i = jQuery.map(i, function(e) {
          return e == null ? "" : e + ""
        })), t = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
        if (!t || !("set" in t) || t.set(this, i, "value") === undefined) this.value = i
      })
    }
  }), jQuery.extend({
    valHooks: {
      option: {
        get: function(e) {
          var t = jQuery.find.attr(e, "value");
          return t != null ? t : jQuery.trim(jQuery.text(e))
        }
      },
      select: {
        get: function(e) {
          var t, n, r = e.options,
            i = e.selectedIndex,
            s = e.type === "select-one" || i < 0,
            o = s ? null : [],
            u = s ? i + 1 : r.length,
            a = i < 0 ? u : s ? i : 0;
          for (; a < u; a++) {
            n = r[a];
            if ((n.selected || a === i) && (support.optDisabled ? !n.disabled : n.getAttribute("disabled") === null) && (!n.parentNode.disabled || !jQuery.nodeName(n.parentNode, "optgroup"))) {
              t = jQuery(n).val();
              if (s) return t;
              o.push(t)
            }
          }
          return o
        },
        set: function(e, t) {
          var n, r, i = e.options,
            s = jQuery.makeArray(t),
            o = i.length;
          while (o--) {
            r = i[o];
            if (r.selected = jQuery.inArray(r.value, s) >= 0) n = !0
          }
          return n || (e.selectedIndex = -1), s
        }
      }
    }
  }), jQuery.each(["radio", "checkbox"], function() {
    jQuery.valHooks[this] = {
      set: function(e, t) {
        if (jQuery.isArray(t)) return e.checked = jQuery.inArray(jQuery(e).val(), t) >= 0
      }
    }, support.checkOn || (jQuery.valHooks[this].get = function(e) {
      return e.getAttribute("value") === null ? "on" : e.value
    })
  }), jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
    jQuery.fn[t] = function(e, n) {
      return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
    }
  }), jQuery.fn.extend({
    hover: function(e, t) {
      return this.mouseenter(e).mouseleave(t || e)
    },
    bind: function(e, t, n) {
      return this.on(e, null, t, n)
    },
    unbind: function(e, t) {
      return this.off(e, null, t)
    },
    delegate: function(e, t, n, r) {
      return this.on(t, e, n, r)
    },
    undelegate: function(e, t, n) {
      return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n)
    }
  });
  var nonce = jQuery.now(),
    rquery = /\?/;
  jQuery.parseJSON = function(e) {
    return JSON.parse(e + "")
  }, jQuery.parseXML = function(e) {
    var t, n;
    if (!e || typeof e != "string") return null;
    try {
      n = new DOMParser, t = n.parseFromString(e, "text/xml")
    } catch (r) {
      t = undefined
    }
    return (!t || t.getElementsByTagName("parsererror").length) && jQuery.error("Invalid XML: " + e), t
  };
  var ajaxLocParts, ajaxLocation, rhash = /#.*$/,
    rts = /([?&])_=[^&]*/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
    rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
    prefilters = {},
    transports = {},
    allTypes = "*/".concat("*");
  try {
    ajaxLocation = location.href
  } catch (e) {
    ajaxLocation = document.createElement("a"), ajaxLocation.href = "", ajaxLocation = ajaxLocation.href
  }
  ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [], jQuery.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: ajaxLocation,
      type: "GET",
      isLocal: rlocalProtocol.test(ajaxLocParts[1]),
      global: !0,
      processData: !0,
      async: !0,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": allTypes,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      converters: {
        "* text": String,
        "text html": !0,
        "text json": jQuery.parseJSON,
        "text xml": jQuery.parseXML
      },
      flatOptions: {
        url: !0,
        context: !0
      }
    },
    ajaxSetup: function(e, t) {
      return t ? ajaxExtend(ajaxExtend(e, jQuery.ajaxSettings), t) : ajaxExtend(jQuery.ajaxSettings, e)
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    ajax: function(e, t) {
      function S(e, t, s, u) {
        var f, m, g, b, E, S = t;
        if (y === 2) return;
        y = 2, o && clearTimeout(o), n = undefined, i = u || "", w.readyState = e > 0 ? 4 : 0, f = e >= 200 && e < 300 || e === 304, s && (b = ajaxHandleResponses(l, w, s)), b = ajaxConvert(l, b, w, f);
        if (f) l.ifModified && (E = w.getResponseHeader("Last-Modified"), E && (jQuery.lastModified[r] = E), E = w.getResponseHeader("etag"), E && (jQuery.etag[r] = E)), e === 204 || l.type === "HEAD" ? S = "nocontent" : e === 304 ? S = "notmodified" : (S = b.state, m = b.data, g = b.error, f = !g);
        else {
          g = S;
          if (e || !S) S = "error", e < 0 && (e = 0)
        }
        w.status = e, w.statusText = (t || S) + "", f ? p.resolveWith(c, [m, S, w]) : p.rejectWith(c, [w, S, g]), w.statusCode(v), v = undefined, a && h.trigger(f ? "ajaxSuccess" : "ajaxError", [w, l, f ? m : g]), d.fireWith(c, [w, S]), a && (h.trigger("ajaxComplete", [w, l]), --jQuery.active || jQuery.event.trigger("ajaxStop"))
      }
      typeof e == "object" && (t = e, e = undefined), t = t || {};
      var n, r, i, s, o, u, a, f, l = jQuery.ajaxSetup({}, t),
        c = l.context || l,
        h = l.context && (c.nodeType || c.jquery) ? jQuery(c) : jQuery.event,
        p = jQuery.Deferred(),
        d = jQuery.Callbacks("once memory"),
        v = l.statusCode || {},
        m = {},
        g = {},
        y = 0,
        b = "canceled",
        w = {
          readyState: 0,
          getResponseHeader: function(e) {
            var t;
            if (y === 2) {
              if (!s) {
                s = {};
                while (t = rheaders.exec(i)) s[t[1].toLowerCase()] = t[2]
              }
              t = s[e.toLowerCase()]
            }
            return t == null ? null : t
          },
          getAllResponseHeaders: function() {
            return y === 2 ? i : null
          },
          setRequestHeader: function(e, t) {
            var n = e.toLowerCase();
            return y || (e = g[n] = g[n] || e, m[e] = t), this
          },
          overrideMimeType: function(e) {
            return y || (l.mimeType = e), this
          },
          statusCode: function(e) {
            var t;
            if (e)
              if (y < 2)
                for (t in e) v[t] = [v[t], e[t]];
              else w.always(e[w.status]);
            return this
          },
          abort: function(e) {
            var t = e || b;
            return n && n.abort(t), S(0, t), this
          }
        };
      p.promise(w).complete = d.add, w.success = w.done, w.error = w.fail, l.url = ((e || l.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//"), l.type = t.method || t.type || l.method || l.type, l.dataTypes = jQuery.trim(l.dataType || "*").toLowerCase().match(rnotwhite) || [""], l.crossDomain == null && (u = rurl.exec(l.url.toLowerCase()), l.crossDomain = !(!u || u[1] === ajaxLocParts[1] && u[2] === ajaxLocParts[2] && (u[3] || (u[1] === "http:" ? "80" : "443")) === (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443")))), l.data && l.processData && typeof l.data != "string" && (l.data = jQuery.param(l.data, l.traditional)), inspectPrefiltersOrTransports(prefilters, l, t, w);
      if (y === 2) return w;
      a = l.global, a && jQuery.active++ === 0 && jQuery.event.trigger("ajaxStart"), l.type = l.type.toUpperCase(), l.hasContent = !rnoContent.test(l.type), r = l.url, l.hasContent || (l.data && (r = l.url += (rquery.test(r) ? "&" : "?") + l.data, delete l.data), l.cache === !1 && (l.url = rts.test(r) ? r.replace(rts, "$1_=" + nonce++) : r + (rquery.test(r) ? "&" : "?") + "_=" + nonce++)), l.ifModified && (jQuery.lastModified[r] && w.setRequestHeader("If-Modified-Since", jQuery.lastModified[r]), jQuery.etag[r] && w.setRequestHeader("If-None-Match", jQuery.etag[r])), (l.data && l.hasContent && l.contentType !== !1 || t.contentType) && w.setRequestHeader("Content-Type", l.contentType), w.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + (l.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : l.accepts["*"]);
      for (f in l.headers) w.setRequestHeader(f, l.headers[f]);
      if (!l.beforeSend || l.beforeSend.call(c, w, l) !== !1 && y !== 2) {
        b = "abort";
        for (f in {
            success: 1,
            error: 1,
            complete: 1
          }) w[f](l[f]);
        n = inspectPrefiltersOrTransports(transports, l, t, w);
        if (!n) S(-1, "No Transport");
        else {
          w.readyState = 1, a && h.trigger("ajaxSend", [w, l]), l.async && l.timeout > 0 && (o = setTimeout(function() {
            w.abort("timeout")
          }, l.timeout));
          try {
            y = 1, n.send(m, S)
          } catch (E) {
            if (!(y < 2)) throw E;
            S(-1, E)
          }
        }
        return w
      }
      return w.abort()
    },
    getJSON: function(e, t, n) {
      return jQuery.get(e, t, n, "json")
    },
    getScript: function(e, t) {
      return jQuery.get(e, undefined, t, "script")
    }
  }), jQuery.each(["get", "post"], function(e, t) {
    jQuery[t] = function(e, n, r, i) {
      return jQuery.isFunction(n) && (i = i || r, r = n, n = undefined), jQuery.ajax({
        url: e,
        type: t,
        dataType: i,
        data: n,
        success: r
      })
    }
  }), jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
    jQuery.fn[t] = function(e) {
      return this.on(t, e)
    }
  }), jQuery._evalUrl = function(e) {
    return jQuery.ajax({
      url: e,
      type: "GET",
      dataType: "script",
      async: !1,
      global: !1,
      "throws": !0
    })
  }, jQuery.fn.extend({
    wrapAll: function(e) {
      var t;
      return jQuery.isFunction(e) ? this.each(function(t) {
        jQuery(this).wrapAll(e.call(this, t))
      }) : (this[0] && (t = jQuery(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
        var e = this;
        while (e.firstElementChild) e = e.firstElementChild;
        return e
      }).append(this)), this)
    },
    wrapInner: function(e) {
      return jQuery.isFunction(e) ? this.each(function(t) {
        jQuery(this).wrapInner(e.call(this, t))
      }) : this.each(function() {
        var t = jQuery(this),
          n = t.contents();
        n.length ? n.wrapAll(e) : t.append(e)
      })
    },
    wrap: function(e) {
      var t = jQuery.isFunction(e);
      return this.each(function(n) {
        jQuery(this).wrapAll(t ? e.call(this, n) : e)
      })
    },
    unwrap: function() {
      return this.parent().each(function() {
        jQuery.nodeName(this, "body") || jQuery(this).replaceWith(this.childNodes)
      }).end()
    }
  }), jQuery.expr.filters.hidden = function(e) {
    return e.offsetWidth <= 0 && e.offsetHeight <= 0
  }, jQuery.expr.filters.visible = function(e) {
    return !jQuery.expr.filters.hidden(e)
  };
  var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;
  jQuery.param = function(e, t) {
    var n, r = [],
      i = function(e, t) {
        t = jQuery.isFunction(t) ? t() : t == null ? "" : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
      };
    t === undefined && (t = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional);
    if (jQuery.isArray(e) || e.jquery && !jQuery.isPlainObject(e)) jQuery.each(e, function() {
      i(this.name, this.value)
    });
    else
      for (n in e) buildParams(n, e[n], t, i);
    return r.join("&").replace(r20, "+")
  }, jQuery.fn.extend({
    serialize: function() {
      return jQuery.param(this.serializeArray())
    },
    serializeArray: function() {
      return this.map(function() {
        var e = jQuery.prop(this, "elements");
        return e ? jQuery.makeArray(e) : this
      }).filter(function() {
        var e = this.type;
        return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(e) && (this.checked || !rcheckableType.test(e))
      }).map(function(e, t) {
        var n = jQuery(this).val();
        return n == null ? null : jQuery.isArray(n) ? jQuery.map(n, function(e) {
          return {
            name: t.name,
            value: e.replace(rCRLF, "\r\n")
          }
        }) : {
          name: t.name,
          value: n.replace(rCRLF, "\r\n")
        }
      }).get()
    }
  }), jQuery.ajaxSettings.xhr = function() {
    try {
      return new XMLHttpRequest
    } catch (e) {}
  };
  var xhrId = 0,
    xhrCallbacks = {},
    xhrSuccessStatus = {
      0: 200,
      1223: 204
    },
    xhrSupported = jQuery.ajaxSettings.xhr();
  window.ActiveXObject && jQuery(window).on("unload", function() {
    for (var e in xhrCallbacks) xhrCallbacks[e]()
  }), support.cors = !!xhrSupported && "withCredentials" in xhrSupported, support.ajax = xhrSupported = !!xhrSupported, jQuery.ajaxTransport(function(e) {
    var t;
    if (support.cors || xhrSupported && !e.crossDomain) return {
      send: function(n, r) {
        var i, s = e.xhr(),
          o = ++xhrId;
        s.open(e.type, e.url, e.async, e.username, e.password);
        if (e.xhrFields)
          for (i in e.xhrFields) s[i] = e.xhrFields[i];
        e.mimeType && s.overrideMimeType && s.overrideMimeType(e.mimeType), !e.crossDomain && !n["X-Requested-With"] && (n["X-Requested-With"] = "XMLHttpRequest");
        for (i in n) s.setRequestHeader(i, n[i]);
        t = function(e) {
          return function() {
            t && (delete xhrCallbacks[o], t = s.onload = s.onerror = null, e === "abort" ? s.abort() : e === "error" ? r(s.status, s.statusText) : r(xhrSuccessStatus[s.status] || s.status, s.statusText, typeof s.responseText == "string" ? {
              text: s.responseText
            } : undefined, s.getAllResponseHeaders()))
          }
        }, s.onload = t(), s.onerror = t("error"), t = xhrCallbacks[o] = t("abort");
        try {
          s.send(e.hasContent && e.data || null)
        } catch (u) {
          if (t) throw u
        }
      },
      abort: function() {
        t && t()
      }
    }
  }), jQuery.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /(?:java|ecma)script/
    },
    converters: {
      "text script": function(e) {
        return jQuery.globalEval(e), e
      }
    }
  }), jQuery.ajaxPrefilter("script", function(e) {
    e.cache === undefined && (e.cache = !1), e.crossDomain && (e.type = "GET")
  }), jQuery.ajaxTransport("script", function(e) {
    if (e.crossDomain) {
      var t, n;
      return {
        send: function(r, i) {
          t = jQuery("<script>").prop({
            async: !0,
            charset: e.scriptCharset,
            src: e.url
          }).on("load error", n = function(e) {
            t.remove(), n = null, e && i(e.type === "error" ? 404 : 200, e.type)
          }), document.head.appendChild(t[0])
        },
        abort: function() {
          n && n()
        }
      }
    }
  });
  var oldCallbacks = [],
    rjsonp = /(=)\?(?=&|$)|\?\?/;
  jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var e = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
      return this[e] = !0, e
    }
  }), jQuery.ajaxPrefilter("json jsonp", function(e, t, n) {
    var r, i, s, o = e.jsonp !== !1 && (rjsonp.test(e.url) ? "url" : typeof e.data == "string" && !(e.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(e.data) && "data");
    if (o || e.dataTypes[0] === "jsonp") return r = e.jsonpCallback = jQuery.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, o ? e[o] = e[o].replace(rjsonp, "$1" + r) : e.jsonp !== !1 && (e.url += (rquery.test(e.url) ? "&" : "?") + e.jsonp + "=" + r), e.converters["script json"] = function() {
      return s || jQuery.error(r + " was not called"), s[0]
    }, e.dataTypes[0] = "json", i = window[r], window[r] = function() {
      s = arguments
    }, n.always(function() {
      window[r] = i, e[r] && (e.jsonpCallback = t.jsonpCallback, oldCallbacks.push(r)), s && jQuery.isFunction(i) && i(s[0]), s = i = undefined
    }), "script"
  }), jQuery.parseHTML = function(e, t, n) {
    if (!e || typeof e != "string") return null;
    typeof t == "boolean" && (n = t, t = !1), t = t || document;
    var r = rsingleTag.exec(e),
      i = !n && [];
    return r ? [t.createElement(r[1])] : (r = jQuery.buildFragment([e], t, i), i && i.length && jQuery(i).remove(), jQuery.merge([], r.childNodes))
  };
  var _load = jQuery.fn.load;
  jQuery.fn.load = function(e, t, n) {
    if (typeof e != "string" && _load) return _load.apply(this, arguments);
    var r, i, s, o = this,
      u = e.indexOf(" ");
    return u >= 0 && (r = jQuery.trim(e.slice(u)), e = e.slice(0, u)), jQuery.isFunction(t) ? (n = t, t = undefined) : t && typeof t == "object" && (i = "POST"), o.length > 0 && jQuery.ajax({
      url: e,
      type: i,
      dataType: "html",
      data: t
    }).done(function(e) {
      s = arguments, o.html(r ? jQuery("<div>").append(jQuery.parseHTML(e)).find(r) : e)
    }).complete(n && function(e, t) {
      o.each(n, s || [e.responseText, t, e])
    }), this
  }, jQuery.expr.filters.animated = function(e) {
    return jQuery.grep(jQuery.timers, function(t) {
      return e === t.elem
    }).length
  };
  var docElem = window.document.documentElement;
  jQuery.offset = {
    setOffset: function(e, t, n) {
      var r, i, s, o, u, a, f, l = jQuery.css(e, "position"),
        c = jQuery(e),
        h = {};
      l === "static" && (e.style.position = "relative"), u = c.offset(), s = jQuery.css(e, "top"), a = jQuery.css(e, "left"), f = (l === "absolute" || l === "fixed") && (s + a).indexOf("auto") > -1, f ? (r = c.position(), o = r.top, i = r.left) : (o = parseFloat(s) || 0, i = parseFloat(a) || 0), jQuery.isFunction(t) && (t = t.call(e, n, u)), t.top != null && (h.top = t.top - u.top + o), t.left != null && (h.left = t.left - u.left + i), "using" in t ? t.using.call(e, h) : c.css(h)
    }
  }, jQuery.fn.extend({
    offset: function(e) {
      if (arguments.length) return e === undefined ? this : this.each(function(t) {
        jQuery.offset.setOffset(this, e, t)
      });
      var t, n, r = this[0],
        i = {
          top: 0,
          left: 0
        },
        s = r && r.ownerDocument;
      if (!s) return;
      return t = s.documentElement, jQuery.contains(t, r) ? (typeof r.getBoundingClientRect !== strundefined && (i = r.getBoundingClientRect()), n = getWindow(s), {
        top: i.top + n.pageYOffset - t.clientTop,
        left: i.left + n.pageXOffset - t.clientLeft
      }) : i
    },
    position: function() {
      if (!this[0]) return;
      var e, t, n = this[0],
        r = {
          top: 0,
          left: 0
        };
      return jQuery.css(n, "position") === "fixed" ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), jQuery.nodeName(e[0], "html") || (r = e.offset()), r.top += jQuery.css(e[0], "borderTopWidth", !0), r.left += jQuery.css(e[0], "borderLeftWidth", !0)), {
        top: t.top - r.top - jQuery.css(n, "marginTop", !0),
        left: t.left - r.left - jQuery.css(n, "marginLeft", !0)
      }
    },
    offsetParent: function() {
      return this.map(function() {
        var e = this.offsetParent || docElem;
        while (e && !jQuery.nodeName(e, "html") && jQuery.css(e, "position") === "static") e = e.offsetParent;
        return e || docElem
      })
    }
  }), jQuery.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function(e, t) {
    var n = "pageYOffset" === t;
    jQuery.fn[e] = function(r) {
      return access(this, function(e, r, i) {
        var s = getWindow(e);
        if (i === undefined) return s ? s[t] : e[r];
        s ? s.scrollTo(n ? window.pageXOffset : i, n ? i : window.pageYOffset) : e[r] = i
      }, e, r, arguments.length, null)
    }
  }), jQuery.each(["top", "left"], function(e, t) {
    jQuery.cssHooks[t] = addGetHookIf(support.pixelPosition, function(e, n) {
      if (n) return n = curCSS(e, t), rnumnonpx.test(n) ? jQuery(e).position()[t] + "px" : n
    })
  }), jQuery.each({
    Height: "height",
    Width: "width"
  }, function(e, t) {
    jQuery.each({
      padding: "inner" + e,
      content: t,
      "": "outer" + e
    }, function(n, r) {
      jQuery.fn[r] = function(r, i) {
        var s = arguments.length && (n || typeof r != "boolean"),
          o = n || (r === !0 || i === !0 ? "margin" : "border");
        return access(this, function(t, n, r) {
          var i;
          return jQuery.isWindow(t) ? t.document.documentElement["client" + e] : t.nodeType === 9 ? (i = t.documentElement, Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : r === undefined ? jQuery.css(t, n, o) : jQuery.style(t, n, r, o)
        }, t, s ? r : undefined, s, null)
      }
    })
  }), jQuery.fn.size = function() {
    return this.length
  }, jQuery.fn.andSelf = jQuery.fn.addBack, typeof define == "function" && define.amd && define("jquery", [], function() {
    return jQuery
  });
  var _jQuery = window.jQuery,
    _$ = window.$;
  return jQuery.noConflict = function(e) {
    return window.$ === jQuery && (window.$ = _$), e && window.jQuery === jQuery && (window.jQuery = _jQuery), jQuery
  }, typeof noGlobal === strundefined && (window.jQuery = window.$ = jQuery), jQuery
}), define("can/util/can", [], function() {
    var e = window.can || {};
    if (typeof GLOBALCAN == "undefined" || GLOBALCAN !== !1) window.can = e;
    e.k = function() {}, e.isDeferred = function(e) {
      return e && typeof e.then == "function" && typeof e.pipe == "function"
    };
    var t = 0;
    return e.cid = function(e, n) {
      return e._cid || (t++, e._cid = (n || "") + t), e._cid
    }, e.VERSION = "2.1.4", e.simpleExtend = function(e, t) {
      for (var n in t) e[n] = t[n];
      return e
    }, e.frag = function(t) {
      var n;
      return !t || typeof t == "string" ? (n = e.buildFragment(t == null ? "" : "" + t, document.body), n.childNodes.length || n.appendChild(document.createTextNode("")), n) : t.nodeType === 11 ? t : typeof t.nodeType == "number" ? (n = document.createDocumentFragment(), n.appendChild(t), n) : typeof t.length == "number" ? (n = document.createDocumentFragment(), e.each(t, function(t) {
        n.appendChild(e.frag(t))
      }), n) : (n = e.buildFragment("" + t, document.body), n.childNodes.length || n.appendChild(document.createTextNode("")), n)
    }, e.__reading = function() {}, e
  }), define("can/util/attr", ["can/util/can"], function(e) {
    var t = window.setImmediate || function(e) {
        return setTimeout(e, 0)
      },
      n = {
        MutationObserver: window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
        map: {
          "class": "className",
          value: "value",
          innerText: "innerText",
          textContent: "textContent",
          checked: !0,
          disabled: !0,
          readonly: !0,
          required: !0,
          src: function(e, t) {
            return t == null || t === "" ? (e.removeAttribute("src"), null) : (e.setAttribute("src", t), t)
          },
          style: function(e, t) {
            return e.style.cssText = t || ""
          }
        },
        defaultValue: ["input", "textarea"],
        set: function(t, r, i) {
          var s;
          n.MutationObserver || (s = n.get(t, r));
          var o = t.nodeName.toString().toLowerCase(),
            u = n.map[r],
            a;
          typeof u == "function" ? a = u(t, i) : u === !0 ? (a = t[r] = !0, r === "checked" && t.type === "radio" && e.inArray(o, n.defaultValue) >= 0 && (t.defaultChecked = !0)) : u ? (a = t[u] = i, u === "value" && e.inArray(o, n.defaultValue) >= 0 && (t.defaultValue = i)) : (t.setAttribute(r, i), a = i), !n.MutationObserver && a !== s && n.trigger(t, r, s)
        },
        trigger: function(n, r, i) {
          if (e.data(e.$(n), "canHasAttributesBindings")) return t(function() {
            e.trigger(n, {
              type: "attributes",
              attributeName: r,
              target: n,
              oldValue: i,
              bubbles: !1
            }, [])
          })
        },
        get: function(e, t) {
          var r = n.map[t];
          return typeof r == "string" && e[r] ? e[r] : e.getAttribute(t)
        },
        remove: function(e, t) {
          var r;
          n.MutationObserver || (r = n.get(e, t));
          var i = n.map[t];
          typeof i == "function" && i(e, undefined), i === !0 ? e[t] = !1 : typeof i == "string" ? e[i] = "" : e.removeAttribute(t), !n.MutationObserver && r != null && n.trigger(e, t, r)
        },
        has: function() {
          var e = document.createElement("div");
          return e.hasAttribute ? function(e, t) {
            return e.hasAttribute(t)
          } : function(e, t) {
            return e.getAttribute(t) !== null
          }
        }()
      };
    return n
  }), define("can/event", ["can/util/can"], function(e) {
    return e.addEvent = function(e, t) {
      var n = this.__bindEvents || (this.__bindEvents = {}),
        r = n[e] || (n[e] = []);
      return r.push({
        handler: t,
        name: e
      }), this
    }, e.listenTo = function(t, n, r) {
      var i = this.__listenToEvents;
      i || (i = this.__listenToEvents = {});
      var s = e.cid(t),
        o = i[s];
      o || (o = i[s] = {
        obj: t,
        events: {}
      });
      var u = o.events[n];
      u || (u = o.events[n] = []), u.push(r), e.bind.call(t, n, r)
    }, e.stopListening = function(t, n, r) {
      var i = this.__listenToEvents,
        s = i,
        o = 0;
      if (!i) return this;
      if (t) {
        var u = e.cid(t);
        (s = {})[u] = i[u];
        if (!i[u]) return this
      }
      for (var a in s) {
        var f = s[a],
          l;
        t = i[a].obj, n ? (l = {})[n] = f.events[n] : l = f.events;
        for (var c in l) {
          var h = l[c] || [];
          o = 0;
          while (o < h.length) r && r === h[o] || !r ? (e.unbind.call(t, c, h[o]), h.splice(o, 1)) : o++;
          h.length || delete f.events[c]
        }
        e.isEmptyObject(f.events) && delete i[a]
      }
      return this
    }, e.removeEvent = function(e, t, n) {
      if (!this.__bindEvents) return this;
      var r = this.__bindEvents[e] || [],
        i = 0,
        s, o = typeof t == "function";
      while (i < r.length) s = r[i], (n ? n(s, e, t) : o && s.handler === t || !o && (s.cid === t || !t)) ? r.splice(i, 1) : i++;
      return this
    }, e.dispatch = function(e, t) {
      var n = this.__bindEvents;
      if (!n) return;
      typeof e == "string" && (e = {
        type: e
      });
      var r = e.type,
        i = (n[r] || []).slice(0),
        s = [e];
      t && s.push.apply(s, t);
      for (var o = 0, u = i.length; o < u; o++) i[o].handler.apply(this, s);
      return e
    }, e.one = function(t, n) {
      var r = function() {
        return e.unbind.call(this, t, r), n.apply(this, arguments)
      };
      return e.bind.call(this, t, r), this
    }, e.event = {
      on: function() {
        return arguments.length === 0 && e.Control && this instanceof e.Control ? e.Control.prototype.on.call(this) : e.addEvent.apply(this, arguments)
      },
      off: function() {
        return arguments.length === 0 && e.Control && this instanceof e.Control ? e.Control.prototype.off.call(this) : e.removeEvent.apply(this, arguments)
      },
      bind: e.addEvent,
      unbind: e.removeEvent,
      delegate: function(t, n, r) {
        return e.addEvent.call(this, n, r)
      },
      undelegate: function(t, n, r) {
        return e.removeEvent.call(this, n, r)
      },
      trigger: e.dispatch,
      one: e.one,
      addEvent: e.addEvent,
      removeEvent: e.removeEvent,
      listenTo: e.listenTo,
      stopListening: e.stopListening,
      dispatch: e.dispatch
    }, e.event
  }), define("can/util/array/each", ["can/util/can"], function(e) {
    var t = function(e) {
      var t = e.length;
      return typeof arr != "function" && (t === 0 || typeof t == "number" && t > 0 && t - 1 in e)
    };
    return e.each = function(n, r, i) {
      var s = 0,
        o, u, a;
      if (n)
        if (t(n))
          if (e.List && n instanceof e.List)
            for (u = n.attr("length"); s < u; s++) {
              a = n.attr(s);
              if (r.call(i || a, a, s, n) === !1) break
            } else
              for (u = n.length; s < u; s++) {
                a = n[s];
                if (r.call(i || a, a, s, n) === !1) break
              } else if (typeof n == "object")
                if (e.Map && n instanceof e.Map || n === e.route) {
                  var f = e.Map.keys(n);
                  for (s = 0, u = f.length; s < u; s++) {
                    o = f[s], a = n.attr(o);
                    if (r.call(i || a, a, o, n) === !1) break
                  }
                } else
                  for (o in n)
                    if (n.hasOwnProperty(o) && r.call(i || n[o], n[o], o, n) === !1) break;
      return n
    }, e
  }), define("can/util/inserted", ["can/util/can"], function(e) {
    e.inserted = function(t) {
      t = e.makeArray(t);
      var n = !1,
        r = e.$(document.contains ? document : document.body),
        i;
      for (var s = 0, o;
        (o = t[s]) !== undefined; s++) {
        if (!n) {
          if (!o.getElementsByTagName) continue;
          if (!e.has(r, o).length) return;
          n = !0
        }
        if (n && o.getElementsByTagName) {
          i = e.makeArray(o.getElementsByTagName("*")), e.trigger(o, "inserted", [], !1);
          for (var u = 0, a;
            (a = i[u]) !== undefined; u++) e.trigger(a, "inserted", [], !1)
        }
      }
    }, e.appendChild = function(t, n) {
      var r;
      n.nodeType === 11 ? r = e.makeArray(n.childNodes) : r = [n], t.appendChild(n), e.inserted(r)
    }, e.insertBefore = function(t, n, r) {
      var i;
      n.nodeType === 11 ? i = e.makeArray(n.childNodes) : i = [n], t.insertBefore(n, r), e.inserted(i)
    }
  }), define("can/util/jquery", ["jquery", "can/util/can", "can/util/attr", "can/event", "can/util/array/each", "can/util/inserted"], function(e, t, n, r) {
    var i = function(e) {
      return e.nodeName && (e.nodeType === 1 || e.nodeType === 9) || e == window
    };
    e.extend(t, e, {
      trigger: function(n, r, s, o) {
        i(n) ? e.event.trigger(r, s, n, !o) : n.trigger ? n.trigger(r, s) : (typeof r == "string" && (r = {
          type: r
        }), r.target = r.target || n, s && (s.length && typeof s == "string" ? s = [s] : s.length || (s = [s])), s || (s = []), t.dispatch.call(n, r, s))
      },
      event: t.event,
      addEvent: t.addEvent,
      removeEvent: t.removeEvent,
      buildFragment: function(t, n) {
        var r;
        return t = [t], n = n || document, n = !n.nodeType && n[0] || n, n = n.ownerDocument || n, r = e.buildFragment(t, n), r.cacheable ? e.clone(r.fragment) : r.fragment || r
      },
      $: e,
      each: t.each,
      bind: function(n, r) {
        return this.bind && this.bind !== t.bind ? this.bind(n, r) : i(this) ? e.event.add(this, n, r) : t.addEvent.call(this, n, r), this
      },
      unbind: function(n, r) {
        return this.unbind && this.unbind !== t.unbind ? this.unbind(n, r) : i(this) ? e.event.remove(this, n, r) : t.removeEvent.call(this, n, r), this
      },
      delegate: function(n, r, s) {
        return this.delegate ? this.delegate(n, r, s) : i(this) ? e(this).delegate(n, r, s) : t.bind.call(this, r, s), this
      },
      undelegate: function(n, r, s) {
        return this.undelegate ? this.undelegate(n, r, s) : i(this) ? e(this).undelegate(n, r, s) : t.unbind.call(this, r, s), this
      },
      proxy: function(e, t) {
        return function() {
          return e.apply(t, arguments)
        }
      },
      attr: n
    }), t.on = t.bind, t.off = t.unbind, e.each(["append", "filter", "addClass", "remove", "data", "get", "has"], function(e, n) {
      t[n] = function(e) {
        return e[n].apply(e, t.makeArray(arguments).slice(1))
      }
    });
    var s = e.cleanData;
    e.cleanData = function(n) {
      e.each(n, function(e, n) {
        n && t.trigger(n, "removed", [], !1)
      }), s(n)
    };
    var o = e.fn.domManip,
      u;
    e.fn.domManip = function(e, t, n) {
      for (var r = 1; r < arguments.length; r++)
        if (typeof arguments[r] == "function") {
          u = r;
          break
        }
      return o.apply(this, arguments)
    }, e(document.createElement("div")).append(document.createElement("div")), e.fn.domManip = u === 2 ? function(e, n, r) {
      return o.call(this, e, n, function(e) {
        var n;
        e.nodeType === 11 && (n = t.makeArray(e.childNodes));
        var i = r.apply(this, arguments);
        return t.inserted(n ? n : [e]), i
      })
    } : function(e, n) {
      return o.call(this, e, function(e) {
        var r;
        e.nodeType === 11 && (r = t.makeArray(e.childNodes));
        var i = n.apply(this, arguments);
        return t.inserted(r ? r : [e]), i
      })
    };
    if (!t.attr.MutationObserver) {
      var a = e.attr;
      e.attr = function(e, n) {
        var r, i;
        arguments.length >= 3 && (r = a.call(this, e, n));
        var s = a.apply(this, arguments);
        return arguments.length >= 3 && (i = a.call(this, e, n)), i !== r && t.attr.trigger(e, n, r), s
      };
      var f = e.removeAttr;
      e.removeAttr = function(e, n) {
        var r = a.call(this, e, n),
          i = f.apply(this, arguments);
        return r != null && t.attr.trigger(e, n, r), i
      }, e.event.special.attributes = {
        setup: function() {
          t.data(t.$(this), "canHasAttributesBindings", !0)
        },
        teardown: function() {
          e.removeData(this, "canHasAttributesBindings")
        }
      }
    } else e.event.special.attributes = {
      setup: function() {
        var e = this,
          n = new t.attr.MutationObserver(function(n) {
            n.forEach(function(n) {
              var r = t.simpleExtend({}, n);
              t.trigger(e, r, [])
            })
          });
        n.observe(this, {
          attributes: !0,
          attributeOldValue: !0
        }), t.data(t.$(this), "canAttributesObserver", n)
      },
      teardown: function() {
        t.data(t.$(this), "canAttributesObserver").disconnect(), e.removeData(this, "canAttributesObserver")
      }
    };
    return function() {
      var e = "<-\n>",
        n = t.buildFragment(e, document);
      if (e !== n.childNodes[0].nodeValue) {
        var r = t.buildFragment;
        t.buildFragment = function(e, t) {
          var n = r(e, t);
          return n.childNodes.length === 1 && n.childNodes[0].nodeType === 3 && (n.childNodes[0].nodeValue = e), n
        }
      }
    }(), e.event.special.inserted = {}, e.event.special.removed = {}, t
  }), define("can/util/library", ["can/util/jquery"], function(e) {
    return e
  }), define("can/util/bind", ["can/util/library"], function(e) {
    return e.bindAndSetup = function() {
      return e.addEvent.apply(this, arguments), this._init || (this._bindings ? this._bindings++ : (this._bindings = 1, this._bindsetup && this._bindsetup())), this
    }, e.unbindAndTeardown = function(t, n) {
      return e.removeEvent.apply(this, arguments), this._bindings === null ? this._bindings = 0 : this._bindings--, !this._bindings && this._bindteardown && this._bindteardown(), this
    }, e
  }), define("can/map/bubble", ["can/util/library"], function(e) {
    var t = e.bubble = {
      event: function(e, t) {
        return e.constructor._bubbleRule(t, e)
      },
      childrenOf: function(e, n) {
        e._each(function(r, i) {
          r && r.bind && t.toParent(r, e, i, n)
        })
      },
      teardownChildrenFrom: function(e, n) {
        e._each(function(r) {
          t.teardownFromParent(e, r, n)
        })
      },
      toParent: function(t, n, r, i) {
        e.listenTo.call(n, t, i, function() {
          var i = e.makeArray(arguments),
            s = i.shift();
          i[0] = (e.List && n instanceof e.List ? n.indexOf(t) : r) + (i[0] ? "." + i[0] : ""), s.triggeredNS = s.triggeredNS || {};
          if (s.triggeredNS[n._cid]) return;
          s.triggeredNS[n._cid] = !0, e.trigger(n, s, i)
        })
      },
      teardownFromParent: function(t, n, r) {
        n && n.unbind && e.stopListening.call(t, n, r)
      },
      isBubbling: function(e, t) {
        return e._bubbleBindings && e._bubbleBindings[t]
      },
      bind: function(e, n) {
        if (!e._init) {
          var r = t.event(e, n);
          r && (e._bubbleBindings || (e._bubbleBindings = {}), e._bubbleBindings[r] ? e._bubbleBindings[r] ++ : (e._bubbleBindings[r] = 1, t.childrenOf(e, r)))
        }
      },
      unbind: function(n, r) {
        var i = t.event(n, r);
        i && (n._bubbleBindings && n._bubbleBindings[i] --, n._bubbleBindings && !n._bubbleBindings[i] && (delete n._bubbleBindings[i], t.teardownChildrenFrom(n, i), e.isEmptyObject(n._bubbleBindings) && delete n._bubbleBindings))
      },
      add: function(n, r, i) {
        if (r instanceof e.Map && n._bubbleBindings)
          for (var s in n._bubbleBindings) n._bubbleBindings[s] && (t.teardownFromParent(n, r, s), t.toParent(r, n, i, s))
      },
      removeMany: function(e, n) {
        for (var r = 0, i = n.length; r < i; r++) t.remove(e, n[r])
      },
      remove: function(n, r) {
        if (r instanceof e.Map && n._bubbleBindings)
          for (var i in n._bubbleBindings) n._bubbleBindings[i] && t.teardownFromParent(n, r, i)
      },
      set: function(n, r, i, s) {
        return e.Map.helpers.isObservable(i) && t.add(n, i, r), e.Map.helpers.isObservable(s) && t.remove(n, s), i
      }
    };
    return t
  }), define("can/util/string", ["can/util/library"], function(e) {
    var t = /_|-/,
      n = /\=\=/,
      r = /([A-Z]+)([A-Z][a-z])/g,
      i = /([a-z\d])([A-Z])/g,
      s = /([a-z\d])([A-Z])/g,
      o = /\{([^\}]+)\}/g,
      u = /"/g,
      a = /'/g,
      f = /-+(.)?/g,
      l = /[a-z][A-Z]/g,
      c = function(e, t, n) {
        var r = e[t];
        return r === undefined && n === !0 && (r = e[t] = {}), r
      },
      h = function(e) {
        return /^f|^o/.test(typeof e)
      },
      p = function(e) {
        var t = e === null || e === undefined || isNaN(e) && "" + e == "NaN";
        return "" + (t ? "" : e)
      };
    return e.extend(e, {
      esc: function(e) {
        return p(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(u, "&#34;").replace(a, "&#39;")
      },
      getObject: function(t, n, r) {
        var i = t ? t.split(".") : [],
          s = i.length,
          o, u = 0,
          a, f, l;
        n = e.isArray(n) ? n : [n || window], l = n.length;
        if (!s) return n[0];
        for (u; u < l; u++) {
          o = n[u], f = undefined;
          for (a = 0; a < s && h(o); a++) f = o, o = c(f, i[a]);
          if (f !== undefined && o !== undefined) break
        }
        r === !1 && o !== undefined && delete f[i[a - 1]];
        if (r === !0 && o === undefined) {
          o = n[0];
          for (a = 0; a < s && h(o); a++) o = c(o, i[a], !0)
        }
        return o
      },
      capitalize: function(e, t) {
        return e.charAt(0).toUpperCase() + e.slice(1)
      },
      camelize: function(e) {
        return p(e).replace(f, function(e, t) {
          return t ? t.toUpperCase() : ""
        })
      },
      hyphenate: function(e) {
        return p(e).replace(l, function(e, t) {
          return e.charAt(0) + "-" + e.charAt(1).toLowerCase()
        })
      },
      underscore: function(e) {
        return e.replace(n, "/").replace(r, "$1_$2").replace(i, "$1_$2").replace(s, "_").toLowerCase()
      },
      sub: function(t, n, r) {
        var i = [];
        return t = t || "", i.push(t.replace(o, function(t, s) {
          var o = e.getObject(s, n, r === !0 ? !1 : undefined);
          return o === undefined || o === null ? (i = null, "") : h(o) && i ? (i.push(o), "") : "" + o
        })), i === null ? i : i.length <= 1 ? i[0] : i
      },
      replacer: o,
      undHash: t
    }), e
  }), define("can/construct", ["can/util/string"], function(e) {
    var t = 0,
      n = function(e, t) {
        var n = Object.getOwnPropertyDescriptor(e, t);
        return n && (n.get || n.set) ? n : null
      },
      r = function(t, r, i) {
        i = i || t;
        var s;
        for (var o in t)(s = n(t, o)) ? this._defineProperty(i, r, o, s) : e.Construct._overwrite(i, r, o, t[o])
      },
      i = function(t, n, r) {
        r = r || t;
        for (var i in t) e.Construct._overwrite(r, n, i, t[i])
      };
    return e.Construct = function() {
      if (arguments.length) return e.Construct.extend.apply(e.Construct, arguments)
    }, e.extend(e.Construct, {
      constructorExtends: !0,
      newInstance: function() {
        var e = this.instance(),
          t;
        return e.setup && (t = e.setup.apply(e, arguments)), e.init && e.init.apply(e, t || arguments), e
      },
      _inherit: Object.getOwnPropertyDescriptor ? r : i,
      _defineProperty: function(e, t, n, r) {
        Object.defineProperty(e, n, r)
      },
      _overwrite: function(e, t, n, r) {
        e[n] = r
      },
      setup: function(t, n) {
        this.defaults = e.extend(!0, {}, t.defaults, this.defaults)
      },
      instance: function() {
        t = 1;
        var e = new this;
        return t = 0, e
      },
      extend: function(n, r, i) {
        function y() {
          if (!t) return this.constructor !== y && arguments.length && y.constructorExtends ? y.extend.apply(y, arguments) : y.newInstance.apply(y, arguments)
        }
        var s = n,
          o = r,
          u = i;
        typeof s != "string" && (u = o, o = s, s = null), u || (u = o, o = null), u = u || {};
        var a = this,
          f = this.prototype,
          l, c, h, p, d, v, m, g;
        g = this.instance(), e.Construct._inherit(u, f, g);
        for (d in a) a.hasOwnProperty(d) && (y[d] = a[d]);
        e.Construct._inherit(o, a, y), s && (l = s.split("."), v = l.pop(), c = e.getObject(l.join("."), window, !0), m = c, h = e.underscore(s.replace(/\./g, "_")), p = e.underscore(v), c[v] = y), e.extend(y, {
          constructor: y,
          prototype: g,
          namespace: m,
          _shortName: p,
          fullName: s,
          _fullName: h
        }), v !== undefined && (y.shortName = v), y.prototype.constructor = y;
        var b = [a].concat(e.makeArray(arguments)),
          w = y.setup.apply(y, b);
        return y.init && y.init.apply(y, w || b), y
      }
    }), e.Construct.prototype.setup = function() {}, e.Construct.prototype.init = function() {}, e.Construct
  }), define("can/util/batch", ["can/util/can"], function(e) {
    var t = 1,
      n = 0,
      r = [],
      i = [];
    e.batch = {
      start: function(e) {
        n++, e && i.push(e)
      },
      stop: function(s, o) {
        s ? n = 0 : n--;
        if (n === 0) {
          var u = r.slice(0),
            a = i.slice(0),
            f, l;
          r = [], i = [], t++, o && e.batch.start();
          for (f = 0, l = u.length; f < l; f++) e.dispatch.apply(u[f][0], u[f][1]);
          for (f = 0, l = a.length; f < a.length; f++) a[f]()
        }
      },
      trigger: function(i, s, o) {
        if (!i._init) {
          if (n === 0) return e.dispatch.call(i, s, o);
          s = typeof s == "string" ? {
            type: s
          } : s, s.batchNum = t, r.push([i, [s, o]])
        }
      }
    }
  }), define("can/map", ["can/util/library", "can/util/bind", "can/map/bubble", "can/construct", "can/util/batch"], function(e, t, n) {
    var r = null,
      i = function() {
        for (var e in r) r[e].added && delete r[e].obj._cid;
        r = null
      },
      s = function(e) {
        return r && r[e._cid] && r[e._cid].instance
      },
      o = null,
      u = e.Map = e.Construct.extend({
        setup: function() {
          e.Construct.setup.apply(this, arguments);
          if (e.Map) {
            this.defaults || (this.defaults = {}), this._computes = [];
            for (var t in this.prototype) t !== "define" && t !== "constructor" && (typeof this.prototype[t] != "function" || this.prototype[t].prototype instanceof e.Construct) ? this.defaults[t] = this.prototype[t] : this.prototype[t].isComputed && this._computes.push(t);
            this.helpers.define && this.helpers.define(this)
          }
          e.List && !(this.prototype instanceof e.List) && (this.List = u.List.extend({
            Map: this
          }, {}))
        },
        _bubble: n,
        _bubbleRule: function(e) {
          return (e === "change" || e.indexOf(".") >= 0) && "change"
        },
        _computes: [],
        bind: e.bindAndSetup,
        on: e.bindAndSetup,
        unbind: e.unbindAndTeardown,
        off: e.unbindAndTeardown,
        id: "id",
        helpers: {
          define: null,
          attrParts: function(e, t) {
            return t ? [e] : typeof e == "object" ? e : ("" + e).split(".")
          },
          addToMap: function(t, n) {
            var s;
            r || (s = i, r = {});
            var o = t._cid,
              u = e.cid(t);
            return r[u] || (r[u] = {
              obj: t,
              instance: n,
              added: !o
            }), s
          },
          isObservable: function(t) {
            return t instanceof e.Map || t && t === e.route
          },
          canMakeObserve: function(t) {
            return t && !e.isDeferred(t) && (e.isArray(t) || e.isPlainObject(t))
          },
          serialize: function(t, n, r) {
            var i = e.cid(t),
              s = !1;
            return o || (s = !0, o = {
              attr: {},
              serialize: {}
            }), o[n][i] = r, t.each(function(i, s) {
              var a, f = u.helpers.isObservable(i),
                l = f && o[n][e.cid(i)];
              l ? a = l : n === "serialize" ? a = u.helpers._serialize(t, s, i) : a = u.helpers._getValue(t, s, i, n), a !== undefined && (r[s] = a)
            }), e.__reading(t, "__keys"), s && (o = null), r
          },
          _serialize: function(e, t, n) {
            return u.helpers._getValue(e, t, n, "serialize")
          },
          _getValue: function(e, t, n, r) {
            return u.helpers.isObservable(n) ? n[r]() : n
          }
        },
        keys: function(t) {
          var n = [];
          e.__reading(t, "__keys");
          for (var r in t._data) n.push(r);
          return n
        }
      }, {
        setup: function(t) {
          t instanceof e.Map && (t = t.serialize()), this._data = {}, e.cid(this, ".map"), this._init = 1, this._computedBindings = {};
          var n = this._setupDefaults(t);
          this._setupComputes(n);
          var r = t && e.Map.helpers.addToMap(t, this),
            i = e.extend(e.extend(!0, {}, n), t);
          this.attr(i), r && r(), this.bind("change", e.proxy(this._changes, this)), delete this._init
        },
        _setupComputes: function() {
          var e = this.constructor._computes;
          for (var t = 0, n = e.length, r; t < n; t++) r = e[t], this[r] = this[r].clone(this), this._computedBindings[r] = {
            count: 0
          }
        },
        _setupDefaults: function() {
          return this.constructor.defaults || {}
        },
        _bindsetup: function() {},
        _bindteardown: function() {},
        _changes: function(t, n, r, i, s) {
          e.batch.trigger(this, {
            type: n,
            batchNum: t.batchNum,
            target: t.target
          }, [i, s])
        },
        _triggerChange: function(t, r, i, s) {
          n.isBubbling(this, "change") ? e.batch.trigger(this, {
            type: "change",
            target: this
          }, [t, r, i, s]) : e.batch.trigger(this, t, [i, s]), (r === "remove" || r === "add") && e.batch.trigger(this, {
            type: "__keys",
            target: this
          })
        },
        _each: function(e) {
          var t = this.__get();
          for (var n in t) t.hasOwnProperty(n) && e(t[n], n)
        },
        attr: function(t, n) {
          var r = typeof t;
          return r !== "string" && r !== "number" ? this._attrs(t, n) : arguments.length === 1 ? (e.__reading(this, t), this._get(t)) : (this._set(t, n), this)
        },
        each: function() {
          return e.each.apply(undefined, [this].concat(e.makeArray(arguments)))
        },
        removeAttr: function(t) {
          var n = e.List && this instanceof e.List,
            r = e.Map.helpers.attrParts(t),
            i = r.shift(),
            s = n ? this[i] : this._data[i];
          return r.length && s ? s.removeAttr(r) : (typeof t == "string" && !!~t.indexOf(".") && (i = t), this._remove(i, s), s)
        },
        _remove: function(e, t) {
          e in this._data && (delete this._data[e], e in this.constructor.prototype || delete this[e], this._triggerChange(e, "remove", undefined, t))
        },
        _get: function(e) {
          e = "" + e;
          var t = e.indexOf(".");
          if (t >= 0) {
            var n = this.__get(e);
            if (n !== undefined) return n;
            var r = e.substr(0, t),
              i = e.substr(t + 1),
              s = this.__get(r);
            return s && s._get ? s._get(i) : undefined
          }
          return this.__get(e)
        },
        __get: function(e) {
          return e ? this._computedBindings[e] ? this[e]() : this._data[e] : this._data
        },
        __type: function(t, n) {
          if (!(t instanceof e.Map) && e.Map.helpers.canMakeObserve(t)) {
            var r = s(t);
            if (r) return r;
            if (e.isArray(t)) {
              var i = e.List;
              return new i(t)
            }
            var o = this.constructor.Map || e.Map;
            return new o(t)
          }
          return t
        },
        _set: function(e, t, n) {
          e = "" + e;
          var r = e.indexOf("."),
            i;
          if (!n && r >= 0) {
            var s = e.substr(0, r),
              o = e.substr(r + 1);
            i = this._init ? undefined : this.__get(s);
            if (!u.helpers.isObservable(i)) throw "can.Map: Object does not exist";
            i._set(o, t)
          } else this.__convert && (t = this.__convert(e, t)), i = this._init ? undefined : this.__get(e), this.__set(e, this.__type(t, e), i)
        },
        __set: function(e, t, n) {
          if (t !== n) {
            var r = n !== undefined || this.__get().hasOwnProperty(e) ? "set" : "add";
            this.___set(e, this.constructor._bubble.set(this, e, t, n)), this._triggerChange(e, r, t, n), n && this.constructor._bubble.teardownFromParent(this, n)
          }
        },
        ___set: function(e, t) {
          this._computedBindings[e] ? this[e](t) : this._data[e] = t, typeof this.constructor.prototype[e] != "function" && !this._computedBindings[e] && (this[e] = t)
        },
        bind: function(t, n) {
          var r = this._computedBindings && this._computedBindings[t];
          if (r)
            if (!r.count) {
              r.count = 1;
              var i = this;
              r.handler = function(n, r, s) {
                e.batch.trigger(i, {
                  type: t,
                  batchNum: n.batchNum,
                  target: i
                }, [r, s])
              }, this[t].bind("change", r.handler)
            } else r.count++;
          return this.constructor._bubble.bind(this, t), e.bindAndSetup.apply(this, arguments)
        },
        unbind: function(t, n) {
          var r = this._computedBindings && this._computedBindings[t];
          return r && (r.count === 1 ? (r.count = 0, this[t].unbind("change", r.handler), delete r.handler) : r.count--), this.constructor._bubble.unbind(this, t), e.unbindAndTeardown.apply(this, arguments)
        },
        serialize: function() {
          return e.Map.helpers.serialize(this, "serialize", {})
        },
        _attrs: function(t, n) {
          if (t === undefined) return u.helpers.serialize(this, "attr", {});
          t = e.simpleExtend({}, t);
          var r, i = this,
            s;
          e.batch.start(), this.each(function(e, r) {
            if (r === "_cid") return;
            s = t[r];
            if (s === undefined) {
              n && i.removeAttr(r);
              return
            }
            i.__convert && (s = i.__convert(r, s)), u.helpers.isObservable(s) ? i.__set(r, i.__type(s, r), e) : u.helpers.isObservable(e) && u.helpers.canMakeObserve(s) ? e.attr(s, n) : e !== s && i.__set(r, i.__type(s, r), e), delete t[r]
          });
          for (r in t) r !== "_cid" && (s = t[r], this._set(r, s, !0));
          return e.batch.stop(), this
        },
        compute: function(t) {
          if (e.isFunction(this.constructor.prototype[t])) return e.compute(this[t], this);
          var n = t.split("."),
            r = n.length - 1,
            i = {
              args: []
            };
          return e.compute(function(t) {
            if (!arguments.length) return e.compute.read(this, n, i).value;
            e.compute.read(this, n.slice(0, r)).value.attr(n[r], t)
          }, this)
        }
      });
    return u.prototype.on = u.prototype.bind, u.prototype.off = u.prototype.unbind, u
  }), define("can/list", ["can/util/library", "can/map", "can/map/bubble"], function(e, t, n) {
    var r = [].splice,
      i = function() {
        var e = {
          0: "a",
          length: 1
        };
        return r.call(e, 0, 1), !e[0]
      }(),
      s = t.extend({
        Map: t
      }, {
        setup: function(t, n) {
          this.length = 0, e.cid(this, ".map"), this._init = 1, this._computedBindings = {}, this._setupComputes(), t = t || [];
          var r;
          e.isDeferred(t) ? this.replace(t) : (r = t.length && e.Map.helpers.addToMap(t, this), this.push.apply(this, e.makeArray(t || []))), r && r(), this.bind("change", e.proxy(this._changes, this)), e.simpleExtend(this, n), delete this._init
        },
        _triggerChange: function(n, r, i, s) {
          t.prototype._triggerChange.apply(this, arguments);
          var o = +n;
          !~n.indexOf(".") && !isNaN(o) && (r === "add" ? (e.batch.trigger(this, r, [i, o]), e.batch.trigger(this, "length", [this.length])) : r === "remove" ? (e.batch.trigger(this, r, [s, o]), e.batch.trigger(this, "length", [this.length])) : e.batch.trigger(this, r, [i, o]))
        },
        __get: function(t) {
          return t ? this[t] && this[t].isComputed && e.isFunction(this.constructor.prototype[t]) ? this[t]() : this[t] : this
        },
        ___set: function(e, t) {
          this[e] = t, +e >= this.length && (this.length = +e + 1)
        },
        _remove: function(e, t) {
          isNaN(+e) ? (delete this[e], this._triggerChange(e, "remove", undefined, t)) : this.splice(e, 1)
        },
        _each: function(e) {
          var t = this.__get();
          for (var n = 0; n < t.length; n++) e(t[n], n)
        },
        serialize: function() {
          return t.helpers.serialize(this, "serialize", [])
        },
        splice: function(t, s) {
          var o = e.makeArray(arguments),
            u = [],
            a, f;
          for (a = 2, f = o.length; a < f; a++) o[a] = this.__type(o[a], a), u.push(o[a]);
          s === undefined && (s = o[1] = this.length - t);
          var l = r.apply(this, o);
          if (!i)
            for (a = this.length; a < l.length + this.length; a++) delete this[a];
          e.batch.start(), s > 0 && (n.removeMany(this, l), this._triggerChange("" + t, "remove", undefined, l));
          if (o.length > 2) {
            for (a = 0, f = u.length; a < f; a++) n.set(this, a, u[a]);
            this._triggerChange("" + t, "add", u, l)
          }
          return e.batch.stop(), l
        },
        _attrs: function(n, r) {
          if (n === undefined) return t.helpers.serialize(this, "attr", []);
          n = e.makeArray(n), e.batch.start(), this._updateAttrs(n, r), e.batch.stop()
        },
        _updateAttrs: function(e, n) {
          var r = Math.min(e.length, this.length);
          for (var i = 0; i < r; i++) {
            var s = this[i],
              o = e[i];
            t.helpers.isObservable(s) && t.helpers.canMakeObserve(o) ? s.attr(o, n) : s !== o && this._set(i, o)
          }
          e.length > this.length ? this.push.apply(this, e.slice(this.length)) : e.length < this.length && n && this.splice(e.length)
        }
      }),
      o = function(t) {
        return t[0] && e.isArray(t[0]) ? t[0] : e.makeArray(t)
      };
    return e.each({
      push: "length",
      unshift: 0
    }, function(e, t) {
      var r = [][t];
      s.prototype[t] = function() {
        var t = [],
          i = e ? this.length : 0,
          s = arguments.length,
          o, u;
        while (s--) u = arguments[s], t[s] = n.set(this, s, this.__type(u, s));
        return o = r.apply(this, t), (!this.comparator || t.length) && this._triggerChange("" + i, "add", t, undefined), o
      }
    }), e.each({
      pop: "length",
      shift: 0
    }, function(e, t) {
      s.prototype[t] = function() {
        var r = o(arguments),
          i = e && this.length ? this.length - 1 : 0,
          s = [][t].apply(this, r);
        return this._triggerChange("" + i, "remove", undefined, [s]), s && s.unbind && n.remove(this, s), s
      }
    }), e.extend(s.prototype, {
      indexOf: function(t, n) {
        return this.attr("length"), e.inArray(t, this, n)
      },
      join: function() {
        return [].join.apply(this.attr(), arguments)
      },
      reverse: function() {
        var t = e.makeArray([].reverse.call(this));
        this.replace(t)
      },
      slice: function() {
        var e = Array.prototype.slice.apply(this, arguments);
        return new this.constructor(e)
      },
      concat: function() {
        var t = [];
        return e.each(e.makeArray(arguments), function(n, r) {
          t[r] = n instanceof e.List ? n.serialize() : n
        }), new this.constructor(Array.prototype.concat.apply(this.serialize(), t))
      },
      forEach: function(t, n) {
        return e.each(this, t, n || this)
      },
      replace: function(t) {
        return e.isDeferred(t) ? t.then(e.proxy(this.replace, this)) : this.splice.apply(this, [0, this.length].concat(e.makeArray(t || []))), this
      },
      filter: function(t, n) {
        var r = new e.List,
          i = this,
          s;
        return this.each(function(e, o, u) {
          s = t.call(n | i, e, o, i), s && r.push(e)
        }), r
      }
    }), e.List = t.List = s, e.List
  }), define("can/util/string/deparam", ["can/util/library", "can/util/string"], function(e) {
    var t = /^\d+$/,
      n = /([^\[\]]+)|(\[\])/g,
      r = /([^?#]*)(#.*)?$/,
      i = function(e) {
        return decodeURIComponent(e.replace(/\+/g, " "))
      };
    return e.extend(e, {
      deparam: function(s) {
        var o = {},
          u, a;
        return s && r.test(s) && (u = s.split("&"), e.each(u, function(e) {
          var r = e.split("="),
            s = i(r.shift()),
            u = i(r.join("=")),
            f = o;
          if (s) {
            r = s.match(n);
            for (var l = 0, c = r.length - 1; l < c; l++) f[r[l]] || (f[r[l]] = t.test(r[l + 1]) || r[l + 1] === "[]" ? [] : {}), f = f[r[l]];
            a = r.pop(), a === "[]" ? f.push(u) : f[a] = u
          }
        })), o
      }
    }), e
  }), define("can/route", ["can/util/library", "can/map", "can/list", "can/util/string/deparam"], function(e) {
    var t = /\:([\w\.]+)/g,
      n = /^(?:&[^=]+=[^&]*)+/,
      r = function(t) {
        var n = [];
        return e.each(t, function(t, r) {
          n.push((r === "className" ? "class" : r) + '="' + (r === "href" ? t : e.esc(t)) + '"')
        }), n.join(" ")
      },
      i = function(e, t) {
        var n = 0,
          r = 0,
          i = {};
        for (var s in e.defaults) e.defaults[s] === t[s] && (i[s] = 1, n++);
        for (; r < e.names.length; r++) {
          if (!t.hasOwnProperty(e.names[r])) return -1;
          i[e.names[r]] || n++
        }
        return n
      },
      s = window.location,
      o = function(e) {
        return (e + "").replace(/([.?*+\^$\[\]\\(){}|\-])/g, "\\$1")
      },
      u = e.each,
      a = e.extend,
      f = function(t) {
        return t && typeof t == "object" ? (t instanceof e.Map ? t = t.attr() : t = e.isFunction(t.slice) ? t.slice() : e.extend({}, t), e.each(t, function(e, n) {
          t[n] = f(e)
        })) : t !== undefined && t !== null && e.isFunction(t.toString) && (t = t.toString()), t
      },
      l = function(e) {
        return e.replace(/\\/g, "")
      },
      c, h, p, d, v = function(t, n, r, i) {
        d = 1, clearTimeout(c), c = setTimeout(function() {
          d = 0;
          var t = e.route.data.serialize(),
            n = e.route.param(t, !0);
          e.route._call("setURL", n), e.batch.trigger(m, "__url", [n, p]), p = n
        }, 10)
      },
      m = e.extend({}, e.event);
    e.route = function(n, r) {
      var i = e.route._call("root");
      i.lastIndexOf("/") === i.length - 1 && n.indexOf("/") === 0 && (n = n.substr(1)), r = r || {};
      var s = [],
        u, a = "",
        f = t.lastIndex = 0,
        c, h = e.route._call("querySeparator"),
        p = e.route._call("matchSlashes");
      while (u = t.exec(n)) s.push(u[1]), a += l(n.substring(f, t.lastIndex - u[0].length)), c = "\\" + (l(n.substr(t.lastIndex, 1)) || h + (p ? "" : "|/")), a += "([^" + c + "]" + (r[u[1]] ? "*" : "+") + ")", f = t.lastIndex;
      return a += n.substr(f).replace("\\", ""), e.route.routes[n] = {
        test: new RegExp("^" + a + "($|" + o(h) + ")"),
        route: n,
        names: s,
        defaults: r,
        length: n.split("/").length
      }, e.route
    }, a(e.route, {
      param: function(n, r) {
        var s, o = 0,
          f, l = n.route,
          c = 0;
        delete n.route, u(n, function() {
          c++
        }), u(e.route.routes, function(e, t) {
          f = i(e, n), f > o && (s = e, o = f);
          if (f >= c) return !1
        }), e.route.routes[l] && i(e.route.routes[l], n) === o && (s = e.route.routes[l]);
        if (s) {
          var h = a({}, n),
            p = s.route.replace(t, function(e, t) {
              return delete h[t], n[t] === s.defaults[t] ? "" : encodeURIComponent(n[t])
            }).replace("\\", ""),
            d;
          return u(s.defaults, function(e, t) {
            h[t] === e && delete h[t]
          }), d = e.param(h), r && e.route.attr("route", s.route), p + (d ? e.route._call("querySeparator") + d : "")
        }
        return e.isEmptyObject(n) ? "" : e.route._call("querySeparator") + e.param(n)
      },
      deparam: function(t) {
        var n = e.route._call("root");
        n.lastIndexOf("/") === n.length - 1 && t.indexOf("/") === 0 && (t = t.substr(1));
        var r = {
            length: -1
          },
          i = e.route._call("querySeparator"),
          s = e.route._call("paramsMatcher");
        u(e.route.routes, function(e, n) {
          e.test.test(t) && e.length > r.length && (r = e)
        });
        if (r.length > -1) {
          var o = t.match(r.test),
            f = o.shift(),
            l = t.substr(f.length - (o[o.length - 1] === i ? 1 : 0)),
            c = l && s.test(l) ? e.deparam(l.slice(1)) : {};
          return c = a(!0, {}, r.defaults, c), u(o, function(e, t) {
            e && e !== i && (c[r.names[t]] = decodeURIComponent(e))
          }), c.route = r.route, c
        }
        return t.charAt(0) !== i && (t = i + t), s.test(t) ? e.deparam(t.slice(1)) : {}
      },
      data: new e.Map({}),
      map: function(t) {
        var n;
        t.prototype instanceof e.Map ? n = new t : n = t, e.route.data = n
      },
      routes: {},
      ready: function(t) {
        return t !== !0 && (e.route._setup(), e.route.setState()), e.route
      },
      url: function(t, n) {
        return n && (t = e.extend({}, e.route.deparam(e.route._call("matchingPartOfURL")), t)), e.route._call("root") + e.route.param(t)
      },
      link: function(t, n, i, s) {
        return "<a " + r(a({
          href: e.route.url(n, s)
        }, i)) + ">" + t + "</a>"
      },
      current: function(t) {
        return e.__reading(m, "__url"), this._call("matchingPartOfURL") === e.route.param(t)
      },
      bindings: {
        hashchange: {
          paramsMatcher: n,
          querySeparator: "&",
          matchSlashes: !1,
          bind: function() {
            e.bind.call(window, "hashchange", g)
          },
          unbind: function() {
            e.unbind.call(window, "hashchange", g)
          },
          matchingPartOfURL: function() {
            return s.href.split(/#!?/)[1] || ""
          },
          setURL: function(e) {
            return s.hash = "#!" + e, e
          },
          root: "#!"
        }
      },
      defaultBinding: "hashchange",
      currentBinding: null,
      _setup: function() {
        e.route.currentBinding || (e.route._call("bind"), e.route.bind("change", v), e.route.currentBinding = e.route.defaultBinding)
      },
      _teardown: function() {
        e.route.currentBinding && (e.route._call("unbind"), e.route.unbind("change", v), e.route.currentBinding = null), clearTimeout(c), d = 0
      },
      _call: function() {
        var t = e.makeArray(arguments),
          n = t.shift(),
          r = e.route.bindings[e.route.currentBinding || e.route.defaultBinding],
          i = r[n];
        return i.apply ? i.apply(r, t) : i
      }
    }), u(["bind", "unbind", "on", "off", "delegate", "undelegate", "removeAttr", "compute", "_get", "__get", "each"], function(t) {
      e.route[t] = function() {
        if (!e.route.data[t]) return;
        return e.route.data[t].apply(e.route.data, arguments)
      }
    }), e.route.attr = function(t, n) {
      var r = typeof t,
        i;
      return n === undefined ? i = arguments : r !== "string" && r !== "number" ? i = [f(t), n] : i = [t, f(n)], e.route.data.attr.apply(e.route.data, i)
    };
    var g = e.route.setState = function() {
      var t = e.route._call("matchingPartOfURL"),
        n = h;
      h = e.route.deparam(t);
      if (!d || t !== p) {
        e.batch.start();
        for (var r in n) h[r] || e.route.removeAttr(r);
        e.route.attr(h), e.batch.trigger(m, "__url", [t, p]), e.batch.stop()
      }
    };
    return e.route
  }), define("can/control", ["can/util/library", "can/construct"], function(e) {
    var t = function(t, n, r) {
        return e.bind.call(t, n, r),
          function() {
            e.unbind.call(t, n, r)
          }
      },
      n = e.isFunction,
      r = e.extend,
      i = e.each,
      s = [].slice,
      o = /\{([^\}]+)\}/g,
      u = e.getObject("$.event.special", [e]) || {},
      a = function(t, n, r, i) {
        return e.delegate.call(t, n, r, i),
          function() {
            e.undelegate.call(t, n, r, i)
          }
      },
      f = function(n, r, i, s) {
        return s ? a(n, e.trim(s), r, i) : t(n, r, i)
      },
      l, c = e.Control = e.Construct({
        setup: function() {
          e.Construct.setup.apply(this, arguments);
          if (e.Control) {
            var t = this,
              n;
            t.actions = {};
            for (n in t.prototype) t._isAction(n) && (t.actions[n] = t._action(n))
          }
        },
        _shifter: function(t, r) {
          var i = typeof r == "string" ? t[r] : r;
          return n(i) || (i = t[i]),
            function() {
              return t.called = r, i.apply(t, [this.nodeName ? e.$(this) : this].concat(s.call(arguments, 0)))
            }
        },
        _isAction: function(e) {
          var t = this.prototype[e],
            r = typeof t;
          return e !== "constructor" && (r === "function" || r === "string" && n(this.prototype[t])) && !!(u[e] || h[e] || /[^\w]/.test(e))
        },
        _action: function(t, n) {
          o.lastIndex = 0;
          if (n || !o.test(t)) {
            var r = n ? e.sub(t, this._lookup(n)) : t;
            if (!r) return null;
            var i = e.isArray(r),
              s = i ? r[1] : r,
              u = s.split(/\s+/g),
              a = u.pop();
            return {
              processor: h[a] || l,
              parts: [s, u.join(" "), a],
              delegate: i ? r[0] : undefined
            }
          }
        },
        _lookup: function(e) {
          return [e, window]
        },
        processors: {},
        defaults: {}
      }, {
        setup: function(t, n) {
          var i = this.constructor,
            s = i.pluginName || i._fullName,
            o;
          return this.element = e.$(t), s && s !== "can_control" && this.element.addClass(s), o = e.data(this.element, "controls"), o || (o = [], e.data(this.element, "controls", o)), o.push(this), this.options = r({}, i.defaults, n), this.on(), [this.element, this.options]
        },
        on: function(t, n, r, i) {
          if (!t) {
            this.off();
            var s = this.constructor,
              o = this._bindings,
              u = s.actions,
              a = this.element,
              l = e.Control._shifter(this, "destroy"),
              c, h;
            for (c in u) u.hasOwnProperty(c) && (h = u[c] || s._action(c, this.options, this), h && (o.control[c] = h.processor(h.delegate || a, h.parts[2], h.parts[1], c, this)));
            return e.bind.call(a, "removed", l), o.user.push(function(t) {
              e.unbind.call(t, "removed", l)
            }), o.user.length
          }
          return typeof t == "string" && (i = r, r = n, n = t, t = this.element), i === undefined && (i = r, r = n, n = null), typeof i == "string" && (i = e.Control._shifter(this, i)), this._bindings.user.push(f(t, r, i, n)), this._bindings.user.length
        },
        off: function() {
          var e = this.element[0],
            t = this._bindings;
          t && (i(t.user || [], function(t) {
            t(e)
          }), i(t.control || {}, function(t) {
            t(e)
          })), this._bindings = {
            user: [],
            control: {}
          }
        },
        destroy: function() {
          if (this.element === null) return;
          var t = this.constructor,
            n = t.pluginName || t._fullName,
            r;
          this.off(), n && n !== "can_control" && this.element.removeClass(n), r = e.data(this.element, "controls"), r.splice(e.inArray(this, r), 1), e.trigger(this, "destroyed"), this.element = null
        }
      }),
      h = e.Control.processors;
    return l = function(t, n, r, i, s) {
      return f(t, n, e.Control._shifter(s, i), r)
    }, i(["change", "click", "contextmenu", "dblclick", "keydown", "keyup", "keypress", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "reset", "resize", "scroll", "select", "submit", "focusin", "focusout", "mouseenter", "mouseleave", "touchstart", "touchmove", "touchcancel", "touchend", "touchleave", "inserted", "removed"], function(e) {
      h[e] = l
    }), c
  }), define("can/control/route", ["can/util/library", "can/route", "can/control"], function(e) {
    return e.Control.processors.route = function(t, n, r, i, s) {
      r = r || "", e.route.routes[r] || (r[0] === "/" && (r = r.substring(1)), e.route(r));
      var o, u = function(t, n, u) {
        if (e.route.attr("route") === r && (t.batchNum === undefined || t.batchNum !== o)) {
          o = t.batchNum;
          var a = e.route.attr();
          delete a.route, e.isFunction(s[i]) ? s[i](a) : s[s[i]](a)
        }
      };
      return e.route.bind("change", u),
        function() {
          e.route.unbind("change", u)
        }
    }, e
  }), define("can/model", ["can/util/library", "can/map", "can/list"], function(e) {
    var t = function(t, n, r) {
        var i = new e.Deferred;
        return t.then(function() {
          var t = e.makeArray(arguments),
            s = !0;
          try {
            t[0] = r.apply(n, t)
          } catch (o) {
            s = !1, i.rejectWith(i, [o].concat(t))
          }
          s && i.resolveWith(i, t)
        }, function() {
          i.rejectWith(this, arguments)
        }), typeof t.abort == "function" && (i.abort = function() {
          return t.abort()
        }), i
      },
      n = 0,
      r = function(t) {
        return e.__reading(t, t.constructor.id), t.__get(t.constructor.id)
      },
      i = function(t, n, r, i, s, o) {
        var u = {};
        if (typeof t == "string") {
          var a = t.split(/\s+/);
          u.url = a.pop(), a.length && (u.type = a.pop())
        } else e.extend(u, t);
        return u.data = typeof n == "object" && !e.isArray(n) ? e.extend(u.data || {}, n) : n, u.url = e.sub(u.url, u.data, !0), e.ajax(e.extend({
          type: r || "post",
          dataType: i || "json",
          success: s,
          error: o
        }, u))
      },
      s = function(n, i, s, o, u) {
        var a;
        e.isArray(n) ? (a = n[1], n = n[0]) : a = n.serialize(), a = [a];
        var f, l = n.constructor,
          c;
        return (i === "update" || i === "destroy") && a.unshift(r(n)), c = l[i].apply(l, a), f = t(c, n, function(e) {
          return n[u || i + "d"](e, c), n
        }), c.abort && (f.abort = function() {
          c.abort()
        }), f.then(s, o), f
      },
      o = {
        models: function(t, n, r) {
          e.Model._reqs++;
          if (!t) return;
          if (t instanceof this.List) return t;
          var i = this,
            s = [],
            o = i.List || d,
            u = n instanceof e.List ? n : new o,
            a = t instanceof d,
            f = a ? t.serialize() : t;
          f = i.parseModels(f, r), f.data && (t = f, f = f.data);
          if (typeof f == "undefined") throw new Error("Could not get any raw data while converting using .models");
          return u.length && u.splice(0), e.each(f, function(e) {
            s.push(i.model(e, r))
          }), u.push.apply(u, s), e.isArray(t) || e.each(t, function(e, t) {
            t !== "data" && u.attr(t, e)
          }), setTimeout(e.proxy(this._clean, this), 1), u
        },
        model: function(t, n, r) {
          if (!t) return;
          typeof t.serialize == "function" ? t = t.serialize() : t = this.parseModel(t, r);
          var i = t[this.id];
          (i || i === 0) && this.store[i] && (n = this.store[i]);
          var s = n && e.isFunction(n.attr) ? n.attr(t, this.removeAttr || !1) : new this(t);
          return s
        }
      },
      u = {
        parseModel: function(t) {
          return function(n) {
            return t ? e.getObject(t, n) : n
          }
        },
        parseModels: function(t) {
          return function(n) {
            if (e.isArray(n)) return n;
            t = t || "data";
            var r = e.getObject(t, n);
            if (!e.isArray(r)) throw new Error("Could not get any raw data while converting using .models");
            return r
          }
        }
      },
      a = {
        create: {
          url: "_shortName",
          type: "post"
        },
        update: {
          data: function(t, n) {
            n = n || {};
            var r = this.id;
            return n[r] && n[r] !== t && (n["new" + e.capitalize(t)] = n[r], delete n[r]), n[r] = t, n
          },
          type: "put"
        },
        destroy: {
          type: "delete",
          data: function(e, t) {
            return t = t || {}, t.id = t[this.id] = e, t
          }
        },
        findAll: {
          url: "_shortName"
        },
        findOne: {}
      },
      f = function(e, t) {
        return function(n) {
          return n = e.data ? e.data.apply(this, arguments) : n, i(t || this[e.url || "_url"], n, e.type || "get")
        }
      },
      l = function(e, t) {
        if (!e.resource) return;
        var n = e.resource.replace(/\/+$/, "");
        return t === "findAll" || t === "create" ? n : n + "/{" + e.id + "}"
      };
    e.Model = e.Map.extend({
      fullName: "can.Model",
      _reqs: 0,
      setup: function(t, r, i, s) {
        typeof r != "string" && (s = i, i = r), s || (s = i), this.store = {}, e.Map.setup.apply(this, arguments);
        if (!e.Model) return;
        i && i.List ? (this.List = i.List, this.List.Map = this) : this.List = t.List.extend({
          Map: this
        }, {});
        var c = this,
          h = e.proxy(this._clean, c);
        e.each(a, function(n, r) {
          i && i[r] && (typeof i[r] == "string" || typeof i[r] == "object") ? c[r] = f(n, i[r]) : i && i.resource && !e.isFunction(i[r]) && (c[r] = f(n, l(c, r)));
          if (c["make" + e.capitalize(r)]) {
            var s = c["make" + e.capitalize(r)](c[r]);
            e.Construct._overwrite(c, t, r, function() {
              e.Model._reqs++;
              var t = s.apply(this, arguments),
                n = t.then(h, h);
              return n.abort = t.abort, n
            })
          }
        });
        var p = {};
        e.each(o, function(n, r) {
          var s = "parse" + e.capitalize(r),
            o = i && i[r] || c[r];
          typeof o == "string" ? (c[s] = o, e.Construct._overwrite(c, t, r, n)) : i && i[r] && (p[s] = !0)
        }), e.each(u, function(n, r) {
          var s = i && i[r] || c[r];
          if (typeof s == "string") e.Construct._overwrite(c, t, r, n(s));
          else if ((!i || !e.isFunction(i[r])) && !c[r]) {
            var o = n();
            o.useModelConverter = p[r], e.Construct._overwrite(c, t, r, o)
          }
        });
        if (c.fullName === "can.Model" || !c.fullName) c.fullName = "Model" + ++n;
        e.Model._reqs = 0, this._url = this._shortName + "/{" + this.id + "}"
      },
      _ajax: f,
      _makeRequest: s,
      _clean: function() {
        e.Model._reqs--;
        if (!e.Model._reqs)
          for (var t in this.store) this.store[t]._bindings || delete this.store[t];
        return arguments[0]
      },
      models: o.models,
      model: o.model
    }, {
      setup: function(t) {
        var n = t && t[this.constructor.id];
        e.Model._reqs && n != null && (this.constructor.store[n] = this), e.Map.prototype.setup.apply(this, arguments)
      },
      isNew: function() {
        var e = r(this);
        return !e && e !== 0
      },
      save: function(e, t) {
        return s(this, this.isNew() ? "create" : "update", e, t)
      },
      destroy: function(t, n) {
        if (this.isNew()) {
          var r = this,
            i = e.Deferred();
          return i.then(t, n), i.done(function(e) {
            r.destroyed(e)
          }).resolve(r)
        }
        return s(this, "destroy", t, n, "destroyed")
      },
      _bindsetup: function() {
        return this.constructor.store[this.__get(this.constructor.id)] = this, e.Map.prototype._bindsetup.apply(this, arguments)
      },
      _bindteardown: function() {
        return delete this.constructor.store[r(this)], e.Map.prototype._bindteardown.apply(this, arguments)
      },
      ___set: function(t, n) {
        e.Map.prototype.___set.call(this, t, n), t === this.constructor.id && this._bindings && (this.constructor.store[r(this)] = this)
      }
    });
    var c = function(e) {
        return function(t, n, r) {
          return this[e](t, null, r)
        }
      },
      h = function(e) {
        return this.parseModel.useModelConverter ? this.model(e) : this.parseModel(e)
      },
      p = {
        makeFindAll: c("models"),
        makeFindOne: c("model"),
        makeCreate: h,
        makeUpdate: h
      };
    e.each(p, function(n, r) {
      e.Model[r] = function(r) {
        return function() {
          var i = e.makeArray(arguments),
            s = e.isFunction(i[1]) ? i.splice(0, 1) : i.splice(0, 2),
            o = t(r.apply(this, s), this, n);
          return o.then(i[0], i[1]), o
        }
      }
    }), e.each(["created", "updated", "destroyed"], function(t) {
      e.Model.prototype[t] = function(n) {
        var r = this,
          i = r.constructor;
        n && typeof n == "object" && this.attr(e.isFunction(n.attr) ? n.attr() : n), e.dispatch.call(this, {
          type: "change",
          target: this
        }, [t]), e.dispatch.call(i, t, [this])
      }
    });
    var d = e.Model.List = e.List.extend({
      _bubbleRule: function(t, n) {
        return e.List._bubbleRule(t, n) || "destroyed"
      }
    }, {
      setup: function(t) {
        e.isPlainObject(t) && !e.isArray(t) ? (e.List.prototype.setup.apply(this), this.replace(e.isDeferred(t) ? t : this.constructor.Map.findAll(t))) : e.List.prototype.setup.apply(this, arguments), this._init = 1, this.bind("destroyed", e.proxy(this._destroyed, this)), delete this._init
      },
      _destroyed: function(e, t) {
        if (/\w+/.test(t)) {
          var n;
          while ((n = this.indexOf(e.target)) > -1) this.splice(n, 1)
        }
      }
    });
    return e.Model
  }), define("can/view", ["can/util/library"], function(e) {
    var t = e.isFunction,
      n = e.makeArray,
      r = 1,
      i = function(e) {
        var t = function() {
          return f.frag(e.apply(this, arguments))
        };
        return t.render = function() {
          return e.apply(e, arguments)
        }, t
      },
      s = function(e, t) {
        if (!e.length) throw "can.view: No template or empty template:" + t
      },
      o = function(n, r) {
        if (t(n)) {
          var i = e.Deferred();
          return i.resolve(n)
        }
        var o = typeof n == "string" ? n : n.url,
          u = n.engine && "." + n.engine || o.match(/\.[\w\d]+$/),
          a, l, c;
        o.match(/^#/) && (o = o.substr(1));
        if (l = document.getElementById(o)) u = "." + l.type.match(/\/(x\-)?(.+)/)[2];
        !u && !f.cached[o] && (o += u = f.ext), e.isArray(u) && (u = u[0]), c = f.toId(o), o.match(/^\/\//) && (o = o.substr(2), o = window.steal ? steal.config().root.mapJoin("" + steal.id(o)) : o), window.require && require.toUrl && (o = require.toUrl(o)), a = f.types[u];
        if (f.cached[c]) return f.cached[c];
        if (l) return f.registerView(c, l.innerHTML, a);
        var h = new e.Deferred;
        return e.ajax({
          async: r,
          url: o,
          dataType: "text",
          error: function(e) {
            s("", o), h.reject(e)
          },
          success: function(e) {
            s(e, o), f.registerView(c, e, a, h)
          }
        }), h
      },
      u = function(t) {
        var n = [];
        if (e.isDeferred(t)) return [t];
        for (var r in t) e.isDeferred(t[r]) && n.push(t[r]);
        return n
      },
      a = function(t) {
        return e.isArray(t) && t[1] === "success" ? t[0] : t
      },
      f = e.view = e.template = function(e, n, r, i) {
        return t(r) && (i = r, r = undefined), f.renderAs("fragment", e, n, r, i)
      };
    return e.extend(f, {
      frag: function(e, t) {
        return f.hookup(f.fragment(e), t)
      },
      fragment: function(t) {
        if (typeof t != "string" && t.nodeType === 11) return t;
        var n = e.buildFragment(t, document.body);
        return n.childNodes.length || n.appendChild(document.createTextNode("")), n
      },
      toId: function(t) {
        return e.map(t.toString().split(/\/|\./g), function(e) {
          if (e) return e
        }).join("_")
      },
      toStr: function(e) {
        return e == null ? "" : "" + e
      },
      hookup: function(t, n) {
        var r = [],
          i, s;
        return e.each(t.childNodes ? e.makeArray(t.childNodes) : t, function(t) {
          t.nodeType === 1 && (r.push(t), r.push.apply(r, e.makeArray(t.getElementsByTagName("*"))))
        }), e.each(r, function(e) {
          e.getAttribute && (i = e.getAttribute("data-view-id")) && (s = f.hookups[i]) && (s(e, n, i), delete f.hookups[i], e.removeAttribute("data-view-id"))
        }), t
      },
      hookups: {},
      hook: function(e) {
        return f.hookups[++r] = e, " data-view-id='" + r + "'"
      },
      cached: {},
      cachedRenderers: {},
      cache: !0,
      register: function(t) {
        this.types["." + t.suffix] = t, e[t.suffix] = f[t.suffix] = function(e, n) {
          var r, s;
          if (!n) return s = function() {
            return r || (t.fragRenderer ? r = t.fragRenderer(null, e) : r = i(t.renderer(null, e))), r.apply(this, arguments)
          }, s.render = function() {
            var n = t.renderer(null, e);
            return n.apply(n, arguments)
          }, s;
          var o = function() {
            return r || (t.fragRenderer ? r = t.fragRenderer(e, n) : r = t.renderer(e, n)), r.apply(this, arguments)
          };
          return t.fragRenderer ? f.preload(e, o) : f.preloadStringRenderer(e, o)
        }
      },
      types: {},
      ext: ".ejs",
      registerScript: function(e, t, n) {
        return "can.view.preloadStringRenderer('" + t + "'," + f.types["." + e].script(t, n) + ");"
      },
      preload: function(t, n) {
        var r = f.cached[t] = (new e.Deferred).resolve(function(e, t) {
          return n.call(e, e, t)
        });
        return r.__view_id = t, f.cachedRenderers[t] = n, n
      },
      preloadStringRenderer: function(e, t) {
        return this.preload(e, i(t))
      },
      render: function(t, n, r, i) {
        return e.view.renderAs("string", t, n, r, i)
      },
      renderTo: function(e, t, n, r) {
        return (e === "string" && t.render ? t.render : t)(n, r)
      },
      renderAs: function(r, i, s, l, c) {
        t(l) && (c = l, l = undefined);
        var h = u(s),
          p, d, v, m, g;
        if (h.length) return d = new e.Deferred, v = e.extend({}, s), h.push(o(i, !0)), e.when.apply(e, h).then(function(t) {
          var i = n(arguments),
            o = i.pop(),
            u;
          if (e.isDeferred(s)) v = a(t);
          else
            for (var f in s) e.isDeferred(s[f]) && (v[f] = a(i.shift()));
          u = e.view.renderTo(r, o, v, l), d.resolve(u, v), c && c(u, v)
        }, function() {
          d.reject.apply(d, arguments)
        }), d;
        p = e.__clearReading(), m = t(c), d = o(i, m), p && e.__setReading(p);
        if (m) g = d, d.then(function(t) {
          c(s ? e.view.renderTo(r, t, s, l) : t)
        });
        else {
          if (d.state() === "resolved" && d.__view_id) {
            var y = f.cachedRenderers[d.__view_id];
            return s ? e.view.renderTo(r, y, s, l) : y
          }
          d.then(function(t) {
            g = s ? e.view.renderTo(r, t, s, l) : t
          })
        }
        return g
      },
      registerView: function(t, n, r, s) {
        var o = typeof r == "object" ? r : f.types[r || f.ext],
          u;
        return o.fragRenderer ? u = o.fragRenderer(t, n) : u = i(o.renderer(t, n)), s = s || new e.Deferred, f.cache && (f.cached[t] = s, s.__view_id = t, f.cachedRenderers[t] = u), s.resolve(u)
      }
    }), e
  }), define("can/compute", ["can/util/library", "can/util/bind", "can/util/batch"], function(e, t) {
    var n = [];
    e.__read = function(e, t) {
      n.push({});
      var r = e.call(t);
      return {
        value: r,
        observed: n.pop()
      }
    }, e.__reading = function(e, t) {
      n.length && (n[n.length - 1][e._cid + "|" + t] = {
        obj: e,
        event: t + ""
      })
    }, e.__clearReading = function() {
      if (n.length) {
        var e = n[n.length - 1];
        return n[n.length - 1] = {}, e
      }
    }, e.__setReading = function(e) {
      n.length && (n[n.length - 1] = e)
    }, e.__addReading = function(t) {
      n.length && e.simpleExtend(n[n.length - 1], t)
    };
    var r = function(t, n, r, s) {
        var u = e.__read(t, n),
          a = u.observed;
        return i(r, a, s), o(r, s), u
      },
      i = function(e, t, n) {
        for (var r in t) s(e, t, r, n)
      },
      s = function(e, t, n, r) {
        if (e[n]) delete e[n];
        else {
          var i = t[n];
          i.obj.bind(i.event, r)
        }
      },
      o = function(e, t) {
        for (var n in e) {
          var r = e[n];
          r.obj.unbind(r.event, t)
        }
      },
      u = function(t, n, r, i) {
        n !== r && e.batch.trigger(t, i ? {
          type: "change",
          batchNum: i
        } : "change", [n, r])
      },
      a = function(t, n, i, s) {
        var o, u, a;
        return {
          on: function(f) {
            u || (u = function(e) {
              if (t.bound && (e.batchNum === undefined || e.batchNum !== a)) {
                var s = o.value;
                o = r(n, i, o.observed, u), f(o.value, s, e.batchNum), a = a = e.batchNum
              }
            }), o = r(n, i, {}, u), s(o.value), t.hasDependencies = !e.isEmptyObject(o.observed)
          },
          off: function(e) {
            for (var t in o.observed) {
              var n = o.observed[t];
              n.obj.unbind(n.event, u)
            }
          }
        }
      },
      f = function(t, n, i, s) {
        var o, u, a, f;
        return {
          on: function(l) {
            a || (a = function(r) {
              if (t.bound && (r.batchNum === undefined || r.batchNum !== f)) {
                var s = e.__clearReading(),
                  o = n.call(i);
                e.__setReading(s), l(o, u, r.batchNum), u = o, f = f = r.batchNum
              }
            }), o = r(n, i, {}, a), u = o.value, s(o.value), t.hasDependencies = !e.isEmptyObject(o.observed)
          },
          off: function(e) {
            for (var t in o.observed) {
              var n = o.observed[t];
              n.obj.unbind(n.event, a)
            }
          }
        }
      },
      l = function(t) {
        return t instanceof e.Map || t && t.__get
      },
      c = function() {};
    e.compute = function(t, r, i, s) {
      if (t && t.isComputed) return t;
      var o, l = c,
        h = c,
        p, d = function() {
          return p
        },
        v = function(e) {
          p = e
        },
        m = v,
        g = [],
        y = function(e, t, n) {
          m(e), u(o, e, t, n)
        },
        b;
      for (var w = 0, E = arguments.length; w < E; w++) g[w] = arguments[w];
      o = function(t) {
        if (arguments.length) {
          var i = p,
            s = v.call(r, t, i);
          return o.hasDependencies ? d.call(r) : (s === undefined ? p = d.call(r) : p = s, u(o, p, i), p)
        }
        return n.length && o.canReadForChangeEvent !== !1 && (e.__reading(o, "change"), o.bound || e.compute.temporarilyBind(o)), o.bound ? p : d.call(r)
      };
      if (typeof t == "function") {
        v = t, d = t, o.canReadForChangeEvent = i === !1 ? !1 : !0;
        var S = s ? f(o, t, r || this, m) : a(o, t, r || this, m);
        l = S.on, h = S.off
      } else if (r)
        if (typeof r == "string") {
          var x = r,
            T = t instanceof e.Map;
          if (T) {
            o.hasDependencies = !0;
            var N;
            d = function() {
              return t.attr(x)
            }, v = function(e) {
              t.attr(x, e)
            }, l = function(n) {
              N = function(e, t, r) {
                n(t, r, e.batchNum)
              }, t.bind(i || x, N), p = e.__read(d).value
            }, h = function(e) {
              t.unbind(i || x, N)
            }
          } else d = function() {
            return t[x]
          }, v = function(e) {
            t[x] = e
          }, l = function(n) {
            N = function() {
              n(d(), p)
            }, e.bind.call(t, i || x, N), p = e.__read(d).value
          }, h = function(n) {
            e.unbind.call(t, i || x, N)
          }
        } else if (typeof r == "function") p = t, v = r, r = i, b = "setter";
      else {
        p = t;
        var C = r,
          L = y;
        r = C.context || C, d = C.get || d, v = C.set || function() {
          return p
        };
        if (C.fn) {
          var A = C.fn,
            O;
          d = function() {
            return A.call(r, p)
          }, A.length === 0 ? O = a(o, A, r, m) : A.length === 1 ? O = a(o, function() {
            return A.call(r, p)
          }, r, m) : (y = function(e) {
            e !== undefined && L(e, p)
          }, O = a(o, function() {
            var e = A.call(r, p, function(e) {
              L(e, p)
            });
            return e !== undefined ? e : p
          }, r, m)), l = O.on, h = O.off
        } else y = function() {
          var e = d.call(r);
          L(e, p)
        };
        l = C.on || l, h = C.off || h
      } else p = t;
      return e.cid(o, "compute"), e.simpleExtend(o, {
        isComputed: !0,
        _bindsetup: function() {
          this.bound = !0;
          var t = e.__clearReading();
          l.call(this, y), e.__setReading(t)
        },
        _bindteardown: function() {
          h.call(this, y), this.bound = !1
        },
        bind: e.bindAndSetup,
        unbind: e.unbindAndTeardown,
        clone: function(t) {
          return t && (b === "setter" ? g[2] = t : g[1] = t), e.compute.apply(e, g)
        }
      })
    };
    var h, p = function() {
      for (var e = 0, t = h.length; e < t; e++) h[e].unbind("change", c);
      h = null
    };
    return e.compute.temporarilyBind = function(e) {
      e.bind("change", c), h || (h = [], setTimeout(p, 10)), h.push(e)
    }, e.compute.truthy = function(t) {
      return e.compute(function() {
        var e = t();
        return typeof e == "function" && (e = e()), !!e
      })
    }, e.compute.async = function(t, n, r) {
      return e.compute(t, {
        fn: n,
        context: r
      })
    }, e.compute.read = function(t, n, r) {
      r = r || {};
      var i = t,
        s, o, u;
      for (var a = 0, f = n.length; a < f; a++) {
        o = i, o && o.isComputed && (r.foundObservable && r.foundObservable(o, a), o = i = o()), l(o) ? (!u && r.foundObservable && r.foundObservable(o, a), u = 1, typeof o[n[a]] == "function" && o.constructor.prototype[n[a]] === o[n[a]] ? r.returnObserveMethods ? i = i[n[a]] : n[a] === "constructor" && o instanceof e.Construct || o[n[a]].prototype instanceof e.Construct ? i = o[n[a]] : i = o[n[a]].apply(o, r.args || []) : i = i.attr(n[a])) : i == null ? i = undefined : i = o[n[a]], s = typeof i, i && i.isComputed && !r.isArgument && a < f - 1 ? (!u && r.foundObservable && r.foundObservable(o, a + 1), i = i()) : a < n.length - 1 && s === "function" && r.executeAnonymousFunctions && !(e.Construct && i.prototype instanceof e.Construct) && (i = i());
        if (a < n.length - 1 && (i === null || s !== "function" && s !== "object")) return r.earlyExit && r.earlyExit(o, a, i), {
          value: undefined,
          parent: o
        }
      }
      return typeof i == "function" && !(e.Construct && i.prototype instanceof e.Construct) && (!e.route || i !== e.route) && (r.isArgument ? !i.isComputed && r.proxyMethods !== !1 && (i = e.proxy(i, o)) : (i.isComputed && !u && r.foundObservable && r.foundObservable(i, a), i = i.call(o))), i === undefined && r.earlyExit && r.earlyExit(o, a - 1), {
        value: i,
        parent: o
      }
    }, e.compute.set = function(e, t, n) {
      if (l(e)) return e.attr(t, n);
      if (e[t] && e[t].isComputed) return e[t](n);
      typeof e == "object" && (e[t] = n)
    }, e.compute
  }), define("can/view/scope", ["can/util/library", "can/construct", "can/map", "can/list", "can/view", "can/compute"], function(e) {
    var t = /(\\)?\./g,
      n = /\\\./g,
      r = function(e) {
        var r = [],
          i = 0;
        return e.replace(t, function(t, s, o) {
          s || (r.push(e.slice(i, o).replace(n, ".")), i = o + t.length)
        }), r.push(e.slice(i).replace(n, ".")), r
      },
      i = e.Construct.extend({
        read: e.compute.read
      }, {
        init: function(e, t) {
          this._context = e, this._parent = t, this.__cache = {}
        },
        attr: function(t, n) {
          var r = e.__clearReading(),
            i = this.read(t, {
              isArgument: !0,
              returnObserveMethods: !0,
              proxyMethods: !1
            });
          if (arguments.length === 2) {
            var s = t.lastIndexOf("."),
              o = s !== -1 ? t.substring(0, s) : ".",
              u = this.read(o, {
                isArgument: !0,
                returnObserveMethods: !0,
                proxyMethods: !1
              }).value;
            s !== -1 && (t = t.substring(s + 1, t.length)), e.compute.set(u, t, n)
          }
          return e.__setReading(r), i.value
        },
        add: function(e) {
          return e !== this._context ? new this.constructor(e, this) : this
        },
        computeData: function(t, n) {
          n = n || {
            args: []
          };
          var r = this,
            i, s, o = {
              compute: e.compute(function(u) {
                if (!arguments.length) {
                  if (i) return e.compute.read(i, s, n).value;
                  var l = r.read(t, n);
                  return i = l.rootObserve, s = l.reads, o.scope = l.scope, o.initialValue = l.value, o.reads = l.reads, o.root = i, l.value
                }
                if (i.isComputed) i(u);
                else if (s.length) {
                  var a = s.length - 1,
                    f = s.length ? e.compute.read(i, s.slice(0, a)).value : i;
                  e.compute.set(f, s[a], u)
                }
              })
            };
          return o
        },
        compute: function(e, t) {
          return this.computeData(e, t).compute
        },
        read: function(t, n) {
          var i;
          if (t.substr(0, 2) === "./") i = !0, t = t.substr(2);
          else {
            if (t.substr(0, 3) === "../") return this._parent.read(t.substr(3), n);
            if (t === "..") return {
              value: this._parent._context
            };
            if (t === "." || t === "this") return {
              value: this._context
            }
          }
          var s = t.indexOf("\\.") === -1 ? t.split(".") : r(t),
            o, u = this,
            a, f = [],
            l = -1,
            c, h, p, d;
          while (u) {
            o = u._context;
            if (o !== null) {
              var v = e.compute.read(o, s, e.simpleExtend({
                foundObservable: function(e, t) {
                  p = e, d = s.slice(t)
                },
                earlyExit: function(t, n) {
                  n > l && (a = p, f = d, l = n, h = u, c = e.__clearReading())
                },
                executeAnonymousFunctions: !0
              }, n));
              if (v.value !== undefined) return {
                scope: u,
                rootObserve: p,
                value: v.value,
                reads: d
              }
            }
            e.__clearReading(), i ? u = null : u = u._parent
          }
          return a ? (e.__setReading(c), {
            scope: h,
            rootObserve: a,
            reads: f,
            value: undefined
          }) : {
            names: s,
            value: undefined
          }
        }
      });
    return e.view.Scope = i, i
  }), define("can/view/elements", ["can/util/library", "can/view"], function(e) {
    var t = function() {
        return e.$(document.createComment("~")).length === 1
      }(),
      n = {
        tagToContentPropMap: {
          option: "textContent" in document.createElement("option") ? "textContent" : "innerText",
          textarea: "value"
        },
        attrMap: e.attr.map,
        attrReg: /([^\s=]+)[\s]*=[\s]*/,
        defaultValue: e.attr.defaultValue,
        tagMap: {
          "": "span",
          colgroup: "col",
          table: "tbody",
          tr: "td",
          ol: "li",
          ul: "li",
          tbody: "tr",
          thead: "tr",
          tfoot: "tr",
          select: "option",
          optgroup: "option"
        },
        reverseTagMap: {
          col: "colgroup",
          tr: "tbody",
          option: "select",
          td: "tr",
          th: "tr",
          li: "ul"
        },
        getParentNode: function(e, t) {
          return t && e.parentNode.nodeType === 11 ? t : e.parentNode
        },
        setAttr: e.attr.set,
        getAttr: e.attr.get,
        removeAttr: e.attr.remove,
        contentText: function(e) {
          return typeof e == "string" ? e : !e && e !== 0 ? "" : "" + e
        },
        after: function(t, n) {
          var r = t[t.length - 1];
          r.nextSibling ? e.insertBefore(r.parentNode, n, r.nextSibling) : e.appendChild(r.parentNode, n)
        },
        replace: function(r, i) {
          n.after(r, i), e.remove(e.$(r)).length < r.length && !t && e.each(r, function(e) {
            e.nodeType === 8 && e.parentNode.removeChild(e)
          })
        }
      };
    return e.view.elements = n, n
  }), define("can/view/callbacks", ["can/util/library", "can/view"], function(e) {
    var t = e.view.attr = function(e, t) {
        if (!t) {
          var i = n[e];
          if (!i)
            for (var s = 0, o = r.length; s < o; s++) {
              var u = r[s];
              if (u.match.test(e)) {
                i = u.handler;
                break
              }
            }
          return i
        }
        typeof e == "string" ? n[e] = t : r.push({
          match: e,
          handler: t
        })
      },
      n = {},
      r = [],
      i = /[-\:]/,
      s = e.view.tag = function(e, t) {
        if (!t) {
          var n = o[e.toLowerCase()];
          return !n && i.test(e) && (n = function() {}), n
        }
        window.html5 && (window.html5.elements += " " + e, window.html5.shivDocument()), o[e.toLowerCase()] = t
      },
      o = {};
    return e.view.callbacks = {
      _tags: o,
      _attributes: n,
      _regExpAttributes: r,
      tag: s,
      attr: t,
      tagHandler: function(t, n, r) {
        var i = r.options.attr("tags." + n),
          s = i || o[n],
          u = r.scope,
          a;
        if (s) {
          var f = e.__clearReading();
          a = s(t, r), e.__setReading(f)
        } else a = u;
        if (a && r.subtemplate) {
          u !== a && (u = u.add(a));
          var l = r.subtemplate(u, r.options),
            c = typeof l == "string" ? e.view.frag(l) : l;
          e.appendChild(t, c)
        }
      }
    }, e.view.callbacks
  }), define("can/view/scanner", ["can/view", "can/view/elements", "can/view/callbacks"], function(can, elements, viewCallbacks) {
    var newLine = /(\r|\n)+/g,
      notEndTag = /\//,
      clean = function(e) {
        return e.split("\\").join("\\\\").split("\n").join("\\n").split('"').join('\\"').split("  ").join("\\t")
      },
      getTag = function(e, t, n) {
        if (e) return e;
        while (n < t.length) {
          if (t[n] === "<" && !notEndTag.test(t[n + 1])) return elements.reverseTagMap[t[n + 1]] || "span";
          n++
        }
        return ""
      },
      bracketNum = function(e) {
        return --e.split("{").length - --e.split("}").length
      },
      myEval = function(script) {
        eval(script)
      },
      attrReg = /([^\s]+)[\s]*=[\s]*$/,
      startTxt = "var ___v1ew = [];",
      finishTxt = "return ___v1ew.join('')",
      put_cmd = "___v1ew.push(\n",
      insert_cmd = put_cmd,
      htmlTag = null,
      quote = null,
      beforeQuote = null,
      rescan = null,
      getAttrName = function() {
        var e = beforeQuote.match(attrReg);
        return e && e[1]
      },
      status = function() {
        return quote ? "'" + getAttrName() + "'" : htmlTag ? 1 : 0
      },
      top = function(e) {
        return e[e.length - 1]
      },
      Scanner;
    return can.view.Scanner = Scanner = function(e) {
      can.extend(this, {
        text: {},
        tokens: []
      }, e), this.text.options = this.text.options || "", this.tokenReg = [], this.tokenSimple = {
        "<": "<",
        ">": ">",
        '"': '"',
        "'": "'"
      }, this.tokenComplex = [], this.tokenMap = {};
      for (var t = 0, n; n = this.tokens[t]; t++) n[2] ? (this.tokenReg.push(n[2]), this.tokenComplex.push({
        abbr: n[1],
        re: new RegExp(n[2]),
        rescan: n[3]
      })) : (this.tokenReg.push(n[1]), this.tokenSimple[n[1]] = n[0]), this.tokenMap[n[0]] = n[1];
      this.tokenReg = new RegExp("(" + this.tokenReg.slice(0).concat(["<", ">", '"', "'"]).join("|") + ")", "g")
    }, Scanner.prototype = {
      helpers: [],
      scan: function(e, t) {
        var n = [],
          r = 0,
          i = this.tokenSimple,
          s = this.tokenComplex;
        e = e.replace(newLine, "\n"), this.transform && (e = this.transform(e)), e.replace(this.tokenReg, function(t, o) {
          var u = arguments[arguments.length - 2];
          u > r && n.push(e.substring(r, u));
          if (i[t]) n.push(t);
          else
            for (var a = 0, f; f = s[a]; a++)
              if (f.re.test(t)) {
                n.push(f.abbr), f.rescan && n.push(f.rescan(o));
                break
              }
          r = u + o.length
        }), r < e.length && n.push(e.substr(r));
        var o = "",
          u = [startTxt + (this.text.start || "")],
          a = function(e, t) {
            u.push(put_cmd, '"', clean(e), '"' + (t || "") + ");")
          },
          f = [],
          l, c = null,
          h = !1,
          p = {
            attributeHookups: [],
            tagHookups: [],
            lastTagHookup: ""
          },
          d = function() {
            p.lastTagHookup = p.tagHookups.pop() + p.tagHookups.length
          },
          v = "",
          m = [],
          g = !1,
          y, b = !1,
          w = 0,
          E, S = this.tokenMap,
          x;
        htmlTag = quote = beforeQuote = null;
        for (;
          (E = n[w++]) !== undefined;) {
          if (c === null) switch (E) {
            case S.left:
            case S.escapeLeft:
            case S.returnLeft:
              h = htmlTag && 1;
            case S.commentLeft:
              c = E, o.length && a(o), o = "";
              break;
            case S.escapeFull:
              h = htmlTag && 1, rescan = 1, c = S.escapeLeft, o.length && a(o), rescan = n[w++], o = rescan.content || rescan, rescan.before && a(rescan.before), n.splice(w, 0, S.right);
              break;
            case S.commentFull:
              break;
            case S.templateLeft:
              o += S.left;
              break;
            case "<":
              n[w].indexOf("!--") !== 0 && (htmlTag = 1, h = 0), o += E;
              break;
            case ">":
              htmlTag = 0;
              var T = o.substr(o.length - 1) === "/" || o.substr(o.length - 2) === "--",
                N = "";
              p.attributeHookups.length && (N = "attrs: ['" + p.attributeHookups.join("','") + "'], ", p.attributeHookups = []);
              if (v + p.tagHookups.length !== p.lastTagHookup && v === top(p.tagHookups)) T && (o = o.substr(0, o.length - 1)), u.push(put_cmd, '"', clean(o), '"', ",can.view.pending({tagName:'" + v + "'," + N + "scope: " + (this.text.scope || "this") + this.text.options), T ? (u.push("}));"), o = "/>", d()) : n[w] === "<" && n[w + 1] === "/" + v ? (u.push("}));"), o = E, d()) : (u.push(",subtemplate: function(" + this.text.argNames + "){\n" + startTxt + (this.text.start || "")), o = "");
              else if (h || !g && elements.tagToContentPropMap[m[m.length - 1]] || N) {
                var C = ",can.view.pending({" + N + "scope: " + (this.text.scope || "this") + this.text.options + '}),"';
                T ? a(o.substr(0, o.length - 1), C + '/>"') : a(o, C + '>"'), o = "", h = 0
              } else o += E;
              if (T || g) m.pop(), v = m[m.length - 1], g = !1;
              p.attributeHookups = [];
              break;
            case "'":
            case '"':
              if (htmlTag)
                if (quote && quote === E) {
                  quote = null;
                  var k = getAttrName();
                  viewCallbacks.attr(k) && p.attributeHookups.push(k);
                  if (b) {
                    o += E, a(o), u.push(finishTxt, "}));\n"), o = "", b = !1;
                    break
                  }
                } else if (quote === null) {
                quote = E, beforeQuote = l, x = getAttrName();
                if (v === "img" && x === "src" || x === "style") {
                  a(o.replace(attrReg, "")), o = "", b = !0, u.push(insert_cmd, "can.view.txt(2,'" + getTag(v, n, w) + "'," + status() + ",this,function(){", startTxt), a(x + "=" + E);
                  break
                }
              };
            default:
              if (l === "<") {
                v = E.substr(0, 3) === "!--" ? "!--" : E.split(/\s/)[0];
                var L = !1,
                  A;
                v.indexOf("/") === 0 && (L = !0, A = v.substr(1)), L ? (top(m) === A && (v = A, g = !0), top(p.tagHookups) === A && (a(o.substr(0, o.length - 1)), u.push(finishTxt + "}}) );"), o = "><", d())) : (v.lastIndexOf("/") === v.length - 1 && (v = v.substr(0, v.length - 1)), v !== "!--" && viewCallbacks.tag(v) && (v === "content" && elements.tagMap[top(m)] && (E = E.replace("content", elements.tagMap[top(m)])), p.tagHookups.push(v)), m.push(v))
              }
              o += E
          } else switch (E) {
            case S.right:
            case S.returnRight:
              switch (c) {
                case S.left:
                  y = bracketNum(o), y === 1 ? (u.push(insert_cmd, "can.view.txt(0,'" + getTag(v, n, w) + "'," + status() + ",this,function(){", startTxt, o), f.push({
                    before: "",
                    after: finishTxt + "}));\n"
                  })) : (r = f.length && y === -1 ? f.pop() : {
                    after: ";"
                  }, r.before && u.push(r.before), u.push(o, ";", r.after));
                  break;
                case S.escapeLeft:
                case S.returnLeft:
                  y = bracketNum(o), y && f.push({
                    before: finishTxt,
                    after: "}));\n"
                  });
                  var O = c === S.escapeLeft ? 1 : 0,
                    M = {
                      insert: insert_cmd,
                      tagName: getTag(v, n, w),
                      status: status(),
                      specialAttribute: b
                    };
                  for (var _ = 0; _ < this.helpers.length; _++) {
                    var D = this.helpers[_];
                    if (D.name.test(o)) {
                      o = D.fn(o, M), D.name.source === /^>[\s]*\w*/.source && (O = 0);
                      break
                    }
                  }
                  typeof o == "object" ? o.startTxt && o.end && b ? u.push(insert_cmd, "can.view.toStr( ", o.content, "() ) );") : (o.startTxt ? u.push(insert_cmd, "can.view.txt(\n" + (typeof status() == "string" || (o.escaped != null ? o.escaped : O)) + ",\n'" + v + "',\n" + status() + ",\nthis,\n") : o.startOnlyTxt && u.push(insert_cmd, "can.view.onlytxt(this,\n"), u.push(o.content), o.end && u.push("));")) : b ? u.push(insert_cmd, o, ");") : u.push(insert_cmd, "can.view.txt(\n" + (typeof status() == "string" || O) + ",\n'" + v + "',\n" + status() + ",\nthis,\nfunction(){ " + (this.text.escape || "") + "return ", o, y ? startTxt : "}));\n"), rescan && rescan.after && rescan.after.length && (a(rescan.after.length), rescan = null)
              }
              c = null, o = "";
              break;
            case S.templateLeft:
              o += S.left;
              break;
            default:
              o += E
          }
          l = E
        }
        o.length && a(o), u.push(";");
        var P = u.join(""),
          H = {
            out: (this.text.outStart || "") + P + " " + finishTxt + (this.text.outEnd || "")
          };
        return myEval.call(H, "this.fn = (function(" + this.text.argNames + "){" + H.out + "});\r\n//# sourceURL=" + t + ".js"), H
      }
    }, can.view.pending = function(e) {
      var t = can.view.getHooks();
      return can.view.hook(function(n) {
        can.each(t, function(e) {
          e(n)
        }), e.templateType = "legacy", e.tagName && viewCallbacks.tagHandler(n, e.tagName, e), can.each(e && e.attrs || [], function(t) {
          e.attributeName = t;
          var r = viewCallbacks.attr(t);
          r && r(n, e)
        })
      })
    }, can.view.tag("content", function(e, t) {
      return t.scope
    }), can.view.Scanner = Scanner, Scanner
  }), define("can/view/node_lists", ["can/util/library", "can/view/elements"], function(e) {
    var t = !0;
    try {
      document.createTextNode("")._ = 0
    } catch (n) {
      t = !1
    }
    var r = {},
      i = {},
      s = "ejs_" + Math.random(),
      o = 0,
      u = function(e, n) {
        var r = n || i,
          u = a(e, r);
        return u ? u : t || e.nodeType !== 3 ? (++o, e[s] = (e.nodeName ? "element_" : "obj_") + o) : (++o, r["text_" + o] = e, "text_" + o)
      },
      a = function(e, n) {
        if (t || e.nodeType !== 3) return e[s];
        for (var r in n)
          if (n[r] === e) return r
      },
      f = [].splice,
      l = [].push,
      c = function(e) {
        var t = 0;
        for (var n = 0, r = e.length; n < r; n++) {
          var i = e[n];
          i.nodeType ? t++ : t += c(i)
        }
        return t
      },
      h = function(e, t) {
        var n = {};
        for (var r = 0, i = e.length; r < i; r++) {
          var s = p.first(e[r]);
          n[u(s, t)] = e[r]
        }
        return n
      },
      p = {
        id: u,
        update: function(t, n) {
          var r = p.unregisterChildren(t);
          n = e.makeArray(n);
          var i = t.length;
          return f.apply(t, [0, i].concat(n)), t.replacements ? p.nestReplacements(t) : p.nestList(t), r
        },
        nestReplacements: function(e) {
          var t = 0,
            n = {},
            r = h(e.replacements, n),
            i = e.replacements.length;
          while (t < e.length && i) {
            var s = e[t],
              o = r[a(s, n)];
            o && (e.splice(t, c(o), o), i--), t++
          }
          e.replacements = []
        },
        nestList: function(e) {
          var t = 0;
          while (t < e.length) {
            var n = e[t],
              i = r[u(n)];
            i ? i !== e && e.splice(t, c(i), i) : r[u(n)] = e, t++
          }
        },
        last: function(e) {
          var t = e[e.length - 1];
          return t.nodeType ? t : p.last(t)
        },
        first: function(e) {
          var t = e[0];
          return t.nodeType ? t : p.first(t)
        },
        register: function(e, t, n) {
          return e.unregistered = t, e.parentList = n, n === !0 ? e.replacements = [] : n ? (n.replacements.push(e), e.replacements = []) : p.nestList(e), e
        },
        unregisterChildren: function(t) {
          var n = [];
          return e.each(t, function(e) {
            e.nodeType ? (t.replacements || delete r[u(e)], n.push(e)) : l.apply(n, p.unregister(e))
          }), n
        },
        unregister: function(e) {
          var t = p.unregisterChildren(e);
          if (e.unregistered) {
            var n = e.unregistered;
            delete e.unregistered, delete e.replacements, n()
          }
          return t
        },
        nodeMap: r
      };
    return e.view.nodeLists = p, p
  }), define("can/view/parser", ["can/view"], function(e) {
    function t(e) {
      var t = {},
        n = e.split(",");
      for (var r = 0; r < n.length; r++) t[n[r]] = !0;
      return t
    }
    var n = "-:A-Za-z0-9_",
      r = "[a-zA-Z_:][" + n + ":.]*",
      i = "\\s*=\\s*",
      s = '"((?:\\\\.|[^"])*)"',
      o = "'((?:\\\\.|[^'])*)'",
      u = "(?:" + i + "(?:" + "(?:\"[^\"]*\")|(?:'[^']*')|[^>\\s]+))?",
      a = "\\{\\{[^\\}]*\\}\\}\\}?",
      f = "\\{\\{([^\\}]*)\\}\\}\\}?",
      l = new RegExp("^<([" + n + "]+)" + "(" + "(?:\\s*" + "(?:(?:" + "(?:" + r + ")?" + u + ")|" + "(?:" + a + ")+)" + ")*" + ")\\s*(\\/?)>"),
      c = new RegExp("^<\\/([" + n + "]+)[^>]*>"),
      h = new RegExp("(?:(?:(" + r + ")|" + f + ")" + "(?:" + i + "(?:" + "(?:" + s + ")|(?:" + o + ")|([^>\\s]+)" + ")" + ")?)", "g"),
      p = new RegExp(f, "g"),
      d = /<|\{\{/,
      v = t("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed"),
      m = t("address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"),
      g = t("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"),
      y = t("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"),
      b = t("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"),
      w = t("script,style"),
      E = function(e, t) {
        function n(e, n, i, s) {
          n = n.toLowerCase();
          if (m[n])
            while (a.last() && g[a.last()]) r("", a.last());
          y[n] && a.last() === n && r("", n), s = v[n] || !!s, t.start(n, s), s || a.push(n), E.parseAttrs(i, t), t.end(n, s)
        }

        function r(e, n) {
          var r;
          if (!n) r = 0;
          else
            for (r = a.length - 1; r >= 0; r--)
              if (a[r] === n) break; if (r >= 0) {
            for (var i = a.length - 1; i >= r; i--) t.close && t.close(a[i]);
            a.length = r
          }
        }

        function i(e, n) {
          t.special && t.special(n)
        }
        var s, o, u, a = [],
          f = e;
        a.last = function() {
          return this[this.length - 1]
        };
        while (e) {
          o = !0;
          if (!a.last() || !w[a.last()]) {
            e.indexOf("<!--") === 0 ? (s = e.indexOf("-->"), s >= 0 && (t.comment && t.comment(e.substring(4, s)), e = e.substring(s + 3), o = !1)) : e.indexOf("</") === 0 ? (u = e.match(c), u && (e = e.substring(u[0].length), u[0].replace(c, r), o = !1)) : e.indexOf("<") === 0 ? (u = e.match(l), u && (e = e.substring(u[0].length), u[0].replace(l, n), o = !1)) : e.indexOf("{{") === 0 && (u = e.match(p), u && (e = e.substring(u[0].length), u[0].replace(p, i)));
            if (o) {
              s = e.search(d);
              var h = s < 0 ? e : e.substring(0, s);
              e = s < 0 ? "" : e.substring(s), t.chars && h && t.chars(h)
            }
          } else e = e.replace(new RegExp("([\\s\\S]*?)</" + a.last() + "[^>]*>"), function(e, n) {
            return n = n.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2"), t.chars && t.chars(n), ""
          }), r("", a.last());
          if (e === f) throw "Parse Error: " + e;
          f = e
        }
        r(), t.done()
      };
    return E.parseAttrs = function(e, t) {
      (e != null ? e : "").replace(h, function(e, n, r, i, s, o) {
        r && t.special(r);
        if (n || i || s || o) {
          var u = arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : arguments[5] ? arguments[5] : b[n.toLowerCase()] ? n : "";
          t.attrStart(n || "");
          var a = p.lastIndex = 0,
            f = p.exec(u),
            l;
          while (f) l = u.substring(a, p.lastIndex - f[0].length), l.length && t.attrValue(l), t.special(f[1]), a = p.lastIndex, f = p.exec(u);
          l = u.substr(a, u.length), l && t.attrValue(l), t.attrEnd(n || "")
        }
      })
    }, e.view.parser = E, E
  }), define("can/view/live", ["can/util/library", "can/view/elements", "can/view", "can/view/node_lists", "can/view/parser"], function(e, t, n, r, i) {
    t = t || e.view.elements, r = r || e.view.NodeLists, i = i || e.view.parser;
    var s = function(t, n, r) {
        var i = !1,
          s = function() {
            return i || (i = !0, r(o), e.unbind.call(t, "removed", s)), !0
          },
          o = {
            teardownCheck: function(e) {
              return e ? !1 : s()
            }
          };
        return e.bind.call(t, "removed", s), n(o), o
      },
      o = function(e, t, n) {
        return s(e, function() {
          t.bind("change", n)
        }, function(e) {
          t.unbind("change", n), e.nodeList && r.unregister(e.nodeList)
        })
      },
      u = function(e) {
        var t = {},
          n;
        return i.parseAttrs(e, {
          attrStart: function(e) {
            t[e] = "", n = e
          },
          attrValue: function(e) {
            t[n] += e
          },
          attrEnd: function() {}
        }), t
      },
      a = [].splice,
      f = function(e) {
        return e && e.nodeType
      },
      l = function(e) {
        e.childNodes.length || e.appendChild(document.createTextNode(""))
      },
      c = {
        list: function(n, i, o, u, f, l) {
          var h = l || [n],
            p = [],
            d = function(n, i, s) {
              var f = document.createDocumentFragment(),
                c = [],
                d = [];
              e.each(i, function(t, n) {
                var i = [];
                l && r.register(i, null, !0);
                var a = e.compute(n + s),
                  h = o.call(u, t, a, i),
                  p = typeof h == "string",
                  v = e.frag(h);
                v = p ? e.view.hookup(v) : v;
                var m = e.makeArray(v.childNodes);
                l ? (r.update(i, m), c.push(i)) : c.push(r.register(m)), f.appendChild(v), d.push(a)
              });
              var v = s + 1;
              if (!h[v]) t.after(v === 1 ? [m] : [r.last(h[v - 1])], f);
              else {
                var g = r.first(h[v]);
                e.insertBefore(g.parentNode, f, g)
              }
              a.apply(h, [v, 0].concat(c)), a.apply(p, [s, 0].concat(d));
              for (var y = s + d.length, b = p.length; y < b; y++) p[y](y)
            },
            v = function(t, n, i, s, o) {
              if (!s && w.teardownCheck(m.parentNode)) return;
              i < 0 && (i = p.length + i);
              var u = h.splice(i + 1, n.length),
                a = [];
              e.each(u, function(e) {
                var t = r.unregister(e);
                [].push.apply(a, t)
              }), p.splice(i, n.length);
              for (var f = i, l = p.length; f < l; f++) p[f](f);
              o || e.remove(e.$(a))
            },
            m = document.createTextNode(""),
            g, y = function(e) {
              g && g.unbind && g.unbind("add", d).unbind("remove", v), v({}, {
                length: h.length - 1
              }, 0, !0, e)
            },
            b = function(e, t, n) {
              y(), g = t || [], g.bind && g.bind("add", d).bind("remove", v), d({}, g, 0)
            };
          f = t.getParentNode(n, f);
          var w = s(f, function() {
            e.isFunction(i) && i.bind("change", b)
          }, function() {
            e.isFunction(i) && i.unbind("change", b), y(!0)
          });
          l ? (t.replace(h, m), r.update(h, [m]), l.unregistered = w.teardownCheck) : c.replace(h, m, w.teardownCheck), b({}, e.isFunction(i) ? i() : i)
        },
        html: function(n, i, s, u) {
          var a;
          s = t.getParentNode(n, s), a = o(s, i, function(e, t, n) {
            var i = r.first(c).parentNode;
            i && h(t), a.teardownCheck(r.first(c).parentNode)
          });
          var c = u || [n],
            h = function(n) {
              var i = !f(n),
                o = e.frag(n),
                u = e.makeArray(c);
              l(o), i && (o = e.view.hookup(o, s)), u = r.update(c, o.childNodes), t.replace(u, o)
            };
          a.nodeList = c, u ? u.unregistered = a.teardownCheck : r.register(c, a.teardownCheck), h(i())
        },
        replace: function(n, i, s) {
          var o = n.slice(0),
            u = e.frag(i);
          return r.register(n, s), typeof i == "string" && (u = e.view.hookup(u, n[0].parentNode)), r.update(n, u.childNodes), t.replace(o, u), n
        },
        text: function(n, i, s, u) {
          var a = t.getParentNode(n, s),
            f = o(a, i, function(t, n, r) {
              typeof l.nodeValue != "unknown" && (l.nodeValue = e.view.toStr(n)), f.teardownCheck(l.parentNode)
            }),
            l = document.createTextNode(e.view.toStr(i()));
          u ? (u.unregistered = f.teardownCheck, f.nodeList = u, r.update(u, [l]), t.replace([n], l)) : f.nodeList = c.replace([n], l, f.teardownCheck)
        },
        setAttributes: function(t, n) {
          var r = u(n);
          for (var i in r) e.attr.set(t, i, r[i])
        },
        attributes: function(n, r, i) {
          var s = {},
            a = function(r) {
              var i = u(r),
                o;
              for (o in i) {
                var a = i[o],
                  f = s[o];
                a !== f && e.attr.set(n, o, a), delete s[o]
              }
              for (o in s) t.removeAttr(n, o);
              s = i
            };
          o(n, r, function(e, t) {
            a(t)
          }), arguments.length >= 3 ? s = u(i) : a(r())
        },
        attributePlaceholder: "__!!__",
        attributeReplace: /__!!__/g,
        attribute: function(n, r, i) {
          o(n, i, function(e, i) {
            t.setAttr(n, r, h.render())
          });
          var s = e.$(n),
            u;
          u = e.data(s, "hooks"), u || e.data(s, "hooks", u = {});
          var a = t.getAttr(n, r),
            f = a.split(c.attributePlaceholder),
            l = [],
            h;
          l.push(f.shift(), f.join(c.attributePlaceholder)), u[r] ? u[r].computes.push(i) : u[r] = {
            render: function() {
              var e = 0,
                n = a ? a.replace(c.attributeReplace, function() {
                  return t.contentText(h.computes[e++]())
                }) : t.contentText(h.computes[e++]());
              return n
            },
            computes: [i],
            batchNum: undefined
          }, h = u[r], l.splice(1, 0, i()), t.setAttr(n, r, l.join(""))
        },
        specialAttribute: function(e, n, r) {
          o(e, r, function(r, i) {
            t.setAttr(e, n, p(i))
          }), t.setAttr(e, n, p(r()))
        },
        simpleAttribute: function(e, n, r) {
          o(e, r, function(r, i) {
            t.setAttr(e, n, i)
          }), t.setAttr(e, n, r())
        }
      };
    c.attr = c.simpleAttribute, c.attrs = c.attributes;
    var h = /(\r|\n)+/g,
      p = function(e) {
        var n = /^["'].*["']$/;
        return e = e.replace(t.attrReg, "").replace(h, ""), n.test(e) ? e.substr(1, e.length - 2) : e
      };
    return e.view.live = c, c
  }), define("can/view/render", ["can/view", "can/view/elements", "can/view/live", "can/util/string"], function(e, t, n) {
    var r = [],
      i = function(e) {
        var n = t.tagMap[e] || "span";
        return n === "span" ? "@@!!@@" : "<" + n + ">" + i(n) + "</" + n + ">"
      },
      s = function(t, n) {
        if (typeof t == "string") return t;
        if (!t && t !== 0) return "";
        var i = t.hookup && function(e, n) {
          t.hookup.call(t, e, n)
        } || typeof t == "function" && t;
        if (i) return n ? "<" + n + " " + e.view.hook(i) + "></" + n + ">" : (r.push(i), "");
        return "" + t
      },
      o = function(t, n) {
        return typeof t == "string" || typeof t == "number" ? e.esc(t) : s(t, n)
      },
      u = !1,
      a = function() {},
      f;
    return e.extend(e.view, {
      live: n,
      setupLists: function() {
        var t = e.view.lists,
          n;
        return e.view.lists = function(e, t) {
            return n = {
              list: e,
              renderer: t
            }, Math.random()
          },
          function() {
            return e.view.lists = t, n
          }
      },
      getHooks: function() {
        var e = r.slice(0);
        return f = e, r = [], e
      },
      onlytxt: function(e, t) {
        return o(t.call(e))
      },
      txt: function(l, c, h, p, d) {
        var v = t.tagMap[c] || "span",
          m = !1,
          g, y, b, w = a,
          E;
        if (u) g = d.call(p);
        else {
          if (typeof h == "string" || h === 1) u = !0;
          var S = e.view.setupLists();
          w = function() {
            b.unbind("change", a)
          }, b = e.compute(d, p, !1), b.bind("change", a), y = S(), g = b(), u = !1, m = b.hasDependencies
        }
        if (y) return w(), "<" + v + e.view.hook(function(e, t) {
          n.list(e, y.list, y.renderer, p, t)
        }) + "></" + v + ">";
        if (!m || typeof g == "function") return w(), (u || l === 2 || !l ? s : o)(g, h === 0 && v);
        var x = t.tagToContentPropMap[c];
        return h === 0 && !x ? "<" + v + e.view.hook(l && typeof g != "object" ? function(e, t) {
          n.text(e, b, t), w()
        } : function(e, t) {
          n.html(e, b, t), w()
        }) + ">" + i(v) + "</" + v + ">" : h === 1 ? (r.push(function(e) {
          n.attributes(e, b, b()), w()
        }), b()) : l === 2 ? (E = h, r.push(function(e) {
          n.specialAttribute(e, E, b), w()
        }), b()) : (E = h === 0 ? x : h, (h === 0 ? f : r).push(function(e) {
          n.attribute(e, E, b), w()
        }), n.attributePlaceholder)
      }
    }), e
  }), define("can/view/mustache", ["can/util/library", "can/view/scope", "can/view", "can/view/scanner", "can/compute", "can/view/render"], function(e) {
    e.view.ext = ".mustache";
    var t = "scope",
      n = "___h4sh",
      r = "{scope:" + t + ",options:options}",
      i = "{scope:" + t + ",options:options, special: true}",
      s = t + ",options",
      o = /((([^'"\s]+?=)?('.*?'|".*?"))|.*?)\s/g,
      u = /^(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false|null|undefined)|((.+?)=(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false)|(.+))))$/,
      a = function(e) {
        return '{get:"' + e.replace(/"/g, '\\"') + '"}'
      },
      f = function(e) {
        return e && typeof e.get == "string"
      },
      l = function(t) {
        return t instanceof e.Map || t && !!t._get
      },
      c = function(e) {
        return e && e.splice && typeof e.length == "number"
      },
      h = function(t, n, r) {
        var i = function(e, r) {
          return t(e || n, r)
        };
        return function(t, s) {
          return t !== undefined && !(t instanceof e.view.Scope) && (t = n.add(t)), s !== undefined && !(s instanceof e.view.Options) && (s = r.add(s)), i(t, s || r)
        }
      },
      p = function(t, n) {
        if (this.constructor !== p) {
          var r = new p(t);
          return function(e, t) {
            return r.render(e, t)
          }
        }
        if (typeof t == "function") {
          this.template = {
            fn: t
          };
          return
        }
        e.extend(this, t), this.template = this.scanner.scan(this.text, this.name)
      };
    e.Mustache = window.Mustache = p, p.prototype.render = function(t, n) {
      return t instanceof e.view.Scope || (t = new e.view.Scope(t || {})), n instanceof e.view.Options || (n = new e.view.Options(n || {})), n = n || {}, this.template.fn.call(t, t, n)
    }, e.extend(p.prototype, {
      scanner: new e.view.Scanner({
        text: {
          start: "",
          scope: t,
          options: ",options: options",
          argNames: s
        },
        tokens: [
          ["returnLeft", "{{{", "{{[{&]"],
          ["commentFull", "{{!}}", "^[\\s\\t]*{{!.+?}}\\n"],
          ["commentLeft", "{{!", "(\\n[\\s\\t]*{{!|{{!)"],
          ["escapeFull", "{{}}", "(^[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}$)", function(e) {
            return {
              before: /^\n.+?\n$/.test(e) ? "\n" : "",
              content: e.match(/\{\{(.+?)\}\}/)[1] || ""
            }
          }],
          ["escapeLeft", "{{"],
          ["returnRight", "}}}"],
          ["right", "}}"]
        ],
        helpers: [{
          name: /^>[\s]*\w*/,
          fn: function(t, n) {
            var r = e.trim(t.replace(/^>\s?/, "")).replace(/["|']/g, "");
            return "can.Mustache.renderPartial('" + r + "'," + s + ")"
          }
        }, {
          name: /^\s*data\s/,
          fn: function(e, n) {
            var r = e.match(/["|'](.*)["|']/)[1];
            return "can.proxy(function(__){can.data(can.$(__),'" + r + "', this.attr('.')); }, " + t + ")"
          }
        }, {
          name: /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
          fn: function(e) {
            var n = /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
              r = e.match(n);
            return "can.proxy(function(__){var " + r[1] + "=can.$(__);with(" + t + ".attr('.')){" + r[2] + "}}, this);"
          }
        }, {
          name: /^.*$/,
          fn: function(t, f) {
            var l = !1,
              c = {
                content: "",
                startTxt: !1,
                startOnlyTxt: !1,
                end: !1
              };
            t = e.trim(t);
            if (t.length && (l = t.match(/^([#^/]|else$)/))) {
              l = l[0];
              switch (l) {
                case "#":
                case "^":
                  f.specialAttribute ? c.startOnlyTxt = !0 : (c.startTxt = !0, c.escaped = 0);
                  break;
                case "/":
                  return c.end = !0, c.content += 'return ___v1ew.join("");}}])', c
              }
              t = t.substring(1)
            }
            if (l !== "else") {
              var h = [],
                p = [],
                d = 0,
                v;
              c.content += "can.Mustache.txt(\n" + (f.specialAttribute ? i : r) + ",\n" + (l ? '"' + l + '"' : "null") + ",", (e.trim(t) + " ").replace(o, function(e, t) {
                d && (v = t.match(u)) ? v[2] ? h.push(v[0]) : p.push(v[4] + ":" + (v[6] ? v[6] : a(v[5]))) : h.push(a(t)), d++
              }), c.content += h.join(","), p.length && (c.content += ",{" + n + ":{" + p.join(",") + "}}")
            }
            l && l !== "else" && (c.content += ",[\n\n");
            switch (l) {
              case "^":
              case "#":
                c.content += "{fn:function(" + s + "){var ___v1ew = [];";
                break;
              case "else":
                c.content += 'return ___v1ew.join("");}},\n{inverse:function(' + s + "){\nvar ___v1ew = [];";
                break;
              default:
                c.content += ")"
            }
            return l || (c.startTxt = !0, c.end = !0), c
          }
        }]
      })
    });
    var d = e.view.Scanner.prototype.helpers;
    for (var v = 0; v < d.length; v++) p.prototype.scanner.helpers.unshift(d[v]);
    return p.txt = function(t, r, i) {
      var s = t.scope,
        o = t.options,
        u = [],
        a = {
          fn: function() {},
          inverse: function() {}
        },
        d, v = s.attr("."),
        m = !0,
        g;
      for (var y = 3; y < arguments.length; y++) {
        var b = arguments[y];
        if (r && e.isArray(b)) a = e.extend.apply(e, [a].concat(b));
        else if (b && b[n]) {
          d = b[n];
          for (var w in d) f(d[w]) && (d[w] = p.get(d[w].get, t, !1, !0))
        } else b && f(b) ? u.push(p.get(b.get, t, !1, !0, !0)) : u.push(b)
      }
      if (f(i)) {
        var E = i.get;
        i = p.get(i.get, t, u.length, !1), m = E === i
      }
      a.fn = h(a.fn, s, o), a.inverse = h(a.inverse, s, o);
      if (r === "^") {
        var S = a.fn;
        a.fn = a.inverse, a.inverse = S
      }
      return (g = m && typeof i == "string" && p.getHelper(i, o) || e.isFunction(i) && !i.isComputed && {
        fn: i
      }) ? (e.extend(a, {
        context: v,
        scope: s,
        contexts: s,
        hash: d
      }), u.push(a), function() {
        return g.fn.apply(v, u) || ""
      }) : function() {
        var t;
        e.isFunction(i) && i.isComputed ? t = i() : t = i;
        var n = u.length ? u : [t],
          s = !0,
          o = [],
          f, h, p;
        if (r)
          for (f = 0; f < n.length; f++) p = n[f], h = typeof p != "undefined" && l(p), c(p) ? r === "#" ? s = s && (h ? !!p.attr("length") : !!p.length) : r === "^" && (s = s && (h ? !p.attr("length") : !p.length)) : s = r === "#" ? s && !!p : r === "^" ? s && !p : s;
        if (s) {
          if (r === "#") {
            if (c(t)) {
              var d = l(t);
              for (f = 0; f < t.length; f++) o.push(a.fn(d ? t.attr("" + f) : t[f]));
              return o.join("")
            }
            return a.fn(t || {}) || ""
          }
          return r === "^" ? a.inverse(t || {}) || "" : "" + (t != null ? t : "")
        }
        return ""
      }
    }, p.get = function(t, n, r, i, s) {
      var o = n.scope.attr("."),
        u = n.options || {};
      if (r) {
        if (p.getHelper(t, u)) return t;
        if (n.scope && e.isFunction(o[t])) return o[t]
      }
      var a = n.scope.computeData(t, {
          isArgument: i,
          args: [o, n.scope]
        }),
        f = a.compute;
      e.compute.temporarilyBind(f);
      var l = a.initialValue,
        c = p.getHelper(t, u);
      return !s && (l === undefined || a.scope !== n.scope) && p.getHelper(t, u) ? t : f.hasDependencies ? f : l
    }, p.resolve = function(t) {
      return l(t) && c(t) && t.attr("length") ? t : e.isFunction(t) ? t() : t
    }, e.view.Options = e.view.Scope.extend({
      init: function(t, n) {
        !t.helpers && !t.partials && !t.tags && (t = {
          helpers: t
        }), e.view.Scope.prototype.init.apply(this, arguments)
      }
    }), p._helpers = {}, p.registerHelper = function(e, t) {
      this._helpers[e] = {
        name: e,
        fn: t
      }
    }, p.getHelper = function(e, t) {
      var n;
      return t && (n = t.attr("helpers." + e)), n ? {
        fn: n
      } : this._helpers[e]
    }, p.render = function(t, n, r) {
      if (!e.view.cached[t]) {
        var i = e.__clearReading();
        n.attr("partial") && (t = n.attr("partial")), e.__setReading(i)
      }
      return e.view.render(t, n, r)
    }, p.safeString = function(e) {
      return {
        toString: function() {
          return e
        }
      }
    }, p.renderPartial = function(t, n, r) {
      var i = r.attr("partials." + t);
      return i ? i.render ? i.render(n, r) : i(n, r) : e.Mustache.render(t, n, r)
    }, e.each({
      "if": function(t, n) {
        var r;
        return e.isFunction(t) ? r = e.compute.truthy(t)() : r = !!p.resolve(t), r ? n.fn(n.contexts || this) : n.inverse(n.contexts || this)
      },
      unless: function(t, n) {
        return p._helpers["if"].fn.apply(this, [e.isFunction(t) ? e.compute(function() {
          return !t()
        }) : !t, n])
      },
      each: function(t, n) {
        var r = p.resolve(t),
          i = [],
          s, o, u;
        if (e.view.lists && (r instanceof e.List || t && t.isComputed && r === undefined)) return e.view.lists(t, function(e, t) {
          return n.fn(n.scope.add({
            "@index": t
          }).add(e))
        });
        t = r;
        if (!!t && c(t)) {
          for (u = 0; u < t.length; u++) i.push(n.fn(n.scope.add({
            "@index": u
          }).add(t[u])));
          return i.join("")
        }
        if (l(t)) {
          s = e.Map.keys(t);
          for (u = 0; u < s.length; u++) o = s[u], i.push(n.fn(n.scope.add({
            "@key": o
          }).add(t[o])));
          return i.join("")
        }
        if (t instanceof Object) {
          for (o in t) i.push(n.fn(n.scope.add({
            "@key": o
          }).add(t[o])));
          return i.join("")
        }
      },
      "with": function(e, t) {
        var n = e;
        e = p.resolve(e);
        if (!!e) return t.fn(n)
      },
      log: function(e, t) {
        typeof console != "undefined" && console.log && (t ? console.log(e, t.context) : console.log(e.context))
      },
      "@index": function(t, n) {
        n || (n = t, t = 0);
        var r = n.scope.attr("@index");
        return "" + ((e.isFunction(r) ? r() : r) + t)
      }
    }, function(e, t) {
      p.registerHelper(t, e)
    }), e.view.register({
      suffix: "mustache",
      contentType: "x-mustache-template",
      script: function(e, t) {
        return "can.Mustache(function(" + s + ") { " + (new p({
          text: t,
          name: e
        })).template.out + " })"
      },
      renderer: function(e, t) {
        return p({
          text: t,
          name: e
        })
      }
    }), e.mustache.registerHelper = e.proxy(e.Mustache.registerHelper, e.Mustache), e.mustache.safeString = e.Mustache.safeString, e
  }), define("can/observe", ["can/util/library", "can/map", "can/list", "can/compute"], function(e) {
    return e.Observe = e.Map, e.Observe.startBatch = e.batch.start, e.Observe.stopBatch = e.batch.stop, e.Observe.triggerBatch = e.batch.trigger, e
  }), define("can/view/bindings", ["can/util/library", "can/view/mustache", "can/control"], function(e) {
    var t = function() {
        var e = {
            "": !0,
            "true": !0,
            "false": !1
          },
          t = function(t) {
            if (!t || !t.getAttribute) return;
            var n = t.getAttribute("contenteditable");
            return e[n]
          };
        return function(e) {
          var n = t(e);
          return typeof n == "boolean" ? n : !!t(e.parentNode)
        }
      }(),
      n = function(e) {
        return e[0] === "{" && e[e.length - 1] === "}" ? e.substr(1, e.length - 2) : e
      };
    e.view.attr("can-value", function(r, a) {
      var f = n(r.getAttribute("can-value")),
        l = a.scope.computeData(f, {
          args: []
        }).compute,
        c, h;
      if (r.nodeName.toLowerCase() === "input") {
        r.type === "checkbox" && (e.attr.has(r, "can-true-value") ? c = r.getAttribute("can-true-value") : c = !0, e.attr.has(r, "can-false-value") ? h = r.getAttribute("can-false-value") : h = !1);
        if (r.type === "checkbox" || r.type === "radio") {
          new s(r, {
            value: l,
            trueValue: c,
            falseValue: h
          });
          return
        }
      }
      if (r.nodeName.toLowerCase() === "select" && r.multiple) {
        new o(r, {
          value: l
        });
        return
      }
      if (t(r)) {
        new u(r, {
          value: l
        });
        return
      }
      new i(r, {
        value: l
      })
    });
    var r = {
      enter: function(e, t, n) {
        return {
          event: "keyup",
          handler: function(e) {
            if (e.keyCode === 13) return n.call(this, e)
          }
        }
      }
    };
    e.view.attr(/can-[\w\.]+/, function(t, i) {
      var s = i.attributeName,
        o = s.substr("can-".length),
        u = function(r) {
          var o = n(t.getAttribute(s)),
            u = i.scope.read(o, {
              returnObserveMethods: !0,
              isArgument: !0
            });
          return u.value.call(u.parent, i.scope._context, e.$(this), r)
        };
      if (r[o]) {
        var a = r[o](i, t, u);
        u = a.handler, o = a.event
      }
      e.bind.call(t, o, u)
    });
    var i = e.Control.extend({
        init: function() {
          this.element[0].nodeName.toUpperCase() === "SELECT" ? setTimeout(e.proxy(this.set, this), 1) : this.set()
        },
        "{value} change": "set",
        set: function() {
          if (!this.element) return;
          var e = this.options.value();
          this.element[0].value = e == null ? "" : e
        },
        change: function() {
          if (!this.element) return;
          this.options.value(this.element[0].value)
        }
      }),
      s = e.Control.extend({
        init: function() {
          this.isCheckbox = this.element[0].type.toLowerCase() === "checkbox", this.check()
        },
        "{value} change": "check",
        check: function() {
          if (this.isCheckbox) {
            var t = this.options.value(),
              n = this.options.trueValue || !0;
            this.element[0].checked = t === n
          } else {
            var r = this.options.value() == this.element[0].value ? "set" : "remove";
            e.attr[r](this.element[0], "checked", !0)
          }
        },
        change: function() {
          this.isCheckbox ? this.options.value(this.element[0].checked ? this.options.trueValue : this.options.falseValue) : this.element[0].checked && this.options.value(this.element[0].value)
        }
      }),
      o = i.extend({
        init: function() {
          this.delimiter = ";", this.set()
        },
        set: function() {
          var t = this.options.value();
          typeof t == "string" ? (t = t.split(this.delimiter), this.isString = !0) : t && (t = e.makeArray(t));
          var n = {};
          e.each(t, function(e) {
            n[e] = !0
          }), e.each(this.element[0].childNodes, function(e) {
            e.value && (e.selected = !!n[e.value])
          })
        },
        get: function() {
          var t = [],
            n = this.element[0].childNodes;
          return e.each(n, function(e) {
            e.selected && e.value && t.push(e.value)
          }), t
        },
        change: function() {
          var t = this.get(),
            n = this.options.value();
          this.isString || typeof n == "string" ? (this.isString = !0, this.options.value(t.join(this.delimiter))) : n instanceof e.List ? n.attr(t, !0) : this.options.value(t)
        }
      }),
      u = e.Control.extend({
        init: function() {
          this.set(), this.on("blur", "setValue")
        },
        "{value} change": "set",
        set: function() {
          var e = this.options.value();
          this.element[0].innerHTML = typeof e == "undefined" ? "" : e
        },
        setValue: function() {
          this.options.value(this.element[0].innerHTML)
        }
      })
  }), define("can/component", ["can/util/library", "can/view/callbacks", "can/control", "can/observe", "can/view/mustache", "can/view/bindings"], function(e, t) {
    var n = /^(dataViewId|class|id)$/i,
      r = /\{([^\}]+)\}/g,
      i = e.Component = e.Construct.extend({
        setup: function() {
          e.Construct.setup.apply(this, arguments);
          if (e.Component) {
            var t = this,
              n = this.prototype.scope;
            this.Control = s.extend(this.prototype.events), !n || typeof n == "object" && !(n instanceof e.Map) ? this.Map = e.Map.extend(n || {}) : n.prototype instanceof e.Map && (this.Map = n), this.attributeScopeMappings = {}, e.each(this.Map ? this.Map.defaults : {}, function(e, n) {
              e === "@" && (t.attributeScopeMappings[n] = n)
            });
            if (this.prototype.template)
              if (typeof this.prototype.template == "function") {
                var r = this.prototype.template;
                this.renderer = function() {
                  return e.view.frag(r.apply(null, arguments))
                }
              } else this.renderer = e.view.mustache(this.prototype.template);
            e.view.tag(this.prototype.tag, function(e, n) {
              new t(e, n)
            })
          }
        }
      }, {
        setup: function(r, i) {
          var s = {},
            o = this,
            u = {},
            a, f, l;
          e.each(this.constructor.attributeScopeMappings, function(t, n) {
            s[n] = r.getAttribute(e.hyphenate(t))
          }), e.each(e.makeArray(r.attributes), function(l, c) {
            var h = e.camelize(l.nodeName.toLowerCase()),
              p = l.value;
            if (o.constructor.attributeScopeMappings[h] || n.test(h) || t.attr(l.nodeName)) return;
            if (p[0] === "{" && p[p.length - 1] === "}") p = p.substr(1, p.length - 2);
            else if (i.templateType !== "legacy") {
              s[h] = p;
              return
            }
            var d = i.scope.computeData(p, {
                args: []
              }),
              v = d.compute,
              m = function(e, t) {
                a = h, f.attr(h, t), a = null
              };
            v.bind("change", m), s[h] = v(), v.hasDependencies ? (e.bind.call(r, "removed", function() {
              v.unbind("change", m)
            }), u[h] = d) : v.unbind("change", m)
          });
          if (this.constructor.Map) f = new this.constructor.Map(s);
          else if (this.scope instanceof e.Map) f = this.scope;
          else if (e.isFunction(this.scope)) {
            var c = this.scope(s, i.scope, r);
            c instanceof e.Map ? f = c : c.prototype instanceof e.Map ? f = new c(s) : f = new(e.Map.extend(c))(s)
          }
          var h = {};
          e.each(u, function(e, t) {
            h[t] = function(n, r) {
              a !== t && e.compute(r)
            }, f.bind(t, h[t])
          }), e.bind.call(r, "removed", function() {
            e.each(h, function(e, t) {
              f.unbind(t, h[t])
            })
          }), (!e.isEmptyObject(this.constructor.attributeScopeMappings) || i.templateType !== "legacy") && e.bind.call(r, "attributes", function(t) {
            var i = e.camelize(t.attributeName);
            !u[i] && !n.test(i) && f.attr(i, r.getAttribute(t.attributeName))
          }), this.scope = f, e.data(e.$(r), "scope", this.scope);
          var p = i.scope.add(this.scope),
            d = {
              helpers: {}
            };
          e.each(this.helpers || {}, function(t, n) {
            e.isFunction(t) && (d.helpers[n] = function() {
              return t.apply(f, arguments)
            })
          }), this._control = new this.constructor.Control(r, {
            scope: this.scope
          }), this.constructor.renderer ? (d.tags || (d.tags = {}), d.tags.content = function v(t, n) {
            var r = i.subtemplate || n.subtemplate;
            r && (delete d.tags.content, e.view.live.replace([t], r(n.scope, n.options)), d.tags.content = v)
          }, l = this.constructor.renderer(p, i.options.add(d))) : i.templateType === "legacy" ? l = e.view.frag(i.subtemplate ? i.subtemplate(p, i.options.add(d)) : "") : l = i.subtemplate ? i.subtemplate(p, i.options.add(d)) : document.createDocumentFragment(), e.appendChild(r, l)
        }
      }),
      s = e.Control.extend({
        _lookup: function(e) {
          return [e.scope, e, window]
        },
        _action: function(t, n, i) {
          var s, o;
          r.lastIndex = 0, s = r.test(t);
          if (!i && s) return;
          if (!s) return e.Control._action.apply(this, arguments);
          o = e.compute(function() {
            var i, s = t.replace(r, function(t, r) {
                var s;
                return r === "scope" ? (i = n.scope, "") : (r = r.replace(/^scope\./, ""), s = e.compute.read(n.scope, r.split("."), {
                  isArgument: !0
                }).value, s === undefined && (s = e.getObject(r)), typeof s == "string" ? s : (i = s, ""))
              }),
              o = s.split(/\s+/g),
              u = o.pop();
            return {
              processor: this.processors[u] || this.processors.click,
              parts: [s, o.join(" "), u],
              delegate: i || undefined
            }
          }, this);
          var u = function(e, n) {
            i._bindings.control[t](i.element), i._bindings.control[t] = n.processor(n.delegate || i.element, n.parts[2], n.parts[1], t, i)
          };
          return o.bind("change", u), i._bindings.readyComputes[t] = {
            compute: o,
            handler: u
          }, o()
        }
      }, {
        setup: function(t, n) {
          return this.scope = n.scope, e.Control.prototype.setup.call(this, t, n)
        },
        off: function() {
          this._bindings && e.each(this._bindings.readyComputes || {}, function(e) {
            e.compute.unbind("change", e.handler)
          }), e.Control.prototype.off.apply(this, arguments), this._bindings.readyComputes = {}
        }
      });
    return window.jQuery && jQuery.fn && (jQuery.fn.scope = function(e) {
      return e ? this.data("scope").attr(e) : this.data("scope")
    }), e.scope = function(t, n) {
      return t = e.$(t), n ? e.data(t, "scope").attr(n) : e.data(t, "scope")
    }, i
  }), define("can", ["can/util/library", "can/control/route", "can/model", "can/view/mustache", "can/component"], function(e) {
    return e
  }),
  function(e) {
    typeof define == "function" && define.amd ? define("jquery.cookie", ["jquery"], e) : typeof exports == "object" ? e(require("jquery")) : e(jQuery)
  }(function(e) {
    function n(e) {
      return u.raw ? e : encodeURIComponent(e)
    }

    function r(e) {
      return u.raw ? e : decodeURIComponent(e)
    }

    function i(e) {
      return n(u.json ? JSON.stringify(e) : String(e))
    }

    function s(e) {
      e.indexOf('"') === 0 && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
      try {
        return e = decodeURIComponent(e.replace(t, " ")), u.json ? JSON.parse(e) : e
      } catch (n) {}
    }

    function o(t, n) {
      var r = u.raw ? t : s(t);
      return e.isFunction(n) ? n(r) : r
    }
    var t = /\+/g,
      u = e.cookie = function(t, s, a) {
        if (s !== undefined && !e.isFunction(s)) {
          a = e.extend({}, u.defaults, a);
          if (typeof a.expires == "number") {
            var f = a.expires,
              l = a.expires = new Date;
            l.setTime(+l + f * 864e5)
          }
          return document.cookie = [n(t), "=", i(s), a.expires ? "; expires=" + a.expires.toUTCString() : "", a.path ? "; path=" + a.path : "", a.domain ? "; domain=" + a.domain : "", a.secure ? "; secure" : ""].join("")
        }
        var c = t ? undefined : {},
          h = document.cookie ? document.cookie.split("; ") : [];
        for (var p = 0, d = h.length; p < d; p++) {
          var v = h[p].split("="),
            m = r(v.shift()),
            g = v.join("=");
          if (t && t === m) {
            c = o(g, s);
            break
          }!t && (g = o(g)) !== undefined && (c[m] = g)
        }
        return c
      };
    u.defaults = {}, e.removeCookie = function(t, n) {
      return e.cookie(t) === undefined ? !1 : (e.cookie(t, "", e.extend({}, n, {
        expires: -1
      })), !e.cookie(t))
    }
  }),
  function() {
    var e = this,
      t = e._,
      n = Array.prototype,
      r = Object.prototype,
      i = Function.prototype,
      s = n.push,
      o = n.slice,
      u = n.concat,
      a = r.toString,
      f = r.hasOwnProperty,
      l = Array.isArray,
      c = Object.keys,
      h = i.bind,
      p = function(e) {
        return e instanceof p ? e : this instanceof p ? void(this._wrapped = e) : new p(e)
      };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = p), exports._ = p) : e._ = p, p.VERSION = "1.7.0";
    var d = function(e, t, n) {
      if (t === void 0) return e;
      switch (null == n ? 3 : n) {
        case 1:
          return function(n) {
            return e.call(t, n)
          };
        case 2:
          return function(n, r) {
            return e.call(t, n, r)
          };
        case 3:
          return function(n, r, i) {
            return e.call(t, n, r, i)
          };
        case 4:
          return function(n, r, i, s) {
            return e.call(t, n, r, i, s)
          }
      }
      return function() {
        return e.apply(t, arguments)
      }
    };
    p.iteratee = function(e, t, n) {
      return null == e ? p.identity : p.isFunction(e) ? d(e, t, n) : p.isObject(e) ? p.matches(e) : p.property(e)
    }, p.each = p.forEach = function(e, t, n) {
      if (null == e) return e;
      t = d(t, n);
      var r, i = e.length;
      if (i === +i)
        for (r = 0; i > r; r++) t(e[r], r, e);
      else {
        var s = p.keys(e);
        for (r = 0, i = s.length; i > r; r++) t(e[s[r]], s[r], e)
      }
      return e
    }, p.map = p.collect = function(e, t, n) {
      if (null == e) return [];
      t = p.iteratee(t, n);
      for (var r, i = e.length !== +e.length && p.keys(e), s = (i || e).length, o = Array(s), u = 0; s > u; u++) r = i ? i[u] : u, o[u] = t(e[r], r, e);
      return o
    };
    var v = "Reduce of empty array with no initial value";
    p.reduce = p.foldl = p.inject = function(e, t, n, r) {
      null == e && (e = []), t = d(t, r, 4);
      var i, s = e.length !== +e.length && p.keys(e),
        o = (s || e).length,
        u = 0;
      if (arguments.length < 3) {
        if (!o) throw new TypeError(v);
        n = e[s ? s[u++] : u++]
      }
      for (; o > u; u++) i = s ? s[u] : u, n = t(n, e[i], i, e);
      return n
    }, p.reduceRight = p.foldr = function(e, t, n, r) {
      null == e && (e = []), t = d(t, r, 4);
      var i, s = e.length !== +e.length && p.keys(e),
        o = (s || e).length;
      if (arguments.length < 3) {
        if (!o) throw new TypeError(v);
        n = e[s ? s[--o] : --o]
      }
      for (; o--;) i = s ? s[o] : o, n = t(n, e[i], i, e);
      return n
    }, p.find = p.detect = function(e, t, n) {
      var r;
      return t = p.iteratee(t, n), p.some(e, function(e, n, i) {
        return t(e, n, i) ? (r = e, !0) : void 0
      }), r
    }, p.filter = p.select = function(e, t, n) {
      var r = [];
      return null == e ? r : (t = p.iteratee(t, n), p.each(e, function(e, n, i) {
        t(e, n, i) && r.push(e)
      }), r)
    }, p.reject = function(e, t, n) {
      return p.filter(e, p.negate(p.iteratee(t)), n)
    }, p.every = p.all = function(e, t, n) {
      if (null == e) return !0;
      t = p.iteratee(t, n);
      var r, i, s = e.length !== +e.length && p.keys(e),
        o = (s || e).length;
      for (r = 0; o > r; r++)
        if (i = s ? s[r] : r, !t(e[i], i, e)) return !1;
      return !0
    }, p.some = p.any = function(e, t, n) {
      if (null == e) return !1;
      t = p.iteratee(t, n);
      var r, i, s = e.length !== +e.length && p.keys(e),
        o = (s || e).length;
      for (r = 0; o > r; r++)
        if (i = s ? s[r] : r, t(e[i], i, e)) return !0;
      return !1
    }, p.contains = p.include = function(e, t) {
      return null == e ? !1 : (e.length !== +e.length && (e = p.values(e)), p.indexOf(e, t) >= 0)
    }, p.invoke = function(e, t) {
      var n = o.call(arguments, 2),
        r = p.isFunction(t);
      return p.map(e, function(e) {
        return (r ? t : e[t]).apply(e, n)
      })
    }, p.pluck = function(e, t) {
      return p.map(e, p.property(t))
    }, p.where = function(e, t) {
      return p.filter(e, p.matches(t))
    }, p.findWhere = function(e, t) {
      return p.find(e, p.matches(t))
    }, p.max = function(e, t, n) {
      var r, i, s = -1 / 0,
        o = -1 / 0;
      if (null == t && null != e) {
        e = e.length === +e.length ? e : p.values(e);
        for (var u = 0, a = e.length; a > u; u++) r = e[u], r > s && (s = r)
      } else t = p.iteratee(t, n), p.each(e, function(e, n, r) {
        i = t(e, n, r), (i > o || i === -1 / 0 && s === -1 / 0) && (s = e, o = i)
      });
      return s
    }, p.min = function(e, t, n) {
      var r, i, s = 1 / 0,
        o = 1 / 0;
      if (null == t && null != e) {
        e = e.length === +e.length ? e : p.values(e);
        for (var u = 0, a = e.length; a > u; u++) r = e[u], s > r && (s = r)
      } else t = p.iteratee(t, n), p.each(e, function(e, n, r) {
        i = t(e, n, r), (o > i || 1 / 0 === i && 1 / 0 === s) && (s = e, o = i)
      });
      return s
    }, p.shuffle = function(e) {
      for (var t, n = e && e.length === +e.length ? e : p.values(e), r = n.length, i = Array(r), s = 0; r > s; s++) t = p.random(0, s), t !== s && (i[s] = i[t]), i[t] = n[s];
      return i
    }, p.sample = function(e, t, n) {
      return null == t || n ? (e.length !== +e.length && (e = p.values(e)), e[p.random(e.length - 1)]) : p.shuffle(e).slice(0, Math.max(0, t))
    }, p.sortBy = function(e, t, n) {
      return t = p.iteratee(t, n), p.pluck(p.map(e, function(e, n, r) {
        return {
          value: e,
          index: n,
          criteria: t(e, n, r)
        }
      }).sort(function(e, t) {
        var n = e.criteria,
          r = t.criteria;
        if (n !== r) {
          if (n > r || n === void 0) return 1;
          if (r > n || r === void 0) return -1
        }
        return e.index - t.index
      }), "value")
    };
    var m = function(e) {
      return function(t, n, r) {
        var i = {};
        return n = p.iteratee(n, r), p.each(t, function(r, s) {
          var o = n(r, s, t);
          e(i, r, o)
        }), i
      }
    };
    p.groupBy = m(function(e, t, n) {
      p.has(e, n) ? e[n].push(t) : e[n] = [t]
    }), p.indexBy = m(function(e, t, n) {
      e[n] = t
    }), p.countBy = m(function(e, t, n) {
      p.has(e, n) ? e[n] ++ : e[n] = 1
    }), p.sortedIndex = function(e, t, n, r) {
      n = p.iteratee(n, r, 1);
      for (var i = n(t), s = 0, o = e.length; o > s;) {
        var u = s + o >>> 1;
        n(e[u]) < i ? s = u + 1 : o = u
      }
      return s
    }, p.toArray = function(e) {
      return e ? p.isArray(e) ? o.call(e) : e.length === +e.length ? p.map(e, p.identity) : p.values(e) : []
    }, p.size = function(e) {
      return null == e ? 0 : e.length === +e.length ? e.length : p.keys(e).length
    }, p.partition = function(e, t, n) {
      t = p.iteratee(t, n);
      var r = [],
        i = [];
      return p.each(e, function(e, n, s) {
        (t(e, n, s) ? r : i).push(e)
      }), [r, i]
    }, p.first = p.head = p.take = function(e, t, n) {
      return null == e ? void 0 : null == t || n ? e[0] : 0 > t ? [] : o.call(e, 0, t)
    }, p.initial = function(e, t, n) {
      return o.call(e, 0, Math.max(0, e.length - (null == t || n ? 1 : t)))
    }, p.last = function(e, t, n) {
      return null == e ? void 0 : null == t || n ? e[e.length - 1] : o.call(e, Math.max(e.length - t, 0))
    }, p.rest = p.tail = p.drop = function(e, t, n) {
      return o.call(e, null == t || n ? 1 : t)
    }, p.compact = function(e) {
      return p.filter(e, p.identity)
    };
    var g = function(e, t, n, r) {
      if (t && p.every(e, p.isArray)) return u.apply(r, e);
      for (var i = 0, o = e.length; o > i; i++) {
        var a = e[i];
        p.isArray(a) || p.isArguments(a) ? t ? s.apply(r, a) : g(a, t, n, r) : n || r.push(a)
      }
      return r
    };
    p.flatten = function(e, t) {
      return g(e, t, !1, [])
    }, p.without = function(e) {
      return p.difference(e, o.call(arguments, 1))
    }, p.uniq = p.unique = function(e, t, n, r) {
      if (null == e) return [];
      p.isBoolean(t) || (r = n, n = t, t = !1), null != n && (n = p.iteratee(n, r));
      for (var i = [], s = [], o = 0, u = e.length; u > o; o++) {
        var a = e[o];
        if (t) o && s === a || i.push(a), s = a;
        else if (n) {
          var f = n(a, o, e);
          p.indexOf(s, f) < 0 && (s.push(f), i.push(a))
        } else p.indexOf(i, a) < 0 && i.push(a)
      }
      return i
    }, p.union = function() {
      return p.uniq(g(arguments, !0, !0, []))
    }, p.intersection = function(e) {
      if (null == e) return [];
      for (var t = [], n = arguments.length, r = 0, i = e.length; i > r; r++) {
        var s = e[r];
        if (!p.contains(t, s)) {
          for (var o = 1; n > o && p.contains(arguments[o], s); o++);
          o === n && t.push(s)
        }
      }
      return t
    }, p.difference = function(e) {
      var t = g(o.call(arguments, 1), !0, !0, []);
      return p.filter(e, function(e) {
        return !p.contains(t, e)
      })
    }, p.zip = function(e) {
      if (null == e) return [];
      for (var t = p.max(arguments, "length").length, n = Array(t), r = 0; t > r; r++) n[r] = p.pluck(arguments, r);
      return n
    }, p.object = function(e, t) {
      if (null == e) return {};
      for (var n = {}, r = 0, i = e.length; i > r; r++) t ? n[e[r]] = t[r] : n[e[r][0]] = e[r][1];
      return n
    }, p.indexOf = function(e, t, n) {
      if (null == e) return -1;
      var r = 0,
        i = e.length;
      if (n) {
        if ("number" != typeof n) return r = p.sortedIndex(e, t), e[r] === t ? r : -1;
        r = 0 > n ? Math.max(0, i + n) : n
      }
      for (; i > r; r++)
        if (e[r] === t) return r;
      return -1
    }, p.lastIndexOf = function(e, t, n) {
      if (null == e) return -1;
      var r = e.length;
      for ("number" == typeof n && (r = 0 > n ? r + n + 1 : Math.min(r, n + 1)); --r >= 0;)
        if (e[r] === t) return r;
      return -1
    }, p.range = function(e, t, n) {
      arguments.length <= 1 && (t = e || 0, e = 0), n = n || 1;
      for (var r = Math.max(Math.ceil((t - e) / n), 0), i = Array(r), s = 0; r > s; s++, e += n) i[s] = e;
      return i
    };
    var y = function() {};
    p.bind = function(e, t) {
      var n, r;
      if (h && e.bind === h) return h.apply(e, o.call(arguments, 1));
      if (!p.isFunction(e)) throw new TypeError("Bind must be called on a function");
      return n = o.call(arguments, 2), r = function() {
        if (this instanceof r) {
          y.prototype = e.prototype;
          var i = new y;
          y.prototype = null;
          var s = e.apply(i, n.concat(o.call(arguments)));
          return p.isObject(s) ? s : i
        }
        return e.apply(t, n.concat(o.call(arguments)))
      }
    }, p.partial = function(e) {
      var t = o.call(arguments, 1);
      return function() {
        for (var n = 0, r = t.slice(), i = 0, s = r.length; s > i; i++) r[i] === p && (r[i] = arguments[n++]);
        for (; n < arguments.length;) r.push(arguments[n++]);
        return e.apply(this, r)
      }
    }, p.bindAll = function(e) {
      var t, n, r = arguments.length;
      if (1 >= r) throw new Error("bindAll must be passed function names");
      for (t = 1; r > t; t++) n = arguments[t], e[n] = p.bind(e[n], e);
      return e
    }, p.memoize = function(e, t) {
      var n = function(r) {
        var i = n.cache,
          s = t ? t.apply(this, arguments) : r;
        return p.has(i, s) || (i[s] = e.apply(this, arguments)), i[s]
      };
      return n.cache = {}, n
    }, p.delay = function(e, t) {
      var n = o.call(arguments, 2);
      return setTimeout(function() {
        return e.apply(null, n)
      }, t)
    }, p.defer = function(e) {
      return p.delay.apply(p, [e, 1].concat(o.call(arguments, 1)))
    }, p.throttle = function(e, t, n) {
      var r, i, s, o = null,
        u = 0;
      n || (n = {});
      var a = function() {
        u = n.leading === !1 ? 0 : p.now(), o = null, s = e.apply(r, i), o || (r = i = null)
      };
      return function() {
        var f = p.now();
        u || n.leading !== !1 || (u = f);
        var l = t - (f - u);
        return r = this, i = arguments, 0 >= l || l > t ? (clearTimeout(o), o = null, u = f, s = e.apply(r, i), o || (r = i = null)) : o || n.trailing === !1 || (o = setTimeout(a, l)), s
      }
    }, p.debounce = function(e, t, n) {
      var r, i, s, o, u, a = function() {
        var f = p.now() - o;
        t > f && f > 0 ? r = setTimeout(a, t - f) : (r = null, n || (u = e.apply(s, i), r || (s = i = null)))
      };
      return function() {
        s = this, i = arguments, o = p.now();
        var f = n && !r;
        return r || (r = setTimeout(a, t)), f && (u = e.apply(s, i), s = i = null), u
      }
    }, p.wrap = function(e, t) {
      return p.partial(t, e)
    }, p.negate = function(e) {
      return function() {
        return !e.apply(this, arguments)
      }
    }, p.compose = function() {
      var e = arguments,
        t = e.length - 1;
      return function() {
        for (var n = t, r = e[t].apply(this, arguments); n--;) r = e[n].call(this, r);
        return r
      }
    }, p.after = function(e, t) {
      return function() {
        return --e < 1 ? t.apply(this, arguments) : void 0
      }
    }, p.before = function(e, t) {
      var n;
      return function() {
        return --e > 0 ? n = t.apply(this, arguments) : t = null, n
      }
    }, p.once = p.partial(p.before, 2), p.keys = function(e) {
      if (!p.isObject(e)) return [];
      if (c) return c(e);
      var t = [];
      for (var n in e) p.has(e, n) && t.push(n);
      return t
    }, p.values = function(e) {
      for (var t = p.keys(e), n = t.length, r = Array(n), i = 0; n > i; i++) r[i] = e[t[i]];
      return r
    }, p.pairs = function(e) {
      for (var t = p.keys(e), n = t.length, r = Array(n), i = 0; n > i; i++) r[i] = [t[i], e[t[i]]];
      return r
    }, p.invert = function(e) {
      for (var t = {}, n = p.keys(e), r = 0, i = n.length; i > r; r++) t[e[n[r]]] = n[r];
      return t
    }, p.functions = p.methods = function(e) {
      var t = [];
      for (var n in e) p.isFunction(e[n]) && t.push(n);
      return t.sort()
    }, p.extend = function(e) {
      if (!p.isObject(e)) return e;
      for (var t, n, r = 1, i = arguments.length; i > r; r++) {
        t = arguments[r];
        for (n in t) f.call(t, n) && (e[n] = t[n])
      }
      return e
    }, p.pick = function(e, t, n) {
      var r, i = {};
      if (null == e) return i;
      if (p.isFunction(t)) {
        t = d(t, n);
        for (r in e) {
          var s = e[r];
          t(s, r, e) && (i[r] = s)
        }
      } else {
        var a = u.apply([], o.call(arguments, 1));
        e = new Object(e);
        for (var f = 0, l = a.length; l > f; f++) r = a[f], r in e && (i[r] = e[r])
      }
      return i
    }, p.omit = function(e, t, n) {
      if (p.isFunction(t)) t = p.negate(t);
      else {
        var r = p.map(u.apply([], o.call(arguments, 1)), String);
        t = function(e, t) {
          return !p.contains(r, t)
        }
      }
      return p.pick(e, t, n)
    }, p.defaults = function(e) {
      if (!p.isObject(e)) return e;
      for (var t = 1, n = arguments.length; n > t; t++) {
        var r = arguments[t];
        for (var i in r) e[i] === void 0 && (e[i] = r[i])
      }
      return e
    }, p.clone = function(e) {
      return p.isObject(e) ? p.isArray(e) ? e.slice() : p.extend({}, e) : e
    }, p.tap = function(e, t) {
      return t(e), e
    };
    var b = function(e, t, n, r) {
      if (e === t) return 0 !== e || 1 / e === 1 / t;
      if (null == e || null == t) return e === t;
      e instanceof p && (e = e._wrapped), t instanceof p && (t = t._wrapped);
      var i = a.call(e);
      if (i !== a.call(t)) return !1;
      switch (i) {
        case "[object RegExp]":
        case "[object String]":
          return "" + e == "" + t;
        case "[object Number]":
          return +e !== +e ? +t !== +t : 0 === +e ? 1 / +e === 1 / t : +e === +t;
        case "[object Date]":
        case "[object Boolean]":
          return +e === +t
      }
      if ("object" != typeof e || "object" != typeof t) return !1;
      for (var s = n.length; s--;)
        if (n[s] === e) return r[s] === t;
      var o = e.constructor,
        u = t.constructor;
      if (o !== u && "constructor" in e && "constructor" in t && !(p.isFunction(o) && o instanceof o && p.isFunction(u) && u instanceof u)) return !1;
      n.push(e), r.push(t);
      var f, l;
      if ("[object Array]" === i) {
        if (f = e.length, l = f === t.length)
          for (; f-- && (l = b(e[f], t[f], n, r)););
      } else {
        var c, h = p.keys(e);
        if (f = h.length, l = p.keys(t).length === f)
          for (; f-- && (c = h[f], l = p.has(t, c) && b(e[c], t[c], n, r)););
      }
      return n.pop(), r.pop(), l
    };
    p.isEqual = function(e, t) {
      return b(e, t, [], [])
    }, p.isEmpty = function(e) {
      if (null == e) return !0;
      if (p.isArray(e) || p.isString(e) || p.isArguments(e)) return 0 === e.length;
      for (var t in e)
        if (p.has(e, t)) return !1;
      return !0
    }, p.isElement = function(e) {
      return !!e && 1 === e.nodeType
    }, p.isArray = l || function(e) {
      return "[object Array]" === a.call(e)
    }, p.isObject = function(e) {
      var t = typeof e;
      return "function" === t || "object" === t && !!e
    }, p.each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(e) {
      p["is" + e] = function(t) {
        return a.call(t) === "[object " + e + "]"
      }
    }), p.isArguments(arguments) || (p.isArguments = function(e) {
      return p.has(e, "callee")
    }), "function" != typeof /./ && (p.isFunction = function(e) {
      return "function" == typeof e || !1
    }), p.isFinite = function(e) {
      return isFinite(e) && !isNaN(parseFloat(e))
    }, p.isNaN = function(e) {
      return p.isNumber(e) && e !== +e
    }, p.isBoolean = function(e) {
      return e === !0 || e === !1 || "[object Boolean]" === a.call(e)
    }, p.isNull = function(e) {
      return null === e
    }, p.isUndefined = function(e) {
      return e === void 0
    }, p.has = function(e, t) {
      return null != e && f.call(e, t)
    }, p.noConflict = function() {
      return e._ = t, this
    }, p.identity = function(e) {
      return e
    }, p.constant = function(e) {
      return function() {
        return e
      }
    }, p.noop = function() {}, p.property = function(e) {
      return function(t) {
        return t[e]
      }
    }, p.matches = function(e) {
      var t = p.pairs(e),
        n = t.length;
      return function(e) {
        if (null == e) return !n;
        e = new Object(e);
        for (var r = 0; n > r; r++) {
          var i = t[r],
            s = i[0];
          if (i[1] !== e[s] || !(s in e)) return !1
        }
        return !0
      }
    }, p.times = function(e, t, n) {
      var r = Array(Math.max(0, e));
      t = d(t, n, 1);
      for (var i = 0; e > i; i++) r[i] = t(i);
      return r
    }, p.random = function(e, t) {
      return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1))
    }, p.now = Date.now || function() {
      return (new Date).getTime()
    };
    var w = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      },
      E = p.invert(w),
      S = function(e) {
        var t = function(t) {
            return e[t]
          },
          n = "(?:" + p.keys(e).join("|") + ")",
          r = RegExp(n),
          i = RegExp(n, "g");
        return function(e) {
          return e = null == e ? "" : "" + e, r.test(e) ? e.replace(i, t) : e
        }
      };
    p.escape = S(w), p.unescape = S(E), p.result = function(e, t) {
      if (null == e) return void 0;
      var n = e[t];
      return p.isFunction(n) ? e[t]() : n
    };
    var x = 0;
    p.uniqueId = function(e) {
      var t = ++x + "";
      return e ? e + t : t
    }, p.templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
    };
    var T = /(.)^/,
      N = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
      },
      C = /\\|'|\r|\n|\u2028|\u2029/g,
      k = function(e) {
        return "\\" + N[e]
      };
    p.template = function(e, t, n) {
      !t && n && (t = n), t = p.defaults({}, t, p.templateSettings);
      var r = RegExp([(t.escape || T).source, (t.interpolate || T).source, (t.evaluate || T).source].join("|") + "|$", "g"),
        i = 0,
        s = "__p+='";
      e.replace(r, function(t, n, r, o, u) {
        return s += e.slice(i, u).replace(C, k), i = u + t.length, n ? s += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : r ? s += "'+\n((__t=(" + r + "))==null?'':__t)+\n'" : o && (s += "';\n" + o + "\n__p+='"), t
      }), s += "';\n", t.variable || (s = "with(obj||{}){\n" + s + "}\n"), s = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + s + "return __p;\n";
      try {
        var o = new Function(t.variable || "obj", "_", s)
      } catch (u) {
        throw u.source = s, u
      }
      var a = function(e) {
          return o.call(this, e, p)
        },
        f = t.variable || "obj";
      return a.source = "function(" + f + "){\n" + s + "}", a
    }, p.chain = function(e) {
      var t = p(e);
      return t._chain = !0, t
    };
    var L = function(e) {
      return this._chain ? p(e).chain() : e
    };
    p.mixin = function(e) {
      p.each(p.functions(e), function(t) {
        var n = p[t] = e[t];
        p.prototype[t] = function() {
          var e = [this._wrapped];
          return s.apply(e, arguments), L.call(this, n.apply(p, e))
        }
      })
    }, p.mixin(p), p.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(e) {
      var t = n[e];
      p.prototype[e] = function() {
        var n = this._wrapped;
        return t.apply(n, arguments), "shift" !== e && "splice" !== e || 0 !== n.length || delete n[0], L.call(this, n)
      }
    }), p.each(["concat", "join", "slice"], function(e) {
      var t = n[e];
      p.prototype[e] = function() {
        return L.call(this, t.apply(this._wrapped, arguments))
      }
    }), p.prototype.value = function() {
      return this._wrapped
    }, "function" == typeof define && define.amd && define("underscore", [], function() {
      return p
    })
  }.call(this), ! function(e, t) {
    function n(e, t) {
      var n, r, i = e.toLowerCase();
      for (t = [].concat(t), n = 0; n < t.length; n += 1)
        if (r = t[n]) {
          if (r.test && r.test(e)) return !0;
          if (r.toLowerCase() === i) return !0
        }
    }
    var r = t.prototype.trim,
      i = t.prototype.trimRight,
      s = t.prototype.trimLeft,
      o = function(e) {
        return 1 * e || 0
      },
      u = function(e, t) {
        if (1 > t) return "";
        for (var n = ""; t > 0;) 1 & t && (n += e), t >>= 1, e += e;
        return n
      },
      a = [].slice,
      f = function(e) {
        return null == e ? "\\s" : e.source ? e.source : "[" + d.escapeRegExp(e) + "]"
      },
      l = {
        lt: "<",
        gt: ">",
        quot: '"',
        amp: "&",
        apos: "'"
      },
      c = {};
    for (var h in l) c[l[h]] = h;
    c["'"] = "#39";
    var p = function() {
        function e(e) {
          return Object.prototype.toString.call(e).slice(8, -1).toLowerCase()
        }
        var n = u,
          r = function() {
            return r.cache.hasOwnProperty(arguments[0]) || (r.cache[arguments[0]] = r.parse(arguments[0])), r.format.call(null, r.cache[arguments[0]], arguments)
          };
        return r.format = function(r, i) {
          var s, o, u, a, f, l, c, h = 1,
            d = r.length,
            v = "",
            m = [];
          for (o = 0; d > o; o++)
            if (v = e(r[o]), "string" === v) m.push(r[o]);
            else if ("array" === v) {
            if (a = r[o], a[2])
              for (s = i[h], u = 0; u < a[2].length; u++) {
                if (!s.hasOwnProperty(a[2][u])) throw new Error(p('[_.sprintf] property "%s" does not exist', a[2][u]));
                s = s[a[2][u]]
              } else s = a[1] ? i[a[1]] : i[h++];
            if (/[^s]/.test(a[8]) && "number" != e(s)) throw new Error(p("[_.sprintf] expecting number but found %s", e(s)));
            switch (a[8]) {
              case "b":
                s = s.toString(2);
                break;
              case "c":
                s = t.fromCharCode(s);
                break;
              case "d":
                s = parseInt(s, 10);
                break;
              case "e":
                s = a[7] ? s.toExponential(a[7]) : s.toExponential();
                break;
              case "f":
                s = a[7] ? parseFloat(s).toFixed(a[7]) : parseFloat(s);
                break;
              case "o":
                s = s.toString(8);
                break;
              case "s":
                s = (s = t(s)) && a[7] ? s.substring(0, a[7]) : s;
                break;
              case "u":
                s = Math.abs(s);
                break;
              case "x":
                s = s.toString(16);
                break;
              case "X":
                s = s.toString(16).toUpperCase()
            }
            s = /[def]/.test(a[8]) && a[3] && s >= 0 ? "+" + s : s, l = a[4] ? "0" == a[4] ? "0" : a[4].charAt(1) : " ", c = a[6] - t(s).length, f = a[6] ? n(l, c) : "", m.push(a[5] ? s + f : f + s)
          }
          return m.join("")
        }, r.cache = {}, r.parse = function(e) {
          for (var t = e, n = [], r = [], i = 0; t;) {
            if (null !== (n = /^[^\x25]+/.exec(t))) r.push(n[0]);
            else if (null !== (n = /^\x25{2}/.exec(t))) r.push("%");
            else {
              if (null === (n = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(t))) throw new Error("[_.sprintf] huh?");
              if (n[2]) {
                i |= 1;
                var s = [],
                  o = n[2],
                  u = [];
                if (null === (u = /^([a-z_][a-z_\d]*)/i.exec(o))) throw new Error("[_.sprintf] huh?");
                for (s.push(u[1]);
                  "" !== (o = o.substring(u[0].length));)
                  if (null !== (u = /^\.([a-z_][a-z_\d]*)/i.exec(o))) s.push(u[1]);
                  else {
                    if (null === (u = /^\[(\d+)\]/.exec(o))) throw new Error("[_.sprintf] huh?");
                    s.push(u[1])
                  }
                n[2] = s
              } else i |= 2;
              if (3 === i) throw new Error("[_.sprintf] mixing positional and named placeholders is not (yet) supported");
              r.push(n)
            }
            t = t.substring(n[0].length)
          }
          return r
        }, r
      }(),
      d = {
        VERSION: "2.4.0",
        isBlank: function(e) {
          return null == e && (e = ""), /^\s*$/.test(e)
        },
        stripTags: function(e) {
          return null == e ? "" : t(e).replace(/<\/?[^>]+>/g, "")
        },
        capitalize: function(e) {
          return e = null == e ? "" : t(e), e.charAt(0).toUpperCase() + e.slice(1)
        },
        chop: function(e, n) {
          return null == e ? [] : (e = t(e), n = ~~n, n > 0 ? e.match(new RegExp(".{1," + n + "}", "g")) : [e])
        },
        clean: function(e) {
          return d.strip(e).replace(/\s+/g, " ")
        },
        count: function(e, n) {
          if (null == e || null == n) return 0;
          e = t(e), n = t(n);
          for (var r = 0, i = 0, s = n.length;;) {
            if (i = e.indexOf(n, i), -1 === i) break;
            r++, i += s
          }
          return r
        },
        chars: function(e) {
          return null == e ? [] : t(e).split("")
        },
        swapCase: function(e) {
          return null == e ? "" : t(e).replace(/\S/g, function(e) {
            return e === e.toUpperCase() ? e.toLowerCase() : e.toUpperCase()
          })
        },
        escapeHTML: function(e) {
          return null == e ? "" : t(e).replace(/[&<>"']/g, function(e) {
            return "&" + c[e] + ";"
          })
        },
        unescapeHTML: function(e) {
          return null == e ? "" : t(e).replace(/\&([^;]+);/g, function(e, n) {
            var r;
            return n in l ? l[n] : (r = n.match(/^#x([\da-fA-F]+)$/)) ? t.fromCharCode(parseInt(r[1], 16)) : (r = n.match(/^#(\d+)$/)) ? t.fromCharCode(~~r[1]) : e
          })
        },
        escapeRegExp: function(e) {
          return null == e ? "" : t(e).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
        },
        splice: function(e, t, n, r) {
          var i = d.chars(e);
          return i.splice(~~t, ~~n, r), i.join("")
        },
        insert: function(e, t, n) {
          return d.splice(e, t, 0, n)
        },
        include: function(e, n) {
          return "" === n ? !0 : null == e ? !1 : -1 !== t(e).indexOf(n)
        },
        join: function() {
          var e = a.call(arguments),
            t = e.shift();
          return null == t && (t = ""), e.join(t)
        },
        lines: function(e) {
          return null == e ? [] : t(e).split("\n")
        },
        reverse: function(e) {
          return d.chars(e).reverse().join("")
        },
        startsWith: function(e, n) {
          return "" === n ? !0 : null == e || null == n ? !1 : (e = t(e), n = t(n), e.length >= n.length && e.slice(0, n.length) === n)
        },
        endsWith: function(e, n) {
          return "" === n ? !0 : null == e || null == n ? !1 : (e = t(e), n = t(n), e.length >= n.length && e.slice(e.length - n.length) === n)
        },
        succ: function(e) {
          return null == e ? "" : (e = t(e), e.slice(0, -1) + t.fromCharCode(e.charCodeAt(e.length - 1) + 1))
        },
        titleize: function(e) {
          return null == e ? "" : (e = t(e).toLowerCase(), e.replace(/(?:^|\s|-)\S/g, function(e) {
            return e.toUpperCase()
          }))
        },
        camelize: function(e) {
          return d.trim(e).replace(/[-_\s]+(.)?/g, function(e, t) {
            return t ? t.toUpperCase() : ""
          })
        },
        underscored: function(e) {
          return d.trim(e).replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase()
        },
        dasherize: function(e) {
          return d.trim(e).replace(/([A-Z])/g, "-$1").replace(/[-_\s]+/g, "-").toLowerCase()
        },
        classify: function(e) {
          return d.capitalize(d.camelize(t(e).replace(/[\W_]/g, " ")).replace(/\s/g, ""))
        },
        humanize: function(e) {
          return d.capitalize(d.underscored(e).replace(/_id$/, "").replace(/_/g, " "))
        },
        trim: function(e, n) {
          return null == e ? "" : !n && r ? r.call(e) : (n = f(n), t(e).replace(new RegExp("^" + n + "+|" + n + "+$", "g"), ""))
        },
        ltrim: function(e, n) {
          return null == e ? "" : !n && s ? s.call(e) : (n = f(n), t(e).replace(new RegExp("^" + n + "+"), ""))
        },
        rtrim: function(e, n) {
          return null == e ? "" : !n && i ? i.call(e) : (n = f(n), t(e).replace(new RegExp(n + "+$"), ""))
        },
        truncate: function(e, n, r) {
          return null == e ? "" : (e = t(e), r = r || "...", n = ~~n, e.length > n ? e.slice(0, n) + r : e)
        },
        prune: function(e, n, r) {
          if (null == e) return "";
          if (e = t(e), n = ~~n, r = null != r ? t(r) : "...", e.length <= n) return e;
          var i = function(e) {
              return e.toUpperCase() !== e.toLowerCase() ? "A" : " "
            },
            s = e.slice(0, n + 1).replace(/.(?=\W*\w*$)/g, i);
          return s = s.slice(s.length - 2).match(/\w\w/) ? s.replace(/\s*\S+$/, "") : d.rtrim(s.slice(0, s.length - 1)), (s + r).length > e.length ? e : e.slice(0, s.length) + r
        },
        words: function(e, t) {
          return d.isBlank(e) ? [] : d.trim(e, t).split(t || /\s+/)
        },
        pad: function(e, n, r, i) {
          e = null == e ? "" : t(e), n = ~~n;
          var s = 0;
          switch (r ? r.length > 1 && (r = r.charAt(0)) : r = " ", i) {
            case "right":
              return s = n - e.length, e + u(r, s);
            case "both":
              return s = n - e.length, u(r, Math.ceil(s / 2)) + e + u(r, Math.floor(s / 2));
            default:
              return s = n - e.length, u(r, s) + e
          }
        },
        lpad: function(e, t, n) {
          return d.pad(e, t, n)
        },
        rpad: function(e, t, n) {
          return d.pad(e, t, n, "right")
        },
        lrpad: function(e, t, n) {
          return d.pad(e, t, n, "both")
        },
        sprintf: p,
        vsprintf: function(e, t) {
          return t.unshift(e), p.apply(null, t)
        },
        toNumber: function(e, t) {
          return e ? (e = d.trim(e), e.match(/^-?\d+(?:\.\d+)?$/) ? o(o(e).toFixed(~~t)) : 0 / 0) : 0
        },
        numberFormat: function(e, t, n, r) {
          if (isNaN(e) || null == e) return "";
          e = e.toFixed(~~t), r = "string" == typeof r ? r : ",";
          var i = e.split("."),
            s = i[0],
            o = i[1] ? (n || ".") + i[1] : "";
          return s.replace(/(\d)(?=(?:\d{3})+$)/g, "$1" + r) + o
        },
        strRight: function(e, n) {
          if (null == e) return "";
          e = t(e), n = null != n ? t(n) : n;
          var r = n ? e.indexOf(n) : -1;
          return ~r ? e.slice(r + n.length, e.length) : e
        },
        strRightBack: function(e, n) {
          if (null == e) return "";
          e = t(e), n = null != n ? t(n) : n;
          var r = n ? e.lastIndexOf(n) : -1;
          return ~r ? e.slice(r + n.length, e.length) : e
        },
        strLeft: function(e, n) {
          if (null == e) return "";
          e = t(e), n = null != n ? t(n) : n;
          var r = n ? e.indexOf(n) : -1;
          return ~r ? e.slice(0, r) : e
        },
        strLeftBack: function(e, t) {
          if (null == e) return "";
          e += "", t = null != t ? "" + t : t;
          var n = e.lastIndexOf(t);
          return ~n ? e.slice(0, n) : e
        },
        toSentence: function(e, t, n, r) {
          t = t || ", ", n = n || " and ";
          var i = e.slice(),
            s = i.pop();
          return e.length > 2 && r && (n = d.rtrim(t) + n), i.length ? i.join(t) + n + s : s
        },
        toSentenceSerial: function() {
          var e = a.call(arguments);
          return e[3] = !0, d.toSentence.apply(d, e)
        },
        slugify: function(e) {
          if (null == e) return "";
          var n = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",
            r = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",
            i = new RegExp(f(n), "g");
          return e = t(e).toLowerCase().replace(i, function(e) {
            var t = n.indexOf(e);
            return r.charAt(t) || "-"
          }), d.dasherize(e.replace(/[^\w\s-]/g, ""))
        },
        surround: function(e, t) {
          return [t, e, t].join("")
        },
        quote: function(e, t) {
          return d.surround(e, t || '"')
        },
        unquote: function(e, t) {
          return t = t || '"', e[0] === t && e[e.length - 1] === t ? e.slice(1, e.length - 1) : e
        },
        exports: function() {
          var e = {};
          for (var t in this) this.hasOwnProperty(t) && !t.match(/^(?:include|contains|reverse)$/) && (e[t] = this[t]);
          return e
        },
        repeat: function(e, n, r) {
          if (null == e) return "";
          if (n = ~~n, null == r) return u(t(e), n);
          for (var i = []; n > 0; i[--n] = e);
          return i.join(r)
        },
        naturalCmp: function(e, n) {
          if (e == n) return 0;
          if (!e) return -1;
          if (!n) return 1;
          for (var r = /(\.\d+)|(\d+)|(\D+)/g, i = t(e).toLowerCase().match(r), s = t(n).toLowerCase().match(r), o = Math.min(i.length, s.length), u = 0; o > u; u++) {
            var a = i[u],
              f = s[u];
            if (a !== f) {
              var l = parseInt(a, 10);
              if (!isNaN(l)) {
                var c = parseInt(f, 10);
                if (!isNaN(c) && l - c) return l - c
              }
              return f > a ? -1 : 1
            }
          }
          return i.length === s.length ? i.length - s.length : n > e ? -1 : 1
        },
        levenshtein: function(e, n) {
          if (null == e && null == n) return 0;
          if (null == e) return t(n).length;
          if (null == n) return t(e).length;
          e = t(e), n = t(n);
          for (var r, i, s = [], o = 0; o <= n.length; o++)
            for (var u = 0; u <= e.length; u++) i = o && u ? e.charAt(u - 1) === n.charAt(o - 1) ? r : Math.min(s[u], s[u - 1], r) + 1 : o + u, r = s[u], s[u] = i;
          return s.pop()
        },
        toBoolean: function(e, t, r) {
          return "number" == typeof e && (e = "" + e), "string" != typeof e ? !!e : (e = d.trim(e), n(e, t || ["true", "1"]) ? !0 : n(e, r || ["false", "0"]) ? !1 : void 0)
        }
      };
    d.strip = d.trim, d.lstrip = d.ltrim, d.rstrip = d.rtrim, d.center = d.lrpad, d.rjust = d.lpad, d.ljust = d.rpad, d.contains = d.include, d.q = d.quote, d.toBool = d.toBoolean, "undefined" != typeof exports && ("undefined" != typeof module && module.exports && (module.exports = d), exports._s = d), "function" == typeof define && define.amd && define("underscore.string", [], function() {
      return d
    }), e._ = e._ || {}, e._.string = e._.str = d
  }(this, String), ! function(e) {
    function t(e, t) {
      var n = (65535 & e) + (65535 & t),
        r = (e >> 16) + (t >> 16) + (n >> 16);
      return r << 16 | 65535 & n
    }

    function n(e, t) {
      return e << t | e >>> 32 - t
    }

    function r(e, r, i, s, o, u) {
      return t(n(t(t(r, e), t(s, u)), o), i)
    }

    function i(e, t, n, i, s, o, u) {
      return r(t & n | ~t & i, e, t, s, o, u)
    }

    function s(e, t, n, i, s, o, u) {
      return r(t & i | n & ~i, e, t, s, o, u)
    }

    function o(e, t, n, i, s, o, u) {
      return r(t ^ n ^ i, e, t, s, o, u)
    }

    function u(e, t, n, i, s, o, u) {
      return r(n ^ (t | ~i), e, t, s, o, u)
    }

    function a(e, n) {
      e[n >> 5] |= 128 << n % 32, e[(n + 64 >>> 9 << 4) + 14] = n;
      var r, a, f, l, c, h = 1732584193,
        p = -271733879,
        d = -1732584194,
        v = 271733878;
      for (r = 0; r < e.length; r += 16) a = h, f = p, l = d, c = v, h = i(h, p, d, v, e[r], 7, -680876936), v = i(v, h, p, d, e[r + 1], 12, -389564586), d = i(d, v, h, p, e[r + 2], 17, 606105819), p = i(p, d, v, h, e[r + 3], 22, -1044525330), h = i(h, p, d, v, e[r + 4], 7, -176418897), v = i(v, h, p, d, e[r + 5], 12, 1200080426), d = i(d, v, h, p, e[r + 6], 17, -1473231341), p = i(p, d, v, h, e[r + 7], 22, -45705983), h = i(h, p, d, v, e[r + 8], 7, 1770035416), v = i(v, h, p, d, e[r + 9], 12, -1958414417), d = i(d, v, h, p, e[r + 10], 17, -42063), p = i(p, d, v, h, e[r + 11], 22, -1990404162), h = i(h, p, d, v, e[r + 12], 7, 1804603682), v = i(v, h, p, d, e[r + 13], 12, -40341101), d = i(d, v, h, p, e[r + 14], 17, -1502002290), p = i(p, d, v, h, e[r + 15], 22, 1236535329), h = s(h, p, d, v, e[r + 1], 5, -165796510), v = s(v, h, p, d, e[r + 6], 9, -1069501632), d = s(d, v, h, p, e[r + 11], 14, 643717713), p = s(p, d, v, h, e[r], 20, -373897302), h = s(h, p, d, v, e[r + 5], 5, -701558691), v = s(v, h, p, d, e[r + 10], 9, 38016083), d = s(d, v, h, p, e[r + 15], 14, -660478335), p = s(p, d, v, h, e[r + 4], 20, -405537848), h = s(h, p, d, v, e[r + 9], 5, 568446438), v = s(v, h, p, d, e[r + 14], 9, -1019803690), d = s(d, v, h, p, e[r + 3], 14, -187363961), p = s(p, d, v, h, e[r + 8], 20, 1163531501), h = s(h, p, d, v, e[r + 13], 5, -1444681467), v = s(v, h, p, d, e[r + 2], 9, -51403784), d = s(d, v, h, p, e[r + 7], 14, 1735328473), p = s(p, d, v, h, e[r + 12], 20, -1926607734), h = o(h, p, d, v, e[r + 5], 4, -378558), v = o(v, h, p, d, e[r + 8], 11, -2022574463), d = o(d, v, h, p, e[r + 11], 16, 1839030562), p = o(p, d, v, h, e[r + 14], 23, -35309556), h = o(h, p, d, v, e[r + 1], 4, -1530992060), v = o(v, h, p, d, e[r + 4], 11, 1272893353), d = o(d, v, h, p, e[r + 7], 16, -155497632), p = o(p, d, v, h, e[r + 10], 23, -1094730640), h = o(h, p, d, v, e[r + 13], 4, 681279174), v = o(v, h, p, d, e[r], 11, -358537222), d = o(d, v, h, p, e[r + 3], 16, -722521979), p = o(p, d, v, h, e[r + 6], 23, 76029189), h = o(h, p, d, v, e[r + 9], 4, -640364487), v = o(v, h, p, d, e[r + 12], 11, -421815835), d = o(d, v, h, p, e[r + 15], 16, 530742520), p = o(p, d, v, h, e[r + 2], 23, -995338651), h = u(h, p, d, v, e[r], 6, -198630844), v = u(v, h, p, d, e[r + 7], 10, 1126891415), d = u(d, v, h, p, e[r + 14], 15, -1416354905), p = u(p, d, v, h, e[r + 5], 21, -57434055), h = u(h, p, d, v, e[r + 12], 6, 1700485571), v = u(v, h, p, d, e[r + 3], 10, -1894986606), d = u(d, v, h, p, e[r + 10], 15, -1051523), p = u(p, d, v, h, e[r + 1], 21, -2054922799), h = u(h, p, d, v, e[r + 8], 6, 1873313359), v = u(v, h, p, d, e[r + 15], 10, -30611744), d = u(d, v, h, p, e[r + 6], 15, -1560198380), p = u(p, d, v, h, e[r + 13], 21, 1309151649), h = u(h, p, d, v, e[r + 4], 6, -145523070), v = u(v, h, p, d, e[r + 11], 10, -1120210379), d = u(d, v, h, p, e[r + 2], 15, 718787259), p = u(p, d, v, h, e[r + 9], 21, -343485551), h = t(h, a), p = t(p, f), d = t(d, l), v = t(v, c);
      return [h, p, d, v]
    }

    function f(e) {
      var t, n = "";
      for (t = 0; t < 32 * e.length; t += 8) n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
      return n
    }

    function l(e) {
      var t, n = [];
      for (n[(e.length >> 2) - 1] = void 0, t = 0; t < n.length; t += 1) n[t] = 0;
      for (t = 0; t < 8 * e.length; t += 8) n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
      return n
    }

    function c(e) {
      return f(a(l(e), 8 * e.length))
    }

    function h(e, t) {
      var n, r, i = l(e),
        s = [],
        o = [];
      for (s[15] = o[15] = void 0, i.length > 16 && (i = a(i, 8 * e.length)), n = 0; 16 > n; n += 1) s[n] = 909522486 ^ i[n], o[n] = 1549556828 ^ i[n];
      return r = a(s.concat(l(t)), 512 + 8 * t.length), f(a(o.concat(r), 640))
    }

    function p(e) {
      var t, n, r = "0123456789abcdef",
        i = "";
      for (n = 0; n < e.length; n += 1) t = e.charCodeAt(n), i += r.charAt(t >>> 4 & 15) + r.charAt(15 & t);
      return i
    }

    function d(e) {
      return unescape(encodeURIComponent(e))
    }

    function v(e) {
      return c(d(e))
    }

    function m(e) {
      return p(v(e))
    }

    function g(e, t) {
      return h(d(e), d(t))
    }

    function y(e, t) {
      return p(g(e, t))
    }

    function b(e, t, n) {
      return t ? n ? g(t, e) : y(t, e) : n ? v(e) : m(e)
    }
    "function" == typeof define && define.amd ? define("md5", [], function() {
      return b
    }) : e.md5 = b
  }(this), define("sf.b2c.mall.business.config", [], function() {
    var e = "index.html",
      t = "login.html",
      n = "register.html",
      r = "find.password.html",
      i = "www.sfht.com",
      s = "sfhaitao.xyz!",
      o = {
        _aid: 1,
        _sm: "md5"
      },
      u = {
        url: "http://dev.sfht.com/m.api",
        fileurl: "http://dev.sfht.com/file.api",
        detailurl: "http://dev.item.sfht.com"
      };
    return {
      setting: {
        login: t,
        index: e,
        find_password: r,
        register: n,
        none_append_word: s,
        default_header: o,
        md5_key: i,
        api: u
      }
    }
  }), define("sf.b2c.mall.api.security.type", [], function() {
    return {
      UserLogin: {
        name: "UserLogin",
        code: 8192
      },
      RegisteredDevice: {
        name: "RegisteredDevice",
        code: 256
      },
      None: {
        name: "None",
        code: 0
      }
    }
  }), define("sf.b2c.mall.framework.comm", ["jquery", "jquery.cookie", "can", "underscore", "md5", "sf.b2c.mall.business.config", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i, s, o) {
    var u = -360,
      a = -300,
      f = -180,
      l = -160,
      c = [u, a, f, l];
    return n.Construct.extend({
      api: {},
      buildRequestData: function() {
        if (this.api) {
          var e = {};
          r.extend(e, {
            _mt: this.api.METHOD_NAME
          }), r.extend(e, this.api.COMMON);
          var t;
          for (t in this.api.REQUIRED) e[t] = this.data[t];
          for (t in this.api.OPTIONAL) e[t] = this.data[t];
          return e
        }
      },
      init: function(e) {
        this.setData(e)
      },
      setData: function(e) {
        this.data = e
      },
      sendRequest: function(e) {
        var t = this.validate(e);
        if (t !== !0) return t;
        var n = this.buildRequestData();
        return this.request(n, e)
      },
      validate: function(e) {
        if (this.api) {
          if (!this.api.METHOD_NAME) return "缺少_mt";
          for (var t in this.api.REQUIRED)
            if (!r.has(this.data, t)) return new Error("缺少必填字段" + t)
        }
        if (this.api.SECURITY_TYPE === o.UserLogin.name && !this.checkUserLogin()) {
          if (!e) return new Error("该请求需要在登录后发起");
          this.goToLogin()
        }
        return !0
      },
      checkUserLogin: function() {
        var t = window.localStorage ? window.localStorage.getItem("csrfToken") : e.jStorage.get("csrfToken");
        return !!e.cookie("ct") && !!t
      },
      goToLogin: function() {
        var e = window.location.pathname;
        e !== s.setting.login && (window.location.href = s.setting.login + "?from" + e)
      },
      access: function(e, t) {
        if (e.stat.code === 0 && e.content[0] && e.stat.stateList[0].code === 0) return !0;
        if (!r.contains(c, e.stat.code) || !t) return !1;
        this.goToLogin()
      },
      encrypt: function(e, t) {
        var n = [];
        r.each(e, function(e, t) {
          n.push(t + "=" + e)
        }), n.sort();
        var s = n.join("");
        return s += t, i(s)
      },
      sign: function(e, t) {
        var i = {
          None: function(e, t) {
            return r.extend(e, {
              _sig: this.encrypt(e, s.setting.none_append_word)
            })
          },
          RegisteredDevice: function(e, t) {
            return r.extend(e, {
              _sig: this.encrypt(e, s.setting.none_append_word)
            })
          },
          UserLogin: function(e, t) {
            var i = window.localStorage ? window.localStorage.getItem("csrfToken") : n.route.attr("csrfToken");
            if (i) return r.extend(e, {
              _sig: this.encrypt(e, i)
            });
            this.goToLogin()
          }
        };
        if (r.isFunction(i[this.api.SECURITY_TYPE])) {
          r.each(e, function(t, n, i) {
            (r.isUndefined(t) || r.isNull(t)) && delete e[n]
          });
          var o = r.extend(e, s.setting.default_header),
            u = i[this.api.SECURITY_TYPE].call(this, o, t);
          return r.extend(o, u)
        }
        return e
      },
      request: function(e, t) {
        var r = n.Deferred(),
          i = this;
        return n.ajax({
          url: s.setting.api.url,
          type: "post",
          data: i.sign(e),
          crossDomain: !0,
          xhrFields: {
            withCredentials: !0
          }
        }).done(function(n) {
          n && n.stat && (i.serverTime = n.stat.systime), i.access(n, t) ? (i.afterRequest(e._mt, n.content[0]), r.resolve(n.content[0])) : n.stat.stateList.length == 0 ? r.reject(n.stat.code) : r.reject(n.stat.stateList[0].code)
        }).fail(function(e) {
          r.reject(e)
        }), r
      },
      getServerTime: function() {
        return this.serverTime
      },
      afterRequest: function(t, n) {
        var i = {
          "user.webLogin": function(t) {
            window.localStorage ? window.localStorage.setItem("csrfToken", t.csrfToken) : e.jStorage.set("csrfToken", t.csrfToken)
          }
        };
        r.isFunction(i[t]) && i[t].call(this, n)
      },
      ajax: function(e) {
        return n.ajax(e)
      }
    })
  }), define("sf.b2c.mall.api.b2cmall.getBanner", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "b2cmall.getBanner",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {},
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.b2cmall.getFastSaleInfoList", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "b2cmall.getFastSaleInfoList",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {},
        OPTIONAL: {
          pageIndex: "int",
          pageSize: "int"
        },
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.b2cmall.getItemInfo", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "b2cmall.getItemInfo",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          itemId: "long"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          9000210: "未知的item"
        }
      }
    })
  }), define("sf.b2c.mall.api.b2cmall.getProductHotData", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "b2cmall.getProductHotData",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          itemId: "long"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          9000210: "未知的item"
        }
      }
    })
  }), define("sf.b2c.mall.api.b2cmall.getProductHotDataList", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "b2cmall.getProductHotDataList",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          itemIds: "long"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.b2cmall.getSkuInfo", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "b2cmall.getSkuInfo",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          skuId: "long"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          9000200: "未知的sku"
        }
      }
    })
  }), define("sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "b2cmall.getTimeLimitedSaleInfoList",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          filter: "string"
        },
        OPTIONAL: {
          size: "int"
        },
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.order.cancelOrder", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "order.cancelOrder",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          orderId: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4000100: "order unkown error",
          4000800: "订单状态不能取消"
        }
      }
    })
  }), define("sf.b2c.mall.api.order.confirmReceive", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "order.confirmReceive",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          subOrderId: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4000100: "order unkown error",
          4000900: "子订单状态不符合确认操作"
        }
      }
    })
  }), define("sf.b2c.mall.api.order.getOrder", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "order.getOrder",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          orderId: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4000100: "order unkown error"
        }
      }
    })
  }), define("sf.b2c.mall.api.order.getOrderList", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "order.getOrderList",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          query: "json"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4000100: "order unkown error"
        }
      }
    })
  }), define("sf.b2c.mall.api.order.getSubOrder", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "order.getSubOrder",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          subOrderId: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4000100: "order unkown error"
        }
      }
    })
  }), define("sf.b2c.mall.api.order.requestPay", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "order.requestPay",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          orderId: "string",
          amount: "int"
        },
        OPTIONAL: {
          payType: "string"
        },
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.order.requestPayV2", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "order.requestPayV2",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          orderId: "string",
          amount: "int",
          payType: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4000100: "order unkown error",
          4001500: "请求支付系统失败",
          4001700: "满足查询条件的订单不存在",
          4002200: "子订单获取物流线路信息为空"
        }
      }
    })
  }), define("sf.b2c.mall.api.order.submitOrder", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "order.submitOrder",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          addressId: "json",
          items: "json"
        },
        OPTIONAL: {
          userMsg: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          4000100: "order unkown error",
          4000200: "订单地址不存在",
          4000300: "订单地址状态错误",
          4000400: "订单商品信息改变",
          4000500: "订单商品库存不足",
          4000600: "订单商品超过限额",
          4000700: "订单商品金额改变"
        }
      }
    })
  }), define("sf.b2c.mall.api.order.submitOrderForAllSys", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "order.submitOrderForAllSys",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          addressId: "json",
          items: "json",
          sysType: "string"
        },
        OPTIONAL: {
          userMsg: "string",
          sysInfo: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          4000100: "order unkown error",
          4000200: "订单地址不存在",
          4000400: "订单商品信息改变",
          4000500: "订单商品库存不足",
          4000600: "订单商品超过限额",
          4000700: "订单商品金额改变"
        }
      }
    })
  }), define("sf.b2c.mall.api.order.submitOrderV2", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "order.submitOrderV2",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          addressId: "json",
          items: "json"
        },
        OPTIONAL: {
          userMsg: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          4000100: "order unkown error",
          4000200: "订单地址不存在",
          4000400: "订单商品信息改变",
          4000500: "订单商品库存不足",
          4000600: "订单商品超过限额",
          4000700: "订单商品金额改变"
        }
      }
    })
  }), define("sf.b2c.mall.api.product.findRecommendProducts", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "product.findRecommendProducts",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          itemId: "long"
        },
        OPTIONAL: {
          size: "int"
        },
        VERIFY: {},
        ERROR_CODE: {
          5000400: "类目未发现"
        }
      }
    })
  }), define("sf.b2c.mall.api.product.findSaleBaseInfoList", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "product.findSaleBaseInfoList",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          sale_base_info_list: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.shopcart.add", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "shopcart.add",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          sku: "string",
          num: "long"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4100100: "购物车添加失败"
        }
      }
    })
  }), define("sf.b2c.mall.api.shopcart.bulkDeleteShopCart", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "shopcart.bulkDeleteShopCart",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          skulist: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4100400: "购物车清空失败"
        }
      }
    })
  }), define("sf.b2c.mall.api.shopcart.clearShopCart", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "shopcart.clearShopCart",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {},
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4100400: "购物车清空失败"
        }
      }
    })
  }), define("sf.b2c.mall.api.shopcart.getSkuAll", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "shopcart.getSkuAll",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {},
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4100500: "查询购物车spu列表失败"
        }
      }
    })
  }), define("sf.b2c.mall.api.shopcart.getSkuCount", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "shopcart.getSkuCount",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {},
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4100500: "查询购物车spu列表失败"
        }
      }
    })
  }), define("sf.b2c.mall.api.shopcart.remove", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "shopcart.remove",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          sku: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4100200: "购物车sku删除失败"
        }
      }
    })
  }), define("sf.b2c.mall.api.shopcart.updateSKUNum", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "shopcart.updateSKUNum",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          sku: "string",
          num: "long"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          4100300: "购物车更新数量失败"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.appLogin", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.appLogin",
        SECURITY_TYPE: i.RegisteredDevice.name,
        REQUIRED: {
          accountId: "string",
          type: "string",
          password: "string"
        },
        OPTIONAL: {
          vfCode: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000010: "未找到用户",
          1000030: "用户名or密码错误",
          1000070: "参数错误",
          1000100: "验证码错误",
          1000110: "账户尚未激活"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.changePassword", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.changePassword",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          oldPassword: "string",
          newPassword: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          1000010: "未找到用户",
          1000040: "原密码错误",
          1000060: "密码与原密码相同"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.checkLink", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.checkLink",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          linkContent: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          1000120: "链接已过期",
          1000130: "签名验证失败"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.checkSmsCode", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.checkSmsCode",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          mobile: "string",
          smsCode: "string",
          askType: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          1000230: "手机号错误，请输入正确的手机号",
          1000250: "手机验证码已过期"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.checkUserExist", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.checkUserExist",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          accountId: "string",
          type: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          1000070: "参数错误"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.checkVerifyCode", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.checkVerifyCode",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          vfcode: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.user.createRecAddress", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.createRecAddress",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          nationName: "string",
          provinceName: "string",
          cityName: "string",
          regionName: "string",
          detail: "string"
        },
        OPTIONAL: {
          zipCode: "string",
          recId: "long"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000070: "参数错误"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.createReceiverInfo", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.createReceiverInfo",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          recName: "string",
          type: "string",
          credtNum: "string",
          cellphone: "string"
        },
        OPTIONAL: {
          credtImgUrl1: "string",
          credtImgUrl2: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000070: "参数错误",
          1000200: "收货人身份信息已存在，选择即可",
          1000230: "手机号错误，请输入正确的手机号",
          1000280: "身份证号码错误"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.delRecAddress", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.delRecAddress",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          addrId: "long"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          1000070: "参数错误"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.deviceRegister", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.deviceRegister",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          deviceInfo: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.user.downSmsCode", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.downSmsCode",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          mobile: "string",
          askType: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          1000010: "未找到用户",
          1000020: "账户已注册",
          1000070: "参数错误",
          1000230: "手机号错误，请输入正确的手机号",
          1000270: "短信请求太过频繁",
          1000290: "短信请求太多"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.federatedLogin", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.federatedLogin",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          reqParas: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          1000130: "签名验证失败",
          1000210: "校验第三方accessToken失败",
          1000220: "不支持非门店账户下单or非门店下单"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.getIDCardUrlList", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.getIDCardUrlList",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {},
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.user.getInviteCodeList", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.getInviteCodeList",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {},
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.user.getRecAddressList", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.getRecAddressList",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {},
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.user.getUserInfo", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.getUserInfo",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {},
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.user.logout", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.logout",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {},
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.user.mailRegister", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.mailRegister",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          mailId: "string",
          passWord: "string",
          linkContent: "string"
        },
        OPTIONAL: {
          nick: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000020: "账户已注册",
          1000050: "邮箱地址错误",
          1000070: "参数错误",
          1000120: "链接已过期",
          1000130: "签名验证失败"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.mobileRegister", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.mobileRegister",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          mobile: "string",
          smsCode: "string",
          password: "string"
        },
        OPTIONAL: {
          nick: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000020: "账户已注册",
          1000230: "手机号错误，请输入正确的手机号",
          1000240: "手机验证码错误",
          1000250: "手机验证码已过期"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.needVfCode", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.needVfCode",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          accountId: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {}
      }
    })
  }), define("sf.b2c.mall.api.user.renewToken", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.renewToken",
        SECURITY_TYPE: i.RegisteredDevice.name,
        REQUIRED: {
          token: "string"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          1000070: "参数错误"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.resetPassword", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.resetPassword",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          accountId: "string",
          type: "string",
          newPassword: "string"
        },
        OPTIONAL: {
          linkContent: "string",
          smsCode: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000010: "未找到用户",
          1000070: "参数错误",
          1000120: "链接已过期",
          1000130: "签名验证失败",
          1000140: "密码修改间隔太短",
          1000230: "手机号错误，请输入正确的手机号",
          1000240: "手机验证码错误",
          1000250: "手机验证码已过期"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.sendActivateMail", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.sendActivateMail",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          mailId: "string"
        },
        OPTIONAL: {
          vfCode: "string",
          from: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000020: "账户已注册",
          1000050: "邮箱地址错误",
          1000070: "参数错误",
          1000100: "验证码错误",
          1000160: "邮件请求频繁"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.sendResetPwdLink", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.sendResetPwdLink",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          mailId: "string"
        },
        OPTIONAL: {
          vfCode: "string",
          from: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000010: "未找到用户",
          1000050: "邮箱地址错误",
          1000070: "参数错误",
          1000100: "验证码错误",
          1000110: "账户尚未激活",
          1000160: "邮件请求频繁"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.setDefaultAddr", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.setDefaultAddr",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          addrId: "long"
        },
        OPTIONAL: {},
        VERIFY: {},
        ERROR_CODE: {
          1000070: "参数错误"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.upateUserInfo", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.upateUserInfo",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {},
        OPTIONAL: {
          gender: "string",
          nick: "string",
          headImgUrl: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000070: "参数错误"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.updateRecAddress", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.updateRecAddress",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          addrId: "long"
        },
        OPTIONAL: {
          nationName: "string",
          provinceName: "string",
          cityName: "string",
          regionName: "string",
          detail: "string",
          zipCode: "string",
          recId: "long"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000070: "参数错误"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.updateReceiverInfo", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.updateReceiverInfo",
        SECURITY_TYPE: i.UserLogin.name,
        REQUIRED: {
          recId: "long"
        },
        OPTIONAL: {
          recName: "string",
          type: "string",
          credtNum: "string",
          cellphone: "string",
          credtImgUrl1: "string",
          credtImgUrl2: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000070: "参数错误",
          1000200: "收货人身份信息已存在，选择即可",
          1000230: "手机号错误，请输入正确的手机号",
          1000280: "身份证号码错误"
        }
      }
    })
  }), define("sf.b2c.mall.api.user.webLogin", ["jquery", "can", "underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.api.security.type"], function(e, t, n, r, i) {
    return r.extend({
      api: {
        METHOD_NAME: "user.webLogin",
        SECURITY_TYPE: i.None.name,
        REQUIRED: {
          accountId: "string",
          type: "string",
          password: "string"
        },
        OPTIONAL: {
          vfCode: "string"
        },
        VERIFY: {},
        ERROR_CODE: {
          1000010: "未找到用户",
          1000030: "用户名or密码错误",
          1000070: "参数错误",
          1000100: "验证码错误",
          1000110: "账户尚未激活"
        }
      }
    })
  }), define("sf.b2c.mall.framework.adapter", ["can", "underscore"], function(e, t) {
    return e.Map.extend({
      format: function() {
        throw new Error("使用前必须被复写")
      },
      empty: function() {
        var e = t.bind(function(e, t) {
          this.removeAttr(t)
        }, this);
        this.each(e)
      },
      replace: function(e) {
        this.empty(), this.attr(e)
      }
    })
  }), define("sf.b2c.mall.framework.multiple.comm", ["underscore", "sf.b2c.mall.framework.comm", "sf.b2c.mall.business.config", "sf.b2c.mall.api.security.type"], function(e, t, n, r) {
    var i = -360,
      s = -300,
      o = -180,
      u = -160,
      a = [i, s, o, u];
    return t.extend({
      init: function(e) {
        this.buildApi(e)
      },
      buildApi: function(t) {
        var n = e.pluck(t, "api"),
          i = e.pluck(n, "METHOD_NAME");
        this.api.METHOD_NAME = i.join(",");
        var s = {
          code: -1,
          name: null
        };
        e.each(n, function(e) {
          var t = r[e.SECURITY_TYPE];
          t.code > s.code && (s = t)
        }), this.api.SECURITY_TYPE = s.name, this.api.REQUIRED = e.pluck(n, "REQUIRED"), this.api.OPTIONAL = e.pluck(n, "OPTIONAL")
      },
      buildRequestData: function() {
        if (this.api) {
          var t = {};
          e.extend(t, {
            _mt: this.api.METHOD_NAME
          }), e.extend(t, this.api.COMMON);
          var n = this,
            r;
          return e.each(this.api.REQUIRED, function(e, i) {
            for (r in n.api.REQUIRED[i]) t[i + "_" + r] = n.data[i][r]
          }), e.each(this.api.OPTIONAL, function(e, i) {
            for (r in n.api.OPTIONAL[i]) t[i + "_" + r] = n.data[i][r]
          }), t
        }
      },
      access: function(t, n) {
        if (e.isArray(t.content)) {
          var r = this,
            i = !0;
          return e.each(t.content, function(e, s) {
            i = i && r._access(t, s, n)
          }), i
        }
        return this._access(t, 0, n)
      },
      _access: function(t, n, r) {
        if (t.stat.code === 0 && t.content[n] && t.stat.stateList[n].code === 0) return !0;
        if (!e.contains(a, t.stat.code) || !r) return !1;
        this.goToLogin()
      },
      request: function(e, t) {
        var r = can.Deferred(),
          i = this;
        return can.ajax({
          url: n.setting.api.url,
          type: "post",
          data: i.sign(e),
          crossDomain: !0,
          xhrFields: {
            withCredentials: !0
          }
        }).done(function(n) {
          i.access(n, t) ? (i.afterRequest(e._mt, n.content), r.resolve(n.content)) : n.stat.stateList.length == 0 ? r.reject(n.stat.code) : r.reject(n.stat)
        }).fail(function(e) {
          r.reject(e)
        }), r
      }
    })
  }), define("sf.b2c.mall.framework.view.controller", ["can", "underscore"], function(e, t) {
    return e.Control.extend({
      draw: function(t, n, r) {
        this.element.html(e.view(t, n, r || {}))
      },
      render: function() {
        throw "使用前必须被复写"
      },
      supplement: function() {
        throw "使用前必须被复写"
      }
    })
  }), define("sf.b2c.mall.util.utils", ["jquery", "can", "underscore", "md5", "sf.b2c.mall.business.config"], function(e, t, n, r, i) {
    return {
      md5: function(e) {
        return r(e + i.setting.md5_key)
      }
    }
  });