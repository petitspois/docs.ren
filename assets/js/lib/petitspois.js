/**
 * Created by qingdou on 15/2/2.
 */



typeof function () {

    var root = this,

        arr = [],

        isPromise = false,

        slice = arr.slice;

    var petitspois = function (selector, context) {
        return new petitspois.prototype.initialize(selector, context);
    }

    petitspois.prototype = {

        constructor: petitspois,

        display: false,

        ancestor: {},

        each: function (obj, cb) {
            var i = 0,
                value;
            if ('function' == typeof obj) {
                var cb = obj,
                    len = this.length;
                for (; i < len; i++) {
                    value = cb.apply((this[i] ), [i, this[i]]);
                    if (value === false)break;
                }
            } else {
                var len = obj.length;
                for (; i < len; i++) {
                    value = cb.apply(( obj[i] ), [i, obj[i]]);
                    if (value === false)break;
                }
            }
        },
        on: function (type, cb, bubble) {
            bubble = bubble || false;
            var value;
            petitspois.prototype.each(this, function () {
                this['addEventListener'](type, function (e) {
                    value = cb.call(this, e);
                    if (!value) {
                        //e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    }
                }, bubble);
            });

            return this;
        },
        trigger: function (type) {
            var event;
            event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
            this[0].dispatchEvent(event);
            return this;
        },
        hasClass: function (value, other) {
            var values = (!other && this[0].className.split(' ')) || other.className;
            return !!~values.indexOf(value);
        },
        addClass: function (classes) {
            this.each(function () {
                if (classes) {
                    this.className = this.className + ' ' + classes;
                }
            });
            return this;
        },
        removeClass: function (classes) {
            this.each(function () {
                var classColl = this.className.split(' ') || [],
                    removeColl = classes.split(' ') || [];
                petitspois.prototype.each(removeColl, function (k, v) {
                    petitspois.prototype.each(classColl, function (k1, v2) {
                        if (v == v2) {
                            classColl.splice(k1, 1);
                        }
                    });
                });
                this.className = classColl.join(' ');
            });
            return this;
        },
        text: function (str) {
            this[0].innerHTML = str || '';
            return this;
        },
        css: function (str) {
            this.each(this, function (k, v) {
                v.style.cssText = str;
            });
            return this;
        },
        append: function (content) {
            if (typeof content == 'string') {
                this[0].appendChild(document.createTextNode(content));
            } else {
                this[0].appendChild(content);
            }
            return this;
        },
        eq: function (num) {
            this[0] = this[num];
            this.length = 1;
            return this;
        },
        children: function () {
            var len,
                me = this;
            if (!this.display) {
                petitspois.mixIn(this.ancestor, this);
            }
            this.each(this, function (k, v) {
                len = v.children.length;
                if (me.length == k)return false;
                petitspois.prototype.each(v.children, function (k, v) {
                    me[k] = v;
                });
            });
            !this.display && (this.display = true);
            this.length = len;
            return this;
        },
        parent: function (selector) {

            var node = this[0];

            var parent = this[0] = node.parentNode;

            if (selector && parent) {
                if (parent.className && ~parent.className.indexOf(selector)) {
                    this[0] = parent;
                    this.length = 1;
                    return this;
                } else if('BODY' == parent.nodeName){
                    this[0] = parent;
                    this.length = 1;
                    return this;
                } else {
                    return this.parent(selector);
                }

            } else {
                this[0] = parent;
                this.length = 1;
                return this;
            }

        },

        siblings: function () {
            this[0] = this[0].nextElementSibling;
            this.length = 1;
            return this;
        },
        end: function () {
            petitspois.mixIn(this, this.ancestor);
            return this;
        },
        load: function (url, cb) {
            var me = this;
            petitspois.ajax({
                url: url,
                dataType: 'html'
            }).then(function (responseText) {
                me[0].innerHTML = responseText;
                cb();
            }, function () {
            });
        },
        attr: function (attribute) {
            return this[0].getAttribute(attribute);
        },
        remove: function(){
            var parent = this[0].parentNode;
            if(parent){
                parent.removeChild(this[0]);
            }
        }
    }

    var init = petitspois.prototype.initialize = function (selector, context) {


        if (typeof selector == 'string') {
            var elem = document.querySelectorAll(selector),
                len = elem.length;
            if (len) {
                var i = -1,
                    node;
                while (node = elem[++i]) {
                    this[i] = node;
                }
                this.length = len;
            }
        } else if (1 == selector.nodeType || 9 == selector.nodeType) {
            this[0] = selector;
            this.length = 1;
        }

        return this;

    }

    //是否支持es6 Promise
    try {
        petitspois.promise = Promise;
    } catch (e) {
        typeof function () {
            var Promise = function (fn) {
                var that = this,
                    resolve = function (val) {
                        that.resolve(val);
                    },
                    reject = function (val) {
                        that.reject(val);
                    };
                that.status = 'pending';
                that.resolveFn = null;
                that.rejectFn = null;
                typeof fn === 'function' && fn(resolve, reject);
            }

            Promise.prototype.resolve = function (val) {
                if (this.status === 'pending') {
                    this.status = 'fulfilled';
                    this.resolveFn && this.resolveFn(val);
                }
            }

            Promise.prototype.reject = function (val) {
                if (this.status === 'pending') {
                    this.status = 'rejected';
                    this.rejectFn && this.rejectFn(val);
                }
            }

            Promise.prototype.then = function (resolve, reject) {
                var borrow = new Promise();
                this.resolveFn = function (val) {
                    var result = resolve ? resolve(val) : val;
                    if (result instanceof Promise) {
                        result.then(function (val) {
                            borrow.resolve(val);
                        });
                    } else {
                        borrow.resolve(result);
                    }
                }
                this.rejectFn = function (val) {
                    var result = reject ? reject(val) : val;
                    borrow.reject(result);
                }
                return borrow;
            }

            petitspois.promise = Promise;

        }();

    }


    petitspois.mixIn = function (target) {
        for (var i = 1, arg, args = arguments; arg = args[i++];) {
            if (arg !== target) {
                for (var prop in arg) {
                    target[prop] = arg[prop];
                }
            }
        }
        return target;
    }

    petitspois.trim = function(str){
        return str.replace(/^\s+|\s+$/g, '');
    }

    var settings = {
        url: '',
        type: 'GET',
        dataType: 'text', // text, html, json or xml
        async: true,
        cache: true,
        data: null,
        contentType: 'application/x-www-form-urlencoded',
        accepts: {
            text: 'text/plain',
            html: 'text/html',
            xml: 'application/xml, text/xml',
            json: 'application/json, text/javascript'
        }
    };

    petitspois.isEmail = function(str){
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
    };

    petitspois.ajax = function (options) {

        var pms = {},

            xhr = new XMLHttpRequest(),

            opts = (function (s, o) {
                var opts = {};
                petitspois.mixIn(opts, s, o);
                return opts;
            })(settings, options),

            param = function (data) {
                var s = [];
                for (var key in data) {
                    s.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                }
                return s.join('&');
            },

            ready = function (resolve, reject) {
                return function () {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        var data = (opts.dataType == 'xml') ? xhr.responseXML : xhr.responseText;
                        if (opts.dataType == 'json') {
                            data = JSON.parse(data);
                        }
                        resolve(data, xhr.status);
                    } else {
                        reject(opts, xhr, xhr.status);
                    }
                }
            };

        //clear cache
        if (!opts.cache) {
            opts.url += (~opts.url.indexOf('?') ? '&' : '?') + '_=' + (+new Date);
        }

        //queryString
        if (opts.data) {
            if (opts.type == 'GET') {
                opts.url += (~opts.url.indexOf('?') ? '&' : '?') + param(opts.data);
                opts.data = null;
            } else {
                opts.data = opts.contentType ? param(opts.data) : opts.data;
            }
        }

        xhr.open(opts.type, opts.url, opts.async);

        opts.contentType && xhr.setRequestHeader('Content-type', opts.contentType);

        if (opts.contentType && opts.dataType && opts.accepts[opts.dataType]) {
            xhr.setRequestHeader('Accept', opts.accepts[opts.dataType]);
        }

        pms = new Promise(function (resolve, reject) {
            if (opts.async) {
                xhr.onload = ready.apply(xhr, arguments);
                xhr.send(opts.data);
            } else {
                xhr.send(opts.data);
                ready.apply(xhr, arguments)();
            }
        });

        return pms;

    }

    init.prototype = petitspois.prototype;


    if (typeof define === "function" && define.amd) {
        define("petitspois", [], function () {
            return petitspois;
        });
    }


    return petitspois;

}.call(this);

