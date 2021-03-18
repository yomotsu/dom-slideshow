/*!
 * dom-slideshow
 * https://github.com/yomotsu/dom-slideshow
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DOMSlideshow = factory());
}(this, (function () { 'use strict';

	var $style = document.createElement('style');
	$style.innerHTML = "\n.DOMSlideshow {\n\toverflow: hidden;\n\tposition: relative;\n\twidth: auto;\n\theight: 100%;\n}\n.DOMSlideshow__Inner {\n\tlist-style: none;\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 0;\n\tmargin: 0;\n}\n.DOMSlideshow__Item {\n\topacity: 0;\n\tposition: absolute;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 0;\n}\n.DOMSlideshow__Item:first-child {\n\topacity: 1;\n\tz-index: 2;\n}\n.DOMSlideshow__ItemContent {\n\tposition: relative;\n\tz-index: 1;\n}\n.DOMSlideshow__ItemEffect {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-position: 50% 50%;\n\tbackground-size: cover;\n\tbackface-visibility: hidden;\n}\n.-ltor .DOMSlideshow__ItemEffect {\n\ttransform: translateX( 70px );\n\twidth: calc( 100% + 70px );\n\tmargin-left: -70px;\n}\n.-rtol .DOMSlideshow__ItemEffect {\n\ttransform: translateX( -70px );\n\twidth: calc( 100% + 70px );\n}\n.-zoomin .DOMSlideshow__ItemEffect {\n\ttransform: scale( 1.1, 1.1 );\n}\n.-zoomout .DOMSlideshow__ItemEffect {\n\ttransform: scale( 1.1, 1.1 );\n}\n";
	document.head.appendChild($style);
	var DOMSlideshow = (function () {
	    function DOMSlideshow($el, options) {
	        if (options === void 0) { options = {}; }
	        this._currentIndex = 0;
	        this._running = true;
	        this._timeoutId = 0;
	        this._listeners = {};
	        this.duration = 5000;
	        this.noLoop = false;
	        if ($el.getAttribute('data-dom-slideshow-active') === 'true')
	            return;
	        $el.setAttribute('data-dom-slideshow-active', 'true');
	        this._$el = $el;
	        this._$items = this._$el.querySelectorAll('.DOMSlideshow__Item');
	        this._$effects = this._$el.querySelectorAll('.DOMSlideshow__ItemEffect');
	        this.duration = options.duration || this.duration;
	        this.noLoop = options.noLoop || this.noLoop;
	        this._transition();
	    }
	    Object.defineProperty(DOMSlideshow.prototype, "currentIndex", {
	        get: function () {
	            return this._currentIndex;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(DOMSlideshow.prototype, "itemLength", {
	        get: function () {
	            return this._$items.length;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(DOMSlideshow.prototype, "prevIndex", {
	        get: function () {
	            return this._currentIndex !== 0 ? this._currentIndex - 1 : this.itemLength - 1;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(DOMSlideshow.prototype, "nextIndex", {
	        get: function () {
	            return this.itemLength - 1 > this._currentIndex ? this._currentIndex + 1 : 0;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(DOMSlideshow.prototype, "isLast", {
	        get: function () {
	            return this._currentIndex === this.itemLength - 1;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    DOMSlideshow.prototype.toNext = function () {
	        var $current = this._$items[this._currentIndex];
	        var $prev = this._$items[this.prevIndex];
	        var $prevEffects = this._$effects[this.prevIndex];
	        $current.style.zIndex = '0';
	        $prev.style.transition = 'none';
	        $prev.style.opacity = '0';
	        $prevEffects.style.transition = 'none';
	        $prevEffects.style.transform = 'none';
	        this._currentIndex = this.nextIndex;
	        this._transition();
	    };
	    DOMSlideshow.prototype.play = function () {
	        if (!this._running)
	            this._transition();
	        this._running = true;
	    };
	    DOMSlideshow.prototype.pause = function () {
	        this._running = false;
	        clearTimeout(this._timeoutId);
	    };
	    DOMSlideshow.prototype._transition = function () {
	        var _this = this;
	        clearTimeout(this._timeoutId);
	        var $current = this._$items[this._currentIndex];
	        var $currentEffects = this._$effects[this._currentIndex];
	        this.dispatchEvent({ type: 'transitionStart' });
	        $current.style.transition = 'none';
	        $current.style.opacity = '0';
	        $current.style.zIndex = '1';
	        $currentEffects.style.transition = "none";
	        $currentEffects.style.transform = $current.classList.contains('-zoomout') ? '' : 'none';
	        requestAnimationFrame(function () {
	            $current.style.transition = "opacity " + _this.duration * 0.2 + "ms";
	            $current.style.opacity = '1';
	            $currentEffects.style.transition = "transform " + _this.duration + "ms linear";
	            $currentEffects.style.transform = $current.classList.contains('-zoomout') ? 'none' : '';
	            _this._timeoutId = window.setTimeout(function () {
	                if (!_this._running)
	                    return;
	                _this.dispatchEvent({ type: 'transitionEnd' });
	                if (_this.noLoop && _this.isLast) {
	                    _this.dispatchEvent({ type: 'ended' });
	                    return;
	                }
	                _this.toNext();
	            }, _this.duration);
	        });
	    };
	    DOMSlideshow.prototype.addEventListener = function (type, listener) {
	        var listeners = this._listeners;
	        if (listeners[type] === undefined)
	            listeners[type] = [];
	        if (listeners[type].indexOf(listener) === -1) {
	            listeners[type].push(listener);
	        }
	    };
	    DOMSlideshow.prototype.removeEventListener = function (type, listener) {
	        var listeners = this._listeners;
	        var listenerArray = listeners[type];
	        if (listenerArray !== undefined) {
	            var index = listenerArray.indexOf(listener);
	            if (index !== -1)
	                listenerArray.splice(index, 1);
	        }
	    };
	    DOMSlideshow.prototype.dispatchEvent = function (event) {
	        var listeners = this._listeners;
	        var listenerArray = listeners[event.type];
	        if (listenerArray !== undefined) {
	            event.target = this;
	            var array = listenerArray.slice(0);
	            for (var i = 0, l = array.length; i < l; i++) {
	                array[i].call(this, event);
	            }
	        }
	    };
	    return DOMSlideshow;
	}());
	Array.prototype.forEach.call(document.querySelectorAll('.DOMSlideshow[data-dom-slideshow-autostart]'), function ($el) {
	    new DOMSlideshow($el);
	});

	return DOMSlideshow;

})));
