(function () {
	var e = function (t, n) {
		var r = e.resolve(t, n || "/"),
		i = e.modules[r];
		if (!i)
			throw new Error("Failed to resolve module " + t + ", tried " + r);
		var s = e.cache[r],
		o = s ? s.exports : i();
		return o
	};
	e.paths = [],
	e.modules = {},
	e.cache = {},
	e.extensions = [".js", ".coffee", ".json"],
	e._core = {
		assert : !0,
		events : !0,
		fs : !0,
		path : !0,
		vm : !0
	},
	e.resolve = function () {
		return function (t, n) {
			function u(t) {
				t = r.normalize(t);
				if (e.modules[t])
					return t;
				for (var n = 0; n < e.extensions.length; n++) {
					var i = e.extensions[n];
					if (e.modules[t + i])
						return t + i
				}
			}
			function a(t) {
				t = t.replace(/\/+$/, "");
				var n = r.normalize(t + "/package.json");
				if (e.modules[n]) {
					var i = e.modules[n](),
					s = i.browserify;
					if (typeof s == "object" && s.main) {
						var o = u(r.resolve(t, s.main));
						if (o)
							return o
					} else if (typeof s == "string") {
						var o = u(r.resolve(t, s));
						if (o)
							return o
					} else if (i.main) {
						var o = u(r.resolve(t, i.main));
						if (o)
							return o
					}
				}
				return u(t + "/index")
			}
			function f(e, t) {
				var n = l(t);
				for (var r = 0; r < n.length; r++) {
					var i = n[r],
					s = u(i + "/" + e);
					if (s)
						return s;
					var o = a(i + "/" + e);
					if (o)
						return o
				}
				var s = u(e);
				if (s)
					return s
			}
			function l(e) {
				var t;
				e === "/" ? t = [""] : t = r.normalize(e).split("/");
				var n = [];
				for (var i = t.length - 1; i >= 0; i--) {
					if (t[i] === "node_modules")
						continue;
					var s = t.slice(0, i + 1).join("/") + "/node_modules";
					n.push(s)
				}
				return n
			}
			n || (n = "/");
			if (e._core[t])
				return t;
			var r = e.modules.path();
			n = r.resolve("/", n);
			var i = n || "/";
			if (t.match(/^(?:\.\.?\/|\/)/)) {
				var s = u(r.resolve(i, t)) || a(r.resolve(i, t));
				if (s)
					return s
			}
			var o = f(t, i);
			if (o)
				return o;
			throw new Error("Cannot find module '" + t + "'")
		}
	}
	(),
	e.alias = function (t, n) {
		var r = e.modules.path(),
		i = null;
		try {
			i = e.resolve(t + "/package.json", "/")
		} catch (s) {
			i = e.resolve(t, "/")
		}
		var o = r.dirname(i),
		u = (Object.keys || function (e) {
			var t = [];
			for (var n in e)
				t.push(n);
			return t
		})(e.modules);
		for (var a = 0; a < u.length; a++) {
			var f = u[a];
			if (f.slice(0, o.length + 1) === o + "/") {
				var l = f.slice(o.length);
				e.modules[n + l] = e.modules[o + l]
			} else
				f === o && (e.modules[n] = e.modules[o])
		}
	},
	function () {
		var t = {};
		e.define = function (n, r) {
			e.modules.__browserify_process && (t = e.modules.__browserify_process());
			var i = e._core[n] ? "" : e.modules.path().dirname(n),
			s = function (t) {
				var n = e(t, i),
				r = e.cache[e.resolve(t, i)];
				return r && r.parent === null && (r.parent = o),
				n
			};
			s.resolve = function (t) {
				return e.resolve(t, i)
			},
			s.modules = e.modules,
			s.define = e.define,
			s.cache = e.cache;
			var o = {
				id : n,
				filename : n,
				exports : {},
				loaded : !1,
				parent : null
			};
			e.modules[n] = function () {
				return e.cache[n] = o,
				r.call(o.exports, s, o, o.exports, i, n, t),
				o.loaded = !0,
				o.exports
			}
		}
	}
	(),
	e.define("path", function (e, t, n, r, i, s) {
		function o(e, t) {
			var n = [];
			for (var r = 0; r < e.length; r++)
				t(e[r], r, e) && n.push(e[r]);
			return n
		}
		function u(e, t) {
			var n = 0;
			for (var r = e.length; r >= 0; r--) {
				var i = e[r];
				i == "." ? e.splice(r, 1) : i === ".." ? (e.splice(r, 1), n++) : n && (e.splice(r, 1), n--)
			}
			if (t)
				for (; n--; n)
					e.unshift("..");
			return e
		}
		var a = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;
		n.resolve = function () {
			var e = "",
			t = !1;
			for (var n = arguments.length; n >= -1 && !t; n--) {
				var r = n >= 0 ? arguments[n] : s.cwd();
				if (typeof r != "string" || !r)
					continue;
				e = r + "/" + e,
				t = r.charAt(0) === "/"
			}
			return e = u(o(e.split("/"), function (e) {
						return !!e
					}), !t).join("/"),
			(t ? "/" : "") + e || "."
		},
		n.normalize = function (e) {
			var t = e.charAt(0) === "/",
			n = e.slice(-1) === "/";
			return e = u(o(e.split("/"), function (e) {
						return !!e
					}), !t).join("/"),
			!e && !t && (e = "."),
			e && n && (e += "/"),
			(t ? "/" : "") + e
		},
		n.join = function () {
			var e = Array.prototype.slice.call(arguments, 0);
			return n.normalize(o(e, function (e, t) {
					return e && typeof e == "string"
				}).join("/"))
		},
		n.dirname = function (e) {
			var t = a.exec(e)[1] || "",
			n = !1;
			return t ? t.length === 1 || n && t.length <= 3 && t.charAt(1) === ":" ? t : t.substring(0, t.length - 1) : "."
		},
		n.basename = function (e, t) {
			var n = a.exec(e)[2] || "";
			return t && n.substr(-1 * t.length) === t && (n = n.substr(0, n.length - t.length)),
			n
		},
		n.extname = function (e) {
			return a.exec(e)[3] || ""
		}
	}),
	e.define("__browserify_process", function (e, t, n, r, i, s) {
		var s = t.exports = {};
		s.nextTick = function () {
			var e = typeof window != "undefined" && window.setImmediate,
			t = typeof window != "undefined" && window.postMessage && window.addEventListener;
			if (e)
				return window.setImmediate;
			if (t) {
				var n = [];
				return window.addEventListener("message", function (e) {
					if (e.source === window && e.data === "browserify-tick") {
						e.stopPropagation();
						if (n.length > 0) {
							var t = n.shift();
							t()
						}
					}
				}, !0),
				function (t) {
					n.push(t),
					window.postMessage("browserify-tick", "*")
				}
			}
			return function (t) {
				setTimeout(t, 0)
			}
		}
		(),
		s.title = "browser",
		s.browser = !0,
		s.env = {},
		s.argv = [],
		s.binding = function (t) {
			if (t === "evals")
				return e("vm");
			throw new Error("No such module. (Possibly not yet loaded)")
		},
		function () {
			var t = "/",
			n;
			s.cwd = function () {
				return t
			},
			s.chdir = function (r) {
				n || (n = e("path")),
				t = n.resolve(r, t)
			}
		}
		()
	}),
	e.define("/node_modules/jquery-browserify/package.json", function (e, t, n, r, i, s) {
		t.exports = {
			main : "./lib/jquery.js",
			browserify : {
				dependencies : "",
				main : "lib/jquery.js"
			}
		}
	}),
	e.define("/node_modules/jquery-browserify/lib/jquery.js", function (e, t, n, r, i, s) {
		(function (e, r) {
			typeof n == "object" ? t.exports = r() : typeof define == "function" && define.amd ? define([], r) : e.returnExports = r()
		})(this, function () {
			return function (e, t) {
				function u(e) {
					var t = o[e] = {},
					n,
					r;
					e = e.split(/\s+/);
					for (n = 0, r = e.length; n < r; n++)
						t[e[n]] = !0;
					return t
				}
				function c(e, n, r) {
					if (r === t && e.nodeType === 1) {
						var i = "data-" + n.replace(l, "-$1").toLowerCase();
						r = e.getAttribute(i);
						if (typeof r == "string") {
							try {
								r = r === "true" ? !0 : r === "false" ? !1 : r === "null" ? null : s.isNumeric(r) ? +r : f.test(r) ? s.parseJSON(r) : r
							} catch (o) {}

							s.data(e, n, r)
						} else
							r = t
					}
					return r
				}
				function h(e) {
					for (var t in e) {
						if (t === "data" && s.isEmptyObject(e[t]))
							continue;
						if (t !== "toJSON")
							return !1
					}
					return !0
				}
				function p(e, t, n) {
					var r = t + "defer",
					i = t + "queue",
					o = t + "mark",
					u = s._data(e, r);
					u && (n === "queue" || !s._data(e, i)) && (n === "mark" || !s._data(e, o)) && setTimeout(function () {
						!s._data(e, i) && !s._data(e, o) && (s.removeData(e, r, !0), u.fire())
					}, 0)
				}
				function H() {
					return !1
				}
				function B() {
					return !0
				}
				function W(e) {
					return !e || !e.parentNode || e.parentNode.nodeType === 11
				}
				function X(e, t, n) {
					t = t || 0;
					if (s.isFunction(t))
						return s.grep(e, function (e, r) {
							var i = !!t.call(e, r, e);
							return i === n
						});
					if (t.nodeType)
						return s.grep(e, function (e, r) {
							return e === t === n
						});
					if (typeof t == "string") {
						var r = s.grep(e, function (e) {
								return e.nodeType === 1
							});
						if (q.test(t))
							return s.filter(t, r, !n);
						t = s.filter(t, r)
					}
					return s.grep(e, function (e, r) {
						return s.inArray(e, t) >= 0 === n
					})
				}
				function V(e) {
					var t = $.split("|"),
					n = e.createDocumentFragment();
					if (n.createElement)
						while (t.length)
							n.createElement(t.pop());
					return n
				}
				function at(e, t) {
					return s.nodeName(e, "table") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
				}
				function ft(e, t) {
					if (t.nodeType !== 1 || !s.hasData(e))
						return;
					var n,
					r,
					i,
					o = s._data(e),
					u = s._data(t, o),
					a = o.events;
					if (a) {
						delete u.handle,
						u.events = {};
						for (n in a)
							for (r = 0, i = a[n].length; r < i; r++)
								s.event.add(t, n, a[n][r])
					}
					u.data && (u.data = s.extend({}, u.data))
				}
				function lt(e, t) {
					var n;
					if (t.nodeType !== 1)
						return;
					t.clearAttributes && t.clearAttributes(),
					t.mergeAttributes && t.mergeAttributes(e),
					n = t.nodeName.toLowerCase(),
					n === "object" ? t.outerHTML = e.outerHTML : n !== "input" || e.type !== "checkbox" && e.type !== "radio" ? n === "option" ? t.selected = e.defaultSelected : n === "input" || n === "textarea" ? t.defaultValue = e.defaultValue : n === "script" && t.text !== e.text && (t.text = e.text) : (e.checked && (t.defaultChecked = t.checked = e.checked), t.value !== e.value && (t.value = e.value)),
					t.removeAttribute(s.expando),
					t.removeAttribute("_submit_attached"),
					t.removeAttribute("_change_attached")
				}
				function ct(e) {
					return typeof e.getElementsByTagName != "undefined" ? e.getElementsByTagName("*") : typeof e.querySelectorAll != "undefined" ? e.querySelectorAll("*") : []
				}
				function ht(e) {
					if (e.type === "checkbox" || e.type === "radio")
						e.defaultChecked = e.checked
				}
				function pt(e) {
					var t = (e.nodeName || "").toLowerCase();
					t === "input" ? ht(e) : t !== "script" && typeof e.getElementsByTagName != "undefined" && s.grep(e.getElementsByTagName("input"), ht)
				}
				function dt(e) {
					var t = n.createElement("div");
					return ut.appendChild(t),
					t.innerHTML = e.outerHTML,
					t.firstChild
				}
				function kt(e, t, n) {
					var r = t === "width" ? e.offsetWidth : e.offsetHeight,
					i = t === "width" ? 1 : 0,
					o = 4;
					if (r > 0) {
						if (n !== "border")
							for (; i < o; i += 2)
								n || (r -= parseFloat(s.css(e, "padding" + xt[i])) || 0), n === "margin" ? r += parseFloat(s.css(e, n + xt[i])) || 0 : r -= parseFloat(s.css(e, "border" + xt[i] + "Width")) || 0;
						return r + "px"
					}
					r = Tt(e, t);
					if (r < 0 || r == null)
						r = e.style[t];
					if (bt.test(r))
						return r;
					r = parseFloat(r) || 0;
					if (n)
						for (; i < o; i += 2)
							r += parseFloat(s.css(e, "padding" + xt[i])) || 0, n !== "padding" && (r += parseFloat(s.css(e, "border" + xt[i] + "Width")) || 0), n === "margin" && (r += parseFloat(s.css(e, n + xt[i])) || 0);
					return r + "px"
				}
				function Qt(e) {
					return function (t, n) {
						typeof t != "string" && (n = t, t = "*");
						if (s.isFunction(n)) {
							var r = t.toLowerCase().split(qt),
							i = 0,
							o = r.length,
							u,
							a,
							f;
							for (; i < o; i++)
								u = r[i], f = /^\+/.test(u), f && (u = u.substr(1) || "*"), a = e[u] = e[u] || [], a[f ? "unshift" : "push"](n)
						}
					}
				}
				function Gt(e, n, r, i, s, o) {
					s = s || n.dataTypes[0],
					o = o || {},
					o[s] = !0;
					var u = e[s],
					a = 0,
					f = u ? u.length : 0,
					l = e === Wt,
					c;
					for (; a < f && (l || !c); a++)
						c = u[a](n, r, i), typeof c == "string" && (!l || o[c] ? c = t : (n.dataTypes.unshift(c), c = Gt(e, n, r, i, c, o)));
					return (l || !c) && !o["*"] && (c = Gt(e, n, r, i, "*", o)),
					c
				}
				function Yt(e, n) {
					var r,
					i,
					o = s.ajaxSettings.flatOptions || {};
					for (r in n)
						n[r] !== t && ((o[r] ? e : i || (i = {}))[r] = n[r]);
					i && s.extend(!0, e, i)
				}
				function Zt(e, t, n, r) {
					if (s.isArray(t))
						s.each(t, function (t, i) {
							n || At.test(e) ? r(e, i) : Zt(e + "[" + (typeof i == "object" ? t : "") + "]", i, n, r)
						});
					else if (!n && s.type(t) === "object")
						for (var i in t)
							Zt(e + "[" + i + "]", t[i], n, r);
					else
						r(e, t)
				}
				function en(e, n, r) {
					var i = e.contents,
					s = e.dataTypes,
					o = e.responseFields,
					u,
					a,
					f,
					l;
					for (a in o)
						a in r && (n[o[a]] = r[a]);
					while (s[0] === "*")
						s.shift(), u === t && (u = e.mimeType || n.getResponseHeader("content-type"));
					if (u)
						for (a in i)
							if (i[a] && i[a].test(u)) {
								s.unshift(a);
								break
							}
					if (s[0]in r)
						f = s[0];
					else {
						for (a in r) {
							if (!s[0] || e.converters[a + " " + s[0]]) {
								f = a;
								break
							}
							l || (l = a)
						}
						f = f || l
					}
					if (f)
						return f !== s[0] && s.unshift(f), r[f]
				}
				function tn(e, n) {
					e.dataFilter && (n = e.dataFilter(n, e.dataType));
					var r = e.dataTypes,
					i = {},
					o,
					u,
					a = r.length,
					f,
					l = r[0],
					c,
					h,
					p,
					d,
					v;
					for (o = 1; o < a; o++) {
						if (o === 1)
							for (u in e.converters)
								typeof u == "string" && (i[u.toLowerCase()] = e.converters[u]);
						c = l,
						l = r[o];
						if (l === "*")
							l = c;
						else if (c !== "*" && c !== l) {
							h = c + " " + l,
							p = i[h] || i["* " + l];
							if (!p) {
								v = t;
								for (d in i) {
									f = d.split(" ");
									if (f[0] === c || f[0] === "*") {
										v = i[f[1] + " " + l];
										if (v) {
											d = i[d],
											d === !0 ? p = v : v === !0 && (p = d);
											break
										}
									}
								}
							}
							!p && !v && s.error("No conversion from " + h.replace(" ", " to ")),
							p !== !0 && (n = p ? p(n) : v(d(n)))
						}
					}
					return n
				}
				function an() {
					try {
						return new e.XMLHttpRequest
					} catch (t) {}

				}
				function fn() {
					try {
						return new e.ActiveXObject("Microsoft.XMLHTTP")
					} catch (t) {}

				}
				function yn() {
					return setTimeout(bn, 0),
					gn = s.now()
				}
				function bn() {
					gn = t
				}
				function wn(e, t) {
					var n = {};
					return s.each(mn.concat.apply([], mn.slice(0, t)), function () {
						n[this] = e
					}),
					n
				}
				function En(e) {
					if (!ln[e]) {
						var t = n.body,
						r = s("<" + e + ">").appendTo(t),
						i = r.css("display");
						r.remove();
						if (i === "none" || i === "") {
							cn || (cn = n.createElement("iframe"), cn.frameBorder = cn.width = cn.height = 0),
							t.appendChild(cn);
							if (!hn || !cn.createElement)
								hn = (cn.contentWindow || cn.contentDocument).document, hn.write((s.support.boxModel ? "<!doctype html>" : "") + "<html><body>"), hn.close();
							r = hn.createElement(e),
							hn.body.appendChild(r),
							i = s.css(r, "display"),
							t.removeChild(cn)
						}
						ln[e] = i
					}
					return ln[e]
				}
				function Nn(e) {
					return s.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : !1
				}
				var n = e.document,
				r = e.navigator,
				i = e.location,
				s = function () {
					function H() {
						if (i.isReady)
							return;
						try {
							n.documentElement.doScroll("left")
						} catch (e) {
							setTimeout(H, 1);
							return
						}
						i.ready()
					}
					var i = function (e, t) {
						return new i.fn.init(e, t, u)
					},
					s = e.jQuery,
					o = e.$,
					u,
					a = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
					f = /\S/,
					l = /^\s+/,
					c = /\s+$/,
					h = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
					p = /^[\],:{}\s]*$/,
					d = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
					v = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
					m = /(?:^|:|,)(?:\s*\[)+/g,
					g = /(webkit)[ \/]([\w.]+)/,
					y = /(opera)(?:.*version)?[ \/]([\w.]+)/,
					b = /(msie) ([\w.]+)/,
					w = /(mozilla)(?:.*? rv:([\w.]+))?/,
					E = /-([a-z]|[0-9])/ig,
					S = /^-ms-/,
					x = function (e, t) {
						return (t + "").toUpperCase()
					},
					T = r.userAgent,
					N,
					C,
					k,
					L = Object.prototype.toString,
					A = Object.prototype.hasOwnProperty,
					O = Array.prototype.push,
					M = Array.prototype.slice,
					_ = String.prototype.trim,
					D = Array.prototype.indexOf,
					P = {};
					return i.fn = i.prototype = {
						constructor : i,
						init : function (e, r, s) {
							var o,
							u,
							f,
							l;
							if (!e)
								return this;
							if (e.nodeType)
								return this.context = this[0] = e, this.length = 1, this;
							if (e === "body" && !r && n.body)
								return this.context = n, this[0] = n.body, this.selector = e, this.length = 1, this;
							if (typeof e == "string") {
								e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3 ? o = [null, e, null] : o = a.exec(e);
								if (o && (o[1] || !r)) {
									if (o[1])
										return r = r instanceof i ? r[0] : r, l = r ? r.ownerDocument || r : n, f = h.exec(e), f ? i.isPlainObject(r) ? (e = [n.createElement(f[1])], i.fn.attr.call(e, r, !0)) : e = [l.createElement(f[1])] : (f = i.buildFragment([o[1]], [l]), e = (f.cacheable ? i.clone(f.fragment) : f.fragment).childNodes), i.merge(this, e);
									u = n.getElementById(o[2]);
									if (u && u.parentNode) {
										if (u.id !== o[2])
											return s.find(e);
										this.length = 1,
										this[0] = u
									}
									return this.context = n,
									this.selector = e,
									this
								}
								return !r || r.jquery ? (r || s).find(e) : this.constructor(r).find(e)
							}
							return i.isFunction(e) ? s.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), i.makeArray(e, this))
						},
						selector : "",
						jquery : "1.7.2",
						length : 0,
						size : function () {
							return this.length
						},
						toArray : function () {
							return M.call(this, 0)
						},
						get : function (e) {
							return e == null ? this.toArray() : e < 0 ? this[this.length + e] : this[e]
						},
						pushStack : function (e, t, n) {
							var r = this.constructor();
							return i.isArray(e) ? O.apply(r, e) : i.merge(r, e),
							r.prevObject = this,
							r.context = this.context,
							t === "find" ? r.selector = this.selector + (this.selector ? " " : "") + n : t && (r.selector = this.selector + "." + t + "(" + n + ")"),
							r
						},
						each : function (e, t) {
							return i.each(this, e, t)
						},
						ready : function (e) {
							return i.bindReady(),
							C.add(e),
							this
						},
						eq : function (e) {
							return e = +e,
							e === -1 ? this.slice(e) : this.slice(e, e + 1)
						},
						first : function () {
							return this.eq(0)
						},
						last : function () {
							return this.eq(-1)
						},
						slice : function () {
							return this.pushStack(M.apply(this, arguments), "slice", M.call(arguments).join(","))
						},
						map : function (e) {
							return this.pushStack(i.map(this, function (t, n) {
									return e.call(t, n, t)
								}))
						},
						end : function () {
							return this.prevObject || this.constructor(null)
						},
						push : O,
						sort : [].sort,
						splice : [].splice
					},
					i.fn.init.prototype = i.fn,
					i.extend = i.fn.extend = function () {
						var e,
						n,
						r,
						s,
						o,
						u,
						a = arguments[0] || {},
						f = 1,
						l = arguments.length,
						c = !1;
						typeof a == "boolean" && (c = a, a = arguments[1] || {}, f = 2),
						typeof a != "object" && !i.isFunction(a) && (a = {}),
						l === f && (a = this, --f);
						for (; f < l; f++)
							if ((e = arguments[f]) != null)
								for (n in e) {
									r = a[n],
									s = e[n];
									if (a === s)
										continue;
									c && s && (i.isPlainObject(s) || (o = i.isArray(s))) ? (o ? (o = !1, u = r && i.isArray(r) ? r : []) : u = r && i.isPlainObject(r) ? r : {}, a[n] = i.extend(c, u, s)) : s !== t && (a[n] = s)
								}
						return a
					},
					i.extend({
						noConflict : function (t) {
							return e.$ === i && (e.$ = o),
							t && e.jQuery === i && (e.jQuery = s),
							i
						},
						isReady : !1,
						readyWait : 1,
						holdReady : function (e) {
							e ? i.readyWait++ : i.ready(!0)
						},
						ready : function (e) {
							if (e === !0 && !--i.readyWait || e !== !0 && !i.isReady) {
								if (!n.body)
									return setTimeout(i.ready, 1);
								i.isReady = !0;
								if (e !== !0 && --i.readyWait > 0)
									return;
								C.fireWith(n, [i]),
								i.fn.trigger && i(n).trigger("ready").off("ready")
							}
						},
						bindReady : function () {
							if (C)
								return;
							C = i.Callbacks("once memory");
							if (n.readyState === "complete")
								return setTimeout(i.ready, 1);
							if (n.addEventListener)
								n.addEventListener("DOMContentLoaded", k, !1), e.addEventListener("load", i.ready, !1);
							else if (n.attachEvent) {
								n.attachEvent("onreadystatechange", k),
								e.attachEvent("onload", i.ready);
								var t = !1;
								try {
									t = e.frameElement == null
								} catch (r) {}

								n.documentElement.doScroll && t && H()
							}
						},
						isFunction : function (e) {
							return i.type(e) === "function"
						},
						isArray : Array.isArray || function (e) {
							return i.type(e) === "array"
						},
						isWindow : function (e) {
							return e != null && e == e.window
						},
						isNumeric : function (e) {
							return !isNaN(parseFloat(e)) && isFinite(e)
						},
						type : function (e) {
							return e == null ? String(e) : P[L.call(e)] || "object"
						},
						isPlainObject : function (e) {
							if (!e || i.type(e) !== "object" || e.nodeType || i.isWindow(e))
								return !1;
							try {
								if (e.constructor && !A.call(e, "constructor") && !A.call(e.constructor.prototype, "isPrototypeOf"))
									return !1
							} catch (n) {
								return !1
							}
							var r;
							for (r in e);
							return r === t || A.call(e, r)
						},
						isEmptyObject : function (e) {
							for (var t in e)
								return !1;
							return !0
						},
						error : function (e) {
							throw new Error(e)
						},
						parseJSON : function (t) {
							if (typeof t != "string" || !t)
								return null;
							t = i.trim(t);
							if (e.JSON && e.JSON.parse)
								return e.JSON.parse(t);
							if (p.test(t.replace(d, "@").replace(v, "]").replace(m, "")))
								return (new Function("return " + t))();
							i.error("Invalid JSON: " + t)
						},
						parseXML : function (n) {
							if (typeof n != "string" || !n)
								return null;
							var r,
							s;
							try {
								e.DOMParser ? (s = new DOMParser, r = s.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
							} catch (o) {
								r = t
							}
							return (!r || !r.documentElement || r.getElementsByTagName("parsererror").length) && i.error("Invalid XML: " + n),
							r
						},
						noop : function () {},
						globalEval : function (t) {
							t && f.test(t) && (e.execScript || function (t) {
								e.eval.call(e, t)
							})(t)
						},
						camelCase : function (e) {
							return e.replace(S, "ms-").replace(E, x)
						},
						nodeName : function (e, t) {
							return e.nodeName && e.nodeName.toUpperCase() === t.toUpperCase()
						},
						each : function (e, n, r) {
							var s,
							o = 0,
							u = e.length,
							a = u === t || i.isFunction(e);
							if (r) {
								if (a) {
									for (s in e)
										if (n.apply(e[s], r) === !1)
											break
								} else
									for (; o < u; )
										if (n.apply(e[o++], r) === !1)
											break
							} else if (a) {
								for (s in e)
									if (n.call(e[s], s, e[s]) === !1)
										break
							} else
								for (; o < u; )
									if (n.call(e[o], o, e[o++]) === !1)
										break;
							return e
						},
						trim : _ ? function (e) {
							return e == null ? "" : _.call(e)
						}
						 : function (e) {
							return e == null ? "" : e.toString().replace(l, "").replace(c, "")
						},
						makeArray : function (e, t) {
							var n = t || [];
							if (e != null) {
								var r = i.type(e);
								e.length == null || r === "string" || r === "function" || r === "regexp" || i.isWindow(e) ? O.call(n, e) : i.merge(n, e)
							}
							return n
						},
						inArray : function (e, t, n) {
							var r;
							if (t) {
								if (D)
									return D.call(t, e, n);
								r = t.length,
								n = n ? n < 0 ? Math.max(0, r + n) : n : 0;
								for (; n < r; n++)
									if (n in t && t[n] === e)
										return n
							}
							return -1
						},
						merge : function (e, n) {
							var r = e.length,
							i = 0;
							if (typeof n.length == "number")
								for (var s = n.length; i < s; i++)
									e[r++] = n[i];
							else
								while (n[i] !== t)
									e[r++] = n[i++];
							return e.length = r,
							e
						},
						grep : function (e, t, n) {
							var r = [],
							i;
							n = !!n;
							for (var s = 0, o = e.length; s < o; s++)
								i = !!t(e[s], s), n !== i && r.push(e[s]);
							return r
						},
						map : function (e, n, r) {
							var s,
							o,
							u = [],
							a = 0,
							f = e.length,
							l = e instanceof i || f !== t && typeof f == "number" && (f > 0 && e[0] && e[f - 1] || f === 0 || i.isArray(e));
							if (l)
								for (; a < f; a++)
									s = n(e[a], a, r), s != null && (u[u.length] = s);
							else
								for (o in e)
									s = n(e[o], o, r), s != null && (u[u.length] = s);
							return u.concat.apply([], u)
						},
						guid : 1,
						proxy : function (e, n) {
							if (typeof n == "string") {
								var r = e[n];
								n = e,
								e = r
							}
							if (!i.isFunction(e))
								return t;
							var s = M.call(arguments, 2),
							o = function () {
								return e.apply(n, s.concat(M.call(arguments)))
							};
							return o.guid = e.guid = e.guid || o.guid || i.guid++,
							o
						},
						access : function (e, n, r, s, o, u, a) {
							var f,
							l = r == null,
							c = 0,
							h = e.length;
							if (r && typeof r == "object") {
								for (c in r)
									i.access(e, n, c, r[c], 1, u, s);
								o = 1
							} else if (s !== t) {
								f = a === t && i.isFunction(s),
								l && (f ? (f = n, n = function (e, t, n) {
										return f.call(i(e), n)
									}) : (n.call(e, s), n = null));
								if (n)
									for (; c < h; c++)
										n(e[c], r, f ? s.call(e[c], c, n(e[c], r)) : s, a);
								o = 1
							}
							return o ? e : l ? n.call(e) : h ? n(e[0], r) : u
						},
						now : function () {
							return (new Date).getTime()
						},
						uaMatch : function (e) {
							e = e.toLowerCase();
							var t = g.exec(e) || y.exec(e) || b.exec(e) || e.indexOf("compatible") < 0 && w.exec(e) || [];
							return {
								browser : t[1] || "",
								version : t[2] || "0"
							}
						},
						sub : function () {
							function e(t, n) {
								return new e.fn.init(t, n)
							}
							i.extend(!0, e, this),
							e.superclass = this,
							e.fn = e.prototype = this(),
							e.fn.constructor = e,
							e.sub = this.sub,
							e.fn.init = function (r, s) {
								return s && s instanceof i && !(s instanceof e) && (s = e(s)),
								i.fn.init.call(this, r, s, t)
							},
							e.fn.init.prototype = e.fn;
							var t = e(n);
							return e
						},
						browser : {}

					}),
					i.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (e, t) {
						P["[object " + t + "]"] = t.toLowerCase()
					}),
					N = i.uaMatch(T),
					N.browser && (i.browser[N.browser] = !0, i.browser.version = N.version),
					i.browser.webkit && (i.browser.safari = !0),
					f.test(" ") && (l = /^[\s\xA0]+/, c = /[\s\xA0]+$/),
					u = i(n),
					n.addEventListener ? k = function () {
						n.removeEventListener("DOMContentLoaded", k, !1),
						i.ready()
					}
					 : n.attachEvent && (k = function () {
						n.readyState === "complete" && (n.detachEvent("onreadystatechange", k), i.ready())
					}),
					i
				}
				(),
				o = {};
				s.Callbacks = function (e) {
					e = e ? o[e] || u(e) : {};
					var n = [],
					r = [],
					i,
					a,
					f,
					l,
					c,
					h,
					p = function (t) {
						var r,
						i,
						o,
						u,
						a;
						for (r = 0, i = t.length; r < i; r++)
							o = t[r], u = s.type(o), u === "array" ? p(o) : u === "function" && (!e.unique || !v.has(o)) && n.push(o)
					},
					d = function (t, s) {
						s = s || [],
						i = !e.memory || [t, s],
						a = !0,
						f = !0,
						h = l || 0,
						l = 0,
						c = n.length;
						for (; n && h < c; h++)
							if (n[h].apply(t, s) === !1 && e.stopOnFalse) {
								i = !0;
								break
							}
						f = !1,
						n && (e.once ? i === !0 ? v.disable() : n = [] : r && r.length && (i = r.shift(), v.fireWith(i[0], i[1])))
					},
					v = {
						add : function () {
							if (n) {
								var e = n.length;
								p(arguments),
								f ? c = n.length : i && i !== !0 && (l = e, d(i[0], i[1]))
							}
							return this
						},
						remove : function () {
							if (n) {
								var t = arguments,
								r = 0,
								i = t.length;
								for (; r < i; r++)
									for (var s = 0; s < n.length; s++)
										if (t[r] === n[s]) {
											f && s <= c && (c--, s <= h && h--),
											n.splice(s--, 1);
											if (e.unique)
												break
										}
							}
							return this
						},
						has : function (e) {
							if (n) {
								var t = 0,
								r = n.length;
								for (; t < r; t++)
									if (e === n[t])
										return !0
							}
							return !1
						},
						empty : function () {
							return n = [],
							this
						},
						disable : function () {
							return n = r = i = t,
							this
						},
						disabled : function () {
							return !n
						},
						lock : function () {
							return r = t,
							(!i || i === !0) && v.disable(),
							this
						},
						locked : function () {
							return !r
						},
						fireWith : function (t, n) {
							return r && (f ? e.once || r.push([t, n]) : (!e.once || !i) && d(t, n)),
							this
						},
						fire : function () {
							return v.fireWith(this, arguments),
							this
						},
						fired : function () {
							return !!a
						}
					};
					return v
				};
				var a = [].slice;
				s.extend({
					Deferred : function (e) {
						var t = s.Callbacks("once memory"),
						n = s.Callbacks("once memory"),
						r = s.Callbacks("memory"),
						i = "pending",
						o = {
							resolve : t,
							reject : n,
							notify : r
						},
						u = {
							done : t.add,
							fail : n.add,
							progress : r.add,
							state : function () {
								return i
							},
							isResolved : t.fired,
							isRejected : n.fired,
							then : function (e, t, n) {
								return a.done(e).fail(t).progress(n),
								this
							},
							always : function () {
								return a.done.apply(a, arguments).fail.apply(a, arguments),
								this
							},
							pipe : function (e, t, n) {
								return s.Deferred(function (r) {
									s.each({
										done : [e, "resolve"],
										fail : [t, "reject"],
										progress : [n, "notify"]
									}, function (e, t) {
										var n = t[0],
										i = t[1],
										o;
										s.isFunction(n) ? a[e](function () {
											o = n.apply(this, arguments),
											o && s.isFunction(o.promise) ? o.promise().then(r.resolve, r.reject, r.notify) : r[i + "With"](this === a ? r : this, [o])
										}) : a[e](r[i])
									})
								}).promise()
							},
							promise : function (e) {
								if (e == null)
									e = u;
								else
									for (var t in u)
										e[t] = u[t];
								return e
							}
						},
						a = u.promise({}),
						f;
						for (f in o)
							a[f] = o[f].fire, a[f + "With"] = o[f].fireWith;
						return a.done(function () {
							i = "resolved"
						}, n.disable, r.lock).fail(function () {
							i = "rejected"
						}, t.disable, r.lock),
						e && e.call(a, a),
						a
					},
					when : function (e) {
						function c(e) {
							return function (n) {
								t[e] = arguments.length > 1 ? a.call(arguments, 0) : n,
								--o || f.resolveWith(f, t)
							}
						}
						function h(e) {
							return function (t) {
								i[e] = arguments.length > 1 ? a.call(arguments, 0) : t,
								f.notifyWith(l, i)
							}
						}
						var t = a.call(arguments, 0),
						n = 0,
						r = t.length,
						i = new Array(r),
						o = r,
						u = r,
						f = r <= 1 && e && s.isFunction(e.promise) ? e : s.Deferred(),
						l = f.promise();
						if (r > 1) {
							for (; n < r; n++)
								t[n] && t[n].promise && s.isFunction(t[n].promise) ? t[n].promise().then(c(n), f.reject, h(n)) : --o;
							o || f.resolveWith(f, t)
						} else
							f !== e && f.resolveWith(f, r ? [e] : []);
						return l
					}
				}),
				s.support = function () {
					var t,
					r,
					i,
					o,
					u,
					a,
					f,
					l,
					c,
					h,
					p,
					d,
					v = n.createElement("div"),
					m = n.documentElement;
					v.setAttribute("className", "t"),
					v.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",
					r = v.getElementsByTagName("*"),
					i = v.getElementsByTagName("a")[0];
					if (!r || !r.length || !i)
						return {};
					o = n.createElement("select"),
					u = o.appendChild(n.createElement("option")),
					a = v.getElementsByTagName("input")[0],
					t = {
						leadingWhitespace : v.firstChild.nodeType === 3,
						tbody : !v.getElementsByTagName("tbody").length,
						htmlSerialize : !!v.getElementsByTagName("link").length,
						style : /top/.test(i.getAttribute("style")),
						hrefNormalized : i.getAttribute("href") === "/a",
						opacity : /^0.55/.test(i.style.opacity),
						cssFloat : !!i.style.cssFloat,
						checkOn : a.value === "on",
						optSelected : u.selected,
						getSetAttribute : v.className !== "t",
						enctype : !!n.createElement("form").enctype,
						html5Clone : n.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
						submitBubbles : !0,
						changeBubbles : !0,
						focusinBubbles : !1,
						deleteExpando : !0,
						noCloneEvent : !0,
						inlineBlockNeedsLayout : !1,
						shrinkWrapBlocks : !1,
						reliableMarginRight : !0,
						pixelMargin : !0
					},
					s.boxModel = t.boxModel = n.compatMode === "CSS1Compat",
					a.checked = !0,
					t.noCloneChecked = a.cloneNode(!0).checked,
					o.disabled = !0,
					t.optDisabled = !u.disabled;
					try {
						delete v.test
					} catch (g) {
						t.deleteExpando = !1
					}
					!v.addEventListener && v.attachEvent && v.fireEvent && (v.attachEvent("onclick", function () {
							t.noCloneEvent = !1
						}), v.cloneNode(!0).fireEvent("onclick")),
					a = n.createElement("input"),
					a.value = "t",
					a.setAttribute("type", "radio"),
					t.radioValue = a.value === "t",
					a.setAttribute("checked", "checked"),
					a.setAttribute("name", "t"),
					v.appendChild(a),
					f = n.createDocumentFragment(),
					f.appendChild(v.lastChild),
					t.checkClone = f.cloneNode(!0).cloneNode(!0).lastChild.checked,
					t.appendChecked = a.checked,
					f.removeChild(a),
					f.appendChild(v);
					if (v.attachEvent)
						for (p in {
							submit : 1,
							change : 1,
							focusin : 1
						})
							h = "on" + p, d = h in v, d || (v.setAttribute(h, "return;"), d = typeof v[h] == "function"), t[p + "Bubbles"] = d;
					return f.removeChild(v),
					f = o = u = v = a = null,
					s(function () {
						var r,
						i,
						o,
						u,
						a,
						f,
						c,
						h,
						p,
						m,
						g,
						y,
						b,
						w = n.getElementsByTagName("body")[0];
						if (!w)
							return;
						h = 1,
						b = "padding:0;margin:0;border:",
						g = "position:absolute;top:0;left:0;width:1px;height:1px;",
						y = b + "0;visibility:hidden;",
						p = "style='" + g + b + "5px solid #000;",
						m = "<div " + p + "display:block;'><div style='" + b + "0;display:block;overflow:hidden;'></div></div>" + "<table " + p + "' cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>",
						r = n.createElement("div"),
						r.style.cssText = y + "width:0;height:0;position:static;top:0;margin-top:" + h + "px",
						w.insertBefore(r, w.firstChild),
						v = n.createElement("div"),
						r.appendChild(v),
						v.innerHTML = "<table><tr><td style='" + b + "0;display:none'></td><td>t</td></tr></table>",
						l = v.getElementsByTagName("td"),
						d = l[0].offsetHeight === 0,
						l[0].style.display = "",
						l[1].style.display = "none",
						t.reliableHiddenOffsets = d && l[0].offsetHeight === 0,
						e.getComputedStyle && (v.innerHTML = "", c = n.createElement("div"), c.style.width = "0", c.style.marginRight = "0", v.style.width = "2px", v.appendChild(c), t.reliableMarginRight = (parseInt((e.getComputedStyle(c, null) || {
										marginRight : 0
									}).marginRight, 10) || 0) === 0),
						typeof v.style.zoom != "undefined" && (v.innerHTML = "", v.style.width = v.style.padding = "1px", v.style.border = 0, v.style.overflow = "hidden", v.style.display = "inline", v.style.zoom = 1, t.inlineBlockNeedsLayout = v.offsetWidth === 3, v.style.display = "block", v.style.overflow = "visible", v.innerHTML = "<div style='width:5px;'></div>", t.shrinkWrapBlocks = v.offsetWidth !== 3),
						v.style.cssText = g + y,
						v.innerHTML = m,
						i = v.firstChild,
						o = i.firstChild,
						a = i.nextSibling.firstChild.firstChild,
						f = {
							doesNotAddBorder : o.offsetTop !== 5,
							doesAddBorderForTableAndCells : a.offsetTop === 5
						},
						o.style.position = "fixed",
						o.style.top = "20px",
						f.fixedPosition = o.offsetTop === 20 || o.offsetTop === 15,
						o.style.position = o.style.top = "",
						i.style.overflow = "hidden",
						i.style.position = "relative",
						f.subtractsBorderForOverflowNotVisible = o.offsetTop === -5,
						f.doesNotIncludeMarginInBodyOffset = w.offsetTop !== h,
						e.getComputedStyle && (v.style.marginTop = "1%", t.pixelMargin = (e.getComputedStyle(v, null) || {
								marginTop : 0
							}).marginTop !== "1%"),
						typeof r.style.zoom != "undefined" && (r.style.zoom = 1),
						w.removeChild(r),
						c = v = r = null,
						s.extend(t, f)
					}),
					t
				}
				();
				var f = /^(?:\{.*\}|\[.*\])$/,
				l = /([A-Z])/g;
				s.extend({
					cache : {},
					uuid : 0,
					expando : "jQuery" + (s.fn.jquery + Math.random()).replace(/\D/g, ""),
					noData : {
						embed : !0,
						object : "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
						applet : !0
					},
					hasData : function (e) {
						return e = e.nodeType ? s.cache[e[s.expando]] : e[s.expando],
						!!e && !h(e)
					},
					data : function (e, n, r, i) {
						if (!s.acceptData(e))
							return;
						var o,
						u,
						a,
						f = s.expando,
						l = typeof n == "string",
						c = e.nodeType,
						h = c ? s.cache : e,
						p = c ? e[f] : e[f] && f,
						d = n === "events";
						if ((!p || !h[p] || !d && !i && !h[p].data) && l && r === t)
							return;
						p || (c ? e[f] = p = ++s.uuid : p = f),
						h[p] || (h[p] = {}, c || (h[p].toJSON = s.noop));
						if (typeof n == "object" || typeof n == "function")
							i ? h[p] = s.extend(h[p], n) : h[p].data = s.extend(h[p].data, n);
						return o = u = h[p],
						i || (u.data || (u.data = {}), u = u.data),
						r !== t && (u[s.camelCase(n)] = r),
						d && !u[n] ? o.events : (l ? (a = u[n], a == null && (a = u[s.camelCase(n)])) : a = u, a)
					},
					removeData : function (e, t, n) {
						if (!s.acceptData(e))
							return;
						var r,
						i,
						o,
						u = s.expando,
						a = e.nodeType,
						f = a ? s.cache : e,
						l = a ? e[u] : u;
						if (!f[l])
							return;
						if (t) {
							r = n ? f[l] : f[l].data;
							if (r) {
								s.isArray(t) || (t in r ? t = [t] : (t = s.camelCase(t), t in r ? t = [t] : t = t.split(" ")));
								for (i = 0, o = t.length; i < o; i++)
									delete r[t[i]];
								if (!(n ? h : s.isEmptyObject)(r))
									return
							}
						}
						if (!n) {
							delete f[l].data;
							if (!h(f[l]))
								return
						}
						s.support.deleteExpando || !f.setInterval ? delete f[l] : f[l] = null,
						a && (s.support.deleteExpando ? delete e[u] : e.removeAttribute ? e.removeAttribute(u) : e[u] = null)
					},
					_data : function (e, t, n) {
						return s.data(e, t, n, !0)
					},
					acceptData : function (e) {
						if (e.nodeName) {
							var t = s.noData[e.nodeName.toLowerCase()];
							if (t)
								return t !== !0 && e.getAttribute("classid") === t
						}
						return !0
					}
				}),
				s.fn.extend({
					data : function (e, n) {
						var r,
						i,
						o,
						u,
						a,
						f = this[0],
						l = 0,
						h = null;
						if (e === t) {
							if (this.length) {
								h = s.data(f);
								if (f.nodeType === 1 && !s._data(f, "parsedAttrs")) {
									o = f.attributes;
									for (a = o.length; l < a; l++)
										u = o[l].name, u.indexOf("data-") === 0 && (u = s.camelCase(u.substring(5)), c(f, u, h[u]));
									s._data(f, "parsedAttrs", !0)
								}
							}
							return h
						}
						return typeof e == "object" ? this.each(function () {
							s.data(this, e)
						}) : (r = e.split(".", 2), r[1] = r[1] ? "." + r[1] : "", i = r[1] + "!", s.access(this, function (n) {
								if (n === t)
									return h = this.triggerHandler("getData" + i, [r[0]]), h === t && f && (h = s.data(f, e), h = c(f, e, h)), h === t && r[1] ? this.data(r[0]) : h;
								r[1] = n,
								this.each(function () {
									var t = s(this);
									t.triggerHandler("setData" + i, r),
									s.data(this, e, n),
									t.triggerHandler("changeData" + i, r)
								})
							}, null, n, arguments.length > 1, null, !1))
					},
					removeData : function (e) {
						return this.each(function () {
							s.removeData(this, e)
						})
					}
				}),
				s.extend({
					_mark : function (e, t) {
						e && (t = (t || "fx") + "mark", s._data(e, t, (s._data(e, t) || 0) + 1))
					},
					_unmark : function (e, t, n) {
						e !== !0 && (n = t, t = e, e = !1);
						if (t) {
							n = n || "fx";
							var r = n + "mark",
							i = e ? 0 : (s._data(t, r) || 1) - 1;
							i ? s._data(t, r, i) : (s.removeData(t, r, !0), p(t, n, "mark"))
						}
					},
					queue : function (e, t, n) {
						var r;
						if (e)
							return t = (t || "fx") + "queue", r = s._data(e, t), n && (!r || s.isArray(n) ? r = s._data(e, t, s.makeArray(n)) : r.push(n)), r || []
					},
					dequeue : function (e, t) {
						t = t || "fx";
						var n = s.queue(e, t),
						r = n.shift(),
						i = {};
						r === "inprogress" && (r = n.shift()),
						r && (t === "fx" && n.unshift("inprogress"), s._data(e, t + ".run", i), r.call(e, function () {
								s.dequeue(e, t)
							}, i)),
						n.length || (s.removeData(e, t + "queue " + t + ".run", !0), p(e, t, "queue"))
					}
				}),
				s.fn.extend({
					queue : function (e, n) {
						var r = 2;
						return typeof e != "string" && (n = e, e = "fx", r--),
						arguments.length < r ? s.queue(this[0], e) : n === t ? this : this.each(function () {
							var t = s.queue(this, e, n);
							e === "fx" && t[0] !== "inprogress" && s.dequeue(this, e)
						})
					},
					dequeue : function (e) {
						return this.each(function () {
							s.dequeue(this, e)
						})
					},
					delay : function (e, t) {
						return e = s.fx ? s.fx.speeds[e] || e : e,
						t = t || "fx",
						this.queue(t, function (t, n) {
							var r = setTimeout(t, e);
							n.stop = function () {
								clearTimeout(r)
							}
						})
					},
					clearQueue : function (e) {
						return this.queue(e || "fx", [])
					},
					promise : function (e, n) {
						function h() {
							--u || r.resolveWith(i, [i])
						}
						typeof e != "string" && (n = e, e = t),
						e = e || "fx";
						var r = s.Deferred(),
						i = this,
						o = i.length,
						u = 1,
						a = e + "defer",
						f = e + "queue",
						l = e + "mark",
						c;
						while (o--)
							if (c = s.data(i[o], a, t, !0) || (s.data(i[o], f, t, !0) || s.data(i[o], l, t, !0)) && s.data(i[o], a, s.Callbacks("once memory"), !0))
								u++, c.add(h);
						return h(),
						r.promise(n)
					}
				});
				var d = /[\n\t\r]/g,
				v = /\s+/,
				m = /\r/g,
				g = /^(?:button|input)$/i,
				y = /^(?:button|input|object|select|textarea)$/i,
				b = /^a(?:rea)?$/i,
				w = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
				E = s.support.getSetAttribute,
				S,
				x,
				T;
				s.fn.extend({
					attr : function (e, t) {
						return s.access(this, s.attr, e, t, arguments.length > 1)
					},
					removeAttr : function (e) {
						return this.each(function () {
							s.removeAttr(this, e)
						})
					},
					prop : function (e, t) {
						return s.access(this, s.prop, e, t, arguments.length > 1)
					},
					removeProp : function (e) {
						return e = s.propFix[e] || e,
						this.each(function () {
							try {
								this[e] = t,
								delete this[e]
							} catch (n) {}

						})
					},
					addClass : function (e) {
						var t,
						n,
						r,
						i,
						o,
						u,
						a;
						if (s.isFunction(e))
							return this.each(function (t) {
								s(this).addClass(e.call(this, t, this.className))
							});
						if (e && typeof e == "string") {
							t = e.split(v);
							for (n = 0, r = this.length; n < r; n++) {
								i = this[n];
								if (i.nodeType === 1)
									if (!i.className && t.length === 1)
										i.className = e;
									else {
										o = " " + i.className + " ";
										for (u = 0, a = t.length; u < a; u++)
											~o.indexOf(" " + t[u] + " ") || (o += t[u] + " ");
										i.className = s.trim(o)
									}
							}
						}
						return this
					},
					removeClass : function (e) {
						var n,
						r,
						i,
						o,
						u,
						a,
						f;
						if (s.isFunction(e))
							return this.each(function (t) {
								s(this).removeClass(e.call(this, t, this.className))
							});
						if (e && typeof e == "string" || e === t) {
							n = (e || "").split(v);
							for (r = 0, i = this.length; r < i; r++) {
								o = this[r];
								if (o.nodeType === 1 && o.className)
									if (e) {
										u = (" " + o.className + " ").replace(d, " ");
										for (a = 0, f = n.length; a < f; a++)
											u = u.replace(" " + n[a] + " ", " ");
										o.className = s.trim(u)
									} else
										o.className = ""
							}
						}
						return this
					},
					toggleClass : function (e, t) {
						var n = typeof e,
						r = typeof t == "boolean";
						return s.isFunction(e) ? this.each(function (n) {
							s(this).toggleClass(e.call(this, n, this.className, t), t)
						}) : this.each(function () {
							if (n === "string") {
								var i,
								o = 0,
								u = s(this),
								a = t,
								f = e.split(v);
								while (i = f[o++])
									a = r ? a : !u.hasClass(i), u[a ? "addClass" : "removeClass"](i)
							} else if (n === "undefined" || n === "boolean")
								this.className && s._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : s._data(this, "__className__") || ""
						})
					},
					hasClass : function (e) {
						var t = " " + e + " ",
						n = 0,
						r = this.length;
						for (; n < r; n++)
							if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(d, " ").indexOf(t) > -1)
								return !0;
						return !1
					},
					val : function (e) {
						var n,
						r,
						i,
						o = this[0];
						if (!arguments.length) {
							if (o)
								return n = s.valHooks[o.type] || s.valHooks[o.nodeName.toLowerCase()], n && "get" in n && (r = n.get(o, "value")) !== t ? r : (r = o.value, typeof r == "string" ? r.replace(m, "") : r == null ? "" : r);
							return
						}
						return i = s.isFunction(e),
						this.each(function (r) {
							var o = s(this),
							u;
							if (this.nodeType !== 1)
								return;
							i ? u = e.call(this, r, o.val()) : u = e,
							u == null ? u = "" : typeof u == "number" ? u += "" : s.isArray(u) && (u = s.map(u, function (e) {
											return e == null ? "" : e + ""
										})),
							n = s.valHooks[this.type] || s.valHooks[this.nodeName.toLowerCase()];
							if (!n || !("set" in n) || n.set(this, u, "value") === t)
								this.value = u
						})
					}
				}),
				s.extend({
					valHooks : {
						option : {
							get : function (e) {
								var t = e.attributes.value;
								return !t || t.specified ? e.value : e.text
							}
						},
						select : {
							get : function (e) {
								var t,
								n,
								r,
								i,
								o = e.selectedIndex,
								u = [],
								a = e.options,
								f = e.type === "select-one";
								if (o < 0)
									return null;
								n = f ? o : 0,
								r = f ? o + 1 : a.length;
								for (; n < r; n++) {
									i = a[n];
									if (i.selected && (s.support.optDisabled ? !i.disabled : i.getAttribute("disabled") === null) && (!i.parentNode.disabled || !s.nodeName(i.parentNode, "optgroup"))) {
										t = s(i).val();
										if (f)
											return t;
										u.push(t)
									}
								}
								return f && !u.length && a.length ? s(a[o]).val() : u
							},
							set : function (e, t) {
								var n = s.makeArray(t);
								return s(e).find("option").each(function () {
									this.selected = s.inArray(s(this).val(), n) >= 0
								}),
								n.length || (e.selectedIndex = -1),
								n
							}
						}
					},
					attrFn : {
						val : !0,
						css : !0,
						html : !0,
						text : !0,
						data : !0,
						width : !0,
						height : !0,
						offset : !0
					},
					attr : function (e, n, r, i) {
						var o,
						u,
						a,
						f = e.nodeType;
						if (!e || f === 3 || f === 8 || f === 2)
							return;
						if (i && n in s.attrFn)
							return s(e)[n](r);
						if (typeof e.getAttribute == "undefined")
							return s.prop(e, n, r);
						a = f !== 1 || !s.isXMLDoc(e),
						a && (n = n.toLowerCase(), u = s.attrHooks[n] || (w.test(n) ? x : S));
						if (r !== t) {
							if (r === null) {
								s.removeAttr(e, n);
								return
							}
							return u && "set" in u && a && (o = u.set(e, r, n)) !== t ? o : (e.setAttribute(n, "" + r), r)
						}
						return u && "get" in u && a && (o = u.get(e, n)) !== null ? o : (o = e.getAttribute(n), o === null ? t : o)
					},
					removeAttr : function (e, t) {
						var n,
						r,
						i,
						o,
						u,
						a = 0;
						if (t && e.nodeType === 1) {
							r = t.toLowerCase().split(v),
							o = r.length;
							for (; a < o; a++)
								i = r[a], i && (n = s.propFix[i] || i, u = w.test(i), u || s.attr(e, i, ""), e.removeAttribute(E ? i : n), u && n in e && (e[n] = !1))
						}
					},
					attrHooks : {
						type : {
							set : function (e, t) {
								if (g.test(e.nodeName) && e.parentNode)
									s.error("type property can't be changed");
								else if (!s.support.radioValue && t === "radio" && s.nodeName(e, "input")) {
									var n = e.value;
									return e.setAttribute("type", t),
									n && (e.value = n),
									t
								}
							}
						},
						value : {
							get : function (e, t) {
								return S && s.nodeName(e, "button") ? S.get(e, t) : t in e ? e.value : null
							},
							set : function (e, t, n) {
								if (S && s.nodeName(e, "button"))
									return S.set(e, t, n);
								e.value = t
							}
						}
					},
					propFix : {
						tabindex : "tabIndex",
						readonly : "readOnly",
						"for" : "htmlFor",
						"class" : "className",
						maxlength : "maxLength",
						cellspacing : "cellSpacing",
						cellpadding : "cellPadding",
						rowspan : "rowSpan",
						colspan : "colSpan",
						usemap : "useMap",
						frameborder : "frameBorder",
						contenteditable : "contentEditable"
					},
					prop : function (e, n, r) {
						var i,
						o,
						u,
						a = e.nodeType;
						if (!e || a === 3 || a === 8 || a === 2)
							return;
						return u = a !== 1 || !s.isXMLDoc(e),
						u && (n = s.propFix[n] || n, o = s.propHooks[n]),
						r !== t ? o && "set" in o && (i = o.set(e, r, n)) !== t ? i : e[n] = r : o && "get" in o && (i = o.get(e, n)) !== null ? i : e[n]
					},
					propHooks : {
						tabIndex : {
							get : function (e) {
								var n = e.getAttributeNode("tabindex");
								return n && n.specified ? parseInt(n.value, 10) : y.test(e.nodeName) || b.test(e.nodeName) && e.href ? 0 : t
							}
						}
					}
				}),
				s.attrHooks.tabindex = s.propHooks.tabIndex,
				x = {
					get : function (e, n) {
						var r,
						i = s.prop(e, n);
						return i === !0 || typeof i != "boolean" && (r = e.getAttributeNode(n)) && r.nodeValue !== !1 ? n.toLowerCase() : t
					},
					set : function (e, t, n) {
						var r;
						return t === !1 ? s.removeAttr(e, n) : (r = s.propFix[n] || n, r in e && (e[r] = !0), e.setAttribute(n, n.toLowerCase())),
						n
					}
				},
				E || (T = {
						name : !0,
						id : !0,
						coords : !0
					}, S = s.valHooks.button = {
						get : function (e, n) {
							var r;
							return r = e.getAttributeNode(n),
							r && (T[n] ? r.nodeValue !== "" : r.specified) ? r.nodeValue : t
						},
						set : function (e, t, r) {
							var i = e.getAttributeNode(r);
							return i || (i = n.createAttribute(r), e.setAttributeNode(i)),
							i.nodeValue = t + ""
						}
					}, s.attrHooks.tabindex.set = S.set, s.each(["width", "height"], function (e, t) {
						s.attrHooks[t] = s.extend(s.attrHooks[t], {
								set : function (e, n) {
									if (n === "")
										return e.setAttribute(t, "auto"), n
								}
							})
					}), s.attrHooks.contenteditable = {
						get : S.get,
						set : function (e, t, n) {
							t === "" && (t = "false"),
							S.set(e, t, n)
						}
					}),
				s.support.hrefNormalized || s.each(["href", "src", "width", "height"], function (e, n) {
					s.attrHooks[n] = s.extend(s.attrHooks[n], {
							get : function (e) {
								var r = e.getAttribute(n, 2);
								return r === null ? t : r
							}
						})
				}),
				s.support.style || (s.attrHooks.style = {
						get : function (e) {
							return e.style.cssText.toLowerCase() || t
						},
						set : function (e, t) {
							return e.style.cssText = "" + t
						}
					}),
				s.support.optSelected || (s.propHooks.selected = s.extend(s.propHooks.selected, {
							get : function (e) {
								var t = e.parentNode;
								return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex),
								null
							}
						})),
				s.support.enctype || (s.propFix.enctype = "encoding"),
				s.support.checkOn || s.each(["radio", "checkbox"], function () {
					s.valHooks[this] = {
						get : function (e) {
							return e.getAttribute("value") === null ? "on" : e.value
						}
					}
				}),
				s.each(["radio", "checkbox"], function () {
					s.valHooks[this] = s.extend(s.valHooks[this], {
							set : function (e, t) {
								if (s.isArray(t))
									return e.checked = s.inArray(s(e).val(), t) >= 0
							}
						})
				});
				var N = /^(?:textarea|input|select)$/i,
				C = /^([^\.]*)?(?:\.(.+))?$/,
				k = /(?:^|\s)hover(\.\S+)?\b/,
				L = /^key/,
				A = /^(?:mouse|contextmenu)|click/,
				O = /^(?:focusinfocus|focusoutblur)$/,
				M = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
				_ = function (e) {
					var t = M.exec(e);
					return t && (t[1] = (t[1] || "").toLowerCase(), t[3] = t[3] && new RegExp("(?:^|\\s)" + t[3] + "(?:\\s|$)")),
					t
				},
				D = function (e, t) {
					var n = e.attributes || {};
					return (!t[1] || e.nodeName.toLowerCase() === t[1]) && (!t[2] || (n.id || {}).value === t[2]) && (!t[3] || t[3].test((n["class"] || {}).value))
				},
				P = function (e) {
					return s.event.special.hover ? e : e.replace(k, "mouseenter$1 mouseleave$1")
				};
				s.event = {
					add : function (e, n, r, i, o) {
						var u,
						a,
						f,
						l,
						c,
						h,
						p,
						d,
						v,
						m,
						g,
						y;
						if (e.nodeType === 3 || e.nodeType === 8 || !n || !r || !(u = s._data(e)))
							return;
						r.handler && (v = r, r = v.handler, o = v.selector),
						r.guid || (r.guid = s.guid++),
						f = u.events,
						f || (u.events = f = {}),
						a = u.handle,
						a || (u.handle = a = function (e) {
							return typeof s == "undefined" || !!e && s.event.triggered === e.type ? t : s.event.dispatch.apply(a.elem, arguments)
						}, a.elem = e),
						n = s.trim(P(n)).split(" ");
						for (l = 0; l < n.length; l++) {
							c = C.exec(n[l]) || [],
							h = c[1],
							p = (c[2] || "").split(".").sort(),
							y = s.event.special[h] || {},
							h = (o ? y.delegateType : y.bindType) || h,
							y = s.event.special[h] || {},
							d = s.extend({
									type : h,
									origType : c[1],
									data : i,
									handler : r,
									guid : r.guid,
									selector : o,
									quick : o && _(o),
									namespace : p.join(".")
								}, v),
							g = f[h];
							if (!g) {
								g = f[h] = [],
								g.delegateCount = 0;
								if (!y.setup || y.setup.call(e, i, p, a) === !1)
									e.addEventListener ? e.addEventListener(h, a, !1) : e.attachEvent && e.attachEvent("on" + h, a)
							}
							y.add && (y.add.call(e, d), d.handler.guid || (d.handler.guid = r.guid)),
							o ? g.splice(g.delegateCount++, 0, d) : g.push(d),
							s.event.global[h] = !0
						}
						e = null
					},
					global : {},
					remove : function (e, t, n, r, i) {
						var o = s.hasData(e) && s._data(e),
						u,
						a,
						f,
						l,
						c,
						h,
						p,
						d,
						v,
						m,
						g,
						y;
						if (!o || !(d = o.events))
							return;
						t = s.trim(P(t || "")).split(" ");
						for (u = 0; u < t.length; u++) {
							a = C.exec(t[u]) || [],
							f = l = a[1],
							c = a[2];
							if (!f) {
								for (f in d)
									s.event.remove(e, f + t[u], n, r, !0);
								continue
							}
							v = s.event.special[f] || {},
							f = (r ? v.delegateType : v.bindType) || f,
							g = d[f] || [],
							h = g.length,
							c = c ? new RegExp("(^|\\.)" + c.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
							for (p = 0; p < g.length; p++)
								y = g[p], (i || l === y.origType) && (!n || n.guid === y.guid) && (!c || c.test(y.namespace)) && (!r || r === y.selector || r === "**" && y.selector) && (g.splice(p--, 1), y.selector && g.delegateCount--, v.remove && v.remove.call(e, y));
							g.length === 0 && h !== g.length && ((!v.teardown || v.teardown.call(e, c) === !1) && s.removeEvent(e, f, o.handle), delete d[f])
						}
						s.isEmptyObject(d) && (m = o.handle, m && (m.elem = null), s.removeData(e, ["events", "handle"], !0))
					},
					customEvent : {
						getData : !0,
						setData : !0,
						changeData : !0
					},
					trigger : function (n, r, i, o) {
						if (!i || i.nodeType !== 3 && i.nodeType !== 8) {
							var u = n.type || n,
							a = [],
							f,
							l,
							c,
							h,
							p,
							d,
							v,
							m,
							g,
							y;
							if (O.test(u + s.event.triggered))
								return;
							u.indexOf("!") >= 0 && (u = u.slice(0, -1), l = !0),
							u.indexOf(".") >= 0 && (a = u.split("."), u = a.shift(), a.sort());
							if ((!i || s.event.customEvent[u]) && !s.event.global[u])
								return;
							n = typeof n == "object" ? n[s.expando] ? n : new s.Event(u, n) : new s.Event(u),
							n.type = u,
							n.isTrigger = !0,
							n.exclusive = l,
							n.namespace = a.join("."),
							n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + a.join("\\.(?:.*\\.)?") + "(\\.|$)") : null,
							d = u.indexOf(":") < 0 ? "on" + u : "";
							if (!i) {
								f = s.cache;
								for (c in f)
									f[c].events && f[c].events[u] && s.event.trigger(n, r, f[c].handle.elem, !0);
								return
							}
							n.result = t,
							n.target || (n.target = i),
							r = r != null ? s.makeArray(r) : [],
							r.unshift(n),
							v = s.event.special[u] || {};
							if (v.trigger && v.trigger.apply(i, r) === !1)
								return;
							g = [[i, v.bindType || u]];
							if (!o && !v.noBubble && !s.isWindow(i)) {
								y = v.delegateType || u,
								h = O.test(y + u) ? i : i.parentNode,
								p = null;
								for (; h; h = h.parentNode)
									g.push([h, y]), p = h;
								p && p === i.ownerDocument && g.push([p.defaultView || p.parentWindow || e, y])
							}
							for (c = 0; c < g.length && !n.isPropagationStopped(); c++)
								h = g[c][0], n.type = g[c][1], m = (s._data(h, "events") || {})[n.type] && s._data(h, "handle"), m && m.apply(h, r), m = d && h[d], m && s.acceptData(h) && m.apply(h, r) === !1 && n.preventDefault();
							return n.type = u,
							!o && !n.isDefaultPrevented() && (!v._default || v._default.apply(i.ownerDocument, r) === !1) && (u !== "click" || !s.nodeName(i, "a")) && s.acceptData(i) && d && i[u] && (u !== "focus" && u !== "blur" || n.target.offsetWidth !== 0) && !s.isWindow(i) && (p = i[d], p && (i[d] = null), s.event.triggered = u, i[u](), s.event.triggered = t, p && (i[d] = p)),
							n.result
						}
						return
					},
					dispatch : function (n) {
						n = s.event.fix(n || e.event);
						var r = (s._data(this, "events") || {})[n.type] || [],
						i = r.delegateCount,
						o = [].slice.call(arguments, 0),
						u = !n.exclusive && !n.namespace,
						a = s.event.special[n.type] || {},
						f = [],
						l,
						c,
						h,
						p,
						d,
						v,
						m,
						g,
						y,
						b,
						w;
						o[0] = n,
						n.delegateTarget = this;
						if (a.preDispatch && a.preDispatch.call(this, n) === !1)
							return;
						if (i && (!n.button || n.type !== "click")) {
							p = s(this),
							p.context = this.ownerDocument || this;
							for (h = n.target; h != this; h = h.parentNode || this)
								if (h.disabled !== !0) {
									v = {},
									g = [],
									p[0] = h;
									for (l = 0; l < i; l++)
										y = r[l], b = y.selector, v[b] === t && (v[b] = y.quick ? D(h, y.quick) : p.is(b)), v[b] && g.push(y);
									g.length && f.push({
										elem : h,
										matches : g
									})
								}
						}
						r.length > i && f.push({
							elem : this,
							matches : r.slice(i)
						});
						for (l = 0; l < f.length && !n.isPropagationStopped(); l++) {
							m = f[l],
							n.currentTarget = m.elem;
							for (c = 0; c < m.matches.length && !n.isImmediatePropagationStopped(); c++) {
								y = m.matches[c];
								if (u || !n.namespace && !y.namespace || n.namespace_re && n.namespace_re.test(y.namespace))
									n.data = y.data, n.handleObj = y, d = ((s.event.special[y.origType] || {}).handle || y.handler).apply(m.elem, o), d !== t && (n.result = d, d === !1 && (n.preventDefault(), n.stopPropagation()))
							}
						}
						return a.postDispatch && a.postDispatch.call(this, n),
						n.result
					},
					props : "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
					fixHooks : {},
					keyHooks : {
						props : "char charCode key keyCode".split(" "),
						filter : function (e, t) {
							return e.which == null && (e.which = t.charCode != null ? t.charCode : t.keyCode),
							e
						}
					},
					mouseHooks : {
						props : "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
						filter : function (e, r) {
							var i,
							s,
							o,
							u = r.button,
							a = r.fromElement;
							return e.pageX == null && r.clientX != null && (i = e.target.ownerDocument || n, s = i.documentElement, o = i.body, e.pageX = r.clientX + (s && s.scrollLeft || o && o.scrollLeft || 0) - (s && s.clientLeft || o && o.clientLeft || 0), e.pageY = r.clientY + (s && s.scrollTop || o && o.scrollTop || 0) - (s && s.clientTop || o && o.clientTop || 0)),
							!e.relatedTarget && a && (e.relatedTarget = a === e.target ? r.toElement : a),
							!e.which && u !== t && (e.which = u & 1 ? 1 : u & 2 ? 3 : u & 4 ? 2 : 0),
							e
						}
					},
					fix : function (e) {
						if (e[s.expando])
							return e;
						var r,
						i,
						o = e,
						u = s.event.fixHooks[e.type] || {},
						a = u.props ? this.props.concat(u.props) : this.props;
						e = s.Event(o);
						for (r = a.length; r; )
							i = a[--r], e[i] = o[i];
						return e.target || (e.target = o.srcElement || n),
						e.target.nodeType === 3 && (e.target = e.target.parentNode),
						e.metaKey === t && (e.metaKey = e.ctrlKey),
						u.filter ? u.filter(e, o) : e
					},
					special : {
						ready : {
							setup : s.bindReady
						},
						load : {
							noBubble : !0
						},
						focus : {
							delegateType : "focusin"
						},
						blur : {
							delegateType : "focusout"
						},
						beforeunload : {
							setup : function (e, t, n) {
								s.isWindow(this) && (this.onbeforeunload = n)
							},
							teardown : function (e, t) {
								this.onbeforeunload === t && (this.onbeforeunload = null)
							}
						}
					},
					simulate : function (e, t, n, r) {
						var i = s.extend(new s.Event, n, {
								type : e,
								isSimulated : !0,
								originalEvent : {}

							});
						r ? s.event.trigger(i, null, t) : s.event.dispatch.call(t, i),
						i.isDefaultPrevented() && n.preventDefault()
					}
				},
				s.event.handle = s.event.dispatch,
				s.removeEvent = n.removeEventListener ? function (e, t, n) {
					e.removeEventListener && e.removeEventListener(t, n, !1)
				}
				 : function (e, t, n) {
					e.detachEvent && e.detachEvent("on" + t, n)
				},
				s.Event = function (e, t) {
					if (!(this instanceof s.Event))
						return new s.Event(e, t);
					e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? B : H) : this.type = e,
					t && s.extend(this, t),
					this.timeStamp = e && e.timeStamp || s.now(),
					this[s.expando] = !0
				},
				s.Event.prototype = {
					preventDefault : function () {
						this.isDefaultPrevented = B;
						var e = this.originalEvent;
						if (!e)
							return;
						e.preventDefault ? e.preventDefault() : e.returnValue = !1
					},
					stopPropagation : function () {
						this.isPropagationStopped = B;
						var e = this.originalEvent;
						if (!e)
							return;
						e.stopPropagation && e.stopPropagation(),
						e.cancelBubble = !0
					},
					stopImmediatePropagation : function () {
						this.isImmediatePropagationStopped = B,
						this.stopPropagation()
					},
					isDefaultPrevented : H,
					isPropagationStopped : H,
					isImmediatePropagationStopped : H
				},
				s.each({
					mouseenter : "mouseover",
					mouseleave : "mouseout"
				}, function (e, t) {
					s.event.special[e] = {
						delegateType : t,
						bindType : t,
						handle : function (e) {
							var n = this,
							r = e.relatedTarget,
							i = e.handleObj,
							o = i.selector,
							u;
							if (!r || r !== n && !s.contains(n, r))
								e.type = i.origType, u = i.handler.apply(this, arguments), e.type = t;
							return u
						}
					}
				}),
				s.support.submitBubbles || (s.event.special.submit = {
						setup : function () {
							if (s.nodeName(this, "form"))
								return !1;
							s.event.add(this, "click._submit keypress._submit", function (e) {
								var n = e.target,
								r = s.nodeName(n, "input") || s.nodeName(n, "button") ? n.form : t;
								r && !r._submit_attached && (s.event.add(r, "submit._submit", function (e) {
										e._submit_bubble = !0
									}), r._submit_attached = !0)
							})
						},
						postDispatch : function (e) {
							e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && s.event.simulate("submit", this.parentNode, e, !0))
						},
						teardown : function () {
							if (s.nodeName(this, "form"))
								return !1;
							s.event.remove(this, "._submit")
						}
					}),
				s.support.changeBubbles || (s.event.special.change = {
						setup : function () {
							if (N.test(this.nodeName)) {
								if (this.type === "checkbox" || this.type === "radio")
									s.event.add(this, "propertychange._change", function (e) {
										e.originalEvent.propertyName === "checked" && (this._just_changed = !0)
									}), s.event.add(this, "click._change", function (e) {
										this._just_changed && !e.isTrigger && (this._just_changed = !1, s.event.simulate("change", this, e, !0))
									});
								return !1
							}
							s.event.add(this, "beforeactivate._change", function (e) {
								var t = e.target;
								N.test(t.nodeName) && !t._change_attached && (s.event.add(t, "change._change", function (e) {
										this.parentNode && !e.isSimulated && !e.isTrigger && s.event.simulate("change", this.parentNode, e, !0)
									}), t._change_attached = !0)
							})
						},
						handle : function (e) {
							var t = e.target;
							if (this !== t || e.isSimulated || e.isTrigger || t.type !== "radio" && t.type !== "checkbox")
								return e.handleObj.handler.apply(this, arguments)
						},
						teardown : function () {
							return s.event.remove(this, "._change"),
							N.test(this.nodeName)
						}
					}),
				s.support.focusinBubbles || s.each({
					focus : "focusin",
					blur : "focusout"
				}, function (e, t) {
					var r = 0,
					i = function (e) {
						s.event.simulate(t, e.target, s.event.fix(e), !0)
					};
					s.event.special[t] = {
						setup : function () {
							r++ === 0 && n.addEventListener(e, i, !0)
						},
						teardown : function () {
							--r === 0 && n.removeEventListener(e, i, !0)
						}
					}
				}),
				s.fn.extend({
					on : function (e, n, r, i, o) {
						var u,
						a;
						if (typeof e == "object") {
							typeof n != "string" && (r = r || n, n = t);
							for (a in e)
								this.on(a, n, r, e[a], o);
							return this
						}
						r == null && i == null ? (i = n, r = n = t) : i == null && (typeof n == "string" ? (i = r, r = t) : (i = r, r = n, n = t));
						if (i === !1)
							i = H;
						else if (!i)
							return this;
						return o === 1 && (u = i, i = function (e) {
							return s().off(e),
							u.apply(this, arguments)
						}, i.guid = u.guid || (u.guid = s.guid++)),
						this.each(function () {
							s.event.add(this, e, i, r, n)
						})
					},
					one : function (e, t, n, r) {
						return this.on(e, t, n, r, 1)
					},
					off : function (e, n, r) {
						if (e && e.preventDefault && e.handleObj) {
							var i = e.handleObj;
							return s(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler),
							this
						}
						if (typeof e == "object") {
							for (var o in e)
								this.off(o, n, e[o]);
							return this
						}
						if (n === !1 || typeof n == "function")
							r = n, n = t;
						return r === !1 && (r = H),
						this.each(function () {
							s.event.remove(this, e, r, n)
						})
					},
					bind : function (e, t, n) {
						return this.on(e, null, t, n)
					},
					unbind : function (e, t) {
						return this.off(e, null, t)
					},
					live : function (e, t, n) {
						return s(this.context).on(e, this.selector, t, n),
						this
					},
					die : function (e, t) {
						return s(this.context).off(e, this.selector || "**", t),
						this
					},
					delegate : function (e, t, n, r) {
						return this.on(t, e, n, r)
					},
					undelegate : function (e, t, n) {
						return arguments.length == 1 ? this.off(e, "**") : this.off(t, e, n)
					},
					trigger : function (e, t) {
						return this.each(function () {
							s.event.trigger(e, t, this)
						})
					},
					triggerHandler : function (e, t) {
						if (this[0])
							return s.event.trigger(e, t, this[0], !0)
					},
					toggle : function (e) {
						var t = arguments,
						n = e.guid || s.guid++,
						r = 0,
						i = function (n) {
							var i = (s._data(this, "lastToggle" + e.guid) || 0) % r;
							return s._data(this, "lastToggle" + e.guid, i + 1),
							n.preventDefault(),
							t[i].apply(this, arguments) || !1
						};
						i.guid = n;
						while (r < t.length)
							t[r++].guid = n;
						return this.click(i)
					},
					hover : function (e, t) {
						return this.mouseenter(e).mouseleave(t || e)
					}
				}),
				s.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t) {
					s.fn[t] = function (e, n) {
						return n == null && (n = e, e = null),
						arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
					},
					s.attrFn && (s.attrFn[t] = !0),
					L.test(t) && (s.event.fixHooks[t] = s.event.keyHooks),
					A.test(t) && (s.event.fixHooks[t] = s.event.mouseHooks)
				}),
				function () {
					function S(e, t, n, i, s, o) {
						for (var u = 0, a = i.length; u < a; u++) {
							var f = i[u];
							if (f) {
								var l = !1;
								f = f[e];
								while (f) {
									if (f[r] === n) {
										l = i[f.sizset];
										break
									}
									f.nodeType === 1 && !o && (f[r] = n, f.sizset = u);
									if (f.nodeName.toLowerCase() === t) {
										l = f;
										break
									}
									f = f[e]
								}
								i[u] = l
							}
						}
					}
					function x(e, t, n, i, s, o) {
						for (var u = 0, a = i.length; u < a; u++) {
							var f = i[u];
							if (f) {
								var l = !1;
								f = f[e];
								while (f) {
									if (f[r] === n) {
										l = i[f.sizset];
										break
									}
									if (f.nodeType === 1) {
										o || (f[r] = n, f.sizset = u);
										if (typeof t != "string") {
											if (f === t) {
												l = !0;
												break
											}
										} else if (h.filter(t, [f]).length > 0) {
											l = f;
											break
										}
									}
									f = f[e]
								}
								i[u] = l
							}
						}
					}
					var e = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
					r = "sizcache" + (Math.random() + "").replace(".", ""),
					i = 0,
					o = Object.prototype.toString,
					u = !1,
					a = !0,
					f = /\\/g,
					l = /\r\n/g,
					c = /\W/;
					[0, 0].sort(function () {
						return a = !1,
						0
					});
					var h = function (t, r, i, s) {
						i = i || [],
						r = r || n;
						var u = r;
						if (r.nodeType !== 1 && r.nodeType !== 9)
							return [];
						if (!t || typeof t != "string")
							return i;
						var a,
						f,
						l,
						c,
						p,
						m,
						g,
						b,
						w = !0,
						E = h.isXML(r),
						S = [],
						x = t;
						do {
							e.exec(""),
							a = e.exec(x);
							if (a) {
								x = a[3],
								S.push(a[1]);
								if (a[2]) {
									c = a[3];
									break
								}
							}
						} while (a);
						if (S.length > 1 && v.exec(t))
							if (S.length === 2 && d.relative[S[0]])
								f = T(S[0] + S[1], r, s);
							else {
								f = d.relative[S[0]] ? [r] : h(S.shift(), r);
								while (S.length)
									t = S.shift(), d.relative[t] && (t += S.shift()), f = T(t, f, s)
							}
						else {
							!s && S.length > 1 && r.nodeType === 9 && !E && d.match.ID.test(S[0]) && !d.match.ID.test(S[S.length - 1]) && (p = h.find(S.shift(), r, E), r = p.expr ? h.filter(p.expr, p.set)[0] : p.set[0]);
							if (r) {
								p = s ? {
									expr : S.pop(),
									set : y(s)
								}
								 : h.find(S.pop(), S.length !== 1 || S[0] !== "~" && S[0] !== "+" || !r.parentNode ? r : r.parentNode, E),
								f = p.expr ? h.filter(p.expr, p.set) : p.set,
								S.length > 0 ? l = y(f) : w = !1;
								while (S.length)
									m = S.pop(), g = m, d.relative[m] ? g = S.pop() : m = "", g == null && (g = r), d.relative[m](l, g, E)
							} else
								l = S = []
						}
						l || (l = f),
						l || h.error(m || t);
						if (o.call(l) === "[object Array]")
							if (!w)
								i.push.apply(i, l);
							else if (r && r.nodeType === 1)
								for (b = 0; l[b] != null; b++)
									l[b] && (l[b] === !0 || l[b].nodeType === 1 && h.contains(r, l[b])) && i.push(f[b]);
							else
								for (b = 0; l[b] != null; b++)
									l[b] && l[b].nodeType === 1 && i.push(f[b]);
						else
							y(l, i);
						return c && (h(c, u, i, s), h.uniqueSort(i)),
						i
					};
					h.uniqueSort = function (e) {
						if (w) {
							u = a,
							e.sort(w);
							if (u)
								for (var t = 1; t < e.length; t++)
									e[t] === e[t - 1] && e.splice(t--, 1)
						}
						return e
					},
					h.matches = function (e, t) {
						return h(e, null, null, t)
					},
					h.matchesSelector = function (e, t) {
						return h(t, null, null, [e]).length > 0
					},
					h.find = function (e, t, n) {
						var r,
						i,
						s,
						o,
						u,
						a;
						if (!e)
							return [];
						for (i = 0, s = d.order.length; i < s; i++) {
							u = d.order[i];
							if (o = d.leftMatch[u].exec(e)) {
								a = o[1],
								o.splice(1, 1);
								if (a.substr(a.length - 1) !== "\\") {
									o[1] = (o[1] || "").replace(f, ""),
									r = d.find[u](o, t, n);
									if (r != null) {
										e = e.replace(d.match[u], "");
										break
									}
								}
							}
						}
						return r || (r = typeof t.getElementsByTagName != "undefined" ? t.getElementsByTagName("*") : []), {
							set : r,
							expr : e
						}
					},
					h.filter = function (e, n, r, i) {
						var s,
						o,
						u,
						a,
						f,
						l,
						c,
						p,
						v,
						m = e,
						g = [],
						y = n,
						b = n && n[0] && h.isXML(n[0]);
						while (e && n.length) {
							for (u in d.filter)
								if ((s = d.leftMatch[u].exec(e)) != null && s[2]) {
									l = d.filter[u],
									c = s[1],
									o = !1,
									s.splice(1, 1);
									if (c.substr(c.length - 1) === "\\")
										continue;
									y === g && (g = []);
									if (d.preFilter[u]) {
										s = d.preFilter[u](s, y, r, g, i, b);
										if (!s)
											o = a = !0;
										else if (s === !0)
											continue
									}
									if (s)
										for (p = 0; (f = y[p]) != null; p++)
											f && (a = l(f, s, p, y), v = i^a, r && a != null ? v ? o = !0 : y[p] = !1 : v && (g.push(f), o = !0));
									if (a !== t) {
										r || (y = g),
										e = e.replace(d.match[u], "");
										if (!o)
											return [];
										break
									}
								}
							if (e === m) {
								if (o != null)
									break;
								h.error(e)
							}
							m = e
						}
						return y
					},
					h.error = function (e) {
						throw new Error("Syntax error, unrecognized expression: " + e)
					};
					var p = h.getText = function (e) {
						var t,
						n,
						r = e.nodeType,
						i = "";
						if (r) {
							if (r === 1 || r === 9 || r === 11) {
								if (typeof e.textContent == "string")
									return e.textContent;
								if (typeof e.innerText == "string")
									return e.innerText.replace(l, "");
								for (e = e.firstChild; e; e = e.nextSibling)
									i += p(e)
							} else if (r === 3 || r === 4)
								return e.nodeValue
						} else
							for (t = 0; n = e[t]; t++)
								n.nodeType !== 8 && (i += p(n));
						return i
					},
					d = h.selectors = {
						order : ["ID", "NAME", "TAG"],
						match : {
							ID : /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
							CLASS : /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
							NAME : /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
							ATTR : /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
							TAG : /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
							CHILD : /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
							POS : /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
							PSEUDO : /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
						},
						leftMatch : {},
						attrMap : {
							"class" : "className",
							"for" : "htmlFor"
						},
						attrHandle : {
							href : function (e) {
								return e.getAttribute("href")
							},
							type : function (e) {
								return e.getAttribute("type")
							}
						},
						relative : {
							"+" : function (e, t) {
								var n = typeof t == "string",
								r = n && !c.test(t),
								i = n && !r;
								r && (t = t.toLowerCase());
								for (var s = 0, o = e.length, u; s < o; s++)
									if (u = e[s]) {
										while ((u = u.previousSibling) && u.nodeType !== 1);
										e[s] = i || u && u.nodeName.toLowerCase() === t ? u || !1 : u === t
									}
								i && h.filter(t, e, !0)
							},
							">" : function (e, t) {
								var n,
								r = typeof t == "string",
								i = 0,
								s = e.length;
								if (r && !c.test(t)) {
									t = t.toLowerCase();
									for (; i < s; i++) {
										n = e[i];
										if (n) {
											var o = n.parentNode;
											e[i] = o.nodeName.toLowerCase() === t ? o : !1
										}
									}
								} else {
									for (; i < s; i++)
										n = e[i], n && (e[i] = r ? n.parentNode : n.parentNode === t);
									r && h.filter(t, e, !0)
								}
							},
							"" : function (e, t, n) {
								var r,
								s = i++,
								o = x;
								typeof t == "string" && !c.test(t) && (t = t.toLowerCase(), r = t, o = S),
								o("parentNode", t, s, e, r, n)
							},
							"~" : function (e, t, n) {
								var r,
								s = i++,
								o = x;
								typeof t == "string" && !c.test(t) && (t = t.toLowerCase(), r = t, o = S),
								o("previousSibling", t, s, e, r, n)
							}
						},
						find : {
							ID : function (e, t, n) {
								if (typeof t.getElementById != "undefined" && !n) {
									var r = t.getElementById(e[1]);
									return r && r.parentNode ? [r] : []
								}
							},
							NAME : function (e, t) {
								if (typeof t.getElementsByName != "undefined") {
									var n = [],
									r = t.getElementsByName(e[1]);
									for (var i = 0, s = r.length; i < s; i++)
										r[i].getAttribute("name") === e[1] && n.push(r[i]);
									return n.length === 0 ? null : n
								}
							},
							TAG : function (e, t) {
								if (typeof t.getElementsByTagName != "undefined")
									return t.getElementsByTagName(e[1])
							}
						},
						preFilter : {
							CLASS : function (e, t, n, r, i, s) {
								e = " " + e[1].replace(f, "") + " ";
								if (s)
									return e;
								for (var o = 0, u; (u = t[o]) != null; o++)
									u && (i^(u.className && (" " + u.className + " ").replace(/[\t\n\r]/g, " ").indexOf(e) >= 0) ? n || r.push(u) : n && (t[o] = !1));
								return !1
							},
							ID : function (e) {
								return e[1].replace(f, "")
							},
							TAG : function (e, t) {
								return e[1].replace(f, "").toLowerCase()
							},
							CHILD : function (e) {
								if (e[1] === "nth") {
									e[2] || h.error(e[0]),
									e[2] = e[2].replace(/^\+|\s*/g, "");
									var t = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(e[2] === "even" && "2n" || e[2] === "odd" && "2n+1" || !/\D/.test(e[2]) && "0n+" + e[2] || e[2]);
									e[2] = t[1] + (t[2] || 1) - 0,
									e[3] = t[3] - 0
								} else
									e[2] && h.error(e[0]);
								return e[0] = i++,
								e
							},
							ATTR : function (e, t, n, r, i, s) {
								var o = e[1] = e[1].replace(f, "");
								return !s && d.attrMap[o] && (e[1] = d.attrMap[o]),
								e[4] = (e[4] || e[5] || "").replace(f, ""),
								e[2] === "~=" && (e[4] = " " + e[4] + " "),
								e
							},
							PSEUDO : function (t, n, r, i, s) {
								if (t[1] === "not") {
									if (!((e.exec(t[3]) || "").length > 1 || /^\w/.test(t[3]))) {
										var o = h.filter(t[3], n, r, !0^s);
										return r || i.push.apply(i, o),
										!1
									}
									t[3] = h(t[3], null, null, n)
								} else if (d.match.POS.test(t[0]) || d.match.CHILD.test(t[0]))
									return !0;
								return t
							},
							POS : function (e) {
								return e.unshift(!0),
								e
							}
						},
						filters : {
							enabled : function (e) {
								return e.disabled === !1 && e.type !== "hidden"
							},
							disabled : function (e) {
								return e.disabled === !0
							},
							checked : function (e) {
								return e.checked === !0
							},
							selected : function (e) {
								return e.parentNode && e.parentNode.selectedIndex,
								e.selected === !0
							},
							parent : function (e) {
								return !!e.firstChild
							},
							empty : function (e) {
								return !e.firstChild
							},
							has : function (e, t, n) {
								return !!h(n[3], e).length
							},
							header : function (e) {
								return /h\d/i.test(e.nodeName)
							},
							text : function (e) {
								var t = e.getAttribute("type"),
								n = e.type;
								return e.nodeName.toLowerCase() === "input" && "text" === n && (t === n || t === null)
							},
							radio : function (e) {
								return e.nodeName.toLowerCase() === "input" && "radio" === e.type
							},
							checkbox : function (e) {
								return e.nodeName.toLowerCase() === "input" && "checkbox" === e.type
							},
							file : function (e) {
								return e.nodeName.toLowerCase() === "input" && "file" === e.type
							},
							password : function (e) {
								return e.nodeName.toLowerCase() === "input" && "password" === e.type
							},
							submit : function (e) {
								var t = e.nodeName.toLowerCase();
								return (t === "input" || t === "button") && "submit" === e.type
							},
							image : function (e) {
								return e.nodeName.toLowerCase() === "input" && "image" === e.type
							},
							reset : function (e) {
								var t = e.nodeName.toLowerCase();
								return (t === "input" || t === "button") && "reset" === e.type
							},
							button : function (e) {
								var t = e.nodeName.toLowerCase();
								return t === "input" && "button" === e.type || t === "button"
							},
							input : function (e) {
								return /input|select|textarea|button/i.test(e.nodeName)
							},
							focus : function (e) {
								return e === e.ownerDocument.activeElement
							}
						},
						setFilters : {
							first : function (e, t) {
								return t === 0
							},
							last : function (e, t, n, r) {
								return t === r.length - 1
							},
							even : function (e, t) {
								return t % 2 === 0
							},
							odd : function (e, t) {
								return t % 2 === 1
							},
							lt : function (e, t, n) {
								return t < n[3] - 0
							},
							gt : function (e, t, n) {
								return t > n[3] - 0
							},
							nth : function (e, t, n) {
								return n[3] - 0 === t
							},
							eq : function (e, t, n) {
								return n[3] - 0 === t
							}
						},
						filter : {
							PSEUDO : function (e, t, n, r) {
								var i = t[1],
								s = d.filters[i];
								if (s)
									return s(e, n, t, r);
								if (i === "contains")
									return (e.textContent || e.innerText || p([e]) || "").indexOf(t[3]) >= 0;
								if (i === "not") {
									var o = t[3];
									for (var u = 0, a = o.length; u < a; u++)
										if (o[u] === e)
											return !1;
									return !0
								}
								h.error(i)
							},
							CHILD : function (e, t) {
								var n,
								i,
								s,
								o,
								u,
								a,
								f,
								l = t[1],
								c = e;
								switch (l) {
								case "only":
								case "first":
									while (c = c.previousSibling)
										if (c.nodeType === 1)
											return !1;
									if (l === "first")
										return !0;
									c = e;
								case "last":
									while (c = c.nextSibling)
										if (c.nodeType === 1)
											return !1;
									return !0;
								case "nth":
									n = t[2],
									i = t[3];
									if (n === 1 && i === 0)
										return !0;
									s = t[0],
									o = e.parentNode;
									if (o && (o[r] !== s || !e.nodeIndex)) {
										a = 0;
										for (c = o.firstChild; c; c = c.nextSibling)
											c.nodeType === 1 && (c.nodeIndex = ++a);
										o[r] = s
									}
									return f = e.nodeIndex - i,
									n === 0 ? f === 0 : f % n === 0 && f / n >= 0
								}
							},
							ID : function (e, t) {
								return e.nodeType === 1 && e.getAttribute("id") === t
							},
							TAG : function (e, t) {
								return t === "*" && e.nodeType === 1 || !!e.nodeName && e.nodeName.toLowerCase() === t
							},
							CLASS : function (e, t) {
								return (" " + (e.className || e.getAttribute("class")) + " ").indexOf(t) > -1
							},
							ATTR : function (e, t) {
								var n = t[1],
								r = h.attr ? h.attr(e, n) : d.attrHandle[n] ? d.attrHandle[n](e) : e[n] != null ? e[n] : e.getAttribute(n),
								i = r + "",
								s = t[2],
								o = t[4];
								return r == null ? s === "!=" : !s && h.attr ? r != null : s === "=" ? i === o : s === "*=" ? i.indexOf(o) >= 0 : s === "~=" ? (" " + i + " ").indexOf(o) >= 0 : o ? s === "!=" ? i !== o : s === "^=" ? i.indexOf(o) === 0 : s === "$=" ? i.substr(i.length - o.length) === o : s === "|=" ? i === o || i.substr(0, o.length + 1) === o + "-" : !1 : i && r !== !1
							},
							POS : function (e, t, n, r) {
								var i = t[2],
								s = d.setFilters[i];
								if (s)
									return s(e, n, t, r)
							}
						}
					},
					v = d.match.POS,
					m = function (e, t) {
						return "\\" + (t - 0 + 1)
					};
					for (var g in d.match)
						d.match[g] = new RegExp(d.match[g].source + /(?![^\[]*\])(?![^\(]*\))/.source), d.leftMatch[g] = new RegExp(/(^(?:.|\r|\n)*?)/.source + d.match[g].source.replace(/\\(\d+)/g, m));
					d.match.globalPOS = v;
					var y = function (e, t) {
						return e = Array.prototype.slice.call(e, 0),
						t ? (t.push.apply(t, e), t) : e
					};
					try {
						Array.prototype.slice.call(n.documentElement.childNodes, 0)[0].nodeType
					} catch (b) {
						y = function (e, t) {
							var n = 0,
							r = t || [];
							if (o.call(e) === "[object Array]")
								Array.prototype.push.apply(r, e);
							else if (typeof e.length == "number")
								for (var i = e.length; n < i; n++)
									r.push(e[n]);
							else
								for (; e[n]; n++)
									r.push(e[n]);
							return r
						}
					}
					var w,
					E;
					n.documentElement.compareDocumentPosition ? w = function (e, t) {
						return e === t ? (u = !0, 0) : !e.compareDocumentPosition || !t.compareDocumentPosition ? e.compareDocumentPosition ? -1 : 1 : e.compareDocumentPosition(t) & 4 ? -1 : 1
					}
					 : (w = function (e, t) {
						if (e === t)
							return u = !0, 0;
						if (e.sourceIndex && t.sourceIndex)
							return e.sourceIndex - t.sourceIndex;
						var n,
						r,
						i = [],
						s = [],
						o = e.parentNode,
						a = t.parentNode,
						f = o;
						if (o === a)
							return E(e, t);
						if (!o)
							return -1;
						if (!a)
							return 1;
						while (f)
							i.unshift(f), f = f.parentNode;
						f = a;
						while (f)
							s.unshift(f), f = f.parentNode;
						n = i.length,
						r = s.length;
						for (var l = 0; l < n && l < r; l++)
							if (i[l] !== s[l])
								return E(i[l], s[l]);
						return l === n ? E(e, s[l], -1) : E(i[l], t, 1)
					}, E = function (e, t, n) {
						if (e === t)
							return n;
						var r = e.nextSibling;
						while (r) {
							if (r === t)
								return -1;
							r = r.nextSibling
						}
						return 1
					}),
					function () {
						var e = n.createElement("div"),
						r = "script" + (new Date).getTime(),
						i = n.documentElement;
						e.innerHTML = "<a name='" + r + "'/>",
						i.insertBefore(e, i.firstChild),
						n.getElementById(r) && (d.find.ID = function (e, n, r) {
							if (typeof n.getElementById != "undefined" && !r) {
								var i = n.getElementById(e[1]);
								return i ? i.id === e[1] || typeof i.getAttributeNode != "undefined" && i.getAttributeNode("id").nodeValue === e[1] ? [i] : t : []
							}
						}, d.filter.ID = function (e, t) {
							var n = typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id");
							return e.nodeType === 1 && n && n.nodeValue === t
						}),
						i.removeChild(e),
						i = e = null
					}
					(),
					function () {
						var e = n.createElement("div");
						e.appendChild(n.createComment("")),
						e.getElementsByTagName("*").length > 0 && (d.find.TAG = function (e, t) {
							var n = t.getElementsByTagName(e[1]);
							if (e[1] === "*") {
								var r = [];
								for (var i = 0; n[i]; i++)
									n[i].nodeType === 1 && r.push(n[i]);
								n = r
							}
							return n
						}),
						e.innerHTML = "<a href='#'></a>",
						e.firstChild && typeof e.firstChild.getAttribute != "undefined" && e.firstChild.getAttribute("href") !== "#" && (d.attrHandle.href = function (e) {
							return e.getAttribute("href", 2)
						}),
						e = null
					}
					(),
					n.querySelectorAll && function () {
						var e = h,
						t = n.createElement("div"),
						r = "__sizzle__";
						t.innerHTML = "<p class='TEST'></p>";
						if (t.querySelectorAll && t.querySelectorAll(".TEST").length === 0)
							return;
						h = function (t, i, s, o) {
							i = i || n;
							if (!o && !h.isXML(i)) {
								var u = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(t);
								if (u && (i.nodeType === 1 || i.nodeType === 9)) {
									if (u[1])
										return y(i.getElementsByTagName(t), s);
									if (u[2] && d.find.CLASS && i.getElementsByClassName)
										return y(i.getElementsByClassName(u[2]), s)
								}
								if (i.nodeType === 9) {
									if (t === "body" && i.body)
										return y([i.body], s);
									if (u && u[3]) {
										var a = i.getElementById(u[3]);
										if (!a || !a.parentNode)
											return y([], s);
										if (a.id === u[3])
											return y([a], s)
									}
									try {
										return y(i.querySelectorAll(t), s)
									} catch (f) {}

								} else if (i.nodeType === 1 && i.nodeName.toLowerCase() !== "object") {
									var l = i,
									c = i.getAttribute("id"),
									p = c || r,
									v = i.parentNode,
									m = /^\s*[+~]/.test(t);
									c ? p = p.replace(/'/g, "\\$&") : i.setAttribute("id", p),
									m && v && (i = i.parentNode);
									try {
										if (!m || v)
											return y(i.querySelectorAll("[id='" + p + "'] " + t), s)
									} catch (g) {}

									finally {
										c || l.removeAttribute("id")
									}
								}
							}
							return e(t, i, s, o)
						};
						for (var i in e)
							h[i] = e[i];
						t = null
					}
					(),
					function () {
						var e = n.documentElement,
						t = e.matchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.msMatchesSelector;
						if (t) {
							var r = !t.call(n.createElement("div"), "div"),
							i = !1;
							try {
								t.call(n.documentElement, "[test!='']:sizzle")
							} catch (s) {
								i = !0
							}
							h.matchesSelector = function (e, n) {
								n = n.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
								if (!h.isXML(e))
									try {
										if (i || !d.match.PSEUDO.test(n) && !/!=/.test(n)) {
											var s = t.call(e, n);
											if (s || !r || e.document && e.document.nodeType !== 11)
												return s
										}
									} catch (o) {}

								return h(n, null, null, [e]).length > 0
							}
						}
					}
					(),
					function () {
						var e = n.createElement("div");
						e.innerHTML = "<div class='test e'></div><div class='test'></div>";
						if (!e.getElementsByClassName || e.getElementsByClassName("e").length === 0)
							return;
						e.lastChild.className = "e";
						if (e.getElementsByClassName("e").length === 1)
							return;
						d.order.splice(1, 0, "CLASS"),
						d.find.CLASS = function (e, t, n) {
							if (typeof t.getElementsByClassName != "undefined" && !n)
								return t.getElementsByClassName(e[1])
						},
						e = null
					}
					(),
					n.documentElement.contains ? h.contains = function (e, t) {
						return e !== t && (e.contains ? e.contains(t) : !0)
					}
					 : n.documentElement.compareDocumentPosition ? h.contains = function (e, t) {
						return !!(e.compareDocumentPosition(t) & 16)
					}
					 : h.contains = function () {
						return !1
					},
					h.isXML = function (e) {
						var t = (e ? e.ownerDocument || e : 0).documentElement;
						return t ? t.nodeName !== "HTML" : !1
					};
					var T = function (e, t, n) {
						var r,
						i = [],
						s = "",
						o = t.nodeType ? [t] : t;
						while (r = d.match.PSEUDO.exec(e))
							s += r[0], e = e.replace(d.match.PSEUDO, "");
						e = d.relative[e] ? e + "*" : e;
						for (var u = 0, a = o.length; u < a; u++)
							h(e, o[u], i, n);
						return h.filter(s, i)
					};
					h.attr = s.attr,
					h.selectors.attrMap = {},
					s.find = h,
					s.expr = h.selectors,
					s.expr[":"] = s.expr.filters,
					s.unique = h.uniqueSort,
					s.text = h.getText,
					s.isXMLDoc = h.isXML,
					s.contains = h.contains
				}
				();
				var j = /Until$/,
				F = /^(?:parents|prevUntil|prevAll)/,
				I = /,/,
				q = /^.[^:#\[\.,]*$/,
				R = Array.prototype.slice,
				U = s.expr.match.globalPOS,
				z = {
					children : !0,
					contents : !0,
					next : !0,
					prev : !0
				};
				s.fn.extend({
					find : function (e) {
						var t = this,
						n,
						r;
						if (typeof e != "string")
							return s(e).filter(function () {
								for (n = 0, r = t.length; n < r; n++)
									if (s.contains(t[n], this))
										return !0
							});
						var i = this.pushStack("", "find", e),
						o,
						u,
						a;
						for (n = 0, r = this.length; n < r; n++) {
							o = i.length,
							s.find(e, this[n], i);
							if (n > 0)
								for (u = o; u < i.length; u++)
									for (a = 0; a < o; a++)
										if (i[a] === i[u]) {
											i.splice(u--, 1);
											break
										}
						}
						return i
					},
					has : function (e) {
						var t = s(e);
						return this.filter(function () {
							for (var e = 0, n = t.length; e < n; e++)
								if (s.contains(this, t[e]))
									return !0
						})
					},
					not : function (e) {
						return this.pushStack(X(this, e, !1), "not", e)
					},
					filter : function (e) {
						return this.pushStack(X(this, e, !0), "filter", e)
					},
					is : function (e) {
						return !!e && (typeof e == "string" ? U.test(e) ? s(e, this.context).index(this[0]) >= 0 : s.filter(e, this).length > 0 : this.filter(e).length > 0)
					},
					closest : function (e, t) {
						var n = [],
						r,
						i,
						o = this[0];
						if (s.isArray(e)) {
							var u = 1;
							while (o && o.ownerDocument && o !== t) {
								for (r = 0; r < e.length; r++)
									s(o).is(e[r]) && n.push({
										selector : e[r],
										elem : o,
										level : u
									});
								o = o.parentNode,
								u++
							}
							return n
						}
						var a = U.test(e) || typeof e != "string" ? s(e, t || this.context) : 0;
						for (r = 0, i = this.length; r < i; r++) {
							o = this[r];
							while (o) {
								if (a ? a.index(o) > -1 : s.find.matchesSelector(o, e)) {
									n.push(o);
									break
								}
								o = o.parentNode;
								if (!o || !o.ownerDocument || o === t || o.nodeType === 11)
									break
							}
						}
						return n = n.length > 1 ? s.unique(n) : n,
						this.pushStack(n, "closest", e)
					},
					index : function (e) {
						return e ? typeof e == "string" ? s.inArray(this[0], s(e)) : s.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
					},
					add : function (e, t) {
						var n = typeof e == "string" ? s(e, t) : s.makeArray(e && e.nodeType ? [e] : e),
						r = s.merge(this.get(), n);
						return this.pushStack(W(n[0]) || W(r[0]) ? r : s.unique(r))
					},
					andSelf : function () {
						return this.add(this.prevObject)
					}
				}),
				s.each({
					parent : function (e) {
						var t = e.parentNode;
						return t && t.nodeType !== 11 ? t : null
					},
					parents : function (e) {
						return s.dir(e, "parentNode")
					},
					parentsUntil : function (e, t, n) {
						return s.dir(e, "parentNode", n)
					},
					next : function (e) {
						return s.nth(e, 2, "nextSibling")
					},
					prev : function (e) {
						return s.nth(e, 2, "previousSibling")
					},
					nextAll : function (e) {
						return s.dir(e, "nextSibling")
					},
					prevAll : function (e) {
						return s.dir(e, "previousSibling")
					},
					nextUntil : function (e, t, n) {
						return s.dir(e, "nextSibling", n)
					},
					prevUntil : function (e, t, n) {
						return s.dir(e, "previousSibling", n)
					},
					siblings : function (e) {
						return s.sibling((e.parentNode || {}).firstChild, e)
					},
					children : function (e) {
						return s.sibling(e.firstChild)
					},
					contents : function (e) {
						return s.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : s.makeArray(e.childNodes)
					}
				}, function (e, t) {
					s.fn[e] = function (n, r) {
						var i = s.map(this, t, n);
						return j.test(e) || (r = n),
						r && typeof r == "string" && (i = s.filter(r, i)),
						i = this.length > 1 && !z[e] ? s.unique(i) : i,
						(this.length > 1 || I.test(r)) && F.test(e) && (i = i.reverse()),
						this.pushStack(i, e, R.call(arguments).join(","))
					}
				}),
				s.extend({
					filter : function (e, t, n) {
						return n && (e = ":not(" + e + ")"),
						t.length === 1 ? s.find.matchesSelector(t[0], e) ? [t[0]] : [] : s.find.matches(e, t)
					},
					dir : function (e, n, r) {
						var i = [],
						o = e[n];
						while (o && o.nodeType !== 9 && (r === t || o.nodeType !== 1 || !s(o).is(r)))
							o.nodeType === 1 && i.push(o), o = o[n];
						return i
					},
					nth : function (e, t, n, r) {
						t = t || 1;
						var i = 0;
						for (; e; e = e[n])
							if (e.nodeType === 1 && ++i === t)
								break;
						return e
					},
					sibling : function (e, t) {
						var n = [];
						for (; e; e = e.nextSibling)
							e.nodeType === 1 && e !== t && n.push(e);
						return n
					}
				});
				var $ = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
				J = / jQuery\d+="(?:\d+|null)"/g,
				K = /^\s+/,
				Q = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
				G = /<([\w:]+)/,
				Y = /<tbody/i,
				Z = /<|&#?\w+;/,
				et = /<(?:script|style)/i,
				tt = /<(?:script|object|embed|option|style)/i,
				nt = new RegExp("<(?:" + $ + ")[\\s/>]", "i"),
				rt = /checked\s*(?:[^=]|=\s*.checked.)/i,
				it = /\/(java|ecma)script/i,
				st = /^\s*<!(?:\[CDATA\[|\-\-)/,
				ot = {
					option : [1, "<select multiple='multiple'>", "</select>"],
					legend : [1, "<fieldset>", "</fieldset>"],
					thead : [1, "<table>", "</table>"],
					tr : [2, "<table><tbody>", "</tbody></table>"],
					td : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
					col : [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
					area : [1, "<map>", "</map>"],
					_default : [0, "", ""]
				},
				ut = V(n);
				ot.optgroup = ot.option,
				ot.tbody = ot.tfoot = ot.colgroup = ot.caption = ot.thead,
				ot.th = ot.td,
				s.support.htmlSerialize || (ot._default = [1, "div<div>", "</div>"]),
				s.fn.extend({
					text : function (e) {
						return s.access(this, function (e) {
							return e === t ? s.text(this) : this.empty().append((this[0] && this[0].ownerDocument || n).createTextNode(e))
						}, null, e, arguments.length)
					},
					wrapAll : function (e) {
						if (s.isFunction(e))
							return this.each(function (t) {
								s(this).wrapAll(e.call(this, t))
							});
						if (this[0]) {
							var t = s(e, this[0].ownerDocument).eq(0).clone(!0);
							this[0].parentNode && t.insertBefore(this[0]),
							t.map(function () {
								var e = this;
								while (e.firstChild && e.firstChild.nodeType === 1)
									e = e.firstChild;
								return e
							}).append(this)
						}
						return this
					},
					wrapInner : function (e) {
						return s.isFunction(e) ? this.each(function (t) {
							s(this).wrapInner(e.call(this, t))
						}) : this.each(function () {
							var t = s(this),
							n = t.contents();
							n.length ? n.wrapAll(e) : t.append(e)
						})
					},
					wrap : function (e) {
						var t = s.isFunction(e);
						return this.each(function (n) {
							s(this).wrapAll(t ? e.call(this, n) : e)
						})
					},
					unwrap : function () {
						return this.parent().each(function () {
							s.nodeName(this, "body") || s(this).replaceWith(this.childNodes)
						}).end()
					},
					append : function () {
						return this.domManip(arguments, !0, function (e) {
							this.nodeType === 1 && this.appendChild(e)
						})
					},
					prepend : function () {
						return this.domManip(arguments, !0, function (e) {
							this.nodeType === 1 && this.insertBefore(e, this.firstChild)
						})
					},
					before : function () {
						if (this[0] && this[0].parentNode)
							return this.domManip(arguments, !1, function (e) {
								this.parentNode.insertBefore(e, this)
							});
						if (arguments.length) {
							var e = s.clean(arguments);
							return e.push.apply(e, this.toArray()),
							this.pushStack(e, "before", arguments)
						}
					},
					after : function () {
						if (this[0] && this[0].parentNode)
							return this.domManip(arguments, !1, function (e) {
								this.parentNode.insertBefore(e, this.nextSibling)
							});
						if (arguments.length) {
							var e = this.pushStack(this, "after", arguments);
							return e.push.apply(e, s.clean(arguments)),
							e
						}
					},
					remove : function (e, t) {
						for (var n = 0, r; (r = this[n]) != null; n++)
							if (!e || s.filter(e, [r]).length)
								!t && r.nodeType === 1 && (s.cleanData(r.getElementsByTagName("*")), s.cleanData([r])), r.parentNode && r.parentNode.removeChild(r);
						return this
					},
					empty : function () {
						for (var e = 0, t; (t = this[e]) != null; e++) {
							t.nodeType === 1 && s.cleanData(t.getElementsByTagName("*"));
							while (t.firstChild)
								t.removeChild(t.firstChild)
						}
						return this
					},
					clone : function (e, t) {
						return e = e == null ? !1 : e,
						t = t == null ? e : t,
						this.map(function () {
							return s.clone(this, e, t)
						})
					},
					html : function (e) {
						return s.access(this, function (e) {
							var n = this[0] || {},
							r = 0,
							i = this.length;
							if (e === t)
								return n.nodeType === 1 ? n.innerHTML.replace(J, "") : null;
							if (typeof e == "string" && !et.test(e) && (s.support.leadingWhitespace || !K.test(e)) && !ot[(G.exec(e) || ["", ""])[1].toLowerCase()]) {
								e = e.replace(Q, "<$1></$2>");
								try {
									for (; r < i; r++)
										n = this[r] || {},
									n.nodeType === 1 && (s.cleanData(n.getElementsByTagName("*")), n.innerHTML = e);
									n = 0
								} catch (o) {}

							}
							n && this.empty().append(e)
						}, null, e, arguments.length)
					},
					replaceWith : function (e) {
						return this[0] && this[0].parentNode ? s.isFunction(e) ? this.each(function (t) {
							var n = s(this),
							r = n.html();
							n.replaceWith(e.call(this, t, r))
						}) : (typeof e != "string" && (e = s(e).detach()), this.each(function () {
								var t = this.nextSibling,
								n = this.parentNode;
								s(this).remove(),
								t ? s(t).before(e) : s(n).append(e)
							})) : this.length ? this.pushStack(s(s.isFunction(e) ? e() : e), "replaceWith", e) : this
					},
					detach : function (e) {
						return this.remove(e, !0)
					},
					domManip : function (e, n, r) {
						var i,
						o,
						u,
						a,
						f = e[0],
						l = [];
						if (!s.support.checkClone && arguments.length === 3 && typeof f == "string" && rt.test(f))
							return this.each(function () {
								s(this).domManip(e, n, r, !0)
							});
						if (s.isFunction(f))
							return this.each(function (i) {
								var o = s(this);
								e[0] = f.call(this, i, n ? o.html() : t),
								o.domManip(e, n, r)
							});
						if (this[0]) {
							a = f && f.parentNode,
							s.support.parentNode && a && a.nodeType === 11 && a.childNodes.length === this.length ? i = {
								fragment : a
							}
							 : i = s.buildFragment(e, this, l),
							u = i.fragment,
							u.childNodes.length === 1 ? o = u = u.firstChild : o = u.firstChild;
							if (o) {
								n = n && s.nodeName(o, "tr");
								for (var c = 0, h = this.length, p = h - 1; c < h; c++)
									r.call(n ? at(this[c], o) : this[c], i.cacheable || h > 1 && c < p ? s.clone(u, !0, !0) : u)
							}
							l.length && s.each(l, function (e, t) {
								t.src ? s.ajax({
									type : "GET",
									global : !1,
									url : t.src,
									async : !1,
									dataType : "script"
								}) : s.globalEval((t.text || t.textContent || t.innerHTML || "").replace(st, "/*$0*/")),
								t.parentNode && t.parentNode.removeChild(t)
							})
						}
						return this
					}
				}),
				s.buildFragment = function (e, t, r) {
					var i,
					o,
					u,
					a,
					f = e[0];
					return t && t[0] && (a = t[0].ownerDocument || t[0]),
					a.createDocumentFragment || (a = n),
					e.length === 1 && typeof f == "string" && f.length < 512 && a === n && f.charAt(0) === "<" && !tt.test(f) && (s.support.checkClone || !rt.test(f)) && (s.support.html5Clone || !nt.test(f)) && (o = !0, u = s.fragments[f], u && u !== 1 && (i = u)),
					i || (i = a.createDocumentFragment(), s.clean(e, a, i, r)),
					o && (s.fragments[f] = u ? i : 1), {
						fragment : i,
						cacheable : o
					}
				},
				s.fragments = {},
				s.each({
					appendTo : "append",
					prependTo : "prepend",
					insertBefore : "before",
					insertAfter : "after",
					replaceAll : "replaceWith"
				}, function (e, t) {
					s.fn[e] = function (n) {
						var r = [],
						i = s(n),
						o = this.length === 1 && this[0].parentNode;
						if (o && o.nodeType === 11 && o.childNodes.length === 1 && i.length === 1)
							return i[t](this[0]), this;
						for (var u = 0, a = i.length; u < a; u++) {
							var f = (u > 0 ? this.clone(!0) : this).get();
							s(i[u])[t](f),
							r = r.concat(f)
						}
						return this.pushStack(r, e, i.selector)
					}
				}),
				s.extend({
					clone : function (e, t, n) {
						var r,
						i,
						o,
						u = s.support.html5Clone || s.isXMLDoc(e) || !nt.test("<" + e.nodeName + ">") ? e.cloneNode(!0) : dt(e);
						if ((!s.support.noCloneEvent || !s.support.noCloneChecked) && (e.nodeType === 1 || e.nodeType === 11) && !s.isXMLDoc(e)) {
							lt(e, u),
							r = ct(e),
							i = ct(u);
							for (o = 0; r[o]; ++o)
								i[o] && lt(r[o], i[o])
						}
						if (t) {
							ft(e, u);
							if (n) {
								r = ct(e),
								i = ct(u);
								for (o = 0; r[o]; ++o)
									ft(r[o], i[o])
							}
						}
						return r = i = null,
						u
					},
					clean : function (e, t, r, i) {
						var o,
						u,
						a,
						f = [];
						t = t || n,
						typeof t.createElement == "undefined" && (t = t.ownerDocument || t[0] && t[0].ownerDocument || n);
						for (var l = 0, c; (c = e[l]) != null; l++) {
							typeof c == "number" && (c += "");
							if (!c)
								continue;
							if (typeof c == "string")
								if (!Z.test(c))
									c = t.createTextNode(c);
								else {
									c = c.replace(Q, "<$1></$2>");
									var h = (G.exec(c) || ["", ""])[1].toLowerCase(),
									p = ot[h] || ot._default,
									d = p[0],
									v = t.createElement("div"),
									m = ut.childNodes,
									g;
									t === n ? ut.appendChild(v) : V(t).appendChild(v),
									v.innerHTML = p[1] + c + p[2];
									while (d--)
										v = v.lastChild;
									if (!s.support.tbody) {
										var y = Y.test(c),
										b = h === "table" && !y ? v.firstChild && v.firstChild.childNodes : p[1] === "<table>" && !y ? v.childNodes : [];
										for (a = b.length - 1; a >= 0; --a)
											s.nodeName(b[a], "tbody") && !b[a].childNodes.length && b[a].parentNode.removeChild(b[a])
									}
									!s.support.leadingWhitespace && K.test(c) && v.insertBefore(t.createTextNode(K.exec(c)[0]), v.firstChild),
									c = v.childNodes,
									v && (v.parentNode.removeChild(v), m.length > 0 && (g = m[m.length - 1], g && g.parentNode && g.parentNode.removeChild(g)))
								}
							var w;
							if (!s.support.appendChecked)
								if (c[0] && typeof(w = c.length) == "number")
									for (a = 0; a < w; a++)
										pt(c[a]);
								else
									pt(c);
							c.nodeType ? f.push(c) : f = s.merge(f, c)
						}
						if (r) {
							o = function (e) {
								return !e.type || it.test(e.type)
							};
							for (l = 0; f[l]; l++) {
								u = f[l];
								if (i && s.nodeName(u, "script") && (!u.type || it.test(u.type)))
									i.push(u.parentNode ? u.parentNode.removeChild(u) : u);
								else {
									if (u.nodeType === 1) {
										var E = s.grep(u.getElementsByTagName("script"), o);
										f.splice.apply(f, [l + 1, 0].concat(E))
									}
									r.appendChild(u)
								}
							}
						}
						return f
					},
					cleanData : function (e) {
						var t,
						n,
						r = s.cache,
						i = s.event.special,
						o = s.support.deleteExpando;
						for (var u = 0, a; (a = e[u]) != null; u++) {
							if (a.nodeName && s.noData[a.nodeName.toLowerCase()])
								continue;
							n = a[s.expando];
							if (n) {
								t = r[n];
								if (t && t.events) {
									for (var f in t.events)
										i[f] ? s.event.remove(a, f) : s.removeEvent(a, f, t.handle);
									t.handle && (t.handle.elem = null)
								}
								o ? delete a[s.expando] : a.removeAttribute && a.removeAttribute(s.expando),
								delete r[n]
							}
						}
					}
				});
				var vt = /alpha\([^)]*\)/i,
				mt = /opacity=([^)]*)/,
				gt = /([A-Z]|^ms)/g,
				yt = /^[\-+]?(?:\d*\.)?\d+$/i,
				bt = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
				wt = /^([\-+])=([\-+.\de]+)/,
				Et = /^margin/,
				St = {
					position : "absolute",
					visibility : "hidden",
					display : "block"
				},
				xt = ["Top", "Right", "Bottom", "Left"],
				Tt,
				Nt,
				Ct;
				s.fn.css = function (e, n) {
					return s.access(this, function (e, n, r) {
						return r !== t ? s.style(e, n, r) : s.css(e, n)
					}, e, n, arguments.length > 1)
				},
				s.extend({
					cssHooks : {
						opacity : {
							get : function (e, t) {
								if (t) {
									var n = Tt(e, "opacity");
									return n === "" ? "1" : n
								}
								return e.style.opacity
							}
						}
					},
					cssNumber : {
						fillOpacity : !0,
						fontWeight : !0,
						lineHeight : !0,
						opacity : !0,
						orphans : !0,
						widows : !0,
						zIndex : !0,
						zoom : !0
					},
					cssProps : {
						"float" : s.support.cssFloat ? "cssFloat" : "styleFloat"
					},
					style : function (e, n, r, i) {
						if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style)
							return;
						var o,
						u,
						a = s.camelCase(n),
						f = e.style,
						l = s.cssHooks[a];
						n = s.cssProps[a] || a;
						if (r === t)
							return l && "get" in l && (o = l.get(e, !1, i)) !== t ? o : f[n];
						u = typeof r,
						u === "string" && (o = wt.exec(r)) && (r =  + (o[1] + 1) * +o[2] + parseFloat(s.css(e, n)), u = "number");
						if (r == null || u === "number" && isNaN(r))
							return;
						u === "number" && !s.cssNumber[a] && (r += "px");
						if (!l || !("set" in l) || (r = l.set(e, r)) !== t)
							try {
								f[n] = r
							} catch (c) {}

					},
					css : function (e, n, r) {
						var i,
						o;
						n = s.camelCase(n),
						o = s.cssHooks[n],
						n = s.cssProps[n] || n,
						n === "cssFloat" && (n = "float");
						if (o && "get" in o && (i = o.get(e, !0, r)) !== t)
							return i;
						if (Tt)
							return Tt(e, n)
					},
					swap : function (e, t, n) {
						var r = {},
						i,
						s;
						for (s in t)
							r[s] = e.style[s], e.style[s] = t[s];
						i = n.call(e);
						for (s in t)
							e.style[s] = r[s];
						return i
					}
				}),
				s.curCSS = s.css,
				n.defaultView && n.defaultView.getComputedStyle && (Nt = function (e, t) {
					var n,
					r,
					i,
					o,
					u = e.style;
					return t = t.replace(gt, "-$1").toLowerCase(),
					(r = e.ownerDocument.defaultView) && (i = r.getComputedStyle(e, null)) && (n = i.getPropertyValue(t), n === "" && !s.contains(e.ownerDocument.documentElement, e) && (n = s.style(e, t))),
					!s.support.pixelMargin && i && Et.test(t) && bt.test(n) && (o = u.width, u.width = n, n = i.width, u.width = o),
					n
				}),
				n.documentElement.currentStyle && (Ct = function (e, t) {
					var n,
					r,
					i,
					s = e.currentStyle && e.currentStyle[t],
					o = e.style;
					return s == null && o && (i = o[t]) && (s = i),
					bt.test(s) && (n = o.left, r = e.runtimeStyle && e.runtimeStyle.left, r && (e.runtimeStyle.left = e.currentStyle.left), o.left = t === "fontSize" ? "1em" : s, s = o.pixelLeft + "px", o.left = n, r && (e.runtimeStyle.left = r)),
					s === "" ? "auto" : s
				}),
				Tt = Nt || Ct,
				s.each(["height", "width"], function (e, t) {
					s.cssHooks[t] = {
						get : function (e, n, r) {
							if (n)
								return e.offsetWidth !== 0 ? kt(e, t, r) : s.swap(e, St, function () {
									return kt(e, t, r)
								})
						},
						set : function (e, t) {
							return yt.test(t) ? t + "px" : t
						}
					}
				}),
				s.support.opacity || (s.cssHooks.opacity = {
						get : function (e, t) {
							return mt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : t ? "1" : ""
						},
						set : function (e, t) {
							var n = e.style,
							r = e.currentStyle,
							i = s.isNumeric(t) ? "alpha(opacity=" + t * 100 + ")" : "",
							o = r && r.filter || n.filter || "";
							n.zoom = 1;
							if (t >= 1 && s.trim(o.replace(vt, "")) === "") {
								n.removeAttribute("filter");
								if (r && !r.filter)
									return
							}
							n.filter = vt.test(o) ? o.replace(vt, i) : o + " " + i
						}
					}),
				s(function () {
					s.support.reliableMarginRight || (s.cssHooks.marginRight = {
							get : function (e, t) {
								return s.swap(e, {
									display : "inline-block"
								}, function () {
									return t ? Tt(e, "margin-right") : e.style.marginRight
								})
							}
						})
				}),
				s.expr && s.expr.filters && (s.expr.filters.hidden = function (e) {
					var t = e.offsetWidth,
					n = e.offsetHeight;
					return t === 0 && n === 0 || !s.support.reliableHiddenOffsets && (e.style && e.style.display || s.css(e, "display")) === "none"
				}, s.expr.filters.visible = function (e) {
					return !s.expr.filters.hidden(e)
				}),
				s.each({
					margin : "",
					padding : "",
					border : "Width"
				}, function (e, t) {
					s.cssHooks[e + t] = {
						expand : function (n) {
							var r,
							i = typeof n == "string" ? n.split(" ") : [n],
							s = {};
							for (r = 0; r < 4; r++)
								s[e + xt[r] + t] = i[r] || i[r - 2] || i[0];
							return s
						}
					}
				});
				var Lt = /%20/g,
				At = /\[\]$/,
				Ot = /\r?\n/g,
				Mt = /#.*$/,
				_t = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
				Dt = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
				Pt = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
				Ht = /^(?:GET|HEAD)$/,
				Bt = /^\/\//,
				jt = /\?/,
				Ft = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
				It = /^(?:select|textarea)/i,
				qt = /\s+/,
				Rt = /([?&])_=[^&]*/,
				Ut = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
				zt = s.fn.load,
				Wt = {},
				Xt = {},
				Vt,
				$t,
				Jt = ["*/"] + ["*"];
				try {
					Vt = i.href
				} catch (Kt) {
					Vt = n.createElement("a"),
					Vt.href = "",
					Vt = Vt.href
				}
				$t = Ut.exec(Vt.toLowerCase()) || [],
				s.fn.extend({
					load : function (e, n, r) {
						if (typeof e != "string" && zt)
							return zt.apply(this, arguments);
						if (!this.length)
							return this;
						var i = e.indexOf(" ");
						if (i >= 0) {
							var o = e.slice(i, e.length);
							e = e.slice(0, i)
						}
						var u = "GET";
						n && (s.isFunction(n) ? (r = n, n = t) : typeof n == "object" && (n = s.param(n, s.ajaxSettings.traditional), u = "POST"));
						var a = this;
						return s.ajax({
							url : e,
							type : u,
							dataType : "html",
							data : n,
							complete : function (e, t, n) {
								n = e.responseText,
								e.isResolved() && (e.done(function (e) {
										n = e
									}), a.html(o ? s("<div>").append(n.replace(Ft, "")).find(o) : n)),
								r && a.each(r, [n, t, e])
							}
						}),
						this
					},
					serialize : function () {
						return s.param(this.serializeArray())
					},
					serializeArray : function () {
						return this.map(function () {
							return this.elements ? s.makeArray(this.elements) : this
						}).filter(function () {
							return this.name && !this.disabled && (this.checked || It.test(this.nodeName) || Dt.test(this.type))
						}).map(function (e, t) {
							var n = s(this).val();
							return n == null ? null : s.isArray(n) ? s.map(n, function (e, n) {
								return {
									name : t.name,
									value : e.replace(Ot, "\r\n")
								}
							}) : {
								name : t.name,
								value : n.replace(Ot, "\r\n")
							}
						}).get()
					}
				}),
				s.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (e, t) {
					s.fn[t] = function (e) {
						return this.on(t, e)
					}
				}),
				s.each(["get", "post"], function (e, n) {
					s[n] = function (e, r, i, o) {
						return s.isFunction(r) && (o = o || i, i = r, r = t),
						s.ajax({
							type : n,
							url : e,
							data : r,
							success : i,
							dataType : o
						})
					}
				}),
				s.extend({
					getScript : function (e, n) {
						return s.get(e, t, n, "script")
					},
					getJSON : function (e, t, n) {
						return s.get(e, t, n, "json")
					},
					ajaxSetup : function (e, t) {
						return t ? Yt(e, s.ajaxSettings) : (t = e, e = s.ajaxSettings),
						Yt(e, t),
						e
					},
					ajaxSettings : {
						url : Vt,
						isLocal : Pt.test($t[1]),
						global : !0,
						type : "GET",
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						processData : !0,
						async : !0,
						accepts : {
							xml : "application/xml, text/xml",
							html : "text/html",
							text : "text/plain",
							json : "application/json, text/javascript",
							"*" : Jt
						},
						contents : {
							xml : /xml/,
							html : /html/,
							json : /json/
						},
						responseFields : {
							xml : "responseXML",
							text : "responseText"
						},
						converters : {
							"* text" : e.String,
							"text html" : !0,
							"text json" : s.parseJSON,
							"text xml" : s.parseXML
						},
						flatOptions : {
							context : !0,
							url : !0
						}
					},
					ajaxPrefilter : Qt(Wt),
					ajaxTransport : Qt(Xt),
					ajax : function (e, n) {
						function S(e, n, c, h) {
							if (y === 2)
								return;
							y = 2,
							m && clearTimeout(m),
							v = t,
							p = h || "",
							E.readyState = e > 0 ? 4 : 0;
							var d,
							g,
							w,
							S = n,
							x = c ? en(r, E, c) : t,
							T,
							N;
							if (e >= 200 && e < 300 || e === 304) {
								if (r.ifModified) {
									if (T = E.getResponseHeader("Last-Modified"))
										s.lastModified[l] = T;
									if (N = E.getResponseHeader("Etag"))
										s.etag[l] = N
								}
								if (e === 304)
									S = "notmodified", d = !0;
								else
									try {
										g = tn(r, x),
										S = "success",
										d = !0
									} catch (C) {
										S = "parsererror",
										w = C
									}
							} else {
								w = S;
								if (!S || e)
									S = "error", e < 0 && (e = 0)
							}
							E.status = e,
							E.statusText = "" + (n || S),
							d ? u.resolveWith(i, [g, S, E]) : u.rejectWith(i, [E, S, w]),
							E.statusCode(f),
							f = t,
							b && o.trigger("ajax" + (d ? "Success" : "Error"), [E, r, d ? g : w]),
							a.fireWith(i, [E, S]),
							b && (o.trigger("ajaxComplete", [E, r]), --s.active || s.event.trigger("ajaxStop"))
						}
						typeof e == "object" && (n = e, e = t),
						n = n || {};
						var r = s.ajaxSetup({}, n),
						i = r.context || r,
						o = i !== r && (i.nodeType || i instanceof s) ? s(i) : s.event,
						u = s.Deferred(),
						a = s.Callbacks("once memory"),
						f = r.statusCode || {},
						l,
						c = {},
						h = {},
						p,
						d,
						v,
						m,
						g,
						y = 0,
						b,
						w,
						E = {
							readyState : 0,
							setRequestHeader : function (e, t) {
								if (!y) {
									var n = e.toLowerCase();
									e = h[n] = h[n] || e,
									c[e] = t
								}
								return this
							},
							getAllResponseHeaders : function () {
								return y === 2 ? p : null
							},
							getResponseHeader : function (e) {
								var n;
								if (y === 2) {
									if (!d) {
										d = {};
										while (n = _t.exec(p))
											d[n[1].toLowerCase()] = n[2]
									}
									n = d[e.toLowerCase()]
								}
								return n === t ? null : n
							},
							overrideMimeType : function (e) {
								return y || (r.mimeType = e),
								this
							},
							abort : function (e) {
								return e = e || "abort",
								v && v.abort(e),
								S(0, e),
								this
							}
						};
						u.promise(E),
						E.success = E.done,
						E.error = E.fail,
						E.complete = a.add,
						E.statusCode = function (e) {
							if (e) {
								var t;
								if (y < 2)
									for (t in e)
										f[t] = [f[t], e[t]];
								else
									t = e[E.status], E.then(t, t)
							}
							return this
						},
						r.url = ((e || r.url) + "").replace(Mt, "").replace(Bt, $t[1] + "//"),
						r.dataTypes = s.trim(r.dataType || "*").toLowerCase().split(qt),
						r.crossDomain == null && (g = Ut.exec(r.url.toLowerCase()), r.crossDomain = !(!g || g[1] == $t[1] && g[2] == $t[2] && (g[3] || (g[1] === "http:" ? 80 : 443)) == ($t[3] || ($t[1] === "http:" ? 80 : 443)))),
						r.data && r.processData && typeof r.data != "string" && (r.data = s.param(r.data, r.traditional)),
						Gt(Wt, r, n, E);
						if (y === 2)
							return !1;
						b = r.global,
						r.type = r.type.toUpperCase(),
						r.hasContent = !Ht.test(r.type),
						b && s.active++ === 0 && s.event.trigger("ajaxStart");
						if (!r.hasContent) {
							r.data && (r.url += (jt.test(r.url) ? "&" : "?") + r.data, delete r.data),
							l = r.url;
							if (r.cache === !1) {
								var x = s.now(),
								T = r.url.replace(Rt, "$1_=" + x);
								r.url = T + (T === r.url ? (jt.test(r.url) ? "&" : "?") + "_=" + x : "")
							}
						}
						(r.data && r.hasContent && r.contentType !== !1 || n.contentType) && E.setRequestHeader("Content-Type", r.contentType),
						r.ifModified && (l = l || r.url, s.lastModified[l] && E.setRequestHeader("If-Modified-Since", s.lastModified[l]), s.etag[l] && E.setRequestHeader("If-None-Match", s.etag[l])),
						E.setRequestHeader("Accept", r.dataTypes[0] && r.accepts[r.dataTypes[0]] ? r.accepts[r.dataTypes[0]] + (r.dataTypes[0] !== "*" ? ", " + Jt + "; q=0.01" : "") : r.accepts["*"]);
						for (w in r.headers)
							E.setRequestHeader(w, r.headers[w]);
						if (!r.beforeSend || r.beforeSend.call(i, E, r) !== !1 && y !== 2) {
							for (w in {
								success : 1,
								error : 1,
								complete : 1
							})
								E[w](r[w]);
							v = Gt(Xt, r, n, E);
							if (!v)
								S(-1, "No Transport");
							else {
								E.readyState = 1,
								b && o.trigger("ajaxSend", [E, r]),
								r.async && r.timeout > 0 && (m = setTimeout(function () {
											E.abort("timeout")
										}, r.timeout));
								try {
									y = 1,
									v.send(c, S)
								} catch (N) {
									if (!(y < 2))
										throw N;
									S(-1, N)
								}
							}
							return E
						}
						return E.abort(),
						!1
					},
					param : function (e, n) {
						var r = [],
						i = function (e, t) {
							t = s.isFunction(t) ? t() : t,
							r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
						};
						n === t && (n = s.ajaxSettings.traditional);
						if (s.isArray(e) || e.jquery && !s.isPlainObject(e))
							s.each(e, function () {
								i(this.name, this.value)
							});
						else
							for (var o in e)
								Zt(o, e[o], n, i);
						return r.join("&").replace(Lt, "+")
					}
				}),
				s.extend({
					active : 0,
					lastModified : {},
					etag : {}

				});
				var nn = s.now(),
				rn = /(\=)\?(&|$)|\?\?/i;
				s.ajaxSetup({
					jsonp : "callback",
					jsonpCallback : function () {
						return s.expando + "_" + nn++
					}
				}),
				s.ajaxPrefilter("json jsonp", function (t, n, r) {
					var i = typeof t.data == "string" && /^application\/x\-www\-form\-urlencoded/.test(t.contentType);
					if (t.dataTypes[0] === "jsonp" || t.jsonp !== !1 && (rn.test(t.url) || i && rn.test(t.data))) {
						var o,
						u = t.jsonpCallback = s.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
						a = e[u],
						f = t.url,
						l = t.data,
						c = "$1" + u + "$2";
						return t.jsonp !== !1 && (f = f.replace(rn, c), t.url === f && (i && (l = l.replace(rn, c)), t.data === l && (f += (/\?/.test(f) ? "&" : "?") + t.jsonp + "=" + u))),
						t.url = f,
						t.data = l,
						e[u] = function (e) {
							o = [e]
						},
						r.always(function () {
							e[u] = a,
							o && s.isFunction(a) && e[u](o[0])
						}),
						t.converters["script json"] = function () {
							return o || s.error(u + " was not called"),
							o[0]
						},
						t.dataTypes[0] = "json",
						"script"
					}
				}),
				s.ajaxSetup({
					accepts : {
						script : "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
					},
					contents : {
						script : /javascript|ecmascript/
					},
					converters : {
						"text script" : function (e) {
							return s.globalEval(e),
							e
						}
					}
				}),
				s.ajaxPrefilter("script", function (e) {
					e.cache === t && (e.cache = !1),
					e.crossDomain && (e.type = "GET", e.global = !1)
				}),
				s.ajaxTransport("script", function (e) {
					if (e.crossDomain) {
						var r,
						i = n.head || n.getElementsByTagName("head")[0] || n.documentElement;
						return {
							send : function (s, o) {
								r = n.createElement("script"),
								r.async = "async",
								e.scriptCharset && (r.charset = e.scriptCharset),
								r.src = e.url,
								r.onload = r.onreadystatechange = function (e, n) {
									if (n || !r.readyState || /loaded|complete/.test(r.readyState))
										r.onload = r.onreadystatechange = null, i && r.parentNode && i.removeChild(r), r = t, n || o(200, "success")
								},
								i.insertBefore(r, i.firstChild)
							},
							abort : function () {
								r && r.onload(0, 1)
							}
						}
					}
				});
				var sn = e.ActiveXObject ? function () {
					for (var e in un)
						un[e](0, 1)
				}
				 : !1,
				on = 0,
				un;
				s.ajaxSettings.xhr = e.ActiveXObject ? function () {
					return !this.isLocal && an() || fn()
				}
				 : an,
				function (e) {
					s.extend(s.support, {
						ajax : !!e,
						cors : !!e && "withCredentials" in e
					})
				}
				(s.ajaxSettings.xhr()),
				s.support.ajax && s.ajaxTransport(function (n) {
					if (!n.crossDomain || s.support.cors) {
						var r;
						return {
							send : function (i, o) {
								var u = n.xhr(),
								a,
								f;
								n.username ? u.open(n.type, n.url, n.async, n.username, n.password) : u.open(n.type, n.url, n.async);
								if (n.xhrFields)
									for (f in n.xhrFields)
										u[f] = n.xhrFields[f];
								n.mimeType && u.overrideMimeType && u.overrideMimeType(n.mimeType),
								!n.crossDomain && !i["X-Requested-With"] && (i["X-Requested-With"] = "XMLHttpRequest");
								try {
									for (f in i)
										u.setRequestHeader(f, i[f])
								} catch (l) {}

								u.send(n.hasContent && n.data || null),
								r = function (e, i) {
									var f,
									l,
									c,
									h,
									p;
									try {
										if (r && (i || u.readyState === 4)) {
											r = t,
											a && (u.onreadystatechange = s.noop, sn && delete un[a]);
											if (i)
												u.readyState !== 4 && u.abort();
											else {
												f = u.status,
												c = u.getAllResponseHeaders(),
												h = {},
												p = u.responseXML,
												p && p.documentElement && (h.xml = p);
												try {
													h.text = u.responseText
												} catch (e) {}

												try {
													l = u.statusText
												} catch (d) {
													l = ""
												}
												!f && n.isLocal && !n.crossDomain ? f = h.text ? 200 : 404 : f === 1223 && (f = 204)
											}
										}
									} catch (v) {
										i || o(-1, v)
									}
									h && o(f, l, h, c)
								},
								!n.async || u.readyState === 4 ? r() : (a = ++on, sn && (un || (un = {}, s(e).unload(sn)), un[a] = r), u.onreadystatechange = r)
							},
							abort : function () {
								r && r(0, 1)
							}
						}
					}
				});
				var ln = {},
				cn,
				hn,
				pn = /^(?:toggle|show|hide)$/,
				dn = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
				vn,
				mn = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]],
				gn;
				s.fn.extend({
					show : function (e, t, n) {
						var r,
						i;
						if (e || e === 0)
							return this.animate(wn("show", 3), e, t, n);
						for (var o = 0, u = this.length; o < u; o++)
							r = this[o], r.style && (i = r.style.display, !s._data(r, "olddisplay") && i === "none" && (i = r.style.display = ""), (i === "" && s.css(r, "display") === "none" || !s.contains(r.ownerDocument.documentElement, r)) && s._data(r, "olddisplay", En(r.nodeName)));
						for (o = 0; o < u; o++) {
							r = this[o];
							if (r.style) {
								i = r.style.display;
								if (i === "" || i === "none")
									r.style.display = s._data(r, "olddisplay") || ""
							}
						}
						return this
					},
					hide : function (e, t, n) {
						if (e || e === 0)
							return this.animate(wn("hide", 3), e, t, n);
						var r,
						i,
						o = 0,
						u = this.length;
						for (; o < u; o++)
							r = this[o], r.style && (i = s.css(r, "display"), i !== "none" && !s._data(r, "olddisplay") && s._data(r, "olddisplay", i));
						for (o = 0; o < u; o++)
							this[o].style && (this[o].style.display = "none");
						return this
					},
					_toggle : s.fn.toggle,
					toggle : function (e, t, n) {
						var r = typeof e == "boolean";
						return s.isFunction(e) && s.isFunction(t) ? this._toggle.apply(this, arguments) : e == null || r ? this.each(function () {
							var t = r ? e : s(this).is(":hidden");
							s(this)[t ? "show" : "hide"]()
						}) : this.animate(wn("toggle", 3), e, t, n),
						this
					},
					fadeTo : function (e, t, n, r) {
						return this.filter(":hidden").css("opacity", 0).show().end().animate({
							opacity : t
						}, e, n, r)
					},
					animate : function (e, t, n, r) {
						function o() {
							i.queue === !1 && s._mark(this);
							var t = s.extend({}, i),
							n = this.nodeType === 1,
							r = n && s(this).is(":hidden"),
							o,
							u,
							a,
							f,
							l,
							c,
							h,
							p,
							d,
							v,
							m;
							t.animatedProperties = {};
							for (a in e) {
								o = s.camelCase(a),
								a !== o && (e[o] = e[a], delete e[a]);
								if ((l = s.cssHooks[o]) && "expand" in l) {
									c = l.expand(e[o]),
									delete e[o];
									for (a in c)
										a in e || (e[a] = c[a])
								}
							}
							for (o in e) {
								u = e[o],
								s.isArray(u) ? (t.animatedProperties[o] = u[1], u = e[o] = u[0]) : t.animatedProperties[o] = t.specialEasing && t.specialEasing[o] || t.easing || "swing";
								if (u === "hide" && r || u === "show" && !r)
									return t.complete.call(this);
								n && (o === "height" || o === "width") && (t.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], s.css(this, "display") === "inline" && s.css(this, "float") === "none" && (!s.support.inlineBlockNeedsLayout || En(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1))
							}
							t.overflow != null && (this.style.overflow = "hidden");
							for (a in e)
								f = new s.fx(this, t, a), u = e[a], pn.test(u) ? (m = s._data(this, "toggle" + a) || (u === "toggle" ? r ? "show" : "hide" : 0), m ? (s._data(this, "toggle" + a, m === "show" ? "hide" : "show"), f[m]()) : f[u]()) : (h = dn.exec(u), p = f.cur(), h ? (d = parseFloat(h[2]), v = h[3] || (s.cssNumber[a] ? "" : "px"), v !== "px" && (s.style(this, a, (d || 1) + v), p = (d || 1) / f.cur() * p, s.style(this, a, p + v)), h[1] && (d = (h[1] === "-=" ? -1 : 1) * d + p), f.custom(p, d, v)) : f.custom(p, u, ""));
							return !0
						}
						var i = s.speed(t, n, r);
						return s.isEmptyObject(e) ? this.each(i.complete, [!1]) : (e = s.extend({}, e), i.queue === !1 ? this.each(o) : this.queue(i.queue, o))
					},
					stop : function (e, n, r) {
						return typeof e != "string" && (r = n, n = e, e = t),
						n && e !== !1 && this.queue(e || "fx", []),
						this.each(function () {
							function u(e, t, n) {
								var i = t[n];
								s.removeData(e, n, !0),
								i.stop(r)
							}
							var t,
							n = !1,
							i = s.timers,
							o = s._data(this);
							r || s._unmark(!0, this);
							if (e == null)
								for (t in o)
									o[t] && o[t].stop && t.indexOf(".run") === t.length - 4 && u(this, o, t);
							else
								o[t = e + ".run"] && o[t].stop && u(this, o, t);
							for (t = i.length; t--; )
								i[t].elem === this && (e == null || i[t].queue === e) && (r ? i[t](!0) : i[t].saveState(), n = !0, i.splice(t, 1));
							(!r || !n) && s.dequeue(this, e)
						})
					}
				}),
				s.each({
					slideDown : wn("show", 1),
					slideUp : wn("hide", 1),
					slideToggle : wn("toggle", 1),
					fadeIn : {
						opacity : "show"
					},
					fadeOut : {
						opacity : "hide"
					},
					fadeToggle : {
						opacity : "toggle"
					}
				}, function (e, t) {
					s.fn[e] = function (e, n, r) {
						return this.animate(t, e, n, r)
					}
				}),
				s.extend({
					speed : function (e, t, n) {
						var r = e && typeof e == "object" ? s.extend({}, e) : {
							complete : n || !n && t || s.isFunction(e) && e,
							duration : e,
							easing : n && t || t && !s.isFunction(t) && t
						};
						r.duration = s.fx.off ? 0 : typeof r.duration == "number" ? r.duration : r.duration in s.fx.speeds ? s.fx.speeds[r.duration] : s.fx.speeds._default;
						if (r.queue == null || r.queue === !0)
							r.queue = "fx";
						return r.old = r.complete,
						r.complete = function (e) {
							s.isFunction(r.old) && r.old.call(this),
							r.queue ? s.dequeue(this, r.queue) : e !== !1 && s._unmark(this)
						},
						r
					},
					easing : {
						linear : function (e) {
							return e
						},
						swing : function (e) {
							return -Math.cos(e * Math.PI) / 2 + .5
						}
					},
					timers : [],
					fx : function (e, t, n) {
						this.options = t,
						this.elem = e,
						this.prop = n,
						t.orig = t.orig || {}

					}
				}),
				s.fx.prototype = {
					update : function () {
						this.options.step && this.options.step.call(this.elem, this.now, this),
						(s.fx.step[this.prop] || s.fx.step._default)(this)
					},
					cur : function () {
						if (this.elem[this.prop] == null || !!this.elem.style && this.elem.style[this.prop] != null) {
							var e,
							t = s.css(this.elem, this.prop);
							return isNaN(e = parseFloat(t)) ? !t || t === "auto" ? 0 : t : e
						}
						return this.elem[this.prop]
					},
					custom : function (e, n, r) {
						function u(e) {
							return i.step(e)
						}
						var i = this,
						o = s.fx;
						this.startTime = gn || yn(),
						this.end = n,
						this.now = this.start = e,
						this.pos = this.state = 0,
						this.unit = r || this.unit || (s.cssNumber[this.prop] ? "" : "px"),
						u.queue = this.options.queue,
						u.elem = this.elem,
						u.saveState = function () {
							s._data(i.elem, "fxshow" + i.prop) === t && (i.options.hide ? s._data(i.elem, "fxshow" + i.prop, i.start) : i.options.show && s._data(i.elem, "fxshow" + i.prop, i.end))
						},
						u() && s.timers.push(u) && !vn && (vn = setInterval(o.tick, o.interval))
					},
					show : function () {
						var e = s._data(this.elem, "fxshow" + this.prop);
						this.options.orig[this.prop] = e || s.style(this.elem, this.prop),
						this.options.show = !0,
						e !== t ? this.custom(this.cur(), e) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()),
						s(this.elem).show()
					},
					hide : function () {
						this.options.orig[this.prop] = s._data(this.elem, "fxshow" + this.prop) || s.style(this.elem, this.prop),
						this.options.hide = !0,
						this.custom(this.cur(), 0)
					},
					step : function (e) {
						var t,
						n,
						r,
						i = gn || yn(),
						o = !0,
						u = this.elem,
						a = this.options;
						if (e || i >= a.duration + this.startTime) {
							this.now = this.end,
							this.pos = this.state = 1,
							this.update(),
							a.animatedProperties[this.prop] = !0;
							for (t in a.animatedProperties)
								a.animatedProperties[t] !== !0 && (o = !1);
							if (o) {
								a.overflow != null && !s.support.shrinkWrapBlocks && s.each(["", "X", "Y"], function (e, t) {
									u.style["overflow" + t] = a.overflow[e]
								}),
								a.hide && s(u).hide();
								if (a.hide || a.show)
									for (t in a.animatedProperties)
										s.style(u, t, a.orig[t]), s.removeData(u, "fxshow" + t, !0), s.removeData(u, "toggle" + t, !0);
								r = a.complete,
								r && (a.complete = !1, r.call(u))
							}
							return !1
						}
						return a.duration == Infinity ? this.now = i : (n = i - this.startTime, this.state = n / a.duration, this.pos = s.easing[a.animatedProperties[this.prop]](this.state, n, 0, 1, a.duration), this.now = this.start + (this.end - this.start) * this.pos),
						this.update(),
						!0
					}
				},
				s.extend(s.fx, {
					tick : function () {
						var e,
						t = s.timers,
						n = 0;
						for (; n < t.length; n++)
							e = t[n], !e() && t[n] === e && t.splice(n--, 1);
						t.length || s.fx.stop()
					},
					interval : 13,
					stop : function () {
						clearInterval(vn),
						vn = null
					},
					speeds : {
						slow : 600,
						fast : 200,
						_default : 400
					},
					step : {
						opacity : function (e) {
							s.style(e.elem, "opacity", e.now)
						},
						_default : function (e) {
							e.elem.style && e.elem.style[e.prop] != null ? e.elem.style[e.prop] = e.now + e.unit : e.elem[e.prop] = e.now
						}
					}
				}),
				s.each(mn.concat.apply([], mn), function (e, t) {
					t.indexOf("margin") && (s.fx.step[t] = function (e) {
						s.style(e.elem, t, Math.max(0, e.now) + e.unit)
					})
				}),
				s.expr && s.expr.filters && (s.expr.filters.animated = function (e) {
					return s.grep(s.timers, function (t) {
						return e === t.elem
					}).length
				});
				var Sn,
				xn = /^t(?:able|d|h)$/i,
				Tn = /^(?:body|html)$/i;
				return "getBoundingClientRect" in n.documentElement ? Sn = function (e, t, n, r) {
					try {
						r = e.getBoundingClientRect()
					} catch (i) {}

					if (!r || !s.contains(n, e))
						return r ? {
							top : r.top,
							left : r.left
						}
					 : {
						top : 0,
						left : 0
					};
					var o = t.body,
					u = Nn(t),
					a = n.clientTop || o.clientTop || 0,
					f = n.clientLeft || o.clientLeft || 0,
					l = u.pageYOffset || s.support.boxModel && n.scrollTop || o.scrollTop,
					c = u.pageXOffset || s.support.boxModel && n.scrollLeft || o.scrollLeft,
					h = r.top + l - a,
					p = r.left + c - f;
					return {
						top : h,
						left : p
					}
				}
				 : Sn = function (e, t, n) {
					var r,
					i = e.offsetParent,
					o = e,
					u = t.body,
					a = t.defaultView,
					f = a ? a.getComputedStyle(e, null) : e.currentStyle,
					l = e.offsetTop,
					c = e.offsetLeft;
					while ((e = e.parentNode) && e !== u && e !== n) {
						if (s.support.fixedPosition && f.position === "fixed")
							break;
						r = a ? a.getComputedStyle(e, null) : e.currentStyle,
						l -= e.scrollTop,
						c -= e.scrollLeft,
						e === i && (l += e.offsetTop, c += e.offsetLeft, s.support.doesNotAddBorder && (!s.support.doesAddBorderForTableAndCells || !xn.test(e.nodeName)) && (l += parseFloat(r.borderTopWidth) || 0, c += parseFloat(r.borderLeftWidth) || 0), o = i, i = e.offsetParent),
						s.support.subtractsBorderForOverflowNotVisible && r.overflow !== "visible" && (l += parseFloat(r.borderTopWidth) || 0, c += parseFloat(r.borderLeftWidth) || 0),
						f = r
					}
					if (f.position === "relative" || f.position === "static")
						l += u.offsetTop, c += u.offsetLeft;
					return s.support.fixedPosition && f.position === "fixed" && (l += Math.max(n.scrollTop, u.scrollTop), c += Math.max(n.scrollLeft, u.scrollLeft)), {
						top : l,
						left : c
					}
				},
				s.fn.offset = function (e) {
					if (arguments.length)
						return e === t ? this : this.each(function (t) {
							s.offset.setOffset(this, e, t)
						});
					var n = this[0],
					r = n && n.ownerDocument;
					return r ? n === r.body ? s.offset.bodyOffset(n) : Sn(n, r, r.documentElement) : null
				},
				s.offset = {
					bodyOffset : function (e) {
						var t = e.offsetTop,
						n = e.offsetLeft;
						return s.support.doesNotIncludeMarginInBodyOffset && (t += parseFloat(s.css(e, "marginTop")) || 0, n += parseFloat(s.css(e, "marginLeft")) || 0), {
							top : t,
							left : n
						}
					},
					setOffset : function (e, t, n) {
						var r = s.css(e, "position");
						r === "static" && (e.style.position = "relative");
						var i = s(e),
						o = i.offset(),
						u = s.css(e, "top"),
						a = s.css(e, "left"),
						f = (r === "absolute" || r === "fixed") && s.inArray("auto", [u, a]) > -1,
						l = {},
						c = {},
						h,
						p;
						f ? (c = i.position(), h = c.top, p = c.left) : (h = parseFloat(u) || 0, p = parseFloat(a) || 0),
						s.isFunction(t) && (t = t.call(e, n, o)),
						t.top != null && (l.top = t.top - o.top + h),
						t.left != null && (l.left = t.left - o.left + p),
						"using" in t ? t.using.call(e, l) : i.css(l)
					}
				},
				s.fn.extend({
					position : function () {
						if (!this[0])
							return null;
						var e = this[0],
						t = this.offsetParent(),
						n = this.offset(),
						r = Tn.test(t[0].nodeName) ? {
							top : 0,
							left : 0
						}
						 : t.offset();
						return n.top -= parseFloat(s.css(e, "marginTop")) || 0,
						n.left -= parseFloat(s.css(e, "marginLeft")) || 0,
						r.top += parseFloat(s.css(t[0], "borderTopWidth")) || 0,
						r.left += parseFloat(s.css(t[0], "borderLeftWidth")) || 0, {
							top : n.top - r.top,
							left : n.left - r.left
						}
					},
					offsetParent : function () {
						return this.map(function () {
							var e = this.offsetParent || n.body;
							while (e && !Tn.test(e.nodeName) && s.css(e, "position") === "static")
								e = e.offsetParent;
							return e
						})
					}
				}),
				s.each({
					scrollLeft : "pageXOffset",
					scrollTop : "pageYOffset"
				}, function (e, n) {
					var r = /Y/.test(n);
					s.fn[e] = function (i) {
						return s.access(this, function (e, i, o) {
							var u = Nn(e);
							if (o === t)
								return u ? n in u ? u[n] : s.support.boxModel && u.document.documentElement[i] || u.document.body[i] : e[i];
							u ? u.scrollTo(r ? s(u).scrollLeft() : o, r ? o : s(u).scrollTop()) : e[i] = o
						}, e, i, arguments.length, null)
					}
				}),
				s.each({
					Height : "height",
					Width : "width"
				}, function (e, n) {
					var r = "client" + e,
					i = "scroll" + e,
					o = "offset" + e;
					s.fn["inner" + e] = function () {
						var e = this[0];
						return e ? e.style ? parseFloat(s.css(e, n, "padding")) : this[n]() : null
					},
					s.fn["outer" + e] = function (e) {
						var t = this[0];
						return t ? t.style ? parseFloat(s.css(t, n, e ? "margin" : "border")) : this[n]() : null
					},
					s.fn[n] = function (e) {
						return s.access(this, function (e, n, u) {
							var a,
							f,
							l,
							c;
							if (s.isWindow(e))
								return a = e.document, f = a.documentElement[r], s.support.boxModel && f || a.body && a.body[r] || f;
							if (e.nodeType === 9)
								return a = e.documentElement, a[r] >= a[i] ? a[r] : Math.max(e.body[i], a[i], e.body[o], a[o]);
							if (u === t)
								return l = s.css(e, n), c = parseFloat(l), s.isNumeric(c) ? c : l;
							s(e).css(n, u)
						}, n, e, arguments.length, null)
					}
				}),
				s
			}
			(window)
		})
	}),
	e.define("/node_modules/backbone-browserify/package.json", function (e, t, n, r, i, s) {
		t.exports = {
			main : "lib/backbone-browserify.js",
			browserify : {
				dependencies : {
					underscore : ">=1.1.2"
				},
				main : "lib/backbone-browserify.js"
			}
		}
	}),
	e.define("/node_modules/backbone-browserify/lib/backbone-browserify.js", function (e, t, n, r, i, s) {
		-function() {
			function r() {
				var t = this,
				r = t.Backbone,
				i = Array.prototype.slice,
				s = Array.prototype.splice,
				o;
				typeof n != "undefined" ? o = n : o = t.Backbone = {},
				o.VERSION = "0.9.2";
				var u = t._;
				!u && typeof e != "undefined" && (u = e("underscore"));
				var a = t.jQuery || t.Zepto || t.ender;
				o.setDomLibrary = function (e) {
					a = e
				},
				o.noConflict = function () {
					return t.Backbone = r,
					this
				},
				o.emulateHTTP = !1,
				o.emulateJSON = !1;
				var f = /\s+/,
				l = o.Events = {
					on : function (e, t, n) {
						var r,
						i,
						s,
						o,
						u;
						if (!t)
							return this;
						e = e.split(f),
						r = this._callbacks || (this._callbacks = {});
						while (i = e.shift())
							u = r[i], s = u ? u.tail : {},
						s.next = o = {},
						s.context = n,
						s.callback = t,
						r[i] = {
							tail : o,
							next : u ? u.next : s
						};
						return this
					},
					off : function (e, t, n) {
						var r,
						i,
						s,
						o,
						a,
						l;
						if (!(i = this._callbacks))
							return;
						if (!(e || t || n))
							return delete this._callbacks, this;
						e = e ? e.split(f) : u.keys(i);
						while (r = e.shift()) {
							s = i[r],
							delete i[r];
							if (!s || !t && !n)
								continue;
							o = s.tail;
							while ((s = s.next) !== o)
								a = s.callback, l = s.context, (t && a !== t || n && l !== n) && this.on(r, a, l)
						}
						return this
					},
					trigger : function (e) {
						var t,
						n,
						r,
						s,
						o,
						u,
						a;
						if (!(r = this._callbacks))
							return this;
						u = r.all,
						e = e.split(f),
						a = i.call(arguments, 1);
						while (t = e.shift()) {
							if (n = r[t]) {
								s = n.tail;
								while ((n = n.next) !== s)
									n.callback.apply(n.context || this, a)
							}
							if (n = u) {
								s = n.tail,
								o = [t].concat(a);
								while ((n = n.next) !== s)
									n.callback.apply(n.context || this, o)
							}
						}
						return this
					}
				};
				l.bind = l.on,
				l.unbind = l.off;
				var c = o.Model = function (e, t) {
					var n;
					e || (e = {}),
					t && t.parse && (e = this.parse(e));
					if (n = L(this, "defaults"))
						e = u.extend({}, n, e);
					t && t.collection && (this.collection = t.collection),
					this.attributes = {},
					this._escapedAttributes = {},
					this.cid = u.uniqueId("c"),
					this.changed = {},
					this._silent = {},
					this._pending = {},
					this.set(e, {
						silent : !0
					}),
					this.changed = {},
					this._silent = {},
					this._pending = {},
					this._previousAttributes = u.clone(this.attributes),
					this.initialize.apply(this, arguments)
				};
				u.extend(c.prototype, l, {
					changed : null,
					_silent : null,
					_pending : null,
					idAttribute : "id",
					initialize : function () {},
					toJSON : function (e) {
						return u.clone(this.attributes)
					},
					get : function (e) {
						return this.attributes[e]
					},
					escape : function (e) {
						var t;
						if (t = this._escapedAttributes[e])
							return t;
						var n = this.get(e);
						return this._escapedAttributes[e] = u.escape(n == null ? "" : "" + n)
					},
					has : function (e) {
						return this.get(e) != null
					},
					set : function (e, t, n) {
						var r,
						i,
						s;
						u.isObject(e) || e == null ? (r = e, n = t) : (r = {}, r[e] = t),
						n || (n = {});
						if (!r)
							return this;
						r instanceof c && (r = r.attributes);
						if (n.unset)
							for (i in r)
								r[i] = void 0;
						if (!this._validate(r, n))
							return !1;
						this.idAttribute in r && (this.id = r[this.idAttribute]);
						var o = n.changes = {},
						a = this.attributes,
						f = this._escapedAttributes,
						l = this._previousAttributes || {};
						for (i in r) {
							s = r[i];
							if (!u.isEqual(a[i], s) || n.unset && u.has(a, i))
								delete f[i], (n.silent ? this._silent : o)[i] = !0;
							n.unset ? delete a[i] : a[i] = s,
							!u.isEqual(l[i], s) || u.has(a, i) != u.has(l, i) ? (this.changed[i] = s, n.silent || (this._pending[i] = !0)) : (delete this.changed[i], delete this._pending[i])
						}
						return n.silent || this.change(n),
						this
					},
					unset : function (e, t) {
						return (t || (t = {})).unset = !0,
						this.set(e, null, t)
					},
					clear : function (e) {
						return (e || (e = {})).unset = !0,
						this.set(u.clone(this.attributes), e)
					},
					fetch : function (e) {
						e = e ? u.clone(e) : {};
						var t = this,
						n = e.success;
						return e.success = function (r, i, s) {
							if (!t.set(t.parse(r, s), e))
								return !1;
							n && n(t, r)
						},
						e.error = o.wrapError(e.error, t, e),
						(this.sync || o.sync).call(this, "read", this, e)
					},
					save : function (e, t, n) {
						var r,
						i;
						u.isObject(e) || e == null ? (r = e, n = t) : (r = {}, r[e] = t),
						n = n ? u.clone(n) : {};
						if (n.wait) {
							if (!this._validate(r, n))
								return !1;
							i = u.clone(this.attributes)
						}
						var s = u.extend({}, n, {
								silent : !0
							});
						if (r && !this.set(r, n.wait ? s : n))
							return !1;
						var a = this,
						f = n.success;
						n.success = function (e, t, i) {
							var s = a.parse(e, i);
							n.wait && (delete n.wait, s = u.extend(r || {}, s));
							if (!a.set(s, n))
								return !1;
							f ? f(a, e) : a.trigger("sync", a, e, n)
						},
						n.error = o.wrapError(n.error, a, n);
						var l = this.isNew() ? "create" : "update",
						c = (this.sync || o.sync).call(this, l, this, n);
						return n.wait && this.set(i, s),
						c
					},
					destroy : function (e) {
						e = e ? u.clone(e) : {};
						var t = this,
						n = e.success,
						r = function () {
							t.trigger("destroy", t, t.collection, e)
						};
						if (this.isNew())
							return r(), !1;
						e.success = function (i) {
							e.wait && r(),
							n ? n(t, i) : t.trigger("sync", t, i, e)
						},
						e.error = o.wrapError(e.error, t, e);
						var i = (this.sync || o.sync).call(this, "delete", this, e);
						return e.wait || r(),
						i
					},
					url : function () {
						var e = L(this, "urlRoot") || L(this.collection, "url") || A();
						return this.isNew() ? e : e + (e.charAt(e.length - 1) == "/" ? "" : "/") + encodeURIComponent(this.id)
					},
					parse : function (e, t) {
						return e
					},
					clone : function () {
						return new this.constructor(this.attributes)
					},
					isNew : function () {
						return this.id == null
					},
					change : function (e) {
						e || (e = {});
						var t = this._changing;
						this._changing = !0;
						for (var n in this._silent)
							this._pending[n] = !0;
						var r = u.extend({}, e.changes, this._silent);
						this._silent = {};
						for (var n in r)
							this.trigger("change:" + n, this, this.get(n), e);
						if (t)
							return this;
						while (!u.isEmpty(this._pending)) {
							this._pending = {},
							this.trigger("change", this, e);
							for (var n in this.changed) {
								if (this._pending[n] || this._silent[n])
									continue;
								delete this.changed[n]
							}
							this._previousAttributes = u.clone(this.attributes)
						}
						return this._changing = !1,
						this
					},
					hasChanged : function (e) {
						return arguments.length ? u.has(this.changed, e) : !u.isEmpty(this.changed)
					},
					changedAttributes : function (e) {
						if (!e)
							return this.hasChanged() ? u.clone(this.changed) : !1;
						var t,
						n = !1,
						r = this._previousAttributes;
						for (var i in e) {
							if (u.isEqual(r[i], t = e[i]))
								continue;
							(n || (n = {}))[i] = t
						}
						return n
					},
					previous : function (e) {
						return !arguments.length || !this._previousAttributes ? null : this._previousAttributes[e]
					},
					previousAttributes : function () {
						return u.clone(this._previousAttributes)
					},
					isValid : function () {
						return !this.validate(this.attributes)
					},
					_validate : function (e, t) {
						if (t.silent || !this.validate)
							return !0;
						e = u.extend({}, this.attributes, e);
						var n = this.validate(e, t);
						return n ? (t && t.error ? t.error(this, n, t) : this.trigger("error", this, n, t), !1) : !0
					}
				});
				var h = o.Collection = function (e, t) {
					t || (t = {}),
					t.model && (this.model = t.model),
					t.comparator && (this.comparator = t.comparator),
					this._reset(),
					this.initialize.apply(this, arguments),
					e && this.reset(e, {
						silent : !0,
						parse : t.parse
					})
				};
				u.extend(h.prototype, l, {
					model : c,
					initialize : function () {},
					toJSON : function (e) {
						return this.map(function (t) {
							return t.toJSON(e)
						})
					},
					add : function (e, t) {
						var n,
						r,
						i,
						o,
						a,
						f,
						l = {},
						c = {},
						h = [];
						t || (t = {}),
						e = u.isArray(e) ? e.slice() : [e];
						for (n = 0, i = e.length; n < i; n++) {
							if (!(o = e[n] = this._prepareModel(e[n], t)))
								throw new Error("Can't add an invalid model to a collection");
							a = o.cid,
							f = o.id;
							if (l[a] || this._byCid[a] || f != null && (c[f] || this._byId[f])) {
								h.push(n);
								continue
							}
							l[a] = c[f] = o
						}
						n = h.length;
						while (n--)
							e.splice(h[n], 1);
						for (n = 0, i = e.length; n < i; n++)
							(o = e[n]).on("all", this._onModelEvent, this), this._byCid[o.cid] = o, o.id != null && (this._byId[o.id] = o);
						this.length += i,
						r = t.at != null ? t.at : this.models.length,
						s.apply(this.models, [r, 0].concat(e)),
						this.comparator && this.sort({
							silent : !0
						});
						if (t.silent)
							return this;
						for (n = 0, i = this.models.length; n < i; n++) {
							if (!l[(o = this.models[n]).cid])
								continue;
							t.index = n,
							o.trigger("add", o, this, t)
						}
						return this
					},
					remove : function (e, t) {
						var n,
						r,
						i,
						s;
						t || (t = {}),
						e = u.isArray(e) ? e.slice() : [e];
						for (n = 0, r = e.length; n < r; n++) {
							s = this.getByCid(e[n]) || this.get(e[n]);
							if (!s)
								continue;
							delete this._byId[s.id],
							delete this._byCid[s.cid],
							i = this.indexOf(s),
							this.models.splice(i, 1),
							this.length--,
							t.silent || (t.index = i, s.trigger("remove", s, this, t)),
							this._removeReference(s)
						}
						return this
					},
					push : function (e, t) {
						return e = this._prepareModel(e, t),
						this.add(e, t),
						e
					},
					pop : function (e) {
						var t = this.at(this.length - 1);
						return this.remove(t, e),
						t
					},
					unshift : function (e, t) {
						return e = this._prepareModel(e, t),
						this.add(e, u.extend({
								at : 0
							}, t)),
						e
					},
					shift : function (e) {
						var t = this.at(0);
						return this.remove(t, e),
						t
					},
					get : function (e) {
						return e == null ? void 0 : this._byId[e.id != null ? e.id : e]
					},
					getByCid : function (e) {
						return e && this._byCid[e.cid || e]
					},
					at : function (e) {
						return this.models[e]
					},
					where : function (e) {
						return u.isEmpty(e) ? [] : this.filter(function (t) {
							for (var n in e)
								if (e[n] !== t.get(n))
									return !1;
							return !0
						})
					},
					sort : function (e) {
						e || (e = {});
						if (!this.comparator)
							throw new Error("Cannot sort a set without a comparator");
						var t = u.bind(this.comparator, this);
						return this.comparator.length == 1 ? this.models = this.sortBy(t) : this.models.sort(t),
						e.silent || this.trigger("reset", this, e),
						this
					},
					pluck : function (e) {
						return u.map(this.models, function (t) {
							return t.get(e)
						})
					},
					reset : function (e, t) {
						e || (e = []),
						t || (t = {});
						for (var n = 0, r = this.models.length; n < r; n++)
							this._removeReference(this.models[n]);
						return this._reset(),
						this.add(e, u.extend({
								silent : !0
							}, t)),
						t.silent || this.trigger("reset", this, t),
						this
					},
					fetch : function (e) {
						e = e ? u.clone(e) : {},
						e.parse === undefined && (e.parse = !0);
						var t = this,
						n = e.success;
						return e.success = function (r, i, s) {
							t[e.add ? "add" : "reset"](t.parse(r, s), e),
							n && n(t, r)
						},
						e.error = o.wrapError(e.error, t, e),
						(this.sync || o.sync).call(this, "read", this, e)
					},
					create : function (e, t) {
						var n = this;
						t = t ? u.clone(t) : {},
						e = this._prepareModel(e, t);
						if (!e)
							return !1;
						t.wait || n.add(e, t);
						var r = t.success;
						return t.success = function (i, s, o) {
							t.wait && n.add(i, t),
							r ? r(i, s) : i.trigger("sync", e, s, t)
						},
						e.save(null, t),
						e
					},
					parse : function (e, t) {
						return e
					},
					chain : function () {
						return u(this.models).chain()
					},
					_reset : function (e) {
						this.length = 0,
						this.models = [],
						this._byId = {},
						this._byCid = {}

					},
					_prepareModel : function (e, t) {
						t || (t = {});
						if (e instanceof c)
							e.collection || (e.collection = this);
						else {
							var n = e;
							t.collection = this,
							e = new this.model(n, t),
							e._validate(e.attributes, t) || (e = !1)
						}
						return e
					},
					_removeReference : function (e) {
						this == e.collection && delete e.collection,
						e.off("all", this._onModelEvent, this)
					},
					_onModelEvent : function (e, t, n, r) {
						if ((e == "add" || e == "remove") && n != this)
							return;
						e == "destroy" && this.remove(t, r),
						t && e === "change:" + t.idAttribute && (delete this._byId[t.previous(t.idAttribute)], this._byId[t.id] = t),
						this.trigger.apply(this, arguments)
					}
				});
				var p = ["forEach", "each", "map", "reduce", "reduceRight", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortBy", "sortedIndex", "toArray", "size", "first", "initial", "rest", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "groupBy"];
				u.each(p, function (e) {
					h.prototype[e] = function () {
						return u[e].apply(u, [this.models].concat(u.toArray(arguments)))
					}
				});
				var d = o.Router = function (e) {
					e || (e = {}),
					e.routes && (this.routes = e.routes),
					this._bindRoutes(),
					this.initialize.apply(this, arguments)
				},
				v = /:\w+/g,
				m = /\*\w+/g,
				g = /[-[\]{}()+?.,\\^$|#\s]/g;
				u.extend(d.prototype, l, {
					initialize : function () {},
					route : function (e, t, n) {
						return o.history || (o.history = new y),
						u.isRegExp(e) || (e = this._routeToRegExp(e)),
						n || (n = this[t]),
						o.history.route(e, u.bind(function (r) {
								var i = this._extractParameters(e, r);
								n && n.apply(this, i),
								this.trigger.apply(this, ["route:" + t].concat(i)),
								o.history.trigger("route", this, t, i)
							}, this)),
						this
					},
					navigate : function (e, t) {
						o.history.navigate(e, t)
					},
					_bindRoutes : function () {
						if (!this.routes)
							return;
						var e = [];
						for (var t in this.routes)
							e.unshift([t, this.routes[t]]);
						for (var n = 0, r = e.length; n < r; n++)
							this.route(e[n][0], e[n][1], this[e[n][1]])
					},
					_routeToRegExp : function (e) {
						return e = e.replace(g, "\\$&").replace(v, "([^/]+)").replace(m, "(.*?)"),
						new RegExp("^" + e + "$")
					},
					_extractParameters : function (e, t) {
						return e.exec(t).slice(1)
					}
				});
				var y = o.History = function () {
					this.handlers = [],
					u.bindAll(this, "checkUrl")
				},
				b = /^[#\/]/,
				w = /msie [\w.]+/;
				y.started = !1,
				u.extend(y.prototype, l, {
					interval : 50,
					getHash : function (e) {
						var t = e ? e.location : window.location,
						n = t.href.match(/#(.*)$/);
						return n ? n[1] : ""
					},
					getFragment : function (e, t) {
						if (e == null)
							if (this._hasPushState || t) {
								e = window.location.pathname;
								var n = window.location.search;
								n && (e += n)
							} else
								e = this.getHash();
						return e.indexOf(this.options.root) || (e = e.substr(this.options.root.length)),
						e.replace(b, "")
					},
					start : function (e) {
						if (y.started)
							throw new Error("Backbone.history has already been started");
						y.started = !0,
						this.options = u.extend({}, {
								root : "/"
							}, this.options, e),
						this._wantsHashChange = this.options.hashChange !== !1,
						this._wantsPushState = !!this.options.pushState,
						this._hasPushState = !!(this.options.pushState && window.history && window.history.pushState);
						var t = this.getFragment(),
						n = document.documentMode,
						r = w.exec(navigator.userAgent.toLowerCase()) && (!n || n <= 7);
						r && (this.iframe = a('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(t)),
						this._hasPushState ? a(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !r ? a(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)),
						this.fragment = t;
						var i = window.location,
						s = i.pathname == this.options.root;
						if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !s)
							return this.fragment = this.getFragment(null, !0), window.location.replace(this.options.root + "#" + this.fragment), !0;
						this._wantsPushState && this._hasPushState && s && i.hash && (this.fragment = this.getHash().replace(b, ""), window.history.replaceState({}, document.title, i.protocol + "//" + i.host + this.options.root + this.fragment));
						if (!this.options.silent)
							return this.loadUrl()
					},
					stop : function () {
						a(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl),
						clearInterval(this._checkUrlInterval),
						y.started = !1
					},
					route : function (e, t) {
						this.handlers.unshift({
							route : e,
							callback : t
						})
					},
					checkUrl : function (e) {
						var t = this.getFragment();
						t == this.fragment && this.iframe && (t = this.getFragment(this.getHash(this.iframe)));
						if (t == this.fragment)
							return !1;
						this.iframe && this.navigate(t),
						this.loadUrl() || this.loadUrl(this.getHash())
					},
					loadUrl : function (e) {
						var t = this.fragment = this.getFragment(e),
						n = u.any(this.handlers, function (e) {
								if (e.route.test(t))
									return e.callback(t), !0
							});
						return n
					},
					navigate : function (e, t) {
						if (!y.started)
							return !1;
						if (!t || t === !0)
							t = {
								trigger : t
							};
						var n = (e || "").replace(b, "");
						if (this.fragment == n)
							return;
						this._hasPushState ? (n.indexOf(this.options.root) != 0 && (n = this.options.root + n), this.fragment = n, window.history[t.replace ? "replaceState" : "pushState"]({}, document.title, n)) : this._wantsHashChange ? (this.fragment = n, this._updateHash(window.location, n, t.replace), this.iframe && n != this.getFragment(this.getHash(this.iframe)) && (t.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, n, t.replace))) : window.location.assign(this.options.root + e),
						t.trigger && this.loadUrl(e)
					},
					_updateHash : function (e, t, n) {
						n ? e.replace(e.toString().replace(/(javascript:|#).*$/, "") + "#" + t) : e.hash = t
					}
				});
				var E = o.View = function (e) {
					this.cid = u.uniqueId("view"),
					this._configure(e || {}),
					this._ensureElement(),
					this.initialize.apply(this, arguments),
					this.delegateEvents()
				},
				S = /^(\S+)\s*(.*)$/,
				x = ["model", "collection", "el", "id", "attributes", "className", "tagName"];
				u.extend(E.prototype, l, {
					tagName : "div",
					$ : function (e) {
						return this.$el.find(e)
					},
					initialize : function () {},
					render : function () {
						return this
					},
					remove : function () {
						return this.$el.remove(),
						this
					},
					make : function (e, t, n) {
						var r = document.createElement(e);
						return t && a(r).attr(t),
						n != null && a(r).html(n),
						r
					},
					setElement : function (e, t) {
						return this.$el && this.undelegateEvents(),
						this.$el = e instanceof a ? e : a(e),
						this.el = this.$el[0],
						t !== !1 && this.delegateEvents(),
						this
					},
					delegateEvents : function (e) {
						if (!e && !(e = L(this, "events")))
							return;
						this.undelegateEvents();
						for (var t in e) {
							var n = e[t];
							u.isFunction(n) || (n = this[e[t]]);
							if (!n)
								throw new Error('Method "' + e[t] + '" does not exist');
							var r = t.match(S),
							i = r[1],
							s = r[2];
							n = u.bind(n, this),
							i += ".delegateEvents" + this.cid,
							s === "" ? this.$el.bind(i, n) : this.$el.delegate(s, i, n)
						}
					},
					undelegateEvents : function () {
						this.$el.unbind(".delegateEvents" + this.cid)
					},
					_configure : function (e) {
						this.options && (e = u.extend({}, this.options, e));
						for (var t = 0, n = x.length; t < n; t++) {
							var r = x[t];
							e[r] && (this[r] = e[r])
						}
						this.options = e
					},
					_ensureElement : function () {
						if (!this.el) {
							var e = L(this, "attributes") || {};
							this.id && (e.id = this.id),
							this.className && (e["class"] = this.className),
							this.setElement(this.make(this.tagName, e), !1)
						} else
							this.setElement(this.el, !1)
					}
				});
				var T = function (e, t) {
					var n = k(this, e, t);
					return n.extend = this.extend,
					n
				};
				c.extend = h.extend = d.extend = E.extend = T;
				var N = {
					create : "POST",
					update : "PUT",
					"delete" : "DELETE",
					read : "GET"
				};
				o.sync = function (e, t, n) {
					var r = N[e];
					n || (n = {});
					var i = {
						type : r,
						dataType : "json"
					};
					return n.url || (i.url = L(t, "url") || A()),
					!n.data && t && (e == "create" || e == "update") && (i.contentType = "application/json", i.data = JSON.stringify(t.toJSON())),
					o.emulateJSON && (i.contentType = "application/x-www-form-urlencoded", i.data = i.data ? {
							model : i.data
						}
						 : {}),
					o.emulateHTTP && (r === "PUT" || r === "DELETE") && (o.emulateJSON && (i.data._method = r), i.type = "POST", i.beforeSend = function (e) {
						e.setRequestHeader("X-HTTP-Method-Override", r)
					}),
					i.type !== "GET" && !o.emulateJSON && (i.processData = !1),
					a.ajax(u.extend(i, n))
				},
				o.wrapError = function (e, t, n) {
					return function (r, i) {
						i = r === t ? i : r,
						e ? e(t, i, n) : t.trigger("error", t, i, n)
					}
				};
				var C = function () {},
				k = function (e, t, n) {
					var r;
					return t && t.hasOwnProperty("constructor") ? r = t.constructor : r = function () {
						e.apply(this, arguments)
					},
					u.extend(r, e),
					C.prototype = e.prototype,
					r.prototype = new C,
					t && u.extend(r.prototype, t),
					n && u.extend(r, n),
					r.prototype.constructor = r,
					r.__super__ = e.prototype,
					r
				},
				L = function (e, t) {
					return !e || !e[t] ? null : u.isFunction(e[t]) ? e[t]() : e[t]
				},
				A = function () {
					throw new Error('A "url" property or function must be specified')
				};
				return o
			}
			t == null && (t = {}),
			t.exports = r(this)
		}
		(this)
	}),
	e.define("/node_modules/backbone-browserify/node_modules/underscore/package.json", function (e, t, n, r, i, s) {
		t.exports = {
			main : "underscore.js"
		}
	}),
	e.define("/node_modules/backbone-browserify/node_modules/underscore/underscore.js", function (e, t, n, r, i, s) {
		(function () {
			function L(e, t, n) {
				if (e === t)
					return e !== 0 || 1 / e == 1 / t;
				if (e == null || t == null)
					return e === t;
				e._chain && (e = e._wrapped),
				t._chain && (t = t._wrapped);
				if (e.isEqual && T.isFunction(e.isEqual))
					return e.isEqual(t);
				if (t.isEqual && T.isFunction(t.isEqual))
					return t.isEqual(e);
				var r = l.call(e);
				if (r != l.call(t))
					return !1;
				switch (r) {
				case "[object String]":
					return e == String(t);
				case "[object Number]":
					return e != +e ? t != +t : e == 0 ? 1 / e == 1 / t : e == +t;
				case "[object Date]":
				case "[object Boolean]":
					return +e == +t;
				case "[object RegExp]":
					return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
				}
				if (typeof e != "object" || typeof t != "object")
					return !1;
				var i = n.length;
				while (i--)
					if (n[i] == e)
						return !0;
				n.push(e);
				var s = 0,
				o = !0;
				if (r == "[object Array]") {
					s = e.length,
					o = s == t.length;
					if (o)
						while (s--)
							if (!(o = s in e == s in t && L(e[s], t[s], n)))
								break
				} else {
					if ("constructor" in e != "constructor" in t || e.constructor != t.constructor)
						return !1;
					for (var u in e)
						if (T.has(e, u)) {
							s++;
							if (!(o = T.has(t, u) && L(e[u], t[u], n)))
								break
						}
					if (o) {
						for (u in t)
							if (T.has(t, u) && !(s--))
								break;
						o = !s
					}
				}
				return n.pop(),
				o
			}
			var e = this,
			r = e._,
			i = {},
			s = Array.prototype,
			o = Object.prototype,
			u = Function.prototype,
			a = s.slice,
			f = s.unshift,
			l = o.toString,
			c = o.hasOwnProperty,
			h = s.forEach,
			p = s.map,
			d = s.reduce,
			v = s.reduceRight,
			m = s.filter,
			g = s.every,
			y = s.some,
			b = s.indexOf,
			w = s.lastIndexOf,
			E = Array.isArray,
			S = Object.keys,
			x = u.bind,
			T = function (e) {
				return new B(e)
			};
			typeof n != "undefined" ? (typeof t != "undefined" && t.exports && (n = t.exports = T), n._ = T) : e._ = T,
			T.VERSION = "1.3.3";
			var N = T.each = T.forEach = function (e, t, n) {
				if (e == null)
					return;
				if (h && e.forEach === h)
					e.forEach(t, n);
				else if (e.length === +e.length) {
					for (var r = 0, s = e.length; r < s; r++)
						if (r in e && t.call(n, e[r], r, e) === i)
							return
				} else
					for (var o in e)
						if (T.has(e, o) && t.call(n, e[o], o, e) === i)
							return
			};
			T.map = T.collect = function (e, t, n) {
				var r = [];
				return e == null ? r : p && e.map === p ? e.map(t, n) : (N(e, function (e, i, s) {
						r[r.length] = t.call(n, e, i, s)
					}), e.length === +e.length && (r.length = e.length), r)
			},
			T.reduce = T.foldl = T.inject = function (e, t, n, r) {
				var i = arguments.length > 2;
				e == null && (e = []);
				if (d && e.reduce === d)
					return r && (t = T.bind(t, r)), i ? e.reduce(t, n) : e.reduce(t);
				N(e, function (e, s, o) {
					i ? n = t.call(r, n, e, s, o) : (n = e, i = !0)
				});
				if (!i)
					throw new TypeError("Reduce of empty array with no initial value");
				return n
			},
			T.reduceRight = T.foldr = function (e, t, n, r) {
				var i = arguments.length > 2;
				e == null && (e = []);
				if (v && e.reduceRight === v)
					return r && (t = T.bind(t, r)), i ? e.reduceRight(t, n) : e.reduceRight(t);
				var s = T.toArray(e).reverse();
				return r && !i && (t = T.bind(t, r)),
				i ? T.reduce(s, t, n, r) : T.reduce(s, t)
			},
			T.find = T.detect = function (e, t, n) {
				var r;
				return C(e, function (e, i, s) {
					if (t.call(n, e, i, s))
						return r = e, !0
				}),
				r
			},
			T.filter = T.select = function (e, t, n) {
				var r = [];
				return e == null ? r : m && e.filter === m ? e.filter(t, n) : (N(e, function (e, i, s) {
						t.call(n, e, i, s) && (r[r.length] = e)
					}), r)
			},
			T.reject = function (e, t, n) {
				var r = [];
				return e == null ? r : (N(e, function (e, i, s) {
						t.call(n, e, i, s) || (r[r.length] = e)
					}), r)
			},
			T.every = T.all = function (e, t, n) {
				var r = !0;
				return e == null ? r : g && e.every === g ? e.every(t, n) : (N(e, function (e, s, o) {
						if (!(r = r && t.call(n, e, s, o)))
							return i
					}), !!r)
			};
			var C = T.some = T.any = function (e, t, n) {
				t || (t = T.identity);
				var r = !1;
				return e == null ? r : y && e.some === y ? e.some(t, n) : (N(e, function (e, s, o) {
						if (r || (r = t.call(n, e, s, o)))
							return i
					}), !!r)
			};
			T.include = T.contains = function (e, t) {
				var n = !1;
				return e == null ? n : b && e.indexOf === b ? e.indexOf(t) != -1 : (n = C(e, function (e) {
							return e === t
						}), n)
			},
			T.invoke = function (e, t) {
				var n = a.call(arguments, 2);
				return T.map(e, function (e) {
					return (T.isFunction(t) ? t || e : e[t]).apply(e, n)
				})
			},
			T.pluck = function (e, t) {
				return T.map(e, function (e) {
					return e[t]
				})
			},
			T.max = function (e, t, n) {
				if (!t && T.isArray(e) && e[0] === +e[0])
					return Math.max.apply(Math, e);
				if (!t && T.isEmpty(e))
					return -Infinity;
				var r = {
					computed : -Infinity
				};
				return N(e, function (e, i, s) {
					var o = t ? t.call(n, e, i, s) : e;
					o >= r.computed && (r = {
							value : e,
							computed : o
						})
				}),
				r.value
			},
			T.min = function (e, t, n) {
				if (!t && T.isArray(e) && e[0] === +e[0])
					return Math.min.apply(Math, e);
				if (!t && T.isEmpty(e))
					return Infinity;
				var r = {
					computed : Infinity
				};
				return N(e, function (e, i, s) {
					var o = t ? t.call(n, e, i, s) : e;
					o < r.computed && (r = {
							value : e,
							computed : o
						})
				}),
				r.value
			},
			T.shuffle = function (e) {
				var t = [],
				n;
				return N(e, function (e, r, i) {
					n = Math.floor(Math.random() * (r + 1)),
					t[r] = t[n],
					t[n] = e
				}),
				t
			},
			T.sortBy = function (e, t, n) {
				var r = T.isFunction(t) ? t : function (e) {
					return e[t]
				};
				return T.pluck(T.map(e, function (e, t, i) {
						return {
							value : e,
							criteria : r.call(n, e, t, i)
						}
					}).sort(function (e, t) {
						var n = e.criteria,
						r = t.criteria;
						return n === void 0 ? 1 : r === void 0 ? -1 : n < r ? -1 : n > r ? 1 : 0
					}), "value")
			},
			T.groupBy = function (e, t) {
				var n = {},
				r = T.isFunction(t) ? t : function (e) {
					return e[t]
				};
				return N(e, function (e, t) {
					var i = r(e, t);
					(n[i] || (n[i] = [])).push(e)
				}),
				n
			},
			T.sortedIndex = function (e, t, n) {
				n || (n = T.identity);
				var r = 0,
				i = e.length;
				while (r < i) {
					var s = r + i >> 1;
					n(e[s]) < n(t) ? r = s + 1 : i = s
				}
				return r
			},
			T.toArray = function (e) {
				return e ? T.isArray(e) ? a.call(e) : T.isArguments(e) ? a.call(e) : e.toArray && T.isFunction(e.toArray) ? e.toArray() : T.values(e) : []
			},
			T.size = function (e) {
				return T.isArray(e) ? e.length : T.keys(e).length
			},
			T.first = T.head = T.take = function (e, t, n) {
				return t != null && !n ? a.call(e, 0, t) : e[0]
			},
			T.initial = function (e, t, n) {
				return a.call(e, 0, e.length - (t == null || n ? 1 : t))
			},
			T.last = function (e, t, n) {
				return t != null && !n ? a.call(e, Math.max(e.length - t, 0)) : e[e.length - 1]
			},
			T.rest = T.tail = function (e, t, n) {
				return a.call(e, t == null || n ? 1 : t)
			},
			T.compact = function (e) {
				return T.filter(e, function (e) {
					return !!e
				})
			},
			T.flatten = function (e, t) {
				return T.reduce(e, function (e, n) {
					return T.isArray(n) ? e.concat(t ? n : T.flatten(n)) : (e[e.length] = n, e)
				}, [])
			},
			T.without = function (e) {
				return T.difference(e, a.call(arguments, 1))
			},
			T.uniq = T.unique = function (e, t, n) {
				var r = n ? T.map(e, n) : e,
				i = [];
				return e.length < 3 && (t = !0),
				T.reduce(r, function (n, r, s) {
					if (t ? T.last(n) !== r || !n.length : !T.include(n, r))
						n.push(r), i.push(e[s]);
					return n
				}, []),
				i
			},
			T.union = function () {
				return T.uniq(T.flatten(arguments, !0))
			},
			T.intersection = T.intersect = function (e) {
				var t = a.call(arguments, 1);
				return T.filter(T.uniq(e), function (e) {
					return T.every(t, function (t) {
						return T.indexOf(t, e) >= 0
					})
				})
			},
			T.difference = function (e) {
				var t = T.flatten(a.call(arguments, 1), !0);
				return T.filter(e, function (e) {
					return !T.include(t, e)
				})
			},
			T.zip = function () {
				var e = a.call(arguments),
				t = T.max(T.pluck(e, "length")),
				n = new Array(t);
				for (var r = 0; r < t; r++)
					n[r] = T.pluck(e, "" + r);
				return n
			},
			T.indexOf = function (e, t, n) {
				if (e == null)
					return -1;
				var r,
				i;
				if (n)
					return r = T.sortedIndex(e, t), e[r] === t ? r : -1;
				if (b && e.indexOf === b)
					return e.indexOf(t);
				for (r = 0, i = e.length; r < i; r++)
					if (r in e && e[r] === t)
						return r;
				return -1
			},
			T.lastIndexOf = function (e, t) {
				if (e == null)
					return -1;
				if (w && e.lastIndexOf === w)
					return e.lastIndexOf(t);
				var n = e.length;
				while (n--)
					if (n in e && e[n] === t)
						return n;
				return -1
			},
			T.range = function (e, t, n) {
				arguments.length <= 1 && (t = e || 0, e = 0),
				n = arguments[2] || 1;
				var r = Math.max(Math.ceil((t - e) / n), 0),
				i = 0,
				s = new Array(r);
				while (i < r)
					s[i++] = e, e += n;
				return s
			};
			var k = function () {};
			T.bind = function (t, n) {
				var r,
				i;
				if (t.bind === x && x)
					return x.apply(t, a.call(arguments, 1));
				if (!T.isFunction(t))
					throw new TypeError;
				return i = a.call(arguments, 2),
				r = function () {
					if (this instanceof r) {
						k.prototype = t.prototype;
						var e = new k,
						s = t.apply(e, i.concat(a.call(arguments)));
						return Object(s) === s ? s : e
					}
					return t.apply(n, i.concat(a.call(arguments)))
				}
			},
			T.bindAll = function (e) {
				var t = a.call(arguments, 1);
				return t.length == 0 && (t = T.functions(e)),
				N(t, function (t) {
					e[t] = T.bind(e[t], e)
				}),
				e
			},
			T.memoize = function (e, t) {
				var n = {};
				return t || (t = T.identity),
				function () {
					var r = t.apply(this, arguments);
					return T.has(n, r) ? n[r] : n[r] = e.apply(this, arguments)
				}
			},
			T.delay = function (e, t) {
				var n = a.call(arguments, 2);
				return setTimeout(function () {
					return e.apply(null, n)
				}, t)
			},
			T.defer = function (e) {
				return T.delay.apply(T, [e, 1].concat(a.call(arguments, 1)))
			},
			T.throttle = function (e, t) {
				var n,
				r,
				i,
				s,
				o,
				u,
				a = T.debounce(function () {
						o = s = !1
					}, t);
				return function () {
					n = this,
					r = arguments;
					var f = function () {
						i = null,
						o && e.apply(n, r),
						a()
					};
					return i || (i = setTimeout(f, t)),
					s ? o = !0 : u = e.apply(n, r),
					a(),
					s = !0,
					u
				}
			},
			T.debounce = function (e, t, n) {
				var r;
				return function () {
					var i = this,
					s = arguments,
					o = function () {
						r = null,
						n || e.apply(i, s)
					};
					n && !r && e.apply(i, s),
					clearTimeout(r),
					r = setTimeout(o, t)
				}
			},
			T.once = function (e) {
				var t = !1,
				n;
				return function () {
					return t ? n : (t = !0, n = e.apply(this, arguments))
				}
			},
			T.wrap = function (e, t) {
				return function () {
					var n = [e].concat(a.call(arguments, 0));
					return t.apply(this, n)
				}
			},
			T.compose = function () {
				var e = arguments;
				return function () {
					var t = arguments;
					for (var n = e.length - 1; n >= 0; n--)
						t = [e[n].apply(this, t)];
					return t[0]
				}
			},
			T.after = function (e, t) {
				return e <= 0 ? t() : function () {
					if (--e < 1)
						return t.apply(this, arguments)
				}
			},
			T.keys = S || function (e) {
				if (e !== Object(e))
					throw new TypeError("Invalid object");
				var t = [];
				for (var n in e)
					T.has(e, n) && (t[t.length] = n);
				return t
			},
			T.values = function (e) {
				return T.map(e, T.identity)
			},
			T.functions = T.methods = function (e) {
				var t = [];
				for (var n in e)
					T.isFunction(e[n]) && t.push(n);
				return t.sort()
			},
			T.extend = function (e) {
				return N(a.call(arguments, 1), function (t) {
					for (var n in t)
						e[n] = t[n]
				}),
				e
			},
			T.pick = function (e) {
				var t = {};
				return N(T.flatten(a.call(arguments, 1)), function (n) {
					n in e && (t[n] = e[n])
				}),
				t
			},
			T.defaults = function (e) {
				return N(a.call(arguments, 1), function (t) {
					for (var n in t)
						e[n] == null && (e[n] = t[n])
				}),
				e
			},
			T.clone = function (e) {
				return T.isObject(e) ? T.isArray(e) ? e.slice() : T.extend({}, e) : e
			},
			T.tap = function (e, t) {
				return t(e),
				e
			},
			T.isEqual = function (e, t) {
				return L(e, t, [])
			},
			T.isEmpty = function (e) {
				if (e == null)
					return !0;
				if (T.isArray(e) || T.isString(e))
					return e.length === 0;
				for (var t in e)
					if (T.has(e, t))
						return !1;
				return !0
			},
			T.isElement = function (e) {
				return !!e && e.nodeType == 1
			},
			T.isArray = E || function (e) {
				return l.call(e) == "[object Array]"
			},
			T.isObject = function (e) {
				return e === Object(e)
			},
			T.isArguments = function (e) {
				return l.call(e) == "[object Arguments]"
			},
			T.isArguments(arguments) || (T.isArguments = function (e) {
				return !!e && !!T.has(e, "callee")
			}),
			T.isFunction = function (e) {
				return l.call(e) == "[object Function]"
			},
			T.isString = function (e) {
				return l.call(e) == "[object String]"
			},
			T.isNumber = function (e) {
				return l.call(e) == "[object Number]"
			},
			T.isFinite = function (e) {
				return T.isNumber(e) && isFinite(e)
			},
			T.isNaN = function (e) {
				return e !== e
			},
			T.isBoolean = function (e) {
				return e === !0 || e === !1 || l.call(e) == "[object Boolean]"
			},
			T.isDate = function (e) {
				return l.call(e) == "[object Date]"
			},
			T.isRegExp = function (e) {
				return l.call(e) == "[object RegExp]"
			},
			T.isNull = function (e) {
				return e === null
			},
			T.isUndefined = function (e) {
				return e === void 0
			},
			T.has = function (e, t) {
				return c.call(e, t)
			},
			T.noConflict = function () {
				return e._ = r,
				this
			},
			T.identity = function (e) {
				return e
			},
			T.times = function (e, t, n) {
				for (var r = 0; r < e; r++)
					t.call(n, r)
			},
			T.escape = function (e) {
				return ("" + e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
			},
			T.result = function (e, t) {
				if (e == null)
					return null;
				var n = e[t];
				return T.isFunction(n) ? n.call(e) : n
			},
			T.mixin = function (e) {
				N(T.functions(e), function (t) {
					F(t, T[t] = e[t])
				})
			};
			var A = 0;
			T.uniqueId = function (e) {
				var t = A++;
				return e ? e + t : t
			},
			T.templateSettings = {
				evaluate : /<%([\s\S]+?)%>/g,
				interpolate : /<%=([\s\S]+?)%>/g,
				escape : /<%-([\s\S]+?)%>/g
			};
			var O = /.^/,
			M = {
				"\\" : "\\",
				"'" : "'",
				r : "\r",
				n : "\n",
				t : "	",
				u2028 : "\u2028",
				u2029 : "\u2029"
			};
			for (var _ in M)
				M[M[_]] = _;
			var D = /\\|'|\r|\n|\t|\u2028|\u2029/g,
			P = /\\(\\|'|r|n|t|u2028|u2029)/g,
			H = function (e) {
				return e.replace(P, function (e, t) {
					return M[t]
				})
			};
			T.template = function (e, t, n) {
				n = T.defaults(n || {}, T.templateSettings);
				var r = "__p+='" + e.replace(D, function (e) {
						return "\\" + M[e]
					}).replace(n.escape || O, function (e, t) {
						return "'+\n_.escape(" + H(t) + ")+\n'"
					}).replace(n.interpolate || O, function (e, t) {
						return "'+\n(" + H(t) + ")+\n'"
					}).replace(n.evaluate || O, function (e, t) {
						return "';\n" + H(t) + "\n;__p+='"
					}) + "';\n";
				n.variable || (r = "with(obj||{}){\n" + r + "}\n"),
				r = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + r + "return __p;\n";
				var i = new Function(n.variable || "obj", "_", r);
				if (t)
					return i(t, T);
				var s = function (e) {
					return i.call(this, e, T)
				};
				return s.source = "function(" + (n.variable || "obj") + "){\n" + r + "}",
				s
			},
			T.chain = function (e) {
				return T(e).chain()
			};
			var B = function (e) {
				this._wrapped = e
			};
			T.prototype = B.prototype;
			var j = function (e, t) {
				return t ? T(e).chain() : e
			},
			F = function (e, t) {
				B.prototype[e] = function () {
					var e = a.call(arguments);
					return f.call(e, this._wrapped),
					j(t.apply(T, e), this._chain)
				}
			};
			T.mixin(T),
			N(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (e) {
				var t = s[e];
				B.prototype[e] = function () {
					var n = this._wrapped;
					t.apply(n, arguments);
					var r = n.length;
					return (e == "shift" || e == "splice") && r === 0 && delete n[0],
					j(n, this._chain)
				}
			}),
			N(["concat", "join", "slice"], function (e) {
				var t = s[e];
				B.prototype[e] = function () {
					return j(t.apply(this._wrapped, arguments), this._chain)
				}
			}),
			B.prototype.chain = function () {
				return this._chain = !0,
				this
			},
			B.prototype.value = function () {
				return this._wrapped
			}
		}).call(this)
	}),
	e.define("/source/include/swfobject.js", function (e, t, n, r, i, s) {
		var o = function () {
			function k() {
				if (w)
					return;
				try {
					var e = f.getElementsByTagName("body")[0].appendChild(z("span"));
					e.parentNode.removeChild(e)
				} catch (t) {
					return
				}
				w = !0;
				var n = h.length;
				for (var r = 0; r < n; r++)
					h[r]()
			}
			function L(e) {
				w ? e() : h[h.length] = e
			}
			function A(t) {
				if (typeof a.addEventListener != e)
					a.addEventListener("load", t, !1);
				else if (typeof f.addEventListener != e)
					f.addEventListener("load", t, !1);
				else if (typeof a.attachEvent != e)
					W(a, "onload", t);
				else if (typeof a.onload == "function") {
					var n = a.onload;
					a.onload = function () {
						n(),
						t()
					}
				} else
					a.onload = t
			}
			function O() {
				c ? M() : _()
			}
			function M() {
				var n = f.getElementsByTagName("body")[0],
				r = z(t);
				r.setAttribute("type", i);
				var s = n.appendChild(r);
				if (s) {
					var o = 0;
					(function () {
						if (typeof s.GetVariable != e) {
							var t = s.GetVariable("$version");
							t && (t = t.split(" ")[1].split(","), N.pv = [parseInt(t[0], 10), parseInt(t[1], 10), parseInt(t[2], 10)])
						} else if (o < 10) {
							o++,
							setTimeout(arguments.callee, 10);
							return
						}
						n.removeChild(r),
						s = null,
						_()
					})()
				} else
					_()
			}
			function _() {
				var t = p.length;
				if (t > 0)
					for (var n = 0; n < t; n++) {
						var r = p[n].id,
						i = p[n].callbackFn,
						s = {
							success : !1,
							id : r
						};
						if (N.pv[0] > 0) {
							var o = U(r);
							if (o)
								if (X(p[n].swfVersion) && !(N.wk && N.wk < 312))
									$(r, !0), i && (s.success = !0, s.ref = D(r), i(s));
								else if (p[n].expressInstall && P()) {
									var u = {};
									u.data = p[n].expressInstall,
									u.width = o.getAttribute("width") || "0",
									u.height = o.getAttribute("height") || "0",
									o.getAttribute("class") && (u.styleclass = o.getAttribute("class")),
									o.getAttribute("align") && (u.align = o.getAttribute("align"));
									var a = {},
									f = o.getElementsByTagName("param"),
									l = f.length;
									for (var c = 0; c < l; c++)
										f[c].getAttribute("name").toLowerCase() != "movie" && (a[f[c].getAttribute("name")] = f[c].getAttribute("value"));
									H(u, a, r, i)
								} else
									B(o), i && i(s)
						} else {
							$(r, !0);
							if (i) {
								var h = D(r);
								h && typeof h.SetVariable != e && (s.success = !0, s.ref = h),
								i(s)
							}
						}
					}
			}
			function D(n) {
				var r = null,
				i = U(n);
				if (i && i.nodeName == "OBJECT")
					if (typeof i.SetVariable != e)
						r = i;
					else {
						var s = i.getElementsByTagName(t)[0];
						s && (r = s)
					}
				return r
			}
			function P() {
				return !E && X("6.0.65") && (N.win || N.mac) && !(N.wk && N.wk < 312)
			}
			function H(t, n, r, i) {
				E = !0,
				y = i || null,
				b = {
					success : !1,
					id : r
				};
				var o = U(r);
				if (o) {
					o.nodeName == "OBJECT" ? (m = j(o), g = null) : (m = o, g = r),
					t.id = s;
					if (typeof t.width == e || !/%$/.test(t.width) && parseInt(t.width, 10) < 310)
						t.width = "310";
					if (typeof t.height == e || !/%$/.test(t.height) && parseInt(t.height, 10) < 137)
						t.height = "137";
					f.title = f.title.slice(0, 47) + " - Flash Player Installation";
					var u = N.ie && N.win ? "ActiveX" : "PlugIn",
					l = "MMredirectURL=" + a.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + u + "&MMdoctitle=" + f.title;
					typeof n.flashvars != e ? n.flashvars += "&" + l : n.flashvars = l;
					if (N.ie && N.win && o.readyState != 4) {
						var c = z("div");
						r += "SWFObjectNew",
						c.setAttribute("id", r),
						o.parentNode.insertBefore(c, o),
						o.style.display = "none",
						function () {
							o.readyState == 4 ? o.parentNode.removeChild(o) : setTimeout(arguments.callee, 10)
						}
						()
					}
					F(t, n, r)
				}
			}
			function B(e) {
				if (N.ie && N.win && e.readyState != 4) {
					var t = z("div");
					e.parentNode.insertBefore(t, e),
					t.parentNode.replaceChild(j(e), t),
					e.style.display = "none",
					function () {
						e.readyState == 4 ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10)
					}
					()
				} else
					e.parentNode.replaceChild(j(e), e)
			}
			function j(e) {
				var n = z("div");
				if (N.win && N.ie)
					n.innerHTML = e.innerHTML;
				else {
					var r = e.getElementsByTagName(t)[0];
					if (r) {
						var i = r.childNodes;
						if (i) {
							var s = i.length;
							for (var o = 0; o < s; o++)
								(i[o].nodeType != 1 || i[o].nodeName != "PARAM") && i[o].nodeType != 8 && n.appendChild(i[o].cloneNode(!0))
						}
					}
				}
				return n
			}
			function F(n, r, s) {
				var o,
				u = U(s);
				if (N.wk && N.wk < 312)
					return o;
				if (u) {
					typeof n.id == e && (n.id = s);
					if (N.ie && N.win) {
						var a = "";
						for (var f in n)
							n[f] != Object.prototype[f] && (f.toLowerCase() == "data" ? r.movie = n[f] : f.toLowerCase() == "styleclass" ? a += ' class="' + n[f] + '"' : f.toLowerCase() != "classid" && (a += " " + f + '="' + n[f] + '"'));
						var l = "";
						for (var c in r)
							r[c] != Object.prototype[c] && (l += '<param name="' + c + '" value="' + r[c] + '" />');
						u.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + a + ">" + l + "</object>",
						d[d.length] = n.id,
						o = U(n.id)
					} else {
						var h = z(t);
						h.setAttribute("type", i);
						for (var p in n)
							n[p] != Object.prototype[p] && (p.toLowerCase() == "styleclass" ? h.setAttribute("class", n[p]) : p.toLowerCase() != "classid" && h.setAttribute(p, n[p]));
						for (var v in r)
							r[v] != Object.prototype[v] && v.toLowerCase() != "movie" && I(h, v, r[v]);
						u.parentNode.replaceChild(h, u),
						o = h
					}
				}
				return o
			}
			function I(e, t, n) {
				var r = z("param");
				r.setAttribute("name", t),
				r.setAttribute("value", n),
				e.appendChild(r)
			}
			function q(e) {
				var t = U(e);
				t && t.nodeName == "OBJECT" && (N.ie && N.win ? (t.style.display = "none", function () {
						t.readyState == 4 ? R(e) : setTimeout(arguments.callee, 10)
					}
						()) : t.parentNode.removeChild(t))
			}
			function R(e) {
				var t = U(e);
				if (t) {
					for (var n in t)
						typeof t[n] == "function" && (t[n] = null);
					t.parentNode.removeChild(t)
				}
			}
			function U(e) {
				var t = null;
				try {
					t = f.getElementById(e)
				} catch (n) {}

				return t
			}
			function z(e) {
				return f.createElement(e)
			}
			function W(e, t, n) {
				e.attachEvent(t, n),
				v[v.length] = [e, t, n]
			}
			function X(e) {
				var t = N.pv,
				n = e.split(".");
				return n[0] = parseInt(n[0], 10),
				n[1] = parseInt(n[1], 10) || 0,
				n[2] = parseInt(n[2], 10) || 0,
				t[0] > n[0] || t[0] == n[0] && t[1] > n[1] || t[0] == n[0] && t[1] == n[1] && t[2] >= n[2] ? !0 : !1
			}
			function V(n, r, i, s) {
				if (N.ie && N.mac)
					return;
				var o = f.getElementsByTagName("head")[0];
				if (!o)
					return;
				var u = i && typeof i == "string" ? i : "screen";
				s && (S = null, x = null);
				if (!S || x != u) {
					var a = z("style");
					a.setAttribute("type", "text/css"),
					a.setAttribute("media", u),
					S = o.appendChild(a),
					N.ie && N.win && typeof f.styleSheets != e && f.styleSheets.length > 0 && (S = f.styleSheets[f.styleSheets.length - 1]),
					x = u
				}
				N.ie && N.win ? S && typeof S.addRule == t && S.addRule(n, r) : S && typeof f.createTextNode != e && S.appendChild(f.createTextNode(n + " {" + r + "}"))
			}
			function $(e, t) {
				if (!T)
					return;
				var n = t ? "visible" : "hidden";
				w && U(e) ? U(e).style.visibility = n : V("#" + e, "visibility:" + n)
			}
			function J(t) {
				var n = /[\\\"<>\.;]/,
				r = n.exec(t) != null;
				return r && typeof encodeURIComponent != e ? encodeURIComponent(t) : t
			}
			var e = "undefined",
			t = "object",
			n = "Shockwave Flash",
			r = "ShockwaveFlash.ShockwaveFlash",
			i = "application/x-shockwave-flash",
			s = "SWFObjectExprInst",
			u = "onreadystatechange",
			a = window,
			f = document,
			l = navigator,
			c = !1,
			h = [O],
			p = [],
			d = [],
			v = [],
			m,
			g,
			y,
			b,
			w = !1,
			E = !1,
			S,
			x,
			T = !0,
			N = function () {
				var s = typeof f.getElementById != e && typeof f.getElementsByTagName != e && typeof f.createElement != e,
				o = l.userAgent.toLowerCase(),
				u = l.platform.toLowerCase(),
				h = u ? /win/.test(u) : /win/.test(o),
				p = u ? /mac/.test(u) : /mac/.test(o),
				d = /webkit/.test(o) ? parseFloat(o.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
				v = !1,
				m = [0, 0, 0],
				g = null;
				if (typeof l.plugins != e && typeof l.plugins[n] == t)
					g = l.plugins[n].description, g && (typeof l.mimeTypes == e || !l.mimeTypes[i] || !!l.mimeTypes[i].enabledPlugin) && (c = !0, v = !1, g = g.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), m[0] = parseInt(g.replace(/^(.*)\..*$/, "$1"), 10), m[1] = parseInt(g.replace(/^.*\.(.*)\s.*$/, "$1"), 10), m[2] = /[a-zA-Z]/.test(g) ? parseInt(g.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0);
				else if (typeof a.ActiveXObject != e)
					try {
						var y = new ActiveXObject(r);
						y && (g = y.GetVariable("$version"), g && (v = !0, g = g.split(" ")[1].split(","), m = [parseInt(g[0], 10), parseInt(g[1], 10), parseInt(g[2], 10)]))
					} catch (b) {}

				return {
					w3 : s,
					pv : m,
					wk : d,
					ie : v,
					win : h,
					mac : p
				}
			}
			(),
			C = function () {
				if (!N.w3)
					return;
				(typeof f.readyState != e && f.readyState == "complete" || typeof f.readyState == e && (f.getElementsByTagName("body")[0] || f.body)) && k(),
				w || (typeof f.addEventListener != e && f.addEventListener("DOMContentLoaded", k, !1), N.ie && N.win && (f.attachEvent(u, function () {
							f.readyState == "complete" && (f.detachEvent(u, arguments.callee), k())
						}), a == top && function () {
						if (w)
							return;
						try {
							f.documentElement.doScroll("left")
						} catch (e) {
							setTimeout(arguments.callee, 0);
							return
						}
						k()
					}
						()), N.wk && function () {
					if (w)
						return;
					if (!/loaded|complete/.test(f.readyState)) {
						setTimeout(arguments.callee, 0);
						return
					}
					k()
				}
					(), A(k))
			}
			(),
			K = function () {
				N.ie && N.win && window.attachEvent("onunload", function () {
					var e = v.length;
					for (var t = 0; t < e; t++)
						v[t][0].detachEvent(v[t][1], v[t][2]);
					var n = d.length;
					for (var r = 0; r < n; r++)
						q(d[r]);
					for (var i in N)
						N[i] = null;
					N = null;
					for (var s in o)
						o[s] = null;
					o = null
				})
			}
			();
			return {
				registerObject : function (e, t, n, r) {
					if (N.w3 && e && t) {
						var i = {};
						i.id = e,
						i.swfVersion = t,
						i.expressInstall = n,
						i.callbackFn = r,
						p[p.length] = i,
						$(e, !1)
					} else
						r && r({
							success : !1,
							id : e
						})
				},
				getObjectById : function (e) {
					if (N.w3)
						return D(e)
				},
				embedSWF : function (n, r, i, s, o, u, a, f, l, c) {
					var h = {
						success : !1,
						id : r
					};
					N.w3 && !(N.wk && N.wk < 312) && n && r && i && s && o ? ($(r, !1), L(function () {
							i += "",
							s += "";
							var p = {};
							if (l && typeof l === t)
								for (var d in l)
									p[d] = l[d];
							p.data = n,
							p.width = i,
							p.height = s;
							var v = {};
							if (f && typeof f === t)
								for (var m in f)
									v[m] = f[m];
							if (a && typeof a === t)
								for (var g in a)
									typeof v.flashvars != e ? v.flashvars += "&" + g + "=" + a[g] : v.flashvars = g + "=" + a[g];
							if (X(o)) {
								var y = F(p, v, r);
								p.id == r && $(r, !0),
								h.success = !0,
								h.ref = y
							} else {
								if (u && P()) {
									p.data = u,
									H(p, v, r, c);
									return
								}
								$(r, !0)
							}
							c && c(h)
						})) : c && c(h)
				},
				switchOffAutoHideShow : function () {
					T = !1
				},
				ua : N,
				getFlashPlayerVersion : function () {
					return {
						major : N.pv[0],
						minor : N.pv[1],
						release : N.pv[2]
					}
				},
				hasFlashPlayerVersion : X,
				createSWF : function (e, t, n) {
					return N.w3 ? F(e, t, n) : undefined
				},
				showExpressInstall : function (e, t, n, r) {
					N.w3 && P() && H(e, t, n, r)
				},
				removeSWF : function (e) {
					N.w3 && q(e)
				},
				createCSS : function (e, t, n, r) {
					N.w3 && V(e, t, n, r)
				},
				addDomLoadEvent : L,
				addLoadEvent : A,
				getQueryParamValue : function (e) {
					var t = f.location.search || f.location.hash;
					if (t) {
						/\?/.test(t) && (t = t.split("?")[1]);
						if (e == null)
							return J(t);
						var n = t.split("&");
						for (var r = 0; r < n.length; r++)
							if (n[r].substring(0, n[r].indexOf("=")) == e)
								return J(n[r].substring(n[r].indexOf("=") + 1))
					}
					return ""
				},
				expressInstallCallback : function () {
					if (E) {
						var e = U(s);
						e && m && (e.parentNode.replaceChild(m, e), g && ($(g, !0), N.ie && N.win && (m.style.display = "block")), y && y(b)),
						E = !1
					}
				}
			}
		}
		();
		t.exports = o
	}),
	e.define("/source/include/base64/base64.coffee", function (e, t, n, r, i, s) {
		(function () {
			var e;
			e = {
				_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
				encode : function (t) {
					var n,
					r,
					i,
					s,
					o,
					u,
					a,
					f,
					l;
					l = "",
					n = void 0,
					r = void 0,
					i = void 0,
					s = void 0,
					o = void 0,
					u = void 0,
					a = void 0,
					f = 0,
					t = e._utf8_encode(t);
					while (f < t.length)
						n = t.charCodeAt(f++), r = t.charCodeAt(f++), i = t.charCodeAt(f++), s = n >> 2, o = (n & 3) << 4 | r >> 4, u = (r & 15) << 2 | i >> 6, a = i & 63, isNaN(r) ? u = a = 64 : isNaN(i) && (a = 64), l = l + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
					return l
				},
				decode : function (t) {
					var n,
					r,
					i,
					s,
					o,
					u,
					a,
					f,
					l;
					l = "",
					n = void 0,
					r = void 0,
					i = void 0,
					s = void 0,
					o = void 0,
					u = void 0,
					a = void 0,
					f = 0,
					t = t.replace(/[^A-Za-z0-9\+\/\=]/g, "");
					while (f < t.length)
						s = this._keyStr.indexOf(t.charAt(f++)), o = this._keyStr.indexOf(t.charAt(f++)), u = this._keyStr.indexOf(t.charAt(f++)), a = this._keyStr.indexOf(t.charAt(f++)), n = s << 2 | o >> 4, r = (o & 15) << 4 | u >> 2, i = (u & 3) << 6 | a, l += String.fromCharCode(n), u !== 64 && (l += String.fromCharCode(r)), a !== 64 && (l += String.fromCharCode(i));
					return l = e._utf8_decode(l),
					l
				},
				_utf8_encode : function (e) {
					var t,
					n,
					r;
					e = e.replace(/\r\n/g, "\n"),
					r = "",
					n = 0;
					while (n < e.length)
						t = e.charCodeAt(n), t < 128 ? r += String.fromCharCode(t) : t > 127 && t < 2048 ? (r += String.fromCharCode(t >> 6 | 192), r += String.fromCharCode(t & 63 | 128)) : (r += String.fromCharCode(t >> 12 | 224), r += String.fromCharCode(t >> 6 & 63 | 128), r += String.fromCharCode(t & 63 | 128)), n++;
					return r
				},
				_utf8_decode : function (e) {
					var t,
					n,
					r,
					i,
					s,
					o;
					o = "",
					s = 0,
					t = n = r = 0;
					while (s < e.length)
						t = e.charCodeAt(s), t < 128 ? (o += String.fromCharCode(t), s++) : t > 191 && t < 224 ? (r = e.charCodeAt(s + 1), o += String.fromCharCode((t & 31) << 6 | r & 63), s += 2) : (r = e.charCodeAt(s + 1), i = e.charCodeAt(s + 2), o += String.fromCharCode((t & 15) << 12 | (r & 63) << 6 | i & 63), s += 3);
					return o
				}
			},
			t.exports = e
		}).call(this)
	}),
	e.define("/source/include/greensock/TweenMax.min.js", function (e, t, n, i, s, o) {
		(window._gsQueue || (window._gsQueue = [])).push(function () {
			_gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (e, t, n) {
				var r = function (e, t, r) {
					n.call(this, e, t, r),
					this._cycle = 0,
					this._yoyo = 1 == this.vars.yoyo,
					this._repeat = this.vars.repeat || 0,
					this._repeatDelay = this.vars.repeatDelay || 0,
					this._dirty = !0
				},
				i = r.prototype = n.to({}, .1, {}),
				s = [];
				i.constructor = r,
				i.kill()._gc = !1,
				r.killTweensOf = r.killDelayedCallsTo = n.killTweensOf,
				r.getTweensOf = n.getTweensOf,
				r.ticker = n.ticker,
				i.invalidate = function () {
					return this._yoyo = 1 == this.vars.yoyo,
					this._repeat = this.vars.repeat || 0,
					this._repeatDelay = this.vars.repeatDelay || 0,
					this._uncache(!0),
					n.prototype.invalidate.call(this)
				},
				i.updateTo = function (e, t) {
					var r = this.ratio,
					i;
					t && null != this.timeline && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
					for (i in e)
						this.vars[i] = e[i];
					if (this._initted)
						if (t)
							this._initted = !1;
						else if (this._notifyPluginsOfEnabled && this._firstPT && n._onPluginEvent("_onDisable", this), .998 < this._time / this._duration)
							r = this._time, this.render(0, !0, !1), this._initted = !1, this.render(r, !0, !1);
						else if (0 < this._time) {
							this._initted = !1,
							this._init(),
							r = 1 / (1 - r),
							i = this._firstPT;
							for (var s; i; )
								s = i.s + i.c, i.c *= r, i.s = s - i.c, i = i._next
						}
					return this
				},
				i.render = function (e, t, n) {
					var r = this._dirty ? this.totalDuration() : this._totalDuration,
					i = this._time,
					o = this._totalTime,
					u = this._cycle,
					a,
					f;
					if (e >= r) {
						if (this._totalTime = r, this._cycle = this._repeat, this._yoyo && 0 !== (this._cycle & 1) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = this._duration, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (a = !0, f = "onComplete"), 0 === this._duration)
							(0 === e || 0 > this._rawPrevTime) && this._rawPrevTime !== e && (n = !0), this._rawPrevTime = e
					} else if (0 >= e) {
						this._totalTime = this._time = this._cycle = 0,
						this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
						if (0 !== o || 0 === this._duration && 0 < this._rawPrevTime)
							f = "onReverseComplete", a = this._reversed;
						0 > e ? (this._active = !1, 0 === this._duration && (0 <= this._rawPrevTime && (n = !0), this._rawPrevTime = e)) : this._initted || (n = !0)
					} else if (this._totalTime = this._time = e, 0 !== this._repeat && ((e = this._duration + this._repeatDelay, this._cycle = this._totalTime / e >> 0, 0 !== this._cycle && this._cycle === this._totalTime / e && this._cycle--, this._time = this._totalTime - this._cycle * e, this._yoyo && 0 !== (this._cycle & 1) && (this._time = this._duration - this._time), this._time > this._duration) ? this._time = this._duration : 0 > this._time && (this._time = 0)), this._easeType) {
						var e = this._time / this._duration,
						r = this._easeType,
						l = this._easePower;
						if (1 === r || 3 === r && .5 <= e)
							e = 1 - e;
						3 === r && (e *= 2),
						1 === l ? e *= e : 2 === l ? e *= e * e : 3 === l ? e *= e * e * e : 4 === l && (e *= e * e * e * e),
						this.ratio = 1 === r ? 1 - e : 2 === r ? e : .5 > this._time / this._duration ? e / 2 : 1 - e / 2
					} else
						this.ratio = this._ease.getRatio(this._time / this._duration);
					if (i !== this._time || n) {
						this._initted || (this._init(), !a && this._time && (this.ratio = this._ease.getRatio(this._time / this._duration))),
						!this._active && !this._paused && (this._active = !0),
						0 == o && this.vars.onStart && (0 !== this._totalTime || 0 === this._duration) && (t || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || s));
						for (n = this._firstPT; n; )
							n.f ? n.t[n.p](n.c * this.ratio + n.s) : n.t[n.p] = n.c * this.ratio + n.s, n = n._next;
						this._onUpdate && (t || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || s)),
						this._cycle != u && (t || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || s)),
						f && !this._gc && (a && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), t || this.vars[f] && this.vars[f].apply(this.vars[f + "Scope"] || this, this.vars[f + "Params"] || s))
					}
				},
				r.to = function (e, t, n) {
					return new r(e, t, n)
				},
				r.from = function (e, t, n) {
					return n.runBackwards = !0,
					0 != n.immediateRender && (n.immediateRender = !0),
					new r(e, t, n)
				},
				r.fromTo = function (e, t, n, i) {
					return i.startAt = n,
					n.immediateRender && (i.immediateRender = !0),
					new r(e, t, i)
				},
				r.staggerTo = r.allTo = function (e, t, n, i, s, o, u) {
					var i = i || 0,
					a = [],
					f = e.length,
					l = n.delay || 0,
					c,
					h,
					p;
					for (h = 0; h < f; h++) {
						c = {};
						for (p in n)
							c[p] = n[p];
						c.delay = l,
						h === f - 1 && s && (c.onComplete = function () {
							n.onComplete && n.onComplete.apply(n.onCompleteScope, n.onCompleteParams),
							s.apply(u, o)
						}),
						a[h] = new r(e[h], t, c),
						l += i
					}
					return a
				},
				r.staggerFrom = r.allFrom = function (e, t, n, i, s, o, u) {
					return n.runBackwards = !0,
					0 != n.immediateRender && (n.immediateRender = !0),
					r.staggerTo(e, t, n, i, s, o, u)
				},
				r.staggerFromTo = r.allFromTo = function (e, t, n, i, s, o, u, a) {
					return i.startAt = n,
					n.immediateRender && (i.immediateRender = !0),
					r.staggerTo(e, t, i, s, o, u, a)
				},
				r.delayedCall = function (e, t, n, i, s) {
					return new r(t, 0, {
						delay : e,
						onComplete : t,
						onCompleteParams : n,
						onCompleteScope : i,
						onReverseComplete : t,
						onReverseCompleteParams : n,
						onReverseCompleteScope : i,
						immediateRender : !1,
						useFrames : s,
						overwrite : 0
					})
				},
				r.set = function (e, t) {
					return new r(e, 0, t)
				},
				r.isTweening = function (e) {
					for (var e = n.getTweensOf(e), t = e.length, r; -1 < --t; )
						if ((r = e[t])._active || r._startTime === r.timeline._time && r.timeline._active)
							return !0;
					return !1
				};
				var o = function (e, t) {
					for (var r = [], i = 0, s = e._first; s; )
						s instanceof n ? r[i++] = s : (t && (r[i++] = s), r = r.concat(o(s, t)), i = r.length), s = s._next;
					return r
				},
				u = r.getAllTweens = function (t) {
					return o(e._rootTimeline, t).concat(o(e._rootFramesTimeline, t))
				};
				r.killAll = function (e, n, r, i) {
					null == n && (n = !0),
					null == r && (r = !0);
					for (var s = u(0 != i), o = s.length, i = n && r && i, a, f; -1 < --o; )
						if (f = s[o], i || f instanceof t || (a = f.target === f.vars.onComplete) && r || n && !a)
							e ? f.totalTime(f.totalDuration()) : f._enabled(!1, !1)
				},
				r.pauseAll = function (e, t, n) {
					a(!0, e, t, n)
				},
				r.resumeAll = function (e, t, n) {
					a(!1, e, t, n)
				};
				var a = function (e, n, r, i) {
					void 0 == n && (n = !0),
					void 0 == r && (r = !0);
					for (var s = u(i), i = n && r && i, o = s.length, a, f; -1 < --o; )
						f = s[o], (i || f instanceof t || (a = f.target === f.vars.onComplete) && r || n && !a) && f.paused(e)
				};
				return i.progress = function (e) {
					return arguments.length ? this.totalTime(this.duration() * e + this._cycle * this._duration, !1) : this._time / this.duration()
				},
				i.totalProgress = function (e) {
					return arguments.length ? this.totalTime(this.totalDuration() * e, !1) : this._totalTime / this.totalDuration()
				},
				i.time = function (e, t) {
					return arguments.length ? (this._dirty && this.totalDuration(), e > this._duration && (e = this._duration), this._yoyo && 0 !== (this._cycle & 1) ? e = this._duration - e + this._cycle * (this._duration + this._repeatDelay) : 0 != this._repeat && (e += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(e, t)) : this._time
				},
				i.totalDuration = function (e) {
					return arguments.length ? -1 == this._repeat ? this : this.duration((e - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration)
				},
				i.repeat = function (e) {
					return arguments.length ? (this._repeat = e, this._uncache(!0)) : this._repeat
				},
				i.repeatDelay = function (e) {
					return arguments.length ? (this._repeatDelay = e, this._uncache(!0)) : this._repeatDelay
				},
				i.yoyo = function (e) {
					return arguments.length ? (this._yoyo = e, this) : this._yoyo
				},
				r
			}, !0),
			_gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (e, t, n) {
				var r = function (e) {
					t.call(this, e),
					this._labels = {},
					this.autoRemoveChildren = 1 == this.vars.autoRemoveChildren,
					this.smoothChildTiming = 1 == this.vars.smoothChildTiming,
					this._sortChildren = !0,
					this._onUpdate = this.vars.onUpdate;
					for (var e = i.length, n, r; -1 < --e; )
						if (r = this.vars[i[e]])
							for (n = r.length; -1 < --n; )
								"{self}" === r[n] && (r = this.vars[i[e]] = r.concat(), r[n] = this);
					this.vars.tweens instanceof Array && this.insertMultiple(this.vars.tweens, 0, this.vars.align || "normal", this.vars.stagger || 0)
				},
				i = ["onStartParams", "onUpdateParams", "onCompleteParams", "onReverseCompleteParams", "onRepeatParams"],
				s = [],
				o = r.prototype = new t;
				return o.constructor = r,
				o.kill()._gc = !1,
				o.to = function (e, t, r, i, s) {
					return this.insert(new n(e, t, r), this._parseTimeOrLabel(s) + (i || 0))
				},
				o.from = function (e, t, r, i, s) {
					return this.insert(n.from(e, t, r), this._parseTimeOrLabel(s) + (i || 0))
				},
				o.fromTo = function (e, t, r, i, s, o) {
					return this.insert(n.fromTo(e, t, r, i), this._parseTimeOrLabel(o) + (s || 0))
				},
				o.staggerTo = function (e, t, i, s, o, u, a, f, l) {
					a = new r({
							onComplete : a,
							onCompleteParams : f,
							onCompleteScope : l
						}),
					s = s || 0;
					for (f = 0; f < e.length; f++)
						a.insert(new n(e[f], t, i), f * s);
					return this.insert(a, this._parseTimeOrLabel(u) + (o || 0))
				},
				o.staggerFrom = function (e, t, n, r, i, s, o, u, a) {
					return null == n.immediateRender && (n.immediateRender = !0),
					n.runBackwards = !0,
					this.staggerTo(e, t, n, r, i, s, o, u, a)
				},
				o.staggerFromTo = function (e, t, n, r, i, s, o, u, a, f) {
					return r.startAt = n,
					n.immediateRender && (r.immediateRender = !0),
					this.staggerTo(e, t, r, i, s, o, u, a, f)
				},
				o.call = function (e, t, r, i, s) {
					return this.insert(n.delayedCall(0, e, t, r), this._parseTimeOrLabel(s) + (i || 0))
				},
				o.set = function (e, t, r, i) {
					return t.immediateRender = !1,
					this.insert(new n(e, 0, t), this._parseTimeOrLabel(i) + (r || 0))
				},
				r.exportRoot = function (e, t) {
					e = e || {},
					null == e.smoothChildTiming && (e.smoothChildTiming = !0);
					var i = new r(e),
					s = i._timeline;
					null == t && (t = !0),
					s._remove(i, !0),
					i._startTime = 0,
					i._rawPrevTime = i._time = i._totalTime = s._time;
					for (var o = s._first, u; o; )
						u = o._next, (!t || !(o instanceof n && o.target == o.vars.onComplete)) && i.insert(o, o._startTime - o._delay), o = u;
					return s.insert(i, 0),
					i
				},
				o.insert = function (r, i) {
					if (!(r instanceof e)) {
						if (r instanceof Array)
							return this.insertMultiple(r, i);
						if ("string" == typeof r)
							return this.addLabel(r, this._parseTimeOrLabel(i || 0, !0));
						if ("function" != typeof r)
							throw "ERROR: Cannot insert() " + r + " into the TimelineLite/Max because it is neither a tween, timeline, function, nor a String.";
						r = n.delayedCall(0, r)
					}
					t.prototype.insert.call(this, r, this._parseTimeOrLabel(i || 0, !0));
					if (this._gc && !this._paused && this._time === this._duration && this._time < this.duration())
						for (var s = this; s._gc && s._timeline; )
							s._timeline.smoothChildTiming ? s.totalTime(s._totalTime, !0) : s._enabled(!0, !1), s = s._timeline;
					return this
				},
				o.remove = function (t) {
					if (t instanceof e)
						return this._remove(t, !1);
					if (t instanceof Array) {
						for (var n = t.length; -1 < --n; )
							this.remove(t[n]);
						return this
					}
					return "string" == typeof t ? this.removeLabel(t) : this.kill(null, t)
				},
				o.append = function (e, t) {
					return this.insert(e, this.duration() + (t || 0))
				},
				o.insertMultiple = function (e, t, n, i) {
					for (var n = n || "normal", i = i || 0, s, o = this._parseTimeOrLabel(t || 0, !0), u = e.length, t = 0; t < u; t++)
						(s = e[t])instanceof Array && (s = new r({
									tweens : s
								})), this.insert(s, o), "string" == typeof s || "function" == typeof s || ("sequence" === n ? o = s._startTime + s.totalDuration() / s._timeScale : "start" === n && (s._startTime -= s.delay())), o += i;
					return this._uncache(!0)
				},
				o.appendMultiple = function (e, t, n, r) {
					return this.insertMultiple(e, this.duration() + (t || 0), n, r)
				},
				o.addLabel = function (e, t) {
					return this._labels[e] = t,
					this
				},
				o.removeLabel = function (e) {
					return delete this._labels[e],
					this
				},
				o.getLabelTime = function (e) {
					return null != this._labels[e] ? this._labels[e] : -1
				},
				o._parseTimeOrLabel = function (e, t) {
					return null == e ? this.duration() : "string" == typeof e && isNaN(e) ? null == this._labels[e] ? t ? this._labels[e] = this.duration() : 0 : this._labels[e] : Number(e)
				},
				o.seek = function (e, t) {
					return this.totalTime(this._parseTimeOrLabel(e, !1), 0 != t)
				},
				o.stop = function () {
					return this.paused(!0)
				},
				o.gotoAndPlay = function (e, n) {
					return t.prototype.play.call(this, e, n)
				},
				o.gotoAndStop = function (e, t) {
					return this.pause(e, t)
				},
				o.render = function (e, t, n) {
					this._gc && this._enabled(!0, !1),
					this._active = !this._paused;
					var r = this._dirty ? this.totalDuration() : this._totalDuration,
					i = this._time,
					o = this._startTime,
					u = this._timeScale,
					a = this._paused,
					f,
					l,
					c;
					if (e >= r)
						this._totalTime = this._time = r, !this._reversed && !this._hasPausedChild() && (f = !0, c = "onComplete", 0 === this._duration && (0 === e || 0 > this._rawPrevTime)) && this._rawPrevTime !== e && (n = !0), this._rawPrevTime = e, e = r + 1e-6;
					else if (0 >= e) {
						this._totalTime = this._time = 0;
						if (0 !== i || 0 === this._duration && 0 < this._rawPrevTime)
							c = "onReverseComplete", f = this._reversed;
						0 > e ? (this._active = !1, 0 === this._duration && 0 <= this._rawPrevTime && (n = !0)) : this._initted || (n = !0),
						this._rawPrevTime = e,
						e = -0.000001
					} else
						this._totalTime = this._time = this._rawPrevTime = e;
					if (this._time !== i || n) {
						this._initted || (this._initted = !0),
						0 === i && this.vars.onStart && 0 !== this._time && (t || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || s));
						if (this._time > i)
							for (n = this._first; n; ) {
								l = n._next;
								if (this._paused && !a)
									break;
								if (n._active || n._startTime <= this._time && !n._paused && !n._gc)
									n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, !1) : n.render((e - n._startTime) * n._timeScale, t, !1);
								n = l
							}
						else
							for (n = this._last; n; ) {
								l = n._prev;
								if (this._paused && !a)
									break;
								if (n._active || n._startTime <= i && !n._paused && !n._gc)
									n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, !1) : n.render((e - n._startTime) * n._timeScale, t, !1);
								n = l
							}
						this._onUpdate && (t || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || s)),
						c && !this._gc && (o === this._startTime || u != this._timeScale) && (0 === this._time || r >= this.totalDuration()) && (f && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), t || this.vars[c] && this.vars[c].apply(this.vars[c + "Scope"] || this, this.vars[c + "Params"] || s))
					}
				},
				o._hasPausedChild = function () {
					for (var e = this._first; e; ) {
						if (e._paused || e instanceof r && e._hasPausedChild())
							return !0;
						e = e._next
					}
					return !1
				},
				o.getChildren = function (e, t, r, i) {
					for (var i = i || -9999999999, s = [], o = this._first, u = 0; o; )
						o._startTime < i || (o instanceof n ? 0 != t && (s[u++] = o) : (0 != r && (s[u++] = o), 0 != e && (s = s.concat(o.getChildren(!0, t, r)), u = s.length))), o = o._next;
					return s
				},
				o.getTweensOf = function (e, t) {
					for (var r = n.getTweensOf(e), i = r.length, s = [], o = 0; -1 < --i; )
						if (r[i].timeline === this || t && this._contains(r[i]))
							s[o++] = r[i];
					return s
				},
				o._contains = function (e) {
					for (e = e.timeline; e; ) {
						if (e === this)
							return !0;
						e = e.timeline
					}
					return !1
				},
				o.shiftChildren = function (e, t, n) {
					for (var n = n || 0, r = this._first; r; )
						r._startTime >= n && (r._startTime += e), r = r._next;
					if (t)
						for (var i in this._labels)
							this._labels[i] >= n && (this._labels[i] += e);
					return this._uncache(!0)
				},
				o._kill = function (e, t) {
					if (null == e && null == t)
						return this._enabled(!1, !1);
					for (var n = null == t ? this.getChildren(!0, !0, !1) : this.getTweensOf(t), r = n.length, i = !1; -1 < --r; )
						n[r]._kill(e, t) && (i = !0);
					return i
				},
				o.clear = function (e) {
					var t = this.getChildren(!1, !0, !0),
					n = t.length;
					for (this._time = this._totalTime = 0; -1 < --n; )
						t[n]._enabled(!1, !1);
					return 0 != e && (this._labels = {}),
					this._uncache(!0)
				},
				o.invalidate = function () {
					for (var e = this._first; e; )
						e.invalidate(), e = e._next;
					return this
				},
				o._enabled = function (e, n) {
					if (e == this._gc)
						for (var r = this._first; r; )
							r._enabled(e, !0), r = r._next;
					return t.prototype._enabled.call(this, e, n)
				},
				o.progress = function (e) {
					return arguments.length ? this.totalTime(this.duration() * e, !1) : this._time / this.duration()
				},
				o.duration = function (e) {
					return arguments.length ? (0 !== this.duration() && 0 !== e && this.timeScale(this._duration / e), this) : (this._dirty && this.totalDuration(), this._duration)
				},
				o.totalDuration = function (e) {
					if (!arguments.length) {
						if (this._dirty) {
							for (var t = 0, n = this._first, r = -999999999999, i; n; )
								i = n._next, n._startTime < r && this._sortChildren ? this.insert(n, n._startTime - n._delay) : r = n._startTime, 0 > n._startTime && (t -= n._startTime, this.shiftChildren(-n._startTime, !1, -9999999999)), n = n._startTime + (n._dirty ? n.totalDuration() : n._totalDuration) / n._timeScale, n > t && (t = n), n = i;
							this._duration = this._totalDuration = t,
							this._dirty = !1
						}
						return this._totalDuration
					}
					return 0 !== this.totalDuration() && 0 !== e && this.timeScale(this._totalDuration / e),
					this
				},
				o.usesFrames = function () {
					for (var t = this._timeline; t._timeline; )
						t = t._timeline;
					return t === e._rootFramesTimeline
				},
				o.rawTime = function () {
					return this._paused || 0 !== this._totalTime && this._totalTime !== this._totalDuration ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
				},
				r
			}, !0),
			_gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function (e, t, n) {
				var r = function (t) {
					e.call(this, t),
					this._repeat = this.vars.repeat || 0,
					this._repeatDelay = this.vars.repeatDelay || 0,
					this._cycle = 0,
					this._yoyo = 1 == this.vars.yoyo,
					this._dirty = !0
				},
				i = [],
				s = new n(null, null, 1, 0),
				n = r.prototype = new e;
				return n.constructor = r,
				n.kill()._gc = !1,
				r.version = 12,
				n.invalidate = function () {
					return this._yoyo = 1 == this.vars.yoyo,
					this._repeat = this.vars.repeat || 0,
					this._repeatDelay = this.vars.repeatDelay || 0,
					this._uncache(!0),
					e.prototype.invalidate.call(this)
				},
				n.addCallback = function (e, n, r, i) {
					return this.insert(t.delayedCall(0, e, r, i), n)
				},
				n.removeCallback = function (e, t) {
					if (null == t)
						this._kill(null, e);
					else
						for (var n = this.getTweensOf(e, !1), r = n.length, i = this._parseTimeOrLabel(t, !1); -1 < --r; )
							n[r]._startTime === i && n[r]._enabled(!1, !1);
					return this
				},
				n.tweenTo = function (e, n) {
					var n = n || {},
					r = {
						ease : s,
						overwrite : 2,
						useFrames : this.usesFrames(),
						immediateRender : !1
					},
					o,
					u;
					for (o in n)
						r[o] = n[o];
					return r.time = this._parseTimeOrLabel(e, !1),
					u = new t(this, Math.abs(Number(r.time) - this._time) / this._timeScale || .001, r),
					r.onStart = function () {
						u.target.paused(!0),
						u.vars.time != u.target.time() && u.duration(Math.abs(u.vars.time - u.target.time()) / u.target._timeScale),
						n.onStart && n.onStart.apply(n.onStartScope || u, n.onStartParams || i)
					},
					u
				},
				n.tweenFromTo = function (e, t, n) {
					return n = n || {},
					n.startAt = {
						time : this._parseTimeOrLabel(e, !1)
					},
					e = this.tweenTo(t, n),
					e.duration(Math.abs(e.vars.time - e.vars.startAt.time) / this._timeScale || .001)
				},
				n.render = function (e, t, n) {
					this._gc && this._enabled(!0, !1),
					this._active = !this._paused;
					var r = this._dirty ? this.totalDuration() : this._totalDuration,
					s = this._time,
					o = this._totalTime,
					u = this._startTime,
					a = this._timeScale,
					f = this._rawPrevTime,
					l = this._paused,
					c = this._cycle,
					h,
					p;
					if (e >= r)
						this._locked || (this._totalTime = r, this._cycle = this._repeat), !this._reversed && !this._hasPausedChild() && (h = !0, p = "onComplete", 0 === this._duration && (0 === e || 0 > this._rawPrevTime)) && this._rawPrevTime !== e && (n = !0), this._rawPrevTime = e, this._yoyo && 0 !== (this._cycle & 1) ? (this._time = 0, e = -0.000001) : (this._time = this._duration, e = this._duration + 1e-6);
					else if (0 >= e) {
						this._locked || (this._totalTime = this._cycle = 0),
						this._time = 0;
						if (0 !== s || 0 === this._duration && 0 < this._rawPrevTime)
							p = "onReverseComplete", h = this._reversed;
						0 > e ? (this._active = !1, 0 === this._duration && 0 <= this._rawPrevTime && (n = !0)) : this._initted || (n = !0),
						this._rawPrevTime = e,
						e = -0.000001
					} else if (this._time = this._rawPrevTime = e, !this._locked && (this._totalTime = e, 0 !== this._repeat))
						(e = this._duration + this._repeatDelay, this._cycle = this._totalTime / e >> 0, 0 !== this._cycle && this._cycle === this._totalTime / e && this._cycle--, this._time = this._totalTime - this._cycle * e, this._yoyo && 0 != (this._cycle & 1) && (this._time = this._duration - this._time), this._time > this._duration) ? (this._time = this._duration, e = this._duration + 1e-6) : 0 > this._time ? (this._time = 0, e = -0.000001) : e = this._time;
					if (this._cycle !== c && !this._locked) {
						var d = this._yoyo && 0 !== (c & 1),
						v = d === (this._yoyo && 0 !== (this._cycle & 1)),
						m = this._totalTime,
						g = this._cycle,
						y = this._rawPrevTime,
						b = this._time;
						this._totalTime = c * this._duration,
						this._cycle < c ? d = !d : this._totalTime += this._duration,
						this._time = s,
						this._rawPrevTime = f,
						this._cycle = c,
						this._locked = !0,
						s = d ? 0 : this._duration,
						this.render(s, t, !1),
						t || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || i),
						v && (s = d ? this._duration + 1e-6 : -0.000001, this.render(s, !0, !1)),
						this._time = b,
						this._totalTime = m,
						this._cycle = g,
						this._rawPrevTime = y,
						this._locked = !1
					}
					if (this._time !== s || n) {
						this._initted || (this._initted = !0),
						0 === o && this.vars.onStart && 0 !== this._totalTime && (t || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || i));
						if (this._time > s)
							for (n = this._first; n; ) {
								o = n._next;
								if (this._paused && !l)
									break;
								if (n._active || n._startTime <= this._time && !n._paused && !n._gc)
									n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, !1) : n.render((e - n._startTime) * n._timeScale, t, !1);
								n = o
							}
						else
							for (n = this._last; n; ) {
								o = n._prev;
								if (this._paused && !l)
									break;
								if (n._active || n._startTime <= s && !n._paused && !n._gc)
									n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, !1) : n.render((e - n._startTime) * n._timeScale, t, !1);
								n = o
							}
						this._onUpdate && (t || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || i)),
						p && !this._locked && !this._gc && (u === this._startTime || a != this._timeScale) && (0 === this._time || r >= this.totalDuration()) && (h && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), t || this.vars[p] && this.vars[p].apply(this.vars[p + "Scope"] || this, this.vars[p + "Params"] || i))
					}
				},
				n.getActive = function (e, t, n) {
					null == e && (e = !0),
					null == t && (t = !0),
					null == n && (n = !1);
					var r = [],
					e = this.getChildren(e, t, n),
					t = 0,
					n = e.length,
					i,
					s;
					for (i = 0; i < n; i++)
						if (s = e[i], !s._paused && s._timeline._time >= s._startTime && s._timeline._time < s._startTime + s._totalDuration / s._timeScale) {
							var o;
							e : {
								for (o = s._timeline; o; ) {
									if (o._paused) {
										o = !0;
										break e
									}
									o = o._timeline
								}
								o = !1
							}
							o || (r[t++] = s)
						}
					return r
				},
				n.getLabelAfter = function (e) {
					!e && 0 !== e && (e = this._time);
					var t = this.getLabelsArray(),
					n = t.length,
					r;
					for (r = 0; r < n; r++)
						if (t[r].time > e)
							return t[r].name;
					return null
				},
				n.getLabelBefore = function (e) {
					null == e && (e = this._time);
					for (var t = this.getLabelsArray(), n = t.length; -1 < --n; )
						if (t[n].time < e)
							return t[n].name;
					return null
				},
				n.getLabelsArray = function () {
					var e = [],
					t = 0,
					n;
					for (n in this._labels)
						e[t++] = {
							time : this._labels[n],
							name : n
						};
					return e.sort(function (e, t) {
						return e.time - t.time
					}),
					e
				},
				n.progress = function (e) {
					return arguments.length ? this.totalTime(this.duration() * e + this._cycle * this._duration, !1) : this._time / this.duration()
				},
				n.totalProgress = function (e) {
					return arguments.length ? this.totalTime(this.totalDuration() * e, !1) : this._totalTime / this.totalDuration()
				},
				n.totalDuration = function (t) {
					return arguments.length ? -1 == this._repeat ? this : this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (e.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
				},
				n.time = function (e, t) {
					return arguments.length ? (this._dirty && this.totalDuration(), e > this._duration && (e = this._duration), this._yoyo && 0 !== (this._cycle & 1) ? e = this._duration - e + this._cycle * (this._duration + this._repeatDelay) : 0 != this._repeat && (e += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(e, t)) : this._time
				},
				n.repeat = function (e) {
					return arguments.length ? (this._repeat = e, this._uncache(!0)) : this._repeat
				},
				n.repeatDelay = function (e) {
					return arguments.length ? (this._repeatDelay = e, this._uncache(!0)) : this._repeatDelay
				},
				n.yoyo = function (e) {
					return arguments.length ? (this._yoyo = e, this) : this._yoyo
				},
				n.currentLabel = function (e) {
					return arguments.length ? this.seek(e, !0) : this.getLabelBefore(this._time + 1e-8)
				},
				r
			}, !0),
			_gsDefine("plugins.BezierPlugin", ["plugins.TweenPlugin"], function (e) {
				var t = function () {
					e.call(this, "bezier", -1),
					this._overwriteProps.pop(),
					this._func = {},
					this._round = {}

				},
				n = t.prototype = new e("bezier", 1),
				i = 180 / Math.PI,
				s = [],
				o = [],
				u = [],
				f = {},
				c = function (e, t, n, r) {
					this.a = e,
					this.b = t,
					this.c = n,
					this.d = r,
					this.da = r - e,
					this.ca = n - e,
					this.ba = t - e
				},
				h = t.bezierThrough = function (e, t, n, i, h, v) {
					var m = {},
					g = [],
					y,
					b,
					h = "string" == typeof h ? "," + h + "," : ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,";
					null == t && (t = 1);
					for (b in e[0])
						g.push(b);
					s.length = o.length = u.length = 0;
					for (y = g.length; -1 < --y; ) {
						b = g[y],
						f[b] = -1 !== h.indexOf("," + b + ",");
						var w = m,
						E = b,
						S;
						S = e;
						var x = b,
						T = f[b],
						N = v,
						C = [],
						k = void 0,
						L = void 0,
						A = void 0,
						O = void 0,
						M = void 0,
						k = void 0;
						if (N) {
							S = [N].concat(S);
							for (L = S.length; -1 < --L; )
								"string" == typeof(k = S[L][x]) && "=" === k.charAt(1) && (S[L][x] = N[x] + Number(k.charAt(0) + k.substr(2)))
						}
						k = S.length - 2;
						if (0 > k)
							C[0] = new c(S[0][x], 0, 0, S[-1 > k ? 0 : 1][x]);
						else {
							for (L = 0; L < k; L++)
								A = S[L][x], O = S[L + 1][x], C[L] = new c(A, 0, 0, O), T && (M = S[L + 2][x], s[L] = (s[L] || 0) + (O - A) * (O - A), o[L] = (o[L] || 0) + (M - O) * (M - O));
							C[L] = new c(S[L][x], 0, 0, S[L + 1][x])
						}
						S = C,
						w[E] = S
					}
					for (y = s.length; -1 < --y; )
						s[y] = Math.sqrt(s[y]), o[y] = Math.sqrt(o[y]);
					if (!i) {
						for (y = g.length; -1 < --y; )
							if (f[b]) {
								a = m[g[y]],
								l = a.length - 1;
								for (j = 0; j < l; j++)
									r = a[j + 1].da / o[j] + a[j].da / s[j], u[j] = (u[j] || 0) + r * r
							}
						for (y = u.length; -1 < --y; )
							u[y] = Math.sqrt(u[y])
					}
					for (y = g.length; -1 < --y; ) {
						b = g[y],
						e = m[b],
						h = t,
						v = n,
						w = i,
						b = f[b],
						E = e.length - 1,
						S = 0;
						for (var x = e[0].a, _ = M = O = N = k = O = A = k = L = A = C = N = T = void 0, T = 0; T < E; T++)
							L = e[S], N = L.a, C = L.d, A = e[S + 1].d, b ? (O = s[T], M = o[T], _ = .25 * (M + O) * h / (w ? .5 : u[T] || .5), k = C - (C - N) * (w ? .5 * h : _ / O), A = C + (A - C) * (w ? .5 * h : _ / M), O = C - (k + (A - k) * (3 * O / (O + M) + .5) / 4)) : (k = C - .5 * (C - N) * h, A = C + .5 * (A - C) * h, O = C - (k + A) / 2), k += O, A += O, L.c = k, L.b = 0 != T ? x : x = L.a + .6 * (L.c - L.a), L.da = C - N, L.ca = k - N, L.ba = x - N, v ? (N = p(N, x, k, C), e.splice(S, 1, N[0], N[1], N[2], N[3]), S += 4) : S++, x = A;
						L = e[S],
						L.b = x,
						L.c = x + .4 * (L.d - x),
						L.da = L.d - L.a,
						L.ca = L.c - L.a,
						L.ba = x - L.a,
						v && (N = p(L.a, x, L.c, L.d), e.splice(S, 1, N[0], N[1], N[2], N[3]))
					}
					return m
				},
				p = t.cubicToQuadratic = function (e, t, n, r) {
					var i = {
						a : e
					},
					s = {},
					o = {},
					u = {
						c : r
					},
					a = (e + t) / 2,
					f = (t + n) / 2,
					n = (n + r) / 2,
					t = (a + f) / 2,
					f = (f + n) / 2,
					l = (f - t) / 8;
					return i.b = a + (e - a) / 4,
					s.b = t + l,
					i.c = s.a = (i.b + s.b) / 2,
					s.c = o.a = (t + f) / 2,
					o.b = f - l,
					u.b = n + (r - n) / 4,
					o.c = u.a = (o.b + u.b) / 2,
					[i, s, o, u]
				};
				return t.quadraticToCubic = function (e, t, n) {
					return new c(e, (2 * t + e) / 3, (2 * t + n) / 3, n)
				},
				n.constructor = t,
				t.API = 2,
				n._onInitTween = function (e, t, n) {
					this._target = e,
					t instanceof Array && (t = {
							values : t
						}),
					this._props = [],
					this._timeRes = null == t.timeResolution ? 6 : parseInt(t.timeResolution);
					var r = t.values || [],
					i = {},
					s = r[0],
					n = t.autoRotate || n.vars.orientToBezier,
					o,
					u,
					a;
					this._autoRotate = n ? n instanceof Array ? n : [["x", "y", "rotation", !0 === n ? 0 : Number(n) || 0]] : null;
					for (o in s)
						this._props.push(o);
					for (s = this._props.length; -1 < --s; )
						o = this._props[s], this._overwriteProps.push(o), n = this._func[o] = "function" == typeof e[o], i[o] = n ? e[o.indexOf("set") || "function" != typeof e["get" + o.substr(3)] ? o : "get" + o.substr(3)]() : parseFloat(e[o]), a || i[o] !== r[0][o] && (a = i);
					if ("cubic" !== t.type && "quadratic" !== t.type && "soft" !== t.type)
						i = h(r, isNaN(t.curviness) ? 1 : t.curviness, !1, "thruBasic" === t.type, t.correlate, a);
					else {
						n = (n = t.type) || "soft",
						t = {},
						a = "cubic" === n ? 3 : 2;
						var n = "soft" === n,
						s = [],
						f,
						l,
						p,
						d,
						v,
						m,
						g,
						y,
						w;
						n && i && (r = [i].concat(r));
						if (null == r || r.length < a + 1)
							throw "invalid Bezier data";
						for (l in r[0])
							s.push(l);
						for (m = s.length; -1 < --m; ) {
							l = s[m],
							t[l] = v = [],
							w = 0,
							y = r.length;
							for (g = 0; g < y; g++)
								f = null == i ? r[g][l] : "string" == typeof(p = r[g][l]) && "=" === p.charAt(1) ? i[l] + Number(p.charAt(0) + p.substr(2)) : Number(p), n && 1 < g && g < y - 1 && (v[w++] = (f + v[w - 2]) / 2), v[w++] = f;
							y = w - a + 1;
							for (g = w = 0; g < y; g += a)
								f = v[g], l = v[g + 1], p = v[g + 2], d = 2 === a ? 0 : v[g + 3], v[w++] = p = 3 === a ? new c(f, l, p, d) : new c(f, (2 * l + f) / 3, (2 * l + p) / 3, p);
							v.length = w
						}
						i = t
					}
					this._beziers = i,
					this._segCount = this._beziers[o].length;
					if (this._timeRes) {
						s = this._beziers,
						o = this._timeRes,
						o = o >> 0 || 6,
						i = [],
						l = [],
						r = p = 0,
						t = o - 1,
						a = [],
						n = [];
						for (u in s) {
							f = s[u],
							v = i,
							m = o,
							g = 1 / m,
							y = f.length;
							for (var E = void 0, S = void 0, x = d = w = S = void 0, T = E = void 0, N = void 0, N = x = void 0; -1 < --y; ) {
								x = f[y],
								S = x.a,
								w = x.d - S,
								d = x.c - S,
								x = x.b - S,
								S = 0;
								for (T = 1; T <= m; T++)
									E = g * T, N = 1 - E, E = S - (S = (E * E * w + 3 * N * (E * d + N * x)) * E), N = y * m + T - 1, v[N] = (v[N] || 0) + E * E
							}
						}
						s = i.length;
						for (u = 0; u < s; u++)
							p += Math.sqrt(i[u]), f = u % o, n[f] = p, f === t && (r += p, f = u / o >> 0, a[f] = n, l[f] = r, p = 0, n = []);
						this._length = r,
						this._lengths = l,
						this._segments = a,
						this._l1 = this._li = this._s1 = this._si = 0,
						this._l2 = this._lengths[0],
						this._curSeg = this._segments[0],
						this._s2 = this._curSeg[0],
						this._prec = 1 / this._curSeg.length
					}
					if (n = this._autoRotate) {
						n[0]instanceof Array || (this._autoRotate = n = [n]);
						for (s = n.length; -1 < --s; )
							for (u = 0; 3 > u; u++)
								o = n[s][u], this._func[o] = "function" == typeof e[o] ? e[o.indexOf("set") || "function" != typeof e["get" + o.substr(3)] ? o : "get" + o.substr(3)] : !1
					}
					return !0
				},
				n.setRatio = function (e) {
					var t = this._segCount,
					n = this._func,
					r = this._target,
					s,
					o,
					u,
					a,
					f;
					if (this._timeRes) {
						s = this._lengths,
						a = this._curSeg,
						e *= this._length,
						o = this._li;
						if (e > this._l2 && o < t - 1) {
							for (t -= 1; o < t && (this._l2 = s[++o]) <= e; );
							this._l1 = s[o - 1],
							this._li = o,
							this._curSeg = a = this._segments[o],
							this._s2 = a[this._s1 = this._si = 0]
						} else if (e < this._l1 && 0 < o) {
							for (; 0 < o && (this._l1 = s[--o]) >= e; );
							0 === o && e < this._l1 ? this._l1 = 0 : o++,
							this._l2 = s[o],
							this._li = o,
							this._curSeg = a = this._segments[o],
							this._s1 = a[(this._si = a.length - 1) - 1] || 0,
							this._s2 = a[this._si]
						}
						s = o,
						e -= this._l1,
						o = this._si;
						if (e > this._s2 && o < a.length - 1) {
							for (t = a.length - 1; o < t && (this._s2 = a[++o]) <= e; );
							this._s1 = a[o - 1],
							this._si = o
						} else if (e < this._s1 && 0 < o) {
							for (; 0 < o && (this._s1 = a[--o]) >= e; );
							0 === o && e < this._s1 ? this._s1 = 0 : o++,
							this._s2 = a[o],
							this._si = o
						}
						a = (o + (e - this._s1) / (this._s2 - this._s1)) * this._prec
					} else
						s = 0 > e ? 0 : 1 <= e ? t - 1 : t * e >> 0, a = (e - s * (1 / t)) * t;
					t = 1 - a;
					for (o = this._props.length; -1 < --o; )
						(e = this._props[o], u = this._beziers[e][s], f = (a * a * u.da + 3 * t * (a * u.ca + t * u.ba)) * a + u.a, this._round[e] && (f = f + (0 < f ? .5 : -0.5) >> 0), n[e]) ? r[e](f) : r[e] = f;
					if (this._autoRotate) {
						var t = this._autoRotate,
						l,
						c,
						h,
						p,
						d;
						for (o = t.length; -1 < --o; )
							e = t[o][2], p = t[o][3] || 0, d = 1 == t[o][4] ? 1 : i, u = this._beziers[t[o][0]][s], f = this._beziers[t[o][1]][s], l = u.a + (u.b - u.a) * a, c = u.b + (u.c - u.b) * a, l += (c - l) * a, c += (u.c + (u.d - u.c) * a - c) * a, u = f.a + (f.b - f.a) * a, h = f.b + (f.c - f.b) * a, u += (h - u) * a, h += (f.c + (f.d - f.c) * a - h) * a, f = Math.atan2(h - u, c - l) * d + p, n[e] ? n[e].call(r, f) : r[e] = f
					}
				},
				n._roundProps = function (e, t) {
					for (var n = this._overwriteProps, r = n.length; -1 < --r; )
						if (e[n[r]] || e.bezier || e.bezierThrough)
							this._round[n[r]] = t
				},
				n._kill = function (t) {
					var n = this._props,
					r,
					i;
					for (r in _beziers)
						if (r in t) {
							delete this._beziers[r],
							delete this._func[r];
							for (i = n.length; -1 < --i; )
								n[i] === r && n.splice(i, 1)
						}
					return e.prototype._kill.call(this, t)
				},
				e.activate([t]),
				t
			}, !0),
			_gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function (e) {
				var t = function () {
					e.call(this, "css"),
					this._overwriteProps.pop()
				},
				n = t.prototype = new e("css");
				n.constructor = t,
				t.API = 2,
				t.suffixMap = {
					top : "px",
					right : "px",
					bottom : "px",
					left : "px",
					width : "px",
					height : "px",
					fontSize : "px",
					padding : "px",
					margin : "px"
				};
				var r = /[^\d\-\.]/g,
				i = /(\d|\-|\+|=|#|\.)*/g,
				s = /(\d|\.)+/g,
				o = /opacity *= *([^)]*)/,
				u = /opacity:([^;]*)/,
				a = /([A-Z])/g,
				f = /-([a-z])/gi,
				l = function (e, t) {
					return t.toUpperCase()
				},
				c = /(Left|Right|Width)/i,
				h = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
				p = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
				d = Math.PI / 180,
				v = 180 / Math.PI,
				m = {},
				g = document.createElement("div"),
				y,
				b,
				w = document.createElement("div"),
				E;
				w.innerHTML = "<a style='top:1px;opacity:.55;'>a</a>",
				b = (E = w.getElementsByTagName("a")[0]) ? /^0.55/.test(E.style.opacity) : !1;
				var S;
				/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(navigator.userAgent),
				S = parseFloat(RegExp.$1);
				var x = function (e) {
					return !e || "" === e ? z.black : z[e] ? z[e] : "number" == typeof e ? [e >> 16, e >> 8 & 255, e & 255] : "#" === e.charAt(0) ? (4 === e.length && (e = "#" + e.charAt(1) + e.charAt(1) + e.charAt(2) + e.charAt(2) + e.charAt(3) + e.charAt(3)), e = parseInt(e.substr(1), 16), [e >> 16, e >> 8 & 255, e & 255]) : e.match(s) || z.transparent
				},
				T = function (e) {
					return o.test("string" == typeof e ? e : (e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
				},
				N = document.defaultView ? document.defaultView.getComputedStyle : function () {},
				C = function (e, t, n, r) {
					return !b && "opacity" === t ? T(e) : !r && e.style[t] ? e.style[t] : (n = n || N(e, null)) ? (e = n.getPropertyValue(t.replace(a, "-$1").toLowerCase())) || n.length ? e : n[t] : e.currentStyle ? e.currentStyle[t] : null
				},
				k = function (e, t) {
					var n = {},
					r;
					if (t = t || N(e, null))
						if (r = t.length)
							for (; -1 < --r; )
								n[t[r].replace(f, l)] = t.getPropertyValue(t[r]);
						else
							for (r in t)
								n[r] = t[r];
					else if (t = e.currentStyle || e.style)
						for (r in t)
							n[r.replace(f, l)] = t[r];
					return b || (n.opacity = T(e)),
					r = B(e, t, !1),
					n.rotation = r.rotation * v,
					n.skewX = r.skewX * v,
					n.scaleX = r.scaleX,
					n.scaleY = r.scaleY,
					n.x = r.x,
					n.y = r.y,
					null != n.filters && delete n.filters,
					n
				},
				L = function (e, t, n, r) {
					var i = {},
					s,
					o;
					for (o in t)
						"cssText" !== o && "length" !== o && isNaN(o) && e[o] != (s = t[o]) && s !== O && ("number" == typeof s || "string" == typeof s) && (i[o] = s, r && r.props.push(o));
					if (n)
						for (o in n)
							"className" !== o && (i[o] = n[o]);
					return i
				},
				A = {
					scaleX : 1,
					scaleY : 1,
					x : 1,
					y : 1,
					rotation : 1,
					shortRotation : 1,
					skewX : 1,
					skewY : 1,
					scale : 1
				},
				O,
				M;
				w = document.body || document.documentElement,
				E = N(w, "");
				for (var _ = "O -o- Moz -moz- ms -ms- Webkit -webkit-".split(" "), D = 9; -1 < (D -= 2) && !C(w, _[D] + "transform", E); );
				0 < D ? (O = _[D - 1] + "Transform", M = _[D]) : M = null;
				var w = navigator.userAgent,
				P = !1,
				H;
				E = w.indexOf("Android"),
				H = -1 !== w.indexOf("Safari") && -1 === w.indexOf("Chrome") && (-1 === E || 3 < Number(w.substr(E + 8, 1)));
				var B = function (e, t, n) {
					var r = e._gsTransform,
					i;
					O ? i = C(e, M + "transform", t, !0) : e.currentStyle && (i = (i = e.currentStyle.filter.match(h)) && i.length === 4 ? i[0].substr(4) + "," + Number(i[2].substr(4)) + "," + Number(i[1].substr(4)) + "," + i[3].substr(4) + "," + (r ? r.x : 0) + "," + (r ? r.y : 0) : null);
					var t = (i || "").replace(/[^\d\-\.e,]/g, "").split(","),
					s = (i = t.length >= 6) ? Number(t[0]) : 1,
					o = i ? Number(t[1]) : 0,
					u = i ? Number(t[2]) : 0,
					a = i ? Number(t[3]) : 1,
					r = n ? r || {
						skewY : 0
					}
					 : {
						skewY : 0
					},
					f = r.scaleX < 0;
					return r.x = i ? Number(t[4]) : 0,
					r.y = i ? Number(t[5]) : 0,
					r.scaleX = Math.sqrt(s * s + o * o),
					r.scaleY = Math.sqrt(a * a + u * u),
					r.rotation = s || o ? Math.atan2(o, s) : r.rotation || 0,
					r.skewX = u || a ? Math.atan2(u, a) + r.rotation : r.skewX || 0,
					Math.abs(r.skewX) > Math.PI / 2 && (f ? (r.scaleX = r.scaleX * -1, r.skewX = r.skewX + (r.rotation <= 0 ? Math.PI : -Math.PI), r.rotation = r.rotation + (r.rotation <= 0 ? Math.PI : -Math.PI)) : (r.scaleY = r.scaleY * -1, r.skewX = r.skewX + (r.skewX <= 0 ? Math.PI : -Math.PI))),
					r.rotation < 1e-6 && r.rotation > -0.000001 && (s || o) && (r.rotation = 0),
					r.skewX < 1e-6 && r.skewX > -0.000001 && (o || u) && (r.skewX = 0),
					n && (e._gsTransform = r),
					r
				},
				j = {
					width : ["Left", "Right"],
					height : ["Top", "Bottom"]
				},
				F = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
				I = function (e, t, n, r, i) {
					if (r === "px" || !r)
						return n;
					if (r === "auto" || !n)
						return 0;
					var s = c.test(t),
					o = e,
					u = n < 0;
					return u && (n = -n),
					g.style.cssText = "border-style:solid; border-width:0; position:absolute; line-height:0;",
					r === "%" || r === "em" || !o.appendChild ? (o = e.parentNode || document.body, g.style[s ? "width" : "height"] = n + r) : g.style[s ? "borderLeftWidth" : "borderTopWidth"] = n + r,
					o.appendChild(g),
					s = parseFloat(g[s ? "offsetWidth" : "offsetHeight"]),
					o.removeChild(g),
					s === 0 && !i && (s = I(e, t, n, r, !0)),
					u ? -s : s
				},
				q = function (e, t) {
					if (e == null || e === "" || e === "auto")
						e = "0 0";
					var t = t || {},
					n = e.indexOf("left") !== -1 ? "0%" : e.indexOf("right") !== -1 ? "100%" : e.split(" ")[0],
					i = e.indexOf("top") !== -1 ? "0%" : e.indexOf("bottom") !== -1 ? "100%" : e.split(" ")[1];
					return i == null ? i = "0" : i === "center" && (i = "50%"),
					n === "center" && (n = "50%"),
					t.oxp = n.indexOf("%") !== -1,
					t.oyp = i.indexOf("%") !== -1,
					t.oxr = n.charAt(1) === "=",
					t.oyr = i.charAt(1) === "=",
					t.ox = parseFloat(n.replace(r, "")),
					t.oy = parseFloat(i.replace(r, "")),
					t
				},
				R = function (e, t) {
					return e == null ? t : typeof e == "string" && e.indexOf("=") === 1 ? Number(e.split("=").join("")) + t : Number(e)
				},
				U = function (e, t) {
					var n = e.indexOf("rad") === -1 ? d : 1,
					i = e.indexOf("=") === 1,
					e = Number(e.replace(r, "")) * n;
					return i ? e + t : e
				},
				z = {
					aqua : [0, 255, 255],
					lime : [0, 255, 0],
					silver : [192, 192, 192],
					black : [0, 0, 0],
					maroon : [128, 0, 0],
					teal : [0, 128, 128],
					blue : [0, 0, 255],
					navy : [0, 0, 128],
					white : [255, 255, 255],
					fuchsia : [255, 0, 255],
					olive : [128, 128, 0],
					yellow : [255, 255, 0],
					orange : [255, 165, 0],
					gray : [128, 128, 128],
					purple : [128, 0, 128],
					green : [0, 128, 0],
					red : [255, 0, 0],
					pink : [255, 192, 203],
					cyan : [0, 255, 255],
					transparent : [255, 255, 255, 0]
				};
				return n._onInitTween = function (e, n, r) {
					if (!e.nodeType)
						return !1;
					this._target = e,
					this._tween = r,
					this._classData = this._transform = null,
					y = n.autoRound;
					var i = this._style = e.style,
					s = N(e, ""),
					o;
					return P && i.zIndex === "" && (i.zIndex = 0),
					typeof n == "string" ? (o = i.cssText, r = k(e, s), i.cssText = o + ";" + n, r = L(r, k(e)), !b && u.test(n) && (val.opacity = parseFloat(RegExp.$1)), n = r, i.cssText = o) : n.className && (o = e.className, this._classData = {
							b : o,
							e : n.className.charAt(1) !== "=" ? n.className : n.className.charAt(0) === "+" ? e.className + " " + n.className.substr(2) : e.className.split(n.className.substr(2)).join(""),
							props : []
						}, r._duration ? (r = k(e, s), e.className = this._classData.e, n = L(r, k(e), n, this._classData), e.className = o) : n = {}),
					this._parseVars(n, e, s, n.suffixMap || t.suffixMap),
					!0
				},
				n._parseVars = function (e, t, n, s) {
					var o = this._style,
					u,
					a,
					f,
					l,
					c,
					h,
					p;
					for (u in e) {
						a = e[u];
						if (u === "transform" || u === O)
							this._parseTransform(t, a, n, s);
						else if (A[u] || u === "transformOrigin")
							this._parseTransform(t, e, n, s);
						else {
							if (u === "alpha" || u === "autoAlpha")
								u = "opacity";
							else {
								if (u === "margin" || u === "padding") {
									a = (a + "").split(" "),
									c = a.length,
									f = {},
									f[u + "Top"] = a[0],
									f[u + "Right"] = c > 1 ? a[1] : a[0],
									f[u + "Bottom"] = c === 4 ? a[2] : a[0],
									f[u + "Left"] = c === 4 ? a[3] : c === 2 ? a[1] : a[0],
									this._parseVars(f, t, n, s);
									continue
								}
								if (u === "backgroundPosition" || u === "backgroundSize") {
									f = q(a),
									p = q(l = C(t, u, n)),
									this._firstPT = f = {
										_next : this._firstPT,
										t : o,
										p : u,
										b : l,
										f : !1,
										n : "css_" + u,
										type : 3,
										s : p.ox,
										c : f.oxr ? f.ox : f.ox - p.ox,
										ys : p.oy,
										yc : f.oyr ? f.oy : f.oy - p.oy,
										sfx : f.oxp ? "%" : "px",
										ysfx : f.oyp ? "%" : "px",
										r : !f.oxp && e.autoRound !== !1
									},
									f.e = f.s + f.c + f.sfx + " " + (f.ys + f.yc) + f.ysfx;
									continue
								}
								if (u === "border") {
									a = (a + "").split(" "),
									this._parseVars({
										borderWidth : a[0],
										borderStyle : a[1] || "none",
										borderColor : a[2] || "#000000"
									}, t, n, s);
									continue
								}
								if (u === "bezier") {
									this._parseBezier(a, t, n, s);
									continue
								}
								if (u === "autoRound")
									continue
							}
							l = C(t, u, n),
							l = l != null ? l + "" : "",
							this._firstPT = f = {
								_next : this._firstPT,
								t : o,
								p : u,
								b : l,
								f : !1,
								n : "css_" + u,
								sfx : "",
								r : !1,
								type : 0
							},
							u === "opacity" && e.autoAlpha != null && (l === "1" && C(t, "visibility", n) === "hidden" && (l = f.b = "0"), this._firstPT = f._prev = {
									_next : f,
									t : o,
									p : "visibility",
									f : !1,
									n : "css_visibility",
									r : !1,
									type : -1,
									b : Number(l) !== 0 ? "visible" : "hidden",
									i : "visible",
									e : Number(a) === 0 ? "hidden" : "visible"
								}, this._overwriteProps.push("css_visibility")),
							c = typeof a == "string";
							if (u === "color" || u === "fill" || u === "stroke" || u.indexOf("Color") !== -1 || c && !a.indexOf("rgb(")) {
								c = x(l),
								a = x(a),
								f.e = f.i = (a.length > 3 ? "rgba(" : "rgb(") + a.join(",") + ")",
								f.b = (c.length > 3 ? "rgba(" : "rgb(") + c.join(",") + ")",
								f.s = Number(c[0]),
								f.c = Number(a[0]) - f.s,
								f.gs = Number(c[1]),
								f.gc = Number(a[1]) - f.gs,
								f.bs = Number(c[2]),
								f.bc = Number(a[2]) - f.bs,
								f.type = 1;
								if (c.length > 3 || a.length > 3)
									b ? (f.as = c.length < 4 ? 1 : Number(c[3]), f.ac = (a.length < 4 ? 1 : Number(a[3])) - f.as, f.type = 2) : (a[3] == 0 && (f.e = f.i = "transparent", f.type = -1), c[3] == 0 && (f.b = "transparent"))
							} else {
								h = l.replace(i, "");
								if (l === "" || l === "auto")
									if (u === "width" || u === "height") {
										var d = u;
										h = t,
										p = n,
										l = parseFloat(d === "width" ? h.offsetWidth : h.offsetHeight);
										var d = j[d],
										v = d.length;
										for (p = p || N(h, null); --v > -1; )
											l -= parseFloat(C(h, "padding" + d[v], p, !0)) || 0, l -= parseFloat(C(h, "border" + d[v] + "Width", p, !0)) || 0;
										p = l,
										h = "px"
									} else
										p = u !== "opacity" ? 0 : 1, h = "";
								else
									p = l.indexOf(" ") === -1 ? parseFloat(l.replace(r, "")) : NaN;
								c ? (c = a.charAt(1) === "=", l = a.replace(i, ""), a = a.indexOf(" ") === -1 ? parseFloat(a.replace(r, "")) : NaN) : (c = !1, l = ""),
								l === "" && (l = s[u] || h),
								f.e = a || a === 0 ? (c ? a + p : a) + l : e[u],
								h !== l && l !== "" && (a || a === 0) && (p || p === 0) && (p = I(t, u, p, h), l === "%" ? (p /= I(t, u, 100, "%") / 100, p > 100 && (p = 100)) : l === "em" ? p /= I(t, u, 1, "em") : (a = I(t, u, a, l), l = "px"), c && (a || a === 0) && (f.e = a + p + l)),
								!p && p !== 0 || !a && a !== 0 || !(f.c = c ? a : a - p) ? (f.type = -1, f.i = u === "display" && f.e === "none" ? f.b : f.e, f.s = f.c = 0) : (f.s = p, f.sfx = l, u === "opacity" ? b || (f.type = 4, f.p = "filter", f.b = "alpha(opacity=" + f.s * 100 + ")", f.e = "alpha(opacity=" + (f.s + f.c) * 100 + ")", f.dup = e.autoAlpha != null, this._style.zoom = 1) : y !== !1 && (l === "px" || u === "zIndex") && (f.r = !0))
							}
							this._overwriteProps.push("css_" + u),
							f._next && (f._next._prev = f)
						}
					}
				},
				n._parseTransform = function (e, t, n) {
					if (!this._transform) {
						var n = this._transform = B(e, n, !0),
						r = this._style,
						i,
						s;
						if (typeof t == "object") {
							e = {
								scaleX : R(t.scaleX != null ? t.scaleX : t.scale, n.scaleX),
								scaleY : R(t.scaleY != null ? t.scaleY : t.scale, n.scaleY),
								x : R(t.x, n.x),
								y : R(t.y, n.y)
							},
							t.shortRotation != null ? (e.rotation = typeof t.shortRotation == "number" ? t.shortRotation * d : U(t.shortRotation, n.rotation), i = (e.rotation - n.rotation) % (Math.PI * 2), i !== i % Math.PI && (i += Math.PI * (i < 0 ? 2 : -2)), e.rotation = n.rotation + i) : e.rotation = t.rotation == null ? n.rotation : typeof t.rotation == "number" ? t.rotation * d : U(t.rotation, n.rotation),
							e.skewX = t.skewX == null ? n.skewX : typeof t.skewX == "number" ? t.skewX * d : U(t.skewX, n.skewX),
							e.skewY = t.skewY == null ? n.skewY : typeof t.skewY == "number" ? t.skewY * d : U(t.skewY, n.skewY);
							if (i = e.skewY - n.skewY)
								e.skewX = e.skewX + i, e.rotation = e.rotation + i;
							e.skewY < 1e-6 && e.skewY > -0.000001 && (e.skewY = 0),
							e.skewX < 1e-6 && e.skewX > -0.000001 && (e.skewX = 0),
							e.rotation < 1e-6 && e.rotation > -0.000001 && (e.rotation = 0),
							(t = t.transformOrigin) != null && (O ? (s = O + "Origin", this._firstPT = t = {
										_next : this._firstPT,
										t : r,
										p : s,
										s : 0,
										c : 0,
										n : s,
										f : !1,
										r : !1,
										b : r[s],
										e : t,
										i : t,
										type : -1,
										sfx : ""
									}, t._next && (t._next._prev = t)) : q(t, n))
						} else {
							if (typeof t != "string" || !O)
								return;
							i = r[O],
							r[O] = t,
							e = B(e, null, !1),
							r[O] = i
						}
						O ? H && (P = !0, r.WebkitBackfaceVisibility === "" && (r.WebkitBackfaceVisibility = "hidden"), r.zIndex === "" && (r.zIndex = 0)) : r.zoom = 1;
						for (s in A)
							(n[s] !== e[s] || m[s] != null) && s !== "shortRotation" && s !== "scale" && (this._firstPT = t = {
									_next : this._firstPT,
									t : n,
									p : s,
									s : n[s],
									c : e[s] - n[s],
									n : s,
									f : !1,
									r : !1,
									b : n[s],
									e : e[s],
									type : 0,
									sfx : 0
								}, t._next && (t._next._prev = t), this._overwriteProps.push("css_" + s))
					}
				},
				n._parseBezier = function (e, t, n, r) {
					if (window.com.greensock.plugins.BezierPlugin) {
						e instanceof Array && (e = {
								values : e
							});
						var i = e.values || [],
						s = i.length,
						o = [],
						u = this._bezier = {
							_pt : []
						},
						a = u._proxy = {},
						f = 0,
						l = 0,
						c = {},
						h = s - 1,
						p = m,
						d = u._plugin = new window.com.greensock.plugins.BezierPlugin,
						v,
						g,
						y,
						b,
						w;
						for (v = 0; v < s; v++) {
							b = {},
							this._transform = null,
							y = this._firstPT,
							this._parseVars(m = i[v], t, n, r),
							g = this._firstPT;
							if (v === 0) {
								for (w = this._transform; g !== y; )
									a[g.p] = g.s, u._pt[l++] = c[g.p] = g, g.type === 1 || g.type === 2 ? (a[g.p + "_g"] = g.gs, a[g.p + "_b"] = g.bs, g.type === 2 && (a[g.p + "_a"] = g.as)) : g.type === 3 && (a[g.p + "_y"] = g.ys), g = g._next;
								g = this._firstPT
							} else
								this._firstPT = y, y._prev && (y._prev._next = null), y = y._prev = null;
							for (; g !== y; )
								c[g.p] && (b[g.p] = g.s + g.c, v === h && (c[g.p].e = g.e), g.type === 1 || g.type === 2 ? (b[g.p + "_g"] = g.gs + g.gc, b[g.p + "_b"] = g.bs + g.bc, g.type === 2 && (b[g.p + "_a"] = g.as + g.ac)) : g.type === 3 && (b[g.p + "_y"] = g.ys + g.yc), v === 0 && (g.c = g.ac = g.gc = g.bc = g.yc = 0)), g = g._next;
							o[f++] = b
						}
						this._transform = w,
						m = p,
						e.values = o,
						e.autoRotate === 0 && (e.autoRotate = !0),
						e.autoRotate && !(e.autoRotate instanceof Array) && (v = e.autoRotate == 1 ? 0 : Number(e.autoRotate) * Math.PI / 180, e.autoRotate = o[0].left != null ? [["left", "top", "rotation", v, !0]] : o[0].x != null ? [["x", "y", "rotation", v, !0]] : !1),
						(u._autoRotate = e.autoRotate) && !w && (this._transform = B(t, n, !0)),
						d._onInitTween(a, e, this._tween),
						e.values = i
					} else
						console.log("Error: BezierPlugin not loaded.")
				},
				n.setRatio = function (e) {
					var t = this._firstPT,
					n = this._bezier,
					r = 1e-6,
					s,
					u;
					if (n) {
						n._plugin.setRatio(e);
						var a = n._pt,
						f = n._proxy;
						for (u = a.length; --u > -1; )
							t = a[u], t.s = f[t.p], t.type === 1 || t.type === 2 ? (t.gs = f[t.p + "_g"], t.bs = f[t.p + "_b"], t.type === 2 && (t.as = f[t.p + "_a"])) : t.type === 3 && (t.ys = f[t.p + "_y"]);
						n._autoRotate && (this._transform.rotation = f.rotation)
					}
					if (e !== 1 || this._tween._time !== this._tween._duration && this._tween._time !== 0)
						if (e || this._tween._time !== this._tween._duration && this._tween._time !== 0)
							for (; t; )
								s = t.c * e + t.s, t.r ? s = s > 0 ? s + .5 >> 0 : s - .5 >> 0 : s < r && s > -r && (s = 0), t.type ? t.type === 1 ? t.t[t.p] = "rgb(" + (s >> 0) + ", " + (t.gs + e * t.gc >> 0) + ", " + (t.bs + e * t.bc >> 0) + ")" : t.type === 2 ? t.t[t.p] = "rgba(" + (s >> 0) + ", " + (t.gs + e * t.gc >> 0) + ", " + (t.bs + e * t.bc >> 0) + ", " + (t.as + e * t.ac) + ")" : t.type === -1 ? t.t[t.p] = t.i : t.type === 3 ? (n = t.ys + e * t.yc, t.r && (n = n > 0 ? n + .5 >> 0 : n - .5 >> 0), t.t[t.p] = s + t.sfx + " " + n + t.ysfx) : (t.dup && (t.t.filter = t.t.filter || "alpha(opacity=100)"), t.t.filter = t.t.filter.indexOf("opacity") === -1 ? t.t.filter + (" alpha(opacity=" + (s * 100 >> 0) + ")") : t.t.filter.replace(o, "opacity=" + (s * 100 >> 0))) : t.t[t.p] = s + t.sfx, t = t._next;
						else
							for (; t; )
								t.t[t.p] = t.b, t.type === 4 && t.s === 1 && (this._style.removeAttribute("filter"), C(this._target, "filter") && (t.t[t.p] = t.b)), t = t._next;
					else
						for (; t; )
							t.t[t.p] = t.e, t.type === 4 && t.s + t.c === 1 && (this._style.removeAttribute("filter"), C(this._target, "filter") && (t.t[t.p] = t.e)), t = t._next;
					if (this._transform) {
						t = this._transform;
						if (O && !t.rotation && !t.skewX)
							this._style[O] = (t.x || t.y ? "translate(" + t.x + "px," + t.y + "px) " : "") + (t.scaleX !== 1 || t.scaleY !== 1 ? "scale(" + t.scaleX + "," + t.scaleY + ")" : "") || "translate(0px,0px)";
						else {
							var a = O ? t.rotation : -t.rotation,
							l = O ? a - t.skewX : a + t.skewX,
							n = Math.cos(a) * t.scaleX,
							a = Math.sin(a) * t.scaleX,
							f = Math.sin(l) * -t.scaleY,
							l = Math.cos(l) * t.scaleY,
							c;
							n < r && n > -r && (n = 0),
							a < r && a > -r && (a = 0),
							f < r && f > -r && (f = 0),
							l < r && l > -r && (l = 0);
							if (O)
								this._style[O] = "matrix(" + n + "," + a + "," + f + "," + l + "," + t.x + "," + t.y + ")";
							else if (c = this._target.currentStyle) {
								r = a,
								a = -f,
								f = -r,
								r = this._style.filter,
								this._style.filter = "",
								u = this._target.offsetWidth,
								s = this._target.offsetHeight;
								var h = c.position !== "absolute",
								d = "progid:DXImageTransform.Microsoft.Matrix(M11=" + n + ", M12=" + a + ", M21=" + f + ", M22=" + l,
								v = t.x,
								m = t.y,
								g,
								y;
								t.ox != null && (g = (t.oxp ? u * t.ox * .01 : t.ox) - u / 2, y = (t.oyp ? s * t.oy * .01 : t.oy) - s / 2, v = g - (g * n + y * a) + t.x, m = y - (g * f + y * l) + t.y);
								if (h)
									g = u / 2, y = s / 2, d += ", Dx=" + (g - (g * n + y * a) + v) + ", Dy=" + (y - (g * f + y * l) + m) + ")";
								else {
									var b = S < 8 ? 1 : -1;
									g = t.ieOffsetX || 0,
									y = t.ieOffsetY || 0,
									t.ieOffsetX = Math.round((u - ((n < 0 ? -n : n) * u + (a < 0 ? -a : a) * s)) / 2 + v),
									t.ieOffsetY = Math.round((s - ((l < 0 ? -l : l) * s + (f < 0 ? -f : f) * u)) / 2 + m);
									for (u = 0; u < 4; u++)
										v = F[u], s = c[v], s = s.indexOf("px") !== -1 ? parseFloat(s) : I(this._target, v, parseFloat(s), s.replace(i, "")) || 0, m = s !== t[v] ? u < 2 ? -t.ieOffsetX : -t.ieOffsetY : u < 2 ? g - t.ieOffsetX : y - t.ieOffsetY, this._style[v] = (t[v] = Math.round(s - m * (u === 0 || u === 2 ? 1 : b))) + "px";
									d += ", sizingMethod='auto expand')"
								}
								this._style.filter = r.indexOf("progid:DXImageTransform.Microsoft.Matrix(") !== -1 ? r.replace(p, d) : r + " " + d,
								(e === 0 || e === 1) && n === 1 && a === 0 && f === 0 && l === 1 && (!h || d.indexOf("Dx=0, Dy=0") !== -1) && (!o.test(r) || parseFloat(RegExp.$1) === 100) && this._style.removeAttribute("filter")
							}
						}
					}
					if (this._classData) {
						t = this._classData;
						if (e !== 1 || this._tween._time !== this._tween._duration && this._tween._time !== 0)
							this._target.className !== t.b && (this._target.className = t.b);
						else {
							for (u = t.props.length; --u > -1; )
								this._style[t.props[u]] = "";
							this._target.className = t.e
						}
					}
				},
				n._kill = function (t) {
					var n = t,
					r;
					if (t.autoAlpha || t.alpha) {
						n = {};
						for (r in t)
							n[r] = t[r];
						n.opacity = 1,
						n.autoAlpha && (n.visibility = 1)
					}
					return e.prototype._kill.call(this, n)
				},
				e.activate([t]),
				t
			}, !0),
			_gsDefine("plugins.RoundPropsPlugin", ["plugins.TweenPlugin"], function (e) {
				var t = function () {
					e.call(this, "roundProps", -1),
					this._overwriteProps.pop()
				},
				n = t.prototype = new e("roundProps", -1);
				return n.constructor = t,
				t.API = 2,
				n._onInitTween = function (e, t, n) {
					return this._tween = n,
					!0
				},
				n._onInitAllProps = function () {
					for (var e = this._tween, t = e.vars.roundProps instanceof Array ? e.vars.roundProps : e.vars.roundProps.split(","), n = t.length, r = {}, i, s; -1 < --n; )
						r[t[n]] = 1;
					for (n = t.length; -1 < --n; ) {
						i = t[n];
						for (s = e._firstPT; s; )
							s.pg ? s.t._roundProps(r, !0) : s.n == i && (this._add(s.t, i, s.s, s.c), s._next && (s._next._prev = s._prev), s._prev ? s._prev._next = s._next : e._firstPT === s && (e._firstPT = s._next), s._next = s._prev = null, e._propLookup[i] = this), s = s._next
					}
					return !1
				},
				n._add = function (e, t, n, r) {
					this._addTween(e, t, n, n + r, t, !0),
					this._overwriteProps.push(t)
				},
				e.activate([t]),
				t
			}, !0),
			_gsDefine("easing.Back", ["easing.Ease"], function (e) {
				var t = window.com.greensock._class,
				n = function (n, r) {
					var i = t("easing." + n, function () {}, !0),
					s = i.prototype = new e;
					return s.constructor = i,
					s.getRatio = r,
					i
				},
				r = function (n, r) {
					var i = t("easing." + n, function (e) {
							this._p1 = e || 0 === e ? e : 1.70158,
							this._p2 = 1.525 * this._p1
						}, !0),
					s = i.prototype = new e;
					return s.constructor = i,
					s.getRatio = r,
					s.config = function (e) {
						return new i(e)
					},
					i
				},
				i = r("BackOut", function (e) {
						return (e -= 1) * e * ((this._p1 + 1) * e + this._p1) + 1
					}),
				s = r("BackIn", function (e) {
						return e * e * ((this._p1 + 1) * e - this._p1)
					}),
				r = r("BackInOut", function (e) {
						return 1 > (e *= 2) ? .5 * e * e * ((this._p2 + 1) * e - this._p2) : .5 * ((e -= 2) * e * ((this._p2 + 1) * e + this._p2) + 2)
					}),
				o = n("BounceOut", function (e) {
						return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
					}),
				u = n("BounceIn", function (e) {
						return (e = 1 - e) < 1 / 2.75 ? 1 - 7.5625 * e * e : e < 2 / 2.75 ? 1 - (7.5625 * (e -= 1.5 / 2.75) * e + .75) : e < 2.5 / 2.75 ? 1 - (7.5625 * (e -= 2.25 / 2.75) * e + .9375) : 1 - (7.5625 * (e -= 2.625 / 2.75) * e + .984375)
					}),
				a = n("BounceInOut", function (e) {
						var t = .5 > e,
						e = t ? 1 - 2 * e : 2 * e - 1,
						e = e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375;
						return t ? .5 * (1 - e) : .5 * e + .5
					}),
				f = n("CircOut", function (e) {
						return Math.sqrt(1 - (e -= 1) * e)
					}),
				l = n("CircIn", function (e) {
						return  - (Math.sqrt(1 - e * e) - 1)
					}),
				c = n("CircInOut", function (e) {
						return 1 > (e *= 2) ? -0.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
					}),
				h = 2 * Math.PI,
				p = function (n, r, i) {
					var s = t("easing." + n, function (e, t) {
							this._p1 = e || 1,
							this._p2 = t || i,
							this._p3 = this._p2 / h * (Math.asin(1 / this._p1) || 0)
						}, !0),
					n = s.prototype = new e;
					return n.constructor = s,
					n.getRatio = r,
					n.config = function (e, t) {
						return new s(e, t)
					},
					s
				},
				d = p("ElasticOut", function (e) {
						return this._p1 * Math.pow(2, -10 * e) * Math.sin((e - this._p3) * h / this._p2) + 1
					}, .3),
				v = p("ElasticIn", function (e) {
						return  - (this._p1 * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - this._p3) * h / this._p2))
					}, .3),
				p = p("ElasticInOut", function (e) {
						return 1 > (e *= 2) ? -0.5 * this._p1 * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - this._p3) * h / this._p2) : .5 * this._p1 * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - this._p3) * h / this._p2) + 1
					}, .45),
				m = n("ExpoOut", function (e) {
						return 1 - Math.pow(2, -10 * e)
					}),
				g = n("ExpoIn", function (e) {
						return Math.pow(2, 10 * (e - 1)) - .001
					}),
				y = n("ExpoInOut", function (e) {
						return 1 > (e *= 2) ? .5 * Math.pow(2, 10 * (e - 1)) : .5 * (2 - Math.pow(2, -10 * (e - 1)))
					}),
				b = Math.PI / 2,
				w = n("SineOut", function (e) {
						return Math.sin(e * b)
					}),
				E = n("SineIn", function (e) {
						return -Math.cos(e * b) + 1
					}),
				n = n("SineInOut", function (e) {
						return -0.5 * (Math.cos(Math.PI * e) - 1)
					}),
				S = t("easing.SlowMo", function (e, t, n) {
						null == e ? e = .7 : 1 < e && (e = 1),
						this._p = 1 != e ? t || 0 === t ? t : .7 : 0,
						this._p1 = (1 - e) / 2,
						this._p2 = e,
						this._p3 = this._p1 + this._p2,
						this._calcEnd = !0 === n
					}, !0),
				x = S.prototype = new e;
				x.constructor = S,
				x.getRatio = function (e) {
					var t = e + (.5 - e) * this._p;
					return e < this._p1 ? this._calcEnd ? 1 - (e = 1 - e / this._p1) * e : t - (e = 1 - e / this._p1) * e * e * e * t : e > this._p3 ? this._calcEnd ? 1 - (e = (e - this._p3) / this._p1) * e : t + (e - t) * (e = (e - this._p3) / this._p1) * e * e * e : this._calcEnd ? 1 : t
				},
				S.ease = new S(.7, .7),
				x.config = S.config = function (e, t, n) {
					return new S(e, t, n)
				};
				var T = t("easing.SteppedEase", function (e) {
						e = e || 1,
						this._p1 = 1 / e,
						this._p2 = e + 1
					}, !0),
				x = T.prototype = new e;
				return x.constructor = T,
				x.getRatio = function (e) {
					return 0 > e ? e = 0 : 1 <= e && (e = .999999999),
					(this._p2 * e >> 0) * this._p1
				},
				x.config = T.config = function (e) {
					return new T(e)
				},
				t("easing.Bounce", {
					easeOut : new o,
					easeIn : new u,
					easeInOut : new a
				}, !0),
				t("easing.Circ", {
					easeOut : new f,
					easeIn : new l,
					easeInOut : new c
				}, !0),
				t("easing.Elastic", {
					easeOut : new d,
					easeIn : new v,
					easeInOut : new p
				}, !0),
				t("easing.Expo", {
					easeOut : new m,
					easeIn : new g,
					easeInOut : new y
				}, !0),
				t("easing.Sine", {
					easeOut : new w,
					easeIn : new E,
					easeInOut : new n
				}, !0), {
					easeOut : new i,
					easeIn : new s,
					easeInOut : new r
				}
			}, !0)
		}),
		function (e) {
			var n = function (t) {
				var t = t.split("."),
				n = e,
				r;
				for (r = 0; r < t.length; r++)
					n[t[r]] = n = n[t[r]] || {};
				return n
			},
			r = n("com.greensock"),
			i,
			s,
			o,
			u,
			a,
			f = {},
			l = function (r, i, s, o) {
				this.sc = f[r] ? f[r].sc : [],
				f[r] = this,
				this.gsClass = null,
				this.def = s;
				var u = i || [],
				a = [];
				this.check = function (i) {
					for (var c = u.length, h = 0, p; -1 < --c; )
						(p = f[u[c]] || new l(u[c])).gsClass ? a[c] = p.gsClass : (h++, i && p.sc.push(this));
					if (0 === h && s) {
						var i = ("com.greensock." + r).split("."),
						c = i.pop(),
						d = n(i.join("."))[c] = this.gsClass = s.apply(s, a);
						o && ((e.GreenSockGlobals || e)[c] = d, "function" == typeof define && define.amd ? define((e.GreenSockAMDPath ? e.GreenSockAMDPath + "/" : "") + r.split(".").join("/"), [], function () {
								return d
							}) : "undefined" != typeof t && t.exports && (t.exports = d));
						for (c = 0; c < this.sc.length; c++)
							this.sc[c].check(!1)
					}
				},
				this.check(!0)
			},
			c = r._class = function (e, t, n) {
				return new l(e, [], function () {
					return t
				}, n),
				t
			};
			e._gsDefine = function (e, t, n, r) {
				return new l(e, t, n, r)
			};
			var h = [0, 0, 1, 1],
			p = [],
			d = c("easing.Ease", function (e, t, n, r) {
					this._func = e,
					this._type = n || 0,
					this._power = r || 0,
					this._params = t ? h.concat(t) : h
				}, !0);
			o = d.prototype,
			o._calcEnd = !1,
			o.getRatio = function (e) {
				if (this._func)
					return this._params[0] = e, this._func.apply(null, this._params);
				var t = this._type,
				n = this._power,
				r = 1 === t ? 1 - e : 2 === t ? e : .5 > e ? 2 * e : 2 * (1 - e);
				return 1 === n ? r *= r : 2 === n ? r *= r * r : 3 === n ? r *= r * r * r : 4 === n && (r *= r * r * r * r),
				1 === t ? 1 - r : 2 === t ? r : .5 > e ? r / 2 : 1 - r / 2
			},
			i = ["Linear", "Quad", "Cubic", "Quart", "Quint"];
			for (s = i.length; -1 < --s; )
				o = c("easing." + i[s], function () {}, !0), u = c("easing.Power" + s, function () {}, !0), o.easeOut = u.easeOut = new d(null, null, 1, s), o.easeIn = u.easeIn = new d(null, null, 2, s), o.easeInOut = u.easeInOut = new d(null, null, 3, s);
			c("easing.Strong", r.easing.Power4, !0),
			r.easing.Linear.easeNone = r.easing.Linear.easeIn,
			o = c("events.EventDispatcher", function (e) {
					this._listeners = {},
					this._eventTarget = e || this
				}).prototype,
			o.addEventListener = function (e, t, n, r, i) {
				var i = i || 0,
				s = this._listeners[e],
				o = 0,
				u;
				null == s && (this._listeners[e] = s = []);
				for (u = s.length; -1 < --u; )
					e = s[u], e.c === t ? s.splice(u, 1) : 0 === o && e.pr < i && (o = u + 1);
				s.splice(o, 0, {
					c : t,
					s : n,
					up : r,
					pr : i
				})
			},
			o.removeEventListener = function (e, t) {
				var n = this._listeners[e];
				if (n)
					for (var r = n.length; -1 < --r; )
						if (n[r].c === t) {
							n.splice(r, 1);
							break
						}
			},
			o.dispatchEvent = function (e) {
				var t = this._listeners[e];
				if (t)
					for (var n = t.length, r, i = this._eventTarget; -1 < --n; )
						r = t[n], r.up ? r.c.call(r.s || i, {
							type : e,
							target : i
						}) : r.c.call(r.s || i)
			};
			var v = e.requestAnimationFrame,
			m = e.cancelAnimationFrame,
			g = Date.now || function () {
				return (new Date).getTime()
			};
			i = ["ms", "moz", "webkit", "o"];
			for (s = i.length; -1 < --s && !v; )
				v = e[i[s] + "RequestAnimationFrame"], m = e[i[s] + "CancelAnimationFrame"] || e[i[s] + "CancelRequestAnimationFrame"];
			m || (m = function (t) {
				e.clearTimeout(t)
			}),
			c("Ticker", function (t, n) {
				this.frame = this.time = 0;
				var r = this,
				i = g(),
				s = !1 !== n,
				o,
				u,
				a,
				f,
				l;
				this.tick = function () {
					r.time = (g() - i) / 1e3;
					if (!o || r.time >= l)
						r.frame++, l = r.time + f - (r.time - l) - 5e-4, l <= r.time && (l = r.time + .001), r.dispatchEvent("tick");
					a = u(r.tick)
				},
				this.fps = function (t) {
					if (!arguments.length)
						return o;
					o = t,
					f = 1 / (o || 60),
					l = this.time + f,
					u = 0 === o ? function () {}

					 : !s || !v ? function (t) {
						return e.setTimeout(t, 1e3 * (l - r.time) + 1 >> 0 || 1)
					}
					 : v,
					m(a),
					a = u(r.tick)
				},
				this.useRAF = function (e) {
					if (!arguments.length)
						return s;
					s = e,
					this.fps(o)
				},
				this.fps(t)
			}),
			o = r.Ticker.prototype = new r.events.EventDispatcher,
			o.constructor = r.Ticker;
			var y = c("core.Animation", function (e, t) {
					this.vars = t || {},
					this._duration = this._totalDuration = e || 0,
					this._delay = Number(this.vars.delay) || 0,
					this._timeScale = 1,
					this._active = 1 == this.vars.immediateRender,
					this.data = this.vars.data,
					this._reversed = 1 == this.vars.reversed;
					if (k) {
						a || (b.tick(), a = !0);
						var n = this.vars.useFrames ? C : k;
						n.insert(this, n._time),
						this.vars.paused && this.paused(!0)
					}
				}),
			b = y.ticker = new r.Ticker;
			o = y.prototype,
			o._dirty = o._gc = o._initted = o._paused = !1,
			o._totalTime = o._time = 0,
			o._rawPrevTime = -1,
			o._next = o._last = o._onUpdate = o._timeline = o.timeline = null,
			o._paused = !1,
			o.play = function (e, t) {
				return arguments.length && this.seek(e, t),
				this.reversed(!1),
				this.paused(!1)
			},
			o.pause = function (e, t) {
				return arguments.length && this.seek(e, t),
				this.paused(!0)
			},
			o.resume = function (e, t) {
				return arguments.length && this.seek(e, t),
				this.paused(!1)
			},
			o.seek = function (e, t) {
				return this.totalTime(Number(e), 0 != t)
			},
			o.restart = function (e, t) {
				return this.reversed(!1),
				this.paused(!1),
				this.totalTime(e ? -this._delay : 0, 0 != t)
			},
			o.reverse = function (e, t) {
				return arguments.length && this.seek(e || this.totalDuration(), t),
				this.reversed(!0),
				this.paused(!1)
			},
			o.render = function () {},
			o.invalidate = function () {
				return this
			},
			o._enabled = function (e, t) {
				return this._gc = !e,
				this._active = e && !this._paused && 0 < this._totalTime && this._totalTime < this._totalDuration,
				1 != t && (e && null == this.timeline ? this._timeline.insert(this, this._startTime - this._delay) : !e && null != this.timeline && this._timeline._remove(this, !0)),
				!1
			},
			o._kill = function () {
				return this._enabled(!1, !1)
			},
			o.kill = function (e, t) {
				return this._kill(e, t),
				this
			},
			o._uncache = function (e) {
				for (e = e ? this : this.timeline; e; )
					e._dirty = !0, e = e.timeline;
				return this
			},
			o.eventCallback = function (e, t, n, r) {
				if (null == e)
					return null;
				if ("on" === e.substr(0, 2)) {
					if (1 === arguments.length)
						return this.vars[e];
					if (null == t)
						delete this.vars[e];
					else if (this.vars[e] = t, this.vars[e + "Params"] = n, this.vars[e + "Scope"] = r, n)
						for (var i = n.length; -1 < --i; )
							"{self}" === n[i] && (n = this.vars[e + "Params"] = n.concat(), n[i] = this);
					"onUpdate" === e && (this._onUpdate = t)
				}
				return this
			},
			o.delay = function (e) {
				return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + e - this._delay), this._delay = e, this) : this._delay
			},
			o.duration = function (e) {
				return arguments.length ? (this._duration = this._totalDuration = e, this._uncache(!0), this._timeline.smoothChildTiming && this._active && 0 != e && this.totalTime(this._totalTime * (e / this._duration), !0), this) : (this._dirty = !1, this._duration)
			},
			o.totalDuration = function (e) {
				return this._dirty = !1,
				arguments.length ? this.duration(e) : this._totalDuration
			},
			o.time = function (e, t) {
				return arguments.length ? (this._dirty && this.totalDuration(), e > this._duration && (e = this._duration), this.totalTime(e, t)) : this._time
			},
			o.totalTime = function (e, t) {
				if (!arguments.length)
					return this._totalTime;
				if (this._timeline) {
					0 > e && (e += this.totalDuration());
					if (this._timeline.smoothChildTiming && (this._dirty && this.totalDuration(), e > this._totalDuration && (e = this._totalDuration), this._startTime = (this._paused ? this._pauseTime : this._timeline._time) - (this._reversed ? this._totalDuration - e : e) / this._timeScale, this._timeline._dirty || this._uncache(!1), !this._timeline._active))
						for (var n = this._timeline; n._timeline; )
							n.totalTime(n._totalTime, !0), n = n._timeline;
					this._gc && this._enabled(!0, !1),
					this._totalTime != e && this.render(e, t, !1)
				}
				return this
			},
			o.startTime = function (e) {
				return arguments.length ? (e != this._startTime && (this._startTime = e, this.timeline && this.timeline._sortChildren && this.timeline.insert(this, e - this._delay)), this) : this._startTime
			},
			o.timeScale = function (e) {
				if (!arguments.length)
					return this._timeScale;
				e = e || 1e-6;
				if (this._timeline && this._timeline.smoothChildTiming) {
					var t = this._pauseTime || 0 == this._pauseTime ? this._pauseTime : this._timeline._totalTime;
					this._startTime = t - (t - this._startTime) * this._timeScale / e
				}
				return this._timeScale = e,
				this._uncache(!1)
			},
			o.reversed = function (e) {
				return arguments.length ? (e != this._reversed && (this._reversed = e, this.totalTime(this._totalTime, !0)), this) : this._reversed
			},
			o.paused = function (e) {
				return arguments.length ? (e != this._paused && this._timeline && (!e && this._timeline.smoothChildTiming && (this._startTime += this._timeline.rawTime() - this._pauseTime, this._uncache(!1)), this._pauseTime = e ? this._timeline.rawTime() : null, this._paused = e, this._active = !this._paused && 0 < this._totalTime && this._totalTime < this._totalDuration), this._gc && (e || this._enabled(!0, !1)), this) : this._paused
			},
			r = c("core.SimpleTimeline", function (e) {
					y.call(this, 0, e),
					this.autoRemoveChildren = this.smoothChildTiming = !0
				}),
			o = r.prototype = new y,
			o.constructor = r,
			o.kill()._gc = !1,
			o._first = o._last = null,
			o._sortChildren = !1,
			o.insert = function (e, t) {
				e._startTime = Number(t || 0) + e._delay,
				e._paused && this !== e._timeline && (e._pauseTime = e._startTime + (this.rawTime() - e._startTime) / e._timeScale),
				e.timeline && e.timeline._remove(e, !0),
				e.timeline = e._timeline = this,
				e._gc && e._enabled(!0, !0);
				var n = this._last;
				if (this._sortChildren)
					for (var r = e._startTime; n && n._startTime > r; )
						n = n._prev;
				return n ? (e._next = n._next, n._next = e) : (e._next = this._first, this._first = e),
				e._next ? e._next._prev = e : this._last = e,
				e._prev = n,
				this._timeline && this._uncache(!0),
				this
			},
			o._remove = function (e, t) {
				return e.timeline === this && (t || e._enabled(!1, !0), e.timeline = null, e._prev ? e._prev._next = e._next : this._first === e && (this._first = e._next), e._next ? e._next._prev = e._prev : this._last === e && (this._last = e._prev), this._timeline && this._uncache(!0)),
				this
			},
			o.render = function (e, t) {
				var n = this._first,
				r;
				for (this._totalTime = this._time = this._rawPrevTime = e; n; ) {
					r = n._next;
					if (n._active || e >= n._startTime && !n._paused)
						n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, !1) : n.render((e - n._startTime) * n._timeScale, t, !1);
					n = r
				}
			},
			o.rawTime = function () {
				return this._totalTime
			};
			var w = c("TweenLite", function (e, t, n) {
					y.call(this, t, n);
					if (null == e)
						throw "Cannot tween an undefined reference.";
					this.target = e,
					this._overwrite = null == this.vars.overwrite ? N[w.defaultOverwrite] : "number" == typeof this.vars.overwrite ? this.vars.overwrite >> 0 : N[this.vars.overwrite];
					if ((e instanceof Array || e.jquery) && "object" == typeof e[0]) {
						this._targets = e.slice(0),
						this._propLookup = [],
						this._siblings = [];
						for (e = 0; e < this._targets.length; e++)
							n = this._targets[e], n.jquery ? (this._targets.splice(e--, 1), this._targets = this._targets.concat(n.constructor.makeArray(n))) : (this._siblings[e] = L(n, this, !1), 1 === this._overwrite && 1 < this._siblings[e].length && A(n, this, null, 1, this._siblings[e]))
					} else
						this._propLookup = {},
					this._siblings = L(e, this, !1),
					1 === this._overwrite && 1 < this._siblings.length && A(e, this, null, 1, this._siblings);
					(this.vars.immediateRender || 0 === t && 0 === this._delay && 0 != this.vars.immediateRender) && this.render(-this._delay, !1, !0)
				}, !0);
			o = w.prototype = new y,
			o.constructor = w,
			o.kill()._gc = !1,
			o.ratio = 0,
			o._firstPT = o._targets = o._overwrittenProps = null,
			o._notifyPluginsOfEnabled = !1,
			w.version = 12,
			w.defaultEase = o._ease = new d(null, null, 1, 1),
			w.defaultOverwrite = "auto",
			w.ticker = b;
			var E = w._plugins = {},
			S = {},
			x = 0,
			T = {
				ease : 1,
				delay : 1,
				overwrite : 1,
				onComplete : 1,
				onCompleteParams : 1,
				onCompleteScope : 1,
				useFrames : 1,
				runBackwards : 1,
				startAt : 1,
				onUpdate : 1,
				onUpdateParams : 1,
				onUpdateScope : 1,
				onStart : 1,
				onStartParams : 1,
				onStartScope : 1,
				onReverseComplete : 1,
				onReverseCompleteParams : 1,
				onReverseCompleteScope : 1,
				onRepeat : 1,
				onRepeatParams : 1,
				onRepeatScope : 1,
				easeParams : 1,
				yoyo : 1,
				orientToBezier : 1,
				immediateRender : 1,
				repeat : 1,
				repeatDelay : 1,
				data : 1,
				paused : 1,
				reversed : 1
			},
			N = {
				none : 0,
				all : 1,
				auto : 2,
				concurrent : 3,
				allOnStart : 4,
				preexisting : 5,
				"true" : 1,
				"false" : 0
			},
			C = y._rootFramesTimeline = new r,
			k = y._rootTimeline = new r;
			k._startTime = b.time,
			C._startTime = b.frame,
			k._active = C._active = !0,
			y._updateRoot = function () {
				k.render((b.time - k._startTime) * k._timeScale, !1, !1),
				C.render((b.frame - C._startTime) * C._timeScale, !1, !1);
				if (!(b.frame % 120)) {
					var e,
					t,
					n;
					for (n in S) {
						t = S[n].tweens;
						for (e = t.length; -1 < --e; )
							t[e]._gc && t.splice(e, 1);
						0 === t.length && delete S[n]
					}
				}
			},
			b.addEventListener("tick", y._updateRoot);
			var L = function (e, t, n) {
				var r = e._gsTweenID,
				i;
				S[r || (e._gsTweenID = r = "t" + x++)] || (S[r] = {
						target : e,
						tweens : []
					});
				if (t && (e = S[r].tweens, e[i = e.length] = t, n))
					for (; -1 < --i; )
						e[i] === t && e.splice(i, 1);
				return S[r].tweens
			},
			A = function (e, t, n, r, i) {
				var s,
				o,
				u;
				if (1 === r || 4 <= r) {
					e = i.length;
					for (s = 0; s < e; s++)
						if ((u = i[s]) !== t)
							u._gc || u._enabled(!1, !1) && (o = !0);
						else if (5 === r)
							break;
					return o
				}
				var a = t._startTime + 1e-10,
				f = [],
				l = 0,
				c;
				for (s = i.length; -1 < --s; )
					(u = i[s]) !== t && !u._gc && !u._paused && (u._timeline !== t._timeline ? (c = c || O(t, 0), 0 === O(u, c) && (f[l++] = u)) : u._startTime <= a && u._startTime + u.totalDuration() / u._timeScale + 1e-10 > a && ((0 === t._duration || !u._initted) && 2e-10 >= a - u._startTime || (f[l++] = u)));
				for (s = l; -1 < --s; )
					(u = f[s], 2 === r && u._kill(n, e) && (o = !0), 2 !== r || !u._firstPT && u._initted) && u._enabled(!1, !1) && (o = !0);
				return o
			},
			O = function (e, t) {
				for (var n = e._timeline, r = n._timeScale, i = e._startTime; n._timeline; ) {
					i += n._startTime,
					r *= n._timeScale;
					if (n._paused)
						return -100;
					n = n._timeline
				}
				return i /= r,
				i > t ? i - t : !e._initted && 2e-10 > i - t ? 1e-10 : (i += e.totalDuration() / e._timeScale / r) > t ? 0 : i - t - 1e-10
			};
			o._init = function () {
				this.vars.startAt && (this.vars.startAt.overwrite = 0, this.vars.startAt.immediateRender = !0, w.to(this.target, 0, this.vars.startAt));
				var e,
				t;
				this._ease = this.vars.ease instanceof d ? this.vars.easeParams instanceof Array ? this.vars.ease.config.apply(this.vars.ease, this.vars.easeParams) : this.vars.ease : "function" == typeof this.vars.ease ? new d(this.vars.ease, this.vars.easeParams) : w.defaultEase,
				this._easeType = this._ease._type,
				this._easePower = this._ease._power,
				this._firstPT = null;
				if (this._targets)
					for (e = this._targets.length; -1 < --e; )
						this._initProps(this._targets[e], this._propLookup[e] = {}, this._siblings[e], this._overwrittenProps ? this._overwrittenProps[e] : null) && (t = !0);
				else
					t = this._initProps(this.target, this._propLookup, this._siblings, this._overwrittenProps);
				t && w._onPluginEvent("_onInitAllProps", this),
				this._overwrittenProps && null == this._firstPT && "function" != typeof this.target && this._enabled(!1, !1);
				if (this.vars.runBackwards)
					for (e = this._firstPT; e; )
						e.s += e.c, e.c = -e.c, e = e._next;
				this._onUpdate = this.vars.onUpdate,
				this._initted = !0
			},
			o._initProps = function (e, t, n, r) {
				var i,
				s,
				o,
				u,
				a,
				f;
				if (null == e)
					return !1;
				for (i in this.vars) {
					if (T[i]) {
						if ("onStartParams" === i || "onUpdateParams" === i || "onCompleteParams" === i || "onReverseCompleteParams" === i || "onRepeatParams" === i)
							if (a = this.vars[i])
								for (s = a.length; -1 < --s; )
									"{self}" === a[s] && (a = this.vars[i] = a.concat(), a[s] = this)
					} else if (E[i] && (u = new E[i])._onInitTween(e, this.vars[i], this)) {
						this._firstPT = f = {
							_next : this._firstPT,
							t : u,
							p : "setRatio",
							s : 0,
							c : 1,
							f : !0,
							n : i,
							pg : !0,
							pr : u._priority
						};
						for (s = u._overwriteProps.length; -1 < --s; )
							t[u._overwriteProps[s]] = this._firstPT;
						if (u._priority || u._onInitAllProps)
							o = !0;
						if (u._onDisable || u._onEnable)
							this._notifyPluginsOfEnabled = !0
					} else
						this._firstPT = t[i] = f = {
							_next : this._firstPT,
							t : e,
							p : i,
							f : "function" == typeof e[i],
							n : i,
							pg : !1,
							pr : 0
						},
					f.s = f.f ? e[i.indexOf("set") || "function" != typeof e["get" + i.substr(3)] ? i : "get" + i.substr(3)]() : parseFloat(e[i]),
					f.c = "number" == typeof this.vars[i] ? this.vars[i] - f.s : "string" == typeof this.vars[i] ? parseFloat(this.vars[i].split("=").join("")) : 0;
					f && f._next && (f._next._prev = f)
				}
				return r && this._kill(r, e) ? this._initProps(e, t, n, r) : 1 < this._overwrite && this._firstPT && 1 < n.length && A(e, this, t, this._overwrite, n) ? (this._kill(t, e), this._initProps(e, t, n, r)) : o
			},
			o.render = function (e, t, n) {
				var r = this._time,
				i,
				s;
				if (e >= this._duration) {
					if (this._totalTime = this._time = this._duration, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (i = !0, s = "onComplete"), 0 === this._duration)
						(0 === e || 0 > this._rawPrevTime) && this._rawPrevTime !== e && (n = !0), this._rawPrevTime = e
				} else if (0 >= e) {
					this._totalTime = this._time = 0,
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
					if (0 !== r || 0 === this._duration && 0 < this._rawPrevTime)
						s = "onReverseComplete", i = this._reversed;
					0 > e ? (this._active = !1, 0 === this._duration && (0 <= this._rawPrevTime && (n = !0), this._rawPrevTime = e)) : this._initted || (n = !0)
				} else if (this._totalTime = this._time = e, this._easeType) {
					var o = e / this._duration,
					u = this._easeType,
					a = this._easePower;
					if (1 === u || 3 === u && .5 <= o)
						o = 1 - o;
					3 === u && (o *= 2),
					1 === a ? o *= o : 2 === a ? o *= o * o : 3 === a ? o *= o * o * o : 4 === a && (o *= o * o * o * o),
					this.ratio = 1 === u ? 1 - o : 2 === u ? o : .5 > e / this._duration ? o / 2 : 1 - o / 2
				} else
					this.ratio = this._ease.getRatio(e / this._duration);
				if (this._time !== r || n) {
					this._initted || (this._init(), !i && this._time && (this.ratio = this._ease.getRatio(this._time / this._duration))),
					!this._active && !this._paused && (this._active = !0),
					0 === r && this.vars.onStart && (0 !== this._time || 0 === this._duration) && (t || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || p));
					for (e = this._firstPT; e; )
						e.f ? e.t[e.p](e.c * this.ratio + e.s) : e.t[e.p] = e.c * this.ratio + e.s, e = e._next;
					this._onUpdate && (t || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || p)),
					s && !this._gc && (i && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), t || this.vars[s] && this.vars[s].apply(this.vars[s + "Scope"] || this, this.vars[s + "Params"] || p))
				}
			},
			o._kill = function (e, t) {
				"all" === e && (e = null);
				if (null != e || null != t && t != this.target) {
					var t = t || this._targets || this.target,
					n,
					r,
					i,
					s,
					o,
					u,
					a;
					if ((t instanceof Array || t.jquery) && "object" == typeof t[0])
						for (n = t.length; -1 < --n; )
							this._kill(e, t[n]) && (o = !0);
					else {
						if (this._targets) {
							for (n = this._targets.length; -1 < --n; )
								if (t === this._targets[n]) {
									s = this._propLookup[n] || {},
									this._overwrittenProps = this._overwrittenProps || [],
									r = this._overwrittenProps[n] = e ? this._overwrittenProps[n] || {}

									 : "all";
									break
								}
						} else {
							if (t !== this.target)
								return !1;
							s = this._propLookup,
							r = this._overwrittenProps = e ? this._overwrittenProps || {}

							 : "all"
						}
						if (s)
							for (i in u = e || s, a = e != r && "all" != r && e != s && (null == e || 1 != e._tempKill), u) {
								if (n = s[i]) {
									n.pg && n.t._kill(u) && (o = !0);
									if (!n.pg || 0 === n.t._overwriteProps.length)
										n._prev ? n._prev._next = n._next : n === this._firstPT && (this._firstPT = n._next), n._next && (n._next._prev = n._prev), n._next = n._prev = null;
									delete s[i]
								}
								a && (r[i] = 1)
							}
					}
					return o
				}
				return this._enabled(!1, !1)
			},
			o.invalidate = function () {
				return this._notifyPluginsOfEnabled && w._onPluginEvent("_onDisable", this),
				this._onUpdate = this._overwrittenProps = this._firstPT = null,
				this._initted = this._active = this._notifyPluginsOfEnabled = !1,
				this._propLookup = this._targets ? {}

				 : [],
				this
			},
			o._enabled = function (e, t) {
				if (e && this._gc)
					if (this._targets)
						for (var n = this._targets.length; -1 < --n; )
							this._siblings[n] = L(this._targets[n], this, !0);
					else
						this._siblings = L(this.target, this, !0);
				return y.prototype._enabled.call(this, e, t),
				this._notifyPluginsOfEnabled && this._firstPT ? w._onPluginEvent(e ? "_onEnable" : "_onDisable", this) : !1
			},
			w.to = function (e, t, n) {
				return new w(e, t, n)
			},
			w.from = function (e, t, n) {
				return n.runBackwards = !0,
				0 != n.immediateRender && (n.immediateRender = !0),
				new w(e, t, n)
			},
			w.fromTo = function (e, t, n, r) {
				return r.startAt = n,
				n.immediateRender && (r.immediateRender = !0),
				new w(e, t, r)
			},
			w.delayedCall = function (e, t, n, r, i) {
				return new w(t, 0, {
					delay : e,
					onComplete : t,
					onCompleteParams : n,
					onCompleteScope : r,
					onReverseComplete : t,
					onReverseCompleteParams : n,
					onReverseCompleteScope : r,
					immediateRender : !1,
					useFrames : i,
					overwrite : 0
				})
			},
			w.set = function (e, t) {
				return new w(e, 0, t)
			},
			w.killTweensOf = w.killDelayedCallsTo = function (e, t) {
				for (var n = w.getTweensOf(e), r = n.length; -1 < --r; )
					n[r]._kill(t, e)
			},
			w.getTweensOf = function (e) {
				if (null != e) {
					var t,
					n,
					r;
					if ((e instanceof Array || e.jquery) && "object" == typeof e[0]) {
						t = e.length;
						for (n = []; -1 < --t; )
							n = n.concat(w.getTweensOf(e[t]));
						for (t = n.length; -1 < --t; ) {
							r = n[t];
							for (e = t; -1 < --e; )
								r === n[e] && n.splice(t, 1)
						}
					} else {
						n = L(e).concat();
						for (t = n.length; -1 < --t; )
							n[t]._gc && n.splice(t, 1)
					}
					return n
				}
			};
			var M = c("plugins.TweenPlugin", function (e, t) {
					this._overwriteProps = (e || "").split(","),
					this._propName = this._overwriteProps[0],
					this._priority = t || 0
				}, !0);
			o = M.prototype,
			M.version = 12,
			M.API = 2,
			o._firstPT = null,
			o._addTween = function (e, t, n, r, i, s) {
				var o;
				null != r && (o = "number" == typeof r || "=" !== r.charAt(1) ? Number(r) - n : Number(r.split("=").join(""))) && (this._firstPT = {
						_next : this._firstPT,
						t : e,
						p : t,
						s : n,
						c : o,
						f : "function" == typeof e[t],
						n : i || t,
						r : s
					}, this._firstPT._next && (this._firstPT._next._prev = this._firstPT))
			},
			o.setRatio = function (e) {
				for (var t = this._firstPT, n; t; )
					n = t.c * e + t.s, t.r && (n = n + (0 < n ? .5 : -0.5) >> 0), t.f ? t.t[t.p](n) : t.t[t.p] = n, t = t._next
			},
			o._kill = function (e) {
				if (null != e[this._propName])
					this._overwriteProps = [];
				else
					for (var t = this._overwriteProps.length; -1 < --t; )
						null != e[this._overwriteProps[t]] && this._overwriteProps.splice(t, 1);
				for (t = this._firstPT; t; )
					null != e[t.n] && ((t._next && (t._next._prev = t._prev), t._prev) ? (t._prev._next = t._next, t._prev = null) : this._firstPT === t && (this._firstPT = t._next)), t = t._next;
				return !1
			},
			o._roundProps = function (e, t) {
				for (var n = this._firstPT; n; ) {
					if (e[this._propName] || null != n.n && e[n.n.split(this._propName + "_").join("")])
						n.r = t;
					n = n._next
				}
			},
			w._onPluginEvent = function (e, t) {
				var n = t._firstPT,
				r;
				if ("_onInitAllProps" === e) {
					for (var i, s, o, u; n; ) {
						u = n._next;
						for (i = s; i && i.pr > n.pr; )
							i = i._next;
						(n._prev = i ? i._prev : o) ? n._prev._next = n : s = n,
						(n._next = i) ? i._prev = n : o = n,
						n = u
					}
					n = t._firstPT = s
				}
				for (; n; )
					n.pg && "function" == typeof n.t[e] && n.t[e]() && (r = !0), n = n._next;
				return r
			},
			M.activate = function (e) {
				for (var t = e.length; -1 < --t; )
					e[t].API === M.API && (w._plugins[(new e[t])._propName] = e[t]);
				return !0
			};
			if (i = e._gsQueue) {
				for (s = 0; s < i.length; s++)
					i[s]();
				for (o in f)
					f[o].def || console.log("Warning: TweenLite encountered missing dependency: com.greensock." + o)
			}
		}
		(window)
	}),
	e.define("/source/include/greensock/TimelineMax.min.js", function (e, t, n, r, i, s) {
		(window._gsQueue || (window._gsQueue = [])).push(function () {
			_gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function (e, t, n) {
				var r = function (t) {
					e.call(this, t),
					this._repeat = this.vars.repeat || 0,
					this._repeatDelay = this.vars.repeatDelay || 0,
					this._cycle = 0,
					this._yoyo = 1 == this.vars.yoyo,
					this._dirty = !0
				},
				i = [],
				s = new n(null, null, 1, 0),
				n = r.prototype = new e;
				return n.constructor = r,
				n.kill()._gc = !1,
				r.version = 12,
				n.invalidate = function () {
					return this._yoyo = 1 == this.vars.yoyo,
					this._repeat = this.vars.repeat || 0,
					this._repeatDelay = this.vars.repeatDelay || 0,
					this._uncache(!0),
					e.prototype.invalidate.call(this)
				},
				n.addCallback = function (e, n, r, i) {
					return this.insert(t.delayedCall(0, e, r, i), n)
				},
				n.removeCallback = function (e, t) {
					if (null == t)
						this._kill(null, e);
					else
						for (var n = this.getTweensOf(e, !1), r = n.length, i = this._parseTimeOrLabel(t, !1); -1 < --r; )
							n[r]._startTime === i && n[r]._enabled(!1, !1);
					return this
				},
				n.tweenTo = function (e, n) {
					var n = n || {},
					r = {
						ease : s,
						overwrite : 2,
						useFrames : this.usesFrames(),
						immediateRender : !1
					},
					o,
					u;
					for (o in n)
						r[o] = n[o];
					return r.time = this._parseTimeOrLabel(e, !1),
					u = new t(this, Math.abs(Number(r.time) - this._time) / this._timeScale || .001, r),
					r.onStart = function () {
						u.target.paused(!0),
						u.vars.time != u.target.time() && u.duration(Math.abs(u.vars.time - u.target.time()) / u.target._timeScale),
						n.onStart && n.onStart.apply(n.onStartScope || u, n.onStartParams || i)
					},
					u
				},
				n.tweenFromTo = function (e, t, n) {
					return n = n || {},
					n.startAt = {
						time : this._parseTimeOrLabel(e, !1)
					},
					e = this.tweenTo(t, n),
					e.duration(Math.abs(e.vars.time - e.vars.startAt.time) / this._timeScale || .001)
				},
				n.render = function (e, t, n) {
					this._gc && this._enabled(!0, !1),
					this._active = !this._paused;
					var r = this._dirty ? this.totalDuration() : this._totalDuration,
					s = this._time,
					o = this._totalTime,
					u = this._startTime,
					a = this._timeScale,
					f = this._rawPrevTime,
					l = this._paused,
					c = this._cycle,
					h,
					p;
					if (e >= r)
						this._locked || (this._totalTime = r, this._cycle = this._repeat), !this._reversed && !this._hasPausedChild() && (h = !0, p = "onComplete", 0 === this._duration && (0 === e || 0 > this._rawPrevTime)) && this._rawPrevTime !== e && (n = !0), this._rawPrevTime = e, this._yoyo && 0 !== (this._cycle & 1) ? (this._time = 0, e = -0.000001) : (this._time = this._duration, e = this._duration + 1e-6);
					else if (0 >= e) {
						this._locked || (this._totalTime = this._cycle = 0),
						this._time = 0;
						if (0 !== s || 0 === this._duration && 0 < this._rawPrevTime)
							p = "onReverseComplete", h = this._reversed;
						0 > e ? (this._active = !1, 0 === this._duration && 0 <= this._rawPrevTime && (n = !0)) : this._initted || (n = !0),
						this._rawPrevTime = e,
						e = -0.000001
					} else if (this._time = this._rawPrevTime = e, !this._locked && (this._totalTime = e, 0 !== this._repeat))
						(e = this._duration + this._repeatDelay, this._cycle = this._totalTime / e >> 0, 0 !== this._cycle && this._cycle === this._totalTime / e && this._cycle--, this._time = this._totalTime - this._cycle * e, this._yoyo && 0 != (this._cycle & 1) && (this._time = this._duration - this._time), this._time > this._duration) ? (this._time = this._duration, e = this._duration + 1e-6) : 0 > this._time ? (this._time = 0, e = -0.000001) : e = this._time;
					if (this._cycle !== c && !this._locked) {
						var d = this._yoyo && 0 !== (c & 1),
						v = d === (this._yoyo && 0 !== (this._cycle & 1)),
						m = this._totalTime,
						g = this._cycle,
						y = this._rawPrevTime,
						b = this._time;
						this._totalTime = c * this._duration,
						this._cycle < c ? d = !d : this._totalTime += this._duration,
						this._time = s,
						this._rawPrevTime = f,
						this._cycle = c,
						this._locked = !0,
						s = d ? 0 : this._duration,
						this.render(s, t, !1),
						t || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || i),
						v && (s = d ? this._duration + 1e-6 : -0.000001, this.render(s, !0, !1)),
						this._time = b,
						this._totalTime = m,
						this._cycle = g,
						this._rawPrevTime = y,
						this._locked = !1
					}
					if (this._time !== s || n) {
						this._initted || (this._initted = !0),
						0 === o && this.vars.onStart && 0 !== this._totalTime && (t || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || i));
						if (this._time > s)
							for (n = this._first; n; ) {
								o = n._next;
								if (this._paused && !l)
									break;
								if (n._active || n._startTime <= this._time && !n._paused && !n._gc)
									n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, !1) : n.render((e - n._startTime) * n._timeScale, t, !1);
								n = o
							}
						else
							for (n = this._last; n; ) {
								o = n._prev;
								if (this._paused && !l)
									break;
								if (n._active || n._startTime <= s && !n._paused && !n._gc)
									n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, !1) : n.render((e - n._startTime) * n._timeScale, t, !1);
								n = o
							}
						this._onUpdate && (t || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || i)),
						p && !this._locked && !this._gc && (u === this._startTime || a != this._timeScale) && (0 === this._time || r >= this.totalDuration()) && (h && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), t || this.vars[p] && this.vars[p].apply(this.vars[p + "Scope"] || this, this.vars[p + "Params"] || i))
					}
				},
				n.getActive = function (e, t, n) {
					null == e && (e = !0),
					null == t && (t = !0),
					null == n && (n = !1);
					var r = [],
					e = this.getChildren(e, t, n),
					t = 0,
					n = e.length,
					i,
					s;
					for (i = 0; i < n; i++)
						if (s = e[i], !s._paused && s._timeline._time >= s._startTime && s._timeline._time < s._startTime + s._totalDuration / s._timeScale) {
							var o;
							e : {
								for (o = s._timeline; o; ) {
									if (o._paused) {
										o = !0;
										break e
									}
									o = o._timeline
								}
								o = !1
							}
							o || (r[t++] = s)
						}
					return r
				},
				n.getLabelAfter = function (e) {
					!e && 0 !== e && (e = this._time);
					var t = this.getLabelsArray(),
					n = t.length,
					r;
					for (r = 0; r < n; r++)
						if (t[r].time > e)
							return t[r].name;
					return null
				},
				n.getLabelBefore = function (e) {
					null == e && (e = this._time);
					for (var t = this.getLabelsArray(), n = t.length; -1 < --n; )
						if (t[n].time < e)
							return t[n].name;
					return null
				},
				n.getLabelsArray = function () {
					var e = [],
					t = 0,
					n;
					for (n in this._labels)
						e[t++] = {
							time : this._labels[n],
							name : n
						};
					return e.sort(function (e, t) {
						return e.time - t.time
					}),
					e
				},
				n.progress = function (e) {
					return arguments.length ? this.totalTime(this.duration() * e + this._cycle * this._duration, !1) : this._time / this.duration()
				},
				n.totalProgress = function (e) {
					return arguments.length ? this.totalTime(this.totalDuration() * e, !1) : this._totalTime / this.totalDuration()
				},
				n.totalDuration = function (t) {
					return arguments.length ? -1 == this._repeat ? this : this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (e.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
				},
				n.time = function (e, t) {
					return arguments.length ? (this._dirty && this.totalDuration(), e > this._duration && (e = this._duration), this._yoyo && 0 !== (this._cycle & 1) ? e = this._duration - e + this._cycle * (this._duration + this._repeatDelay) : 0 != this._repeat && (e += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(e, t)) : this._time
				},
				n.repeat = function (e) {
					return arguments.length ? (this._repeat = e, this._uncache(!0)) : this._repeat
				},
				n.repeatDelay = function (e) {
					return arguments.length ? (this._repeatDelay = e, this._uncache(!0)) : this._repeatDelay
				},
				n.yoyo = function (e) {
					return arguments.length ? (this._yoyo = e, this) : this._yoyo
				},
				n.currentLabel = function (e) {
					return arguments.length ? this.seek(e, !0) : this.getLabelBefore(this._time + 1e-8)
				},
				r
			}, !0),
			_gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (e, t, n) {
				var r = function (e) {
					t.call(this, e),
					this._labels = {},
					this.autoRemoveChildren = 1 == this.vars.autoRemoveChildren,
					this.smoothChildTiming = 1 == this.vars.smoothChildTiming,
					this._sortChildren = !0,
					this._onUpdate = this.vars.onUpdate;
					for (var e = i.length, n, r; -1 < --e; )
						if (r = this.vars[i[e]])
							for (n = r.length; -1 < --n; )
								"{self}" === r[n] && (r = this.vars[i[e]] = r.concat(), r[n] = this);
					this.vars.tweens instanceof Array && this.insertMultiple(this.vars.tweens, 0, this.vars.align || "normal", this.vars.stagger || 0)
				},
				i = ["onStartParams", "onUpdateParams", "onCompleteParams", "onReverseCompleteParams", "onRepeatParams"],
				s = [],
				o = r.prototype = new t;
				return o.constructor = r,
				o.kill()._gc = !1,
				o.to = function (e, t, r, i, s) {
					return this.insert(new n(e, t, r), this._parseTimeOrLabel(s) + (i || 0))
				},
				o.from = function (e, t, r, i, s) {
					return this.insert(n.from(e, t, r), this._parseTimeOrLabel(s) + (i || 0))
				},
				o.fromTo = function (e, t, r, i, s, o) {
					return this.insert(n.fromTo(e, t, r, i), this._parseTimeOrLabel(o) + (s || 0))
				},
				o.staggerTo = function (e, t, i, s, o, u, a, l, c) {
					a = new r({
							onComplete : a,
							onCompleteParams : l,
							onCompleteScope : c
						}),
					s = s || 0;
					for (l = 0; l < e.length; l++)
						a.insert(new n(e[l], t, i), l * s);
					return this.insert(a, this._parseTimeOrLabel(u) + (o || 0))
				},
				o.staggerFrom = function (e, t, n, r, i, s, o, u, a) {
					return null == n.immediateRender && (n.immediateRender = !0),
					n.runBackwards = !0,
					this.staggerTo(e, t, n, r, i, s, o, u, a)
				},
				o.staggerFromTo = function (e, t, n, r, i, s, o, u, a, f) {
					return r.startAt = n,
					n.immediateRender && (r.immediateRender = !0),
					this.staggerTo(e, t, r, i, s, o, u, a, f)
				},
				o.call = function (e, t, r, i, s) {
					return this.insert(n.delayedCall(0, e, t, r), this._parseTimeOrLabel(s) + (i || 0))
				},
				o.set = function (e, t, r, i) {
					return t.immediateRender = !1,
					this.insert(new n(e, 0, t), this._parseTimeOrLabel(i) + (r || 0))
				},
				r.exportRoot = function (e, t) {
					e = e || {},
					null == e.smoothChildTiming && (e.smoothChildTiming = !0);
					var i = new r(e),
					s = i._timeline;
					null == t && (t = !0),
					s._remove(i, !0),
					i._startTime = 0,
					i._rawPrevTime = i._time = i._totalTime = s._time;
					for (var o = s._first, u; o; )
						u = o._next, (!t || !(o instanceof n && o.target == o.vars.onComplete)) && i.insert(o, o._startTime - o._delay), o = u;
					return s.insert(i, 0),
					i
				},
				o.insert = function (r, i) {
					if (!(r instanceof e)) {
						if (r instanceof Array)
							return this.insertMultiple(r, i);
						if ("string" == typeof r)
							return this.addLabel(r, this._parseTimeOrLabel(i || 0, !0));
						if ("function" != typeof r)
							throw "ERROR: Cannot insert() " + r + " into the TimelineLite/Max because it is neither a tween, timeline, function, nor a String.";
						r = n.delayedCall(0, r)
					}
					t.prototype.insert.call(this, r, this._parseTimeOrLabel(i || 0, !0));
					if (this._gc && !this._paused && this._time === this._duration && this._time < this.duration())
						for (var s = this; s._gc && s._timeline; )
							s._timeline.smoothChildTiming ? s.totalTime(s._totalTime, !0) : s._enabled(!0, !1), s = s._timeline;
					return this
				},
				o.remove = function (t) {
					if (t instanceof e)
						return this._remove(t, !1);
					if (t instanceof Array) {
						for (var n = t.length; -1 < --n; )
							this.remove(t[n]);
						return this
					}
					return "string" == typeof t ? this.removeLabel(t) : this.kill(null, t)
				},
				o.append = function (e, t) {
					return this.insert(e, this.duration() + (t || 0))
				},
				o.insertMultiple = function (e, t, n, i) {
					for (var n = n || "normal", i = i || 0, s, o = this._parseTimeOrLabel(t || 0, !0), u = e.length, t = 0; t < u; t++)
						(s = e[t])instanceof Array && (s = new r({
									tweens : s
								})), this.insert(s, o), "string" == typeof s || "function" == typeof s || ("sequence" === n ? o = s._startTime + s.totalDuration() / s._timeScale : "start" === n && (s._startTime -= s.delay())), o += i;
					return this._uncache(!0)
				},
				o.appendMultiple = function (e, t, n, r) {
					return this.insertMultiple(e, this.duration() + (t || 0), n, r)
				},
				o.addLabel = function (e, t) {
					return this._labels[e] = t,
					this
				},
				o.removeLabel = function (e) {
					return delete this._labels[e],
					this
				},
				o.getLabelTime = function (e) {
					return null != this._labels[e] ? this._labels[e] : -1
				},
				o._parseTimeOrLabel = function (e, t) {
					return null == e ? this.duration() : "string" == typeof e && isNaN(e) ? null == this._labels[e] ? t ? this._labels[e] = this.duration() : 0 : this._labels[e] : Number(e)
				},
				o.seek = function (e, t) {
					return this.totalTime(this._parseTimeOrLabel(e, !1), 0 != t)
				},
				o.stop = function () {
					return this.paused(!0)
				},
				o.gotoAndPlay = function (e, n) {
					return t.prototype.play.call(this, e, n)
				},
				o.gotoAndStop = function (e, t) {
					return this.pause(e, t)
				},
				o.render = function (e, t, n) {
					this._gc && this._enabled(!0, !1),
					this._active = !this._paused;
					var r = this._dirty ? this.totalDuration() : this._totalDuration,
					i = this._time,
					o = this._startTime,
					u = this._timeScale,
					a = this._paused,
					f,
					l,
					c;
					if (e >= r)
						this._totalTime = this._time = r, !this._reversed && !this._hasPausedChild() && (f = !0, c = "onComplete", 0 === this._duration && (0 === e || 0 > this._rawPrevTime)) && this._rawPrevTime !== e && (n = !0), this._rawPrevTime = e, e = r + 1e-6;
					else if (0 >= e) {
						this._totalTime = this._time = 0;
						if (0 !== i || 0 === this._duration && 0 < this._rawPrevTime)
							c = "onReverseComplete", f = this._reversed;
						0 > e ? (this._active = !1, 0 === this._duration && 0 <= this._rawPrevTime && (n = !0)) : this._initted || (n = !0),
						this._rawPrevTime = e,
						e = -0.000001
					} else
						this._totalTime = this._time = this._rawPrevTime = e;
					if (this._time !== i || n) {
						this._initted || (this._initted = !0),
						0 === i && this.vars.onStart && 0 !== this._time && (t || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || s));
						if (this._time > i)
							for (n = this._first; n; ) {
								l = n._next;
								if (this._paused && !a)
									break;
								if (n._active || n._startTime <= this._time && !n._paused && !n._gc)
									n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, !1) : n.render((e - n._startTime) * n._timeScale, t, !1);
								n = l
							}
						else
							for (n = this._last; n; ) {
								l = n._prev;
								if (this._paused && !a)
									break;
								if (n._active || n._startTime <= i && !n._paused && !n._gc)
									n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, !1) : n.render((e - n._startTime) * n._timeScale, t, !1);
								n = l
							}
						this._onUpdate && (t || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || s)),
						c && !this._gc && (o === this._startTime || u != this._timeScale) && (0 === this._time || r >= this.totalDuration()) && (f && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), t || this.vars[c] && this.vars[c].apply(this.vars[c + "Scope"] || this, this.vars[c + "Params"] || s))
					}
				},
				o._hasPausedChild = function () {
					for (var e = this._first; e; ) {
						if (e._paused || e instanceof r && e._hasPausedChild())
							return !0;
						e = e._next
					}
					return !1
				},
				o.getChildren = function (e, t, r, i) {
					for (var i = i || -9999999999, s = [], o = this._first, u = 0; o; )
						o._startTime < i || (o instanceof n ? 0 != t && (s[u++] = o) : (0 != r && (s[u++] = o), 0 != e && (s = s.concat(o.getChildren(!0, t, r)), u = s.length))), o = o._next;
					return s
				},
				o.getTweensOf = function (e, t) {
					for (var r = n.getTweensOf(e), i = r.length, s = [], o = 0; -1 < --i; )
						if (r[i].timeline === this || t && this._contains(r[i]))
							s[o++] = r[i];
					return s
				},
				o._contains = function (e) {
					for (e = e.timeline; e; ) {
						if (e === this)
							return !0;
						e = e.timeline
					}
					return !1
				},
				o.shiftChildren = function (e, t, n) {
					for (var n = n || 0, r = this._first; r; )
						r._startTime >= n && (r._startTime += e), r = r._next;
					if (t)
						for (var i in this._labels)
							this._labels[i] >= n && (this._labels[i] += e);
					return this._uncache(!0)
				},
				o._kill = function (e, t) {
					if (null == e && null == t)
						return this._enabled(!1, !1);
					for (var n = null == t ? this.getChildren(!0, !0, !1) : this.getTweensOf(t), r = n.length, i = !1; -1 < --r; )
						n[r]._kill(e, t) && (i = !0);
					return i
				},
				o.clear = function (e) {
					var t = this.getChildren(!1, !0, !0),
					n = t.length;
					for (this._time = this._totalTime = 0; -1 < --n; )
						t[n]._enabled(!1, !1);
					return 0 != e && (this._labels = {}),
					this._uncache(!0)
				},
				o.invalidate = function () {
					for (var e = this._first; e; )
						e.invalidate(), e = e._next;
					return this
				},
				o._enabled = function (e, n) {
					if (e == this._gc)
						for (var r = this._first; r; )
							r._enabled(e, !0), r = r._next;
					return t.prototype._enabled.call(this, e, n)
				},
				o.progress = function (e) {
					return arguments.length ? this.totalTime(this.duration() * e, !1) : this._time / this.duration()
				},
				o.duration = function (e) {
					return arguments.length ? (0 !== this.duration() && 0 !== e && this.timeScale(this._duration / e), this) : (this._dirty && this.totalDuration(), this._duration)
				},
				o.totalDuration = function (e) {
					if (!arguments.length) {
						if (this._dirty) {
							for (var t = 0, n = this._first, r = -999999999999, i; n; )
								i = n._next, n._startTime < r && this._sortChildren ? this.insert(n, n._startTime - n._delay) : r = n._startTime, 0 > n._startTime && (t -= n._startTime, this.shiftChildren(-n._startTime, !1, -9999999999)), n = n._startTime + (n._dirty ? n.totalDuration() : n._totalDuration) / n._timeScale, n > t && (t = n), n = i;
							this._duration = this._totalDuration = t,
							this._dirty = !1
						}
						return this._totalDuration
					}
					return 0 !== this.totalDuration() && 0 !== e && this.timeScale(this._totalDuration / e),
					this
				},
				o.usesFrames = function () {
					for (var t = this._timeline; t._timeline; )
						t = t._timeline;
					return t === e._rootFramesTimeline
				},
				o.rawTime = function () {
					return this._paused || 0 !== this._totalTime && this._totalTime !== this._totalDuration ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
				},
				r
			}, !0)
		}),
		window._gsDefine && _gsQueue.pop()()
	}),
	e.define("/source/include/greensock/easing/EasePack.min.js", function (e, t, n, r, i, s) {
		(window._gsQueue || (window._gsQueue = [])).push(function () {
			_gsDefine("easing.Back", ["easing.Ease"], function (e) {
				var t = window.com.greensock._class,
				n = function (n, r) {
					var i = t("easing." + n, function () {}, !0),
					s = i.prototype = new e;
					return s.constructor = i,
					s.getRatio = r,
					i
				},
				r = function (n, r) {
					var i = t("easing." + n, function (e) {
							this._p1 = e || 0 === e ? e : 1.70158,
							this._p2 = 1.525 * this._p1
						}, !0),
					s = i.prototype = new e;
					return s.constructor = i,
					s.getRatio = r,
					s.config = function (e) {
						return new i(e)
					},
					i
				},
				i = r("BackOut", function (e) {
						return (e -= 1) * e * ((this._p1 + 1) * e + this._p1) + 1
					}),
				s = r("BackIn", function (e) {
						return e * e * ((this._p1 + 1) * e - this._p1)
					}),
				r = r("BackInOut", function (e) {
						return 1 > (e *= 2) ? .5 * e * e * ((this._p2 + 1) * e - this._p2) : .5 * ((e -= 2) * e * ((this._p2 + 1) * e + this._p2) + 2)
					}),
				o = n("BounceOut", function (e) {
						return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
					}),
				u = n("BounceIn", function (e) {
						return (e = 1 - e) < 1 / 2.75 ? 1 - 7.5625 * e * e : e < 2 / 2.75 ? 1 - (7.5625 * (e -= 1.5 / 2.75) * e + .75) : e < 2.5 / 2.75 ? 1 - (7.5625 * (e -= 2.25 / 2.75) * e + .9375) : 1 - (7.5625 * (e -= 2.625 / 2.75) * e + .984375)
					}),
				a = n("BounceInOut", function (e) {
						var t = .5 > e,
						e = t ? 1 - 2 * e : 2 * e - 1,
						e = e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375;
						return t ? .5 * (1 - e) : .5 * e + .5
					}),
				f = n("CircOut", function (e) {
						return Math.sqrt(1 - (e -= 1) * e)
					}),
				l = n("CircIn", function (e) {
						return  - (Math.sqrt(1 - e * e) - 1)
					}),
				c = n("CircInOut", function (e) {
						return 1 > (e *= 2) ? -0.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
					}),
				h = 2 * Math.PI,
				p = function (n, r, i) {
					var s = t("easing." + n, function (e, t) {
							this._p1 = e || 1,
							this._p2 = t || i,
							this._p3 = this._p2 / h * (Math.asin(1 / this._p1) || 0)
						}, !0),
					n = s.prototype = new e;
					return n.constructor = s,
					n.getRatio = r,
					n.config = function (e, t) {
						return new s(e, t)
					},
					s
				},
				d = p("ElasticOut", function (e) {
						return this._p1 * Math.pow(2, -10 * e) * Math.sin((e - this._p3) * h / this._p2) + 1
					}, .3),
				v = p("ElasticIn", function (e) {
						return  - (this._p1 * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - this._p3) * h / this._p2))
					}, .3),
				p = p("ElasticInOut", function (e) {
						return 1 > (e *= 2) ? -0.5 * this._p1 * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - this._p3) * h / this._p2) : .5 * this._p1 * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - this._p3) * h / this._p2) + 1
					}, .45),
				m = n("ExpoOut", function (e) {
						return 1 - Math.pow(2, -10 * e)
					}),
				g = n("ExpoIn", function (e) {
						return Math.pow(2, 10 * (e - 1)) - .001
					}),
				y = n("ExpoInOut", function (e) {
						return 1 > (e *= 2) ? .5 * Math.pow(2, 10 * (e - 1)) : .5 * (2 - Math.pow(2, -10 * (e - 1)))
					}),
				b = Math.PI / 2,
				w = n("SineOut", function (e) {
						return Math.sin(e * b)
					}),
				E = n("SineIn", function (e) {
						return -Math.cos(e * b) + 1
					}),
				n = n("SineInOut", function (e) {
						return -0.5 * (Math.cos(Math.PI * e) - 1)
					}),
				S = t("easing.SlowMo", function (e, t, n) {
						null == e ? e = .7 : 1 < e && (e = 1),
						this._p = 1 != e ? t || 0 === t ? t : .7 : 0,
						this._p1 = (1 - e) / 2,
						this._p2 = e,
						this._p3 = this._p1 + this._p2,
						this._calcEnd = !0 === n
					}, !0),
				x = S.prototype = new e;
				x.constructor = S,
				x.getRatio = function (e) {
					var t = e + (.5 - e) * this._p;
					return e < this._p1 ? this._calcEnd ? 1 - (e = 1 - e / this._p1) * e : t - (e = 1 - e / this._p1) * e * e * e * t : e > this._p3 ? this._calcEnd ? 1 - (e = (e - this._p3) / this._p1) * e : t + (e - t) * (e = (e - this._p3) / this._p1) * e * e * e : this._calcEnd ? 1 : t
				},
				S.ease = new S(.7, .7),
				x.config = S.config = function (e, t, n) {
					return new S(e, t, n)
				};
				var T = t("easing.SteppedEase", function (e) {
						e = e || 1,
						this._p1 = 1 / e,
						this._p2 = e + 1
					}, !0),
				x = T.prototype = new e;
				return x.constructor = T,
				x.getRatio = function (e) {
					return 0 > e ? e = 0 : 1 <= e && (e = .999999999),
					(this._p2 * e >> 0) * this._p1
				},
				x.config = T.config = function (e) {
					return new T(e)
				},
				t("easing.Bounce", {
					easeOut : new o,
					easeIn : new u,
					easeInOut : new a
				}, !0),
				t("easing.Circ", {
					easeOut : new f,
					easeIn : new l,
					easeInOut : new c
				}, !0),
				t("easing.Elastic", {
					easeOut : new d,
					easeIn : new v,
					easeInOut : new p
				}, !0),
				t("easing.Expo", {
					easeOut : new m,
					easeIn : new g,
					easeInOut : new y
				}, !0),
				t("easing.Sine", {
					easeOut : new w,
					easeIn : new E,
					easeInOut : new n
				}, !0), {
					easeOut : new i,
					easeIn : new s,
					easeInOut : new r
				}
			}, !0)
		}),
		window._gsDefine && _gsQueue.pop()()
	}),
	e.define("/source/include/BrowserDetect.js", function (e, t, n, r, i, s) {
		BrowserDetect = {
			init : function () {
				this.browser = this.searchString(this.dataBrowser) || "An unknown browser",
				this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version",
				this.OS = this.searchString(this.dataOS) || "an unknown OS"
			},
			searchString : function (e) {
				for (var t = 0; t < e.length; t++) {
					var n = e[t].string,
					r = e[t].prop;
					this.versionSearchString = e[t].versionSearch || e[t].identity;
					if (n) {
						if (n.indexOf(e[t].subString) != -1)
							return e[t].identity
					} else if (r)
						return e[t].identity
				}
			},
			searchVersion : function (e) {
				var t = e.indexOf(this.versionSearchString);
				if (t == -1)
					return;
				return parseFloat(e.substring(t + this.versionSearchString.length + 1))
			},
			dataBrowser : [{
					string : navigator.userAgent,
					subString : "Chrome",
					identity : "Chrome"
				}, {
					string : navigator.userAgent,
					subString : "OmniWeb",
					versionSearch : "OmniWeb/",
					identity : "OmniWeb"
				}, {
					string : navigator.vendor,
					subString : "Apple",
					identity : "Safari",
					versionSearch : "Version"
				}, {
					prop : window.opera,
					identity : "Opera",
					versionSearch : "Version"
				}, {
					string : navigator.vendor,
					subString : "iCab",
					identity : "iCab"
				}, {
					string : navigator.vendor,
					subString : "KDE",
					identity : "Konqueror"
				}, {
					string : navigator.userAgent,
					subString : "Firefox",
					identity : "Firefox"
				}, {
					string : navigator.vendor,
					subString : "Camino",
					identity : "Camino"
				}, {
					string : navigator.userAgent,
					subString : "Netscape",
					identity : "Netscape"
				}, {
					string : navigator.userAgent,
					subString : "MSIE",
					identity : "Explorer",
					versionSearch : "MSIE"
				}, {
					string : navigator.userAgent,
					subString : "Gecko",
					identity : "Mozilla",
					versionSearch : "rv"
				}, {
					string : navigator.userAgent,
					subString : "Mozilla",
					identity : "Netscape",
					versionSearch : "Mozilla"
				}
			],
			dataOS : [{
					string : navigator.platform,
					subString : "Win",
					identity : "Windows"
				}, {
					string : navigator.platform,
					subString : "Mac",
					identity : "Mac"
				}, {
					string : navigator.userAgent,
					subString : "iPhone",
					identity : "iPhone/iPod"
				}, {
					string : navigator.platform,
					subString : "Linux",
					identity : "Linux"
				}
			]
		},
		t.exports = BrowserDetect
	}),
	e.define("/source/app/TechTree.coffee", function (e, t, n, r, i, s) {
		(function () {
			var n,
			r,
			i,
			s,
			o = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			};
			s = e("./view/TechTreeView"),
			r = e("./view/Preloader"),
			n = e("./model/AppModel"),
			i = function () {
				function e(e) {
					this.beginMainView = o(this.beginMainView, this),
					this.modelReady = o(this.modelReady, this),
					this.modelLoading = o(this.modelLoading, this),
					this.beginLoad = o(this.beginLoad, this),
					this.preload = o(this.preload, this),
					this.start = o(this.start, this),
					this.window = e,
					this.characterClass = "gladiator"
				}
				return e.prototype.start = function (e) {
					return e !== "" && (this.characterClass = e),
					this.preload()
				},
				e.prototype.preload = function () {
					return this.preloader = new r({
							el : $("#content #preloader"),
							model : {}

						}),
					this.preloader.on("transitionInComplete", this.beginLoad),
					this.preloader.transitionIn()
				},
				e.prototype.beginLoad = function () {
					return this.model = new n.getInstance({
							url : "data/assets.json",
							charUrl : "data/nisha.json"
						}),
					this.model.start(),
					this.model.on("ready", this.modelReady),
					this.model.on("loading", this.modelLoading)
				},
				e.prototype.modelLoading = function (e) {
					return this.preloader.load(e)
				},
				e.prototype.modelReady = function (e) {
					return this.preloader.off("transitionInComplete", this.beginLoad),
					this.preloader.on("transitionOutComplete", this.beginMainView),
					this.preloader.transitionOut()
				},
				e.prototype.beginMainView = function () {
					return this.view = new s({
							model : this.model,
							el : $("#techtree")
						}),
					this.view.start()
				},
				e
			}
			(),
			t.exports = i
		}).call(this)
	}),
	e.define("/source/app/view/TechTreeView.coffee", function (e, t, n, r, i, s) {
		(function () {
			var n,
			r,
			i,
			s,
			o,
			u,
			a = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			f = {}

			.hasOwnProperty,
			l = function (e, t) {
				function r() {
					this.constructor = e
				}
				for (var n in t)
					f.call(t, n) && (e[n] = t[n]);
				return r.prototype = t.prototype,
				e.prototype = new r,
				e.__super__ = t.prototype,
				e
			};
			n = e("../model/AppModel"),
			s = e("./Panel"),
			i = e("./HeaderPanel"),
			o = e("./ScoreBoard"),
			r = e("../model/utils/BitlyGenerator"),
			u = function (e) {
				function f() {
					return this.transitionIn = a(this.transitionIn, this),
					this.shareTwitter = a(this.shareTwitter, this),
					this.shareFacebook = a(this.shareFacebook, this),
					this.reset = a(this.reset, this),
					this.view = a(this.view, this),
					this.start = a(this.start, this),
					this.events = a(this.events, this),
					this.initialize = a(this.initialize, this),
					f.__super__.constructor.apply(this, arguments)
				}
				var t,
				n,
				u;
				return l(f, e),
				n = [],
				t = {},
				u = {},
				f.prototype.initialize = function () {
					return f.__super__.initialize.call(this)
				},
				f.prototype.events = function () {
					return {
						"click #content #reset" : "reset",
						"click #content #share #facebook" : "shareFacebook",
						"click #content #share #twitter" : "shareTwitter"
					}
				},
				f.prototype.render = function () {
					return f.__super__.render.call(this)
				},
				f.prototype.start = function () {
					return this.$el.show(),
					this.view(),
					this.model.points.setHash(shareHash),
					this.transitionIn()
				},
				f.prototype.view = function () {
					var e,
					r,
					a,
					f,
					l,
					c;
					return a = this.model,
					r = a.character.get("assets").background,
					e = a.character.get("assets").badge,
					$("#character-panel").css({
						background : "url(" + r + ") center top no-repeat"
					}),
					$("#character-badge").css({
						background : "url(" + e + ") center top no-repeat"
					}),
					c = new s({
							model : a.character.get("assets").panel[0],
							el : $("#content .skill-panel.0")
						}),
					c.id = 0,
					f = new s({
							model : a.character.get("assets").panel[1],
							el : $("#content .skill-panel.1")
						}),
					f.id = 1,
					l = new s({
							model : a.character.get("assets").panel[2],
							el : $("#content .skill-panel.2")
						}),
					l.id = 2,
					t = new i({
							model : {
								gray : a.character.get("assets").header,
								green : a.character.get("assets")["header-green"],
								icon : a.character.get("assets")["class"]
							},
							el : $("#content .header-panel")
						}),
					u = new o({
							model : this.model.points,
							el : $("#content #scoreboard")
						}),
					n.push(c, f, l)
				},
				f.prototype.reset = function () {
					var e,
					t,
					r;
					for (t = 0, r = n.length; t < r; t++)
						e = n[t], e.enableReset();
					return this.model.points.resetScores()
				},
				f.prototype.shareFacebook = function (e) {
					var t,
					n;
					return n = this.model.character.get("url"),
					t = e.currentTarget.href,
					t += "" + n + "?share=" + this.model.points.getHash(),
					e.currentTarget.href = t,
					console.log(e.currentTarget.href)
				},
				f.prototype.shareTwitter = function (e) {
					var t,
					n;
					return n = this.model.character.get("url"),
					t = r.shorten("" + n + "?share=" + this.model.points.getHash()),
					e.currentTarget.href += t
				},
				f.prototype.transitionIn = function () {
					var e,
					r,
					i,
					s;
					$("#content, #header").children().show(),
					this.$el.children().show(),
					TweenMax.from($("#header .logo"), .5, {
						css : {
							opacity : "0"
						},
						delay : .6
					});
					for (e = i = 0, s = n.length; i < s; e = ++i)
						r = n[e], n[e].transitionIn();
					return t.transitionIn(),
					u.transitionIn(),
					TweenMax.from($("#character-panel"), 1, {
						css : {
							top : "-900px"
						},
						delay : .7,
						ease : Power4.easeOut
					}),
					TweenMax.from($("#character-badge"), .7, {
						css : {
							right : "-900px"
						},
						delay : 1.3,
						ease : Expo.easeOut
					}),
					TweenMax.from($("#content #reset"), .5, {
						css : {
							top : "1100px",
							opacity : 0
						},
						delay : 1.3,
						ease : Expo.easeOut
					}),
					TweenMax.from($("#content #share"), .5, {
						css : {
							top : "1100px",
							opacity : 0
						},
						delay : 1.4,
						ease : Expo.easeOut
					})
				},
				f
			}
			(Backbone.View),
			t.exports = u
		}).call(this)
	}),
	e.define("/source/app/model/AppModel.coffee", function (e, t, n, r, i, s) {
		(function () {
			var n,
			r,
			i,
			s,
			o = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			u = {}

			.hasOwnProperty,
			a = function (e, t) {
				function r() {
					this.constructor = e
				}
				for (var n in t)
					u.call(t, n) && (e[n] = t[n]);
				return r.prototype = t.prototype,
				e.prototype = new r,
				e.__super__ = t.prototype,
				e
			};
			r = e("./CharacterModel"),
			i = e("./PointsModel"),
			s = e("./utils/PreloaderZed"),
			n = function (e) {
				function l(e) {
					this.handleComplete = o(this.handleComplete, this),
					this.handleProgress = o(this.handleProgress, this),
					this.initPreload = o(this.initPreload, this),
					this.createLoadManifest = o(this.createLoadManifest, this),
					this.onAppModelReady = o(this.onAppModelReady, this),
					this.onCharModelReady = o(this.onCharModelReady, this),
					this.start = o(this.start, this),
					this.initialize = o(this.initialize, this);
					if (!t)
						throw "AppModel is a singleton. Use AppModel.getInstance() instead.";
					t = !1,
					l.__super__.constructor.call(this, e)
				}
				var t,
				n,
				u,
				f;
				return a(l, e),
				t = !1,
				u = null,
				n = [],
				f = new s,
				l.getInstance = function (e) {
					return u === null && (t = !0, u = new l(e)),
					u
				},
				l.prototype.initialize = function (e) {
					return this.opts = e,
					this.url = e.url,
					l.__super__.initialize.call(this)
				},
				l.prototype.start = function () {
					return this.createCharModel(this.opts.charUrl),
					this.createPointsModel()
				},
				l.prototype.createPointsModel = function () {
					return this.points = new i
				},
				l.prototype.createCharModel = function (e) {
					return this.character = new r({
							url : e
						}),
					this.character.on("change:assets", this.onCharModelReady),
					this.character.fetch()
				},
				l.prototype.onCharModelReady = function (e) {
					return this.on("change:assets", this.onAppModelReady),
					this.fetch()
				},
				l.prototype.onAppModelReady = function (e) {
					return this.createLoadManifest()
				},
				l.prototype.createLoadManifest = function () {
					var e,
					t,
					r,
					i,
					s,
					o,
					u,
					a,
					f,
					l,
					c,
					h,
					p,
					d,
					v,
					m,
					g,
					y,
					b,
					w;
					t = this.get("assets"),
					r = this.character.get("assets");
					for (e in t)
						u = {
							src : t[e],
							id : e
						},
					n.push(u);
					for (e in r)
						if (typeof r[e] == "string")
							u = {
								src : r[e],
								id : e
							},
					n.push(u);
					else if (typeof r[e] == "object" && e === "panel") {
						f = r[e];
						for (d = 0, g = f.length; d < g; d++) {
							a = f[d],
							c = a.skills,
							l = a.color,
							h = a.title,
							u = {
								src : a.title,
								id : "title"
							},
							n.push(u);
							for (s = v = 0, y = c.length; v < y; s = ++v) {
								p = c[s],
								w = p.assets;
								for (s = m = 0, b = w.length; m < b; s = ++m) {
									e = w[s],
									o = s;
									switch (s) {
									case 0:
										i = "gray";
										break;
									case 1:
										i = "orange";
										break;
									case 2:
										i = "green"
									}
									u = {
										src : e,
										id : "" + l + "_" + o + "_" + i
									},
									n.push(u)
								}
							}
						}
					}
					return this.initPreload()
				},
				l.prototype.initPreload = function () {
					return f.onProgress = this.handleProgress,
					f.onComplete = this.handleComplete,
					f.loadManifest(n)
				},
				l.prototype.handleProgress = function (e) {
					return this.trigger("loading", e)
				},
				l.prototype.handleComplete = function (e) {
					return this.trigger("ready")
				},
				l.prototype.handleFileLoad = function (e) {},
				l
			}
			(Backbone.Model),
			t.exports = n
		}).call(this)
	}),
	e.define("/source/app/model/CharacterModel.coffee", function (e, t, n, r, i, s) {
		(function () {
			var e,
			n = {}

			.hasOwnProperty,
			r = function (e, t) {
				function i() {
					this.constructor = e
				}
				for (var r in t)
					n.call(t, r) && (e[r] = t[r]);
				return i.prototype = t.prototype,
				e.prototype = new i,
				e.__super__ = t.prototype,
				e
			};
			e = function (e) {
				function t() {
					return t.__super__.constructor.apply(this, arguments)
				}
				return r(t, e),
				t.prototype.initialize = function (e) {
					return this.url = e.url,
					t.__super__.initialize.call(this)
				},
				t
			}
			(Backbone.Model),
			t.exports = e
		}).call(this)
	}),
	e.define("/source/app/model/PointsModel.coffee", function (e, t, n, r, i, s) {
		(function () {
			var e,
			n = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			r = {}

			.hasOwnProperty,
			i = function (e, t) {
				function i() {
					this.constructor = e
				}
				for (var n in t)
					r.call(t, n) && (e[n] = t[n]);
				return i.prototype = t.prototype,
				e.prototype = new i,
				e.__super__ = t.prototype,
				e
			};
			e = function (e) {
				function t() {
					return this.setHash = n(this.setHash, this),
					this.getHash = n(this.getHash, this),
					this.resetScores = n(this.resetScores, this),
					t.__super__.constructor.apply(this, arguments)
				}
				return i(t, e),
				t.prototype.initialize = function () {
					return t.__super__.initialize.call(this),
					this.resetScores()
				},
				t.prototype.resetScores = function () {
					var e,
					t;
					this.set("maxPoints", 48),
					this.set("red", 0),
					this.set("blue", 0),
					this.set("green", 0);
					for (e = t = 0; t <= 11; e = ++t)
						this.set("red_" + e, 0), this.set("blue_" + e, 0), this.set("green_" + e, 0);
					return this.set("totalPoints", 0),
					this.trigger("reset")
				},
				t.prototype.getHash = function () {
					var e;
					return e = Base64.encode(JSON.stringify(this.toJSON())),
					e
				},
				t.prototype.setHash = function (e) {
					var t,
					n,
					r;
					e = decodeURIComponent(e);
					try {
						t = JSON.parse(Base64.decode(e)),
						r = [];
						for (n in t)
							r.push(this.set(n, t[n]));
						return r
					} catch (i) {
						return null
					}
				},
				t
			}
			(Backbone.Model),
			t.exports = e
		}).call(this)
	}),
	e.define("/source/app/model/utils/PreloaderZed.coffee", function (e, t, n, r, i, s) {
		(function () {
			var e,
			n = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			};
			e = function () {
				function r() {
					this.onInternalProgress = n(this.onInternalProgress, this),
					this.loadManifest = n(this.loadManifest, this)
				}
				var e,
				t;
				return r.loadedImages = [],
				t = 0,
				e = 0,
				r.onProgress,
				r.onComplete,
				r.prototype.loadManifest = function (e) {
					var n,
					r,
					i,
					s,
					o,
					u;
					t = e.length,
					u = [];
					for (n = s = 0, o = e.length; s < o; n = ++s)
						i = e[n], r = new Image, r.onload = this.onInternalProgress, r.src = i.src, u.push(i.image = r);
					return u
				},
				r.prototype.onInternalProgress = function (n) {
					e++,
					this.onProgress(e / t);
					if (e / t === 1)
						return this.onComplete(e / t)
				},
				r
			}
			(),
			t.exports = e
		}).call(this)
	}),
	e.define("/source/app/view/Panel.coffee", function (e, t, n, r, i, s) {
		(function () {
			var n,
			r,
			i,
			s = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			o = {}

			.hasOwnProperty,
			u = function (e, t) {
				function r() {
					this.constructor = e
				}
				for (var n in t)
					o.call(t, n) && (e[n] = t[n]);
				return r.prototype = t.prototype,
				e.prototype = new r,
				e.__super__ = t.prototype,
				e
			};
			r = e("./Icon"),
			n = e("../model/AppModel"),
			i = function (e) {
				function i() {
					return this.transitionIn = s(this.transitionIn, this),
					this.reset = s(this.reset, this),
					this.view = s(this.view, this),
					this.getIconByPosition = s(this.getIconByPosition, this),
					this.onPointsChange = s(this.onPointsChange, this),
					this._clearRow = s(this._clearRow, this),
					this.clearRows = s(this.clearRows, this),
					this.getRow = s(this.getRow, this),
					this.rowValue = s(this.rowValue, this),
					this.isEmpty = s(this.isEmpty, this),
					this.maxRequired = s(this.maxRequired, this),
					this.onIconClickRight = s(this.onIconClickRight, this),
					this.events = s(this.events, this),
					this.onTotalChange = s(this.onTotalChange, this),
					this.enableReset = s(this.enableReset, this),
					this.initialize = s(this.initialize, this),
					i.__super__.constructor.apply(this, arguments)
				}
				var t;
				return u(i, e),
				i.id,
				t = [],
				i.prototype.initialize = function () {
					return i.__super__.initialize.call(this),
					this.view(),
					this.points = n.getInstance().points,
					this.points.on("change:" + this.model.color, this.onPointsChange),
					this.points.on("reset", this.reset)
				},
				i.prototype.enableReset = function () {
					return this.points.on("change:totalPoints", this.onTotalChange)
				},
				i.prototype.onTotalChange = function () {
					var e,
					t,
					n;
					t = this.points.get("" + this.model.color),
					n = this.points.get("totalPoints"),
					e = this.$el.find(".color-panel");
					if (n > 0)
						return e.css({
							height : "78px"
						}), this.points.off("change:totalPoints", this.onTotalChange)
				},
				i.prototype.events = function () {
					return {
						"contextmenu .skill-icon" : "onIconClickRight"
					}
				},
				i.prototype.onIconClickRight = function (e) {
					var t,
					n,
					r,
					i,
					s;
					e.preventDefault !== void 0 ? e.preventDefault() : e.returnValue = !1,
					r = this.points.get("maxPoints"),
					s = this.points.get("totalPoints"),
					i = this.points.get("" + this.model.color),
					t = $(e.target).attr("class").split(" ")[1],
					n = this.getIconByPosition(t);
					if (n.iconPoints > 0)
						if (i > this.maxRequired() && this.rowValue(this.getRow(t)) > 5 || this.isEmpty(this.getRow(t) + 1))
							return n.removePoint(), this.clearRows(i)
				},
				i.prototype.maxRequired = function () {
					var e,
					t,
					n,
					r,
					i,
					s,
					o,
					u,
					a,
					f;
					i = [[], [], [], [], [], []],
					n = 5,
					f = this.rows;
					for (e = s = 0, u = f.length; s < u; e = ++s) {
						r = f[e],
						i[e] = 1;
						for (o = 0, a = r.length; o < a; o++)
							t = r[o], i[e] += t.iconPoints;
						i[e] > 1 && (n = 5 * e)
					}
					return n
				},
				i.prototype.isEmpty = function (e) {
					var t,
					n,
					r,
					i,
					s;
					n = 0;
					if (e < 6) {
						s = this.rows[e];
						for (r = 0, i = s.length; r < i; r++)
							t = s[r], n += t.iconPoints
					}
					return n > 0 ? !1 : !0
				},
				i.prototype.rowValue = function (e) {
					var t,
					n,
					r,
					i,
					s,
					o,
					u,
					a,
					f;
					i = 0,
					f = this.rows;
					for (t = s = 0, u = f.length; s < u; t = ++s) {
						r = f[t];
						if (t === e) {
							for (o = 0, a = r.length; o < a; o++)
								n = r[o], i += n.iconPoints;
							return i
						}
					}
				},
				i.prototype.getRow = function (e) {
					if (e < 3)
						return 0;
					if (e < 6)
						return 1;
					if (e < 9)
						return 2;
					if (e < 12)
						return 3;
					if (e < 15)
						return 4;
					if (e < 18)
						return 5
				},
				i.prototype.clearRows = function (e) {
					e < 6 && this._clearRow(1),
					e < 11 && this._clearRow(2),
					e < 16 && this._clearRow(3),
					e < 21 && this._clearRow(4);
					if (e < 26)
						return this._clearRow(5)
				},
				i.prototype._clearRow = function (e) {
					var t,
					n,
					r,
					i,
					s;
					i = this.rows[e],
					s = [];
					for (n = 0, r = i.length; n < r; n++)
						t = i[n], s.push(t.hidePointsOverlay());
					return s
				},
				i.prototype.onPointsChange = function () {
					var e,
					t;
					t = this.points.get("" + this.model.color),
					this.$el.find(".panel-points").html(t),
					e = this.$el.find(".color-panel");
					if (t <= 10)
						return e.css({
							height : 78 + 11.8 * t + "px"
						});
					if (10 < t && t <= 20)
						return e.css({
							height : 125 + 11.8 * t + "px"
						});
					if (20 < t && t < 26)
						return e.css({
							height : 125 + 12.6 * t + "px"
						})
				},
				i.prototype.getIconByPosition = function (e) {
					var t,
					n,
					r,
					i,
					s,
					o,
					u;
					u = this.rows;
					for (r = 0, s = u.length; r < s; r++) {
						n = u[r];
						for (i = 0, o = n.length; i < o; i++) {
							t = n[i];
							if (t.id === parseInt(e))
								return t
						}
					}
				},
				i.prototype.view = function () {
					var e,
					t,
					n,
					i,
					s,
					o,
					u,
					a,
					f,
					l,
					c,
					h,
					p;
					this.$el.find(".panel-title").css("background", "url(" + this.model.title + ") center no-repeat"),
					e = 0,
					this.rows = [[], [], [], [], [], []],
					a = this.model.skills,
					p = [];
					for (e = o = 0, u = a.length; o < u; e = ++o)
						i = a[e], s = i, s.panel = this.model.color, s.id = e, n = this.$el.find(".skill-icon." + i.position), n.css({
							"z-index" : 100 + (this.model.skills.length - e)
						}), t = new r({
								model : i,
								el : n
							}), t.id < 3 && this.rows[0].push(t), 3 <= (f = t.id) && f < 6 && this.rows[1].push(t), 6 <= (l = t.id) && l < 9 && this.rows[2].push(t), 9 <= (c = t.id) && c < 12 && this.rows[3].push(t), 12 <= (h = t.id) && h < 15 && this.rows[4].push(t), 15 <= t.id ? p.push(this.rows[5].push(t)) : p.push(void 0);
					return p
				},
				i.prototype.reset = function () {
					var e;
					return this.points.on("change:totalPoints", this.onTotalChange),
					e = this.$el.find(".color-panel"),
					e.css({
						height : "0px"
					})
				},
				i.prototype.transitionIn = function () {
					return TweenMax.from(this.$el, .4, {
						css : {
							opacity : 0,
							top : "175px"
						},
						delay : .7 + this.id * .2,
						ease : Power3.easeOut
					})
				},
				i
			}
			(Backbone.View),
			t.exports = i
		}).call(this)
	}),
	e.define("/source/app/view/Icon.coffee", function (e, t, n, r, i, s) {
		(function () {
			var n,
			r,
			i,
			s,
			o = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			u = {}

			.hasOwnProperty,
			a = function (e, t) {
				function r() {
					this.constructor = e
				}
				for (var n in t)
					u.call(t, n) && (e[n] = t[n]);
				return r.prototype = t.prototype,
				e.prototype = new r,
				e.__super__ = t.prototype,
				e
			};
			n = e("../model/AppModel"),
			s = e("./PointsOverlay"),
			i = e("./InfoPanel"),
			r = function (e) {
				function f() {
					return this.reset = o(this.reset, this),
					this.onMouseMove = o(this.onMouseMove, this),
					this.onPointsChange = o(this.onPointsChange, this),
					this.onIconRoll = o(this.onIconRoll, this),
					this.hidePointsOverlay = o(this.hidePointsOverlay, this),
					this.pointsOverlayControl = o(this.pointsOverlayControl, this),
					this.removePoint = o(this.removePoint, this),
					this.addPoint = o(this.addPoint, this),
					this.onPanelChange = o(this.onPanelChange, this),
					this.onIconClick = o(this.onIconClick, this),
					this.transitionIn = o(this.transitionIn, this),
					this.setColor = o(this.setColor, this),
					this.view = o(this.view, this),
					this.events = o(this.events, this),
					f.__super__.constructor.apply(this, arguments)
				}
				var t,
				r,
				u;
				return a(f, e),
				u = null,
				t = null,
				r = !1,
				f.prototype.initialize = function () {
					return f.__super__.initialize.call(this),
					this.id = this.model.position,
					this.points = n.getInstance().points,
					this.view(),
					this.points.on("change:" + this.model.panel + "_" + this.model.id, this.onPointsChange),
					this.points.on("reset", this.reset),
					this.iconPoints = 0
				},
				f.prototype.events = function () {
					return {
						click : "onIconClick",
						mouseover : "onIconRoll",
						mouseout : "onIconRoll",
						mousemove : "onMouseMove"
					}
				},
				f.prototype.view = function () {
					var e,
					t,
					n,
					r,
					o;
					return this.$el.attr("unselectable", "on"),
					o = $("<div/>").addClass("points-overlay").html("0/" + this.model.levels).attr("unselectable", "on").hide(),
					this.$el.append(o),
					r = new Backbone.Model,
					r.set("levels", this.model.levels),
					r.set("parentId", "" + this.model.panel + "_" + this.model.id),
					this.pointsOverlay = new s({
							el : o,
							model : r
						}),
					n = $("<div class='info-panel'/>"),
					this.$el.append(n),
					t = new Backbone.Model,
					t.set("model", this.model),
					t.set("parentId", "" + this.model.panel + "_" + this.model.id),
					this.infoPanel = new i({
							el : n,
							model : t
						}),
					BrowserDetect.browser === "Explorer" && (e = $("<div class='hitspace' />"), this.$el.append(e)),
					this.setColor("gray")
				},
				f.prototype.setColor = function (e) {
					var t;
					switch (e) {
					case "gray":
						t = this.model.assets[0];
						break;
					case "orange":
						t = this.model.assets[1];
						break;
					case "green":
						t = this.model.assets[2]
					}
					return this.$el.css("background", "url(" + t + ") center no-repeat")
				},
				f.prototype.transitionIn = function () {
					return TweenMax.from(this.$el, .4, {
						css : {
							opacity : 0
						}
					})
				},
				f.prototype.onIconClick = function (e) {
					var t,
					n,
					r,
					i;
					n = this.points.get("maxPoints"),
					i = this.points.get("totalPoints"),
					r = this.points.get("" + this.model.panel),
					t = this.$el.attr("class").split(" ")[1];
					if (i < n && i >= 1) {
						if (t < 3) {
							this.addPoint();
							return
						}
						if (t < 6 && r >= 5) {
							this.addPoint();
							return
						}
						if (t < 9 && r >= 10) {
							this.addPoint();
							return
						}
						if (t < 12 && r >= 11) {
							this.addPoint();
							return
						}
						if (t < 15 && r >= 16) {
							this.addPoint();
							return
						}
						if (t < 18 && r >= 21) {
							this.addPoint();
							return
						}
					}
					return this.trigger("click", this.model.id)
				},
				f.prototype.onPanelChange = function () {
					var e,
					t;
					return t = this.points.get("" + this.model.panel),
					e = this.$el.attr("class").split(" ")[1]
				},
				f.prototype.addPoint = function () {
					var e,
					t,
					n;
					return e = this.points.get("" + this.model.panel + "_" + this.model.id),
					t = this.points.get("" + this.model.panel),
					n = this.points.get("totalPoints"),
					e < this.model.levels && (SoundSwf.playSound(e + 1), this.points.set("" + this.model.panel, t + 1), this.points.set("totalPoints", n + 1), this.points.set("" + this.model.panel + "_" + this.model.id, e + 1)),
					this.iconPoints = this.points.get("" + this.model.panel + "_" + this.model.id)
				},
				f.prototype.removePoint = function () {
					var e,
					t,
					n;
					return console.log("removePoint"),
					e = this.points.get("" + this.model.panel + "_" + this.model.id),
					t = this.points.get("" + this.model.panel),
					n = this.points.get("totalPoints"),
					e > 0 && (SoundSwf.playSound(e), this.points.set("" + this.model.panel, t - 1), this.points.set("totalPoints", n - 1), this.points.set("" + this.model.panel + "_" + this.model.id, e - 1)),
					this.iconPoints = this.points.get("" + this.model.panel + "_" + this.model.id)
				},
				f.prototype.pointsOverlayControl = function (e, t) {
					var n;

					return n = this.$el.find(".points-overlay"),
					n.html("" + e + "/" + this.model.levels)
				},
				f.prototype.hidePointsOverlay = function () {
					return this.$el.find(".points-overlay").hide()
				},
				f.prototype.onIconRoll = function (e) {
					switch (e.type) {
					case "mouseover":
						return this.over || this.infoPanel.show(),
						this.over = !0;
					case "mouseout":
						return this.over && this.infoPanel.hide(),
						this.over = !1
					}
				},
				f.prototype.onPointsChange = function (e) {
					var t;
					t = e.get("" + this.model.panel + "_" + this.model.id),
					this.pointsOverlayControl(t),
					this.setColor("gray"),
					0 < t && t < this.model.levels && this.setColor("orange");
					if (t === this.model.levels)
						return this.setColor("green")
				},
				f.prototype.onMouseMove = function (e) {
					var t;
					if (typeof e.offsetX == "undefined" || typeof event.offsetY == "undefined")
						t = $(e.target).offset(), e.offsetX = e.pageX - t.left, e.offsetY = e.pageY - t.top;
					return this.$el.find(".info-panel").css({
						top : e.offsetY - 15,
						left : e.offsetX + 45
					})
				},
				f.prototype.reset = function () {
					return this.setColor("gray"),
					this.pointsOverlayControl(0),
					this.iconPoints = 0
				},
				f.prototype.render = function () {
					return f.__super__.render.call(this)
				},
				f
			}
			(Backbone.View),
			t.exports = r
		}).call(this)
	}),
	e.define("/source/app/view/PointsOverlay.coffee", function (e, t, n, r, i, s) {
		(function () {
			var n,
			r,
			i = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			s = {}

			.hasOwnProperty,
			o = function (e, t) {
				function r() {
					this.constructor = e
				}
				for (var n in t)
					s.call(t, n) && (e[n] = t[n]);
				return r.prototype = t.prototype,
				e.prototype = new r,
				e.__super__ = t.prototype,
				e
			};
			n = e("../model/AppModel"),
			r = function (e) {
				function r() {
					return this.setColor = i(this.setColor, this),
					this.reset = i(this.reset, this),
					this.onPointsChange = i(this.onPointsChange, this),
					this.onTotalChange = i(this.onTotalChange, this),
					this.initialize = i(this.initialize, this),
					r.__super__.constructor.apply(this, arguments)
				}
				var t;
				return o(r, e),
				t = "",
				r.points = {},
				r.prototype.initialize = function () {
					return r.__super__.initialize.call(this),
					this.parentId = this.model.get("parentId"),
					this.points = n.getInstance().points,
					this.points.on("change:" + this.parentId, this.onPointsChange),
					this.points.on("change:totalPoints", this.onTotalChange),
					this.points.on("reset", this.reset),
					this.setColor("gray")
				},
				r.prototype.onTotalChange = function (e) {
					var t,
					n,
					r,
					i,
					s;
					i = e.get("" + this.parentId),
					r = ("" + this.parentId).split("_")[0],
					t = this.$el.parent().attr("class").split(" ")[1],
					s = e.get("totalPoints"),
					n = e.get("" + r);
					if (t < 3 && s > 0) {
						this.$el.show();
						return
					}
					if (t < 6 && n > 4) {
						this.$el.show();
						return
					}
					if (t < 9 && n > 9) {
						this.$el.show();
						return
					}
					if (t < 12 && n > 10) {
						this.$el.show();
						return
					}
					if (t < 15 && n > 15) {
						this.$el.show();
						return
					}
					t < 18 && n > 20 && this.$el.show()
				},
				r.prototype.onPointsChange = function (e) {
					var t;
					t = e.get("" + this.parentId),
					this.setColor("gray"),
					0 < t && t < this.model.get("levels") && this.setColor("orange");
					if (t === this.model.get("levels"))
						return this.setColor("green")
				},
				r.prototype.reset = function () {
					return this.setColor("gray"),
					this.$el.hide()
				},
				r.prototype.setColor = function (e) {
					return this.$el.attr({
						"class" : "points-overlay " + e
					})
				},
				r
			}
			(Backbone.View),
			t.exports = r
		}).call(this)
	}),
	e.define("/source/app/view/InfoPanel.coffee", function (e, t, n, r, i, s) {
		(function () {
			var n,
			r,
			i = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			s = {}

			.hasOwnProperty,
			o = function (e, t) {
				function r() {
					this.constructor = e
				}
				for (var n in t)
					s.call(t, n) && (e[n] = t[n]);
				return r.prototype = t.prototype,
				e.prototype = new r,
				e.__super__ = t.prototype,
				e
			};
			n = e("../model/AppModel"),
			r = function (e) {
				function t() {
					return this.hide = i(this.hide, this),
					this.show = i(this.show, this),
					this.onPointsChange = i(this.onPointsChange, this),
					this.createStatLists = i(this.createStatLists, this),
					this.view = i(this.view, this),
					t.__super__.constructor.apply(this, arguments)
				}
				return o(t, e),
				t.id,
				t.prototype.initialize = function () {
					return t.__super__.initialize.call(this),
					this.points = n.getInstance().points,
					this.id = this.model.get("parentId"),
					this.points.on("change:" + this.id, this.onPointsChange),
					this.points.on("reset", this.onPointsChange),
					this.view()
				},
				t.prototype.view = function () {
					var e,
					t,
					n,
					r,
					i,
					s,
					o,
					u,
					a,
					f,
					l;
					return i = this.model.get("model"),
					l = $("<div class='panel-top'/>"),
					e = $("<div class='panel-body'/>"),
					t = $("<div class='panel-bottom'/>"),
					f = $("<div class='title' />"),
					a = $("<div class='tick' />"),
					u = $("<div class='text' />").html(i.name),
					f.append(a),
					f.append(u),
					r = $("<div class='description' />").append($("<p/>").html(i.description)),
					e.append(f),
					e.append(r),
					o = $("<div class='stats' />"),
					n = $("<div class='current' />").append($("<ul />")),
					s = $("<div class='next' />").html("<span>下一等级:</span>").append($("<ul />")),
					o.append(n),
					o.append(s),
					e.append(o),
					this.$el.append(l),
					this.$el.append(e),
					this.$el.append(t),
					this.createStatLists(),
					this.onPointsChange()
				},
				t.prototype.createStatLists = function () {
					var e,
					t,
					n,
					r,
					i,
					s,
					o,
					u,
					a,
					f;
					n = this.model.get("model"),
					t = this.$el.find(".stats .current ul"),
					i = this.$el.find(".stats .next ul");
					if (n.stats.length > 0) {
						a = n.stats,
						f = [];
						for (o = 0, u = a.length; o < u; o++)
							s = a[o], e = $("<li />").html(s.name), r = $("<li />").html(s.name), t.append(e), f.push(i.append(r));
						return f
					}
					return this.$el.find(".stats").hide()
				},
				t.prototype.onPointsChange = function () {
					var e,
					t,
					n,
					r,
					i,
					s,
					o,
					u,
					a,
					f,
					l,
					c,
					h,
					p,
					d,
					v,
					m,
					g,
					y,
					b,
					w;
					a = this.model.get("model"),
					d = this.model.get("parentId"),
					v = this.points.get("" + d),
					s = this.$el.find(".stats .current").hide(),
					h = this.$el.find(".stats .next").show(),
					a.levels === 1 && s.find("span").hide(),
					v > 0 && (h.show(), s.show()),
					v === a.levels && h.hide(),
					b = a.stats,
					w = [];
					//console.log(b);
					for (u = g = 0, y = b.length; g < y; u = ++g) {
						m = b[u];

						e = s.find("li:nth-child(" + (u + 1) + ")"), t = h.find("li:nth-child(" + (u + 1) + ")"), c = m.name, r = typeof m.base == "string" ? parseFloat(m.base) : m.base, n = typeof m.add == "string" ? parseFloat(m.add) : m.add, f = typeof m.multiply == "string" ? parseFloat(m.multiply) : m.multiply;
						//Added By Alex Beuscher - Allows for an array of numbers to be passed to the function labeled "sequence" to handle progression that does not follow a pattern.
						if (m.sequence) {
							o = m.sequence[v-1]==parseInt(m.sequence[v-1]) ? parseInt(m.sequence[v-1]) : parseFloat(m.sequence[v-1]);
							p = m.sequence[v]==parseInt(m.sequence[v]) ? parseInt(m.sequence[v]) : parseFloat(m.sequence[v]);
							o = Math.round(o * 1e3) / 1e3;
							p = Math.round(p * 1e3) / 1e3;
						}
						else {
							o = n !== void 0 && n !== null ? r * f + n * v : r * f * v;
							o = Math.round(o * 1e3) / 1e3;
							p = n !== void 0 && n !== null ? r * f + (n * v + n) : r * f * (v + 1);
							p = Math.round(p * 1e3) / 1e3;
						}


						i = c.split("[$]").join(o), l = c.split("[$]").join(p), e.html(i), w.push(t.html(l));
						}
					//console.log(w);
					return w
				},
				t.prototype.show = function () {
					return this.$el.show()
				},
				t.prototype.hide = function () {
					return this.$el.hide()
				},
				t
			}
			(Backbone.View),
			t.exports = r
		}).call(this)
	}),
	e.define("/source/app/view/HeaderPanel.coffee", function (e, t, n, r, i, s) {
		(function () {
			var n,
			r,
			i,
			s,
			o = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			u = {}

			.hasOwnProperty,
			a = function (e, t) {
				function r() {
					this.constructor = e
				}
				for (var n in t)
					u.call(t, n) && (e[n] = t[n]);
				return r.prototype = t.prototype,
				e.prototype = new r,
				e.__super__ = t.prototype,
				e
			};
			n = e("../model/AppModel"),
			i = e("./HeaderPointsOverlay"),
			s = e("./InfoPanel"),
			r = function (e) {
				function t() {
					return this.transitionIn = o(this.transitionIn, this),
					this.view = o(this.view, this),
					this.pointsOverlayControl = o(this.pointsOverlayControl, this),
					this.onPointsChange = o(this.onPointsChange, this),
					this.addPoint = o(this.addPoint, this),
					this.onMouseMove = o(this.onMouseMove, this),
					this.onIconRoll = o(this.onIconRoll, this),
					this.onClick = o(this.onClick, this),
					this.events = o(this.events, this),
					this.initialize = o(this.initialize, this),
					t.__super__.constructor.apply(this, arguments)
				}
				return a(t, e),
				t.over = !1,
				t.prototype.initialize = function () {
					return t.__super__.initialize.call(this),
					this.view(),
					this.points = n.getInstance().points,
					this.points.on("change:totalPoints", this.onPointsChange)
				},
				t.prototype.events = function () {
					return {
						click : "onClick",
						mouseover : "onIconRoll",
						mouseout : "onIconRoll",
						mousemove : "onMouseMove"
					}
				},
				t.prototype.onClick = function (e) {
					return this.addPoint()
				},
				t.prototype.onIconRoll = function (e) {
					switch (e.type) {
					case "mouseover":
						return this.over || this.infoPanel.show(),
						this.over = !0;
					case "mouseout":
						return this.over && this.infoPanel.hide(),
						this.over = !1
					}
				},
				t.prototype.onMouseMove = function (e) {
					var t;
					if (typeof e.offsetX == "undefined" || typeof event.offsetY == "undefined")
						t = $(e.target).offset(), e.offsetX = e.pageX - t.left, e.offsetY = e.pageY - t.top;
					return this.$el.find(".info-panel").css({
						top : e.offsetY - 15,
						left : e.offsetX + 45
					})
				},
				t.prototype.addPoint = function () {
					var e;
					e = this.points.get("totalPoints");
					if (e < 1)
						return this.points.set("totalPoints", e + 1), SoundSwf.playSound(0), $(".color-panel").css({
							height : "78px"
						})
				},
				t.prototype.onPointsChange = function (e) {
					var t;
					return t = e.get("totalPoints"),
					this.pointsOverlayControl(t)
				},
				t.prototype.pointsOverlayControl = function (e) {
					var t;
					return t = this.$el.find(".points-overlay"),
					e > 0 ? (t.html("1/1"), this.$el.css({
							background : "url(" + this.model.green + ") center no-repeat"
						})) : (t.html("0/1"), this.$el.css({
							background : "url(" + this.model.gray + ") center no-repeat"
						}))
				},
				t.prototype.view = function () {
					var e,
					t,
					n,
					r,
					o;
					this.$el.attr("unselectable", "on"),
					o = $("<div/>").addClass("points-overlay").html("0/1").attr("unselectable", "on"),
					this.$el.append(o),
					r = new i({
							el : o,
							model : {
								parentId : "" + this.model.panel + "_" + this.model.id
							}
						}),
					t = new Backbone.Model,
					t.set("model", this.model.icon),
					t.set("parentId", "totalPoints"),
					n = $("<div class='info-panel'/>"),
					this.$el.append(n),
					this.infoPanel = new s({
							el : n,
							model : t
						}),
					this.$el.css({
						background : "url(" + this.model.gray + ") center no-repeat"
					});
					if (BrowserDetect.browser === "Explorer")
						return e = $("<div class='hitspace' />"), this.$el.append(e)
				},
				t.prototype.transitionIn = function () {
					return TweenMax.from(this.$el, .4, {
						css : {
							opacity : 0,
							top : "-30px"
						},
						delay : .5,
						ease : Power3.easeOut
					})
				},
				t
			}
			(Backbone.View),
			t.exports = r
		}).call(this)
	}),
	e.define("/source/app/view/HeaderPointsOverlay.coffee", function (e, t, n, r, i, s) {
		(function () {
			var n,
			r,
			i = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			s = {}

			.hasOwnProperty,
			o = function (e, t) {
				function r() {
					this.constructor = e
				}
				for (var n in t)
					s.call(t, n) && (e[n] = t[n]);
				return r.prototype = t.prototype,
				e.prototype = new r,
				e.__super__ = t.prototype,
				e
			};
			n = e("../model/AppModel"),
			r = function (e) {
				function t() {
					return this.setColor = i(this.setColor, this),
					this.reset = i(this.reset, this),
					this.onPointsChange = i(this.onPointsChange, this),
					this.initialize = i(this.initialize, this),
					t.__super__.constructor.apply(this, arguments)
				}
				return o(t, e),
				t.prototype.initialize = function () {
					return t.__super__.initialize.call(this),
					this.points = n.getInstance().points,
					this.points.on("change:totalPoints", this.onPointsChange),
					this.points.on("reset", this.reset),
					this.setColor("gray")
				},
				t.prototype.onPointsChange = function (e) {
					var t;
					t = e.get("totalPoints"),
					this.setColor("gray");
					if (t > 0)
						return this.setColor("green")
				},
				t.prototype.reset = function () {
					return console.log("reset head"),
					this.setColor("gray")
				},
				t.prototype.setColor = function (e) {
					return this.$el.attr("class", "points-overlay " + e)
				},
				t
			}
			(Backbone.View),
			t.exports = r
		}).call(this)
	}),
	e.define("/source/app/view/ScoreBoard.coffee", function (e, t, n, r, i, s) {
		(function () {
			var e,
			n = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			r = {}

			.hasOwnProperty,
			i = function (e, t) {
				function i() {
					this.constructor = e
				}
				for (var n in t)
					r.call(t, n) && (e[n] = t[n]);
				return i.prototype = t.prototype,
				e.prototype = new i,
				e.__super__ = t.prototype,
				e
			};
			e = function (e) {
				function t() {
					return this.transitionIn = n(this.transitionIn, this),
					this.view = n(this.view, this),
					this.onPointsChange = n(this.onPointsChange, this),
					this.initialize = n(this.initialize, this),
					t.__super__.constructor.apply(this, arguments)
				}
				return i(t, e),
				t.prototype.initialize = function () {
					return t.__super__.initialize.call(this),
					this.model.on("change:totalPoints", this.onPointsChange),
					this.onPointsChange(),
					this.view()
				},
				t.prototype.onPointsChange = function () {
					var e,
					t,
					n,
					r;
					return t = this.$el.find("#required-level .score"),
					e = this.$el.find("#remaining-points .score"),
					n = this.model.get("maxPoints") - this.model.get("totalPoints"),
					r = n < this.model.get("maxPoints") ? 2 + this.model.get("totalPoints") : "---",
					t.html(r),
					e.html(n)
				},
				t.prototype.view = function () {},
				t.prototype.transitionIn = function () {
					return TweenMax.from(this.$el, .6, {
						css : {
							top : "1200px"
						},
						delay : 1.3,
						ease : Expo.easeOut
					})
				},
				t
			}
			(Backbone.View),
			t.exports = e
		}).call(this)
	}),
	e.define("/source/app/model/utils/BitlyGenerator.coffee", function (e, t, n, r, i, s) {
		(function () {
			var e;
			e = function () {
				function e() {}

				return e.bitlyUid = "dHBpbnRlcmFjdGl2ZQ==",
				e.bitlyKey = "Ul8xMWQxNDNhMGI4NDA2MTIwN2YwNTE2Yzg4ZmIxOWMyYg==",
				e.bitlyUrl = "https://api-ssl.bitly.com/v3/shorten?login=[0]&apiKey=[1]&longUrl=[2]",
				e.shorten = function (e) {
					var t,
					n,
					r,
					i = this;
					return t = encodeURI(e),
					r = "",
					n = this.bitlyUrl.split("[0]").join(Base64.decode(this.bitlyUid)).split("[1]").join(Base64.decode(this.bitlyKey)).split("[2]").join(t),
					$.ajax(n, {
						async : !1,
						dataType : "json",
						complete : function (e) {
							var t;
							return t = JSON.parse(e.responseText),
							r = t.data.url
						}
					}),
					r
				},
				e
			}
			(),
			t.exports = e
		}).call(this)
	}),
	e.define("/source/app/view/Preloader.coffee", function (e, t, n, r, i, s) {
		(function () {
			var e,
			n = function (e, t) {
				return function () {
					return e.apply(t, arguments)
				}
			},
			r = {}

			.hasOwnProperty,
			i = function (e, t) {
				function i() {
					this.constructor = e
				}
				for (var n in t)
					r.call(t, n) && (e[n] = t[n]);
				return i.prototype = t.prototype,
				e.prototype = new i,
				e.__super__ = t.prototype,
				e
			};
			e = function (e) {
				function t() {
					return this.transitionOut = n(this.transitionOut, this),
					this.load = n(this.load, this),
					this.transitionIn = n(this.transitionIn, this),
					t.__super__.constructor.apply(this, arguments)
				}
				return i(t, e),
				t.prototype.initialize = function () {
					return t.__super__.initialize.call(this)
				},
				t.prototype.transitionIn = function () {
					var e = this;
					return TweenMax.from(this.$el, 1, {
						css : {
							top : "-500px"
						},
						delay : .7,
						ease : Power4.easeOut,
						onComplete : function () {
							return e.trigger("transitionInComplete")
						}
					}),
					null
				},
				t.prototype.load = function (e) {
					return this.$el.find(".bar").css({
						width : 468 * e + "px"
					})
				},
				t.prototype.transitionOut = function () {
					var e = this;
					return TweenMax.to(this.$el, 1, {
						css : {
							top : "1300px"
						},
						delay : .2,
						ease : Power4.easeIn,
						onComplete : function () {
							return e.trigger("transitionOutComplete"),
							e.$el.remove()
						}
					}),
					null
				},
				t
			}
			(Backbone.View),
			t.exports = e
		}).call(this)
	}),
	e.define("/source/main.coffee", function (e, t, n, r, i, s) {
		(function () {
			var t,
			n,
			r,
			i,
			s;
			window.$ = e("jquery-browserify"),
			window.Backbone = e("backbone-browserify"),
			window.swfobject = e("./include/swfobject"),
			window.Base64 = e("./include/base64/base64"),
			Backbone.setDomLibrary($),
			e("./include/greensock/TweenMax.min"),
			e("./include/greensock/TimelineMax.min"),
			e("./include/greensock/easing/EasePack.min.js"),
			e("./include/BrowserDetect"),
			t = e("./app/TechTree"),
			BrowserDetect.init(),
			window.SoundSwf = {
				playSound : function () {},
				muteSound : function () {}

			},
			r = function (e) {
				var t,
				n;
				return t = window.navigator.appName.indexOf("Microsoft") !== -1 ? !0 : !1,
				n = t ? window[e] : document[e],
				n
			},
			i = function () {
				return window.SoundSwf = r("soundApp")
			},
			s = function (e) {
				var t,
				n,
				r;
				return e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"),
				n = "[\\?&]" + e + "=([^&#]*)",
				t = new RegExp(n),
				r = t.exec(window.location.href),
				r == null ? "" : r[1]
			};
			if (window.console === void 0 || window.console === null)
				window.console = {
					log : function () {},
					warn : function () {},
					fatal : function () {}

				};
			n = {
				id : "soundApp",
				name : "soundApp"
			},
			BrowserDetect.OS !== "iPhone/iPod" && swfobject.embedSWF("swf/sound.swf", "sound", "1", "1", "9.0.0", "swf/expressInstall.swf", {}, {}, n, i),
			window.shareHash = s("share"),
			$(document).ready(function () {
				return this.techtree = new t(window),
				this.techtree.start(s("class"))
			})
		}).call(this)
	}),
	e("/source/main.coffee")
})()
