/*!
 * dom-slideshow
 * https://github.com/yomotsu/dom-slideshow
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
var TRANSITION_TYPE = {
    CROSS_FADE: 0,
    CLIP: 1,
};
var $style = document.createElement('style');
$style.innerHTML = "\n.DOMSlideshow {\n\toverflow: hidden;\n\tposition: relative;\n\twidth: auto;\n\theight: 100%;\n}\n.DOMSlideshow__Inner {\n\tlist-style: none;\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 0;\n\tmargin: 0;\n}\n.DOMSlideshow__Item {\n\topacity: 0;\n\tposition: absolute;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 0;\n}\n.DOMSlideshow__Item:first-child {\n\topacity: 1;\n\tz-index: 2;\n}\n.DOMSlideshow__ItemContent {\n\tposition: relative;\n\tz-index: 1;\n}\n.DOMSlideshow__ItemEffect {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-position: 50% 50%;\n\tbackground-size: cover;\n\tbackface-visibility: hidden;\n}\n.-ltor .DOMSlideshow__ItemEffect {\n\ttransform: translateX( 70px );\n\twidth: calc( 100% + 70px );\n\tmargin-left: -70px;\n}\n.-rtol .DOMSlideshow__ItemEffect {\n\ttransform: translateX( -70px );\n\twidth: calc( 100% + 70px );\n}\n.-zoomin .DOMSlideshow__ItemEffect {\n\ttransform: scale( 1.1, 1.1 );\n}\n.-zoomout .DOMSlideshow__ItemEffect {\n\ttransform: scale( 1.1, 1.1 );\n}\n";
document.head.appendChild($style);
var DOMSlideshow = (function () {
    function DOMSlideshow($el, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this._currentIndex = 0;
        this._transitionType = TRANSITION_TYPE.CROSS_FADE;
        this._running = true;
        this._isTransitioning = false;
        this._initialTransition = true;
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
        this._transitionType = options.transitionType || this._transitionType;
        this._lastCurrentIndex = this.prevIndex;
        this.duration = options.duration || this.duration;
        this.noLoop = options.noLoop || this.noLoop;
        this._transition();
        var updateSize = function () {
            var elRect = $el.getBoundingClientRect();
            _this._width = elRect.width;
            _this._height = elRect.height;
        };
        updateSize();
        window.addEventListener('resize', updateSize);
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
    Object.defineProperty(DOMSlideshow.prototype, "isTransitioning", {
        get: function () {
            return this._isTransitioning;
        },
        enumerable: false,
        configurable: true
    });
    DOMSlideshow.prototype.to = function (index) {
        var _this = this;
        if (index === this._currentIndex)
            return;
        var $current = this._$items[this._currentIndex];
        var $prev = this._$items[this._lastCurrentIndex];
        var $prevEffects = this._$effects[this._lastCurrentIndex];
        $current.style.zIndex = '0';
        $prev.style.transition = 'none';
        if (this._transitionType === TRANSITION_TYPE.CROSS_FADE) {
            $prev.style.opacity = '0';
        }
        else if (this._transitionType === TRANSITION_TYPE.CLIP) {
            $prev.style.clip = "rect( 0, " + this._width + "px, " + this._height + "px, " + this._width + "px )";
        }
        $prevEffects.style.transition = 'none';
        $prevEffects.style.transform = $prev.classList.contains('-zoomout') ? '' : 'none';
        this._lastCurrentIndex = this._currentIndex;
        this._currentIndex = index;
        Array.prototype.forEach.call(this._$items, function ($item, i) {
            $item.classList.remove('-current');
            if (i === _this._currentIndex)
                $item.classList.add('-current');
        });
        this._transition();
    };
    DOMSlideshow.prototype.toNext = function () {
        this.to(this.nextIndex);
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
        $currentEffects.style.transition = "none";
        requestAnimationFrame(function () {
            if (_this._initialTransition) {
                _this._initialTransition = false;
            }
            else {
                if (_this._transitionType === TRANSITION_TYPE.CROSS_FADE) {
                    $current.style.opacity = '0';
                }
                else if (_this._transitionType === TRANSITION_TYPE.CLIP) {
                    $current.style.opacity = '1';
                    $current.style.clip = "rect( 0, " + _this._width + "px, " + _this._height + "px, " + _this._width + "px )";
                }
            }
            $current.style.zIndex = '1';
            $currentEffects.style.transform = $current.classList.contains('-zoomout') ? '' : 'none';
            requestAnimationFrame(function () {
                if (_this._transitionType === TRANSITION_TYPE.CROSS_FADE) {
                    $current.style.transition = "opacity " + _this.duration * 0.2 + "ms";
                    $current.style.opacity = '1';
                }
                else if (_this._transitionType === TRANSITION_TYPE.CLIP) {
                    $current.style.transition = "clip " + _this.duration * 0.2 + "ms";
                    $current.style.clip = "rect( 0, " + _this._width + "px, " + _this._height + "px, 0 )";
                }
                _this._isTransitioning = true;
                window.setTimeout(function () {
                    _this._isTransitioning = false;
                    $current.style.clip = '';
                }, _this.duration * 0.2);
                $currentEffects.style.transition = "transform " + _this.duration * 1.2 + "ms linear";
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

export default DOMSlideshow;
