 /* user-myjd-2015 plupload.full.min.js Date:2015-03-26 14:16:48 */ ! function() {
   var g, j, a = 0,
     b = [],
     c = {},
     d = {},
     e = {
       "<": "lt",
       ">": "gt",
       "&": "amp",
       '"': "quot",
       "'": "#39"
     },
     f = /[<>&\"\']/g,
     h = window.setTimeout,
     i = {};

   function k() {
     this.returnValue = !1
   }

   function l() {
     this.cancelBubble = !0
   }! function(a) {
     var c, e, f, b = a.split(/,/);
     for (c = 0; c < b.length; c += 2)
       for (f = b[c + 1].split(/ /), e = 0; e < f.length; e++)
         d[f[e]] = b[c]
   }("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,audio/mp4,m4a,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/vnd.rn-realvideo,rv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe");
   var m = {
     VERSION: "1.5.4",
     STOPPED: 1,
     STARTED: 2,
     QUEUED: 1,
     UPLOADING: 2,
     FAILED: 4,
     DONE: 5,
     GENERIC_ERROR: -100,
     HTTP_ERROR: -200,
     IO_ERROR: -300,
     SECURITY_ERROR: -400,
     INIT_ERROR: -500,
     FILE_SIZE_ERROR: -600,
     FILE_EXTENSION_ERROR: -601,
     IMAGE_FORMAT_ERROR: -700,
     IMAGE_MEMORY_ERROR: -701,
     IMAGE_DIMENSIONS_ERROR: -702,
     mimeTypes: d,
     ua: function() {
       var d, e, f, a = navigator,
         b = a.userAgent,
         c = a.vendor;
       return d = /WebKit/.test(b), f = d && -1 !== c.indexOf("Apple"), e = window.opera && window.opera.buildNumber, {
         windows: -1 !== navigator.platform.indexOf("Win"),
         ie: !d && !e && /MSIE/gi.test(b) && /Explorer/gi.test(a.appName),
         webkit: d,
         gecko: !d && /Gecko/.test(b),
         safari: f,
         opera: !!e
       }
     }(),
     typeOf: function(a) {
       return {}.toString.call(a).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
     },
     extend: function(a) {
       return m.each(arguments, function(b, c) {
         c > 0 && m.each(b, function(b, c) {
           a[c] = b
         })
       }), a
     },
     cleanName: function(a) {
       var b, c;
       for (c = [/[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C", /\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e", /[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N", /\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o", /[\331-\334]/g, "U", /[\371-\374]/g, "u"], b = 0; b < c.length; b += 2)
         a = a.replace(c[b], c[b + 1]);
       return a = a.replace(/\s+/g, "_"), a = a.replace(/[^a-z0-9_\-\.]+/gi, "")
     },
     addRuntime: function(a, c) {
       return c.name = a, b[a] = c, b.push(c), c
     },
     guid: function() {
       var c, b = (new Date).getTime().toString(32);
       for (c = 0; 5 > c; c++)
         b += Math.floor(65535 * Math.random()).toString(32);
       return (m.guidPrefix || "p") + b + (a++).toString(32)
     },
     buildUrl: function(a, b) {
       var c = "";
       return m.each(b, function(a, b) {
         c += (c ? "&" : "") + encodeURIComponent(b) + "=" + encodeURIComponent(a)
       }), c && (a += (a.indexOf("?") > 0 ? "&" : "?") + c), a
     },
     each: function(a, b) {
       var c, d, e;
       if (a)
         if (c = a.length, c === g) {
           for (d in a)
             if (a.hasOwnProperty(d) && b(a[d], d) === !1)
               return
         } else
           for (e = 0; c > e; e++)
             if (b(a[e], e) === !1)
               return
     },
     formatSize: function(a) {
       return a === g || /\D/.test(a) ? m.translate("N/A") : a > 1073741824 ? Math.round(a / 1073741824, 1) + " GB" : a > 1048576 ? Math.round(a / 1048576, 1) + " MB" : a > 1024 ? Math.round(a / 1024, 1) + " KB" : a + " b"
     },
     getPos: function(a, b) {
       var e, g, h, c = 0,
         d = 0,
         f = document;
       a = a, b = b || f.body;

       function i(a) {
         var b, c, d = 0,
           e = 0;
         return a && (c = a.getBoundingClientRect(), b = "CSS1Compat" === f.compatMode ? f.documentElement : f.body, d = c.left + b.scrollLeft, e = c.top + b.scrollTop), {
           x: d,
           y: e
         }
       }
       if (a && a.getBoundingClientRect && navigator.userAgent.indexOf("MSIE") > 0 && f.documentMode < 8)
         return g = i(a), h = i(b), {
           x: g.x - h.x,
           y: g.y - h.y
         };
       for (e = a; e && e != b && e.nodeType;)
         c += e.offsetLeft || 0, d += e.offsetTop || 0, e = e.offsetParent;
       for (e = a.parentNode; e && e != b && e.nodeType;)
         c -= e.scrollLeft || 0, d -= e.scrollTop || 0, e = e.parentNode;
       return {
         x: c,
         y: d
       }
     },
     getSize: function(a) {
       return {
         w: a.offsetWidth || a.clientWidth,
         h: a.offsetHeight || a.clientHeight
       }
     },
     parseSize: function(a) {
       var b;
       return "string" == typeof a && (a = /^([0-9]+)([mgk]?)$/.exec(a.toLowerCase().replace(/[^0-9mkg]/g, "")), b = a[2], a = +a[1], "g" == b && (a *= 1073741824), "m" == b && (a *= 1048576), "k" == b && (a *= 1024)), a
     },
     xmlEncode: function(a) {
       return a ? ("" + a).replace(f, function(a) {
         return e[a] ? "&" + e[a] + ";" : a
       }) : a
     },
     toArray: function(a) {
       var b, c = [];
       for (b = 0; b < a.length; b++)
         c[b] = a[b];
       return c
     },
     inArray: function(a, b) {
       if (b) {
         if (Array.prototype.indexOf)
           return Array.prototype.indexOf.call(b, a);
         for (var c = 0, d = b.length; d > c; c++)
           if (b[c] === a)
             return c
       }
       return -1
     },
     addI18n: function(a) {
       return m.extend(c, a)
     },
     translate: function(a) {
       return c[a] || a
     },
     isEmptyObj: function(a) {
       if (a === g)
         return !0;
       for (var b in a)
         return !1;
       return !0
     },
     hasClass: function(a, b) {
       var c;
       return "" == a.className ? !1 : (c = new RegExp("(^|\\s+)" + b + "(\\s+|$)"), c.test(a.className))
     },
     addClass: function(a, b) {
       m.hasClass(a, b) || (a.className = "" == a.className ? b : a.className.replace(/\s+$/, "") + " " + b)
     },
     removeClass: function(a, b) {
       var c = new RegExp("(^|\\s+)" + b + "(\\s+|$)");
       a.className = a.className.replace(c, function(a, b, c) {
         return " " === b && " " === c ? " " : ""
       })
     },
     getStyle: function(a, b) {
       return a.currentStyle ? a.currentStyle[b] : window.getComputedStyle ? window.getComputedStyle(a, null)[b] : void 0
     },
     addEvent: function(a, b, c) {
       var d, e, h;
       h = arguments[3], b = b.toLowerCase(), j === g && (j = "Plupload_" + m.guid()), a.addEventListener ? (d = c, a.addEventListener(b, d, !1)) : a.attachEvent && (d = function() {
         var a = window.event;
         a.target || (a.target = a.srcElement), a.preventDefault = k, a.stopPropagation = l, c(a)
       }, a.attachEvent("on" + b, d)), a[j] === g && (a[j] = m.guid()), i.hasOwnProperty(a[j]) || (i[a[j]] = {}), e = i[a[j]], e.hasOwnProperty(b) || (e[b] = []), e[b].push({
         func: d,
         orig: c,
         key: h
       })
     },
     removeEvent: function(a, b) {
       var c, d, e;
       if ("function" == typeof arguments[2] ? d = arguments[2] : e = arguments[2], b = b.toLowerCase(), a[j] && i[a[j]] && i[a[j]][b]) {
         c = i[a[j]][b];
         for (var f = c.length - 1; f >= 0 && (c[f].key !== e && c[f].orig !== d || (a.removeEventListener ? a.removeEventListener(b, c[f].func, !1) : a.detachEvent && a.detachEvent("on" + b, c[f].func), c[f].orig = null, c[f].func = null, c.splice(f, 1), d === g)); f--)
         ;
         if (c.length || delete i[a[j]][b], m.isEmptyObj(i[a[j]])) {
           delete i[a[j]];
           try {
             delete a[j]
           } catch (h) {
             a[j] = g
           }
         }
       }
     },
     removeAllEvents: function(a) {
       var b = arguments[1];
       a[j] !== g && a[j] && m.each(i[a[j]], function(c, d) {
         m.removeEvent(a, d, b)
       })
     }
   };
   m.Uploader = function(a) {
     var d, f, c = {},
       e = [],
       i = !1;
     d = new m.QueueProgress, a = m.extend({
       chunk_size: 0,
       multipart: !0,
       multi_selection: !0,
       file_data_name: "file",
       filters: []
     }, a);

     function j() {
       var a, c, b = 0;
       if (this.state == m.STARTED) {
         for (c = 0; c < e.length; c++)
           a || e[c].status != m.QUEUED ? b++ : (a = e[c], a.status = m.UPLOADING, this.trigger("BeforeUpload", a) && this.trigger("UploadFile", a));
         b == e.length && (this.stop(), this.trigger("UploadComplete", e))
       }
     }

     function k() {
       var a, b;
       for (d.reset(), a = 0; a < e.length; a++)
         b = e[a], b.size !== g ? (d.size += b.size, d.loaded += b.loaded) : d.size = g, b.status == m.DONE ? d.uploaded++ : b.status == m.FAILED ? d.failed++ : d.queued++;
       d.size === g ? d.percent = e.length > 0 ? Math.ceil(d.uploaded / e.length * 100) : 0 : (d.bytesPerSec = Math.ceil(d.loaded / ((+new Date - f || 1) / 1e3)), d.percent = d.size > 0 ? Math.ceil(d.loaded / d.size * 100) : 0)
     }
     m.extend(this, {
       state: m.STOPPED,
       runtime: "",
       features: {},
       files: e,
       settings: a,
       total: d,
       id: m.guid(),
       init: function() {
         var d, i, o, c = this,
           n = 0;
         if ("function" == typeof a.preinit ? a.preinit(c) : m.each(a.preinit, function(a, b) {
             c.bind(b, a)
           }), a.page_url = a.page_url || document.location.pathname.replace(/\/[^\/]+$/g, "/"), /^(\w+:\/\/|\/)/.test(a.url) || (a.url = a.page_url + a.url), a.chunk_size = m.parseSize(a.chunk_size), a.max_file_size = m.parseSize(a.max_file_size), c.bind("FilesAdded", function(b, d) {
             var f, i, k, j = 0,
               l = a.filters;
             for (l && l.length && (k = [], m.each(l, function(a) {
                 m.each(a.extensions.split(/,/), function(a) {
                   k.push(/^\s*\*\s*$/.test(a) ? "\\.*" : "\\." + a.replace(new RegExp("[" + "/^$.*+?|()[]{}\\".replace(/./g, "\\$&") + "]", "g"), "\\$&"))
                 })
               }), k = new RegExp(k.join("|") + "$", "i")), f = 0; f < d.length; f++)
               i = d[f], i.loaded = 0, i.percent = 0, i.status = m.QUEUED, !k || k.test(i.name) ? i.size !== g && i.size > a.max_file_size ? b.trigger("Error", {
                 code: m.FILE_SIZE_ERROR,
                 message: m.translate("File size error."),
                 file: i
               }) : (e.push(i), j++) : b.trigger("Error", {
                 code: m.FILE_EXTENSION_ERROR,
                 message: m.translate("File extension error."),
                 file: i
               });
             return j ? void h(function() {
               c.trigger("QueueChanged"), c.refresh()
             }, 1) : !1
           }), a.unique_names && c.bind("UploadFile", function(a, b) {
             var c = b.name.match(/\.([^.]+)$/),
               d = "tmp";
             c && (d = c[1]), b.target_name = b.id + "." + d
           }), c.bind("UploadProgress", function(a, b) {
             b.percent = b.size > 0 ? Math.ceil(b.loaded / b.size * 100) : 100, k()
           }), c.bind("StateChanged", function(a) {
             if (a.state == m.STARTED)
               f = +new Date;
             else if (a.state == m.STOPPED)
               for (d = a.files.length - 1; d >= 0; d--)
                 a.files[d].status == m.UPLOADING && (a.files[d].status = m.QUEUED, k())
           }), c.bind("QueueChanged", k), c.bind("Error", function(a, b) {
             b.file && (b.file.status = m.FAILED, k(), a.state == m.STARTED && h(function() {
               j.call(c)
             }, 1))
           }), c.bind("FileUploaded", function(a, b) {
             b.status = m.DONE, b.loaded = b.size, a.trigger("UploadProgress", b), h(function() {
               j.call(c)
             }, 1)
           }), a.runtimes)
           for (i = [], o = a.runtimes.split(/\s?,\s?/), d = 0; d < o.length; d++)
             b[o[d]] && i.push(b[o[d]]);
         else
           i = b;

         function p() {
           var b, d, e, a = i[n++];
           if (a) {
             if (b = a.getFeatures(), d = c.settings.required_features)
               for (d = d.split(","), e = 0; e < d.length; e++)
                 if (!b[d[e]])
                   return void p();
             a.init(c, function(d) {
               d && d.success ? (c.features = b, c.runtime = a.name, c.trigger("Init", {
                 runtime: a.name
               }), c.trigger("PostInit"), c.refresh()) : p()
             })
           } else
             c.trigger("Error", {
               code: m.INIT_ERROR,
               message: m.translate("Init error.")
             })
         }
         p(), "function" == typeof a.init ? a.init(c) : m.each(a.init, function(a, b) {
           c.bind(b, a)
         })
       },
       refresh: function() {
         this.trigger("Refresh")
       },
       start: function() {
         e.length && this.state != m.STARTED && (this.state = m.STARTED, this.trigger("StateChanged"), j.call(this))
       },
       stop: function() {
         this.state != m.STOPPED && (this.state = m.STOPPED, this.trigger("CancelUpload"), this.trigger("StateChanged"))
       },
       disableBrowse: function() {
         i = arguments[0] !== g ? arguments[0] : !0, this.trigger("DisableBrowse", i)
       },
       getFile: function(a) {
         var b;
         for (b = e.length - 1; b >= 0; b--)
           if (e[b].id === a)
             return e[b]
       },
       removeFile: function(a) {
         var b;
         for (b = e.length - 1; b >= 0; b--)
           if (e[b].id === a.id)
             return this.splice(b, 1)[0]
       },
       splice: function(a, b) {
         var c;
         return c = e.splice(a === g ? 0 : a, b === g ? e.length : b), this.trigger("FilesRemoved", c), this.trigger("QueueChanged"), c
       },
       trigger: function(a) {
         var d, e, b = c[a.toLowerCase()];
         if (b)
           for (e = Array.prototype.slice.call(arguments), e[0] = this, d = 0; d < b.length; d++)
             if (b[d].func.apply(b[d].scope, e) === !1)
               return !1;
         return !0
       },
       hasEventListener: function(a) {
         return !!c[a.toLowerCase()]
       },
       bind: function(a, b, d) {
         var e;
         a = a.toLowerCase(), e = c[a] || [], e.push({
           func: b,
           scope: d || this
         }), c[a] = e
       },
       unbind: function(a) {
         a = a.toLowerCase();
         var d, b = c[a],
           e = arguments[1];
         if (b) {
           if (e !== g) {
             for (d = b.length - 1; d >= 0; d--)
               if (b[d].func === e) {
                 b.splice(d, 1);
                 break
               }
           } else
             b = [];
           b.length || delete c[a]
         }
       },
       unbindAll: function() {
         var a = this;
         m.each(c, function(b, c) {
           a.unbind(c)
         })
       },
       destroy: function() {
         this.stop(), this.trigger("Destroy"), this.unbindAll()
       }
     })
   }, m.File = function(a, b, c) {
     var d = this;
     d.id = a, d.name = b, d.size = c, d.loaded = 0, d.percent = 0, d.status = 0
   }, m.Runtime = function() {
     this.getFeatures = function() {}, this.init = function() {}
   }, m.QueueProgress = function() {
     var a = this;
     a.size = 0, a.loaded = 0, a.uploaded = 0, a.failed = 0, a.queued = 0, a.percent = 0, a.bytesPerSec = 0, a.reset = function() {
       a.size = a.loaded = a.uploaded = a.failed = a.queued = a.percent = a.bytesPerSec = 0
     }
   }, m.runtimes = {}, window.plupload = m
 }(),
 function() {
   if (!window.google || !google.gears) {
     var a = null;
     if ("undefined" != typeof GearsFactory)
       a = new GearsFactory;
     else
       try {
         a = new ActiveXObject("Gears.Factory"), -1 != a.getBuildInfo().indexOf("ie_mobile") && a.privateSetGlobalObject(this)
       } catch (b) {
         "undefined" != typeof navigator.mimeTypes && navigator.mimeTypes["application/x-googlegears"] && (a = document.createElement("object"), a.style.display = "none", a.width = 0, a.height = 0, a.type = "application/x-googlegears", document.documentElement.appendChild(a))
       }
     a && (window.google || (window.google = {}), google.gears || (google.gears = {
       factory: a
     }))
   }
 }(),
 function(a, b, c) {
   var e = {};

   function f(a, b, c) {
     var e, g;
     e = google.gears.factory.create("beta.canvas");
     try {
       if (e.decode(a), b.width || (b.width = e.width), b.height || (b.height = e.height), g = Math.min(width / e.width, height / e.height), 1 > g || 1 === g && "image/jpeg" === c)
         return e.resize(Math.round(e.width * g), Math.round(e.height * g)), b.quality ? e.encode(c, {
           quality: b.quality / 100
         }) : e.encode(c)
     } catch (h) {}
     return a
   }
   c.runtimes.Gears = c.addRuntime("gears", {
     getFeatures: function() {
       return {
         dragdrop: !0,
         jpgresize: !0,
         pngresize: !0,
         chunks: !0,
         progress: !0,
         multipart: !0,
         multi_selection: !0
       }
     },
     init: function(d, g) {
       var h, i, j = !1;
       if (!a.google || !google.gears)
         return g({
           success: !1
         });
       try {
         h = google.gears.factory.create("beta.desktop")
       } catch (k) {
         return g({
           success: !1
         })
       }

       function l(a) {
         var b, f, h, g = [];
         for (f = 0; f < a.length; f++)
           b = a[f], h = c.guid(), e[h] = b.blob, g.push(new c.File(h, b.name, b.blob.length));
         d.trigger("FilesAdded", g)
       }
       d.bind("PostInit", function() {
         var a = d.settings,
           e = b.getElementById(a.drop_element);
         e && (c.addEvent(e, "dragover", function(a) {
           h.setDropEffect(a, "copy"), a.preventDefault()
         }, d.id), c.addEvent(e, "drop", function(a) {
           var b = h.getDragData(a, "application/x-gears-files");
           b && l(b.files), a.preventDefault()
         }, d.id), e = 0);

          c.addEvent(b.getElementById(a.browse_button), "click", function(b) {
           var d, e, f, c = [];
           if (b.preventDefault(), !j) {
             a: for (d = 0; d < a.filters.length; d++)
               for (f = a.filters[d].extensions.split(","), e = 0; e < f.length; e++) {
                 if ("*" === f[e]) {
                   c = [];
                   break a
                 }
                 c.push("." + f[e])
               }
             h.openFiles(l, {
               singleFile: !a.multi_selection,
               filter: c
             })
           }
         }, d.id)
       }), d.bind("CancelUpload", function() {
         i.abort && i.abort()
       }), d.bind("UploadFile", function(a, b) {
         var g, h, l, d = 0,
           j = 0,
           k = a.settings.resize;
         k && /\.(png|jpg|jpeg)$/i.test(b.name) && (e[b.id] = f(e[b.id], k, /\.png$/i.test(b.name) ? "image/png" : "image/jpeg")), b.size = e[b.id].length, h = a.settings.chunk_size, l = h > 0, g = Math.ceil(b.size / h), l || (h = b.size, g = 1);

         function m() {
           var f, k = a.settings.multipart,
             n = 0,
             o = {
               name: b.target_name || b.name
             },
             p = a.settings.url;

           function q(d) {
             var e, j, l, f = "----pluploadboundary" + c.guid(),
               g = "--",
               h = "\r\n";
             k && (i.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + f), e = google.gears.factory.create("beta.blobbuilder"), c.each(c.extend(o, a.settings.multipart_params), function(a, b) {
               e.append(g + f + h + 'Content-Disposition: form-data; name="' + b + '"' + h + h), e.append(a + h)
             }), l = c.mimeTypes[b.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream", e.append(g + f + h + 'Content-Disposition: form-data; name="' + a.settings.file_data_name + '"; filename="' + b.name + '"' + h + "Content-Type: " + l + h + h), e.append(d), e.append(h + g + f + g + h), j = e.getAsBlob(), n = j.length - d.length, d = j), i.send(d)
           }
           b.status != c.DONE && b.status != c.FAILED && a.state != c.STOPPED && (l && (o.chunk = d, o.chunks = g), f = Math.min(h, b.size - d * h), k || (p = c.buildUrl(a.settings.url, o)), i = google.gears.factory.create("beta.httprequest"), i.open("POST", p), k || (i.setRequestHeader("Content-Disposition", 'attachment; filename="' + b.name + '"'), i.setRequestHeader("Content-Type", "application/octet-stream")), c.each(a.settings.headers, function(a, b) {
             i.setRequestHeader(b, a)
           }), i.upload.onprogress = function(c) {
             b.loaded = j + c.loaded - n, a.trigger("UploadProgress", b)
           }, i.onreadystatechange = function() {
             var e;
             if (4 == i.readyState && a.state !== c.STOPPED)
               if (200 == i.status) {
                 if (e = {
                     chunk: d,
                     chunks: g,
                     response: i.responseText,
                     status: i.status
                   }, a.trigger("ChunkUploaded", b, e), e.cancelled)
                   return void(b.status = c.FAILED);
                 j += f, ++d >= g ? (b.status = c.DONE, a.trigger("FileUploaded", b, {
                   response: i.responseText,
                   status: i.status
                 })) : m()
               } else
                 a.trigger("Error", {
                   code: c.HTTP_ERROR,
                   message: c.translate("HTTP Error."),
                   file: b,
                   chunk: d,
                   chunks: g,
                   status: i.status
                 })
           }, g > d && q(e[b.id].slice(d * h, f)))
         }
         m()
       }), d.bind("DisableBrowse", function(a, b) {
         j = b
       }), d.bind("Destroy", function(a) {
         var d, e, f = {
           browseButton: a.settings.browse_button,
           dropElm: a.settings.drop_element
         };
         for (d in f)
           e = b.getElementById(f[d]), e && c.removeAllEvents(e, a.id)
       }), g({
         success: !0
       })
     }
   })
 }(window, document, plupload),
 function(a, b, c, d) {
   var e = {},
     f = {};

   function g(a) {
     var b, e, f, h, c = typeof a;
     if (a === d || null === a)
       return "null";
     if ("string" === c)
       return b = "\bb t\nn\ff\rr\"\"''\\\\", '"' + a.replace(/([\u0080-\uFFFF\x00-\x1f\"])/g, function(a, c) {
         var d = b.indexOf(c);
         return d + 1 ? "\\" + b.charAt(d + 1) : (a = c.charCodeAt().toString(16), "\\u" + "0000".substring(a.length) + a)
       }) + '"';
     if ("object" == c) {
       if (e = a.length !== d, b = "", e) {
         for (f = 0; f < a.length; f++)
           b && (b += ","), b += g(a[f]);
         b = "[" + b + "]"
       } else {
         for (h in a)
           a.hasOwnProperty(h) && (b && (b += ","), b += g(h) + ":" + g(a[h]));
         b = "{" + b + "}"
       }
       return b
     }
     return "" + a
   }

   function h(a) {
     var e, f, g, h, i, b = !1,
       d = null,
       j = 0;
     try {
       try {
         d = new ActiveXObject("AgControl.AgControl"), d.IsVersionSupported(a) && (b = !0), d = null
       } catch (k) {
         var l = navigator.plugins["Silverlight Plug-In"];
         if (l) {
           for (e = l.description, "1.0.30226.2" === e && (e = "2.0.30226.2"), f = e.split("."); f.length > 3;)
             f.pop();
           for (; f.length < 4;)
             f.push(0);
           for (g = a.split("."); g.length > 4;)
             g.pop();
           do
             h = parseInt(g[j], 10), i = parseInt(f[j], 10), j++;
           while (j < g.length && h === i);
           i >= h && !isNaN(h) && (b = !0)
         }
       }
     } catch (m) {
       b = !1
     }
     return b
   }
   c.silverlight = {
     trigger: function(a, b) {
       var g, d = e[a];
       d && (g = c.toArray(arguments).slice(1), g[0] = "Silverlight:" + b, setTimeout(function() {
         d.trigger.apply(d, g)
       }, 0))
     }
   }, c.runtimes.Silverlight = c.addRuntime("silverlight", {
     getFeatures: function() {
       return {
         jpgresize: !0,
         pngresize: !0,
         chunks: !0,
         progress: !0,
         multipart: !0,
         multi_selection: !0
       }
     },
     init: function(d, i) {
       var j, m, k = "",
         l = d.settings.filters,
         n = b.body;
       if (!h("2.0.31005.0") || a.opera && a.opera.buildNumber)
         return void i({
           success: !1
         });
       for (f[d.id] = !1, e[d.id] = d, j = b.createElement("div"), j.id = d.id + "_silverlight_container", c.extend(j.style, {
           position: "absolute",
           top: "0px",
           background: d.settings.shim_bgcolor || "transparent",
           zIndex: 99999,
           width: "100px",
           height: "100px",
           overflow: "hidden",
           opacity: d.settings.shim_bgcolor || b.documentMode > 8 ? "" : .01
         }), j.className = "plupload silverlight", d.settings.container && (n = b.getElementById(d.settings.container), "static" === c.getStyle(n, "position") && (n.style.position = "relative")), n.appendChild(j), m = 0; m < l.length; m++)
         k += ("" != k ? "|" : "") + l[m].title + " | *." + l[m].extensions.replace(/,/g, ";*.");
       j.innerHTML = '<object id="' + d.id + '_silverlight" data="data:application/x-silverlight," type="application/x-silverlight-2" style="outline:none;" width="1024" height="1024"><param name="source" value="' + d.settings.silverlight_xap_url + '"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="id=' + d.id + ",filter=" + k + ",multiselect=" + d.settings.multi_selection + '"/></object>';

       function o() {
         return b.getElementById(d.id + "_silverlight").content.Upload
       }
       d.bind("Silverlight:Init", function() {
         var a, h = {};
         f[d.id] || (f[d.id] = !0, d.bind("Silverlight:StartSelectFiles", function() {
           a = []
         }), d.bind("Silverlight:SelectFile", function(b, d, e, f) {
           var g;
           g = c.guid(), h[g] = d, h[d] = g, a.push(new c.File(g, e, f))
         }), d.bind("Silverlight:SelectSuccessful", function() {
           a.length && d.trigger("FilesAdded", a)
         }), d.bind("Silverlight:UploadChunkError", function(a, b, e, f, g) {
           d.trigger("Error", {
             code: c.IO_ERROR,
             message: "IO Error.",
             details: g,
             file: a.getFile(h[b])
           })
         }), d.bind("Silverlight:UploadFileProgress", function(a, b, d, e) {
           var f = a.getFile(h[b]);
           f.status != c.FAILED && (f.size = e, f.loaded = d, a.trigger("UploadProgress", f))
         }), d.bind("Refresh", function(a) {
           var d, e, f;
           d = b.getElementById(a.settings.browse_button), d && (e = c.getPos(d, b.getElementById(a.settings.container)), f = c.getSize(d), c.extend(b.getElementById(a.id + "_silverlight_container").style, {
             top: e.y + "px",
             left: e.x + "px",
             width: f.w + "px",
             height: f.h + "px"
           }))
         }), d.bind("Silverlight:UploadChunkSuccessful", function(a, b, d, e, f) {
           var g, i = a.getFile(h[b]);
           g = {
             chunk: d,
             chunks: e,
             response: f
           }, a.trigger("ChunkUploaded", i, g), i.status != c.FAILED && a.state !== c.STOPPED && o().UploadNextChunk(), d == e - 1 && (i.status = c.DONE, a.trigger("FileUploaded", i, {
             response: f
           }))
         }), d.bind("Silverlight:UploadSuccessful", function(a, b, d) {
           var e = a.getFile(h[b]);
           e.status = c.DONE, a.trigger("FileUploaded", e, {
             response: d
           })
         }), d.bind("FilesRemoved", function(a, b) {
           var c;
           for (c = 0; c < b.length; c++)
             o().RemoveFile(h[b[c].id])
         }), d.bind("UploadFile", function(a, b) {
           var d = a.settings,
             e = d.resize || {};
           o().UploadFile(h[b.id], a.settings.url, g({
             name: b.target_name || b.name,
             mime: c.mimeTypes[b.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream",
             chunk_size: d.chunk_size,
             image_width: e.width,
             image_height: e.height,
             image_quality: e.quality || 90,
             multipart: !!d.multipart,
             multipart_params: d.multipart_params || {},
             file_data_name: d.file_data_name,
             headers: d.headers
           }))
         }), d.bind("CancelUpload", function() {
           o().CancelUpload()
         }), d.bind("Silverlight:MouseEnter", function(a) {
           var e, f;
           e = b.getElementById(d.settings.browse_button), f = a.settings.browse_button_hover, e && f && c.addClass(e, f)
         }), d.bind("Silverlight:MouseLeave", function(a) {
           var e, f;
           e = b.getElementById(d.settings.browse_button), f = a.settings.browse_button_hover, e && f && c.removeClass(e, f)
         }), d.bind("Silverlight:MouseLeftButtonDown", function(a) {
           var e, f;
           e = b.getElementById(d.settings.browse_button), f = a.settings.browse_button_active, e && f && (c.addClass(e, f), c.addEvent(b.body, "mouseup", function() {
             c.removeClass(e, f)
           }))
         }), d.bind("Sliverlight:StartSelectFiles", function(a) {
           var e, f;
           e = b.getElementById(d.settings.browse_button), f = a.settings.browse_button_active, e && f && c.removeClass(e, f)
         }), d.bind("DisableBrowse", function(a, b) {
           o().DisableBrowse(b)
         }), d.bind("Destroy", function(a) {
           var d;
           c.removeAllEvents(b.body, a.id), delete f[a.id], delete e[a.id], d = b.getElementById(a.id + "_silverlight_container"), d && n.removeChild(d)
         }), i({
           success: !0
         }))
       })
     }
   })
 }(window, document, plupload),
 function(a, b, c) {
   var e = {},
     f = {};

   function g() {
     var a;
     try {
       a = navigator.plugins["Shockwave Flash"], a = a.description
     } catch (b) {
       try {
         a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")
       } catch (c) {
         a = "0.0"
       }
     }
     return a = a.match(/\d+/g), parseFloat(a[0] + "." + a[1])
   }
   c.flash = {
     trigger: function(a, b, c) {
       setTimeout(function() {
         var d = e[a];
         d && d.trigger("Flash:" + b, c)
       }, 0)
     }
   }, c.runtimes.Flash = c.addRuntime("flash", {
     getFeatures: function() {
       return {
         jpgresize: !0,
         pngresize: !0,
         maxWidth: 8091,
         maxHeight: 8091,
         chunks: !0,
         progress: !0,
         multipart: !0,
         multi_selection: !0
       }
     },
     init: function(a, d) {
       var h, i, j = 0,
         k = b.body;
       if (g() < 10)
         return void d({
           success: !1
         });
       f[a.id] = !1, e[a.id] = a, h = b.getElementById(a.settings.browse_button), i = b.createElement("div"), i.id = a.id + "_flash_container", c.extend(i.style, {
           position: "absolute",
           top: "0px",
           background: a.settings.shim_bgcolor || "transparent",
           zIndex: 99999,
           width: "100%",
           height: "100%"
         }), i.className = "plupload flash", a.settings.container && (k = b.getElementById(a.settings.container), "static" === c.getStyle(k, "position") && (k.style.position = "relative")), k.appendChild(i),
         function() {
           var d, e;
           d = '<object id="' + a.id + '_flash" type="application/x-shockwave-flash" data="' + a.settings.flash_swf_url + '" ', c.ua.ie && (d += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '), d += 'width="100%" height="100%" style="outline:0"><param name="movie" value="' + a.settings.flash_swf_url + '" /><param name="flashvars" value="id=' + escape(a.id) + '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>', c.ua.ie ? (e = b.createElement("div"), i.appendChild(e), e.outerHTML = d, e = null) : i.innerHTML = d
         }();

       function l() {
         return b.getElementById(a.id + "_flash")
       }

       function m() {
         return j++ > 5e3 ? void d({
           success: !1
         }) : void(f[a.id] === !1 && setTimeout(m, 1))
       }
       m(), h = i = null, a.bind("Destroy", function(a) {
         var d;
         c.removeAllEvents(b.body, a.id), delete f[a.id], delete e[a.id], d = b.getElementById(a.id + "_flash_container"), d && k.removeChild(d)
       }), a.bind("Flash:Init", function() {
         var e = {};
         try {
           l().setFileFilters(a.settings.filters, a.settings.multi_selection)
         } catch (h) {
           return void d({
             success: !1
           })
         }
         f[a.id] || (f[a.id] = !0, a.bind("UploadFile", function(b, d) {
           var f = b.settings,
             g = a.settings.resize || {};
           l().uploadFile(e[d.id], f.url, {
             name: d.target_name || d.name,
             mime: c.mimeTypes[d.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream",
             chunk_size: f.chunk_size,
             width: g.width,
             height: g.height,
             quality: g.quality,
             multipart: f.multipart,
             multipart_params: f.multipart_params || {},
             file_data_name: f.file_data_name,
             format: /\.(jpg|jpeg)$/i.test(d.name) ? "jpg" : "png",
             headers: f.headers,
             urlstream_upload: f.urlstream_upload
           })
         }), a.bind("CancelUpload", function() {
           l().cancelUpload()
         }), a.bind("Flash:UploadProcess", function(a, b) {
           var d = a.getFile(e[b.id]);
           d.status != c.FAILED && (d.loaded = b.loaded, d.size = b.size, a.trigger("UploadProgress", d))
         }), a.bind("Flash:UploadChunkComplete", function(a, b) {
           var d, f = a.getFile(e[b.id]);
           d = {
             chunk: b.chunk,
             chunks: b.chunks,
             response: b.text
           }, a.trigger("ChunkUploaded", f, d), f.status !== c.FAILED && a.state !== c.STOPPED && l().uploadNextChunk(), b.chunk == b.chunks - 1 && (f.status = c.DONE, a.trigger("FileUploaded", f, {
             response: b.text
           }))
         }), a.bind("Flash:SelectFiles", function(b, d) {
           var f, g, i, h = [];
           for (g = 0; g < d.length; g++)
             f = d[g], i = c.guid(), e[i] = f.id, e[f.id] = i, h.push(new c.File(i, f.name, f.size));
           h.length && a.trigger("FilesAdded", h)
         }), a.bind("Flash:SecurityError", function(b, d) {
           a.trigger("Error", {
             code: c.SECURITY_ERROR,
             message: c.translate("Security error."),
             details: d.message,
             file: a.getFile(e[d.id])
           })
         }), a.bind("Flash:GenericError", function(b, d) {
           a.trigger("Error", {
             code: c.GENERIC_ERROR,
             message: c.translate("Generic error."),
             details: d.message,
             file: a.getFile(e[d.id])
           })
         }), a.bind("Flash:IOError", function(b, d) {
           a.trigger("Error", {
             code: c.IO_ERROR,
             message: c.translate("IO error."),
             details: d.message,
             file: a.getFile(e[d.id])
           })
         }), a.bind("Flash:ImageError", function(b, d) {
           a.trigger("Error", {
             code: parseInt(d.code, 10),
             message: c.translate("Image error."),
             file: a.getFile(e[d.id])
           })
         }), a.bind("Flash:StageEvent:rollOver", function(d) {
           var e, f;
           e = b.getElementById(a.settings.browse_button), f = d.settings.browse_button_hover, e && f && c.addClass(e, f)
         }), a.bind("Flash:StageEvent:rollOut", function(d) {
           var e, f;
           e = b.getElementById(a.settings.browse_button), f = d.settings.browse_button_hover, e && f && c.removeClass(e, f)
         }), a.bind("Flash:StageEvent:mouseDown", function(d) {
           var e, f;
           e = b.getElementById(a.settings.browse_button), f = d.settings.browse_button_active, e && f && (c.addClass(e, f), c.addEvent(b.body, "mouseup", function() {
             c.removeClass(e, f)
           }, d.id))
         }), a.bind("Flash:StageEvent:mouseUp", function(d) {
           var e, f;
           e = b.getElementById(a.settings.browse_button), f = d.settings.browse_button_active, e && f && c.removeClass(e, f)
         }), a.bind("Flash:ExifData", function(b, c) {
           a.trigger("ExifData", a.getFile(e[c.id]), c.data)
         }), a.bind("Flash:GpsData", function(b, c) {
           a.trigger("GpsData", a.getFile(e[c.id]), c.data)
         }), a.bind("QueueChanged", function() {
           a.refresh()
         }), a.bind("FilesRemoved", function(a, b) {
           var c;
           for (c = 0; c < b.length; c++)
             l().removeFile(e[b[c].id])
         }), a.bind("StateChanged", function() {
           a.refresh()
         }), a.bind("Refresh", function(d) {
           var e, f, g;
           l().setFileFilters(a.settings.filters, a.settings.multi_selection), e = b.getElementById(d.settings.browse_button), e && (f = c.getPos(e, b.getElementById(d.settings.container)), g = c.getSize(e), c.extend(b.getElementById(d.id + "_flash_container").style, {
             top: f.y + "px",
             left: f.x + "px",
             width: g.w + "px",
             height: g.h + "px"
           }))
         }), a.bind("DisableBrowse", function(a, b) {
           l().disableBrowse(b)
         }), d({
           success: !0
         }))
       })
     }
   })
 }(window, document, plupload),
 function(a) {
   a.runtimes.BrowserPlus = a.addRuntime("browserplus", {
     getFeatures: function() {
       return {
         dragdrop: !0,
         jpgresize: !0,
         pngresize: !0,
         chunks: !0,
         progress: !0,
         multipart: !0,
         multi_selection: !0
       }
     },
     init: function(b, c) {
       var d = window.BrowserPlus,
         e = {},
         f = b.settings,
         g = f.resize;

       function h(c) {
         var f, h, i, g = [];
         for (f = 0; f < c.length; f++)
           h = c[f], i = a.guid(), e[i] = h, g.push(new a.File(i, h.name, h.size));
         f && b.trigger("FilesAdded", g)
       }

       function i() {
         var i = !1;
         b.bind("PostInit", function() {
           var c, e = f.drop_element,
             g = b.id + "_droptarget",
             j = document.getElementById(e);

           function l(a, b) {
             d.DragAndDrop.AddDropTarget({
               id: a
             }, function() {
               d.DragAndDrop.AttachCallbacks({
                 id: a,
                 hover: function(a) {
                   !a && b && b()
                 },
                 drop: function(a) {
                   b && b(), h(a)
                 }
               }, function() {})
             })
           }

           function m() {
             document.getElementById(g).style.top = "-1000px"
           }
           j && (document.attachEvent && /MSIE/gi.test(navigator.userAgent) ? (c = document.createElement("div"), c.setAttribute("id", g), a.extend(c.style, {
             position: "absolute",
             top: "-1000px",
             background: "red",
             filter: "alpha(opacity=0)",
             opacity: 0
           }), document.body.appendChild(c), a.addEvent(j, "dragenter", function() {
             var c, d;
             c = document.getElementById(e), d = a.getPos(c), a.extend(document.getElementById(g).style, {
               top: d.y + "px",
               left: d.x + "px",
               width: c.offsetWidth + "px",
               height: c.offsetHeight + "px"
             })
           }), l(g, m)) : l(e)), a.addEvent(document.getElementById(f.browse_button), "click", function(b) {
             var e, g, k, l, c = [],
               j = f.filters;
             if (b.preventDefault(), !i) {
               a: for (e = 0; e < j.length; e++)
                 for (k = j[e].extensions.split(","), g = 0; g < k.length; g++) {
                   if ("*" === k[g]) {
                     c = [];
                     break a
                   }
                   l = a.mimeTypes[k[g]], l && -1 === a.inArray(l, c) && c.push(a.mimeTypes[k[g]])
                 }
               d.FileBrowse.OpenBrowseDialog({
                 mimeTypes: c
               }, function(a) {
                 a.success && h(a.value)
               })
             }
           }), j = c = null
         }), b.bind("CancelUpload", function() {
           d.Uploader.cancel({}, function() {})
         }), b.bind("DisableBrowse", function(a, b) {
           i = b
         }), b.bind("UploadFile", function(b, c) {
           var j, f = e[c.id],
             h = {},
             i = b.settings.chunk_size,
             k = [];

           function l(e, f) {
             var g;
             c.status != a.FAILED && (h.name = c.target_name || c.name, i && (h.chunk = "" + e, h.chunks = "" + f), g = k.shift(), d.Uploader.upload({
               url: b.settings.url,
               files: {
                 file: g
               },
               cookies: document.cookies,
               postvars: a.extend(h, b.settings.multipart_params),
               progressCallback: function(a) {
                 var d, f = 0;
                 for (j[e] = parseInt(a.filePercent * g.size / 100, 10), d = 0; d < j.length; d++)
                   f += j[d];
                 c.loaded = f, b.trigger("UploadProgress", c)
               }
             }, function(d) {
               var g;
               d.success ? (g = d.value.statusCode, i && b.trigger("ChunkUploaded", c, {
                 chunk: e,
                 chunks: f,
                 response: d.value.body,
                 status: g
               }), k.length > 0 ? l(++e, f) : (c.status = a.DONE, b.trigger("FileUploaded", c, {
                 response: d.value.body,
                 status: g
               }), g >= 400 && b.trigger("Error", {
                 code: a.HTTP_ERROR,
                 message: a.translate("HTTP Error."),
                 file: c,
                 status: g
               }))) : b.trigger("Error", {
                 code: a.GENERIC_ERROR,
                 message: a.translate("Generic Error."),
                 file: c,
                 details: d.error
               })
             }))
           }

           function m(a) {
             c.size = a.size, i ? d.FileAccess.chunk({
               file: a,
               chunkSize: i
             }, function(a) {
               if (a.success) {
                 var b = a.value,
                   c = b.length;
                 j = Array(c);
                 for (var d = 0; c > d; d++)
                   j[d] = 0, k.push(b[d]);
                 l(0, c)
               }
             }) : (j = Array(1), k.push(a), l(0, 1))
           }
           g && /\.(png|jpg|jpeg)$/i.test(c.name) ? BrowserPlus.ImageAlter.transform({
             file: f,
             quality: g.quality || 90,
             actions: [{
               scale: {
                 maxwidth: g.width,
                 maxheight: g.height
               }
             }]
           }, function(a) {
             a.success && m(a.value.file)
           }) : m(f)
         }), c({
           success: !0
         })
       }
       d ? d.init(function(a) {
         var b = [{
           service: "Uploader",
           version: "3"
         }, {
           service: "DragAndDrop",
           version: "1"
         }, {
           service: "FileBrowse",
           version: "1"
         }, {
           service: "FileAccess",
           version: "2"
         }];
         g && b.push({
           service: "ImageAlter",
           version: "4"
         }), a.success ? d.require({
           services: b
         }, function(a) {
           a.success ? i() : c()
         }) : c()
       }) : c()
     }
   })
 }(plupload),
 function(a, b, c, d) {
   var f, e = {};

   function g(b, c) {
     var d;
     return "FileReader" in a ? (d = new FileReader, d.readAsDataURL(b), d.onload = function() {
       c(d.result)
     }, void 0) : c(b.getAsDataURL())
   }

   function h(b, c) {
     var d;
     return "FileReader" in a ? (d = new FileReader, d.readAsBinaryString(b), d.onload = function() {
       c(d.result)
     }, void 0) : c(b.getAsBinary())
   }

   function j(a, c, d, f) {
     var h, i, j, k, n = this;
     g(e[a.id], function(e) {
       h = b.createElement("canvas"), h.style.display = "none", b.body.appendChild(h), i = h.getContext("2d"), j = new Image, j.onerror = j.onabort = function() {
         f({
           success: !1
         })
       }, j.onload = function() {
         var b, g, p, q;
         if (c.width || (c.width = j.width), c.height || (c.height = j.height), k = Math.min(c.width / j.width, c.height / j.height), 1 > k || 1 === k && "image/jpeg" === d) {
           if (b = Math.round(j.width * k), g = Math.round(j.height * k), h.width = b, h.height = g, i.drawImage(j, 0, 0, b, g), "image/jpeg" === d) {
             if (p = new l(atob(e.substring(e.indexOf("base64,") + 7))), p.headers && p.headers.length && (q = new m, q.init(p.get("exif")[0]) && (q.setExif("PixelXDimension", b), q.setExif("PixelYDimension", g), p.set("exif", q.getBinary()), n.hasEventListener("ExifData") && n.trigger("ExifData", a, q.EXIF()), n.hasEventListener("GpsData") && n.trigger("GpsData", a, q.GPS()))), c.quality)
               try {
                 e = h.toDataURL(d, c.quality / 100)
               } catch (r) {
                 e = h.toDataURL(d)
               }
           } else
             e = h.toDataURL(d);
           e = e.substring(e.indexOf("base64,") + 7), e = atob(e), p && p.headers && p.headers.length && (e = p.restore(e), p.purge()), h.parentNode.removeChild(h), f({
             success: !0,
             data: e
           })
         } else
           f({
             success: !1
           })
       }, j.src = e
     })
   }
   c.runtimes.Html5 = c.addRuntime("html5", {
     getFeatures: function() {
       var d, e, g, h, i, j;
       return e = g = i = j = !1, a.XMLHttpRequest && (d = new XMLHttpRequest, g = !!d.upload, e = !(!d.sendAsBinary && !d.upload)), e && (h = !!(d.sendAsBinary || a.Uint8Array && a.ArrayBuffer), i = !(!File || !File.prototype.getAsDataURL && !a.FileReader || !h), j = !(!File || !(File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice))), f = c.ua.safari && c.ua.windows, {
         html5: e,
         dragdrop: function() {
           var a = b.createElement("div");
           return "draggable" in a || "ondragstart" in a && "ondrop" in a
         }(),
         jpgresize: i,
         pngresize: i,
         multipart: i || !!a.FileReader || !!a.FormData,
         canSendBinary: h,
         cantSendBlobInFormData: !(!(c.ua.gecko && a.FormData && a.FileReader) || FileReader.prototype.readAsArrayBuffer),
         progress: g,
         chunks: j,
         multi_selection: !(c.ua.safari && c.ua.windows),
         triggerDialog: c.ua.gecko && a.FormData || c.ua.webkit
       }
     },
     init: function(d, g) {
       var i, k;

       function l(a) {
         var b, f, h, g = [],
           i = {};
         for (f = 0; f < a.length; f++)
           b = a[f], i[b.name] || (i[b.name] = !0, h = c.guid(), e[h] = b, g.push(new c.File(h, b.fileName || b.name, b.fileSize || b.size)));
         g.length && d.trigger("FilesAdded", g)
       }
       return i = this.getFeatures(), i.html5 ? (d.bind("Init", function(a) {
         var e, f, h, i, k, m, o, g = [],
           j = a.settings.filters,
           n = b.body;
         e = b.createElement("div"), e.id = a.id + "_html5_container", c.extend(e.style, {
           position: "absolute",
           background: d.settings.shim_bgcolor || "transparent",
           width: "100px",
           height: "100px",
           overflow: "hidden",
           zIndex: 99999,
           opacity: d.settings.shim_bgcolor ? "" : 0
         }), e.className = "plupload html5", d.settings.container && (n = b.getElementById(d.settings.container), "static" === c.getStyle(n, "position") && (n.style.position = "relative")), n.appendChild(e);
         a: for (h = 0; h < j.length; h++)
           for (k = j[h].extensions.split(/,/), i = 0; i < k.length; i++) {
             if ("*" === k[i]) {
               g = [];
               break a
             }
             m = c.mimeTypes[k[i]], m && -1 === c.inArray(m, g) && g.push(m)
           }
         if (e.innerHTML = '<input id="' + d.id + '_html5"  style="font-size:999px" type="file" accept="' + g.join(",") + '" ' + (d.settings.multi_selection && d.features.multi_selection ? 'multiple="multiple"' : "") + " />", e.scrollTop = 100, o = b.getElementById(d.id + "_html5"), a.features.triggerDialog ? c.extend(o.style, {
             position: "absolute",
             width: "100%",
             height: "100%"
           }) : c.extend(o.style, {
             cssFloat: "right",
             styleFloat: "right"
           }), o.onchange = function() {
             l(this.files), this.value = ""
           }, f = b.getElementById(a.settings.browse_button)) {
           var p = a.settings.browse_button_hover,
             q = a.settings.browse_button_active,
             r = a.features.triggerDialog ? f : e;
           p && (c.addEvent(r, "mouseover", function() {
             c.addClass(f, p)
           }, a.id), c.addEvent(r, "mouseout", function() {
             c.removeClass(f, p)
           }, a.id)), q && (c.addEvent(r, "mousedown", function() {
             c.addClass(f, q)
           }, a.id), c.addEvent(b.body, "mouseup", function() {
             c.removeClass(f, q)
           }, a.id)), a.features.triggerDialog && c.addEvent(f, "click", function(c) {
             var d = b.getElementById(a.id + "_html5");
             d && !d.disabled && d.click(), c.preventDefault()
           }, a.id)
         }
       }), d.bind("PostInit", function() {
         var a = b.getElementById(d.settings.drop_element);
         if (a) {
           if (f)
             return void c.addEvent(a, "dragenter", function() {
               var f, g, h;
               f = b.getElementById(d.id + "_drop"), f || (f = b.createElement("input"), f.setAttribute("type", "file"), f.setAttribute("id", d.id + "_drop"), f.setAttribute("multiple", "multiple"), c.addEvent(f, "change", function() {
                 l(this.files), c.removeEvent(f, "change", d.id), f.parentNode.removeChild(f)
               }, d.id), a.appendChild(f)), g = c.getPos(a, b.getElementById(d.settings.container)), h = c.getSize(a), "static" === c.getStyle(a, "position") && c.extend(a.style, {
                 position: "relative"
               }), c.extend(f.style, {
                 position: "absolute",
                 display: "block",
                 top: 0,
                 left: 0,
                 width: h.w + "px",
                 height: h.h + "px",
                 opacity: 0
               })
             }, d.id);
           c.addEvent(a, "dragover", function(a) {
             a.preventDefault()
           }, d.id), c.addEvent(a, "drop", function(a) {
             var b = a.dataTransfer;
             b && b.files && l(b.files), a.preventDefault()
           }, d.id)
         }
       }), d.bind("Refresh", function(a) {
         var e, f, g, h, i;
         e = b.getElementById(d.settings.browse_button), e && (f = c.getPos(e, b.getElementById(a.settings.container)), g = c.getSize(e), h = b.getElementById(d.id + "_html5_container"), c.extend(h.style, {
           top: f.y + "px",
           left: f.x + "px",
           width: g.w + "px",
           height: g.h + "px"
         }), d.features.triggerDialog && ("static" === c.getStyle(e, "position") && c.extend(e.style, {
           position: "relative"
         }), i = parseInt(c.getStyle(e, "z-index"), 10), isNaN(i) && (i = 0), c.extend(e.style, {
           zIndex: i
         }), c.extend(h.style, {
           zIndex: i - 1
         })))
       }), d.bind("DisableBrowse", function(a, c) {
         var d = b.getElementById(a.id + "_html5");
         d && (d.disabled = c)
       }), d.bind("CancelUpload", function() {
         k && k.abort && k.abort()
       }), d.bind("UploadFile", function(b, d) {
         var g, f = b.settings;

         function m(a, b, c) {
           var d;
           if (!File.prototype.slice)
             return (d = File.prototype.webkitSlice || File.prototype.mozSlice) ? d.call(a, b, c) : null;
           try {
             return a.slice(), a.slice(b, c)
           } catch (e) {
             return a.slice(b, c - b)
           }
         }

         function n(e) {
           var g = 0,
             h = 0,
             j = "FileReader" in a ? new FileReader : null;

           function l() {
             var n, p, q, r, s, t, u = b.settings.url;

             function v(e) {
               var m, f = 0,
                 j = "----pluploadboundary" + c.guid(),
                 o = "--",
                 v = "\r\n",
                 w = "";
               if (k = new XMLHttpRequest, k.upload && (k.upload.onprogress = function(a) {
                   d.loaded = Math.min(d.size, h + a.loaded - f), b.trigger("UploadProgress", d)
                 }), k.onreadystatechange = function() {
                   var a, f;
                   if (4 == k.readyState && b.state !== c.STOPPED) {
                     try {
                       a = k.status
                     } catch (i) {
                       a = 0
                     }
                     if (a >= 400)
                       b.trigger("Error", {
                         code: c.HTTP_ERROR,
                         message: c.translate("HTTP Error."),
                         file: d,
                         status: a
                       });
                     else {
                       if (p) {
                         if (f = {
                             chunk: g,
                             chunks: p,
                             response: k.responseText,
                             status: a
                           }, b.trigger("ChunkUploaded", d, f), h += s, f.cancelled)
                           return void(d.status = c.FAILED);
                         d.loaded = Math.min(d.size, (g + 1) * r)
                       } else
                         d.loaded = d.size;
                       b.trigger("UploadProgress", d), e = n = m = w = null, !p || ++g >= p ? (d.status = c.DONE, b.trigger("FileUploaded", d, {
                         response: k.responseText,
                         status: a
                       })) : l()
                     }
                   }
                 }, b.settings.multipart && i.multipart) {
                 if (q.name = d.target_name || d.name, k.open("post", u, !0), c.each(b.settings.headers, function(a, b) {
                     k.setRequestHeader(b, a)
                   }), "string" != typeof e && a.FormData)
                   return m = new FormData, c.each(c.extend(q, b.settings.multipart_params), function(a, b) {
                     m.append(b, a)
                   }), m.append(b.settings.file_data_name, e), void k.send(m);
                 if ("string" == typeof e) {
                   if (k.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + j), c.each(c.extend(q, b.settings.multipart_params), function(a, b) {
                       w += o + j + v + 'Content-Disposition: form-data; name="' + b + '"' + v + v, w += unescape(encodeURIComponent(a)) + v
                     }), t = c.mimeTypes[d.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream", w += o + j + v + 'Content-Disposition: form-data; name="' + b.settings.file_data_name + '"; filename="' + unescape(encodeURIComponent(d.name)) + '"' + v + "Content-Type: " + t + v + v + e + v + o + j + o + v, f = w.length - e.length, e = w, k.sendAsBinary)
                     k.sendAsBinary(e);
                   else if (i.canSendBinary) {
                     for (var x = new Uint8Array(e.length), y = 0; y < e.length; y++)
                       x[y] = 255 & e.charCodeAt(y);
                     k.send(x.buffer)
                   }
                   return
                 }
               }
               u = c.buildUrl(b.settings.url, c.extend(q, b.settings.multipart_params)), k.open("post", u, !0), k.setRequestHeader("Content-Type", "application/octet-stream"), c.each(b.settings.headers, function(a, b) {
                 k.setRequestHeader(b, a)
               }), k.send(e)
             }
             d.status != c.DONE && d.status != c.FAILED && b.state != c.STOPPED && (q = {
               name: d.target_name || d.name
             }, f.chunk_size && d.size > f.chunk_size && (i.chunks || "string" == typeof e) ? (r = f.chunk_size, p = Math.ceil(d.size / r), s = Math.min(r, d.size - g * r), n = "string" == typeof e ? e.substring(g * r, g * r + s) : m(e, g * r, g * r + s), q.chunk = g, q.chunks = p) : (s = d.size, n = e), b.settings.multipart && i.multipart && "string" != typeof n && j && i.cantSendBlobInFormData && i.chunks && b.settings.chunk_size ? (j.onload = function() {
               v(j.result)
             }, j.readAsBinaryString(n)) : v(n))
           }
           l()
         }
         g = e[d.id], i.jpgresize && b.settings.resize && /\.(png|jpg|jpeg)$/i.test(d.name) ? j.call(b, d, b.settings.resize, /\.png$/i.test(d.name) ? "image/png" : "image/jpeg", function(a) {
           a.success ? (d.size = a.data.length, n(a.data)) : i.chunks ? n(g) : h(g, n)
         }) : !i.chunks && i.jpgresize ? h(g, n) : n(g)
       }), d.bind("Destroy", function(a) {
         var d, e, f = b.body,
           g = {
             inputContainer: a.id + "_html5_container",
             inputFile: a.id + "_html5",
             browseButton: a.settings.browse_button,
             dropElm: a.settings.drop_element
           };
         for (d in g)
           e = b.getElementById(g[d]), e && c.removeAllEvents(e, a.id);
         c.removeAllEvents(b.body, a.id), a.settings.container && (f = b.getElementById(a.settings.container)), f.removeChild(b.getElementById(g.inputContainer))
       }), void g({
         success: !0
       })) : void g({
         success: !1
       })
     }
   });

   function k() {
     var b, a = !1;

     function c(c, d) {
       var g, e = a ? 0 : -8 * (d - 1),
         f = 0;
       for (g = 0; d > g; g++)
         f |= b.charCodeAt(c + g) << Math.abs(e + 8 * g);
       return f
     }

     function e(a, c, d) {
       var d = 3 === arguments.length ? d : b.length - c - 1;
       b = b.substr(0, c) + a + b.substr(d + c)
     }

     function f(b, c, d) {
       var h, f = "",
         g = a ? 0 : -8 * (d - 1);
       for (h = 0; d > h; h++)
         f += String.fromCharCode(c >> Math.abs(g + 8 * h) & 255);
       e(f, b, d)
     }
     return {
       II: function(b) {
         return b === d ? a : void(a = b)
       },
       init: function(c) {
         a = !1, b = c
       },
       SEGMENT: function(a, c, d) {
         switch (arguments.length) {
           case 1:
             return b.substr(a, b.length - a - 1);
           case 2:
             return b.substr(a, c);
           case 3:
             e(d, a, c);
             break;
           default:
             return b
         }
       },
       BYTE: function(a) {
         return c(a, 1)
       },
       SHORT: function(a) {
         return c(a, 2)
       },
       LONG: function(a, b) {
         return b === d ? c(a, 4) : void f(a, b, 4)
       },
       SLONG: function(a) {
         var b = c(a, 4);
         return b > 2147483647 ? b - 4294967296 : b
       },
       STRING: function(a, b) {
         var d = "";
         for (b += a; b > a; a++)
           d += String.fromCharCode(c(a, 1));
         return d
       }
     }
   }

   function l(a) {
     var e, f, i, b = {
         65505: {
           app: "EXIF",
           name: "APP1",
           signature: "Exif\x00"
         },
         65506: {
           app: "ICC",
           name: "APP2",
           signature: "ICC_PROFILE\x00"
         },
         65517: {
           app: "IPTC",
           name: "APP13",
           signature: "Photoshop 3.0\x00"
         }
       },
       c = [],
       g = d,
       h = 0;
     if (e = new k, e.init(a), 65496 === e.SHORT(0)) {
       for (f = 2, i = Math.min(1048576, a.length); i >= f;)
         if (g = e.SHORT(f), g >= 65488 && 65495 >= g)
           f += 2;
         else {
           if (65498 === g || 65497 === g)
             break;
           h = e.SHORT(f + 2) + 2, b[g] && e.STRING(f + 4, b[g].signature.length) === b[g].signature && c.push({
             hex: g,
             app: b[g].app.toUpperCase(),
             name: b[g].name.toUpperCase(),
             start: f,
             length: h,
             segment: e.SEGMENT(f, h)
           }), f += h
         }
       return e.init(null), {
         headers: c,
         restore: function(a) {
           e.init(a);
           var b = new l(a);
           if (!b.headers)
             return !1;
           for (var d = b.headers.length; d > 0; d--) {
             var g = b.headers[d - 1];
             e.SEGMENT(g.start, g.length, "")
           }
           b.purge(), f = 65504 == e.SHORT(2) ? 4 + e.SHORT(4) : 2;
           for (var d = 0, h = c.length; h > d; d++)
             e.SEGMENT(f, 0, c[d].segment), f += c[d].length;
           return e.SEGMENT()
         },
         get: function(a) {
           for (var b = [], d = 0, e = c.length; e > d; d++)
             c[d].app === a.toUpperCase() && b.push(c[d].segment);
           return b
         },
         set: function(a, b) {
           var d = [];
           "string" == typeof b ? d.push(b) : d = b;
           for (var e = ii = 0, f = c.length; f > e && (c[e].app === a.toUpperCase() && (c[e].segment = d[ii], c[e].length = d[ii].length, ii++), !(ii >= d.length)); e++)
           ;
         },
         purge: function() {
           c = [], e.init(null)
         }
       }
     }
   }

   function m() {
     var a, b, f, e = {};
     a = new k, b = {
       tiff: {
         274: "Orientation",
         34665: "ExifIFDPointer",
         34853: "GPSInfoIFDPointer"
       },
       exif: {
         36864: "ExifVersion",
         40961: "ColorSpace",
         40962: "PixelXDimension",
         40963: "PixelYDimension",
         36867: "DateTimeOriginal",
         33434: "ExposureTime",
         33437: "FNumber",
         34855: "ISOSpeedRatings",
         37377: "ShutterSpeedValue",
         37378: "ApertureValue",
         37383: "MeteringMode",
         37384: "LightSource",
         37385: "Flash",
         41986: "ExposureMode",
         41987: "WhiteBalance",
         41990: "SceneCaptureType",
         41988: "DigitalZoomRatio",
         41992: "Contrast",
         41993: "Saturation",
         41994: "Sharpness"
       },
       gps: {
         0: "GPSVersionID",
         1: "GPSLatitudeRef",
         2: "GPSLatitude",
         3: "GPSLongitudeRef",
         4: "GPSLongitude"
       }
     }, f = {
       ColorSpace: {
         1: "sRGB",
         0: "Uncalibrated"
       },
       MeteringMode: {
         0: "Unknown",
         1: "Average",
         2: "CenterWeightedAverage",
         3: "Spot",
         4: "MultiSpot",
         5: "Pattern",
         6: "Partial",
         255: "Other"
       },
       LightSource: {
         1: "Daylight",
         2: "Fliorescent",
         3: "Tungsten",
         4: "Flash",
         9: "Fine weather",
         10: "Cloudy weather",
         11: "Shade",
         12: "Daylight fluorescent (D 5700 - 7100K)",
         13: "Day white fluorescent (N 4600 -5400K)",
         14: "Cool white fluorescent (W 3900 - 4500K)",
         15: "White fluorescent (WW 3200 - 3700K)",
         17: "Standard light A",
         18: "Standard light B",
         19: "Standard light C",
         20: "D55",
         21: "D65",
         22: "D75",
         23: "D50",
         24: "ISO studio tungsten",
         255: "Other"
       },
       Flash: {
         0: "Flash did not fire.",
         1: "Flash fired.",
         5: "Strobe return light not detected.",
         7: "Strobe return light detected.",
         9: "Flash fired, compulsory flash mode",
         13: "Flash fired, compulsory flash mode, return light not detected",
         15: "Flash fired, compulsory flash mode, return light detected",
         16: "Flash did not fire, compulsory flash mode",
         24: "Flash did not fire, auto mode",
         25: "Flash fired, auto mode",
         29: "Flash fired, auto mode, return light not detected",
         31: "Flash fired, auto mode, return light detected",
         32: "No flash function",
         65: "Flash fired, red-eye reduction mode",
         69: "Flash fired, red-eye reduction mode, return light not detected",
         71: "Flash fired, red-eye reduction mode, return light detected",
         73: "Flash fired, compulsory flash mode, red-eye reduction mode",
         77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
         79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
         89: "Flash fired, auto mode, red-eye reduction mode",
         93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
         95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
       },
       ExposureMode: {
         0: "Auto exposure",
         1: "Manual exposure",
         2: "Auto bracket"
       },
       WhiteBalance: {
         0: "Auto white balance",
         1: "Manual white balance"
       },
       SceneCaptureType: {
         0: "Standard",
         1: "Landscape",
         2: "Portrait",
         3: "Night scene"
       },
       Contrast: {
         0: "Normal",
         1: "Soft",
         2: "Hard"
       },
       Saturation: {
         0: "Normal",
         1: "Low saturation",
         2: "High saturation"
       },
       Sharpness: {
         0: "Normal",
         1: "Soft",
         2: "Hard"
       },
       GPSLatitudeRef: {
         N: "North latitude",
         S: "South latitude"
       },
       GPSLongitudeRef: {
         E: "East longitude",
         W: "West longitude"
       }
     };

     function g(b, c) {
       var h, i, j, k, l, m, n, o, g = a.SHORT(b),
         p = [],
         q = {};
       for (h = 0; g > h; h++)
         if (n = m = b + 12 * h + 2, j = c[a.SHORT(n)], j !== d) {
           switch (k = a.SHORT(n += 2), l = a.LONG(n += 2), n += 4, p = [], k) {
             case 1:
             case 7:
               for (l > 4 && (n = a.LONG(n) + e.tiffHeader), i = 0; l > i; i++)
                 p[i] = a.BYTE(n + i);
               break;
             case 2:
               l > 4 && (n = a.LONG(n) + e.tiffHeader), q[j] = a.STRING(n, l - 1);
               continue;
             case 3:
               for (l > 2 && (n = a.LONG(n) + e.tiffHeader), i = 0; l > i; i++)
                 p[i] = a.SHORT(n + 2 * i);
               break;
             case 4:
               for (l > 1 && (n = a.LONG(n) + e.tiffHeader), i = 0; l > i; i++)
                 p[i] = a.LONG(n + 4 * i);
               break;
             case 5:
               for (n = a.LONG(n) + e.tiffHeader, i = 0; l > i; i++)
                 p[i] = a.LONG(n + 4 * i) / a.LONG(n + 4 * i + 4);
               break;
             case 9:
               for (n = a.LONG(n) + e.tiffHeader, i = 0; l > i; i++)
                 p[i] = a.SLONG(n + 4 * i);
               break;
             case 10:
               for (n = a.LONG(n) + e.tiffHeader, i = 0; l > i; i++)
                 p[i] = a.SLONG(n + 4 * i) / a.SLONG(n + 4 * i + 4);
               break;
             default:
               continue
           }
           o = 1 == l ? p[0] : p, q[j] = f.hasOwnProperty(j) && "object" != typeof o ? f[j][o] : o
         }
       return q
     }

     function h() {
       var c = d,
         f = e.tiffHeader;
       return a.II(18761 == a.SHORT(f)), 42 !== a.SHORT(f += 2) ? !1 : (e.IFD0 = e.tiffHeader + a.LONG(f += 2), c = g(e.IFD0, b.tiff), e.exifIFD = "ExifIFDPointer" in c ? e.tiffHeader + c.ExifIFDPointer : d, e.gpsIFD = "GPSInfoIFDPointer" in c ? e.tiffHeader + c.GPSInfoIFDPointer : d, !0)
     }

     function j(c, d, f) {
       var g, h, j, k = 0;
       if ("string" == typeof d) {
         var l = b[c.toLowerCase()];
         for (hex in l)
           if (l[hex] === d) {
             d = hex;
             break
           }
       }
       for (g = e[c.toLowerCase() + "IFD"], h = a.SHORT(g), i = 0; h > i; i++)
         if (j = g + 12 * i + 2, a.SHORT(j) == d) {
           k = j + 8;
           break
         }
       return k ? (a.LONG(k, f), !0) : !1
     }
     return {
       init: function(b) {
         return e = {
           tiffHeader: 10
         }, b !== d && b.length ? (a.init(b), 65505 === a.SHORT(0) && "EXIF\x00" === a.STRING(4, 5).toUpperCase() ? h() : !1) : !1
       },
       EXIF: function() {
         var a;
         if (a = g(e.exifIFD, b.exif), a.ExifVersion && "array" === c.typeOf(a.ExifVersion)) {
           for (var d = 0, f = ""; d < a.ExifVersion.length; d++)
             f += String.fromCharCode(a.ExifVersion[d]);
           a.ExifVersion = f
         }
         return a
       },
       GPS: function() {
         var a;
         return a = g(e.gpsIFD, b.gps), a.GPSVersionID && (a.GPSVersionID = a.GPSVersionID.join(".")), a
       },
       setExif: function(a, b) {
         return "PixelXDimension" !== a && "PixelYDimension" !== a ? !1 : j("exif", a, b)
       },
       getBinary: function() {
         return a.SEGMENT()
       }
     }
   }
 }(window, document, plupload),
 function(a, b, c) {
   function e(a) {
     return b.getElementById(a)
   }
   c.runtimes.Html4 = c.addRuntime("html4", {
     getFeatures: function() {
       return {
         multipart: !0,
         triggerDialog: c.ua.gecko && a.FormData || c.ua.webkit
       }
     },
     init: function(d, f) {
       d.bind("Init", function(f) {
         var h, j, l, q, r, s, t, g = b.body,
           i = "javascript",
           m = [],
           n = /MSIE/.test(navigator.userAgent),
           o = [],
           p = f.settings.filters;
         a: for (q = 0; q < p.length; q++)
           for (r = p[q].extensions.split(/,/), t = 0; t < r.length; t++) {
             if ("*" === r[t]) {
               o = [];
               break a
             }
             s = c.mimeTypes[r[t]], s && -1 === c.inArray(s, o) && o.push(s)
           }
         o = o.join(",");

         function u() {
           var a, h, i, j;
           l = c.guid(), m.push(l), a = b.createElement("form"), a.setAttribute("id", "form_" + l), a.setAttribute("method", "post"), a.setAttribute("enctype", "multipart/form-data"), a.setAttribute("encoding", "multipart/form-data"), a.setAttribute("target", f.id + "_iframe"), a.style.position = "absolute", h = b.createElement("input"), h.setAttribute("id", "input_" + l), h.setAttribute("type", "file"), h.setAttribute("accept", o), h.setAttribute("size", 1), j = e(f.settings.browse_button), f.features.triggerDialog && j && c.addEvent(e(f.settings.browse_button), "click", function(a) {
             h.disabled || h.click(), a.preventDefault()
           }, f.id), c.extend(h.style, {
             width: "100%",
             height: "100%",
             opacity: 0,
             fontSize: "99px",
             cursor: "pointer"
           }), c.extend(a.style, {
             overflow: "hidden"
           }), i = f.settings.shim_bgcolor, i && (a.style.background = i), n && c.extend(h.style, {
             filter: "alpha(opacity=0)"
           }), c.addEvent(h, "change", function(b) {
             var i, g = b.target,
               k = [];
             g.value && (e("form_" + l).style.top = "-1048575px", i = g.value.replace(/\\/g, "/"), i = i.substring(i.length, i.lastIndexOf("/") + 1), k.push(new c.File(l, i)), f.features.triggerDialog ? c.removeEvent(j, "click", f.id) : c.removeAllEvents(a, f.id), c.removeEvent(h, "change", f.id), u(), k.length && d.trigger("FilesAdded", k))
           }, f.id), a.appendChild(h), g.appendChild(a), f.refresh()
         }

         function v() {
           var d = b.createElement("div");
           d.innerHTML = '<iframe id="' + f.id + '_iframe" name="' + f.id + '_iframe" src="' + i + ':&quot;&quot;" style="display:none"></iframe>', h = d.firstChild, g.appendChild(h), c.addEvent(h, "load", function(b) {
             var e, g, d = b.target;
             if (j) {
               try {
                 e = d.contentWindow.document || d.contentDocument || a.frames[d.id].document
               } catch (h) {
                 return void f.trigger("Error", {
                   code: c.SECURITY_ERROR,
                   message: c.translate("Security error."),
                   file: j
                 })
               }
               g = e.body.innerHTML, g && (j.status = c.DONE, j.loaded = 1025, j.percent = 100, f.trigger("UploadProgress", j), f.trigger("FileUploaded", j, {
                 response: g
               }))
             }
           }, f.id)
         }
         f.settings.container && (g = e(f.settings.container), "static" === c.getStyle(g, "position") && (g.style.position = "relative")), f.bind("UploadFile", function(a, d) {
           var f, g;
           d.status != c.DONE && d.status != c.FAILED && a.state != c.STOPPED && (f = e("form_" + d.id), g = e("input_" + d.id), g.setAttribute("name", a.settings.file_data_name), f.setAttribute("action", a.settings.url), c.each(c.extend({
             name: d.target_name || d.name
           }, a.settings.multipart_params), function(a, d) {
             var e = b.createElement("input");
             c.extend(e, {
               type: "hidden",
               name: d,
               value: a
             }), f.insertBefore(e, f.firstChild)
           }), j = d, e("form_" + l).style.top = "-1048575px", f.submit())
         }), f.bind("FileUploaded", function(a) {
           a.refresh()
         }), f.bind("StateChanged", function(b) {
           b.state == c.STARTED ? v() : b.state == c.STOPPED && a.setTimeout(function() {
             c.removeEvent(h, "load", b.id), h.parentNode && h.parentNode.removeChild(h)
           }, 0), c.each(b.files, function(a) {
             if (a.status === c.DONE || a.status === c.FAILED) {
               var d = e("form_" + a.id);
               d && d.parentNode.removeChild(d)
             }
           })
         }), f.bind("Refresh", function(a) {
           var d, f, g, h, i, j, k, m, n;
           d = e(a.settings.browse_button), d && (i = c.getPos(d, e(a.settings.container)), j = c.getSize(d), k = e("form_" + l), m = e("input_" + l), c.extend(k.style, {
             top: i.y + "px",
             left: i.x + "px",
             width: j.w + "px",
             height: j.h + "px"
           }), a.features.triggerDialog && ("static" === c.getStyle(d, "position") && c.extend(d.style, {
             position: "relative"
           }), n = parseInt(d.style.zIndex, 10), isNaN(n) && (n = 0), c.extend(d.style, {
             zIndex: n
           }), c.extend(k.style, {
             zIndex: n - 1
           })), g = a.settings.browse_button_hover, h = a.settings.browse_button_active, f = a.features.triggerDialog ? d : k, g && (c.addEvent(f, "mouseover", function() {
             c.addClass(d, g)
           }, a.id), c.addEvent(f, "mouseout", function() {
             c.removeClass(d, g)
           }, a.id)), h && (c.addEvent(f, "mousedown", function() {
             c.addClass(d, h)
           }, a.id), c.addEvent(b.body, "mouseup", function() {
             c.removeClass(d, h)
           }, a.id)))
         }), d.bind("FilesRemoved", function(a, b) {
           var c, d;
           for (c = 0; c < b.length; c++)
             d = e("form_" + b[c].id), d && d.parentNode.removeChild(d)
         }), d.bind("DisableBrowse", function(a, c) {
           var d = b.getElementById("input_" + l);
           d && (d.disabled = c)
         }), d.bind("Destroy", function(a) {
           var d, f, h, i = {
             inputContainer: "form_" + l,
             inputFile: "input_" + l,
             browseButton: a.settings.browse_button
           };
           for (d in i)
             f = e(i[d]), f && c.removeAllEvents(f, a.id);
           c.removeAllEvents(b.body, a.id), c.each(m, function(a) {
             h = e("form_" + a), h && g.removeChild(h)
           })
         }), u()
       }), f({
         success: !0
       })
     }
   })
 }(window, document, plupload);

 window.plupload = plupload;