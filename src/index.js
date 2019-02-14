const $style = document.createElement( 'style' );
$style.innerHTML = `
.DOMSlideshow {
	overflow: hidden;
	position: relative;
	width: auto;
	height: 100%;
}
.DOMSlideshow__Inner {
	list-style: none;
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
}
.DOMSlideshow__Item {
	opacity: 0;
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
	padding: 0;
}
.DOMSlideshow__Item:first-child {
	opacity: 1;
	z-index: 2;
}
.DOMSlideshow__ItemContent {
	position: relative;
	z-index: 1;
}
.DOMSlideshow__ItemEffect {
	position: absolute;
	top: 0;
	left: 0;
	width: calc( 100% + 200px );
	height: calc( 100% + 200px );
	margin: -100px;
	background-position: 50% 50%;
	background-size: cover;
	backface-visibility: hidden;
}
`;
document.head.appendChild( $style );

const defaultOption = {
	duration: 5000,
	noLoop: false,
};

export default class DOMSlideshow {

	constructor( $el, { duration, noLoop } = defaultOption ) {

		if ( $el.getAttribute( 'data-dom-slideshow-active' ) === 'true' ) return;

		$el.setAttribute( 'data-dom-slideshow-active', 'true' );

		this._current = 0;
		this._$el = $el;
		this._$items = this._$el.querySelectorAll( '.DOMSlideshow__Item' );
		this._$effects = this._$el.querySelectorAll( '.DOMSlideshow__ItemEffect' );
		this._timeoutId = null;

		this.duration = duration;
		this.noLoop = !! noLoop;

		this._transition();

	}

	get current() {

		return this._current;

	}

	get itemLength() {

		return this._$items.length;

	}

	get prevIndex() {

		return this.current !== 0 ? this.current - 1 : this.itemLength - 1;

	}

	get nextIndex() {

		return this.itemLength - 1 > this.current ? this.current + 1 : 0;

	}

	get isLast() {

		return this.current === this.itemLength - 1;

	}

	toNext() {

		const $current = this._$items[ this.current ];
		const $prev = this._$items[ this.prevIndex ];
		const $prevEffects = this._$effects[ this.prevIndex ];

		$current.style.zIndex = 0;

		$prev.style.transition = 'none';
		$prev.style.transform = 'none';
		$prev.style.opacity = 0;

		$prevEffects.style.transition = 'none';
		$prevEffects.style.transform = 'none';

		this._current = this.nextIndex;
		this._transition();

	}

	_transition() {

		clearTimeout( this._timeoutId );

		const elRect = this._$el.getBoundingClientRect();
		const viewWidth  = elRect.width;
		const viewHeight = elRect.height;
		const scaleMin = Math.max(
			1 + ( ( viewHeight + 50 ) / viewHeight - 1 ),
			1 + ( ( viewWidth  + 50 ) / viewWidth  - 1 )
		);
		const scaleMax = Math.max(
			1 + ( viewHeight / ( viewHeight + 200 ) - 1 ),
			1 + ( viewWidth  / ( viewWidth  + 200 ) - 1 )
		);

		const $current = this._$items[ this.current ];
		const $currentEffects = this._$effects[ this.current ];

		$current.style.transition = 'none';
		$current.style.transform = 'none';
		$current.style.opacity = 0;
		$current.style.zIndex = 1;

		$currentEffects.style.transition = `none`;
		$currentEffects.style.transform = 'none';

		requestAnimationFrame( () => {

			$current.style.transition = `opacity ${ this.duration * 0.2 }ms`;
			$current.style.opacity = 1;

			$currentEffects.style.transition = `transform ${ this.duration }ms linear`;
			$currentEffects.style.transform =
				$current.classList.contains( '-zoomin'  ) ? `scale( ${ scaleMin }, ${ scaleMin } )` :
				$current.classList.contains( '-zoomout' ) ? `scale( ${ scaleMax }, ${ scaleMax } )` :
				$current.classList.contains( '-ltor'    ) ? `translateX( 70px )` :
				$current.classList.contains( '-rtol'    ) ? `translateX( -70px )` :
				'none';

			this._timeoutId = setTimeout( () => {

				if ( this.noLoop && this.isLast ) return;

				this.toNext();

			}, this.duration );

		} );

	}

}

Array.prototype.forEach.call(
	document.querySelectorAll( '.DOMSlideshow[data-dom-slideshow-autostart]' ),
	( $el ) => {

		new DOMSlideshow( $el );

	}
);
