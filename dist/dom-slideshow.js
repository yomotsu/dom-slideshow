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

	var DURATION = 5000;
	var $style = document.createElement('style');
	$style.innerHTML = "\n.DOMSlideshow {\n\twidth: auto;\n\theight: 100%;\n\toverflow: hidden;\n\tposition: relative;\n}\n.DOMSlideshow__Inner {\n\tlist-style: none;\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 0;\n\tmargin: 0;\n}\n.DOMSlideshow__Item {\n\topacity: 0;\n\tpadding: 0;\n\tmargin: -100px;\n\tposition: absolute;\n\tz-index: 1;\n\twidth: calc( 100% + 200px );\n\theight: calc( 100% + 200px );\n\tbackground-position: 50% 50%;\n\tbackground-size: cover;\n\tbackface-visibility: hidden;\n}\n.DOMSlideshow__Item:first-child {\n\topacity: 1;\n\tz-index: 2;\n}\n";
	document.head.appendChild($style);
	var defaultOption = {
	  loop: false
	};

	var DOMSlideshow =
	/*#__PURE__*/
	function () {
	  function DOMSlideshow($el) {
	    var _this = this;

	    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOption,
	        loop = _ref.loop;

	    _classCallCheck(this, DOMSlideshow);

	    this._current = 0;
	    this.loop = loop;
	    this.$items = $el.querySelectorAll('.DOMSlideshow__Item');

	    var transition = function transition() {
	      var elRect = $el.getBoundingClientRect();
	      var viewWidth = elRect.width;
	      var viewHeight = elRect.height;
	      var scaleMin = Math.max(1 + ((viewHeight + 50) / viewHeight - 1), 1 + ((viewWidth + 50) / viewWidth - 1));
	      var scaleMax = Math.max(1 + (viewHeight / (viewHeight + 200) - 1), 1 + (viewWidth / (viewWidth + 200) - 1));
	      var $current = _this.$items[_this.current];
	      var $prev = _this.$items[_this.prevIndex]; // const $next    = this.$items[ this.nextIndex ];

	      var fx = $current.getAttribute('data-slideshow-transition');
	      $current.style.transform = 'none';
	      $current.style.opacity = 0;
	      $current.style.zIndex = 3;
	      requestAnimationFrame(function () {
	        $current.style.transition = "transform ".concat(DURATION, "ms linear, opacity ").concat(DURATION * 0.2, "ms");
	        $current.style.transform = fx === 'zoomin' ? 'scale( ' + scaleMin + ', ' + scaleMin + ' )' : fx === 'zoomout' ? 'scale( ' + scaleMax + ', ' + scaleMax + ' )' : fx === 'ltor' ? 'translateX( 70px )' : fx === 'rtol' ? 'translateX( -70px )' : 'none';
	        $current.style.opacity = 1;
	        $current.style.zIndex = 1;
	      });
	      setTimeout(function () {
	        if (!_this.loop && _this.isLast) return;
	        $current.style.transition = 'none';
	        $current.style.opacity = 1;
	        $current.style.zIndex = 0;
	        $prev.style.transition = 'none';
	        $prev.style.transform = 'none';
	        $prev.style.opacity = 0;
	        $prev.style.zIndex = 0;

	        _this.toNext();

	        transition();
	      }, DURATION);
	    };

	    transition();
	  }

	  _createClass(DOMSlideshow, [{
	    key: "toNext",
	    value: function toNext() {
	      this._current = this.nextIndex;
	    }
	  }, {
	    key: "current",
	    get: function get() {
	      return this._current;
	    }
	  }, {
	    key: "itemLength",
	    get: function get() {
	      return this.$items.length;
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
	Array.prototype.forEach.call(document.querySelectorAll('.DOMSlideshow'), function ($el) {
	  new DOMSlideshow($el, {
	    loop: true
	  });
	});

	return DOMSlideshow;

}));
