/*!
 * @author yomotsu
 * DOMSlideshow
 * https://github.com/yomotsu/dom-slideshow
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.DOMSlideshow = factory());
}(this, function () { 'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	var $style = document.createElement('style');
	$style.innerHTML = "\n.DOMSlideshow {\n\toverflow: hidden;\n\tposition: relative;\n\twidth: auto;\n\theight: 100%;\n}\n.DOMSlideshow__Inner {\n\tlist-style: none;\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 0;\n\tmargin: 0;\n}\n.DOMSlideshow__Item {\n\topacity: 0;\n\tposition: absolute;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 0;\n}\n.DOMSlideshow__Item:first-child {\n\topacity: 1;\n\tz-index: 2;\n}\n.DOMSlideshow__ItemContent {\n\tposition: relative;\n\tz-index: 1;\n}\n.DOMSlideshow__ItemEffect {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: calc( 100% + 200px );\n\theight: calc( 100% + 200px );\n\tmargin: -100px;\n\tbackground-position: 50% 50%;\n\tbackground-size: cover;\n\tbackface-visibility: hidden;\n}\n";
	document.head.appendChild($style);
	var defaultOption = {
	  duration: 5000,
	  noLoop: false
	};

	var DOMSlideshow =
	/*#__PURE__*/
	function () {
	  function DOMSlideshow($el) {
	    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOption,
	        duration = _ref.duration,
	        noLoop = _ref.noLoop;

	    _classCallCheck(this, DOMSlideshow);

	    if ($el.getAttribute('data-dom-slideshow-active') === 'true') return;
	    $el.setAttribute('data-dom-slideshow-active', 'true');
	    this._current = 0;
	    this._$el = $el;
	    this._$items = this._$el.querySelectorAll('.DOMSlideshow__Item');
	    this._$effects = this._$el.querySelectorAll('.DOMSlideshow__ItemEffect');
	    this._timeoutId = null;
	    this.duration = duration;
	    this.noLoop = !!noLoop;

	    this._transition();
	  }

	  _createClass(DOMSlideshow, [{
	    key: "toNext",
	    value: function toNext() {
	      var $current = this._$items[this.current];
	      var $prev = this._$items[this.prevIndex];
	      var $prevEffects = this._$effects[this.prevIndex];
	      $current.style.zIndex = 0;
	      $prev.style.transition = 'none';
	      $prev.style.transform = 'none';
	      $prev.style.opacity = 0;
	      $prevEffects.style.transition = 'none';
	      $prevEffects.style.transform = 'none';
	      this._current = this.nextIndex;

	      this._transition();
	    }
	  }, {
	    key: "_transition",
	    value: function _transition() {
	      var _this = this;

	      clearTimeout(this._timeoutId);

	      var elRect = this._$el.getBoundingClientRect();

	      var viewWidth = elRect.width;
	      var viewHeight = elRect.height;
	      var scaleMin = Math.max(1 + ((viewHeight + 50) / viewHeight - 1), 1 + ((viewWidth + 50) / viewWidth - 1));
	      var scaleMax = Math.max(1 + (viewHeight / (viewHeight + 200) - 1), 1 + (viewWidth / (viewWidth + 200) - 1));
	      var $current = this._$items[this.current];
	      var $currentEffects = this._$effects[this.current];
	      $current.style.transition = 'none';
	      $current.style.transform = 'none';
	      $current.style.opacity = 0;
	      $current.style.zIndex = 1;
	      $currentEffects.style.transition = "none";
	      $currentEffects.style.transform = 'none';
	      requestAnimationFrame(function () {
	        $current.style.transition = "opacity ".concat(_this.duration * 0.2, "ms");
	        $current.style.opacity = 1;
	        $currentEffects.style.transition = "transform ".concat(_this.duration, "ms linear");
	        $currentEffects.style.transform = $current.classList.contains('-zoomin') ? "scale( ".concat(scaleMin, ", ").concat(scaleMin, " )") : $current.classList.contains('-zoomout') ? "scale( ".concat(scaleMax, ", ").concat(scaleMax, " )") : $current.classList.contains('-ltor') ? "translateX( 70px )" : $current.classList.contains('-rtol') ? "translateX( -70px )" : 'none';
	        _this._timeoutId = setTimeout(function () {
	          if (_this.noLoop && _this.isLast) return;

	          _this.toNext();
	        }, _this.duration);
	      });
	    }
	  }, {
	    key: "current",
	    get: function get() {
	      return this._current;
	    }
	  }, {
	    key: "itemLength",
	    get: function get() {
	      return this._$items.length;
	    }
	  }, {
	    key: "prevIndex",
	    get: function get() {
	      return this.current !== 0 ? this.current - 1 : this.itemLength - 1;
	    }
	  }, {
	    key: "nextIndex",
	    get: function get() {
	      return this.itemLength - 1 > this.current ? this.current + 1 : 0;
	    }
	  }, {
	    key: "isLast",
	    get: function get() {
	      return this.current === this.itemLength - 1;
	    }
	  }]);

	  return DOMSlideshow;
	}();
	Array.prototype.forEach.call(document.querySelectorAll('.DOMSlideshow[data-dom-slideshow-autostart]'), function ($el) {
	  new DOMSlideshow($el);
	});

	return DOMSlideshow;

}));
